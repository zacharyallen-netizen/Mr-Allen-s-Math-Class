# Printable materials toolkit (handouts, practice, bell ringers)

Builds PDFs in the site's look (Source Serif 4 / Inter / JetBrains Mono, navy #1E2D4F + gold #FFC107).
Answer keys are separate files and go **only to Mr. Allen** — never into `grade8/` (the site is public).

## Quick start
```sh
sh _build/materials/get_fonts.sh                          # once per session
cp _build/materials/new_handout_template.py _build/materials/<topic>.py   # edit the problems
OUT_DIR=/home/claude/outputs python3 _build/materials/<topic>.py
python3 _build/materials/combine.py ALL.pdf "Title A=a.pdf" "Title B=b.pdf"
```

## Files
| File | What it is |
|---|---|
| `kit.py` | Look + helpers: `page_head`, `fr` (stacked fraction), `sup`, `neg` (true minus), `grid` (coordinate plane from explicit lines), `shape`, `mapping`, `vtable`, `numline`, and `render(pages, path, landscape, footer, fit=True)`. `fit=True` scales each page's `[data-fit]` block to fill exactly one page. |
| `handouts.py` | The two-sided handout format: `item`, `mc` (multiple choice), `sa` (select all), `entry` (numeric entry), `work`, `sample` (blank in-class example; worked in green on the key), `front_head`, `back_head`. Holds the Equations, Functions A/B, Transformations A/B handouts (Oct 2026). |
| `bell2.py` | Two-sided bell ringers. `side(letter, title, std, remember, parts, key, label)`; parts are `(directions, kind, cols, items)`. Holds Bell Ringer A (NS.1) and B (EE.1). |
| `bell5.py` | Bell Ringer E: multi-step equations + vertical angles &amp; linear pairs (same format as D, new numbers). |
| `bell6.py` | Bell Ringer F (Nov 2026): 4 multi-step equations (#3 needs a reciprocal) + 1 vertical-angles and 1 linear-pair problem with algebra. |
| `bell7.py` | Bell Ringers G and H (Nov 12, 2026): front = 1 multi-step equation, 1 multi-step inequality (flip), 1 vertical pair, 1 linear pair; back = one long equation (distribute a fraction → x gets a fraction coefficient; other x-terms cancel). Keys show every solution **lined up under like terms** (`work()`: moves under each like term on both sides, cancels crossed out, fraction bar for ÷, reciprocal in front), every line checked with `Fraction`. |
| `bell.py` | Bell ringer cell styles + helpers: `rep("27")` repeating decimal with bar, `nines("27")` 9's rule value, `RULES` (exponent rules box). |
| `equations.py` | `flowchart()` for solving equations/inequalities. |
| `functions.py` | `curve`, `circle`, `dots`, `is_function` for function graphs. |
| `transform.py` | Exact transformation rules `tr, RX, RY, R90, R180, R270, dil(k)` and `fig()` for pre-image/image grids. |
| `new_handout_template.py` | Copy this to start any new handout + bell ringer. |
| `combine.py` | Merge PDFs into one with bookmarks. |
| `u34_sets.py`, `u34_quizzes.py` | Units 3–4 (Nov 2026): Sets 1–3 handouts (transversals; solutions &amp; inequalities; triangle theorems + review) and Quiz A/B. Shared look `u34.css`, helpers `u34_common.py` (student + key from one HTML), figures `u34_figs.py`. `OUT_DIR=... python3 u34_sets.py set1 set2 set3`. |
| `u34_notes.py` | Units 3–4 Notes Packet (Nov 2026): 4 two-sided sheets. Notes 1 label the 5 angle pairs + missing angles; Notes 2 none/one/infinite + inequalities (with an error-analysis item); Notes 3 Triangle Sum + Exterior Angle theorems; Notes 4 word problems (word bank, 7 steps, tips). Every answer and angle size is asserted (angles match the drawing: acute vs obtuse). `OUT_DIR=... python3 u34_notes.py` → each sheet + `Units3-4_Notes_Packet.pdf` and `_AnswerKey.pdf` (bookmarked). |
| `anchor_v2.py` | Version 2 anchor charts (Units 1, 2, 3, 4–5, 6, 7, 8): color-coded KNOW IT / STEPS / EXAMPLE / WATCH OUT sections, colored step numbers, one sheet front + back each. `python3 anchor_v2.py [1 2 3 4-5 6 7 8]`. |

## Rules that keep it fast and right
- Compute every answer in Python (`Fraction`) and `assert` it before rendering.
- Check layout cheaply: `pdfinfo` page counts, then one low-res contact sheet (`pdftoppm -r 45`), not page-by-page screenshots.
- Repeating decimals: **9's rule only** (no 100x − x algebra) — Mr. Allen's classes have not covered the algebra method.
