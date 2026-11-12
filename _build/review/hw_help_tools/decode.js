// decode every homework hint (h), common-mistakes (m) and per-choice note (w) into plain JSON
global.window = {};
const R = '/home/claude/mr-allen-s-math-class/grade8/';
require(R + 'homework/choices.js'); require(R + 'homework/check.js'); require(R + 'homework/help.js'); require(R + 'homework-check.js');
const H = window.HW_HELP, MC = window.HW_MC, h53 = window.HWCheck._t.h53, M = H.T.length;
const out = {};
for (const hw in MC) for (const n in MC[hw]) {
  const e = MC[hw][n], cs = Array.isArray(e) ? e : e && e.c, o = { q: (e && e.q) || '', choices: Array.isArray(cs) ? cs.map(c => typeof c === 'string' ? c : (c.t || c.d || '[graph]')) : e };
  o.h = H.h[hw] && H.h[hw][n] != null ? H.T[H.h[hw][n]] : null;
  o.m = H.m[hw] && H.m[hw][n] != null ? H.T[H.m[hw][n]] : null;
  const a = H.w[hw] && H.w[hw][n];
  if (a) o.w = a.map((v, k) => v == null ? null : H.T[(((v - parseInt(h53('why|' + hw + '|' + n + '|' + 'ABCDEF'[k]).slice(-7), 16) % M) % M) + M) % M]);
  o.right = Array.isArray(cs) || e === 4 ? 'ABCDEF'.split('').slice(0, Array.isArray(cs) ? cs.length : 4).filter(L => window.HWCheck.tap(hw, n, L)) : null;
  (out[hw] = out[hw] || {})[n] = o;
}
require('fs').writeFileSync('/home/claude/fix/hw_help_decoded.json', JSON.stringify(out, null, 1));
console.log('T entries', M, 'homeworks', Object.keys(out).length);
