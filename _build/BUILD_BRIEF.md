# Build brief — Mr. Allen's Math Class (shared rules for every builder)

Repo: /home/claude/mr-allen-s-math-class  (static GitHub Pages site, 8th-grade math, North Carolina)
Live: https://zacharyallen-netizen.github.io/Mr-Allen-s-Math-Class/
Your scratch folder: /home/claude/mr-allen-s-math-class/_build/<your-task-name>/

## What you may touch
Only the file(s) named in your task. Do NOT edit, move, rename or delete anything else in the repo.
Do NOT run git commit / push. The lead will review, wire links, and commit.

## Audience and language
8th graders, many below grade level in reading and math.
- Language slightly BELOW grade level (about 5th-grade reading): short sentences, one instruction per sentence,
  concrete words, no teacher-speak, no unclear pronouns ("that", "it" with no clear referent).
- Encouraging to struggling students. Wrong answers get a specific, kind "here is what happened" message —
  never just "Wrong". Name the common mistake when you can detect it (e.g. "You added 6 + 8. Square each leg first.").
- Math vocabulary that is being taught is fine, but explain it the first time it appears.

## Math notation (must be correct in everything a student SEES)
- Exponents as real superscripts (<sup> or ² ³), never "x^2" in displayed text. Negative exponent: 10<sup>−3</sup>.
- Square roots with clear extent: √(36 + 64) or √100, never ambiguous "√36+64".
- True minus sign (−) in displayed math, × for multiplication (never *), π symbol.
- Fractions unambiguous; stacked fractions for anything beyond a simple a/b.
- Answer boxes must ACCEPT typed forms students can actually type: -3, −3, 3.5, 7/2, 3 1/2, x=5, y = 2x+1,
  y=2x + 1, 1/2x, (1/2)x, 0.5x, 10^-3, 3.2*10^5, 3.2x10^5, pi, 36pi, units like "ft", "cm^3", "%", "°".
  Compare numbers by VALUE with a sensible tolerance where rounding is involved (say what to round to).
- Every answer key and worked step must be mathematically correct. Re-derive each one; test them in code.

## Visuals
- Abundant, accurate, labelled, readable, interactive where it helps.
- NO REUSED ART: every diagram is generated from its own numbers (no stock picture reused across problems).
- A picture shown BEFORE the student answers must show only the given facts (unknowns as "?").
  Worked parts appear only AFTER the student answers.
- Inline SVG. Draw grids with explicit <line> elements (not SVG <pattern>).

## Design (this previews the site's upcoming makeover — follow it)
Calm, precise, clean, elegant, professional. Less clutter.
- Colors: navy #1E2D4F (text/headings/primary buttons), gold #E0A800 / #FFC107 as a SHARP accent only
  (small highlights, current step, key numbers), off-white page #F7F7F4, white cards, hairline borders #E3E5EA,
  muted text #5B6475, success #15803D, error #B42318, info blue #1D4ED8.
- Fonts: headings "Source Serif 4" (fallback Georgia, serif), body "Inter" (fallback system-ui, sans-serif),
  numbers in answer boxes/data "JetBrains Mono" (fallback ui-monospace). Load from Google Fonts only
  (the sandbox blocks them — fallbacks must look fine).
- No emoji in headings or chrome. No eagle anywhere. No rainbow gradients, no glow, no neon.
  A game may have personality through its own illustrations, motion and clear feedback, not decoration.
- Cards: white, 1px border, 8–10px radius, subtle shadow at most. Generous white space. 8-pt spacing scale.
- Mobile first: must work at 390px wide with NO horizontal scroll; tap targets ≥ 44px; works with touch AND mouse.
- Accessible: text contrast ≥ 4.5:1, visible keyboard focus, buttons are <button>, inputs have labels.
- Put this exact comment as the first thing inside <body>:  <!-- SITE-BAR -->
  (the lead will inject the new shared top bar there). Below it, a simple text link back to the parent page.
- Self-contained single HTML file: CSS and JS inline. No external scripts. No localStorage dependence
  (if you use localStorage for a best score, wrap every access in try/catch and work without it).
- Never collect or send student data.

## Verify before you finish (mandatory)
Playwright + Chromium: require('/home/claude/.npm-global/lib/node_modules/playwright'), load from
file:///home/claude/mr-allen-s-math-class/... Ignore console errors matching
/fonts\.googleapis|fonts\.gstatic|ERR_TUNNEL|Failed to load resource|AudioContext/.
- Zero page errors. Play every level/section end to end in code: correct answers are accepted, wrong answers get
  the right feedback, typed variants are accepted.
- No horizontal scroll at 390px and at 1280px.
- Take screenshots (390 and 1280) into your scratch folder and LOOK at them with the Read tool. Fix what looks off:
  clipped labels, overlaps, crowded text, unreadable diagrams.
- Final message to the lead (≤ 200 words): what you built, the file path, what you tested, any known limitation.
