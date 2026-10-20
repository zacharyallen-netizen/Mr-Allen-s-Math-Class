# Fluency Lab clean-up — brief for each lab

Repo: /home/claude/mr-allen-s-math-class (static GitHub Pages site). Labs live in
grade8/Fluency-Lab-Package/fluency-lab/fluency-lab-<name>.html. Students are 8th graders working on
basic skills, many far below grade level. The teacher's words: "Little things like this are very
confusing to young monkey brains." Make each lab calm, short and obvious.

Edit ONLY your assigned lab file. Do not touch fluency-progress.js, skill-plan.js, fluency-submit.js,
the quiz-*.html pages, index.html or anything else. Do NOT git commit or push.
Scratch folder: /home/claude/mr-allen-s-math-class/_build/fluency_review/<lab-name>/

## The teacher's rules (all of them apply to your lab)
1. **Only what the student is working on is on screen.** When a problem is rewritten into a new form
   (e.g. integers: 5 − (−3) becomes 5 + 3), the rewritten form REPLACES the old one. No stale lines
   left over from an earlier step or an earlier problem. Previous-step recap lines go away.
2. **Minimum words.** Every instruction is one short sentence, about 8 words or fewer.
   No narration ("Now…", "Great!", "Let's…"), no repeating what the picture already shows,
   no second "sub" line unless a student truly cannot do the step without it (then ≤ 6 words).
   Wrong answer: one short nudge (≤ 8 words). Second wrong: show the answer, "Type 12." style.
   Start screen: at most 2 very short bullets and one worked example with a caption of ≤ 2 short lines.
   "Done" line: just the finished problem, e.g. "✓ −4 − 6 = −10". Remove the extra "Check:" sentence
   lines after a problem. End-of-set note: ≤ 6 words.
3. **No word problems. At all. Ever.** Only numbers and symbols (Expressions may use letters x, a, b).
4. **No multi-step calculations** (a problem with more than one operation, like −2 + 7 − 3 or −3 × 4 + 5),
   EXCEPT in the Expressions & Order of Operations lab, where that is the skill. The steps of one skill's
   own method (borrowing, long division, common denominators, flip-and-multiply) are fine.
5. Keep the math exactly right. Keep the existing look (colors, fonts, layout) unless rule 1 needs a change.

## Do not break these (other files depend on them)
- Global names used by fluency-progress.js: `level`, `index`, `startSet`, `updateHUD`, `concludeProblem(right, btn)`,
  `G` = {steps, si}, `current`, element ids `start`, `play`, `summary`, `prob` (or `algo`), and the first `button.btn`
  inside #start. The text of #prob when a problem is concluded is saved as the problem's label in the teacher's
  Sheet, so at that moment #prob must show the ORIGINAL problem (with its answer is fine).
- Six levels (1–6), SET_LEN 10, the level-up / level-down rules, the "Skill check" links, the three script tags at the end.
- Same level meanings, except where your task below says otherwise.

## Verify (mandatory) — Python Playwright (`from playwright.sync_api import sync_playwright`, Chromium preinstalled)
Load file:///home/claude/mr-allen-s-math-class/grade8/Fluency-Lab-Package/fluency-lab/fluency-lab-<name>.html.
Ignore console errors matching fonts.googleapis|fonts.gstatic|ERR_TUNNEL|Failed to load resource|net::ERR.
- Generate and solve at least 15 problems on EVERY level (set `level` and call the page's own next-problem
  function, then answer every box/pick correctly by reading the expected values from the page's own move data).
  Also enter one wrong answer per level and check the nudge appears and is short. Zero page errors.
- Generate 300+ problems per level in JS and assert: answers correct (recompute independently), no problem has
  more than one operation (except Expressions), no words other than the allowed short labels.
- No sideways scroll at 390 px and 1280 px wide.
- Screenshots at 390 px: start screen, the middle of a problem on each level, a finished problem. LOOK at them with
  the Read tool. Fix clutter, leftover lines, overlaps, clipping.
- List every student-facing string in the file before and after (a short table in your report is fine).

## Report back (≤ 250 words)
What you changed, any level whose meaning changed, what you tested (numbers), screenshots paths, anything you
were unsure about.
