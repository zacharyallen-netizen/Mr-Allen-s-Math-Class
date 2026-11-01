# Fix brief — final review fixes (three fixers work IN PARALLEL on DISJOINT files)

Repo: /home/claude/mr-allen-s-math-class . Do NOT git commit/push (the lead commits).
Findings (verified by reviewers) are in:
  /home/claude/mr-allen-s-math-class/_build/final/func/findings.json  (ids f0..f11 = list index)
  .../final/look/findings.json (l0..l23)
  .../final/ped/findings.json  (p0..p12)
Each finding has evidence + a suggested fix. Re-verify, then fix properly (the suggested fix is a starting point, not a mandate).

## HARD RULES
- Edit ONLY the files assigned to you below. Other fixers are editing other files at the same time.
- Never delete or strip content to make a problem go away — fix it. Keep every activity, question and explanation.
- Keep the page's own design; do not restyle interiors beyond what the fix needs.
- Language for students: short, plain, encouraging, slightly below grade level. Math notation correct
  (superscripts, true minus −, ×, √ with clear extent, unambiguous fractions). Answer boxes accept typed forms.
- Every page loads /site-bar.js (a 56px navy top bar, z-index 1000, not fixed — it scrolls away). Fixed/full-screen layers on
  a page should start below 56px or sit above z-index 1000 when they are modals the student must close.
- Recompute every math change in code.
- Verify with Playwright (require('/home/claude/.npm-global/lib/node_modules/playwright')), at 390x844 and 1280x800:
  no page errors (ignore /fonts\.googleapis|fonts\.gstatic|ERR_TUNNEL|Failed to load resource|AudioContext|net::ERR/),
  no horizontal scroll, the specific bug is gone, and the page still works end to end. Screenshot and LOOK at your fixes.
- Work files go in .../scratchpad/final/<your-folder>/ .
- Final message (≤ 200 words): each finding id → fixed / not fixed (why), files changed, what you tested.
