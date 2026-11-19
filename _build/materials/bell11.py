"""Bell Ringer N + Formative Quiz 2 (Nov 19, 2026, Zach: "a bell ringer with this on one side: solving an equation
with infinite answers, solving a two step equation with an inequality, graphing two 2 step linear inequalities (one
will need the flip the rule sign to be used) and 3 problems on identifying and solving for angles in a parallel lines
with a transversal. One of these should involve solving for X. On the back, will be the same exact thing, just
different problems, but labelled formative quiz 2. PDF. One page front and back. Separate answer page.").

Portrait, same look as L/M (bell10.py). Each side, one page: #1 how-many-solutions equation (infinitely many),
#2 two-step inequality (solve), #3-#4 two-step inequalities solved and graphed (exactly one flips), then a numbered
parallel-lines picture with #5 (congruent pair), #6 (supplementary pair) and #7 (solve for x). Keys: lined-up work,
every line checked with exact fractions; angles drawn to scale from their own measure (transversals.pfig).

    OUT_DIR=/path/to/out python3 _build/materials/bell11.py
"""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from bell7 import work, eq_check, cell, blank, page_head, F, M, render, OUT, lin
import kit
import transversals as TV
from bell10 import sub, div, end, ns, ns_work, how_many, tv_fig

SIDES = {
 "N": dict(title="Bell Ringer N", label="Front",
  ns=("3(x + 4) " + M + " x = 2x + 12", "inf", [
     ns(["3(x + 4)", "− x"], ["2x", "+ 12"], lab="Distribute"),
     ns(["3x", "+ 12", "− x"], ["2x", "+ 12"], lab="Combine like terms"),
     ns(["2x", "+ 12"], ["2x", "+ 12"], ops={"L": {0: "− 2x"}, "R": {0: "− 2x"}}, x={("L", 0), ("R", 0)}, lab="Subtract 2x: the x's cancel"),
     ns(["12"], ["12"])]),
  solve=("4x + 5 < 21", ("<", 4), [
     sub(["4x", "+ 5"], ["21"], 1, 0, "− 5", rel="<", lab="Subtract 5"),
     div(["4x"], ["16"], "4", "Divide by 4 (positive: no flip)", rel="<"), end("<", "4")]),
  ineqs=[
   ("2x " + M + " 3 ≥ 7", (">=", 5), [
     sub(["2x", "− 3"], ["7"], 1, 0, "+ 3", rel="≥", lab="Add 3"),
     div(["2x"], ["10"], "2", "Divide by 2 (positive: no flip)", rel="≥"), end("≥", "5")], (5, True, False)),
   (M + "3x + 4 > 10", ("<", -2), [
     sub(["−3x", "+ 4"], ["10"], 1, 0, "− 4", rel=">", lab="Subtract 4"),
     div(["−3x"], ["6"], "−3", "Divide by −3: FLIP > to <", rel=">"), end("<", "−2")], (-2, False, True)),
  ],
  # ∠2 = 62°. ∠7 alternate exterior = 62°. ∠4 linear pair = 118°. ∠5 = (3x + 13)° alternate interior with ∠4 → x = 35.
  tv=dict(th=62, given=2, cong=7, cpair="alternate exterior", supp=4, spair="linear pair",
          xk=5, xe=(3, 13), x=35, xwith=4, xpair="alternate interior"),
 ),
 "Q": dict(title="Formative Quiz 2", label="Back",
  ns=("4(x " + M + " 2) + 3 = 4x " + M + " 5", "inf", [
     ns(["4(x − 2)", "+ 3"], ["4x", "− 5"], lab="Distribute"),
     ns(["4x", "− 8", "+ 3"], ["4x", "− 5"], lab="Combine like terms"),
     ns(["4x", "− 5"], ["4x", "− 5"], ops={"L": {0: "− 4x"}, "R": {0: "− 4x"}}, x={("L", 0), ("R", 0)}, lab="Subtract 4x: the x's cancel"),
     ns(["−5"], ["−5"])]),
  solve=("5x " + M + " 7 > 18", (">", 5), [
     sub(["5x", "− 7"], ["18"], 1, 0, "+ 7", rel=">", lab="Add 7"),
     div(["5x"], ["25"], "5", "Divide by 5 (positive: no flip)", rel=">"), end(">", "5")]),
  ineqs=[
   ("3x + 2 ≤ " + M + "7", ("<=", -3), [
     sub(["3x", "+ 2"], ["−7"], 1, 0, "− 2", rel="≤", lab="Subtract 2"),
     div(["3x"], ["−9"], "3", "Divide by 3 (positive: no flip)", rel="≤"), end("≤", "−3")], (-3, True, True)),
   ("6 " + M + " 2x < 14", (">", -4), [
     dict(L=["6", "− 2x"], rel="<", R=["14"], ops={"L": {0: "− 6"}, "R": {0: "− 6"}}, x={("L", 0)}, lab="Subtract 6"),
     div(["−2x"], ["8"], "−2", "Divide by −2: FLIP < to >", rel="<"), end(">", "−4")], (-4, False, False)),
  ],
  # ∠3 = 71°. ∠6 alternate interior = 71°. ∠5 same-side interior = 109°. ∠8 = (4x − 11)° vertical with ∠5 → x = 30.
  tv=dict(th=71, given=3, cong=6, cpair="alternate interior", supp=5, spair="same-side interior",
          xk=8, xe=(4, -11), x=30, xwith=5, xpair="vertical angles"),
 ),
}

# ── exact checks ──
for S in SIDES.values():
    q, kind, lines = S["ns"]
    for ln in lines:
        (a1, b1), (a2, b2) = lin(ln["L"]), lin(ln["R"])
        assert a1 == a2 and b1 == b2 and kind == "inf", (q, ln)
    q, (rel, v), lines = S["solve"]; eq_check(lines, rel, v)
    assert not any("FLIP" in d.get("lab", "") for d in lines)
    for q, (rel, v), lines, nl in S["ineqs"]:
        eq_check(lines, rel, v)
        at, closed, left = nl
        assert at == v and closed == ("=" in rel) and left == (rel[0] == "<")
        assert -6 < at < 6
    assert sum(1 for q, rv, l, n in S["ineqs"] if any("FLIP" in d.get("lab", "") for d in l)) == 1
    t = S["tv"]; th = t["th"]; g = TV.meas(t["given"], th)
    assert TV.pair(t["given"], t["cong"]) == t["cpair"] and TV.RULE[t["cpair"]] == "C" and TV.meas(t["cong"], th) == g
    assert TV.pair(t["given"], t["supp"]) == t["spair"] and TV.RULE[t["spair"]] == "S" and TV.meas(t["supp"], th) == 180 - g
    assert TV.pair(t["xk"], t["xwith"]) == t["xpair"] and TV.RULE[t["xpair"]] == "C"
    assert t["xe"][0] * t["x"] + t["xe"][1] == TV.meas(t["xk"], th) == TV.meas(t["xwith"], th)
    t["g"] = g
# numbers stated in the problems
assert 3 * (F(7) + 4) - 7 == 2 * 7 + 12 and 4 * (F(9) - 2) + 3 == 4 * 9 - 5
assert 4 * 4 + 5 == 21 and 5 * 5 - 7 == 18 and 2 * 5 - 3 == 7 and -3 * -2 + 4 == 10 and 3 * -3 + 2 == -7 and 6 - 2 * -4 == 14

REM = ("<b>Solve:</b> undo + and − first, then × and ÷. Line up each move <b>under its like term</b>. "
       "<b>If the x’s cancel:</b> TRUE (5 = 5) → <b>infinitely many solutions</b>; FALSE (5 = 2) → <b>no solution</b>. "
       "<b>Inequality:</b> multiply or divide by a <b>negative</b> → <b>flip</b> the sign. ● closed for ≤ ≥, ○ open for &lt; &gt;. "
       "<b>Angles:</b> corresponding, alternate interior, alternate exterior and vertical angles are <b>equal</b>; "
       "same-side interior and a linear pair <b>add to 180°</b>.")

def NW(h): return f'<span style="white-space:nowrap">{h}</span>'

def build(sid, key):
    S = SIDES[sid]
    K = lambda v: f'<span class="tvk">{v}</span>' if key else '<span class="ln"></span>'
    p = page_head(f"{S['title']} · NC.8.EE.7 · NC.8.G.5", "Equations, Inequalities &amp; Parallel Lines",
                  f"{S['label']} · Show your work", key)
    p += f'<div data-fit><div class="rem"><b>Remember:</b> {REM}</div>'
    p += '<div class="part">A. Solve.</div><div class="g2">'
    q, kind, lines = S["ns"]
    p += cell(1, "Solve. How many solutions?<br>" + NW(q), key,
              (ns_work(lines, kind) if key else '<div style="flex:1"></div>') + how_many(kind, key), " eqN")
    q, rv, lines = S["solve"]
    body = work(lines, (rv[0], F(rv[1]))) if key else '<div style="flex:1"></div><div style="margin-top:6px">Answer: <span class="ln"></span></div>'
    p += cell(2, "Solve: " + NW(q), key, body, " eqN")
    p += '</div><div class="part">B. Solve. Then graph your answer on the number line.</div><div class="g2">'
    for i, (q, rv, lines, nl) in enumerate(S["ineqs"]):
        at, closed, left = nl
        line = kit.numline(-6, 6, at if key else None, closed, left, w=300)
        body = (work(lines, (rv[0], F(rv[1]))) if key else '<div style="flex:1"></div>') + f'<div class="nlw">{line}</div>'
        if not key: body += '<div style="margin-top:6px">Answer: <span class="ln"></span></div>'
        p += cell(i + 3, "Solve and graph: " + NW(q), key, body, " in2")
    t = S["tv"]; g, c, s_ = t["given"], t["cong"], t["supp"]
    p += (f'</div><div class="part">C. Lines <i>m</i> and <i>n</i> are parallel. Line <i>t</i> is a transversal. ∠{g} = {t["g"]}°.</div>'
          f'<div class="tvc"><div class="fgw">{tv_fig(t)}</div><div class="g3">')
    p += cell(5, f"Find ∠{c}.", key, f'<div class="tvp"><div>Pair type:<br>{K(t["cpair"])}</div><div>Equal or add to 180°?<br>{K("Equal")}</div><div>∠{c} = {K(str(t["g"]) + "°")}</div></div>', " an")
    p += cell(6, f"Find ∠{s_}.", key, f'<div class="tvp"><div>Pair type:<br>{K(t["spair"])}</div><div>Equal or add to 180°?<br>{K("Add to 180°")}</div><div>∠{s_} = {K(str(180 - t["g"]) + "°")}'
              + (f'<br><span class="tvk">180 − {t["g"]} = {180 - t["g"]}</span>' if key else "") + "</div></div>", " an")
    a, b = t["xe"]; ang = TV.meas(t["xk"], t["th"])
    why = f'∠{t["xk"]} and ∠{t["xwith"]} are {t["xpair"]}, so ∠{t["xk"]} = {ang}°.'
    p += cell(7, "Find x.<br>" + NW(f"∠{t['xk']} = {TV.ex(a, b)}"), key,
              '<div class="tvp">' + (f'<span class="tvk" style="font-weight:600">{why}</span><br><span class="tvk">{TV.lin(a, b)} = {ang}<br>{a}x = {ang - b}</span><br>'
                                     if key else '<div style="flex:1;min-height:1.0in"></div>') + f'x = {K(t["x"])}</div>', " an")
    p += "</div></div></div>"
    return [p]

kit.CSS += """
.c.eqN{min-height:2.2in}.c.in2{min-height:2.1in}.c.an{min-height:1.9in}
.tvc{display:grid;grid-template-columns:auto 1fr;gap:12px;align-items:start}
"""

if __name__ == "__main__":
    for key in (False, True):
        pages = build("N", key) + build("Q", key)
        render(pages, f"{OUT}/Bell_Ringer_N_Formative_Quiz_2{'_AnswerKey' if key else ''}.pdf", landscape=False,
               footer="Bell Ringer N / Formative Quiz 2 · Equations, Inequalities & Parallel Lines" + (" — Answer Key" if key else ""), fit=True)
    print("ok")
