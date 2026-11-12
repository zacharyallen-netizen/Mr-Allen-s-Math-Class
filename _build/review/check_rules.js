/* Automatic checks for Mr. Allen's review rules (_build/review/RULES.md). Run before every push:
     node _build/review/check_rules.js            (exit code 1 = a rule failed; nothing should be published)
   Each check names its rule. Add a check every time Zach reports a problem, so it cannot come back. */
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..', '..');
const fails = [];
const fail = (rule, where, what) => fails.push(`${rule}  ${where}: ${what}`);

/* B2: a homework choice with 2+ values must say what each value is (Zach, Nov 12, 2026).
   Unlabeled = two or more numbers (not inside an ordered pair) joined by "and" / "," / ";" with no "=" or ":" label,
   unless the question asks for an ORDER, a "between", or select-all of number sets (those lists are the answer itself). */
{
  global.window = {};
  require(path.join(ROOT, 'grade8/homework/choices.js'));
  const MC = window.HW_MC;
  for (const hw in MC) for (const n in MC[hw]) {
    const e = MC[hw][n], cs = Array.isArray(e) ? e : e && e.c, q = (e && e.q) || '';
    if (!Array.isArray(cs)) continue;
    if (/order|least|greatest|between|Tap ALL|consecutive|side lengths make|Which set/i.test(q)) continue;
    cs.forEach((c, i) => {
      const t = typeof c === 'string' ? c : (c && c.t) || '';
      if (!t || /[=:<>≤≥≈]/.test(t)) return;   // a relation sign or a colon labels the value
      const bare = t.replace(/(\d),(\d{3})/g, '$1$2').replace(/\([^)]*\)/g, ' P ').replace(/\{[^}]*\}/g, ' S ');
      const nums = bare.match(/−?\d+(\.\d+)?(\/\d+)?°?/g) || [];
      if (nums.length >= 2 && /\band\b|,|;/.test(bare) && !/[a-z]{3,}/i.test(bare.replace(/\band\b/g, ''))) fail('B2', `HW ${hw} #${n} choice ${'ABCDEF'[i]}`, `"${t}" does not say what each value is`);
    });
  }
}

/* A3/C2 machinery present: the step-by-step tool lines moves up and has the no-loop coach. */
{
  const sw = fs.readFileSync(path.join(ROOT, 'grade8/step-work.js'), 'utf8');
  for (const [rule, needle, what] of [['A3', 'function alignSide', 'moves under matching like terms'], ['A2', 'function alignTrail', 'lined-up written solutions'],
       ['C2', 'function nextMove', 'next good move after repeated misses'], ['C2', "Show me this step", 'way forward after the 3rd miss'], ['C4', 'swHelped', '"(used step help)" record']])
    if (!sw.includes(needle)) fail(rule, 'grade8/step-work.js', `missing ${what}`);
}

/* E4: no made-up NC standard codes. */
{
  const bad = /NC\.8\.G\.1\b/;
  for (const f of fs.readdirSync(path.join(ROOT, 'grade8'))) {
    if (!/\.(html|js)$/.test(f)) continue;
    const t = fs.readFileSync(path.join(ROOT, 'grade8', f), 'utf8');
    if (bad.test(t)) fail('E4', 'grade8/' + f, 'uses NC.8.G.1 (not a real NC standard; use NC.8.G.2)');
  }
}

if (fails.length) { console.log(fails.length + ' rule check(s) FAILED:\n' + fails.join('\n')); process.exit(1); }
console.log('All rule checks passed.');
