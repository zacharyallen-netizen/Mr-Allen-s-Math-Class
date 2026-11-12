// every note that makes a specific claim about a wrong choice must be TRUE for that choice; otherwise use the problem's common-mistakes note
const fs = require('fs'); const D = JSON.parse(fs.readFileSync('hw_help_new.json', 'utf8'));
const nums = s => (String(s).replace(/[−-]\s*/g, '-').match(/-?\d+(\.\d+)?(\/\d+)?/g) || []).map(t => t.includes('/') ? eval(t) : Number(t));
const pair = s => { const m = String(s).replace(/−/g, '-').match(/\((-?[\d.]+),\s*(-?[\d.]+)\)/); return m ? [+m[1], +m[2]] : null; };
const close = (a, b) => Math.abs(a - b) < 0.06 * Math.max(1, Math.abs(b));
const CLAIMS = [
  [/dividing by 2 instead of finding the square root/, (w, r) => { const a = nums(w), b = nums(r); return a.some(x => b.some(y => close(2 * x, y))); }],
  [/stopped one step early|Take the square root at the end\.$/, (w, r, o) => { if (!/hypotenuse|right triangle|leg|ladder|diagonal|distance|a² \+ b²|square/i.test(o.text + ' ' + (o.q || ''))) return false; const a = nums(w), b = nums(r); return a.some(x => b.some(y => close(x, y * y))); }],
  [/^Common mistake: making vertical angles add to 180/, () => false],
  [/^The order is switched/, (w, r) => { const a = pair(w), b = pair(r); return a && b && a[0] === b[1] && a[1] === b[0] && a[0] !== a[1]; }],
  [/^Check your sign\. The number is right/, (w, r) => { const a = nums(w), b = nums(r); return a.length && a.length === b.length && a.every((v, i) => v === -b[i]); }],
  [/adding the scale factor|ADDING the scale factor|A dilation MULTIPLIES/, (w, r, o) => /dilat|scale factor|k =/i.test(o.text + ' ' + (o.q || '')) && !/congruent|similar/i.test(o.q || '')],
  [/^Check the radius\. Square it|^You doubled the radius|^Square the radius first|HALF the diameter\. Then square/, (w, r, o) => !/sphere|hemisphere/i.test(o.text)],
  [/^You switched them\. The slope is the number WITH x/, (w, r) => { const a = nums(w), b = nums(r); return a.length >= 2 && b.length >= 2 && a[0] === b[1] && a[1] === b[0]; }],
];
const TX = require('./hw_text.json');
const CONG = 'Common mistakes: calling figures congruent after a dilation (a dilation changes the size, so they are only similar), and mixing up the order of the moves.'; let fixed = 0; const log = [];
for (const hw in D) for (const n in D[hw]) {
  const o = D[hw][n]; if (!o.w || !o.right || o.right.length !== 1) continue;
  const ri = 'ABCDEF'.indexOf(o.right[0]), r = o.choices[ri]; o.text = (TX[hw] || {})[n] || '';
  o.w.forEach((t, i) => {
    if (i === ri || !t) return;
    for (const [re, ok] of CLAIMS) if (re.test(t) && !ok(o.choices[i], r, o)) { log.push(`${hw} #${n} ${'ABCDEF'[i]} "${o.choices[i]}": "${t.slice(0, 45)}" → common mistakes`); const tpHelp = () => { const T = require('./topics.js'); const tp = T.probTopic(hw, n, o.q, o.choices); return tp && T.HELP[tp] ? T.HELP[tp][1] : null; };
      let sub0 = /^Common mistake: making vertical angles add to 180/.test(t) ? 'Common mistake: mixing up "equal" and "add to 180°". Vertical, corresponding and alternate angles are EQUAL. A straight line and same-side interior angles add to 180°.' : null;
      const sub = sub0 ? sub0 : /scale factor|MULTIPLIES/.test(o.m || '') && /congruent|similar|sequence|maps|translate|rotate|reflect/i.test(o.q + ' ' + o.choices.join(' ')) ? CONG : (o.m && o.m !== t ? o.m : (tpHelp() || o.m || t)); const sub2 = re.test(sub) ? (hw[0] === '5' ? require('./topics.js').HELP.pyth[1] : 'Check each step. Look for a sign error or a copying error.') : sub; o.w[i] = sub2; if (re.test(o.m || '')) o.m = sub2; if (/scale factor/.test(o.m || '') && sub === CONG) { o.m = CONG; } fixed++; break; }
  });
  delete o.text;
}
fs.writeFileSync('hw_help_new.json', JSON.stringify(D, null, 1));
console.log(log.join('\n')); console.log('claims fixed:', fixed);
