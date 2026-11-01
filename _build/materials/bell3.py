"""Two-sided bell ringer C: Solving Equations (NC.8.EE.7) — two-step, distributive, variables on both sides, multi-step."""
import sys, os
sys.path.insert(0, os.path.dirname(__file__))
from kit import *
import kit
from fractions import Fraction as F
from bell import CSS_BR
from bell2 import side
kit.CSS += CSS_BR + ".cq:not(.txt){white-space:nowrap}.c{display:flex;flex-direction:column;min-height:2.05in}.c>div:last-child{margin-top:auto!important}"

def solve(lhs, rhs):
    """lhs, rhs are functions of x that are linear. Returns the value, 'none', or 'all'."""
    a = (lhs(F(1)) - lhs(F(0))) - (rhs(F(1)) - rhs(F(0)))
    b = rhs(F(0)) - lhs(F(0))
    if a == 0: return "all" if b == 0 else "none"
    return b / a
def chk(lhs, rhs, want):
    got = solve(lhs, rhs); assert got == want, (got, want); return got

M = "−"
def xv(v): return "x = " + (M + str(-v) if v < 0 else str(v))

# ── Front ──
A = [  # two-step
 ("3x + 5 = 20", 5, "−5, then ÷3",            lambda x: 3*x + 5, lambda x: 20),
 (fr("x", 4) + " " + M + " 2 = 3", 20, "+2, then ×4", lambda x: x/4 - 2, lambda x: 3),
 (M + "2x + 7 = 15", -4, "−7, then ÷(−2)",    lambda x: -2*x + 7, lambda x: 15),
]
B = [  # distributive
 ("4(x " + M + " 3) = 20", 8, "4x − 12 = 20",            lambda x: 4*(x - 3), lambda x: 20),
 (M + "3(2x + 1) = 21", -4, "−6x − 3 = 21",              lambda x: -3*(2*x + 1), lambda x: 21),
 ("2(x + 5) " + M + " 4 = 12", 3, "2x + 10 − 4 = 12 → 2x + 6 = 12", lambda x: 2*(x + 5) - 4, lambda x: 12),
]
# ── Back ──
C = [  # variables on both sides
 ("5x + 2 = 3x + 10", 4, "2x + 2 = 10",       lambda x: 5*x + 2, lambda x: 3*x + 10),
 ("2x + 9 = " + M + "x " + M + " 6", -5, "3x + 9 = −6", lambda x: 2*x + 9, lambda x: -x - 6),
 ("4x + 3 " + M + " x = 2(x + 5)", 7, "3x + 3 = 2x + 10", lambda x: 4*x + 3 - x, lambda x: 2*(x + 5)),
]
D = [  # multi-step, how many solutions, find the error
 ("2(x + 3) = 2x + 5", "none", "2x + 6 = 2x + 5 → 6 = 5 is false", lambda x: 2*(x + 3), lambda x: 2*x + 5),
 ("3(x + 2) " + M + " x = 2(x + 3)", "all", "2x + 6 = 2x + 6 → always true", lambda x: 3*(x + 2) - x, lambda x: 2*(x + 3)),
]
for q, want, why, l, r in A + B + C + D: chk(l, r, F(want) if isinstance(want, int) else want)
# find the error: Lee solved 5x − 2 = 2x + 7 and wrote 3x = 5, x = 5/3
assert solve(lambda x: 5*x - 2, lambda x: 2*x + 7) == 3

def items(lst):
    out = []
    for q, want, why, *_ in lst:
        a = {"none": "No solution", "all": "Infinitely many solutions"}.get(want) if isinstance(want, str) else xv(want)
        out.append((q, a, why))
    return out
ERR = [("Lee solved 5x " + M + " 2 = 2x + 7 and wrote 3x = 5. What went wrong? Solve it the right way.",
        "Lee subtracted 2. Add 2: 3x − 2 = 7 → 3x = 9 → x = 3", "")]

REM_F = ("<b>Undo in reverse order.</b> Use inverse operations: undo + or − first, then undo × or ÷. Do the same thing to <b>both sides</b>. &nbsp; "
         "<b>Distributive property:</b> multiply the number outside by <b>every</b> term inside: 3(x − 4) = 3x − 12. Watch the signs: "
         + M + "2(x − 5) = " + M + "2x + 10. &nbsp; <b>Check:</b> put your answer back in. Both sides should match.")
REM_B = ("<b>Variables on both sides:</b> move the x-terms to one side (add or subtract), then solve like a two-step. &nbsp; "
         "<b>Multi-step:</b> 1. Distribute. 2. Combine like terms on each side. 3. Get x on one side. 4. Solve. &nbsp; "
         "<b>How many solutions?</b> One answer (x = 4): <b>one solution</b>. The x’s cancel and you get something false (6 = 5): <b>no solution</b>. "
         "The x’s cancel and you get something true (6 = 6): <b>infinitely many</b>.")
FRONT = [("Solve each two-step equation. Show your work.", "ans", 3, items(A)),
         ("Use the distributive property. Then solve.", "ans", 3, items(B))]
BACK = [("Solve. Get the x’s on one side. Show your work.", "ans", 3, items(C)),
        ("How many solutions? If the x’s cancel, write <b>no solution</b> or <b>infinitely many</b>. Then find the error.", "ans", 3, items(D) + ERR)]
from bell import cell
def err_part(start, key):
    return ('<div class="part">E. Find the mistake and fix it.</div><div class="wide">'
            + cell(start, *ERR[0], "ans", key) + '</div>')

def build(key):
    p1, k = side("C", "Solving Equations", "NC.8.EE.7", REM_F, FRONT, key, "Front · Two-step and distributive")
    p2, k2 = side("C", "Solving Equations", "NC.8.EE.7", REM_B, BACK, key, "Back · Variables on both sides and multi-step", k)
    return [p1, p2]

if __name__ == "__main__":
    for key in (False, True):
        render(build(key), f"{OUT}/Bell_Ringer_C_Solving_Equations{'_AnswerKey' if key else ''}.pdf", landscape=True,
               footer="Bell Ringer C · Solving Equations" + (" — Answer Key" if key else ""), fit=True)
    print("ok")
