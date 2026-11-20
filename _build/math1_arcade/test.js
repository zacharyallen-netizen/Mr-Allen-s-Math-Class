/* Math 1 Arcade question checks: node _build/math1_arcade/test.js
   Every maker, many times: exactly one right choice, 3+ distinct choices, every wrong one has a note,
   no NaN/undefined, and the right answer re-computed independently where it is a number. */
const fs = require('fs'), vm = require('vm'), path = require('path');
const R = path.join(__dirname, '../../math1/arcade/');
const ctx = { console, Math, Number, String, Date, setTimeout, clearTimeout };
ctx.window = ctx; vm.createContext(ctx);
for (const f of ['m1-arcade.js', 'ns-questions.js', 'di-questions.js', 'ff-questions.js', 'fn-questions.js', 'dd-questions.js', 'fg-questions.js', 'is-questions.js'])
  if (fs.existsSync(R + f)) vm.runInContext(fs.readFileSync(R + f, 'utf8'), ctx, { filename: f });
let bad = 0, total = 0;
function fail(k, msg, q) { if (bad++ < 25) console.log('FAIL', k, msg, q ? JSON.stringify(q.ch.map(c => [c.h, c.ok])) : ''); }
const strip = h => String(h).replace(/<[^>]+>/g, '').replace(/&ensp;/g, ' ').replace(/\s+/g, ' ').trim();
function common(set, k, q) {
  total++;
  const ok = q.ch.filter(c => c.ok);
  if (ok.length !== 1) fail(k, 'right count ' + ok.length, q);
  if (q.ch.length < 3) fail(k, 'only ' + q.ch.length + ' choices', q);
  const hs = q.ch.map(c => strip(c.h)); if (new Set(hs).size !== hs.length) fail(k, 'duplicate choice text', q);
  q.ch.forEach(c => { if (!c.ok && !c.why) fail(k, 'wrong choice with no note', q); });
  const all = q.p + q.hint + q.steps + q.ch.map(c => c.h + c.why).join('');
  if (/NaN|undefined|Infinity|null/.test(all)) fail(k, 'bad text: ' + all.match(/.{0,40}(NaN|undefined|Infinity|null).{0,20}/)[0], q);
  return ok[0];
}
const n = x => (x < 0 ? '−' : '') + Math.abs(x).toLocaleString('en-US', { maximumFractionDigits: 4 });
if (ctx.NSQ) for (const k of Object.keys(ctx.NSQ.MAKERS)) for (let i = 0; i < 3000; i++) {
  const q = ctx.NSQ.make(k), r = common('ns', k, q); if (!r) continue;
  if (typeof q.ans === 'number' && !/^(classify|gR)$/.test(k)) {
    if (!Number.isInteger(q.ans)) fail(k, 'answer not whole: ' + q.ans, q);
    if (!strip(r.h).endsWith(n(q.ans))) fail(k, 'right choice ' + strip(r.h) + ' vs ans ' + q.ans, q);
  }
  const s = q.seq;   // independent checks from the board
  if (s && (k === 'aNext')) { if (q.ans !== s[3] + (s[3] - s[2])) fail(k, 'next term', q); }
  if (s && (k === 'aD')) { if (q.ans !== s[1] - s[0]) fail(k, 'd', q); }
  if (s && /^gNext/.test(k)) { if (Math.abs(q.ans - s[3] * s[3] / s[2]) > 1e-9) fail(k, 'geo next', q); }
  if (s && k === 'gR') { if (Math.abs(q.ans - s[1] / s[0]) > 1e-9 || Math.abs(s[2] / s[1] - q.ans) > 1e-9) fail(k, 'ratio', q); }
  if (s && /^(aN|eBig)$/.test(k)) { const N = +q.p.match(/a<sub>(\d+)<\/sub>\.$/)[1]; if (q.ans !== s[0] + (N - 1) * (s[1] - s[0])) fail(k, 'a_n', q); }
  if (s && k === 'gN') { const N = +q.p.match(/a<sub>(\d+)<\/sub>\.$/)[1]; if (Math.abs(q.ans - s[0] * Math.pow(s[1] / s[0], N - 1)) > 1e-6) fail(k, 'g a_n', q); }
  if (s && k === 'eFindN') { const X = +strip(q.p).match(/value (\S+)\?/)[1].replace('−', '-').replace(/,/g, ''); if (s[0] + (q.ans - 1) * (s[1] - s[0]) !== X) fail(k, 'find n', q); }
  if (k === 'sArith') { const N = +strip(q.p).match(/for (\d+) stations/)[1], d = s[1] - s[0]; let S = 0; for (let j = 0; j < N; j++) S += s[0] + j * d; if (S !== q.ans) fail(k, 'series', q); }
  if (k === 'classify') { const d1 = s[1] - s[0], d2 = s[2] - s[1], d3 = s[3] - s[2], r1 = s[1] / s[0], r2 = s[2] / s[1], r3 = s[3] / s[2];
    const t = (d1 === d2 && d2 === d3) ? 0 : (r1 === r2 && r2 === r3) ? 1 : 2; if (t !== q.ans) fail(k, 'classify', q); }
}
for (const G of ['FNQ', 'DDQ', 'FGQ', 'ISQ']) if (ctx[G]) for (const k of Object.keys(ctx[G].MAKERS)) for (let i = 0; i < 3000; i++) { const q = ctx[G].make(k), r = common(G, k, q); if (r && ctx[G].verify) { const e = ctx[G].verify(q); if (e) fail(k, e, q); } }
if (ctx.DIQ) for (const k of Object.keys(ctx.DIQ.MAKERS)) for (let i = 0; i < 3000; i++) { const q = ctx.DIQ.make(k), r = common('di', k, q); if (r && ctx.DIQ.verify) { const e = ctx.DIQ.verify(q); if (e) fail(k, e, q); } }
function evalEq(eq, x) {   // the equation exactly as students see it, turned back into math
  let s = eq.replace(/^y = /, '').replace(/<sup>2<\/sup>/g, '^2').replace(/\u2212/g, '-').replace(/\u00bd/g, '0.5');
  s = s.replace(/(\d|\))\s*(\(|x)/g, '$1*$2').replace(/(^|[^\d.)x])-\s*(\(|x)/g, '$1-1*$2').replace(/\)\s*\(/g, ')*(');
  s = s.replace(/x\s*\(/g, 'x*(').replace(/\^2/g, '**2');
  return Function('x', 'return ' + s)(x);
}
if (ctx.FFQ) for (const k of Object.keys(ctx.FFQ.MAKERS)) for (let i = 0; i < 3000; i++) {
  const q = ctx.FFQ.make(k), r = common('ff', k, q); if (!r) continue;
  const e = ctx.FFQ.verify(q); if (e) fail(k, e, q);
  for (const x of [-3, 0, 2, 5]) { let v; try { v = evalEq(q.eq, x); } catch (er) { fail(k, 'eq parse ' + q.eq); break; }
    const want = q.f.a * (x - q.f.h) ** 2 + q.f.k; if (Math.abs(v - want) > 1e-9) { fail(k, 'equation text ' + q.eq + ' at x=' + x + ' gives ' + v + ' not ' + want); break; } }
}
console.log(total + ' questions checked, ' + bad + ' problems');
process.exit(bad ? 1 : 0);
