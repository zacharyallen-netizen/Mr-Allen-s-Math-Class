# Homework help fix (Nov 12, 2026, one-time tools)
The review found homework hints/notes about the wrong topic (cylinder hints on cube problems, sphere notes that said "square
the radius", equation hints on statistics, notes that blamed a mistake the student did not make).
Order used: `probtext.py` (problem words from each PDF, using crops.js; output saved as ../hw_problem_text.json) →
`decode.js` (help.js → plain JSON; the output holds the right answers, so keep it OUTSIDE the repo) → `topics.js` (lists every
problem whose help does not fit its topic) → `apply_hw.js` (Claude's decision for each flagged problem, new topic help texts) →
`claims.js` (a note that makes a claim, like "the order is switched", must be true for that choice) → `encode.js` (writes
grade8/homework/help.js and checks the round trip with the page's own code). Paths point at /home/claude/fix; change them to reuse.
`../check_rules.js` keeps these mistakes from coming back.
