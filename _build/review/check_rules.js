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
       ['C2', 'function nextMove', 'next good move after repeated misses'], ['C2', "Show me this step", 'way forward after the 3rd miss'], ['C4', 'swHelped', '"(used step help)" record'],
       ['C2', 'function nextMovePow', 'next move for squares / roots / π'], ['C2', 'function nextMoveLine', 'next move for solve-for-y'], ['C2', 'Show me the equation', 'way forward in Write an equation'],
       ['C2', 'You tried this same equation before', 'repeat check in Write an equation'], ['C1', 'moves <i>', 'a true but wrong-way move is not praised']])
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

/* C2: every homework "write an equation" problem has an equation to show after the 3rd miss. */
{
  const vm = require('vm'), ctx = { window: {} }; vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'grade8/homework-steps.js'), 'utf8'), ctx);
  const M = ctx.window.HW_STEPS || {};
  for (const id in M) for (const n in M[id]) { const c = M[id][n]; if (!Array.isArray(c) && c.setup != null && !c.ps && !c.eq) fail('C2', `HW ${id} #${n}`, 'no "Show me the equation" equation (add it to SETUP in _build/test_homework_steps.js and EQ in homework-steps.js)'); }
}

/* C2/C3 (review batch 3, Nov 12, 2026): every kind of page escalates after a miss and never just shows the answer first. */
{
  const rd = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
  const need = [
    ['C2', 'grade8/one-at-a-time.js', 'TRY AGAIN ON UNITS 7–9 PRACTICE', 'Units 7–9 practice lets students try again (no lock after one tap)'],
    ['C2', 'grade8/practice/practice-engine.js', 'the 2nd miss opens the hint', 'practice pages open the hint on the 2nd miss'],
    ['C2', 'grade8/homework_turn_in.html', 'You tapped this one before', 'homework taps say when a choice was already tried'],
    ['C2', 'grade8/homework_turn_in.html', 'You tried this same answer before', 'homework numbers say when an answer was already tried'],
    ['C5', 'grade8/eog/eog-unit.js', 'function hideAns', 'EOG first-miss note does not give the answer'],
    ['C1', 'grade8/eog_review.html', 'TapAnswers.miss(correct', 'EOG review names the mistake'],
  ];
  for (const [r, f, needle, what] of need) if (!rd(f).includes(needle)) fail(r, f, 'missing: ' + what);
  for (const f of ['unit1-notes', 'unit2-notes-sci-notation', 'unit2-notes-exponents', 'unit3-notes', 'unit4-notes', 'unit5-notes', 'unit7-notes', 'unit8-notes', 'unit1-tutorial-cube-roots'])
    if (/the correct answer is highlighted in green\. ' \+ \(fb\.dataset\.hint/.test(rd('grade8/' + f + '.html'))) fail('C1', 'grade8/' + f + '.html', 'wrong multiple-choice answer does not name the mistake');
  if (/'√' \+ qHtml\(k\) \+ ' = ' \+ rt/.test(rd('grade8/step-work.js'))) fail('C3', 'grade8/step-work.js', 'square-root preview prints the answer before the student writes it');
  const EM = /<h[1-4][^>]*>[^<]*[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u;
  for (const f of fs.readdirSync(path.join(ROOT, 'grade8'))) if (/^unit8.*\.html$/.test(f) && EM.test(rd('grade8/' + f))) fail('D5', 'grade8/' + f, 'emoji in a heading');
}

/* C1/C5/C6 (review batch 4, Nov 12, 2026, "do the rest"). */
{
  const rd = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
  for (const f of ['unit7-practice', 'unit7-practice-1', 'unit7-practice-2', 'unit8-practice', 'unit8-practice-1', 'unit8-practice-2', 'unit9-practice']) {
    const h = rd('grade8/' + f + '.html'); const re = /<button[^>]*onclick="mc\(this,\s*'([^']+)',\s*'((?:[^'\\]|\\.)*)'\)"[^>]*>([\s\S]*?)<\/button>/g; let m, n = 0;
    while ((m = re.exec(h))) { const txt = m[3].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim(), right = m[2].replace(/\\'/g, "'").replace(/\s+/g, ' ').trim();
      if (txt !== right && !/data-why="/.test(m[0])) { n++; if (n < 4) fail('C1', 'grade8/' + f + '.html', `wrong choice "${txt}" (${m[1]}) has no note of its own`); } }
  }
  const need = [['C5', 'grade8/notes-tap.js', 'FIRST MISS', 'notes: the first wrong answer names the mistake and lets the student try again'],
    ['C5', 'notes-practice.js', 'tw && tries === 2', 'notes practice: answer + twin only after the 3rd miss'],
    ['C6', 'grade8/step-work.js', 'function guessEq', '"Show me the equation" on practice, notes and pre-tests'],
    ['C6', 'grade8/step-work.js', 'function monoText', '"Show me this step" in the exponent tool'],
    ['A1', 'paper.js', "closest('.np-sol')", 'lined-up notes solutions stay in the answer key']];
  for (const [r, f, needle, what] of need) if (!rd(f).includes(needle)) fail(r, f, 'missing: ' + what);
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

/* G1–G4 (Nov 13, 2026): Targeted Practice label, no big gold button, Units 3–4 page = pre-test + tutorial, ♪ Music button. */
{
  const rd = f => fs.readFileSync(path.join(ROOT, f), "utf8");
  const units = [1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => 'grade8/unit' + n + '.html').concat(['grade8/units3-4.html', 'grade8/8th_grade_eog_hub.html']);
  for (const f of units) { const t = rd(f).replace(/<script[\s\S]*?<\/script>/g, '').replace(/<[^>]+>/g, ' ');
    if (/\bHomework\b/.test(t)) fail('G1', f, 'still says "Homework" (use "Targeted Practice")'); }
  const hw = rd('grade8/homework_turn_in.html');
  if (/textContent = 'Homework '|<h1 id="ttl">Homework</.test(hw)) fail('G1', 'grade8/homework_turn_in.html', 'title still says "Homework"');
  if (/un-next'|"un-next"|className = 'un-next'/.test(rd('grade8/unit-next.js').replace(/st\.textContent[^;]*;/, ''))) fail('G2', 'grade8/unit-next.js', 'still draws the big gold button');
  if (/details\.className = 'un-all'|createElement\('details'\)/.test(rd('grade8/unit-next.js'))) fail('G2', 'grade8/unit-next.js', 'still folds the unit page');
  const u34 = rd('grade8/units3-4.html'), links = (u34.match(/href="([^"#]+)" class="feature-card"/g) || []).map(x => x.slice(6, x.indexOf("\"", 6)));
  if (links.join() !== 'units3-4-pretest.html,units3-4-review-tutorial.html') fail('G3', 'grade8/units3-4.html', 'should hold only the Units 3–4 pre-test and tutorial, has: ' + links.join(', '));
  if (!/homework_turn_in\.html\?hw=3\.1/.test(rd('grade8/unit3.html')) || !/homework_turn_in\.html\?hw=4\.1/.test(rd('grade8/unit4.html'))) fail('G3', 'grade8/unit3.html / unit4.html', 'Unit 3 / Unit 4 pages must keep their own items');
  const sb = rd('site-bar.js');
  if (!/class="mus"/.test(sb) || !/drift\.html\?mini=1/.test(sb)) fail('G4', 'site-bar.js', 'missing the ♪ Music pop-out button');
  if (!/MINI/.test(rd('grade8/drift.html'))) fail('G4', 'grade8/drift.html', 'missing the small player (?mini=1)');
}

/* D6: the step tool scrolls calmly (no centering, no focus jumps). */
{
  const t = fs.readFileSync(path.join(ROOT, 'grade8/step-work.js'), 'utf8');
  if (!/function calmScroll\(target, anchor, focusEl\)/.test(t)) fail('D6', 'grade8/step-work.js', 'missing calm() scrolling');
  const bad = (t.replace(/catch \(e\) \{ inp\.focus\(\); \}/g, '').match(/\b(?:inp|a)\.focus\(\)/g) || []).length;
  if (bad) fail('D6', 'grade8/step-work.js', bad + ' plain .focus() call(s) that can jump the page (use calm() or preventScroll)');
}

/* G5–G6 (Nov 13, 2026): one problem on screen; finished step work is submitted automatically. */
{
  const rd = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
  const oat = rd('grade8/one-at-a-time.js');
  if (/Show all ' \+ WORD/.test(oat)) fail('G5', 'grade8/one-at-a-time.js', 'still has the "Show all problems" switch');
  if (/See the whole page/.test(rd('grade8/homework_turn_in.html'))) fail('G5', 'grade8/homework_turn_in.html', 'still has "See the whole page"');
  const sw = rd('grade8/step-work.js');
  if (/Put this answer in the answer box/.test(sw)) fail('G6', 'grade8/step-work.js', 'still asks students to put the answer in the box');
  if (!/function submitBox\(inp, text\)/.test(sw)) fail('G6', 'grade8/step-work.js', 'missing submitBox (auto check)');
}

/* G7 (Nov 13, 2026): short step-by-step screens. */
{
  const sw = fs.readFileSync(path.join(ROOT, 'grade8/step-work.js'), 'utf8');
  if (!/function shortTrail\(/.test(sw)) fail('G7', 'grade8/step-work.js', 'missing the last-two-lines trail');
  if (/'I read this as: <span class="sw-ln">' \+ eqHtml/.test(sw)) fail('G7', 'grade8/step-work.js', 'still shows "I read this as" for equations');
  if (/'Colors: ' \+ out\.join/.test(sw)) fail('G7', 'grade8/step-work.js', 'still shows the Colors key');
  if (!/function brief\(h\)/.test(sw) || !/function hideAns\(host, hide\)/.test(sw)) fail('G7', 'grade8/step-work.js', 'missing short feedback or hidden answer box');
  if ((sw.match(/function calm\(/g) || []).length > 1) fail('G7', 'grade8/step-work.js', 'two functions named calm()');
}

/* H1–H2 (Nov 13, 2026): 3 tries before an answer shows; work is saved to the Sheet. */
{
  const rd = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
  const need3 = [['grade8/practice/practice-engine.js', "if (tries >= 3) card.querySelector('.pr-show').hidden = false;"],
    ['grade8/eog/eog-unit.js', 'if (st.tries >= 3) d.querySelector(".reveal")'], ['notes-practice.js', 'tw && tries === 2'],
    ['grade8/notes-tap.js', '(+host.dataset.nm1 || 0) >= 2'], ['grade8/pretest-tap.js', 'MISS[q.id] < 3'], ['grade8/targets/targets.js', 'misses >= 3 && showBtn']];
  need3.forEach(([f, t]) => { if (!rd(f).includes(t)) fail('H1', f, 'must give 3 tries before the answer shows'); });
  if (!/save-work\.js/.test(rd('score-send.js'))) fail('H2', 'score-send.js', 'must load save-work.js');
  if (!/save-work\.js/.test(rd('grade8/homework_turn_in.html'))) fail('H2', 'grade8/homework_turn_in.html', 'must load save-work.js');
  const gs = rd('_build/student_work/StudentWork.gs');
  if (!/kind === 'save'/.test(gs) || !/kind === 'load'/.test(gs)) fail('H2', '_build/student_work/StudentWork.gs', 'missing save/load');
  if (!/SaveWork\.note\('sw'/.test(rd('grade8/step-work.js'))) fail('H2', 'grade8/step-work.js', 'finished step work must be saved');
}

/* G8: praise above the next question */
{ const sw = fs.readFileSync(path.join(ROOT, 'grade8/step-work.js'), 'utf8');
  if ((sw.match(/work\.insertBefore\(pz2?, work\.firstChild\)/g) || []).length < 2) fail('G8', 'grade8/step-work.js', 'praise must go above "What will you do next?"'); }

/* G9–G11 (Nov 13, 2026) */
{
  const rd = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
  for (let u = 1; u <= 9; u++) { const t = rd('grade8/unit' + u + '.html');
    if (/class="start-here"/.test(t)) fail('G9', 'grade8/unit' + u + '.html', 'still has the Start here strip');
    if (!/class="unit-goals"/.test(t) || !/class="ug-t"/.test(t) || !/class="ug-s"/.test(t)) fail('G9', 'grade8/unit' + u + '.html', 'missing What you will learn (targets + standards)'); }
  ['unit1-notes', 'unit2-notes-exponents', 'unit2-notes-sci-notation', 'unit3-notes', 'unit4-notes', 'unit5-notes', 'unit6-notes', 'unit7-notes', 'unit8-notes', 'volume'].forEach(n => { const t = rd('grade8/' + n + '.html');
    if (!/id="ican-hide"/.test(t)) fail('G9', 'grade8/' + n + '.html', 'the I can box must be hidden on screen');
    if ((t.match(/<body/g) || []).length !== 1 || (t.match(/class="ican-box"/g) || []).length !== 1) fail('G9', 'grade8/' + n + '.html', 'page content is doubled or the I can box is missing'); });
  if (!/getItem\("nav-style"\) !== "top"/.test(rd('site-bar.js'))) fail('G10', 'site-bar.js', 'the side menu must be the default');
  const u5 = rd('grade8/unit5.html');
  if (!/unit5-practice-problems\.html#s0p1/.test(u5) || /Practice Problems 5\.1–5\.4 — Interactive/.test(u5)) fail('G11', 'grade8/unit5.html', 'Targeted Practice Problems 5.x cards');
  const u6 = rd('grade8/unit6.html');
  if (/More Practice &amp; Review/.test(u6) || u6.indexOf('unit6-review.html') < u6.indexOf('id="homework"')) fail('G11', 'grade8/unit6.html', 'practice and review must sit inside Targeted Practice');
}

/* I1–I4: arcade games (Nov 13, 2026) */
{
  const rd = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
  const ea = rd('grade8/equation-arena.js');
  if (!/em-split/.test(ea) || !/em-work/.test(ea) || !/em-fight/.test(ea)) fail('I1', 'grade8/equation-arena.js', 'Equation Master: work on the left, fight on the right');
  const zp = rd('grade8/zero-pair-run.html');
  if (!/Tiles for Miles/.test(zp) || /<title>[^<]*Zero Pair Run/.test(zp)) fail('I2', 'grade8/zero-pair-run.html', 'game is named Tiles for Miles');
  ['grade8/arcade.html', 'grade8/unit3.html', 'grade8/materials_index.html'].forEach(f => { if (/>Zero Pair Run/.test(rd(f))) fail('I2', f, 'card must say Tiles for Miles'); });
  const sq = rd('grade8/squeaky-cheeks.html');
  if (/'burp'|'achoo'/.test(sq) || !/acc:/.test(sq)) fail('I3', 'grade8/squeaky-cheeks.html', 'background guests are polite and fancy (no burps/sneezes)');
  if (!/id="ar-bb"/.test(ea) || !/'ROUND ' \+/.test(ea) || /FATALITY|FINISH HIM|FLAWLESS|Kombat/i.test(ea.replace(/\/\*[\s\S]*?\*\//g, ''))) fail('I1', 'grade8/equation-arena.js', 'fighting-game look (health bars, ROUND / FIGHT) with nothing copied from a real game');
  { const em = rd('grade8/equation_master.html');
    if (!/var THINK_MS = /.test(em) || !/PASS_PCT = 70/.test(em) || !/function lockFor\(/.test(em) || /Still show transformation after wrong answer/.test(em) || !/champion: \[/.test(em) || !/inequalities: \[/.test(em) || !/LEVEL_ORDER = \[0, 1, 2, 4, 5, 3\]/.test(em)) fail('I10', 'grade8/equation_master.html', 'no mashing: retry, think time, 70% gate, new levels');
    { const nn = rd('grade8/nitro-numbers.html');
      if (!/function genInt\(\)/.test(nn) || !/a=b\*q;ans=q;/.test(nn) || !/id:'I',tag:'Integers'/.test(nn) || !/genInt,genSquare,genCube/.test(nn)) fail('I11', 'grade8/nitro-numbers.html', 'integer operations track, even division, in the mix');
      if (!/function fire\(\)/.test(nn) || !/R\.ammo\+\+/.test(nn) || !/var grow=RM\?0:/.test(nn)) fail('I11', 'grade8/nitro-numbers.html', 'rivals + ammo from right answers; straight road for reduced motion'); }
    { const sv = rd('grade8/skills/sbvideo.js'), ap = rd('arcade-pass.js'), as = rd('arcade-send.js');
      if (!/u\.rate = 0\.8\d/.test(sv) || !/wait: true/.test(sv) || /count: 5/.test(sv) || !/var VTXT = /.test(sv) || !/function same\(/.test(sv)) fail('J6', 'grade8/skills/sbvideo.js', 'gentle voice, Your turn waits, easy words, no repeats');
      if (!/PER = 3, MIN = 5/.test(sv) || !/ArcadePass/.test(ap) || !/arcade-pass\.js/.test(as)) fail('J6', 'arcade-pass.js', '3 videos = 5 minutes of Arcade time, shown on the Arcade and games');
      for (let n = 1; n <= 8; n++) for (const f of ['grade8/skill-builders-unit' + n + '.html', 'grade8/skill-builders-unit' + n + '-practice.html']) if (!/skills\/sbcalc\.js/.test(rd(f))) fail('J6', f, 'basic calculator on every Skill Builder page'); }
    if (!/var TAUNT = /.test(ea) || /hp = Math\.max\(0, hp - 1\); pips\(\); if \(hp === 0 && beastAlive\) gore\(false\)/.test(ea)) fail('I10', 'grade8/equation-arena.js', 'trash talk; a wrong move costs the beast nothing'); }
  if (!/e\.code !== 'Space'/.test(ea) || !/var WEAPONS = /.test(ea) || !/var MUS = /.test(ea) || !/function gore\(/.test(ea) || !/keyup/.test(ea)) fail('I5', 'grade8/equation-arena.js', 'Space to block (never picks an answer), weapons, music, slow-motion death');
  const ik = rd('grade8/integer-knockout.html');
  if (!/var TRASH = /.test(ik) || /Little Mac|Glass Joe|Punch-Out|Bald Bull|King Hippo|Soda Popinski|Mr\. Sandman|Doc Louis/i.test(ik.replace(/\/\*[\s\S]*?\*\//g, ''))) fail('I6', 'grade8/integer-knockout.html', 'math trash talk, nothing from a real boxing game');
  const al = rd('_build/student_work/ArcadeLog.gs'), ar = rd('grade8/arcade.html');
  if (!/function fullName_\(/.test(al) || !/show: cap\(w\[0\]\) \+ ' ' \+ w\[w\.length - 1\]\.charAt\(0\)/.test(al) || !/id="lbRow"/.test(ar)) fail('I7', 'grade8/arcade.html', 'high scores: full names only, shown as First L.');
  const ni = rd('grade8/neon-integer-assault.html');
  if (/box\.correct \? colors\.green/.test(ni)) fail('I4', 'grade8/neon-integer-assault.html', 'right answers must not glow green');
  if (!/function makeInvaders\(/.test(ni) || !/function makeCentipede\(/.test(ni) || !/function balance\(/.test(ni) || !/function GW\(\)/.test(ni) || /window\.innerWidth/.test(ni.slice(ni.indexOf('const canvas')))) fail('I4', 'grade8/neon-integer-assault.html', 'invaders + centipede, every answer kept shootable, game sized beside the side menu');
  if (!/function floorY\(/.test(ni) || !/function obliterate\(/.test(ni) || /hurt\('The invaders reached you/.test(ni) || /death ?star/i.test(ni)) fail('I4', 'grade8/neon-integer-assault.html', 'ships stay above the zig-zag line, ammo dump, original boss');
  if (!/var COACH = /.test(ik) || /Doc Louis/i.test(ik)) fail('I6', 'grade8/integer-knockout.html', 'original corner trainer with the integer rules');
  const sv = rd('grade8/skills/sbvideo.js');
  if (!/var HOOK = /.test(sv) || !/SB\.say = say/.test(sv) || !/wait: true/.test(sv)) fail('J1', 'grade8/skills/sbvideo.js', 'lesson videos: hook, voice in words, think time');
  for (let n = 1; n <= 8; n++) if (!/skills\/sbvideo\.js/.test(rd('grade8/skill-builders-unit' + n + '.html'))) fail('J1', 'grade8/skill-builders-unit' + n + '.html', 'loads the lesson videos');
  { const t = rd('ticker.js'), g = rd('_build/student_work/ArcadeLog.gs'), sb = rd('site-bar.js');
    if (!/SHOW = /.test(t) || /practice|pretest|eog\b/.test((t.match(/var SHOW = [^;]*/) || [''])[0]) || !/ticker\.js/.test(sb)) fail('J3', 'ticker.js', 'hub pages only, loaded by site-bar.js');
    if (!/Hide from ticker/.test(g) || !/who_\(who\)/.test(g) || !/who_\(r\[1\]\)/.test(g) || !/getSheetByName\('Roster'\)/.test(g) || !/Math\.min\(60/.test(g)) fail('J3', 'ArcadeLog.gs', 'roster names only, hide list, capped minutes'); }
  { const v = rd('site-video.js');
    if (!/tour: \{/.test(v) || !/trackers: \{/.test(v) || !/stv-cap/.test(v) || !/images\/trackers\//.test(v) || /speechSynthesis/.test(v) === false) fail('J4', 'site-video.js', 'tour + trackers videos with voice and captions');
    if (!/data-site-video="tour"/.test(rd('index.html')) || !/site-video\.js/.test(rd('index.html'))) fail('J4', 'index.html', 'website tour video');
    if (!/data-site-video="trackers"/.test(rd('grade8/grading.html')) || !/site-video\.js/.test(rd('grade8/grading.html'))) fail('J4', 'grade8/grading.html', 'tracker video in Your tracker'); }
  { const vf = rd('grade8/vocab-flashcards.html'), vc = (rd('grade8/vocabulary.html').match(/class="vcard"/g) || []).length;
    if (!/function mask\(/.test(vf) || (vf.match(/"t": ?"/g) || []).length !== vc || !/vocab-flashcards\.html/.test(rd('grade8/vocabulary.html'))) fail('J5', 'grade8/vocab-flashcards.html', 'every glossary word, masked Blitz prompts, linked from the glossary (rerun _build/vocab_game.py)'); }
  { const fx = rd('student-fx.js'), home = rd('grade8/index.html'), sn = rd('side-nav.js'), cfg = rd('site-config.js'), si = rd('search-index.js');
    if (!/fx-print/.test(fx) || /'Printables ▾'/.test(fx)) fail('K1', 'student-fx.js', 'PDF / answer key buttons in a Print it bar at the TOP, not folded at the bottom');
    for (const id of ['today', 'learn', 'practice-review', 'my-progress', 'take-a-break']) if (!new RegExp('id="' + id + '"').test(home)) fail('K1', 'grade8/index.html', 'Start here today + the four groups (' + id + ')');
    if (!/site-config\.js/.test(home) || !/thisUnit:\s*\d/.test(cfg)) fail('K1', 'site-config.js', 'thisUnit drives the This unit button');
    for (const t of ["title: 'Learn'", "title: 'Practice & Review'", "title: 'My Progress'", "title: 'Take a Break'", 'class="srch"']) if (sn.indexOf(t) < 0) fail('K1', 'side-nav.js', 'same four groups + search (' + t + ')');
    { const dg = rd('_build/student_work/Digit.gs'), sw = rd('_build/student_work/StudentWork.gs');
      if (!/getActiveUser\(\)/.test(dg) || !/teacher = owner && email === owner/.test(dg) || !/if \(teacher\) \{\s*if \(!p\.student\)/.test(dg)) fail('K2', 'Digit.gs', 'student only from the signed-in account; &student= only for the owner');
      if (!/digitEsc_/.test(dg) || /appendRow|setValue|insertSheet/.test(dg)) fail('K2', 'Digit.gs', 'escape sheet values; never write');
      if (!/p\.digit\) return digitPage_/.test(sw)) fail('K2', 'StudentWork.gs', 'doGet sends ?digit=1 to Digit.gs');
      if (!/script\\\.google\\\.com/.test(home)) fail('K2', 'grade8/index.html', 'Ask Digit link only for a script.google.com address'); }
    for (let n = 1; n <= 9; n++) if (!/<!--unit-extras-->/.test(rd('grade8/unit' + n + '.html'))) fail('K1', 'grade8/unit' + n + '.html', 'Also for this unit row (python3 _build/unit_extras.py)');
    if (!/window\.SITE_SEARCH = /.test(si) || si.indexOf('vocab-flashcards.html') < 0) fail('K1', 'search-index.js', 'rebuild with python3 _build/search_index.py');
    const homeLinks = (home.match(/href="([^"#]+)/g) || []).map(h => h.slice(6)); for (const h of ['anchor_charts.html', 'vocab-flashcards.html', 'skill-builders.html', 'arcade.html', 'reset-room.html', 'grading.html', 'benchmarks.html', '8th_grade_eog_hub.html', 'materials_index.html', 'winter-break-review-v2.html']) if (homeLinks.indexOf(h) < 0) fail('K1', 'grade8/index.html', 'missing card ' + h); }
  { const home = rd('grade8/index.html');   /* K3: doors + unit paths + Quick Checks */
    if ((home.match(/class="door [^"]*" href="#[^"]+" data-door=/g) || []).length !== 4 || !/id="this-unit"/.test(home) || /class="jump"/.test(home)) fail('K3', 'grade8/index.html', 'gold This unit bar + four picture doors, no jump chips');
    for (const id of ['learn', 'practice-review', 'my-progress', 'take-a-break']) if (!new RegExp('<section class="door-panel" id="' + id + '"').test(home)) fail('K3', 'grade8/index.html', 'door panel ' + id);
    for (let n = 1; n <= 9; n++) { const u = rd('grade8/unit' + n + '.html');
      if (!/<!--unit-path--><nav class="unit-path"/.test(u) || !new RegExp('href="unit' + n + '-screener.html"').test(u) || !/id="screener"/.test(u)) fail('K3', 'grade8/unit' + n + '.html', 'Quick Check + In this unit row (python3 _build/unit_path.py)');
      if (!/Targeted Practice <span class="plain">\(homework\)<\/span>/.test(u)) fail('K3', 'grade8/unit' + n + '.html', 'plain meaning for Targeted Practice');
      const sc = rd('grade8/unit' + n + '-screener.html'); const m = sc.match(/window\.SCREENER = (\{.*\});<\/script>/);
      if (!m) { fail('K3', 'grade8/unit' + n + '-screener.html', 'missing (python3 _build/screener/make.py)'); continue; }
      const D = JSON.parse(m[1]);
      if (D.qs.length !== 5 || D.qs.some(q => !q.hint || !q.review || !q.review.h || q.wrong.length !== 3 || q.wrong.some(w => !w.why))) fail('K3', 'grade8/unit' + n + '-screener.html', '5 questions, each with a hint, a review link and a note on every wrong choice');
      if (!/score-send\.js/.test(sc)) fail('K3', 'grade8/unit' + n + '-screener.html', 'Send my work'); } }
  for (const f of ['grade8/winter-break-review.html', 'grade8/winter-break-review-v2.html']) { const w = rd(f); if (!/"intro":/.test(w) || (w.match(/wb-box/g) || []).length < 7 || /\bEC\b/.test(w)) fail('J2', f, 'Quick review boxes, no EC label'); }
  const lvh = rd('grade8/laser-vault.html');
  if (!/id="brief"/.test(lvh) || !/function fence\(/.test(lvh) || !/function drawObj\(/.test(lvh) || !/lv-tut/.test(lvh) || !/AGENT_MAP/.test(lvh)) fail('I9', 'grade8/laser-vault.html', 'briefing, agent, laser fences, objectives, guided first fence');
  const rr = rd('grade8/root-rocket.html');
  if (!/function good\(k, n\)/.test(rr) || !/function whyLand\(/.test(rr) || !/G\.tries >= 3/.test(rr) || !/score: G\.score/.test(rr)) fail('I8', 'grade8/root-rocket.html', 'Root Rocket: method-friendly numbers, named mistakes, 3 tries, score logged');
  if (/glint > 0 \? C\.green|val === .*answer.*C\.green/.test(ni)) fail('I4', 'grade8/neon-integer-assault.html', 'right answers must look like every other target');
}

if (fails.length) { console.log(fails.length + ' rule check(s) FAILED:\n' + fails.join('\n')); process.exit(1); }
console.log('All rule checks passed.');
