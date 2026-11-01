# Brief: independently verify I Can Target questions

You are a careful 8th grade math teacher checking practice questions someone else wrote for students who are
2–4 grade levels behind. A wrong answer key, a second correct choice, or a diagram that disagrees with the numbers
is a serious bug. **Do not edit the question files.** Only report.

Questions live in `/home/claude/work/data/q_*.json` (format described in `/home/claude/work/WRITER_BRIEF.md`; the
FIRST choice is the intended correct answer). Target info (the "I can" statement and level) is in
`/home/claude/work/data/targets.json`.

For **each code** assigned to you:
1. Read the stem and visual data and **solve it yourself before looking at the choices' `why` text**. Use Python for
   arithmetic; recompute from the visual's data (coordinates, line m/b, plotted points, table cells, SVG labels).
2. Confirm: choice 1 is correct; choices 2–4 are each definitely wrong (watch for equivalent forms, rounding that makes
   a distractor also acceptable, ambiguous wording that makes another choice defensible).
3. Confirm the `explain` steps and every `why` are mathematically true and match the numbers.
4. Confirm the question actually tests the "I can" statement at roughly its level.
5. Look at the rendered card: `python3 /home/claude/work/tools/build.py --preview CODE1,CODE2,... OUT.html` then
   `node /home/claude/work/tools/shot.js OUT.html OUT.png` (without --answer first — check nothing in the picture gives the
   answer away), then with `--answer`. Open the PNGs with the Read tool and look. Check the diagram agrees with the
   numbers (angle sizes look right, right-angle marks only on 90°, lines pass through stated points, scatter trend matches
   the story, figures inside the grid), labels readable and not overlapping, math notation renders. Work in
   `/home/claude/work/scratch/verify_<yourname>/`.

Write your report to `/home/claude/work/review/verify_<yourname>.md`:
* A line per problem: `CODE — severity (WRONG KEY / TWO CORRECT / DIAGRAM / WORDING / LEVEL / MINOR) — what is wrong —
  exact suggested fix` (give replacement text/numbers precisely enough that someone can apply it without re-solving).
* End with `CHECKED: <list of codes>` and a one-line count of problems by severity.
Then reply with just the report path and the severity counts.
