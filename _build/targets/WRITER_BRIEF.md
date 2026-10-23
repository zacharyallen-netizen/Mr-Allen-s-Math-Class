# Brief: write I Can Target practice questions (multiple choice)

You are writing practice questions for Mr. Allen's 8th grade math website (NC Math 8, IC Imagine charter school, NC).
Many of his students are 2–4 grade levels behind, so wording must be **short, plain, and friendly** (about a
grade 5–6 reading level). Accuracy matters more than anything: a wrong answer key or a wrong diagram is a serious bug.

## Your job
Write **exactly one multiple-choice question for each target code you are assigned** and save them as a JSON array in
the file named in your assignment (`/home/claude/work/data/q_<group>.json`). Do not edit any other file.

Each target's data is in `/home/claude/work/data/targets.json` (fields: code, standard, title, level, score, ican,
lesson, lesson_url, old_question, old_answer). `old_question`/`old_answer` are yesterday's open-ended practice items for
the same target — reuse good ideas, but **re-check their math** and convert to multiple choice.

### Match the question to the target
* The question must test **exactly what the "I can" statement says**, at its level:
  * **Approaching (3)** — basic, one or two steps (DOK 2).
  * **Proficient (4)** — multi-step, error analysis, or apply in context (DOK 3).
  * **Mastery (5)** — complex/multi-step, justify, explain why, real-world reasoning (DOK 3–4). For "explain/justify"
    targets, ask "Which explanation/argument is correct?" with distractors that contain a real flaw.
* Stay inside NC Math 8. Use realistic contexts, US units, and numbers that work out cleanly unless rounding is the skill.

## JSON format (one object per target, in target order)
```json
{
  "code": "G.8-3",
  "stem": "Find the distance between A(1, 1) and B(4, 5).",
  "visual": { ...optional, see below... },
  "choices": [
    {"t": "5 units",  "why": "The legs are 3 and 4, so 3² + 4² = 25 and √{25} = 5."},
    {"t": "7 units",  "why": "7 is 3 + 4. You added the legs instead of squaring them."},
    {"t": "25 units", "why": "25 is c². Take the square root as the last step."},
    {"t": "√{7} units", "why": "You added 3 + 4 before squaring. Square each leg first."}
  ],
  "hint": "Draw the right triangle. How long is each leg?",
  "explain": ["Horizontal leg: 4 − 1 = 3. Vertical leg: 5 − 1 = 4.", "3² + 4² = 9 + 16 = 25.", "c = √{25} = 5, so AB = 5 units."]
}
```
* **The FIRST choice is always the correct one.** The page shuffles choices for students.
* Exactly **4 choices**. Each wrong choice must come from a **real, common mistake**, and its `why` names that mistake
  kindly in one or two short sentences ("You added the legs instead of squaring them."). The correct choice's `why` is a
  one-sentence confirmation.
* **Exactly one choice may be correct.** Watch for equivalent forms (2/3 and 4/6; 0.5 and 1/2; 36π and 113.04;
  "x = 5" and "5"). If two choices are mathematically equal, change one.
* Keep choices parallel in form and similar in length — the right answer must not stand out as the longest or most
  detailed. No "all of the above" / "none of the above".
* `hint`: one sentence that points the way without giving the answer.
* `explain`: 2–5 short steps that fully solve it.

### Text markup (stem, choices, why, hint, explain, table cells)
* Plain text plus these HTML tags only: `<b> <i> <sup> <sub> <br> <small>`. Write `&lt;` and `&gt;` for < and > signs
  (or use ≤ ≥). Never use `<` inside text.
* Exponents: `x<sup>2</sup>` or the characters ² ³ (only for squares/cubes). Negative exponent: `10<sup>−3</sup>`.
* **Minus sign: always `−` (U+2212)**, never a hyphen. Times: `×` (or `·`). Divide: `÷`.
* Stacked fraction: `{{3|4}}` → ¾ stacked. Use stacked fractions for fractions in math (not "3/4" inline), except inside
  coordinate pairs or very simple ratios.
* Radical with a bar: `√{50}` → √50 with an overline. `∛{27}` is not supported; write `∛27`.
* Use π, °, ≈, ≠, ∥, ⊥, △, ∠ characters directly.

## Visuals
Required for **Units 4–9** whenever the question involves a figure, a graph, a scatter plot, a table, a solid, or a
transformation — which is nearly all of them. Optional but welcome for Units 1–3 (number lines, tables). Use a visual
any time it would help a struggling student see the problem. A visual may be:

1. **Coordinate graph** (preferred for any graph — drawn exactly to scale by the page):
```json
{"type":"coord", "x":[-6,6], "y":[-6,6], "xstep":1, "ystep":1, "xlabels":1, "ylabels":1,
 "axes":"cross", "readout":true, "alt":"short description",
 "points":[{"x":1,"y":3,"label":"A(1, 3)","pos":"ne","color":"blue","open":false}],
 "lines":[{"m":2,"b":1,"label":"y = 2x + 1","color":"blue"}, {"x":3}, {"through":[[0,0],[2,4]]},
          {"segment":[[1,1],[4,1]],"color":"gold","dashed":true,"label":"3","labelAt":[2.5,0.6],"anchor":"middle"}],
 "polygons":[{"pts":[[1,1],[3,1],[3,4]],"labels":["A","B","C"],"color":"blue","fill":true,"dashed":false}],
 "curves":[{"pts":[[0,0],[1,2],[3,2],[5,0]],"color":"blue"}],
 "texts":[{"x":2,"y":5,"t":"label","color":"ink","anchor":"middle"}]}
```
   * Colors: `blue, red, gold, green, ink, muted`. `pos` for point labels: n, s, e, w, ne, nw, se, sw.
   * Scatter plots / real-world graphs: use `"axes":"frame"`, `"scatter":true`, `"xtitle"`, `"ytitle"`, ranges that fit
     the data, `xstep`/`ystep` for grid spacing, `xlabels`/`ylabels` = label every n-th grid line, and `"height"` (px)
     when the y scale differs from x (default width is 320 px via `"size"`).
   * `"readout":true` lets students tap the graph to read coordinates — turn it on for graphs where reading points matters.
   * Coordinate questions about transformations: draw the pre-image (blue) and, only if the question gives it, the image
     (red or gold, `"dashed":true` optional).
2. **Raw SVG** for angle diagrams, triangles, solids, number lines, etc.:
   `{"type":"svg","svg":"<svg viewBox=\"0 0 360 220\">…</svg>","alt":"…","wide":false,"caption":"optional"}`
   * Must start with `<svg` and include a `viewBox`. Width 280–520 units is typical. No `<style>`, `<script>`,
     `<image>`, `<foreignObject>`, no `width`/`height` needed.
   * **Do not use hex colors.** Use these classes: strokes `s-ink s-muted s-blue s-gold s-red s-green`; fills
     `f-none f-ink f-white f-soft f-goldsoft f-redsoft f-greensoft f-blue f-gold f-red f-green f-muted`; text `t-blue t-gold
     t-red t-green t-muted` (text defaults to dark ink). Set `stroke-width`, `font-size` (13–16), `text-anchor`,
     `font-weight` as attributes. For labels sitting on lines add `paint-order="stroke" stroke="#fff" stroke-width="3"`
     (the white halo is the one allowed literal color).
   * **Compute every coordinate** (write a small Python script) so the picture is to scale and consistent with the
     numbers: a 35° angle must look like 35°, parallel lines must be parallel, a right-angle box only on a true 90°
     corner, a 3-4-5 triangle must have sides in ratio 3:4:5, squares must be squares. Solids: draw cylinders/cones
     with elliptical bases, dashed hidden edges, labeled r/d and h with dimension lines.
   * Angle arcs: mark the angles the question names (arc + label). Label points with capital letters.
3. **Table**: `{"type":"table","header":["x","y"],"rows":[["0","3"],["1","5"]],"caption":"optional","rowheads":false}`
   (cells use the text markup above; two-way tables: set `"rowheads":true`).
4. A **list** of visuals `[{…},{…}]` shows them side by side (e.g., two graphs to compare).

**A choice can itself be a visual** (e.g., "Which graph shows…?"): `{"t": {"type":"coord", …, "size":170}, "why":"…"}`.
Use small sizes (size 150–180) for choice graphs and keep all four comparable.

**Never put the answer in the picture** (no solved angle, no drawn image when the question asks for the image, no
hypotenuse length when that is what's asked).

## Check your work (required)
1. Keep your helper scripts in `/home/claude/work/scratch/<group>/` (create it). Write a Python script that
   recomputes every numeric answer and asserts the first choice is right and the other three are wrong.
2. Validate: `python3 /home/claude/work/tools/build.py --check | grep -E "^(<your codes regex>)"` — fix everything
   until none of your codes appear (lines from other writers' files are not yours; ignore them).
3. Look at every card: render previews 5–6 cards at a time and **open each PNG with the Read tool and actually look**:
   ```
   python3 /home/claude/work/tools/build.py --preview G.8-1,G.8-2,G.8-3 /home/claude/work/scratch/<group>/p1.html
   node /home/claude/work/tools/shot.js /home/claude/work/scratch/<group>/p1.html /home/claude/work/scratch/<group>/p1.png --answer
   ```
   (`--answer` clicks the right answer so the explanation shows. Ignore any "ERR_TUNNEL_CONNECTION_FAILED" font error.)
   Check: diagram matches the numbers, nothing overlaps or is cut off, labels readable, fractions/exponents render,
   no answer leaked into the picture. Fix and re-render until every card is clean.
4. Final self-review pass: read each question as a student who is 2 grades behind — is it clear? Is exactly one
   answer right?

## What to report back (keep it short)
* The codes you wrote (should be all of them) and the path of your JSON file.
* Any target whose "I can" statement is unclear, beyond NC Math 8, duplicated by another target, or mismatched to its
  level — one line each, with a suggested fix. (Mr. Allen asked us to review the targets document carefully.)
* Anything you were unsure about in your own answer keys.
