// Test the "How I Learn Math" questionnaire path of ScoreTracker_v3.gs against the strict mock.
const { load } = require('./mockgas');
const assert = (c, m) => { if (!c) { console.error('FAIL:', m); process.exitCode = 1; } else console.log('ok  ', m); };
const G = load(__dirname + '/ScoreTracker_v3.gs');
const post = d => JSON.parse(G.doPost({ postData: { contents: JSON.stringify(d) } }).s);
G.setup();
const ss = Object.values(G.__books)[0];
assert(!!ss.getSheetByName('How I Learn (answers)') && !!ss.getSheetByName('How I Learn (results)'), 'survey tabs created by setup');
const L = {}; ['m1','m2','m3','m4','m5','m6','h7','h8','h9','h10','h11'].forEach((k, i) => L[k] = (i % 4) + 1);
const base = { code: 'allen-8th', kind: 'survey', name: 'ana ruiz', period: '2', likert: L,
  barriers: ['b1', 'b2', 'bo'], barrierOther: 'too fast', helps: ['s1', 's3', 's14'], ask: 'card', open: ['when we drew it', 'skip it', 'check in'] };
let r = post(base); assert(r.ok && r.name === 'Ana Ruiz', 'good form accepted');
assert(!post(Object.assign({}, base, { barriers: ['b1', 'b2'] })).ok, 'only 2 picks in Part 3 rejected');
assert(!post(Object.assign({}, base, { helps: ['s1', 's2', 's3', 's4'] })).ok, '4 picks in Part 4 rejected');
assert(!post(Object.assign({}, base, { barrierOther: '' })).ok, 'Other picked but empty rejected');
assert(!post(Object.assign({}, base, { likert: Object.assign({}, L, { h9: 0 }) })).ok, 'missing scale answer rejected');
assert(!post(Object.assign({}, base, { name: 'Ana' })).ok, 'first name only rejected');
assert(!post(Object.assign({}, base, { ask: 'shout' })).ok, 'bad ask rejected');
assert(!post(Object.assign({}, base, { code: 'x' })).ok, 'wrong class code rejected');
assert(post(Object.assign({}, base, { open: [] })).ok, 'written answers optional');
// a class of 20
for (let i = 0; i < 20; i++) {
  const l = {}; Object.keys(L).forEach((k, j) => l[k] = ((i + j) % 4) + 1);
  post({ code: 'allen-8th', kind: 'survey', name: 'Student ' + String.fromCharCode(65 + i) + ' Test', period: String(1 + i % 3), likert: l,
         barriers: ['b' + (1 + i % 9), 'b' + (1 + (i + 3) % 9), 'b' + (1 + (i + 5) % 9)], helps: ['s' + (1 + i % 14), 's' + (1 + (i + 4) % 14), 's15'], ask: ['raise', 'card', 'note', 'after', 'friend'][i % 5], open: ['a', 'b', 'c'] });
}
const ans = ss.getSheetByName('How I Learn (answers)').data;
assert(ans.length === 1 + 22, 'answers: header + 22 rows (Ana twice + 20)');
const res = ss.getSheetByName('How I Learn (results)').data.map(r => r.join(' | '));
assert(/21 students/.test(res[1]), 'results count newest form per student (21)');
const flat = res.join('\n');
assert(flat.includes('Breaking a problem into smaller parts') && flat.includes('SPARKLINE'), 'ranked picks with bars');
assert(flat.includes('Student support profiles') && flat.includes('Ana Ruiz'), 'profiles listed');
assert(flat.includes('"Other" answers: Ana Ruiz: too fast'), 'Other answers shown');
// fluency + evidence still fine
assert(post({ code: 'allen-8th', name: 'maria lopez', module: 'Fractions', score: 9, total: 10 }).ok, 'fluency still works');
console.log(res.slice(0, 22).join('\n'));
