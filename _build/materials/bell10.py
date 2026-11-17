"""Bell Ringers L and M (Nov 17, 2026, Zach: "3 equations (one should require the reciprocal), 2 inequalities with
number lines and a parallel lines and transversal problem that involves identifying angle relationships and solving
for angles or solving for x. Same format, PDF, answer key should be separate. I need two versions.").

Portrait, same look as G-K (bell7.py). Front: 3 equations (#3 = fraction in front of x, multiply by the reciprocal).
Back: 2 inequalities, each graphed on a number line (one needs the sign flipped), then one parallel-lines problem:
name the pair, congruent or supplementary, solve for x, find the angle, then find one more numbered angle.
Keys: every solution lined up under like terms (bell7.work), every line checked with exact fractions; the number line
is drawn from the checked answer; the figure is drawn to scale from its own angle (transversals.pfig).

    OUT_DIR=/path/to/out python3 _build/materials/bell10.py
"""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from bell7 import work, eq_check, cell, blank, page_head, F, M, render, OUT, tx
import kit
import transversals as TV

kit.CSS += """
.c.eqA{min-height:3.7in}.c.eqB{min-height:3.2in}.c.in2{min-height:3.0in}.c.in2 .cq{white-space:normal}
.nlw{display:flex;justify-content:center;margin-top:auto;padding-top:6px}
.c.tv{min-height:4.4in}.c.tv .cq{white-space:normal}
.tvg{display:grid;grid-template-columns:auto 1fr;gap:14px;align-items:start;margin-top:4px}
.tvp{font:500 13px/1.45 Inter,sans-serif;color:#1E2D4F}.tvp>div{margin:0 0 9px}
.tvp .ch{display:inline-block;border:1.2px solid #9AA3B5;border-radius:12px;padding:0 8px;margin:2px 3px 0 0;font-size:12px}
.tvp .ch.ok{border:2px solid #15803D;color:#15803D;font-weight:700}
.tvp .ln{min-width:1.1in}.tvk{color:#15803D;font-weight:700}
"""
G, NAVYC = TV.GOLDC, TV.NAVYC

def sub(L, R, iL, iR, t, rel="=", cancelL=True, lab=""):
    return dict(L=L, rel=rel, R=R, ops={"L": {iL: t}, "R": {iR: t}}, x={("L", iL)} if cancelL else set(), lab=lab)
def div(L, R, d, lab, rel="="): return dict(L=L, rel=rel, R=R, div=d, x={("L", 0), ("L", "d")}, lab=lab)
def end(rel, v): return dict(L=["x"], rel=rel, R=[v])

SETS = {
 "L": dict(
  eqs=[
   ("4(x " + M + " 3) + 5 = 17", ("=", 6), [
     dict(L=["4(x − 3)", "+ 5"], rel="=", R=["17"], lab="Distribute"),
     dict(L=["4x", "− 12", "+ 5"], rel="=", R=["17"], lab="Combine like terms"),
     sub(["4x", "− 7"], ["17"], 1, 0, "+ 7", lab="Add 7"),
     div(["4x"], ["24"], "4", "Divide by 4"), end("=", "6")]),
   ("7x " + M + " 5 = 3x + 23", ("=", 7), [
     dict(L=["7x", "− 5"], rel="=", R=["3x", "+ 23"], ops={"L": {0: "− 3x"}, "R": {0: "− 3x"}}, x={("R", 0)}, lab="Subtract 3x"),
     sub(["4x", "− 5"], ["23"], 1, 0, "+ 5", lab="Add 5"),
     div(["4x"], ["28"], "4", "Divide by 4"), end("=", "7")]),
   (tx("[2/3]") + "x " + M + " 4 = 6", ("=", 15), [
     sub(["[2/3]x", "− 4"], ["6"], 1, 0, "+ 4", lab="Add 4"),
     dict(L=["[2/3]x"], rel="=", R=["10"], mul="[3/2]", x={("L", 0)}, lab="Multiply by the reciprocal 3/2"),
     end("=", "15")]),
  ],
  ineqs=[
   ("3x " + M + " 4 ≥ 5", (">=", 3), [
     sub(["3x", "− 4"], ["5"], 1, 0, "+ 4", rel="≥", lab="Add 4"),
     div(["3x"], ["9"], "3", "Divide by 3 (positive: no flip)", rel="≥"), end("≥", "3")], (3, True, False)),
   (M + "2x + 3 > 11", ("<", -4), [
     sub(["−2x", "+ 3"], ["11"], 1, 0, "− 3", rel=">", lab="Subtract 3"),
     div(["−2x"], ["8"], "−2", "Divide by −2: FLIP > to <", rel=">"), end("<", "−4")], (-4, False, True)),
  ],
  # ∠3 = (5x − 12)°, ∠6 = (3x + 20)°: alternate interior → equal. x = 16, each 68°. ∠5 = 180 − 68 = 112°.
  tv=dict(th=68, a=3, b=6, ea=(5, -12), eb=(3, 20), pair="alternate interior", rule="C", x=16, ang=(68, 68), ask=5, askv=112,
          why="∠5 and ∠6 are a linear pair: 180 − 68 = 112"),
 ),
 "M": dict(
  eqs=[
   ("3(x + 5) " + M + " 4 = 26", ("=", 5), [
     dict(L=["3(x + 5)", "− 4"], rel="=", R=["26"], lab="Distribute"),
     dict(L=["3x", "+ 15", "− 4"], rel="=", R=["26"], lab="Combine like terms"),
     sub(["3x", "+ 11"], ["26"], 1, 0, "− 11", lab="Subtract 11"),
     div(["3x"], ["15"], "3", "Divide by 3"), end("=", "5")]),
   ("8x + 3 = 5x " + M + " 12", ("=", -5), [
     dict(L=["8x", "+ 3"], rel="=", R=["5x", "− 12"], ops={"L": {0: "− 5x"}, "R": {0: "− 5x"}}, x={("R", 0)}, lab="Subtract 5x"),
     sub(["3x", "+ 3"], ["−12"], 1, 0, "− 3", lab="Subtract 3"),
     div(["3x"], ["−15"], "3", "Divide by 3"), end("=", "−5")]),
   (tx("[3/4]") + "x + 2 = 11", ("=", 12), [
     sub(["[3/4]x", "+ 2"], ["11"], 1, 0, "− 2", lab="Subtract 2"),
     dict(L=["[3/4]x"], rel="=", R=["9"], mul="[4/3]", x={("L", 0)}, lab="Multiply by the reciprocal 4/3"),
     end("=", "12")]),
  ],
  ineqs=[
   ("2x " + M + " 7 < 3", ("<", 5), [
     sub(["2x", "− 7"], ["3"], 1, 0, "+ 7", rel="<", lab="Add 7"),
     div(["2x"], ["10"], "2", "Divide by 2 (positive: no flip)", rel="<"), end("<", "5")], (5, False, True)),
   ("5 " + M + " 4x ≤ 13", (">=", -2), [
     dict(L=["5", "− 4x"], rel="≤", R=["13"], ops={"L": {0: "− 5"}, "R": {0: "− 5"}}, x={("L", 0)}, lab="Subtract 5"),
     div(["−4x"], ["8"], "−4", "Divide by −4: FLIP ≤ to ≥", rel="≤"), end("≥", "−2")], (-2, True, False)),
  ],
  # ∠4 = (2x + 15)°, ∠6 = (3x + 5)°: same-side interior → add to 180. x = 32: 79° and 101°. ∠2 = ∠6 = 101°.
  tv=dict(th=101, a=4, b=6, ea=(2, 15), eb=(3, 5), pair="same-side interior", rule="S", x=32, ang=(79, 101), ask=2, askv=101,
          why="∠2 and ∠6 are corresponding, so they are equal"),
 ),
}

# ── exact checks ──
for S in SETS.values():
    for q, (rel, v), lines in S["eqs"]: eq_check(lines, rel, v)
    for q, (rel, v), lines, nl in S["ineqs"]:
        eq_check(lines, rel, v)
        at, closed, left = nl
        assert at == v and closed == ("=" in rel) and left == (rel[0] == "<")
    t = S["tv"]
    assert TV.pair(t["a"], t["b"]) == t["pair"] and TV.RULE[t["pair"]] == t["rule"]
    (p, q), (r, s), x = t["ea"], t["eb"], t["x"]
    A, B = p * x + q, r * x + s
    assert (A, B) == t["ang"] == (TV.meas(t["a"], t["th"]), TV.meas(t["b"], t["th"]))
    assert (A == B) if t["rule"] == "C" else (A + B == 180)
    assert TV.meas(t["ask"], t["th"]) == t["askv"]
assert F(2, 3) * 15 - 4 == 6 and F(3, 4) * 12 + 2 == 11

REM_F = ("<b>Solve:</b> 1. Distribute. 2. Combine like terms on each side. 3. Get the x’s on one side. 4. Undo + or −, then × or ÷. "
         "Write each move <b>under its like term on BOTH sides</b>. &nbsp; <b>Fraction in front of x?</b> Multiply both sides by its "
         "<b>reciprocal</b> (flip it): " + kit.fr(2, 3) + " · " + kit.fr(3, 2) + " = 1. &nbsp; <b>Check:</b> put your answer back in.")
REM_B = ("<b>Inequality:</b> solve like an equation. Multiply or divide by a <b>negative</b> → <b>flip</b> the sign. "
         "<b>Graph:</b> ● closed for ≤ ≥, ○ open for &lt; &gt;. Shade the side that works. &nbsp; "
         "<b>Parallel lines:</b> corresponding, alternate interior and alternate exterior angles are <b>equal</b>. "
         "Same-side interior angles and linear pairs <b>add to 180°</b>.")
CHOICES = ["corresponding", "alternate interior", "alternate exterior", "same-side interior"]

def tv_fig(t):
    lab = {k: (str(k), NAVYC) for k in range(1, 9)}
    lab[t["a"]] = (TV.ex(*t["ea"]), G); lab[t["b"]] = (TV.ex(*t["eb"]), G)
    return TV.scale(TV.pfig(t["th"], labels=lab, arcs={t["a"]: G, t["b"]: G}), 1.75)

def tv_parts(t, key):
    a, b = t["a"], t["b"]
    ch = "".join(f'<span class="ch{" ok" if key and c == t["pair"] else ""}">{c}</span>' for c in CHOICES)
    cs = "".join(f'<span class="ch{" ok" if key and c[0].upper() == t["rule"] else ""}">{c}</span>' for c in ("congruent (equal)", "supplementary (add to 180°)"))
    p, q = t["ea"]; r, s = t["eb"]
    eqn = (f"{TV.lin(p, q)} = {TV.lin(r, s)}" if t["rule"] == "C" else f"({TV.lin(p, q)}) + ({TV.lin(r, s)}) = 180").replace("−", M)
    ln = '<span class="ln"></span>'
    K = lambda v: f'<span class="tvk">{v}</span>' if key else ln
    return (f'<div><b>a.</b> ∠{a} and ∠{b} are ____ angles. Circle one.<br>{ch}</div>'
            f'<div><b>b.</b> So the angles are: {cs}</div>'
            f'<div><b>c.</b> Write an equation and solve for x. Show your work.' +
            (f'<br><span class="tvk">{eqn}</span><br>' if key else '<div style="height:1.05in"></div>') +
            f'x = {K(t["x"])}</div>'
            f'<div><b>d.</b> ∠{a} = {K(str(t["ang"][0]) + "°")} &nbsp; ∠{b} = {K(str(t["ang"][1]) + "°")}</div>'
            f'<div><b>e.</b> Find ∠{t["ask"]}. Name the rule you used.<br>∠{t["ask"]} = {K(str(t["askv"]) + "°")}' +
            (f'<br><span class="tvk" style="font-weight:600">{t["why"]}</span>' if key else '<br>Rule: <span class="ln" style="min-width:2.2in"></span>') + '</div>')

def build(letter, key):
    S = SETS[letter]
    W = lambda lines, rel_v: work(lines, (rel_v[0], F(rel_v[1]))) if key else blank()
    p1 = page_head(f"Bell Ringer {letter} · NC.8.EE.7", "Multi-step Equations", "Front · Solve each one", key)
    p1 += f'<div data-fit><div class="rem"><b>Remember:</b> {REM_F}</div>'
    p1 += '<div class="part">A. Solve. Line up each move under its like term.</div><div class="g2">'
    for i, (q, rv, lines) in enumerate(S["eqs"][:2]):
        p1 += cell(i + 1, "Solve: " + q, key, W(lines, rv), " eqA")
    p1 += '</div><div class="part">B. Fraction in front of x. Use the reciprocal.</div><div class="g1">'
    q, rv, lines = S["eqs"][2]
    p1 += cell(3, "Solve: " + q, key, W(lines, rv), " eqB")
    p1 += "</div></div>"
    p2 = page_head(f"Bell Ringer {letter} · NC.8.EE.7 · NC.8.G.5", "Inequalities &amp; Parallel Lines", "Back · Solve and graph, then the angles", key)
    p2 += f'<div data-fit><div class="rem"><b>Remember:</b> {REM_B}</div>'
    p2 += '<div class="part">C. Solve. Then graph your answer on the number line.</div><div class="g2">'
    for i, (q, rv, lines, nl) in enumerate(S["ineqs"]):
        at, closed, left = nl
        line = kit.numline(-6, 6, at if key else None, closed, left, w=300)
        body = (work(lines, (rv[0], F(rv[1]))) if key else '<div style="flex:1"></div>') + f'<div class="nlw">{line}</div>'
        if not key: body += '<div style="margin-top:6px">Answer: <span class="ln"></span></div>'
        p2 += cell(i + 4, "Solve and graph: " + q, key, body, " in2")
    t = S["tv"]
    p2 += '</div><div class="part">D. Lines <i>m</i> and <i>n</i> are parallel. Line <i>t</i> is a transversal.</div><div class="g1">'
    p2 += cell(6, "Use the picture to answer a–e.", key, f'<div class="tvg"><div>{tv_fig(t)}</div><div class="tvp">{tv_parts(t, key)}</div></div>', " tv")
    p2 += "</div></div>"
    return [p1, p2]

if __name__ == "__main__":
    for letter in ("L", "M"):
        for key in (False, True):
            render(build(letter, key), f"{OUT}/Bell_Ringer_{letter}_Equations_Inequalities_Parallel_Lines{'_AnswerKey' if key else ''}.pdf",
                   landscape=False, footer=f"Bell Ringer {letter} · Equations, Inequalities & Parallel Lines" + (" — Answer Key" if key else ""), fit=True)
    print("ok")
