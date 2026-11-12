"""Two-sided bell ringers G and H (Nov 12, 2026, Zach's request).

Zach: "2 different bell ringers on solving multistep equation and inequalities, vertical pairs and linear pairs.
One example of a vertical pair and one example of a linear pair. Then, give one really long equation (on the back)
to solve for, with at least one fraction to distribute that results in a rational coefficient for x (to make it a
little easier, other x variables can cancel out at different parts.)"

Front: 1 multi-step equation, 1 multi-step inequality (flip the sign), 1 vertical pair, 1 linear pair (figures to scale).
Back:  1 long equation: a fraction is distributed, x ends with a fraction coefficient, other x-terms cancel on the way.
Keys show every solution LINED UP (Zach's rule): each move sits under its like term on both sides, what cancels is
crossed out, dividing is a fraction bar under each side, a reciprocal is written in front of each side.
Every line of every solution is checked with exact fractions before anything is drawn.

    sh _build/materials/get_fonts.sh
    OUT_DIR=/path/to/out python3 _build/materials/bell7.py
"""
import sys, os, re
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import angle_pairs as AP
from kit import *
import kit
from fractions import Fraction as F
from bell import CSS_BR

M = "−"
D = "°"
kit.CSS += CSS_BR + """
.g2{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
.c{display:flex;flex-direction:column;min-height:2.95in}
.cq{white-space:nowrap}.fg{display:flex;justify-content:center;margin:2px 0 0}
.back .c{min-height:5.7in}.back .cq{font-size:1.18em}
.aw{display:grid;grid-template-columns:auto auto auto auto;column-gap:7px;row-gap:3px;align-items:start;margin:6px 0 0;
    font:500 13.5px/1.55 'JetBrains Mono',monospace;color:#1E2D4F}
.back .aw{font-size:16px;row-gap:5px;column-gap:9px}
.aw .aw-L{justify-self:end}.aw .aw-R{justify-self:start}.aw .aw-rel{text-align:center}.aw .aw-rel.aw-mid{align-self:center}
.aw .aw-sd{display:inline-grid;column-gap:5px;white-space:nowrap}.aw .aw-sd>span{text-align:center}
.aw .aw-op{color:#B42318;font-weight:700}.aw .aw-x{text-decoration:line-through;text-decoration-color:#B42318;text-decoration-thickness:2px}
.aw .aw-fd{display:inline-grid;text-align:center}.aw .aw-fd>span:first-child{border-bottom:2px solid #B42318;padding:0 3px}
.aw .aw-lab{font:600 10.5px Inter,sans-serif;color:#8A6100;background:#FFF6D6;border-radius:5px;padding:1px 6px;align-self:center;white-space:nowrap}
.back .aw .aw-lab{font-size:12.5px}
.aw .aw-fin{border:2px solid #15803D;border-radius:6px;padding:0 6px;color:#15803D}
.aw .aw-rule{grid-column:1/-1;height:0;border-top:1px dashed #E5E7EB}
.angans{margin-top:4px;font:600 13px Inter,sans-serif;color:#15803D}
"""
render = kit.render

# ───────────── exact checking ─────────────
def py(t):
    """display text of a term or side → python expression in x"""
    s = t.replace(M, "-").replace("·", "*")
    s = re.sub(r"\[(\d+)/(\d+)\]", r"F(\1,\2)", s)
    s = re.sub(r"(\d|\))\s*(x|\(|F)", r"\1*\2", s)
    return s or "0"
def lin(cells):
    e = " ".join(c for c in cells if c) or "0"
    f = lambda x: eval(py(e), {"F": F, "x": x})
    b = F(f(F(0))); a = F(f(F(1))) - b
    return a, b
def sol(L, rel, R):
    a1, b1 = lin(L); a2, b2 = lin(R); a = a1 - a2; b = b2 - b1
    assert a != 0
    x0 = b / a
    if rel == "=": return ("=", x0)
    r = {"≥": ">=", "≤": "<=", ">": ">", "<": "<"}[rel]
    if a < 0: r = {">=": "<=", "<=": ">=", ">": "<", "<": ">"}[r]
    return (r, x0)

# ───────────── lined-up work (HTML) ─────────────
def tx(t):   # term text → html ([3/4] = stacked fraction)
    return re.sub(r"\[(\d+)/(\d+)\]", lambda m: fr(m.group(1), m.group(2)), t)
def side_html(cells, ops, cancel):
    n = max(len(cells), max(ops) + 1 if ops else 0)
    cells = cells + [""] * (n - len(cells))
    top = "".join(f'<span class="{"aw-x" if i in cancel else ""}">{tx(c)}</span>' for i, c in enumerate(cells))
    bot = "".join(f'<span class="aw-op{" aw-x" if i in cancel else ""}">{tx(ops[i]) if i in ops else ""}</span>' for i in range(n)) if ops else ""
    return f'<span class="aw-sd" style="grid-template-columns:repeat({n},auto)">{top}{bot}</span>'
def work(lines, answer_rel_x):
    """lines: dicts with L, rel, R; optional ops={'L':{i:txt}, 'R':{i:txt}, 'x':{('L',i),...}} (cancels),
       div='−5', mul='[2/3]', lab='Subtract 3x'. Checks every line against the answer."""
    h = '<div class="aw">'
    for k, ln in enumerate(lines):
        assert sol(ln["L"], ln["rel"], ln["R"]) == answer_rel_x, (ln, sol(ln["L"], ln["rel"], ln["R"]), answer_rel_x)
        last = k == len(lines) - 1
        if "div" in ln:
            d = ln["div"]; cx = ln.get("x", set())
            L = f'<span class="aw-fd"><span>{side_html(ln["L"], {}, {i for s, i in cx if s == "L"})}</span><span class="aw-op{" aw-x" if ("L", "d") in cx else ""}">{tx(d)}</span></span>'
            R = f'<span class="aw-fd"><span>{side_html(ln["R"], {}, set())}</span><span class="aw-op">{tx(d)}</span></span>'
            mid = " aw-mid"
        elif "mul" in ln:
            m = ln["mul"]; cx = ln.get("x", set())
            L = f'<span class="aw-op"><span class="aw-x">{tx(m)}</span> · </span>{side_html(ln["L"], {}, {i for s, i in cx if s == "L"})}'
            R = f'<span class="aw-op">{tx(m)} · </span>{side_html(ln["R"], {}, set())}'
            mid = ""
        else:
            ops = ln.get("ops", {}); cx = ln.get("x", set())
            L = side_html(ln["L"], ops.get("L", {}), {i for s, i in cx if s == "L"})
            R = side_html(ln["R"], ops.get("R", {}), {i for s, i in cx if s == "R"})
            mid = ""
        if last:
            L = f'<span class="aw-fin">{"".join(tx(c) for c in ln["L"])} {ln["rel"]} {"".join(tx(c) for c in ln["R"])}</span>'
            h += f'<span class="aw-L" style="grid-column:1/4;justify-self:center">{L}</span><span></span>'
        else:
            lab = ln.get("lab", "")
            h += f'<span class="aw-L">{L}</span><span class="aw-rel{mid}">{ln["rel"]}</span><span class="aw-R">{R}</span>' + \
                 (f'<span class="aw-lab">↓ {lab}</span>' if lab else "<span></span>")
            h += '<span class="aw-rule"></span>'
    return h + "</div>"

# ───────────── problems ─────────────
def eq_check(lines, rel, x0): assert sol(lines[0]["L"], lines[0]["rel"], lines[0]["R"]) == (rel, F(x0)); return (rel, F(x0))

SETS = {}

# ===== G =====
G_eq = [
 dict(L=["4(x − 3)", "+ 2x"], rel="=", R=["3x", "+ 9"], lab="Distribute"),
 dict(L=["4x", "− 12", "+ 2x"], rel="=", R=["3x", "+ 9"], lab="Combine like terms"),
 dict(L=["6x", "− 12"], rel="=", R=["3x", "+ 9"], ops={"L": {0: "− 3x"}, "R": {0: "− 3x"}}, x={("R", 0)}, lab="Subtract 3x"),
 dict(L=["3x", "− 12"], rel="=", R=["9"], ops={"L": {1: "+ 12"}, "R": {0: "+ 12"}}, x={("L", 1)}, lab="Add 12"),
 dict(L=["3x"], rel="=", R=["21"], div="3", x={("L", 0), ("L", "d")}, lab="Divide by 3"),
 dict(L=["x"], rel="=", R=["7"]),
]
G_in = [
 dict(L=["−3(x + 2)", "+ 5"], rel="≥", R=["2x", "+ 14"], lab="Distribute"),
 dict(L=["−3x", "− 6", "+ 5"], rel="≥", R=["2x", "+ 14"], lab="Combine like terms"),
 dict(L=["−3x", "− 1"], rel="≥", R=["2x", "+ 14"], ops={"L": {0: "− 2x"}, "R": {0: "− 2x"}}, x={("R", 0)}, lab="Subtract 2x"),
 dict(L=["−5x", "− 1"], rel="≥", R=["14"], ops={"L": {1: "+ 1"}, "R": {0: "+ 1"}}, x={("L", 1)}, lab="Add 1"),
 dict(L=["−5x"], rel="≥", R=["15"], div="−5", x={("L", 0), ("L", "d")}, lab="Divide by −5: FLIP ≥ to ≤"),
 dict(L=["x"], rel="≤", R=["−3"]),
]
G_v = [
 dict(L=["6x", "− 15"], rel="=", R=["4x", "+ 11"], ops={"L": {0: "− 4x"}, "R": {0: "− 4x"}}, x={("R", 0)}, lab="Subtract 4x"),
 dict(L=["2x", "− 15"], rel="=", R=["11"], ops={"L": {1: "+ 15"}, "R": {0: "+ 15"}}, x={("L", 1)}, lab="Add 15"),
 dict(L=["2x"], rel="=", R=["26"], div="2", x={("L", 0), ("L", "d")}, lab="Divide by 2"),
 dict(L=["x"], rel="=", R=["13"]),
]
G_l = [
 dict(L=["(3x + 22)", "+ (5x − 2)"], rel="=", R=["180"], lab="Combine like terms"),
 dict(L=["8x", "+ 20"], rel="=", R=["180"], ops={"L": {1: "− 20"}, "R": {0: "− 20"}}, x={("L", 1)}, lab="Subtract 20"),
 dict(L=["8x"], rel="=", R=["160"], div="8", x={("L", 0), ("L", "d")}, lab="Divide by 8"),
 dict(L=["x"], rel="=", R=["20"]),
]
G_long = [
 dict(L=["[3/4](2x + 8)", "+ 5x", "− 3(x − 2)", "− 7"], rel="=", R=["6x", "+ 2(5 − 2x)", "+ 1"], lab="Distribute (3/4 times BOTH terms)"),
 dict(L=["[3/2]x", "+ 6", "+ 5x", "− 3x", "+ 6", "− 7"], rel="=", R=["6x", "+ 10", "− 4x", "+ 1"], lab="Combine like terms on each side"),
 dict(L=["[3/2]x", "+ 2x", "+ 5"], rel="=", R=["2x", "+ 11"], ops={"L": {1: "− 2x"}, "R": {0: "− 2x"}}, x={("L", 1), ("R", 0)}, lab="Subtract 2x: the 2x's cancel"),
 dict(L=["[3/2]x", "", "+ 5"], rel="=", R=["", "11"], ops={"L": {2: "− 5"}, "R": {1: "− 5"}}, x={("L", 2)}, lab="Subtract 5"),
 dict(L=["[3/2]x"], rel="=", R=["6"], mul="[2/3]", x={("L", 0)}, lab="Multiply by the reciprocal 2/3"),
 dict(L=["x"], rel="=", R=["4"]),
]
for ls, r, v in ((G_eq, "=", 7), (G_in, "<=", -3), (G_v, "=", 13), (G_l, "=", 20), (G_long, "=", 4)): eq_check(ls, r, v)
assert 6 * 13 - 15 == 4 * 13 + 11 == 63 and (3 * 20 + 22, 5 * 20 - 2) == (82, 98)
SETS["G"] = dict(eq=("4(x " + M + " 3) + 2x = 3x + 9", G_eq, ("=", F(7))),
                 ineq=(M + "3(x + 2) + 5 ≥ 2x + 14", G_in, ("<=", F(-3))),
                 v=("(6x " + M + " 15)°", "(4x + 11)°", 63, G_v, ("=", F(13)), "x = 13; each angle = 63°"),
                 l=("(3x + 22)°", "(5x " + M + " 2)°", 82, G_l, ("=", F(20)), "x = 20; the angles are 82° and 98°"),
                 long=(fr(3, 4) + "(2x + 8) + 5x " + M + " 3(x " + M + " 2) " + M + " 7 = 6x + 2(5 " + M + " 2x) + 1", G_long, ("=", F(4))))

# ===== H =====
H_eq = [
 dict(L=["5(x + 2)", "− 3x"], rel="=", R=["4x", "− 8"], lab="Distribute"),
 dict(L=["5x", "+ 10", "− 3x"], rel="=", R=["4x", "− 8"], lab="Combine like terms"),
 dict(L=["2x", "+ 10"], rel="=", R=["4x", "− 8"], ops={"L": {0: "− 4x"}, "R": {0: "− 4x"}}, x={("R", 0)}, lab="Subtract 4x"),
 dict(L=["−2x", "+ 10"], rel="=", R=["−8"], ops={"L": {1: "− 10"}, "R": {0: "− 10"}}, x={("L", 1)}, lab="Subtract 10"),
 dict(L=["−2x"], rel="=", R=["−18"], div="−2", x={("L", 0), ("L", "d")}, lab="Divide by −2"),
 dict(L=["x"], rel="=", R=["9"]),
]
H_in = [
 dict(L=["7", "− 4(x + 1)"], rel=">", R=["2x", "+ 15"], lab="Distribute"),
 dict(L=["7", "− 4x", "− 4"], rel=">", R=["2x", "+ 15"], lab="Combine like terms"),
 dict(L=["−4x", "+ 3"], rel=">", R=["2x", "+ 15"], ops={"L": {0: "− 2x"}, "R": {0: "− 2x"}}, x={("R", 0)}, lab="Subtract 2x"),
 dict(L=["−6x", "+ 3"], rel=">", R=["15"], ops={"L": {1: "− 3"}, "R": {0: "− 3"}}, x={("L", 1)}, lab="Subtract 3"),
 dict(L=["−6x"], rel=">", R=["12"], div="−6", x={("L", 0), ("L", "d")}, lab="Divide by −6: FLIP > to <"),
 dict(L=["x"], rel="<", R=["−2"]),
]
H_v = [
 dict(L=["7x", "− 20"], rel="=", R=["4x", "+ 25"], ops={"L": {0: "− 4x"}, "R": {0: "− 4x"}}, x={("R", 0)}, lab="Subtract 4x"),
 dict(L=["3x", "− 20"], rel="=", R=["25"], ops={"L": {1: "+ 20"}, "R": {0: "+ 20"}}, x={("L", 1)}, lab="Add 20"),
 dict(L=["3x"], rel="=", R=["45"], div="3", x={("L", 0), ("L", "d")}, lab="Divide by 3"),
 dict(L=["x"], rel="=", R=["15"]),
]
H_l = [
 dict(L=["(2x + 34)", "+ (6x − 6)"], rel="=", R=["180"], lab="Combine like terms"),
 dict(L=["8x", "+ 28"], rel="=", R=["180"], ops={"L": {1: "− 28"}, "R": {0: "− 28"}}, x={("L", 1)}, lab="Subtract 28"),
 dict(L=["8x"], rel="=", R=["152"], div="8", x={("L", 0), ("L", "d")}, lab="Divide by 8"),
 dict(L=["x"], rel="=", R=["19"]),
]
H_long = [
 dict(L=["[2/5](x + 15)", "+ 4(2x − 1)", "− 6x"], rel="=", R=["3(x + 2)", "− x", "+ 2(x − 1)", "− 2x", "+ 2"], lab="Distribute (2/5 times BOTH terms)"),
 dict(L=["[2/5]x", "+ 6", "+ 8x", "− 4", "− 6x"], rel="=", R=["3x", "+ 6", "− x", "+ 2x", "− 2", "− 2x", "+ 2"], x={("R", 3), ("R", 5)}, lab="Combine like terms (+2x and −2x cancel)"),
 dict(L=["[2/5]x", "+ 2x", "+ 2"], rel="=", R=["2x", "+ 6"], ops={"L": {1: "− 2x"}, "R": {0: "− 2x"}}, x={("L", 1), ("R", 0)}, lab="Subtract 2x: the 2x's cancel"),
 dict(L=["[2/5]x", "", "+ 2"], rel="=", R=["", "6"], ops={"L": {2: "− 2"}, "R": {1: "− 2"}}, x={("L", 2)}, lab="Subtract 2"),
 dict(L=["[2/5]x"], rel="=", R=["4"], mul="[5/2]", x={("L", 0)}, lab="Multiply by the reciprocal 5/2"),
 dict(L=["x"], rel="=", R=["10"]),
]
for ls, r, v in ((H_eq, "=", 9), (H_in, "<", -2), (H_v, "=", 15), (H_l, "=", 19), (H_long, "=", 10)): eq_check(ls, r, v)
assert 7 * 15 - 20 == 4 * 15 + 25 == 85 and (2 * 19 + 34, 6 * 19 - 6) == (72, 108)
SETS["H"] = dict(eq=("5(x + 2) " + M + " 3x = 4x " + M + " 8", H_eq, ("=", F(9))),
                 ineq=("7 " + M + " 4(x + 1) > 2x + 15", H_in, ("<", F(-2))),
                 v=("(7x " + M + " 20)°", "(4x + 25)°", 85, H_v, ("=", F(15)), "x = 15; each angle = 85°"),
                 l=("(2x + 34)°", "(6x " + M + " 6)°", 72, H_l, ("=", F(19)), "x = 19; the angles are 72° and 108°"),
                 long=(fr(2, 5) + "(x + 15) + 4(2x " + M + " 1) " + M + " 6x = 3(x + 2) " + M + " x + 2(x " + M + " 1) " + M + " 2x + 2", H_long, ("=", F(10))))

# ───────────── pages ─────────────
REM_F = ("<b>Multi-step:</b> 1. Distribute. 2. Combine like terms on each side. 3. Get the x’s on one side. 4. Undo + or −, then × or ÷. "
         "Write each move <b>under its like term on BOTH sides</b>. &nbsp; <b>Inequality:</b> multiply or divide by a <b>negative</b> → <b>flip</b> the sign. &nbsp; "
         "<b>Vertical angles</b> are <b>equal</b>. A <b>linear pair</b> <b>adds to 180°</b>.")
REM_B = ("<b>Fraction outside the ( )?</b> Multiply it by <b>BOTH</b> terms inside. &nbsp; <b>Look for x’s that cancel</b> (like 2x − 2x = 0). &nbsp; "
         "<b>Fraction in front of x at the end?</b> Multiply both sides by its <b>reciprocal</b> (flip it). &nbsp; <b>Check:</b> put x back into the first line.")

def ans_line(rel_x):
    r, v = rel_x; sym = {"=": "=", "<=": "≤", ">=": "≥", "<": "<", ">": ">"}[r]
    return "x " + sym + " " + (M + str(-v) if v < 0 else str(v))
def cell(n, q, key, body):
    return f'<div class="c"><div class="cq"><span class="n">{n}</span>{q}</div>{body}</div>'
def blank(): return '<div style="margin-top:auto"><span class="ln"></span></div>'

def build(letter, key):
    S = SETS[letter]
    p1 = page_head(f"Bell Ringer {letter} · NC.8.EE.7 · NC.8.G.5", "Multi-step Equations, Inequalities &amp; Angle Pairs",
                   "Front · Solve, then find the angles", key)
    p1 += f'<div data-fit><div class="rem"><b>Remember:</b> {REM_F}</div>'
    p1 += '<div class="part">A. Solve. Show each step, lined up under like terms.</div><div class="g2">'
    p1 += cell(1, "Solve: " + S["eq"][0], key, work(S["eq"][1], S["eq"][2]) if key else blank())
    p1 += cell(2, "Solve: " + S["ineq"][0], key, work(S["ineq"][1], S["ineq"][2]) if key else blank())
    p1 += '</div><div class="part">B. Name the pair, write an equation, solve for x, then find the angle(s).</div><div class="g2">'
    a1, a2, deg, wv, xv, txt = S["v"]
    fig = AP.cross(deg, a1, "", a2, "", L=80)
    p1 += cell(3, "<span>Vertical angles. Find x, then the angle.</span>", key,
               f'<div class="fg">{fig}</div>' + ((work(wv, xv) + f'<div class="angans">{txt}</div>') if key else blank()))
    b1, b2, t, wl, xl, txt2 = S["l"]
    fig2 = AP.straight(t, b1, b2, L=80)
    p1 += cell(4, "<span>Linear pair. Find x, then both angles.</span>", key,
               f'<div class="fg">{fig2}</div>' + ((work(wl, xl) + f'<div class="angans">{txt2}</div>') if key else blank()))
    p1 += "</div></div>"
    p2 = page_head(f"Bell Ringer {letter} · NC.8.EE.7", "One Long Equation", "Back · Distribute a fraction, watch for x’s that cancel", key)
    p2 += f'<div data-fit class="back"><div class="rem"><b>Remember:</b> {REM_B}</div>'
    p2 += '<div class="part">C. Solve for x. Show every step, lined up under like terms.</div>'
    p2 += cell(5, S["long"][0], key, work(S["long"][1], S["long"][2]) if key else '<div style="margin-top:auto">x = <span class="ln"></span></div>')
    p2 += "</div>"
    return [p1, p2]

if __name__ == "__main__":
    for letter in ("G", "H"):
        for key in (False, True):
            render(build(letter, key), f"{OUT}/Bell_Ringer_{letter}_MultiStep_Equations_Inequalities_Angles{'_AnswerKey' if key else ''}.pdf",
                   landscape=True, footer=f"Bell Ringer {letter} · Multi-step Equations, Inequalities & Angle Pairs" + (" — Answer Key" if key else ""), fit=True)
    print("ok")
