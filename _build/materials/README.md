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
| `bell.py` | Bell ringer cell styles + helpers: `rep("27")` repeating decimal with bar, `nines("27")` 9's rule value, `RULES` (exponent rules box). |
| `equations.py` | `flowchart()` for solving equations/inequalities. |
| `functions.py` | `curve`, `circle`, `dots`, `is_function` for function graphs. |
| `transform.py` | Exact transformation rules `tr, RX, RY, R90, R180, R270, dil(k)` and `fig()` for pre-image/image grids. |
| `new_handout_template.py` | Copy this to start any new handout + bell ringer. |
| `combine.py` | Merge PDFs into one with bookmarks. |

## Rules that keep it fast and right
- Compute every answer in Python (`Fraction`) and `assert` it before rendering.
- Check layout cheaply: `pdfinfo` page counts, then one low-res contact sheet (`pdftoppm -r 45`), not page-by-page screenshots.
- Repeating decimals: **9's rule only** (no 100x − x algebra) — Mr. Allen's classes have not covered the algebra method.
