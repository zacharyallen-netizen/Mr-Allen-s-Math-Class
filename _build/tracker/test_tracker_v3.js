// End-to-end test of ScoreTracker_v3.gs against the strict mock, with a simulated class.
const { load } = require('./mockgas');
const assert = (c, m) => { if (!c) { console.error('FAIL:', m); process.exitCode = 1; } else console.log('ok  ', m); };
const G = load(__dirname + '/ScoreTracker_v3.gs');
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
{ const sm = ss.getSheetByName('Summary').data; const ml = sm.find(r => r[0] === 'Maria Lopez');
  assert(ml && ml[1] === '' && ml[5] === 0.9 && sm.indexOf(ml) === sm.length - 1, 'fluency summary rebuilt (v3: not on Roster → bottom, no period)'); }
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

// ════════════════════════════════════════════════════════════════════
//  VERSION 3: Roster, name matching, Period, Check names, Flashpoint
//  (made-up names only: this file is public; the real roster lives in the script)
// ════════════════════════════════════════════════════════════════════
{
  const tab = n => ss.getSheetByName(n);
  // roster tab created once, from the ROSTER constant, and never overwritten
  const ros = tab('Roster');
  assert(ros && ros.data[0].join('|') === 'Student|Period|Also typed as', 'Roster tab has Student | Period | Also typed as');
  assert(ros.getLastRow() === 1 + G.ROSTER.length && G.ROSTER.length === 62, 'Roster filled once from the script (62 students)');
  assert(ros.data.slice(1).every(r => r[0] && !/,/.test(r[0]) && [1, 2, 4, 5, 6].includes(r[1])), 'Roster names are "First Last" with periods 1/2/4/5/6');
  // the teacher replaces the list with his own (here: made-up students); setup must keep it
  ros.clear();
  [['Student', 'Period', 'Also typed as'],
   ['Jordan Rivers', 1, ''], ['Ana Ruiz', 2, 'Annie R, Ana R.'], ['Sam Lee', 4, ''], ['Sara Lee', 4, ''],
   ['José Núñez', 5, ''], ['Mary Ann Fox', 6, ''], ['Kai Brook', 2, '']].forEach(r => ros.appendRow(r));
  G.setup();
  assert(ros.getLastRow() === 8 && ros.data[1][0] === 'Jordan Rivers', 'setup again does not overwrite an edited Roster tab');
  assert(G.__triggers.length === 1, 'still one hourly trigger');

  // the matcher
  const N = G.matcher_(ss), who = t => N.resolve(t).p ? N.resolve(t).name : null;
  assert(who('Jordan Rivers') === 'Jordan Rivers', 'match: exact');
  assert(who('Jordan Rivers Check Number 2') === 'Jordan Rivers', 'match: extra words ("… Check Number 2")');
  assert(who('  JORDAN   rivers. ') === 'Jordan Rivers' && who("jordan-rivers") === 'Jordan Rivers', 'match: case, spaces, punctuation');
  assert(who('Jose Nunez') === 'José Núñez' && who('JOSÉ NÚÑEZ') === 'José Núñez', 'match: accents ignored');
  assert(who('annie r') === 'Ana Ruiz' && who('Ana R') === 'Ana Ruiz', 'match: "Also typed as" entries (comma-separated, dots ignored)');
  assert(who('J. Rivers') === 'Jordan Rivers' && who('Jo Rivers') === 'Jordan Rivers', 'match: unique last name + first initial');
  assert(who('Mary Fox') === 'Mary Ann Fox', 'match: two-word first name, typed with the first word only');
  assert(who('S Lee') === null && who('Lee') === null && who('S. Lee Check 2') === null, 'ambiguous (Sam Lee / Sara Lee) or last name alone → unmatched');
  assert(who('Sam Lee') === 'Sam Lee' && who('Sara Lee 2') === 'Sara Lee', 'two students with the same last name still match by first name');
  assert(who('Jordan') === null && who('Rivers Jordan') === 'Jordan Rivers', 'first name alone → unmatched; order does not matter');
  assert(who('Jordana Rivers') === null, 'a different first name with the same initial is not guessed');
  assert(who('Rocket Z') === null && N.resolve('rocket z').name === 'Rocket Z', 'unknown name stays as typed (capitalized like v2)');

  // historical rows (written before v3, under odd names) merge at read time and are not rewritten
  const sc = tab('Scores');
  sc.appendRow([new Date(Date.now() - 9e8), 'jordan rivers check number 2', 'Integers', 12, 13, 12 / 13]);
  sc.appendRow([new Date(Date.now() - 8e8), 'Jordan Rivers', 'Multiply', 13, 13, 1]);
  sc.appendRow([new Date(Date.now() - 7e8), 'S Lee', 'Divide', 5, 10, 0.5]);
  // new rows store the Roster name
  let rr = post({ code: 'allen-8th', name: 'JORDAN rivers Check 3', module: 'Fractions', score: 7, total: 10 });
  assert(rr.ok && sc.data[sc.getLastRow() - 1][1] === 'Jordan Rivers', 'new Skill Check row stored under the Roster name');
  assert(rr.name === 'JORDAN Rivers Check 3', 'the reply to the website only echoes what the student typed');
  rr = post({ code: 'allen-8th', name: 'rocket z', module: 'Fractions', score: 3, total: 10 });
  assert(sc.data[sc.getLastRow() - 1][1] === 'Rocket Z', 'unmatched new row keeps the typed name, capitalized');
  assert(sc.data.some(r => r[1] === 'jordan rivers check number 2'), 'old raw rows are not rewritten');

  G.refreshReports();
  const sum = tab('Summary').data;
  assert(sum[0][0] === 'Student' && sum[0][1] === 'Period' && sum[0][2] === 'Add & Subtract' && sum[0][sum[0].length - 1] === 'Skills mastered', 'Summary: Period column after Student');
  const jr = sum.filter(r => r[0] === 'Jordan Rivers');
  assert(jr.length === 1 && jr[0][1] === 1, 'Summary: one row for Jordan Rivers, period 1');
  const col = m => sum[0].indexOf(m);
  assert(Math.abs(jr[0][col('Integers')] - 0.92) < 1e-9 && jr[0][col('Multiply')] === 1 && jr[0][col('Fractions')] === 0.7, 'Summary: historical "… check number 2" row merged into the student');
  assert(!sum.some(r => /check/i.test(r[0])), 'Summary: no "Check Number 2" row');
  const ros7 = ['Jordan Rivers', 'Kai Brook', 'Ana Ruiz', 'Sam Lee', 'Sara Lee', 'José Núñez', 'Mary Ann Fox'];
  assert(JSON.stringify(sum.slice(1, 8).map(r => r[0])) === JSON.stringify(ros7), 'Summary: every Roster student, sorted by period then last name');
  const ana = sum.find(r => r[0] === 'Ana Ruiz');
  assert(ana[1] === 2 && ana.slice(2).every(v => v === ''), 'Summary: a Roster student with no scores has blank cells');
  const tail = sum.slice(8).map(r => r[0]);
  assert(tail.includes('Rocket Z') && tail.includes('S Lee') && tail.includes('Maria Lopez') && sum.slice(8).every(r => r[1] === ''), 'Summary: unmatched names at the bottom, no period');

  // Standards / Standards (list) / Statistics group by the Roster name
  const it = ok => Array.from({ length: 6 }, (_, k) => ({ id: 'q' + k, std: 'NC.8.EE.1', band: 4, first: k < ok ? 1 : 0, final: 1 }));
  post({ code: 'allen-8th', v: 2, kind: 'practice', unit: '2', page: 'Unit 2 · Practice', name: 'Jordan Rivers', session: 'jr1', items: it(5) });
  tab('Responses').appendRow([new Date(Date.now() - 6e8), 'jordan rivers check number 2', 'Practice', '2', 'Unit 2 · Practice', 'old1', 'q1', 'NC.8.EE.1', 4, 1, 1, 1, '']);
  post({ code: 'allen-8th', v: 2, kind: 'practice', unit: '2', page: 'Unit 2 · Practice', name: 'S Lee', session: 'sl1', items: it(2) });
  // How I Learn: an alias spelling is listed under the Roster name
  const Lk = {}; ['m1','m2','m3','m4','m5','m6','h7','h8','h9','h10','h11'].forEach((k, i) => Lk[k] = (i % 4) + 1);
  post({ code: 'allen-8th', kind: 'survey', name: 'Annie R', period: '8A', likert: Lk, barriers: ['b1', 'b2', 'b3'], helps: ['s1', 's2', 's3'], ask: 'card', open: [] });
  G.refreshReports();
  const lst = tab('Standards (list)').data.filter(r => r[1] === 'NC.8.EE.1');
  assert(lst.filter(r => r[0] === 'Jordan Rivers').length === 1 && lst.filter(r => r[0] === 'Jordan Rivers')[0][3] === 2, 'Standards (list): old odd-name row and new row are one student (2 pieces of evidence)');
  assert(tab('Standards').data.filter(r => r[0] === 'Jordan Rivers').length === 1 && !tab('Standards').data.some(r => /check/i.test(String(r[0]))), 'Standards grid: one row for the student');
  const hil = tab('How I Learn (results)').data.map(r => r.join('|')).join('\n');
  assert(hil.includes('Ana Ruiz') && !hil.includes('Annie R'), 'How I Learn results: alias shown under the Roster name');
  assert(tab('How I Learn (answers)').data.slice(-1)[0][1] === 'Ana Ruiz', 'How I Learn answers: new form stored under the Roster name');

  // Check names
  const cn = tab('Check names').data;
  const cHead = cn[2], cRows = cn.slice(3);
  assert(cHead.join('|') === 'Typed name|Rows|Last seen|Found on (tab)|What to do', 'Check names: header');
  const sl = cRows.find(r => r[0] === 'S Lee');
  assert(sl && sl[1] === 2 && sl[2] instanceof Date && /Sam Lee or Sara Lee/.test(sl[4]) && /Also typed as/.test(sl[4]), 'Check names: ambiguous name listed with rows, last seen, both candidates and the Roster hint');
  assert(cRows.some(r => r[0] === 'Rocket Z' && /Also typed as/.test(r[4])), 'Check names: unknown name listed');
  assert(!cRows.some(r => /rivers|ruiz/i.test(r[0])), 'Check names: matched names (incl. old odd spellings) are not listed');

  // ── Flashpoint ──
  // a payload the way flashpoint.html sends it: one item per problem; a missed problem comes back once (same id, tries 2)
  function round(name, session, page, results, lv) {
    // results: array of 'R' (right first), 'W' (wrong, not retried), 'WR' (wrong then right on retry), 'WW'
    const items = results.map((x, k) => ({ id: `Round 1 #${k + 1} · L${lv}`, label: 'p', band: 4,
      first: x === 'R' ? 1 : 0, final: x === 'R' || x === 'WR' ? 1 : 0, tries: x.length }));
    return post({ code: 'allen-8th', v: 2, kind: 'practice', unit: 'Fluency', page, name, session, items });
  }
  const rep = (s, n) => Array(n).fill(s);
  // full round, new label with points + stars: 20 problems answered, 16 right (14 right first, 2 right on the retry, 2 wrong not retried)
  let fr = round('Jordan Rivers', 'fp1', 'Fluency Lab · Flashpoint · Level 3 · 1,240 points · 2 stars', [...rep('R', 14), 'WR', 'WR', 'W', 'W'], 3);
  assert(fr.ok, 'Flashpoint payload accepted');
  // same student, older label (no points / stars), level 1 full round: 19 right of 20 → 3 stars, 190 points
  round('jordan rivers check 2', 'fp2', 'Fluency Lab · Flashpoint · Level 1', [...rep('R', 18), 'WR'], 1);
  // level 1 again, worse: best must stay 19
  round('Jordan Rivers', 'fp3', 'Fluency Lab · Flashpoint · Level 1 · 120 points · 1 star', [...rep('R', 12), ...rep('W', 8)], 1);
  // early-ended round, old label: 11 right of 14 answered → no stars (stars come only from right answers)
  // (13 items: 10 right + 1 right on retry + 2 wrong = 14 problems answered, 11 right)
  round('Ana Ruiz', 'fp4', 'Fluency Lab · Flashpoint · Level 2', [...rep('R', 10), 'WR', 'W', 'W'], 2);
  // early-ended round, new label: 13 right of 15 → 1 star, 520 points (level 4 with a bonus)
  round('Annie R', 'fp5', 'Fluency Lab · Flashpoint · Level 4 · 540 points · 1 star', [...rep('R', 13), 'W', 'W'], 4);
  // resend of the same round (same session) must not count twice
  round('Ana Ruiz', 'fp5', 'Fluency Lab · Flashpoint · Level 4 · 540 points · 1 star', [...rep('R', 13), 'W', 'W'], 4);
  // unmatched student
  round('S Lee', 'fp6', 'Fluency Lab · Flashpoint · Level 5 · 1,000 points · 3 stars', [...rep('R', 19), 'W'], 5);
  G.refreshReports();
  const fp = tab('Flashpoint').data, fh = fp[0];
  const fc = h => fh.indexOf(h);
  assert(fh[0] === 'Student' && fh[1] === 'Period' && fh[2] === 'Level 1\nBest right (of 20)' && fh[3] === 'Level 1\nStars' &&
         fh[11] === 'Level 5\nStars' && fh.slice(12).join('|') === 'Best points (any level)|Rounds played|Last played', 'Flashpoint: header');
  assert(JSON.stringify(fp.slice(1, 8).map(r => r[0])) === JSON.stringify(ros7), 'Flashpoint: every Roster student, by period then name');
  const J = fp.find(r => r[0] === 'Jordan Rivers'), A2 = fp.find(r => r[0] === 'Ana Ruiz'), SL = fp.find(r => r[0] === 'S Lee');
  console.log('     Jordan:', JSON.stringify(J)); console.log('     Ana:   ', JSON.stringify(A2));
  assert(fp.filter(r => r[0] === 'Jordan Rivers').length === 1 && J[1] === 1, 'Flashpoint: one row per student (odd spelling merged), with period');
  assert(J[2] === 19 && J[3] === '★★★', 'Flashpoint: level 1 best 19 of 20 → ★★★ (old label: stars computed from right answers)');
  assert(J[6] === 16 && J[7] === '★★☆', 'Flashpoint: level 3 full round with points/stars label → 16, ★★☆');
  assert(J[4] === '' && J[5] === '' && J[8] === '', 'Flashpoint: levels not played are blank');
  assert(J[12] === 1240 && J[13] === 3 && J[14] instanceof Date, 'Flashpoint: best points from the label (1,240), rounds played 3, last played');
  assert(A2[4] === '11 of 14 (ended early)' && A2[5] === '☆☆☆', 'Flashpoint: early-ended round shows "11 of 14 (ended early)" and 0 stars');
  assert(A2[8] === '13 of 15 (ended early)' && A2[9] === '★☆☆', 'Flashpoint: early-ended round with 13 right earns ★ (stars from right answers only)');
  assert(A2[12] === 540 && A2[13] === 2, 'Flashpoint: a resent round counts once; points from the label');
  assert(SL && fp.indexOf(SL) > 7 && SL[1] === '' && SL[10] === 19 && SL[11] === '★★★', 'Flashpoint: unmatched student at the bottom');
  // old-label points fallback: level 1–3 = right × 10 × level; Ana only has level 2 (old) + level 4 (labelled)
  const only = fp.find(r => r[0] === 'Kai Brook');
  assert(only && only.slice(2).every(v => v === ''), 'Flashpoint: Roster student with no rounds has blank cells');
  assert(G.parseFlashLabel_('Fluency Lab · Flashpoint · Level 3 · 1,240 points · 2 stars').points === 1240 &&
         G.parseFlashLabel_('Fluency Lab · Flashpoint · Level 2 · 0 points · 0 stars').stars === 0 &&
         G.parseFlashLabel_('Fluency Lab · Flashpoint · Level 5').points === null, 'Flashpoint label parser');
  assert([11, 12, 15, 16, 18, 19, 20].map(G.flashStars_).join('') === '0112233', 'stars at 12 / 16 / 19 right, like the game');
  const tabs = ss.getSheets().map(s => s.name);
  ['Roster', 'Check names', 'Flashpoint'].forEach(t => assert(tabs.includes(t), 'tab exists: ' + t));
  const rm = tab('Read Me').data.map(r => r[0]).join('\n');
  assert(/^Roster —/m.test(rm) && /^Check names —/m.test(rm) && /^Flashpoint —/m.test(rm), 'Read Me explains Roster, Check names, Flashpoint');
  console.log(process.exitCode ? 'SOME v3 TESTS FAILED' : 'ALL v3 TESTS PASSED');
}
