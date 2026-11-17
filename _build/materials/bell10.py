"""Bell Ringers L and M (Nov 17, 2026; revised the same day, see REVISED below, Zach: "3 equations (one should require the reciprocal), 2 inequalities with
number lines and a parallel lines and transversal problem that involves identifying angle relationships and solving
for angles or solving for x. Same format, PDF, answer key should be separate. I need two versions.").

Portrait, same look as G-K (bell7.py). Front: 3 equations (#3 = fraction in front of x, multiply by the reciprocal).
Back: 2 inequalities, each graphed on a number line (one needs the sign flipped), then one parallel-lines problem:
name the pair, congruent or supplementary, solve for x, find the angle, then find one more numbered angle.
Keys: every solution lined up under like terms (bell7.work), every line checked with exact fractions; the number line
is drawn from the checked answer; the figure is drawn to scale from its own angle (transversals.pfig).

REVISED (Zach, Nov 17): "For two equations, have them be either none or infinite solutions. For the Parallel Lines and
Transversals, have a table with the angle types and the students have to list the matching angle pairs in the correct
section (have one example completed). Then using that visual have them solve for a missing angle type (one congruent
and one supplementary) and one problem that has them solving for x. All on one page, front and back. Keep an equation
problem that requires the reciprocal. One inequality problem should require flipping the sign."
Front: 2 how-many-solutions equations (one no solution, one infinitely many) + 1 reciprocal equation, then 2 inequalities
on number lines (one flips). Back: numbered picture, pair table (Corresponding filled in as the example), find a
congruent angle, find a supplementary angle, then solve for x.

    OUT_DIR=/path/to/out python3 _build/materials/bell10.py
"""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from bell7 import work, eq_check, cell, blank, page_head, F, M, render, OUT, tx, lin, side_html
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


def ns(L, R, ops=None, x=None, lab=""):
    d = dict(L=L, R=R, lab=lab)
    if ops: d["ops"] = ops
    if x: d["x"] = x
    return d

SETS = {
 "L": dict(
  ns=[
   ("4(x + 2) " + M + " x = 3x + 5", "none", [
     ns(["4(x + 2)", "− x"], ["3x", "+ 5"], lab="Distribute"),
     ns(["4x", "+ 8", "− x"], ["3x", "+ 5"], lab="Combine like terms"),
     ns(["3x", "+ 8"], ["3x", "+ 5"], ops={"L": {0: "− 3x"}, "R": {0: "− 3x"}}, x={("L", 0), ("R", 0)}, lab="Subtract 3x: the x's cancel"),
     ns(["8"], ["5"])]),
   ("2(3x " + M + " 1) + 4 = 6x + 2", "inf", [
     ns(["2(3x − 1)", "+ 4"], ["6x", "+ 2"], lab="Distribute"),
     ns(["6x", "− 2", "+ 4"], ["6x", "+ 2"], lab="Combine like terms"),
     ns(["6x", "+ 2"], ["6x", "+ 2"], ops={"L": {0: "− 6x"}, "R": {0: "− 6x"}}, x={("L", 0), ("R", 0)}, lab="Subtract 6x: the x's cancel"),
     ns(["2"], ["2"])]),
  ],
  rec=(tx("[2/3]") + "x " + M + " 4 = 6", ("=", 15), [
     sub(["[2/3]x", "− 4"], ["6"], 1, 0, "+ 4", lab="Add 4"),
     dict(L=["[2/3]x"], rel="=", R=["10"], mul="[3/2]", x={("L", 0)}, lab="Multiply by the reciprocal 3/2"),
     end("=", "15")]),
  ineqs=[
   ("3x " + M + " 4 ≥ 5", (">=", 3), [
     sub(["3x", "− 4"], ["5"], 1, 0, "+ 4", rel="≥", lab="Add 4"),
     div(["3x"], ["9"], "3", "Divide by 3 (positive: no flip)", rel="≥"), end("≥", "3")], (3, True, False)),
   (M + "2x + 3 > 11", ("<", -4), [
     sub(["−2x", "+ 3"], ["11"], 1, 0, "− 3", rel=">", lab="Subtract 3"),
     div(["−2x"], ["8"], "−2", "Divide by −2: FLIP > to <", rel=">"), end("<", "−4")], (-4, False, True)),
  ],
  # ∠3 = 68°. ∠6 (alternate interior) = 68°. ∠5 (same-side interior) = 112°. ∠8 = (5x − 13)° is vertical with ∠5 → x = 25.
  tv=dict(th=68, given=3, cong=6, cpair="alternate interior", supp=5, spair="same-side interior",
          xk=8, xe=(5, -13), x=25, xwhy="∠8 and ∠5 are vertical angles, so ∠8 = 112°"),
 ),
 "M": dict(
  ns=[
   ("5x " + M + " 3(x " + M + " 2) = 2x + 6", "inf", [
     ns(["5x", "− 3(x − 2)"], ["2x", "+ 6"], lab="Distribute (−3 times both terms)"),
     ns(["5x", "− 3x", "+ 6"], ["2x", "+ 6"], lab="Combine like terms"),
     ns(["2x", "+ 6"], ["2x", "+ 6"], ops={"L": {0: "− 2x"}, "R": {0: "− 2x"}}, x={("L", 0), ("R", 0)}, lab="Subtract 2x: the x's cancel"),
     ns(["6"], ["6"])]),
   ("3(2x + 1) " + M + " 2x = 4x " + M + " 7", "none", [
     ns(["3(2x + 1)", "− 2x"], ["4x", "− 7"], lab="Distribute"),
     ns(["6x", "+ 3", "− 2x"], ["4x", "− 7"], lab="Combine like terms"),
     ns(["4x", "+ 3"], ["4x", "− 7"], ops={"L": {0: "− 4x"}, "R": {0: "− 4x"}}, x={("L", 0), ("R", 0)}, lab="Subtract 4x: the x's cancel"),
     ns(["3"], ["−7"])]),
  ],
  rec=(tx("[3/4]") + "x + 2 = 11", ("=", 12), [
     sub(["[3/4]x", "+ 2"], ["11"], 1, 0, "− 2", lab="Subtract 2"),
     dict(L=["[3/4]x"], rel="=", R=["9"], mul="[4/3]", x={("L", 0)}, lab="Multiply by the reciprocal 4/3"),
     end("=", "12")]),
  ineqs=[
   ("2x " + M + " 7 < 3", ("<", 5), [
     sub(["2x", "− 7"], ["3"], 1, 0, "+ 7", rel="<", lab="Add 7"),
     div(["2x"], ["10"], "2", "Divide by 2 (positive: no flip)", rel="<"), end("<", "5")], (5, False, True)),
   ("5 " + M + " 4x ≤ 13", (">=", -2), [
     dict(L=["5", "− 4x"], rel="≤", R=["13"], ops={"L": {0: "− 5"}, "R": {0: "− 5"}}, x={("L", 0)}, lab="Subtract 5"),
     div(["−4x"], ["8"], "−4", "Divide by −4: FLIP ≤ to ≥", rel="≤"), end("≥", "−2")], (-2, True, False)),
  ],
  # ∠4 = 106°. ∠5 (alternate interior) = 106°. ∠6 (same-side interior) = 74°. ∠7 = (4x + 14)° is vertical with ∠6 → x = 15.
  tv=dict(th=74, given=4, cong=5, cpair="alternate interior", supp=6, spair="same-side interior",
          xk=7, xe=(4, 14), x=15, xwhy="∠7 and ∠6 are vertical angles, so ∠7 = 74°"),
 ),
}
TYPES = ["corresponding", "alternate interior", "alternate exterior", "same-side interior", "vertical angles"]

# ── exact checks ──
for S in SETS.values():
    for q, kind, lines in S["ns"]:
        for ln in lines:
            (a1, b1), (a2, b2) = lin(ln["L"]), lin(ln["R"])
            assert a1 == a2 and ((b1 == b2) == (kind == "inf")), (q, ln)
    q, (rel, v), lines = S["rec"]; eq_check(lines, rel, v)
    for q, (rel, v), lines, nl in S["ineqs"]:
        eq_check(lines, rel, v)
        at, closed, left = nl
        assert at == v and closed == ("=" in rel) and left == (rel[0] == "<")
    assert sum(1 for q, (rel, v), l, n in S["ineqs"] if any("FLIP" in d.get("lab", "") for d in l)) == 1
    t = S["tv"]; th = t["th"]; g = TV.meas(t["given"], th)
    assert TV.pair(t["given"], t["cong"]) == t["cpair"] and TV.RULE[t["cpair"]] == "C" and TV.meas(t["cong"], th) == g
    assert TV.pair(t["given"], t["supp"]) == t["spair"] and TV.RULE[t["spair"]] == "S" and TV.meas(t["supp"], th) == 180 - g
    assert TV.pair(t["xk"], t["supp"]) == "vertical angles" and t["xe"][0] * t["x"] + t["xe"][1] == TV.meas(t["xk"], th) == 180 - g
    t["g"] = g
assert F(2, 3) * 15 - 4 == 6 and F(3, 4) * 12 + 2 == 11
assert set(TYPES) <= set(TV.PAIRS)

def ns_work(lines, kind):
    h = '<div class="aw">'
    for ln in lines[:-1]:
        ops = ln.get("ops", {}); cx = ln.get("x", set())
        L = side_html(ln["L"], ops.get("L", {}), {i for s_, i in cx if s_ == "L"})
        R = side_html(ln["R"], ops.get("R", {}), {i for s_, i in cx if s_ == "R"})
        h += f'<span class="aw-L">{L}</span><span class="aw-rel">=</span><span class="aw-R">{R}</span><span class="aw-lab">↓ {ln["lab"]}</span><span class="aw-rule"></span>'
    a, b = lines[-1]["L"][0], lines[-1]["R"][0]
    v = f'{a} = {b} is TRUE → <b>infinitely many solutions</b>' if kind == "inf" else f'{a} = {b} is FALSE → <b>no solution</b>'
    return h + f'<span class="aw-L" style="grid-column:1/-1;justify-self:start"><span class="aw-fin" style="font-family:Inter,sans-serif">{v}</span></span></div>'

def how_many(kind, key):
    opts = [("one", "One solution"), ("none", "No solution"), ("inf", "Infinitely many solutions")]
    return '<div class="hm">Circle one: ' + "".join(f'<span class="ch{" ok" if key and k == kind else ""}">{t}</span>' for k, t in opts) + "</div>"

REM_F = ("<b>Solve:</b> Distribute, combine like terms, then get the x’s on one side. Line up each move <b>under its like term</b>. "
         "<b>If the x’s cancel:</b> a TRUE statement (5 = 5) → <b>infinitely many solutions</b>; a FALSE statement (5 = 2) → <b>no solution</b>. "
         "<b>Fraction in front of x?</b> Multiply both sides by its <b>reciprocal</b>: " + kit.fr(2, 3) + " · " + kit.fr(3, 2) + " = 1. "
         "<b>Inequality:</b> multiply or divide by a <b>negative</b> → <b>flip</b> the sign. ● closed for ≤ ≥, ○ open for &lt; &gt;.")
REM_B = ("<b>Equal (congruent):</b> corresponding, alternate interior, alternate exterior, vertical angles. "
         "<b>Add to 180° (supplementary):</b> same-side interior, linear pair. &nbsp; Interior = between the parallel lines. "
         "Exterior = outside them. Alternate = opposite sides of <i>t</i>.")

def tv_fig(t):
    lab = {k: (str(k), NAVYC) for k in range(1, 9)}
    return TV.scale(TV.pfig(t["th"], labels=lab, arcs={t["given"]: G}), 1.6)

def table(key):
    rows = ""
    for i, ty in enumerate(TYPES):
        ex = i == 0
        rule = "Equal" if TV.RULE[ty] == "C" else "Add to 180°"
        pairs = ", ".join(f"∠{a} &amp; ∠{b}" for a, b in TV.PAIRS[ty])
        show = ex or key
        cls = ' class="ex"' if ex else (' class="k"' if key else "")
        rows += (f'<tr><th>{ty.capitalize()}{" <span class=exl>Example</span>" if ex else ""}</th>'
                 f'<td{cls}>{rule if show else ""}</td><td{cls}>{pairs if show else ""}</td></tr>')
    return ('<table class="pt"><tr><th>Angle type</th><th>Equal or add to 180°?</th><th>Matching pairs (use the numbers in the picture)</th></tr>'
            + rows + "</table>")

def build(letter, key):
    S = SETS[letter]
    p1 = page_head(f"Bell Ringer {letter} · NC.8.EE.7", "Equations &amp; Inequalities", "Front · Solve each one", key)
    p1 += f'<div data-fit><div class="rem"><b>Remember:</b> {REM_F}</div>'
    p1 += '<div class="part">A. How many solutions? Solve. Then circle one.</div><div class="g2">'
    for i, (q, kind, lines) in enumerate(S["ns"]):
        p1 += cell(i + 1, "Solve: " + q, key, (ns_work(lines, kind) if key else '<div style="flex:1"></div>') + how_many(kind, key), " eqN")
    q, rv, lines = S["rec"]
    p1 += '</div><div class="part">B. Fraction in front of x. Use the reciprocal.</div><div class="g1">'
    p1 += cell(3, "Solve: " + q, key, work(lines, (rv[0], F(rv[1]))) if key else blank(), " eqR")
    p1 += '</div><div class="part">C. Solve. Then graph your answer on the number line.</div><div class="g2">'
    for i, (q, rv, lines, nl) in enumerate(S["ineqs"]):
        at, closed, left = nl
        line = kit.numline(-6, 6, at if key else None, closed, left, w=300)
        body = (work(lines, (rv[0], F(rv[1]))) if key else '<div style="flex:1"></div>') + f'<div class="nlw">{line}</div>'
        if not key: body += '<div style="margin-top:6px">Answer: <span class="ln"></span></div>'
        p1 += cell(i + 4, "Solve and graph: " + q, key, body, " in2")
    p1 += "</div></div>"

    t = S["tv"]; K = lambda v: f'<span class="tvk">{v}</span>' if key else '<span class="ln"></span>'
    p2 = page_head(f"Bell Ringer {letter} · NC.8.G.5", "Parallel Lines &amp; Transversals", "Back · Name the pairs, then find the angles", key)
    p2 += f'<div data-fit><div class="rem"><b>Remember:</b> {REM_B}</div>'
    p2 += '<div class="part">D. Lines <i>m</i> and <i>n</i> are parallel. Line <i>t</i> is a transversal. List the matching pairs. The first row is done for you.</div>'
    p2 += f'<div class="tvt"><div class="fgw">{tv_fig(t)}</div>{table(key)}</div>'
    p2 += f'<div class="part">E. Use the picture and your table. ∠{t["given"]} = {t["g"]}°.</div><div class="g3">'
    g, c, s_ = t["given"], t["cong"], t["supp"]
    p2 += cell(6, f"Find ∠{c}.", key, f'<div class="tvp"><div>Pair type:<br>{K(t["cpair"])}</div><div>Equal or add to 180°?<br>{K("Equal")}</div><div>∠{c} = {K(str(t["g"]) + "°")}</div></div>', " an")
    p2 += cell(7, f"Find ∠{s_}.", key, f'<div class="tvp"><div>Pair type:<br>{K(t["spair"])}</div><div>Equal or add to 180°?<br>{K("Add to 180°")}</div><div>∠{s_} = {K(str(180 - t["g"]) + "°")}'
               + (f'<br><span class="tvk">180 − {t["g"]} = {180 - t["g"]}</span>' if key else "") + "</div></div>", " an")
    p, q_ = t["xe"]
    eq = f'{TV.lin(p, q_)} = {180 - t["g"]}'
    p2 += cell(8, f"∠{t['xk']} = {TV.ex(p, q_)}. Find x.", key,
               f'<div class="tvp">' + (f'<span class="tvk" style="font-weight:600">{t["xwhy"]}.</span><br><span class="tvk">{eq}<br>{p}x = {180 - t["g"] - q_}</span><br>' if key else '<div style="flex:1;min-height:1.1in"></div>')
               + f'x = {K(t["x"])}</div>', " an")
    p2 += "</div></div>"
    return [p1, p2]

kit.CSS += """
.g3{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}
.c.eqN{min-height:2.55in}.c.eqN .cq{white-space:normal}.c.eqR{min-height:1.7in}.c.in2{min-height:2.2in}
.hm{margin-top:auto;padding-top:6px;font:500 12px Inter,sans-serif;color:#1E2D4F}
.hm .ch{display:inline-block;border:1.2px solid #9AA3B5;border-radius:12px;padding:0 7px;margin:3px 3px 0 0;font-size:11.5px}
.hm .ch.ok{border:2px solid #15803D;color:#15803D;font-weight:700}
.c.eqN .aw{font-size:12.5px;column-gap:5px}.c.eqN .aw-lab{font-size:9.5px;padding:1px 4px}
.tvt{display:grid;grid-template-columns:auto 1fr;gap:14px;align-items:center;margin-bottom:6px}
.pt{border-collapse:collapse;width:100%;font:500 12.5px Inter,sans-serif;color:#1E2D4F}
.pt th,.pt td{border:1.3px solid #1E2D4F;padding:7px 8px;text-align:left;vertical-align:middle;height:0.5in}
.pt tr:first-child th{background:#1E2D4F;color:#fff;height:auto;font-size:11.5px}
.pt th{background:#F2F4F8;width:1.25in}.pt td:nth-child(2){width:0.95in}.pt td{font-family:Inter,sans-serif}
.pt td.ex{color:#8A6100;background:#FFF6D6;font-weight:600}.pt td.k{color:#15803D;font-weight:700}
.exl{display:inline-block;font-size:9.5px;background:#FFC107;color:#1E2D4F;border-radius:6px;padding:0 5px;margin-left:3px}
.c.an{min-height:2.0in}.c.an .cq{white-space:normal}
.tvp{font:500 12.5px/1.5 Inter,sans-serif;color:#1E2D4F;margin-top:4px}.tvp>div{margin:0 0 12px}
.tvp .ln{min-width:1.6in;height:22px}.tvk{color:#15803D;font-weight:700}
"""

if __name__ == "__main__":
    for letter in ("L", "M"):
        for key in (False, True):
            render(build(letter, key), f"{OUT}/Bell_Ringer_{letter}_Equations_Inequalities_Parallel_Lines{'_AnswerKey' if key else ''}.pdf",
                   landscape=False, footer=f"Bell Ringer {letter} · Equations, Inequalities & Parallel Lines" + (" — Answer Key" if key else ""), fit=True)
    print("ok")
