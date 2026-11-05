"""Two-sided bell ringer E (new numbers, same format as D): Multi-step Equations (NC.8.EE.7) + Vertical Angles & Linear Pairs (NC.8.G.5).
Front: multi-step equations, one with a fraction coefficient, every one has exactly one solution.
Back: vertical angles and linear pairs — find missing angles without algebra, then with algebra.

    sh _build/materials/get_fonts.sh
    OUT_DIR=/path/to/out python3 _build/materials/bell5.py
"""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import angle_pairs as AP            # figure engine (cross, straight) + private-temp render
from kit import *
import kit
from fractions import Fraction as F
from bell import CSS_BR
from bell2 import side
kit.CSS += CSS_BR + ".cq:not(.txt){white-space:nowrap}.c{display:flex;flex-direction:column;min-height:2.75in}.c>div:last-child{margin-top:auto!important}.fg{display:flex;justify-content:center;margin:2px 0 0}"
render = kit.render
M = "−"

def solve(lhs, rhs):
    a = (lhs(F(1)) - lhs(F(0))) - (rhs(F(1)) - rhs(F(0)))
    b = rhs(F(0)) - lhs(F(0))
    assert a != 0, "must have exactly one solution"
    return b / a
def xv(v): return "x = " + (M + str(-v) if v < 0 else str(v))

# ── FRONT: multi-step equations (exactly one solution each) ──
A = [
 ("4(x " + M + " 3) + 5 = 21", 7, "4x − 12 + 5 = 21 → 4x − 7 = 21 → 4x = 28", lambda x: 4*(x - 3) + 5, lambda x: 21),
 ("6x + 4 " + M + " 2x = 24", 5, "4x + 4 = 24 → 4x = 20", lambda x: 6*x + 4 - 2*x, lambda x: 24),
 (fr("3", 4) + "x " + M + " 2 = 7", 12, "+2: (3/4)x = 9 → × 4/3: x = 12", lambda x: F(3, 4)*x - 2, lambda x: 7),
]
B = [
 ("5(x + 2) = 3x + 18", 4, "5x + 10 = 3x + 18 → 2x + 10 = 18 → 2x = 8", lambda x: 5*(x + 2), lambda x: 3*x + 18),
 ("7x " + M + " 3(x + 2) = 2x + 10", 8, "7x − 3x − 6 = 2x + 10 → 4x − 6 = 2x + 10 → 2x = 16", lambda x: 7*x - 3*(x + 2), lambda x: 2*x + 10),
 (M + "3(x " + M + " 1) + 7x = 2x + 15", 6, "−3x + 3 + 7x = 2x + 15 → 4x + 3 = 2x + 15 → 2x = 12", lambda x: -3*(x - 1) + 7*x, lambda x: 2*x + 15),
]
for q, want, why, l, r in A + B: assert solve(l, r) == want, (q, solve(l, r))

# ── BACK: angles (figures drawn to scale from these numbers) ──
D = "°"
# C. without algebra
c1 = 53
c2 = 180 - 128; assert c2 == 52
c3 = (180 - 41, 41, 180 - 41); assert c3 == (139, 41, 139) and 41 + sum(c3) == 360
C = [
 ("<div>Find the angle marked ?</div><div class=fg>" + AP.cross(53, "53°", "", "?", "", L=72) + "</div>", f"? = {c1}{D}", "vertical angles are equal"),
 ("<div>Find the angle marked ?</div><div class=fg>" + AP.straight(128, "128°", "?", L=74) + "</div>", f"? = {c2}{D}", "linear pair: 180 − 128"),
 ("<div>Find a, b and c.</div><div class=fg>" + AP.cross(41, "41°", "a", "b", "c", L=72) + "</div>", f"a = {c3[0]}{D}, b = {c3[1]}{D}, c = {c3[2]}{D}", "b is vertical to 41°; a and c make a linear pair with it"),
]
# D. with algebra
x10 = solve(lambda x: 4*x + 8, lambda x: 6*x - 22); assert x10 == 15 and 4*x10 + 8 == 68
x11 = solve(lambda x: (3*x + 20) + 2*x, lambda x: 180); assert x11 == 32 and (3*x11 + 20, 2*x11) == (116, 64)
x12 = solve(lambda x: (5*x - 10) + (x + 10), lambda x: 180); assert x12 == 30 and (5*x12 - 10, x12 + 10) == (140, 40)
DD = [
 ("<div>Find x, then the angle.</div><div class=fg>" + AP.cross(68, "(4x + 8)°", "", "(6x " + M + " 22)°", "", L=84) + "</div>",
  f"x = {x10}; angle = {4*x10+8}{D}", "vertical: 4x + 8 = 6x − 22 → 30 = 2x"),
 ("<div>Find x, then both angles.</div><div class=fg>" + AP.straight(116, "(3x + 20)°", "2x°", L=84) + "</div>",
  f"x = {x11}; {3*x11+20}{D} and {2*x11}{D}", "linear pair: 3x + 20 + 2x = 180 → 5x = 160"),
 ("<div>Find x, then both angles.</div><div class=fg>" + AP.straight(140, "(5x " + M + " 10)°", "(x + 10)°", L=84) + "</div>",
  f"x = {x12}; {5*x12-10}{D} and {x12+10}{D}", "linear pair: 5x − 10 + x + 10 = 180 → 6x = 180"),
]

def items(lst): return [(q, xv(w), why) for q, w, why, *_ in lst]
REM_F = ("<b>Multi-step:</b> 1. Distribute. 2. Combine like terms on each side. 3. Get the x’s on one side. 4. Undo + or −, then × or ÷. &nbsp; "
         "<b>Fraction in front of x?</b> Multiply both sides by its <b>reciprocal</b> (flip it): " + fr("3", 4) + "x = 9 → x = 9 · " + fr("4", 3) + " = 12. &nbsp; "
         "<b>Check:</b> put your answer back in. Both sides should match.")
REM_B = ("<b>Vertical angles</b> (across from each other when two lines cross) are <b>equal</b>. &nbsp; "
         "<b>Linear pair</b> (side by side on a straight line) <b>add to 180°</b>. &nbsp; "
         "<b>With algebra:</b> name the pair → write the equation (equal, or add to 180) → solve for x → plug x back in to find the angle.")
FRONT = [("Solve. Distribute and combine like terms first.", "ans", 3, items(A)),
         ("Solve. Get the x’s on one side.", "ans", 3, items(B))]
BACK = [("Find the missing angles. No algebra needed.", "ans", 3, C),
        ("Write an equation, solve for x, then find the angle(s).", "ans", 3, DD)]

def build(key):
    p1, k = side("E", "Multi-step Equations", "NC.8.EE.7", REM_F, FRONT, key, "Front · Multi-step equations")
    p2, _ = side("E", "Vertical Angles &amp; Linear Pairs", "NC.8.G.5", REM_B, BACK, key, "Back · Missing angles, with and without algebra", k)
    return [p1, p2]

if __name__ == "__main__":
    for key in (False, True):
        render(build(key), f"{OUT}/Bell_Ringer_E_MultiStep_Equations_Angles{'_AnswerKey' if key else ''}.pdf", landscape=True,
               footer="Bell Ringer E · Multi-step Equations & Angle Pairs" + (" — Answer Key" if key else ""), fit=True)
    print("ok")
