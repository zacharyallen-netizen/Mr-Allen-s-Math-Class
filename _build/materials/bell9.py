"""Bell Ringer K (Nov 16, 2026, Zach: "4 multistep equations, not too tricky but one rational coefficient for the variable
and 2 questions on linear pairs and vertical angles. PDF, no answer key. Same format.").
Same portrait layout as I/J (bell8.py). Front: 4 multi-step equations (#3 has a fraction in front of x). Back: 1 vertical
pair + 1 linear pair. Student copy only (no key asked for); answers checked below with exact fractions.

    OUT_DIR=/path/to/out python3 _build/materials/bell9.py
"""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import bell8 as B8
from bell7 import cell, blank, AP, page_head, F, M, render, OUT, tx

EQS = ["3(x + 2) " + M + " 4 = 17",
       "7x " + M + " 3x + 6 = 30",
       tx("[3/4]x") + " " + M + " 2 + 5 = 12",
       "5x " + M + " 2(x " + M + " 4) = x + 18"]
# exact answer checks
x = F(5); assert 3*(x + 2) - 4 == 17
x = F(6); assert 7*x - 3*x + 6 == 30
x = F(12); assert F(3, 4)*x - 2 + 5 == 12
x = F(5); assert 5*x - 2*(x - 4) == x + 18
V = ("(4x + 9)°", "(6x " + M + " 13)°", 53); x = 11; assert 4*x + 9 == 6*x - 13 == 53
L = ("(2x + 25)°", "(5x + 15)°", 65); x = 20; assert 2*x + 25 == 65 and 5*x + 15 == 115 and 65 + 115 == 180

def build():
    p1 = page_head("Bell Ringer K · NC.8.EE.7", "Multi-step Equations", "Front · Solve each one", False)
    p1 += f'<div data-fit><div class="rem"><b>Remember:</b> {B8.REM_F} <b>Fraction in front of x?</b> Multiply both sides by its <b>reciprocal</b> (flip it).</div><div class="part">A. Solve. Show each step, lined up under like terms.</div><div class="g2">'
    for i, q in enumerate(EQS):
        p1 += cell(i + 1, "Solve: " + q, False, blank(), " eq4")
    p1 += "</div></div>"
    p2 = page_head("Bell Ringer K · NC.8.G.5", "Vertical Angles &amp; Linear Pairs", "Back · Find x, then the angle(s)", False)
    p2 += f'<div data-fit><div class="rem"><b>Remember:</b> {B8.REM_B}</div><div class="part">B. Name the pair, write an equation, solve for x, then find the angle(s).</div><div class="g2">'
    p2 += cell(5, "Vertical angles. Find x, then the angle.", False, f'<div class="fg">{AP.cross(V[2], V[0], "", V[1], "", L=95)}</div>' + blank(), " ang2")
    p2 += cell(6, "Linear pair. Find x, then both angles.", False, f'<div class="fg">{AP.straight(L[2], L[0], L[1], L=95)}</div>' + blank(), " ang2")
    p2 += "</div></div>"
    return [p1, p2]

if __name__ == "__main__":
    render(build(), f"{OUT}/Bell_Ringer_K_MultiStep_Equations_Angles.pdf", landscape=False,
           footer="Bell Ringer K · Multi-step Equations & Angle Pairs", fit=True)
    print("ok")
