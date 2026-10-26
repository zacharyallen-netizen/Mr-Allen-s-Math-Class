import sys, os
sys.path.insert(0, os.path.dirname(__file__))
from kit import *
from fractions import Fraction as F

# ── transformation rules (exact)
def tr(a, b): return lambda p: (p[0] + a, p[1] + b)
RX = lambda p: (p[0], -p[1])               # reflect over x-axis
RY = lambda p: (-p[0], p[1])               # reflect over y-axis
R90 = lambda p: (-p[1], p[0])              # 90° counterclockwise
R180 = lambda p: (-p[0], -p[1])
R270 = lambda p: (p[1], -p[0])             # 270° ccw = 90° clockwise
def dil(k): return lambda p: (F(p[0]) * k, F(p[1]) * k)
def fmt(v):
    v = F(v)
    return neg(v.numerator) if v.denominator == 1 else neg(float(v)) if v.denominator in (2, 4, 5) else f"{neg(v.numerator)}/{v.denominator}"
def P(p): return f"({fmt(p[0])}, {fmt(p[1])})"

BLUE, GOLDC = "#1E2D4F", "#B07D00"
def fig(pre, img=None, lab="ABC", rng=(-6, 6, -6, 6), u=11, img_dash=True, font=6.5):
    xmin, xmax, ymin, ymax = rng
    body = [shape(pre, BLUE, 0.22, list(lab), offs=[(-9, 10), (3, 10), (-9, -2)][:len(pre)] if len(pre) == 3 else None)]
    if img: body.append(shape([(float(a), float(b)) for a, b in img], GOLDC, 0.22, [c + "′" for c in lab], dash=img_dash, offs=[(3, -3)] * len(img)))
    return grid(xmin, xmax, ymin, ymax, u=u, body=combine(*body), font=font)

# ── notes A: rules + one picture each
def notesA():
    h = page_head("NC.8.G.3 · Notes — Set A", "Transformations on the Coordinate Plane", "Translations · Reflections · Rotations · Dilations — using coordinates", name=False)
    h += '<div style="zoom:1.08">'
    h += '''<table class="t" style="margin-bottom:7px"><tr><th style="width:30%">Transformation</th><th style="width:22%">Rule</th><th style="width:20%">(3, 2) becomes</th><th>Remember</th></tr>
<tr><td><b>Translation</b> (slide) a right/left, b up/down</td><td class="m">(x + a, y + b)</td><td class="m">right 1, down 4:<br>(4, −2)</td><td>Right/left changes <b>x</b>. Up/down changes <b>y</b>.</td></tr>
<tr><td><b>Reflection</b> over the x-axis</td><td class="m">(x, −y)</td><td class="m">(3, −2)</td><td>The <b>y</b> changes sign.</td></tr>
<tr><td><b>Reflection</b> over the y-axis</td><td class="m">(−x, y)</td><td class="m">(−3, 2)</td><td>The <b>x</b> changes sign.</td></tr>
<tr><td><b>Rotation</b> 90° counterclockwise</td><td class="m">(−y, x)</td><td class="m">(−2, 3)</td><td>Swap, then change the sign of the new first number.</td></tr>
<tr><td><b>Rotation</b> 180°</td><td class="m">(−x, −y)</td><td class="m">(−3, −2)</td><td>Both signs change. No swap.</td></tr>
<tr><td><b>Rotation</b> 90° clockwise (= 270° counterclockwise)</td><td class="m">(y, −x)</td><td class="m">(2, −3)</td><td>Swap, then change the sign of the new second number.</td></tr>
<tr><td><b>Dilation</b> scale factor k, center (0, 0)</td><td class="m">(kx, ky)</td><td class="m">k = 2:<br>(6, 4)</td><td>Multiply <b>both</b> numbers by k. k &gt; 1 bigger, k &lt; 1 smaller.</td></tr></table>'''
    assert tr(1, -4)((3, 2)) == (4, -2) and RX((3, 2)) == (3, -2) and RY((3, 2)) == (-3, 2) and R90((3, 2)) == (-2, 3) and R180((3, 2)) == (-3, -2) and R270((3, 2)) == (2, -3) and dil(2)((3, 2)) == (6, 4)
    T = [(1, 1), (3, 1), (1, 3)]
    ex = [("Translation: 4 left, 2 down", tr(-4, -2)), ("Reflection over the y-axis", RY), ("Rotation 90° counterclockwise", R90), ("Dilation, k = 2", dil(2))]
    h += '<div class="grid2">'
    for title, f in ex:
        img = [f(p) for p in T]
        h += (f'<div class="box" style="display:flex;gap:8px;align-items:center"><div>{fig(T, img, rng=(-6, 7, -6, 7), u=10)}</div><div><b>{title}</b>'
              f'<div style="font-size:9pt;margin-top:3px">{"<br>".join(f"{c}{P(p)} → {c}′{P(q)}" for c, p, q in zip("ABC", T, img))}</div></div></div>')
    h += '</div>'
    h += '''<div class="cols"><div class="box gold"><h3>Same size or not?</h3><div style="font-size:9.3pt">Translations, reflections, rotations: <b>same size and shape → congruent (≅)</b>.<br>Dilations: same shape, <b>different size → similar (~)</b>. Angles do not change.</div></div>
<div class="box"><h3>Tips</h3><div style="font-size:9.3pt">• Name the new figure with primes: A′ (“A prime”).<br>• Counterclockwise goes I → II → III → IV.<br>• Check by sketching. Does the picture match the rule?</div></div></div></div>'''
    return h

# ── notes B: describe a transformation (what changed?)
def notesB():
    h = page_head("NC.8.G.3 · Notes — Set B", "Describe the Transformation", "Compare the coordinates. What changed? That tells you which transformation.", name=False)
    h += '<div style="zoom:1.06">'
    rows = [("Each number was <b>multiplied</b> by the same k", "Dilation, scale factor k", "(2, 3) → (6, 9): ×3"),
            ("The same amount was <b>added</b> to every x (and/or every y)", "Translation", "(2, 3) → (5, 1): right 3, down 2"),
            ("Only the <b>y</b> changed sign", "Reflection over the <b>x</b>-axis", "(2, 3) → (2, −3)"),
            ("Only the <b>x</b> changed sign", "Reflection over the <b>y</b>-axis", "(2, 3) → (−2, 3)"),
            ("<b>Both</b> signs changed, no swap", "Rotation 180°", "(2, 3) → (−2, −3)"),
            ("The numbers <b>swapped</b>, new first number changed sign", "Rotation 90° counterclockwise", "(2, 3) → (−3, 2)"),
            ("The numbers <b>swapped</b>, new second number changed sign", "Rotation 90° clockwise", "(2, 3) → (3, −2)")]
    chk = [dil(3)((2, 3)) == (6, 9), tr(3, -2)((2, 3)) == (5, 1), RX((2, 3)) == (2, -3), RY((2, 3)) == (-2, 3), R180((2, 3)) == (-2, -3), R90((2, 3)) == (-3, 2), R270((2, 3)) == (3, -2)]
    assert all(chk)
    h += '<table class="t" style="margin-bottom:7px"><tr><th>What changed from (x, y)?</th><th>It is a…</th><th>Example</th></tr>' + "".join(
        f'<tr><td>{a}</td><td><b>{b}</b></td><td class="m">{c}</td></tr>' for a, b, c in rows) + '</table>'
    W = [("1", [(1, 2), (4, 2), (4, 4)], tr(-5, -3), "Every x went down 5 (1 → −4). Every y went down 3 (2 → −1).", "Translation 5 left and 3 down. Congruent."),
         ("2", [(2, 1), (5, 1), (2, 3)], R180, "Both signs changed. Nothing swapped.", "Rotation 180° about the origin. Congruent."),
         ("3", [(1, 1), (2, 1), (1, 2)], dil(3), "Every number was multiplied by 3 (2 → 6).", "Dilation with scale factor 3. Similar, not congruent.")]
    h += '<h3 style="margin:3px 0 5px">Worked examples: describe it</h3>'
    for n, pre, f, why, verdict in W:
        img = [f(p) for p in pre]
        rng = (-6, 7, -5, 7)
        h += (f'<div class="box" style="display:flex;gap:10px;align-items:center;padding:5px 9px"><div>{fig(pre, img, "DEF", rng, u=9)}</div><div>'
              f'<div class="m">{" ".join(f"{c}{P(p)}" for c, p in zip("DEF", pre))} → {" ".join(f"{c}′{P(q)}" for c, q in zip("DEF", img))}</div>'
              f'<div style="font-size:9.3pt;margin-top:3px"><b>What changed?</b> {why}</div><div class="ans" style="font-size:10pt;margin-top:2px">→ {verdict}</div></div></div>')
    h += '<div class="tip"><b>Always check one more point.</b> One point can fool you. Make sure the same rule works for every vertex.</div></div>'
    return h

# ── practice
SET = {
 "A": dict(tri=[(1, 1), (4, 1), (1, 3)],
           six=[("Translate 3 left and 2 down", tr(-3, -2)), ("Reflect over the x-axis", RX), ("Reflect over the y-axis", RY),
                ("Rotate 90° counterclockwise", R90), ("Rotate 180°", R180), ("Dilate, scale factor 2", dil(2))],
           pts=[("Point P(−3, 5) is rotated <b>90° clockwise</b> about the origin. Find P′.", (-3, 5), R270),
                ("Point Q(6, −4) is dilated by a scale factor of <b>½</b>. Find Q′.", (6, -4), dil(F(1, 2)))],
           desc=[([(2, 1), (5, 1), (5, 4)], RY, "Reflection over the y-axis", "Only the x changed sign.", "congruent", (-6, 6, -1, 5)),
                 ([(1, 2), (3, 2), (3, 5)], tr(-4, -3), "Translation 4 left and 3 down", "Every x went down 4, every y went down 3.", "congruent", (-4, 4, -2, 6))]),
 "B": dict(tri=[(2, -1), (5, -1), (2, -4)],
           six=[("Translate 1 right and 5 up", tr(1, 5)), ("Reflect over the y-axis", RY), ("Reflect over the x-axis", RX),
                ("Rotate 90° clockwise", R270), ("Rotate 90° counterclockwise", R90), ("Dilate, scale factor 2", dil(2))],
           pts=[("Point M(4, −6) is dilated by a scale factor of <b>½</b>. Find M′.", (4, -6), dil(F(1, 2))),
                ("Point N(−2, 7) is rotated <b>180°</b> about the origin. Find N′.", (-2, 7), R180)],
           desc=[([(1, 1), (3, 1), (1, 3)], dil(3), "Dilation with scale factor 3", "Every number was multiplied by 3.", "similar", (-1, 10, -1, 10)),
                 ([(2, 3), (5, 3), (2, 1)], R90, "Rotation 90° counterclockwise", "The numbers swapped and the new first number changed sign.", "congruent", (-4, 6, -1, 6))]),
}

def practice(k, key):
    d = SET[k]; tri = d["tri"]
    h = page_head(f"NC.8.G.3 · Practice — Set {k}", "Transformations with Coordinates", "Use the rules. Write the new coordinates. Sketch to check.", key)
    rows = ""
    for i, (name, f) in enumerate(d["six"]):
        img = [f(p) for p in tri]
        cells = "".join(f'<td class="{"ansm" if key else ""}" style="text-align:center;white-space:nowrap">{P(q) if key else ""}</td>' for q in img)
        rows += f'<tr style="height:34px"><td><span class="qn">{i + 1}</span>{name}</td>{cells}</tr>'
    top = (f'<div class="cols" style="align-items:flex-start;gap:10px"><div style="flex:none">{fig(tri, None, rng=(-8, 8, -8, 8) if k == "A" else (-8, 8, -8, 8), u=12)}'
           f'<div class="small center">{" ".join(f"{c}{P(p)}" for c, p in zip("ABC", tri))}</div></div>'
           f'<div><div class="small" style="margin-bottom:3px">Triangle ABC is shown. Do each transformation to the ORIGINAL triangle ABC.</div>'
           f'<table class="t"><tr><th style="width:40%">Transformation of ABC</th><th style="width:20%">A′</th><th style="width:20%">B′</th><th style="width:20%">C′</th></tr>{rows}</table></div></div>')
    cells = []
    for j, (txt, p, f) in enumerate(d["pts"]):
        q = f(p)
        ans = f'<div class="ansm" style="margin-top:4px">{P(q)}</div>' if key else '<div style="height:44px"></div><div>Answer: <span class="line"></span></div>'
        cells.append(f'<div class="q"><span class="qn">{7 + j}</span><span class="stem">{txt}</span>{ans}</div>')
    for j, (pre, f, name, why, cs, rng) in enumerate(d["desc"]):
        img = [f(p) for p in pre]
        coords = f'{" ".join(f"{c}{P(p)}" for c, p in zip("DEF", pre))} → {" ".join(f"{c}′{P(q)}" for c, q in zip("DEF", img))}'
        ans = (f'<div class="ans" style="font-size:9pt">{why}</div><div class="ansm">{name}. {cs.capitalize()}.</div>' if key else
               '<div style="margin-top:6px">It is a <span class="line" style="min-width:110px"></span></div><div style="margin-top:6px">Congruent or similar?<br><span class="line" style="min-width:110px"></span></div>')
        cells.append(f'<div class="q"><span class="qn">{9 + j}</span><span class="stem">Describe the transformation from DEF to D′E′F′.</span>'
                     f'<div style="display:flex;gap:8px;align-items:center;margin-top:3px"><div>{fig(pre, img, "DEF", rng, u=10 if j == 0 or k == "A" else 9)}</div>'
                     f'<div><div class="m" style="font-size:9pt">{coords}</div>{ans}</div></div></div>')
    return h + f'<div style="zoom:{ZT}">' + top + f'<div class="grid2" style="margin-top:8px">{"".join(cells)}</div></div>'

# sanity: verify every answer independently by brute-force rule checks
for k, d in SET.items():
    for pre, f, name, *_ in d["desc"]:
        img = [f(p) for p in pre]
        cands = {"Reflection over the y-axis": RY, "Reflection over the x-axis": RX, "Rotation 180°": R180,
                 "Rotation 90° counterclockwise": R90, "Rotation 90° clockwise": R270}
        hits = [n for n, g in cands.items() if [g(p) for p in pre] == img]
        assert hits == [name] or name.startswith(("Translation", "Dilation")), (name, hits)

if __name__ == "__main__":
    ZT=float(os.environ.get('ZT','1.25'))
    for k in "AB":
        render([notesA() if k == "A" else notesB()], f"{OUT}/Transformations_Notes_Set{k}.pdf", footer=f"Transformations Notes — Set {k}")
        render([practice(k, False)], f"{OUT}/Transformations_Practice_Set{k}.pdf", footer=f"Transformations Practice — Set {k}")
        render([practice(k, True)], f"{OUT}/Transformations_Practice_Set{k}_AnswerKey.pdf", footer=f"Transformations Practice — Set {k} — Answer Key")
    print("ok")

