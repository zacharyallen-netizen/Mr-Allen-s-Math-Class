"""Bell Ringers I and J (Nov 12, 2026, Zach: "4 multi step equations, one vertical pair and one linear pair problem").
Portrait, same look as G/H (bell7.py). Front: 4 multi-step equations. Back: 1 vertical pair + 1 linear pair.
Keys: every solution lined up under like terms (bell7.work), every line checked with exact fractions.

    OUT_DIR=/path/to/out python3 _build/materials/bell8.py
"""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import bell7 as B
from bell7 import work, eq_check, cell, blank, AP, page_head, F, M, render, OUT
import kit
kit.CSS += ".c.eq4{min-height:3.55in}.c.ang2{min-height:6.2in}.c.ang2 .cq{white-space:normal}.c.ang2 .aw{font-size:12.5px;column-gap:5px}.c.ang2 .aw-lab{font-size:9.5px;padding:1px 4px}"

def sub(L, R, iL, iR, t, cancelL=False, cancelR=False, lab=""):
    x = set()
    if cancelL: x.add(("L", iL))
    if cancelR: x.add(("R", iR))
    return dict(L=L, rel="=", R=R, ops={"L": {iL: t}, "R": {iR: t}}, x=x, lab=lab)
def div(L, R, d, lab): return dict(L=L, rel="=", R=R, div=d, x={("L", 0), ("L", "d")}, lab=lab)
def end(v): return dict(L=["x"], rel="=", R=[v])

SETS = {
 "I": dict(
  eqs=[
   ("3(x + 4) " + M + " 5 = 2x + 11", ("=", 4), [
     dict(L=["3(x + 4)", "− 5"], rel="=", R=["2x", "+ 11"], lab="Distribute"),
     dict(L=["3x", "+ 12", "− 5"], rel="=", R=["2x", "+ 11"], lab="Combine like terms"),
     sub(["3x", "+ 7"], ["2x", "+ 11"], 0, 0, "− 2x", cancelR=True, lab="Subtract 2x"),
     sub(["x", "+ 7"], ["11"], 1, 0, "− 7", cancelL=True, lab="Subtract 7"), end("4")]),
   ("7x " + M + " 4 " + M + " 3x = 2(x + 5)", ("=", 7), [
     dict(L=["7x", "− 4", "− 3x"], rel="=", R=["2(x + 5)"], lab="Combine; distribute"),
     sub(["4x", "− 4"], ["2x", "+ 10"], 0, 0, "− 2x", cancelR=True, lab="Subtract 2x"),
     sub(["2x", "− 4"], ["10"], 1, 0, "+ 4", cancelL=True, lab="Add 4"),
     div(["2x"], ["14"], "2", "Divide by 2"), end("7")]),
   ("5(x " + M + " 1) + 2 = 3x " + M + " 11", ("=", -4), [
     dict(L=["5(x − 1)", "+ 2"], rel="=", R=["3x", "− 11"], lab="Distribute"),
     dict(L=["5x", "− 5", "+ 2"], rel="=", R=["3x", "− 11"], lab="Combine like terms"),
     sub(["5x", "− 3"], ["3x", "− 11"], 0, 0, "− 3x", cancelR=True, lab="Subtract 3x"),
     sub(["2x", "− 3"], ["−11"], 1, 0, "+ 3", cancelL=True, lab="Add 3"),
     div(["2x"], ["−8"], "2", "Divide by 2"), end("−4")]),
   ("6x " + M + " 2(x + 3) = x + 9", ("=", 5), [
     dict(L=["6x", "− 2(x + 3)"], rel="=", R=["x", "+ 9"], lab="Distribute"),
     dict(L=["6x", "− 2x", "− 6"], rel="=", R=["x", "+ 9"], lab="Combine like terms"),
     sub(["4x", "− 6"], ["x", "+ 9"], 0, 0, "− x", cancelR=True, lab="Subtract x"),
     sub(["3x", "− 6"], ["9"], 1, 0, "+ 6", cancelL=True, lab="Add 6"),
     div(["3x"], ["15"], "3", "Divide by 3"), end("5")]),
  ],
  v=("(7x " + M + " 20)°", "(5x + 8)°", 78, ("=", 14), "x = 14; each angle = 78°", [
     sub(["7x", "− 20"], ["5x", "+ 8"], 0, 0, "− 5x", cancelR=True, lab="Subtract 5x"),
     sub(["2x", "− 20"], ["8"], 1, 0, "+ 20", cancelL=True, lab="Add 20"),
     div(["2x"], ["28"], "2", "Divide by 2"), end("14")]),
  l=("(2x + 32)°", "(4x + 10)°", 78, ("=", 23), "x = 23; the angles are 78° and 102°", [
     dict(L=["(2x + 32)", "+ (4x + 10)"], rel="=", R=["180"], lab="Combine"),
     sub(["6x", "+ 42"], ["180"], 1, 0, "− 42", cancelL=True, lab="Subtract 42"),
     div(["6x"], ["138"], "6", "Divide by 6"), end("23")]),
 ),
 "J": dict(
  eqs=[
   ("4(x " + M + " 2) + 3 = 2x + 9", ("=", 7), [
     dict(L=["4(x − 2)", "+ 3"], rel="=", R=["2x", "+ 9"], lab="Distribute"),
     dict(L=["4x", "− 8", "+ 3"], rel="=", R=["2x", "+ 9"], lab="Combine like terms"),
     sub(["4x", "− 5"], ["2x", "+ 9"], 0, 0, "− 2x", cancelR=True, lab="Subtract 2x"),
     sub(["2x", "− 5"], ["9"], 1, 0, "+ 5", cancelL=True, lab="Add 5"),
     div(["2x"], ["14"], "2", "Divide by 2"), end("7")]),
   ("9x + 6 " + M + " 4x = 3(x " + M + " 4)", ("=", -9), [
     dict(L=["9x", "+ 6", "− 4x"], rel="=", R=["3(x − 4)"], lab="Combine; distribute"),
     sub(["5x", "+ 6"], ["3x", "− 12"], 0, 0, "− 3x", cancelR=True, lab="Subtract 3x"),
     sub(["2x", "+ 6"], ["−12"], 1, 0, "− 6", cancelL=True, lab="Subtract 6"),
     div(["2x"], ["−18"], "2", "Divide by 2"), end("−9")]),
   (M + "3(x + 1) + 8x = 22", ("=", 5), [
     dict(L=["−3(x + 1)", "+ 8x"], rel="=", R=["22"], lab="Distribute"),
     dict(L=["−3x", "− 3", "+ 8x"], rel="=", R=["22"], lab="Combine like terms"),
     sub(["5x", "− 3"], ["22"], 1, 0, "+ 3", cancelL=True, lab="Add 3"),
     div(["5x"], ["25"], "5", "Divide by 5"), end("5")]),
   ("2(3x + 1) " + M + " x = 3x + 20", ("=", 9), [
     dict(L=["2(3x + 1)", "− x"], rel="=", R=["3x", "+ 20"], lab="Distribute"),
     dict(L=["6x", "+ 2", "− x"], rel="=", R=["3x", "+ 20"], lab="Combine like terms"),
     sub(["5x", "+ 2"], ["3x", "+ 20"], 0, 0, "− 3x", cancelR=True, lab="Subtract 3x"),
     sub(["2x", "+ 2"], ["20"], 1, 0, "− 2", cancelL=True, lab="Subtract 2"),
     div(["2x"], ["18"], "2", "Divide by 2"), end("9")]),
  ],
  v=("(6x " + M + " 7)°", "(3x + 32)°", 71, ("=", 13), "x = 13; each angle = 71°", [
     sub(["6x", "− 7"], ["3x", "+ 32"], 0, 0, "− 3x", cancelR=True, lab="Subtract 3x"),
     sub(["3x", "− 7"], ["32"], 1, 0, "+ 7", cancelL=True, lab="Add 7"),
     div(["3x"], ["39"], "3", "Divide by 3"), end("13")]),
  l=("(3x + 24)°", "(5x " + M + " 4)°", 84, ("=", 20), "x = 20; the angles are 84° and 96°", [
     dict(L=["(3x + 24)", "+ (5x − 4)"], rel="=", R=["180"], lab="Combine"),
     sub(["8x", "+ 20"], ["180"], 1, 0, "− 20", cancelL=True, lab="Subtract 20"),
     div(["8x"], ["160"], "8", "Divide by 8"), end("20")]),
 ),
}
# exact checks (every line is checked again inside work())
for S in SETS.values():
    for q, (r, v), ls in S["eqs"]: eq_check(ls, r, v)
    for k in ("v", "l"): eq_check(S[k][5], "=", S[k][3][1])
assert 7*14 - 20 == 5*14 + 8 == 78 and 2*23 + 32 == 78 and 4*23 + 10 == 102
assert 6*13 - 7 == 3*13 + 32 == 71 and 3*20 + 24 == 84 and 5*20 - 4 == 96

REM_F = ("<b>Solve:</b> 1. Distribute. 2. Combine like terms on each side. 3. Get the x’s on one side. 4. Undo + or −, then × or ÷. "
         "Write each move <b>under its like term on BOTH sides</b>. &nbsp; <b>Check:</b> put your answer back in.")
REM_B = ("<b>Vertical angles</b> (across from each other) are <b>equal</b>. A <b>linear pair</b> (side by side on a line) <b>adds to 180°</b>. &nbsp; "
         "Name the pair → write the equation → solve for x → plug x back in to find the angle(s).")

def build(letter, key):
    S = SETS[letter]
    p1 = page_head(f"Bell Ringer {letter} · NC.8.EE.7", "Multi-step Equations", "Front · Solve each one", key)
    p1 += f'<div data-fit><div class="rem"><b>Remember:</b> {REM_F}</div><div class="part">A. Solve. Show each step, lined up under like terms.</div><div class="g2">'
    for i, (q, rx, ls) in enumerate(S["eqs"]):
        p1 += cell(i + 1, "Solve: " + q, key, work(ls, (rx[0], F(rx[1]))) if key else blank(), " eq4")
    p1 += "</div></div>"
    p2 = page_head(f"Bell Ringer {letter} · NC.8.G.5", "Vertical Angles &amp; Linear Pairs", "Back · Find x, then the angle(s)", key)
    p2 += f'<div data-fit><div class="rem"><b>Remember:</b> {REM_B}</div><div class="part">B. Name the pair, write an equation, solve for x, then find the angle(s).</div><div class="g2">'
    a1, a2, deg, rx, txt, ls = S["v"]
    p2 += cell(5, "Vertical angles. Find x, then the angle.", key,
               f'<div class="fg">{AP.cross(deg, a1, "", a2, "", L=95)}</div>' + ((work(ls, (rx[0], F(rx[1]))) + f'<div class="angans">{txt}</div>') if key else blank()), " ang2")
    b1, b2, t, rx2, txt2, ls2 = S["l"]
    p2 += cell(6, "Linear pair. Find x, then both angles.", key,
               f'<div class="fg">{AP.straight(t, b1, b2, L=95)}</div>' + ((work(ls2, (rx2[0], F(rx2[1]))) + f'<div class="angans">{txt2}</div>') if key else blank()), " ang2")
    p2 += "</div></div>"
    return [p1, p2]

if __name__ == "__main__":
    for letter in ("I", "J"):
        for key in (False, True):
            render(build(letter, key), f"{OUT}/Bell_Ringer_{letter}_MultiStep_Equations_Angles{'_AnswerKey' if key else ''}.pdf", landscape=False,
                   footer=f"Bell Ringer {letter} · Multi-step Equations & Angle Pairs" + (" — Answer Key" if key else ""), fit=True)
    print("ok")
