# Math 1 review + rebuild brief (NC Math 1, IC Imagine, Mr. Allen)

Repo: /home/claude/mr-allen-s-math-class   Math 1 lives in math1/. Do NOT git commit/push. Edit ONLY your assigned files.
math1 pages are behind a light gate: in Playwright run  page.addInitScript(() => sessionStorage.setItem('m1ok','1'))  before goto.
Every page already loads ../site-bar.js (shared top bar) — leave that alone. Notes/practice pages use ../theme.css; keep their look.

## The teacher's standing expectations
- KEEP all existing content (never delete material to make things easier). Improve, correct and ADD.
- Language slightly below grade level, short sentences, one instruction per sentence, encouraging to struggling students.
  Explain each new vocabulary word where it first appears.
- Correct notation in what students see: superscript exponents (x², 3ⁿ, x<sup>n</sup>), true minus −, ×, √ with clear extent,
  stacked/unambiguous fractions, f(x) notation, inequality symbols, interval/set notation where taught.
- Instructional structure for EVERY skill: worked example → numbered steps (task analysis) → "find the mistake" (error analysis)
  → practice the student completes and checks, with feedback that names the likely mistake.
- Interactive: boxes to complete and verify. Checkers accept typed forms (x^2, -3, −3, 1/2, 0.5, 2x+1, y=2x+1, (3, -2), 3,-2,
  x=4, 4.0, sqrt(2), 2^x, 1.5^x, intervals like x>3 / 3<x). Wrong answers get specific, kind feedback.
- VISUALS AT HIGH FREQUENCY (the teacher's top request for Math 1):
  * Notes: every topic gets a concept visual AND each worked example gets its own diagram. Aim for ≥ 3 visuals per topic.
  * Practice: a visual for EVERY problem where the math can be pictured (graphs, tables, number lines, area/algebra-tile
    models, balance models, bar models, scatter plots, box plots, histograms, geometry on the plane, growth/decay curves,
    sequence diagrams, parabolas with vertex/roots/axis). Target ≥ 80% of practice items with a visual.
  * Every visual is drawn from THAT problem's own numbers (generated inline SVG). No reused or stock art.
  * A visual shown BEFORE answering must not reveal the answer (unknowns as "?"); worked parts appear only after the check.
  * Grids with explicit <line> elements (no SVG <pattern>), labelled axes with numbers, labels never clipped (keep text inside
    the viewBox), readable at 390 px wide, colors: navy #1E2D4F = given, gold #E0A800 = what we want, green #15803D = answer
    (shown after), muted grey for grid.
  * Interactive visuals where they teach (slider for m and b, vertex/a sliders for parabolas, draggable point, growth factor
    slider) — make sure they work with touch and mouse.
- Recompute every answer key in code. Wrong keys are the worst possible bug.

## Review first (write findings), then fix
1. Write <your folder>/findings.json (page, where, category, severity, current, fix) for your files — be specific.
2. Fix everything you found, then build out the visuals and scaffolds above.
3. Verify with Playwright (require('/home/claude/.npm-global/lib/node_modules/playwright')) at 390x844 and 1280x800:
   no page errors (ignore /fonts\.googleapis|fonts\.gstatic|ERR_TUNNEL|Failed to load resource|AudioContext|net::ERR/),
   no horizontal scroll, every check works with right AND wrong AND typed-variant answers, every SVG label inside its box.
   Screenshot every topic/practice section at both widths and LOOK at them; fix anything cluttered, clipped or confusing.
4. Final message (≤ 250 words): counts — visuals before → after per page, items with visuals / total, worked examples,
   error-analysis items, findings fixed (by severity), and anything you could not do.
