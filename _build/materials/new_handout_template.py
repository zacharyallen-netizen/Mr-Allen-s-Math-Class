"""STARTER TEMPLATE — copy this file, rename it, replace the problems.
Makes a two-sided handout (front: notes + blank sample problems, back: NC Check-In style practice)
and a two-sided bell ringer, each with a separate answer key, then one combined PDF.

    sh _build/materials/get_fonts.sh                      # once per session
    OUT_DIR=/home/claude/outputs python3 _build/materials/my_new_handout.py

Rules: compute every answer in code and assert it (see the asserts below). Answer keys go to the
person only — never into grade8/ (the site is public).
"""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from kit import *                       # page_head, fr, sup, neg, pt, grid, shape, combine, mapping, vtable, numline, render
from fractions import Fraction as F
from handouts import item, mc, sa, entry, work, sample, front_head, back_head, lin
from bell2 import side                  # bell ringer page builder

TOPIC, STD = "Slope from Tables and Graphs", "NC.8.F.4"      # ← change

# ── FRONT: short notes + blank sample problems (key shows the worked steps in green)
def front(key):
    h = front_head(f"{STD} · Notes", TOPIC, "One-line subtitle", key)
    notes = '<div class="box navyb"><h3>Key idea</h3><div>slope = rise ÷ run = change in y ÷ change in x</div></div>'
    m = F(7 - 3, 4 - 2); assert m == 2                         # verify every answer
    samples = sample("1 · From two points", "(2, 3) and (4, 7)", ["(7 − 3) ÷ (4 − 2) = 4 ÷ 2", "<b>m = 2</b>"], key)
    return h + f'<div data-fit>{notes}<div class="grid2">{samples}</div></div>'

# ── BACK: practice (multiple choice, select all, numeric entry, find the error)
def back(key):
    h = back_head(f"{STD} · Practice", TOPIC, "Show your work. Check every answer.", key)
    items = [
        item(1, "Multiple choice", "What is the slope through (1, 2) and (3, 8)?", mc(["2", "3", "6", "⅓"], 1, key, 4), key, "6 ÷ 2 = 3"),
        item(2, "Numeric entry", "Find the slope through (0, 5) and (2, 1).", entry(key, "−2"), key, "−4 ÷ 2"),
        item(3, "Select all", "Select ALL lines with a positive slope.", sa(["y = 2x", "y = −x + 1", "y = 0.5x − 3"], [0, 2], key), key),
        item(4, "Find the error", "Lee says the slope through (1, 4) and (3, 0) is 2. Fix it.", work(30, key), key, "(0 − 4) ÷ (3 − 1) = −2"),
    ]
    assert F(8 - 2, 3 - 1) == 3 and F(1 - 5, 2 - 0) == -2 and F(0 - 4, 3 - 1) == -2
    return h + f'<div data-fit><div class="grid2">{"".join(items)}</div></div>'

# ── BELL RINGER: parts = [(directions, kind, columns 3 or 4, [(question, answer, short why), ...])]
#    kind: "ans" (write the answer), "RI" (rational/irrational + why), "tf" (true/false), "yn" (yes/no), "ri" (R/I)
def bell(key):
    parts = [("Find the slope.", "ans", 4, [("(1, 1) and (2, 4)", "3", "3 ÷ 1"), ("(0, 0) and (5, 10)", "2", "")])]
    p, _ = side("C", TOPIC, STD, "slope = rise ÷ run", parts, key, "Front")
    return [p]

if __name__ == "__main__":
    name = "Slope"
    for key in (False, True):
        render([front(key), back(key)], f"{OUT}/{name}{'_AnswerKey' if key else ''}.pdf", footer=TOPIC + (" — Answer Key" if key else ""), fit=True)
        render(bell(key), f"{OUT}/{name}_BellRinger{'_AnswerKey' if key else ''}.pdf", landscape=True, footer="Bell Ringer" + (" — Answer Key" if key else ""), fit=True)
    print("built in", OUT)
