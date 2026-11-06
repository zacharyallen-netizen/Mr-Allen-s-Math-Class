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
- **Answer keys** are always separate files, sent only to Zach — never posted in `grade8/` (the site is public).
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
| `grade8/museum-of-angles.html` | Unit 4/8 treasure-hunt game (generated art; `?all=1` unlocks rooms for demos). |
| `arcade-send.js` | Arcade play logging → `kind:'arcade'` on the Student Work script → "2627 Arcade Results" Sheet (`_build/student_work/ArcadeLog.gs`). Every arcade game includes it; Zero Pair Run, UFO Blaster and Museum of Angles also report answers/rounds. |
| `grade8/anchor_charts.html` | Anchor Charts page: 7 recolored letter-size charts (`grade8/anchor-charts/`, previews `images/anchor/`). Recolor new ones with `_build/anchor/recolor.py IN OUT`; never post the 24x36 posters. |
| `grade8/nitro-numbers.html` | Arcade fact racer (times tables A 1–10, B −10–10, C −20–20; squares/cubes + roots with a few no-estimate irrational items). Logs answers + rounds via `arcade-send.js`; `window.NITRO` exposes generators for tests. |
| `grade8/checkin_benchmark_review.html`, `…_v2.html`, `q1_benchmark_review.html` | Interactive benchmark reviews. |
| `_build/checkin_benchmark/` | Builders + checks for the Check-In pages (`build_page.py`, `build_v2.py`, `check_page.py`, `check_v2.py`, `check_timing.py`). |
| `_build/benchmark/BenchmarkTracker.gs` | Google Apps Script for benchmark results (tests: `node _build/benchmark/test_benchmark_tracker.js`). |
| `benchmark-config.js` | Benchmark Tracker web-app URL + code. `tracker-config.js` = separate Score Tracker (Fluency Lab, pre-tests). |
| `_build/materials/` | **Printable toolkit** — handouts, practice, bell ringers, keys, combine. Start from `new_handout_template.py`; read its README. |
| `grade8/angles_pythagorean_tutorial.html` | Units 4–5 tutorial (sends to Score Tracker as unit "4-5"). |
| `grade8/guided_notes_units_6_7.html` | Hidden (no links) since Nov 2026: its content lives in the Unit 6 notes (tabs 6.4–6.6) and Unit 7 notes. Keep the file. |
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
