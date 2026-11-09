# Mr. Allen's Math Class — instructions for Claude

Zach Allen teaches 8th grade math (and NC Math 1). This repo is his public
GitHub Pages site: https://zacharyallen-netizen.github.io/Mr-Allen-s-Math-Class/
Pushing to `main` publishes the site in about 2 minutes. He has authorized Claude to commit and push.

## Standing preferences (do these without being asked)
- **Audience:** 8th graders, many below grade level. Short sentences, ~5th-grade reading level, kind and
  specific feedback that names the mistake. Full rules: `_build/BUILD_BRIEF.md`.
- **Look:** Source Serif 4 headings, Inter body, JetBrains Mono for numbers; navy #1E2D4F, gold #FFC107/#E0A800,
  off-white #F7F7F4. No emoji in headings. The shared top bar comes from `site-bar.js`; hub styles from `site.css`.
- **Repeating decimals → fractions: use the 9's rule only.** Never the 100x − x algebra method (not taught).
- **Exponent answers** use positive exponents; include zero and negative exponents; monomials can be multi-variable.
- **Level:** practice should match NC Check-Ins / EOG: multiple choice, select all, numeric entry,
  "how many solutions", word problems, and a "find the error" item.
- **Handouts** are two-sided: front = short notes + sample problems left blank for class (worked on the key);
  back = Check-In style practice (~10). Bell ringers are two-sided too (front and back), landscape.
- **Answer keys** are separate files. Zach's choice (Nov 2026): **all answer keys stay public** on the site (notes, practice, pre-test keys). Do not remove them.
- **Combine** a batch of materials into one PDF (plus one combined key), with bookmarks.
- **Easier versions** for some students are labeled only "Version 2" — never "EC", "modified", etc.
- **Classes:** A1, A2, A4, B5, B6 (8th grade benchmarks). Math 1 is password-gated (see HOW_TO_UPDATE.txt).
- Ask at most a few quick questions up front; if a new format is involved, offer a one-page sample first.
- **Edits to existing material:** discuss and get approval first. Correct approved problems in place; never replace
  or delete existing files, text or material unless Zach approves that specific removal.
- **One PDF per document:** the duplicate "Guided Notes (Print PDF)" copies were removed (2026-10-30). Notes PDFs are
  `UnitN_…_Notes_Blank.pdf` + `_AnswerKey.pdf`; build with `_build/notes_pdf.js` and "-" as the copy argument.
- **Site-wide look:** most pages load `brand.js` (one line), which loads `brand.css` and sets fonts by role on screen
  only. Not on the Arcade and its games, Math 1, or the Fluency Lab. New pages get the line before `</head>`.

## Privacy (hard rules)
- **Never commit student names, rosters, IDs, or any student data.** The repo is public. The class roster lives
  only on the Roster tab of his private Google Sheet. Tests and examples use made-up names.
- Before every commit, check: `git grep -n -i "<any real name you handled>"` returns nothing.

## Where things live
| Path | What |
|---|---|
| `index.html`, `grade8/index.html`, `class-information.html` | Hub pages (cards). |
| `grade8/benchmarks.html` | **NC Check-Ins / Benchmarks** page (all benchmark reviews + PDFs). |
| `grade8/grading.html` | **Grading & Standards** hub (nav label; linked on the 8th grade home page below the Units): SBG, 1–5 scale, decaying average calculator, the ONE student tracker (the tabbed I Can Tracker; the old Standards Tracker was merged into it in Nov 2026) with view-only samples (`images/trackers/ican-*`), I Can Targets and Durable Skills sections. |
| `grade8/durable-skills.html` | Durable Skills (Perseverance, Peer Collaboration, Self-Regulation rubrics + local self-check). |
| `grade8/reset-room.html`, `grade8/ripples.html` | **Reset Room** (Nov 2026; top-bar link): self-regulation hub; Ripples = tap-the-water generative notes (Web Audio), 1/2/3-minute countdown (3 max), breathing guide (4 in/4 out), before/after 1–5 check-in (never saved or sent), settings panel (colors, speed, sound, mood, background beat/rain/hum, repeats, volumes; remembered in localStorage only). Own dark look like the Arcade (no brand.js). Add new calm tools as cards on reset-room.html. `grade8/drift.html` = generative focus music for work time (Web Audio: pads, bass, soft pulse, plucked melody; moods Bright/Deep/Dreamy, pace 60/70/80 bpm, pulse off/soft/steady, melody on/off, optional 10/20/30-min focus timer, Play/Pause, Mute + M key, volume, glow colors). Keeps playing in a background tab (schedules 2.5 s ahead when hidden) but stops if its tab leaves the page, so it always opens in a new tab (top-bar link `newtab: true`, Reset Room card `target=_blank`) and, while playing, it opens every clicked link in a new tab. Top bar: "Chill Math Music" links straight to drift.html; Reset Room's `section` covers ripples (a section can be a list). "Calculators" is a dropdown (`menu:` list in LINKS) with Desmos Scientific/Graphing (new tab). The bar is full and sizes itself by measuring (`fitNav`: full → `t1` → `t2` → `mob` Menu button), so new links can't overflow; check 1366px and 1100px after adding one. |
| `grade8/museum-of-angles.html` | Unit 4/8 treasure-hunt game (generated art; `?all=1` unlocks rooms for demos). |
| `arcade-send.js` | Arcade play logging → `kind:'arcade'` on the Student Work script → "2627 Arcade Results" Sheet (`_build/student_work/ArcadeLog.gs`). Every arcade game includes it; Zero Pair Run, UFO Blaster and Museum of Angles also report answers/rounds. |
| `grade8/anchor_charts.html` | Anchor Charts page: 7 recolored letter-size charts (`grade8/anchor-charts/`, previews `images/anchor/`). Recolor new ones with `_build/anchor/recolor.py IN OUT`; never post the 24x36 posters. |
| `grade8/nitro-numbers.html` | Arcade fact racer (times tables A 1–10, B −10–10, C −20–20; squares/cubes + roots with a few no-estimate irrational items). Logs answers + rounds via `arcade-send.js`; `window.NITRO` exposes generators for tests. |
| `grade8/checkin_benchmark_review.html`, `…_v2.html`, `q1_benchmark_review.html` | Interactive benchmark reviews. |
| `_build/checkin_benchmark/` | Builders + checks for the Check-In pages (`build_page.py`, `build_v2.py`, `check_page.py`, `check_v2.py`, `check_timing.py`). |
| `_build/benchmark/BenchmarkTracker.gs` | Google Apps Script for benchmark results (tests: `node _build/benchmark/test_benchmark_tracker.js`). |
| `benchmark-config.js` | Benchmark Tracker web-app URL + code. `tracker-config.js` = separate Score Tracker (Fluency Lab, pre-tests). |
| `_build/materials/` | **Printable toolkit** — handouts, practice, bell ringers, keys, combine. Start from `new_handout_template.py`; read its README. |
| `grade8/units4-5-tutorial.html` | Units 4–5 tutorial (sends to Score Tracker as unit "4-5"). |
| `grade8/archive/` | Old pages nobody links to (old arcades, old notes, old I Can pages, `guided_notes_units_6_7.html`, `eog_strategies.html`). Kept for future revision, never deleted. Move more with `python3 _build/archive_pages.py grade8/page.html` (fixes its links). |
| Page names | Unit pages use `unitN-pretest`, `unitN-practice-1`, `unitN-notes`, `units3-4-…` (renamed Nov 2026 by `_build/rename_pages.py`, which holds the old→new map). Every old name is a tiny forwarding page (`_build/forward_stub.py`) so Classroom links keep working; never delete those. PDF names were not changed. |
| `grade8/units3-4.html` | Combined Units 3–4 page (2026-27). Built from the Unit 3 and Unit 4 pages by `python3 _build/build_units34.py`; rerun after editing either unit page. |
| `grade8/8th_grade_eog_hub.html` | The one EOG Prep entry point (review → practice → study guide → strategies). |
| `math1/gate.html` | Math 1 password gate: stores only a SHA-256 hash; 3 wrong tries set off a joke alarm (12 s, siren). Change the password per HOW_TO_UPDATE.txt. |
| `grade8/step-work.js` | **Step-by-step workspace** (Nov 2026) for solving equations/inequalities: student picks a move (distribute, combine like terms, add/subtract/multiply/divide both sides), sees what cancels, which terms are alike and how a reciprocal makes 1, then WRITES the next line; exact-fraction checking with feedback that names the mistake (distributing, one side only, sign, forgot to flip, reciprocal). Never shows the answer. Word/angle problems: write the equation first (any equation whose solution matches is accepted), then solve, then find the angles. Auto-attaches on practice pages (via `practice/practice-engine.js`), pre-tests (`QS`; added to `_build/build_pretest.py` and `u34_pretest.py`; replaces the old pick-a-step helper on the Units 3–4 pre-test) and homework (`grade8/homework-steps.js`, problems copied from the HW PDFs; checked by `node _build/test_homework_steps.js`). Unit 5 (Nov 2026): squares and square roots (Find the squares, Square root both sides; positive root for lengths, √n and rounded ≈ answers; any letter; (√n)² exact). Unit 9 (Nov 2026): π is exact (stand-in 355/113, always shown as π) so it cancels; find-the-radius/height on the pre-test and HW 9.2–9.4 (9.3 #6 needs a cube root, not yet). A space after an exponent ends it (r^2 5 = r²·5). Unit 2 (Nov 2026): expression mode (`mountExpr`): student picks an exponent rule (multiply numbers, add/subtract exponents, power of a power/product, zero, negative, adjust sci notation), sees it pictured, writes the next line; checks the final form (positive exponents, each base once, 1 ≤ a < 10 for sci). HW 2.2–2.9 entries use `{expr, sci}`; answers checked in the same test. Unit 6 (Nov 2026): solve for y (`cfg.line`; HW entries `{line: '2x + y = 9'}`, or `{ps: [m, b]}` = write point-slope first, then solve). x is held as a stand-in number (`withX`, `PARAM`) and lines are compared at three x values (`lineSame`); x-terms are green; done when y = mx + b (one x-term, one number); `lineDiag` says which part (x-term or number) is wrong. Find b: setup with any letter (HW 6.6 #10, 6.8 #9, pre-test #18); practice "Solve the system… find x" sets the two sides equal. Done: Units 2, 3, 4, 5, 6, 9. Unit 1 has no equations to solve. Not done: HW 9.3 #6 (cube root), find-the-mistake items, 6.11 #1 (two intercepts). |
| `grade8/one-at-a-time.js` | **One problem at a time** (Nov 2026) on every practice page and pre-test: shows the current problem plus the headings/directions that lead into it, a Progress bar ("6 of 22"), Back / Next, and a finish screen (boxes to jump back, green = answered) before Send my work. "Show all problems" switches to the long page (remembered per device, `localStorage` `oat-mode`); print shows everything. Only hides/shows: checking, scoring and sending are unchanged. Page formats are listed in `FORMATS` at the top (practice engine, pre-tests incl. vocab table, Unit 1 pre-tests, Unit 6 slope-intercept cards, Unit 7/8 tabbed practice, EOG practice, Unit 7/8/9 q-cards). Loaded by `practice/practice-engine.js`, the pre-test builders and a script tag on the other pages. `unit6-practice-tables.html` (guided notes with practice inside) is left as is. Tests that need the long page: set `localStorage oat-mode = 'all'` first. **Cache:** GitHub Pages lets browsers keep a .js file for 10 minutes, so pages load the shared scripts with a version (`practice-engine.js?v=20261109`, `step-work.js?v=…`, `one-at-a-time.js?v=…`, `homework-steps.js?v=…`; also inside practice-engine.js and the builders). After changing one of those scripts, bump the number everywhere (`grep -rl 'v=20261109'`). |
| `grade8/ineq-keys.js` | Tap buttons (x < > ≤ ≥ − Erase) under every inequality answer box (placeholder "e.g. x > 4" or `data-ineq`); Chromebooks can't type ≤/≥. Loaded by the Units 3–4 tutorial + pre-test builders, the Unit 3 Guided Notes, `homework_turn_in.html` (one shared bar per answer page for HW 3.7–3.10 via `data-ineq-bar`), and `practice/practice-engine.js` (auto-loads when an answer contains < > ≤ ≥). Also detects notes `data-ans`/`chkVal` inequality boxes. Add it to any new page with typed inequalities. |
| `brand.js`, `brand.css` | Site-wide fonts/background (see Standing preferences). |
| `HOW_TO_UPDATE.txt` | Zach's plain-language guide (keep it updated when workflows change). |

## Benchmark Tracker (Google)
- Live script: standalone Apps Script project **"Benchmarks"** in Zach's Drive; it writes to the Sheet
  **"Benchmark Results — Mr. Allen's Math Class"**. Payload format: see `finish()` in `q1_benchmark_review.html`.
- Tabs: Roster, Gradebook, A1–B6, Class Summary, Check Names, Submissions, Responses, Question Analysis, Read Me.
- Pages send active time per question; the Gradebook flags RUSHED. "X — Version 2" counts toward benchmark X.
- After changing the .gs: Zach pastes it into the "Benchmarks" project, runs `setup`, then
  Deploy → Manage deployments → pencil → **New version** (keeps the same URL). Claude can verify the Sheet via the Google Drive connector.

## Working efficiently
- Clone shallow with a long timeout (the repo is ~250 MB): `git clone --depth 1 …` (allow 10 min).
- Read only what you need (grep first). Don't re-read big generated HTML; edit the builder and rebuild.
- Verify math in code (`fractions.Fraction`, asserts) and layout with page counts + one low-res contact sheet.
- Local page checks: `python3 -m http.server 8765 --bind 127.0.0.1` from the repo root, then the `check_*.py` scripts.
- Commit with a clear message, `git fetch && git rebase origin/main`, push to `main`, then tell Zach where it is.
