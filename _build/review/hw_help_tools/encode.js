const fs = require('fs');
global.window = {};
const R = '/home/claude/mr-allen-s-math-class/grade8/';
require(R + 'homework/check.js'); require(R + 'homework-check.js');
const h53 = window.HWCheck._t.h53, N = JSON.parse(fs.readFileSync('hw_help_new.json', 'utf8'));
const old = fs.readFileSync(R + 'homework/help.js', 'utf8');
const H0 = (() => { const w = {}; new Function('window', old)(w); return w.HW_HELP; })();
const T = H0.T.slice(); const idx = t => { let i = T.indexOf(t); if (i < 0) { T.push(t); i = T.length - 1; } return i; };
for (const hw in N) for (const n in N[hw]) { const o = N[hw][n]; if (o.h) idx(o.h); if (o.m) idx(o.m); (o.w || []).forEach(t => t && idx(t)); }
const M = T.length, h = {}, m = {}, w = {};
for (const hw in N) for (const n in N[hw]) {
  const o = N[hw][n];
  if (o.h != null) (h[hw] = h[hw] || {})[n] = idx(o.h);
  if (o.m != null) (m[hw] = m[hw] || {})[n] = idx(o.m);
  if (o.w) (w[hw] = w[hw] || {})[n] = o.w.map((t, k) => { if (t == null) return null; const s = parseInt(h53('why|' + hw + '|' + n + '|' + 'ABCDEF'[k]).slice(-7), 16); return (idx(t) + s % M) % M + M * Math.floor(Math.random() * 7); });
}
const head = old.slice(0, old.indexOf('window.HW_HELP'));
fs.writeFileSync(R + 'homework/help.js', head + 'window.HW_HELP = ' + JSON.stringify({ T, h, m, w }) + ';\n');
// round trip: decode with the page's own code and compare
delete require.cache[require.resolve(R + 'homework-check.js')];
global.window = {}; require(R + 'homework/check.js'); require(R + 'homework/help.js'); require(R + 'homework-check.js');
let bad = 0;
for (const hw in N) for (const n in N[hw]) {
  const o = N[hw][n];
  if (o.h && window.HWCheck.hint(hw, n) !== o.h) { bad++; console.log('hint mismatch', hw, n); }
  (o.w || []).forEach((t, k) => { if (t && !(o.right || []).includes('ABCDEF'[k]) && window.HWCheck.whyTap(hw, n, 'ABCDEF'[k]) !== t) { bad++; console.log('note mismatch', hw, n, k); } });
}
console.log('T', M, 'round-trip errors', bad);
