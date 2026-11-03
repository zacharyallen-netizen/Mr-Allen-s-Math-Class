"""Exit ticket: solving equations (NC.8.EE.7) + angle relationships (NC.8.G.5). Two forms, A and B.
Each form: 1 two-step, 1 distributive, 1 distributive + like terms + variables on both sides,
1 missing angle in a right triangle, 1 linear pair with algebra. Keys are a separate file.

    sh _build/materials/get_fonts.sh
    OUT_DIR=/path/to/out python3 _build/materials/exit_eq_angles.py
"""
import sys, os, math
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import angle_pairs as AP                      # straight() figure engine
import kit
from kit import page_head, neg, OUT
from handouts import item, entry, work
from fractions import Fraction as F
render = kit.render
M = "−"
D = "°"

def tri(acute, label_acute="", label_x="x°", w=170):
    """Right triangle drawn to scale: right angle bottom-left, the given acute angle bottom-right."""
    base = w - 40
    hgt = base * math.tan(math.radians(acute))
    s = min(1.0, 105 / hgt)                       # keep it short enough for the box
    b, h = base * s, hgt * s
    x0, y0 = 20, h + 18
    A, B, C = (x0, y0), (x0 + b, y0), (x0, y0 - h)
    sq = 10
    # labels: acute angle just inside B, x just inside C
    ax, ay = B[0] - 30, B[1] - 6
    cx, cy = C[0] + 6, C[1] + 26
    return (f'<svg width="{x0 + b + 20:.0f}" height="{y0 + 10:.0f}" style="margin:4px auto 0">'
            f'<polygon points="{A[0]},{A[1]} {B[0]:.1f},{B[1]} {C[0]},{C[1]:.1f}" fill="#FFF8E1" stroke="#1E2D4F" stroke-width="1.6"/>'
            f'<path d="M{A[0]},{A[1]-sq} h{sq} v{sq}" fill="none" stroke="#1E2D4F" stroke-width="1.2"/>'
            f'<text x="{ax:.1f}" y="{ay:.1f}" font-family="Inter" font-size="11" font-weight="600" fill="#1E2D4F">{label_acute}</text>'
            f'<text x="{cx:.1f}" y="{cy:.1f}" font-family="Inter" font-size="11" font-weight="600" fill="#B07D00">{label_x}</text>'
            f'</svg>')

def lin(a, b, c, d): return F(d - b, a - c)       # ax + b = cx + d

FORMS = {
    "A": dict(
        q1=("5x " + M + " 7 = 18", lin(5, -7, 0, 18), "+7: 5x = 25 → ÷5"),
        q2=("4(x " + M + " 3) = 28", lin(4, -12, 0, 28), "4x − 12 = 28 → 4x = 40 → ÷4"),
        q3=("2(3x + 4) " + M + " x = 3x + 20", lin(5, 8, 3, 20), "6x + 8 − x = 3x + 20 → 5x + 8 = 3x + 20 → 2x = 12"),
        q4=34,
        q5=((3, 15), (2, 15)),            # left (3x + 15)°, right (2x + 15)°
    ),
    "B": dict(
        q1=("4x + 9 = " + M + "11", lin(4, 9, 0, -11), "−9: 4x = −20 → ÷4"),
        q2=("6(x " + M + " 2) = 42", lin(6, -12, 0, 42), "6x − 12 = 42 → 6x = 54 → ÷6"),
        q3=("3(2x " + M + " 5) + 4x = 7x + 9", lin(10, -15, 7, 9), "6x − 15 + 4x = 7x + 9 → 10x − 15 = 7x + 9 → 3x = 24"),
        q4=47,
        q5=((4, -10), (2, 10)),           # left (4x − 10)°, right (2x + 10)°
    ),
}
# verify every answer
assert FORMS["A"]["q1"][1] == 5 and FORMS["A"]["q2"][1] == 10 and FORMS["A"]["q3"][1] == 6
assert FORMS["B"]["q1"][1] == -5 and FORMS["B"]["q2"][1] == 9 and FORMS["B"]["q3"][1] == 8
for k, f in FORMS.items():
    (la, lb), (ra, rb) = f["q5"]
    x = F(180 - lb - rb, la + ra); assert x.denominator == 1
    L, R = la * x + lb, ra * x + rb; assert L + R == 180 and 0 < R < 180
    f["q5x"], f["q5L"], f["q5R"] = int(x), int(L), int(R)
assert FORMS["A"]["q5x"] == 30 and (FORMS["A"]["q5L"], FORMS["A"]["q5R"]) == (105, 75)
assert FORMS["B"]["q5x"] == 30 and (FORMS["B"]["q5L"], FORMS["B"]["q5R"]) == (110, 70)
# check the equations by substitution
assert 5 * 5 - 7 == 18 and 4 * (10 - 3) == 28 and 2 * (3 * 6 + 4) - 6 == 3 * 6 + 20
assert 4 * -5 + 9 == -11 and 6 * (9 - 2) == 42 and 3 * (2 * 8 - 5) + 4 * 8 == 7 * 8 + 9

def expr(a, b):
    sgn = (" + " if b > 0 else " " + M + " ") + str(abs(b)) if b else ""
    return f"({a}x{sgn}){D}"

kit.CSS += """
.et .q{min-height:0}
.et .eqn{font:600 13pt 'Source Serif 4';color:#1E2D4F;text-align:center;margin:6px 0 2px}
.et .fig{display:flex;justify-content:center}
"""

def page(form, key):
    f = FORMS[form]
    head = page_head("NC.8.EE.7 · NC.8.G.5 · Exit Ticket", "Equations &amp; Angle Relationships",
                     f"Form {form} · Show your work. Box your answer.", key)
    x1, x2, x3 = f["q1"][1], f["q2"][1], f["q3"][1]
    a4 = f["q4"]; x4 = 90 - a4; assert a4 + x4 + 90 == 180
    (la, lb), (ra, rb) = f["q5"]
    fig5 = AP.straight(f["q5R"], expr(ra, rb), expr(la, lb), L=92)
    items = [
        item(1, "Two-step equation", f'Solve.<div class="eqn">{f["q1"][0]}</div>',
             work(70, key) + entry(key, f"x = {neg(x1)}"), key, f["q1"][2] + f" → x = {neg(x1)}"),
        item(2, "Distributive property", f'Solve.<div class="eqn">{f["q2"][0]}</div>',
             work(70, key) + entry(key, f"x = {neg(x2)}"), key, f["q2"][2] + f" → x = {neg(x2)}"),
        item(3, "Distribute · combine · both sides", f'Solve.<div class="eqn">{f["q3"][0]}</div>',
             work(95, key) + entry(key, f"x = {neg(x3)}"), key, f["q3"][2] + f" → x = {neg(x3)}", span=True),
        item(4, "Right triangle", f'The triangle has a right angle and a {a4}{D} angle. Find x.<div class="fig">{tri(a4, f"{a4}{D}")}</div>',
             work(30, key) + entry(key, f"x = {x4}{D}"), key, f"The angles add to 180{D}: 180 − 90 − {a4} = {x4}"),
        item(5, "Linear pair", f'The two angles form a linear pair. Find x, then find both angles.<div class="fig">{fig5}</div>',
             work(30, key) + entry(key, f"{f['q5x']}", "x =", 60)
             + entry(key, f"{f['q5L']}{D} and {f['q5R']}{D}", "Angles:", 110), key,
             f"Linear pair adds to 180{D}: {expr(la, lb)[:-1]} + {expr(ra, rb)[:-1]} = 180 → {la + ra}x{(' + ' + str(lb + rb)) if lb + rb > 0 else (' ' + M + ' ' + str(-(lb + rb)) if lb + rb else '')} = 180 → x = {f['q5x']}"),
    ]
    return head + f'<div data-fit class="et"><div class="grid2">{"".join(items)}</div></div>'

if __name__ == "__main__":
    for key in (False, True):
        out = f"{OUT}/Exit_Ticket_Equations_Angles{'_AnswerKey' if key else ''}.pdf"
        render([page("A", key), page("B", key)], out,
               footer="Exit Ticket · Equations & Angles" + (" — Answer Key" if key else ""), fit=True)
        print(out)
