const fs = require('fs');
const dir = '/home/claude/mr-allen-s-math-class/grade8/';
const scratch = '/home/claude/mr-allen-s-math-class/_build/eog3/';
const grab = (src) => { const a = src.indexOf('const questions = ['); const b = src.indexOf('\n    ];', a); return { a, b: b + 7, arr: eval(src.slice(a + 'const questions = '.length, b + 6)) }; };
const neu = grab(fs.readFileSync(dir + 'eog_math_review_game.html', 'utf8')).arr;
let old = fs.readFileSync(dir + 'Grade_8_Math_Review_Quest.html', 'utf8');
const o = grab(old);
const SELF = [1, 4, 7, 11, 12, 14, 15, 17, 19, 22, 25, 27, 31, 33, 37, 41, 43, 21];
const fix = t => t
  .replace(/ - /g, ' − ').replace(/\(-/g, '(−').replace(/,-/g, ',−').replace(/, -/g, ', −').replace(/ -(\d)/g, ' −$1')
  .replace(/x x 10/g, 'x × 10').replace(/25 x 4/g, '25 × 4').replace(/\(¹⁄₃\)pi r² h/g, 'V = (¹⁄₃)πr²h');
const out = o.arr.map(q => {
  const n = neu.find(z => z.n === q.n);
  let r;
  if (SELF.includes(q.n)) r = { n: q.n, type: n.type, standard: n.standard, topic: n.topic, dok: n.dok, page: n.page, answer: n.answer, prompt: n.prompt, choices: n.choices, hint: n.hint };
  else { r = { ...q }; delete r.source; r.prompt = fix(r.prompt); r.hint = fix(r.hint); if (r.choices) for (const k in r.choices) r.choices[k] = fix(r.choices[k]); }
  if (!r.choices) delete r.choices;
  // sanity: keys must agree with the main game
  if (String(r.answer) !== String(n.answer)) console.log('KEY MISMATCH', q.n, r.answer, n.answer);
  if (r.type === 'mc' && JSON.stringify(Object.keys(r.choices)) !== '["A","B","C","D"]') console.log('choices?', q.n);
  return r;
});
const ser = q => '{' + Object.entries(q).map(([k, v]) => k + ':' + JSON.stringify(v)).join(',') + '}';
old = old.slice(0, o.a) + 'const questions = [\n      ' + out.map(ser).join(',\n      ') + '\n    ];' + old.slice(o.b);
fs.writeFileSync(dir + 'Grade_8_Math_Review_Quest.html', old);
// list remaining hyphen-minus in displayed text
out.forEach(q => { const t = [q.prompt, q.hint, ...Object.values(q.choices || {})].join(' | '); if (/-\d|\(-| - /.test(t)) console.log('hyphen?', q.n, t); });
