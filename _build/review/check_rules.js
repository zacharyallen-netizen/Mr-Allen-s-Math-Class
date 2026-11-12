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

/* A7: the lined-up redraw of written solutions stays OFF until it passes a check on every solution (review, Nov 12, 2026). */
{
  const fx = fs.readFileSync(path.join(ROOT, 'student-fx.js'), 'utf8');
  if (/aligned-steps\.js\?v=/.test(fx)) fail('A7', 'student-fx.js', 'loads aligned-steps.js again before it passed the every-solution check');
  const sw = fs.readFileSync(path.join(ROOT, 'grade8/step-work.js'), 'utf8');
  if (!/piPart\(inv\)/.test(sw)) fail('A5', 'grade8/step-work.js', 'trail can show the hidden π stand-in (113/355) instead of ÷ kπ');
}

/* E1/C1/B4 (review Nov 12, 2026): homework help must fit the problem.
   - sphere problems never get "square the radius" notes; cube problems never get the cylinder hint
   - "The order is switched" only when the choice really is the right point with x and y switched
   - no note blames "making vertical angles add to 180" (it named the wrong mistake) */
{
  const W = {}; const load = f => new Function('window', fs.readFileSync(path.join(ROOT, f), 'utf8'))(W);   // fresh copies every run (no require cache)
  ['grade8/homework/choices.js', 'grade8/homework/check.js', 'grade8/homework/help.js', 'grade8/homework-check.js'].forEach(load);
  const window = W; let checked = 0;
  const MC = window.HW_MC, HC = window.HWCheck, TX = require(path.join(__dirname, 'hw_problem_text.json'));
  const pair = s => { const m = String(s).replace(/−/g, '-').match(/\((-?[\d.]+),\s*(-?[\d.]+)\)/); return m ? [+m[1], +m[2]] : null; };
  for (const hw in MC) for (const n in MC[hw]) {
    const e = MC[hw][n], cs = Array.isArray(e) ? e : e && e.c, text = ((TX[hw] || {})[n] || '') + ' ' + ((e && e.q) || ''), hint = HC.hint(hw, n);
    if (/cube-shaped|a cube has|the cube has/i.test(text) && /Cylinder/.test(hint)) fail('E1', `HW ${hw} #${n}`, 'cube problem has the cylinder hint');
    if (!Array.isArray(cs)) continue;
    const right = 'ABCDEF'.split('').slice(0, cs.length).filter(L => HC.tap(hw, n, L)); checked++;
    cs.forEach((c, i) => {
      const L = 'ABCDEF'[i]; if (right.includes(L)) return;
      const note = HC.whyTap(hw, n, L) || '', t = typeof c === 'string' ? c : (c.t || '');
      if (/sphere|hemisphere/i.test(text) && /Square it \(r × r\)|HALF the diameter\. Then square|You doubled the radius/.test(note)) fail('E1', `HW ${hw} #${n} ${L}`, 'sphere note says to square the radius');
      if (/making vertical angles add to 180/.test(note)) fail('C1', `HW ${hw} #${n} ${L}`, 'note blames a mistake the student may not have made');
      if (/^The order is switched/.test(note) && right.length === 1) { const a = pair(t), r = pair(typeof cs['ABCDEF'.indexOf(right[0])] === 'string' ? cs['ABCDEF'.indexOf(right[0])] : ''); if (!(a && r && a[0] === r[1] && a[1] === r[0])) fail('C1', `HW ${hw} #${n} ${L}`, '"order is switched" on a choice that is not switched'); }
    });
  }
  if (checked < 400) fail('B4', 'check_rules.js', 'homework help check did not load the homework (' + checked + ' tap problems)');
}
/* (the homework check above must have looked at the problems) */
/* C1: practice/notes/pre-test help picks the right topic for these known questions (tap-answers.js HINTS order). */
{
  global.window = {}; global.document = { createElement: () => ({}), head: { appendChild() {} }, querySelector: () => null, getElementById: () => null };
  delete require.cache[require.resolve(path.join(ROOT, 'grade8/tap-answers.js'))]; require(path.join(ROOT, 'grade8/tap-answers.js'));
  const T = window.TapAnswers;
  for (const [q, want] of [['Estimate √30 (Hint: 25 < 30 < 36)', /perfect squares/], ['A 25-ft ladder slides down a wall. How far is the base from the wall?', /a² \+ b²/],
       ['A baseball diamond is a square with 90-ft sides. How far from home plate to second base?', /a² \+ b²/], ['A can holds 72π in³ and has radius 3 in. How tall is it?', /Cylinder/],
       ['Solve: 3x + 2 > 11', /flip the sign/], ['Of the 50 adults, what percent chose coffee?', /Divide the part/]])
    if (!want.test(T.hint('', q))) fail('C1', 'tap-answers.js', `wrong-topic hint for "${q}"`);
  const l = T.choices('a⁸', { q: 'Simplify a²·a⁵·a' });
  if (/You added the exponents/.test(T.why(l, 'a⁷'))) fail('E1', 'tap-answers.js', 'a²·a⁵·a → a⁷ is told "you added the exponents" (the mistake is forgetting a = a¹)');
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
