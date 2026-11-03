"""Two-sided bell ringer D: Multi-step Equations (NC.8.EE.7) + Vertical Angles & Linear Pairs (NC.8.G.5).
Front: multi-step equations, one with a fraction coefficient, every one has exactly one solution.
Back: vertical angles and linear pairs — find missing angles without algebra, then with algebra.

    sh _build/materials/get_fonts.sh
    OUT_DIR=/path/to/out python3 _build/materials/bell4.py
"""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import angle_pairs as AP            # figure engine (cross, straight) + private-temp render
from kit import *
import kit
from fractions import Fraction as F
from bell import CSS_BR
from bell2 import side
kit.CSS += CSS_BR + ".cq:not(.txt){white-space:nowrap}.c{display:flex;flex-direction:column;min-height:2.05in}.c>div:last-child{margin-top:auto!important}.fg{display:flex;justify-content:center;margin:2px 0 0}"
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
 ("3(x " + M + " 2) + 4 = 13", 5, "3x − 6 + 4 = 13 → 3x − 2 = 13 → 3x = 15", lambda x: 3*(x - 2) + 4, lambda x: 13),
 ("5x " + M + " 3 + 2x = 25", 4, "7x − 3 = 25 → 7x = 28", lambda x: 5*x - 3 + 2*x, lambda x: 25),
 (fr("2", 3) + "x + 4 = 10", 9, "−4: (2/3)x = 6 → × 3/2: x = 9", lambda x: F(2, 3)*x + 4, lambda x: 10),
]
B = [
 ("4(x + 1) = 2x + 16", 6, "4x + 4 = 2x + 16 → 2x + 4 = 16 → 2x = 12", lambda x: 4*(x + 1), lambda x: 2*x + 16),
 ("6x " + M + " 2(x " + M + " 3) = 3x + 8", 2, "6x − 2x + 6 = 3x + 8 → 4x + 6 = 3x + 8", lambda x: 6*x - 2*(x - 3), lambda x: 3*x + 8),
 (M + "2(x + 4) + 5x = x " + M + " 2", 3, "−2x − 8 + 5x = x − 2 → 3x − 8 = x − 2 → 2x = 6", lambda x: -2*(x + 4) + 5*x, lambda x: x - 2),
]
for q, want, why, l, r in A + B: assert solve(l, r) == want, (q, solve(l, r))

# ── BACK: angles (figures drawn to scale from these numbers) ──
D = "°"
# C. without algebra
c1 = 48;  assert c1 == 48                       # vertical angle of 48°
c2 = 180 - 117; assert c2 == 63                 # linear pair with 117°
c3 = (180 - 35, 35, 180 - 35); assert c3 == (145, 35, 145) and 35 + sum(c3) == 360
C = [
 ("<div>Find the angle marked ?</div><div class=fg>" + AP.cross(48, "48°", "", "?", "", L=72) + "</div>", f"? = {c1}{D}", "vertical angles are equal"),
 ("<div>Find the angle marked ?</div><div class=fg>" + AP.straight(117, "117°", "?", L=74) + "</div>", f"? = {c2}{D}", "linear pair: 180 − 117"),
 ("<div>Find a, b and c.</div><div class=fg>" + AP.cross(35, "35°", "a", "b", "c", L=72) + "</div>", f"a = {c3[0]}{D}, b = {c3[1]}{D}, c = {c3[2]}{D}", "b is vertical to 35°; a and c make a linear pair with it"),
]
# D. with algebra
x10 = solve(lambda x: 3*x + 12, lambda x: 5*x - 20); assert x10 == 16 and 3*x10 + 12 == 60
x11 = solve(lambda x: (2*x + 30) + 4*x, lambda x: 180); assert x11 == 25 and (2*x11 + 30, 4*x11) == (80, 100)
x12 = solve(lambda x: (3*x - 15) + (x + 15), lambda x: 180); assert x12 == 45 and (3*x12 - 15, x12 + 15) == (120, 60)
DD = [
 ("<div>Find x, then the angle.</div><div class=fg>" + AP.cross(60, "(3x + 12)°", "", "(5x " + M + " 20)°", "", L=84) + "</div>",
  f"x = {x10}; angle = {3*x10+12}{D}", "vertical: 3x + 12 = 5x − 20 → 32 = 2x"),
 ("<div>Find x, then both angles.</div><div class=fg>" + AP.straight(80, "(2x + 30)°", "4x°", L=84) + "</div>",
  f"x = {x11}; {2*x11+30}{D} and {4*x11}{D}", "linear pair: 2x + 30 + 4x = 180 → 6x = 150"),
 ("<div>Find x, then both angles.</div><div class=fg>" + AP.straight(120, "(3x " + M + " 15)°", "(x + 15)°", L=84) + "</div>",
  f"x = {x12}; {3*x12-15}{D} and {x12+15}{D}", "linear pair: 3x − 15 + x + 15 = 180 → 4x = 180"),
]

def items(lst): return [(q, xv(w), why) for q, w, why, *_ in lst]
REM_F = ("<b>Multi-step:</b> 1. Distribute. 2. Combine like terms on each side. 3. Get the x’s on one side. 4. Undo + or −, then × or ÷. &nbsp; "
         "<b>Fraction in front of x?</b> Multiply both sides by its <b>reciprocal</b> (flip it): " + fr("2", 3) + "x = 6 → x = 6 · " + fr("3", 2) + " = 9. &nbsp; "
         "<b>Check:</b> put your answer back in. Both sides should match.")
REM_B = ("<b>Vertical angles</b> (across from each other when two lines cross) are <b>equal</b>. &nbsp; "
         "<b>Linear pair</b> (side by side on a straight line) <b>add to 180°</b>. &nbsp; "
         "<b>With algebra:</b> name the pair → write the equation (equal, or add to 180) → solve for x → plug x back in to find the angle.")
FRONT = [("Solve. Distribute and combine like terms first.", "ans", 3, items(A)),
         ("Solve. Get the x’s on one side.", "ans", 3, items(B))]
BACK = [("Find the missing angles. No algebra needed.", "ans", 3, C),
        ("Write an equation, solve for x, then find the angle(s).", "ans", 3, DD)]

def build(key):
    p1, k = side("D", "Multi-step Equations", "NC.8.EE.7", REM_F, FRONT, key, "Front · Multi-step equations")
    p2, _ = side("D", "Vertical Angles &amp; Linear Pairs", "NC.8.G.5", REM_B, BACK, key, "Back · Missing angles, with and without algebra", k)
    return [p1, p2]

if __name__ == "__main__":
    for key in (False, True):
        render(build(key), f"{OUT}/Bell_Ringer_D_MultiStep_Equations_Angles{'_AnswerKey' if key else ''}.pdf", landscape=True,
               footer="Bell Ringer D · Multi-step Equations & Angle Pairs" + (" — Answer Key" if key else ""), fit=True)
    print("ok")
