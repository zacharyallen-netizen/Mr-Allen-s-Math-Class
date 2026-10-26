# _build — the scripts behind the site

Nothing in this folder is a student page. It holds the generators, checks and
the Score Tracker script used to build and test Mr. Allen's Math Class.
The scripts assume the site lives at `/home/claude/mr-allen-s-math-class`
(change the path at the top of a script if you run it somewhere else).
Python 3, Node 18+ and Playwright with Chromium are needed.

## Generated pages — edit the SOURCE here, then rebuild
| What | Rebuild with | Notes |
|---|---|---|
| 8th-grade pre-tests (Units 2 Sci. Notation, 3–9) | `python3 build_all_units.py` and `python3 unit2_sci.py` | Engine `build_pretest.py`, diagrams `pretest_svg.py`, `u4viz.py`, style `pretest_style.css`. PDFs: `node render_all.js` (answer key = #reveal). |
| Unit 1 (Forms A, B) and Unit 2 Exponent Rules PDFs | `node u12pdf/make_u12_pdfs.js` | PDFs are printed straight from the online pages, so they always match. |
| Math 1 pre-tests (Units 1–8) | `cd m1pre && python3 build_m1.py` then `node render_m1.js` | Items in `units_a.py`, `units_b.py`; diagrams `m1svg.py`. |
| Math 1 notes + practice | Units 1–2 `node m1/u12/tools/build.js` · Units 3–4 `python3 m1/u34/build.py` · Units 5–6 `python3 m1/u56/build.py` · Units 7–8 `node m1/u78/build/u7n.js` (u7p, u8n, u8p) | The page HTML is generated: a hand edit to the page is lost on the next rebuild, so change the source here. |
| Math 1 study guide | `node m1/guide/build.js` | |
| Materials Index | `python3 build_matidx.py` | Reads every grade8 unit page, so new materials appear automatically. |
| Hub look / shared top bar | `makeover.py`, `rollout.py` | Already applied; kept for reference. The bar itself is `/site-bar.js`, the hub style `/site.css`. |

## Score Tracker (Google Apps Script)
`tracker/ScoreTracker_v2.gs` is the script pasted into Google (see the update guide).
Version 3 (`tracker/ScoreTracker_v3.gs`, Roster + name matching + Flashpoint tab) holds the class list, so it is
git-ignored and kept off the website: paste steps in `tracker/HOW_TO_UPDATE_SCRIPT.md`. Tests:
`node tracker/test_tracker_v3.js`, `node tracker/test_survey_v3.js`, `node tracker/test_real_export.js <Sheet export>`,
and (repo served on 127.0.0.1:8742) `node tracker/v3_flash/test_flashpoint.js`.
Test it without Google: `cd tracker && node test_tracker.js` (a strict stand-in for Google Sheets).
`node tracker/check_payload.js file.json` checks a page's "Send my work" data against the real script.
`tracker/calib.js` re-runs the calibration of the practice cut-offs.

## Benchmark Tracker (Google Apps Script, separate Sheet)
`benchmark/BenchmarkTracker.gs` receives results from the interactive benchmark reviews (`grade8/q1_benchmark_review.html`);
its address goes in `/benchmark-config.js`. Tests: `node benchmark/test_benchmark_tracker.js`;
page end to end (serve the repo on 127.0.0.1:8765 first): `python3 benchmark/check_page.py`, then
`node benchmark/check_payload.js benchmark/payload_*.json`. The PDF and key come from `benchmark/q1_pdf.py`.
NC Check-In review (`grade8/checkin_benchmark_review.html`, NS.1 · EE.1 · EE.7 · F.1 · G.3): built by
`checkin_benchmark/build_page.py` from the same content as the printable packet (`checkin_benchmark/checkin_pdf.py`,
fonts via FONT_DIR; the answer key is written outside the repo on purpose). Same payload as Q1.
Check: `python3 checkin_benchmark/check_page.py` (server on 8765), then `node benchmark/check_payload.js checkin_benchmark/payload_*.json`.

## Site checks
- `node audit.js <site> out.json pages.txt` — every page at 390 and 1280: errors, sideways scroll, bar overlap.
- `node audit_m1.js` — Math 1 pages incl. clipped diagram labels.
- `node eog3/play.js eog_math_review_game.html g 900` (and `play2.js` with N=60 / 45) — plays the EOG games end to end.
- `node verify_lab.js` (Fluency Lab), `node pt_grade.js` (pre-test keys), `node send_repro.js` (Send panel).
- `node fluency_sweep.js` solves every level of all 8 Fluency Labs at phone and desktop widths (page errors, sideways scroll).
  `node fluency_progress_test.js` plays a set of 10 on every lab, sends (to a fake address), reloads, and checks the saved level.
  `node fluency_typetest.js <lab> <levels> <count>` types answers key by key, with a wrong answer every 5th problem, e.g. `node fluency_typetest.js decimals 1,2,3 30`.

## Briefs
`BUILD_BRIEF.md`, `final/*.md`, `m1/M1_BRIEF.md`, `tracker/WIRE_BRIEF.md` record the house rules
(language level, notation, visuals drawn from each problem's own numbers, verification) used for every build.
- `node u9_pdfs.js` rebuilds the Unit 9 worksheet and answer key PDFs from volume_practice.html (pictures come from grade8/u9shapes.js).
