// Replay Mr. Allen's real Sheet export through ScoreTracker_v3.gs (strict mock): every tab seeded as-is, then setup + refresh.
// Usage: node test_real_export.js /path/to/export   (the export holds student names: keep it out of the repo)
const { load } = require('./mockgas');
const { readExport, seed } = require('./load_export');
const assert = (c, m) => { if (!c) { console.error('FAIL:', m); process.exitCode = 1; } else console.log('ok  ', m); };
const file = process.argv[2];
if (!file) { console.error('give the export file'); process.exit(2); }
const G = load(__dirname + '/ScoreTracker_v3.gs');
// 1. an existing v2 Sheet: create the book the way v2 did, then load every tab from the export
const ss = G.SpreadsheetApp.create('Fluency Lab — Student Scores'); G.__props.SHEET_ID = ss.getId();
const tabs = readExport(file);
seed(ss, tabs);
const before = {}; Object.keys(tabs).forEach(t => before[t] = JSON.stringify(ss.getSheetByName(t).data[0]));
const raw = { Scores: ss.getSheetByName('Scores').getLastRow(), Responses: ss.getSheetByName('Responses').getLastRow(),
              Submissions: ss.getSheetByName('Submissions').getLastRow(), 'How I Learn (answers)': ss.getSheetByName('How I Learn (answers)').getLastRow() };
console.log('     seeded tabs:', Object.keys(tabs).join(', '));
// 2. paste v3, run setup (as he will), then the hourly refresh
let err = null;
try { G.setup(); G.refreshReports(); } catch (e) { err = e; console.error(e.stack); }
assert(!err, 'setup + refreshReports run on the real data without errors');
const T = n => ss.getSheetByName(n);
['Scores', 'Responses', 'Submissions', 'How I Learn (answers)', 'Settings'].forEach(t =>
  assert(JSON.stringify(T(t).data[0]) === before[t] && T(t).getLastRow() === raw[t] || t === 'Settings', 'existing tab untouched (same header, same rows): ' + t));
assert(T('Roster').getLastRow() === 63, 'Roster tab created with 62 students');
const sum = T('Summary').data;
assert(sum[0][1] === 'Period', 'Summary has the Period column');
// the student who typed "<First Last> Check Number 2" (found from the data, so no name is written in this public file)
const odd = T('Scores').data.slice(1).map(r => String(r[1])).find(n => /check number/i.test(n));
const who = G.matcher_(ss).resolve(odd).name;
const fe = sum.filter(r => r[0] === who);
console.log('     "… Check Number 2" resolves to a Roster student:', !!G.matcher_(ss).resolve(odd).p, '· Summary rows for them:', fe.length);
assert(odd && who !== G.tidyName_(odd) && fe.length === 1 && !sum.some(r => /Check Number/i.test(r[0])), 'Summary shows ONE row for the student who also typed "… Check Number 2"');
const col = m => sum[0].indexOf(m);
assert(fe[0][1] === 4 && Math.abs(fe[0][col('Integers')] - 0.92) < 0.01 && fe[0][col('Decimals & Percents')] === 0.88 && fe[0][col('Expressions & Order of Operations')] === 1 && fe[0][col('Skills mastered')] === '3 of 8',
       'that student: period 4; the "Check Number 2" Integers 92% merged in → 3 of 8 mastered');
assert(sum.length - 1 >= 62 && sum.slice(1, 63).every(r => r[1] !== ''), 'Summary lists all 62 Roster students first (with periods)');
const periods = sum.slice(1, 63).map(r => r[1]);
assert(periods.every((p, i) => i === 0 || periods[i - 1] <= p), 'Summary sorted by period');
const fp = T('Flashpoint').data;
assert(fp[0][0] === 'Student' && fp.length - 1 >= 62, 'Flashpoint tab built (no Flashpoint rounds in the export yet: all blank)');
const cn = T('Check names').data.slice(3);
console.log('     Check names lists', cn.length, 'typed names not on the Roster');
assert(cn.length >= 1 && cn.every(r => r[1] >= 1 && /Also typed as/.test(r[4])), 'Check names built with counts and the Roster hint');
['Std', 'Read Me', 'Standards', 'Standards (list)', 'Statistics', 'How I Learn (results)'].forEach(t => T(t) && assert(T(t).getLastRow() > 0, 'report built: ' + t));
const hl = T('How I Learn (results)').data.map(r => r.join('|')).join('\n');
assert(/\d+ students \(newest form/.test(hl), 'How I Learn results built: ' + (/(\d+) students/.exec(hl) || [])[0]);
console.log('     Summary (first rows, names hidden):', sum.slice(0, 3).map(r => r.slice(1).join(',')).join(' / '));
console.log(process.exitCode ? 'REPLAY FAILED' : 'REPLAY OK');
