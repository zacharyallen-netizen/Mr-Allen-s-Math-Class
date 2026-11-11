// Checks every Unit EOG Practice answer against Mr. Allen's answer key PDF (EOG_Unit_Practice_Grade8_AnswerKey).
// Run: node _build/eog_units/test_key.js
const fs = require('fs'), vm = require('vm'), path = require('path');
const G = path.join(__dirname, '..', '..', 'grade8', 'eog');
const ctx = {}; ctx.window = ctx; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(G, 'eog-unit.js'), 'utf8'), ctx);
const KEY = {
 v1: { 1: 'C D B A A B 11 13 3/11 C', 2: 'B C C C 36 1/4 A D A 1.2', 3: 'D B B A A 7 C C -6 2', 4: 'A B C B D A 90 C 20 75', 5: 'D A 17 B C B C C 13 24',
       6: 'C D A A B 3 -3 C B 3', 7: 'B A D A 83 C B C 5 84', 8: 'A B D A B C -2 C 2.5 36', 9: 'C A 288 D C B D A 198 9' },
 v2: { 1: 'A C B B A C B A C A', 2: 'B A B B C A B C A C', 3: 'A A A B A C B B C C', 4: 'B A A B B A C C C A', 5: 'A C A C B B B A A C',
       6: 'C A B A B B C A B C', 7: 'A A C A B C B B A C', 8: 'B A B C C A B C A A', 9: 'A A A A C B B C C B' } };
let bad = 0, n = 0;
for (let u = 1; u <= 9; u++) {
  vm.runInContext(fs.readFileSync(path.join(G, 'u' + u + '.js'), 'utf8'), ctx);
  for (const v of ['v1', 'v2']) {
    const qs = ctx.EOGU.data[u][v].parts.filter(p => !p.s5).flatMap(p => p.qs), want = KEY[v][u].split(' ');
    if (qs.length !== 10) { console.log('U' + u, v, 'has', qs.length, 'questions'); bad++; }
    qs.forEach((q, i) => { n++; const w = want[i]; let got;
      if (q.type === 'num') got = q.ans; else got = q.opts.map((o, j) => o.ok ? 'ABCDE'[j] : '').join('');
      const ok = q.type === 'num' ? Math.abs(got - (w.includes('/') ? w.split('/')[0] / w.split('/')[1] : Number(w))) < 1e-9 : got === w;
      if (!ok) { bad++; console.log(`U${u} ${v} #${i + 1} (${q.id}): key ${w}, page ${got}`); }
      if (q.type !== 'num' && q.opts.some(o => !o.ok && !o.why)) { bad++; console.log(q.id, 'a wrong choice has no feedback'); }
      if (v === 'v1' && !q.hint) { bad++; console.log(q.id, 'no hint'); }
      if (v === 'v2' && !q.box) { bad++; console.log(q.id, 'no box'); }
      if (!q.ok) { bad++; console.log(q.id, 'no explanation'); } });
  }
}
// Score 5 questions (grade8/eog/s5.js, Nov 11, 2026) are not in the key PDF: check each has ONE right choice, a reason on
// every wrong choice, an explanation, a Hint (Version 1) or a box (Version 2), and the right number of choices.
vm.runInContext(fs.readFileSync(path.join(G, 's5.js'), 'utf8'), ctx); let s5 = 0; const ids = new Set();
for (let u = 1; u <= 9; u++) for (const v of ['v1', 'v2']) {
  const part = ctx.EOGU.data[u][v].parts.filter(p => p.s5); if (part.length !== 1 || part[0].qs.length !== 2) { bad++; console.log('U' + u, v, 'Score 5 part missing or not 2 questions'); continue; }
  part[0].qs.forEach(q => { s5++; const ok = q.opts.filter(o => o.ok).length, want = v === 'v1' ? 4 : 3;
    if (ids.has(q.id)) { bad++; console.log(q.id, 'id used twice'); } ids.add(q.id);
    if (ok !== 1 || q.opts.length !== want || q.opts.some(o => !o.ok && !o.why) || !q.ok || (v === 'v1' ? !q.hint : !q.box) || q.tag !== 'Score 5') { bad++; console.log(q.id, 'Score 5 question is not complete'); } });
}
console.log('Score 5 questions checked:', s5);
console.log(n, 'questions checked against the key;', bad ? bad + ' problem(s)' : 'all match');
process.exit(bad ? 1 : 0);
