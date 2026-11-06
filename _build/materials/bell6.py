"""Two-sided bell ringer F (Nov 2026): Multi-step Equations (NC.8.EE.7) + Vertical Angles & Linear Pairs (NC.8.G.5).
Front: 4 multi-step equations, one needs a reciprocal. Back: 1 vertical-angles and 1 linear-pair problem with algebra.
Same format as Bell Ringers D and E, new numbers.

    sh _build/materials/get_fonts.sh
    OUT_DIR=/path/to/out python3 _build/materials/bell6.py
"""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import angle_pairs as AP            # figure engine (cross, straight) + private-temp render
from kit import *
import kit
from fractions import Fraction as F
from bell import CSS_BR
from bell2 import side
kit.CSS += CSS_BR + (".cq:not(.txt){white-space:nowrap}.c{display:flex;flex-direction:column;min-height:2.75in}"
                     ".c>div:last-child{margin-top:auto!important}.fg{display:flex;justify-content:center;margin:2px 0 0}"
                     ".g2{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}"
                     ".g4{grid-template-columns:repeat(4,minmax(0,1fr))!important}.g4 .c{min-height:3.6in}.g2 .c{min-height:3.6in}"
                     ".cq{white-space:nowrap}.g4 .cq{font-size:.9em}")
render = kit.render
M = "−"
D = "°"

def solve(lhs, rhs):
    a = (lhs(F(1)) - lhs(F(0))) - (rhs(F(1)) - rhs(F(0)))
    b = rhs(F(0)) - lhs(F(0))
    assert a != 0, "must have exactly one solution"
    return b / a
def xv(v): return "x = " + (M + str(-v) if v < 0 else str(v))

# ── FRONT: multi-step equations (exactly one solution each; #3 needs the reciprocal 5/2) ──
A = [
 ("3(x + 4) " + M + " 5 = 22", 5, "3x + 12 − 5 = 22 → 3x + 7 = 22 → 3x = 15", lambda x: 3*(x + 4) - 5, lambda x: 22),
 ("9x " + M + " 6 " + M + " 4x = 34", 8, "5x − 6 = 34 → 5x = 40", lambda x: 9*x - 6 - 4*x, lambda x: 34),
 (fr("2", 5) + "x + 3 = 11", 20, "−3: (2/5)x = 8 → × 5/2: x = 8 · 5/2 = 20", lambda x: F(2, 5)*x + 3, lambda x: 11),
 ("6(x " + M + " 2) = 2x + 16", 7, "6x − 12 = 2x + 16 → 4x − 12 = 16 → 4x = 28", lambda x: 6*(x - 2), lambda x: 2*x + 16),
]
for q, want, why, l, r in A: assert solve(l, r) == want, (q, solve(l, r))

# ── BACK: angles with algebra (figures drawn to scale from these numbers) ──
xv1 = solve(lambda x: 5*x - 12, lambda x: 3*x + 20); assert xv1 == 16 and 5*xv1 - 12 == 3*xv1 + 20 == 68
xl1 = solve(lambda x: (4*x + 15) + (2*x + 45), lambda x: 180); assert xl1 == 20 and (4*xl1 + 15, 2*xl1 + 45) == (95, 85)
BK = [
 ("<div>Vertical angles. Find x, then the angle.</div><div class=fg>" + AP.cross(68, "(5x " + M + " 12)°", "", "(3x + 20)°", "", L=90) + "</div>",
  f"x = {xv1}; angle = {5*xv1-12}{D}", "vertical angles are equal: 5x − 12 = 3x + 20 → 2x = 32"),
 ("<div>Linear pair. Find x, then both angles.</div><div class=fg>" + AP.straight(95, "(4x + 15)°", "(2x + 45)°", L=90) + "</div>",
  f"x = {xl1}; {4*xl1+15}{D} and {2*xl1+45}{D}", "linear pair adds to 180: 6x + 60 = 180 → 6x = 120"),
]

REM_F = ("<b>Multi-step:</b> 1. Distribute. 2. Combine like terms on each side. 3. Get the x’s on one side. 4. Undo + or −, then × or ÷. &nbsp; "
         "<b>Fraction in front of x?</b> Multiply both sides by its <b>reciprocal</b> (flip it). &nbsp; "
         "<b>Check:</b> put your answer back in. Both sides should match.")
REM_B = ("<b>Vertical angles</b> (across from each other when two lines cross) are <b>equal</b>. &nbsp; "
         "<b>Linear pair</b> (side by side on a straight line) <b>add to 180°</b>. &nbsp; "
         "Name the pair → write the equation (equal, or add to 180) → solve for x → plug x back in to find the angle.")
FRONT = [("Solve. Show each step.", "ans", 4, [(q, xv(w), why) for q, w, why, *_ in A])]
BACK = [("Write an equation, solve for x, then find the angle(s).", "ans", 3, BK)]

def build(key):
    p1, k = side("F", "Multi-step Equations", "NC.8.EE.7", REM_F, FRONT, key, "Front · Multi-step equations")
    p2, _ = side("F", "Vertical Angles &amp; Linear Pairs", "NC.8.G.5", REM_B, BACK, key, "Back · Find x, then the angles", k)
    p2 = p2.replace('<div class="g3">', '<div class="g2">', 1)        # two roomy cells on the back
    return [p1, p2]

if __name__ == "__main__":
    for key in (False, True):
        render(build(key), f"{OUT}/Bell_Ringer_F_MultiStep_Equations_Angles{'_AnswerKey' if key else ''}.pdf", landscape=True,
               footer="Bell Ringer F · Multi-step Equations & Angle Pairs" + (" — Answer Key" if key else ""), fit=True)
    print("ok")
