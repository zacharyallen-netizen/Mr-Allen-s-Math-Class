# Final review brief — Mr. Allen's Math Class (READ-ONLY REVIEW)

Repo: /home/claude/mr-allen-s-math-class (static GitHub Pages site, 8th-grade math, IC Imagine, NC; also NC Math 1 in math1/)
Live: https://zacharyallen-netizen.github.io/Mr-Allen-s-Math-Class/

## ABSOLUTE RULE
REVIEW ONLY. Do not modify, create, move or delete any file inside the repo. No git commands that change anything.
Write only inside your own folder: /home/claude/mr-allen-s-math-class/_build/final/<your-folder>/

## Context
- Every page loads /site-bar.js (shared navy top bar, shadow DOM, Menu button under 860px) as the first thing in <body>.
  Some pages have a slim white row of page-specific links under it (nav.sb-local).
- Hub pages (index.html, class-information.html, grade8/index.html, math1/index.html, grade8/unit1-9.html, math1/unit1-8.html)
  use /site.css (clean look: Source Serif headings, Inter body, navy with gold accent). Other pages keep their own design.
- Audience: 8th graders, many below grade level. Language should be slightly below grade level, encouraging.
  Math notation must be correct (superscript exponents, true minus, ×, clear √ extent, stacked/unambiguous fractions).
  Answer boxes must accept typed forms (x^2, -3, 1/2, 3.2*10^5, 36pi, units). Visuals drawn from each problem's own numbers;
  a picture shown before answering must not reveal the answer.
- math1/ pages are behind a light sessionStorage gate (gate.html). To view them in Playwright, first run
  page.addInitScript(() => sessionStorage.setItem('m1ok','1')).

## Tools
- Playwright + Chromium: require('/home/claude/.npm-global/lib/node_modules/playwright'); load file:///home/claude/mr-allen-s-math-class/...
- Ignore console errors matching /fonts\.googleapis|fonts\.gstatic|ERR_TUNNEL|Failed to load resource|AudioContext|net::ERR/
  (the sandbox blocks Google Fonts and has no audio device).
- Python3 with pdfplumber and PIL. Take screenshots into your folder and LOOK at them with the Read tool.

## Output
Write <your-folder>/findings.json: a list of
  {"page": "...", "where": "...", "category": "...", "severity": "high|medium|low",
   "evidence": "exact quote / selector / screenshot file / repro steps", "fix": "concrete fix"}
high = broken function, wrong math, a student genuinely cannot proceed, or something clearly ugly/broken on screen;
medium = real barrier or noticeable inconsistency; low = polish.
Verify every finding before reporting it (reproduce it; no speculation). Prefer fewer, sharper, verified findings.
Final message (≤ 200 words): counts by severity, the most important items, and the findings.json path.
