import sys, os
sys.path.insert(0, os.path.dirname(__file__))
from kit import *
from fractions import Fraction as F

# ── flowchart SVG
def flowchart():
    W = 330
    s = [f'<svg viewBox="0 0 {W} 600" width="{W*1.16:.0f}" height="{600*1.16:.0f}" xmlns="http://www.w3.org/2000/svg" font-family="Inter, sans-serif">',
         '<defs><marker id="ar" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8z" fill="#1E2D4F"/></marker></defs>']
    cx = 72
    def txt(x, y, lines, size=9.6, col="#1E2D4F", weight=600, anchor="middle"):
        return "".join(f'<text x="{x}" y="{y + i*(size + 2.4)}" font-size="{size}" font-weight="{weight}" fill="{col}" text-anchor="{anchor}">{l}</text>' for i, l in enumerate(lines))
    def arrow(x1, y1, x2, y2, lab=None, lx=0, ly=0):
        o = f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="#1E2D4F" stroke-width="1.4" marker-end="url(#ar)"/>'
        if lab: o += f'<text x="{(x1 + x2)/2 + lx}" y="{(y1 + y2)/2 + ly}" font-size="7.5" font-weight="800" fill="{"#15803D" if lab == "YES" else "#B42318"}" text-anchor="middle">{lab}</text>'
        return o
    def diamond(y, lines):
        w, h = 128, 58
        return (f'<polygon points="{cx},{y} {cx + w/2},{y + h/2} {cx},{y + h} {cx - w/2},{y + h/2}" fill="#FFF6D6" stroke="#E0A800" stroke-width="1.5"/>'
                + txt(cx, y + h/2 - (len(lines) - 1) * 5.8 + 3, lines, 9.1))
    def action(x, y, w, lines, fill="#EEF1F7", stroke="#1E2D4F", tcol="#1E2D4F", h=None):
        h = h or 14 + 11 * len(lines)
        return (f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="7" fill="{fill}" stroke="{stroke}" stroke-width="1.4"/>'
                + txt(x + w/2, y + h/2 - (len(lines) - 1) * 6 + 3.5, lines, 9.4, tcol))
    y = 4
    s.append(f'<rect x="{cx - 62}" y="{y}" width="124" height="30" rx="15" fill="#1E2D4F"/>' + txt(cx, y + 19, ["START: write the problem"], 8.6, "#FFC107"))
    y += 30; s.append(arrow(cx, y, cx, y + 16)); y += 16
    rows = [(["Parentheses?"], ["Distribute: multiply", "into EVERY term"]),
            (["Like terms on", "the same side?"], ["Combine like terms", "on each side"]),
            (["x on BOTH", "sides?"], ["Subtract the smaller", "x-term from both sides"])]
    for q, a in rows:
        s.append(diamond(y, q))
        s.append(arrow(cx + 64, y + 29, 176, y + 29, "YES", 0, -4))
        s.append(action(176, y + 10, 150, a))
        s.append(f'<polyline points="251,{y + 48} 251,{y + 76} {cx + 6},{y + 76}" fill="none" stroke="#1E2D4F" stroke-width="1.4" marker-end="url(#ar)"/>')
        s.append(arrow(cx, y + 58, cx, y + 86, "NO", -14, -6))
        y += 86
    for a in (["Undo + or −", "(do the opposite to BOTH sides)"], ["Undo × or ÷", "(do the opposite to BOTH sides)"]):
        s.append(action(cx - 66, y, 200, a)); y += 36; s.append(arrow(cx, y, cx, y + 14)); y += 14
    s.append(diamond(y, ["Inequality AND", "you × or ÷ by", "a NEGATIVE?"]))
    s.append(arrow(cx + 64, y + 29, 176, y + 29, "YES", 0, -4))
    s.append(action(176, y + 14, 150, ["FLIP the inequality sign", "&lt; becomes &gt;"], "#FBEAE8", "#B42318", "#B42318"))
    s.append(f'<polyline points="251,{y + 50} 251,{y + 76} {cx + 6},{y + 76}" fill="none" stroke="#1E2D4F" stroke-width="1.4" marker-end="url(#ar)"/>')
    s.append(arrow(cx, y + 58, cx, y + 86, "NO", -14, -6)); y += 86
    s.append(action(cx - 66, y, 200, ["CHECK: put your answer back in.", "Both sides match? Done!"], "#E8F5EC", "#15803D", "#15803D"))
    s.append("</svg>")
    return "".join(s)

def steps(*lines): return '<div class="ex">' + "<br>".join(lines) + "</div>"

notes = page_head("NC.8.EE.7 · Notes", "Solving Equations &amp; Inequalities", "Two-step · Distributive property · Variables on both sides · Multi-step · Inequalities", name=False)
notes += f'''<div class="cols" style="gap:12px">
<div style="flex:0 0 392px"><div class="box" style="padding:6px 4px 2px 6px"><h3 style="margin-left:4px">Follow the flowchart</h3>{flowchart()}</div>
<div class="box gold"><h3>Special results</h3><div style="font-size:9pt">If the x's <b>cancel out</b>:<br>• a <b>true</b> statement (like 6 = 6) → <b>infinitely many</b> solutions<br>• a <b>false</b> statement (like 6 = 5) → <b>no solution</b></div></div></div>
<div>
<div class="box"><h3>1 · Two-step</h3>{steps("3x − 5 = 16", "+5 both sides: 3x = 21", "÷3 both sides: <b>x = 7</b>")}</div>
<div class="box"><h3>2 · Distributive property</h3>{steps("4(x + 2) = 28", "Distribute: 4x + 8 = 28", "−8: 4x = 20 &nbsp; ÷4: <b>x = 5</b>")}</div>
<div class="box"><h3>3 · Variables on both sides</h3>{steps("5x + 3 = 2x + 18", "−2x: 3x + 3 = 18", "−3: 3x = 15 &nbsp; ÷3: <b>x = 5</b>")}</div>
<div class="box"><h3>4 · Multi-step</h3>{steps("2(x − 3) + 4x = 18", "Distribute: 2x − 6 + 4x = 18", "Combine: 6x − 6 = 18", "+6: 6x = 24 &nbsp; ÷6: <b>x = 4</b>")}</div>
<div class="box"><h3>5 · Inequality (watch the sign!)</h3>{steps("−2x + 5 &gt; 13", "−5: −2x &gt; 8", "÷(−2) → FLIP: <b>x &lt; −4</b>")}
<div style="margin-top:3px">{numline(-8, 0, -4, False, True, 250)}</div>
<div class="small">Open circle for &lt; or &gt;. Closed circle for ≤ or ≥.</div></div>
<div class="tip"><b>Always check:</b> 4(5 + 2) = 28 ✓ &nbsp; Same steps work for inequalities — just watch for a negative when you × or ÷.</div>
</div></div>'''

# ── practice: (label, display, solve-type, data)
def lin(a, b, c, d):            # ax + b = cx + d
    return F(d - b, a - c)
P = [
 ("Two-step", "4x + 7 = 31", lin(4, 7, 0, 31), ["−7: 4x = 24", "÷4: x = 6"]),
 ("Two-step", "−5x + 9 = −11", lin(-5, 9, 0, -11), ["−9: −5x = −20", "÷(−5): x = 4"]),
 ("Distributive", "3(x − 4) = 18", lin(3, -12, 0, 18), ["3x − 12 = 18", "+12: 3x = 30 → x = 10"]),
 ("Distributive", "−2(3x + 1) = 22", lin(-6, -2, 0, 22), ["−6x − 2 = 22", "+2: −6x = 24 → x = −4"]),
 ("Both sides", "7x − 5 = 3x + 19", lin(7, -5, 3, 19), ["−3x: 4x − 5 = 19", "+5: 4x = 24 → x = 6"]),
 ("Multi-step", "3(2x + 1) − 4x = 17", lin(2, 3, 0, 17), ["6x + 3 − 4x = 17", "2x + 3 = 17 → 2x = 14 → x = 7"]),
 ("Multi-step", "5(x − 2) = 2(x + 7)", lin(5, -10, 2, 14), ["5x − 10 = 2x + 14", "3x − 10 = 14 → 3x = 24 → x = 8"]),
]
assert [p[2] for p in P] == [6, 4, 10, -4, 6, 7, 8]
INEQ = [
 ("Inequality", "3x − 4 ≤ 11", "x ≤ 5", ["+4: 3x ≤ 15", "÷3: x ≤ 5"], (0, 8, 5, True, True)),
 ("Inequality", "−4x + 6 &gt; 18", "x &lt; −3", ["−6: −4x &gt; 12", "÷(−4) → FLIP: x &lt; −3"], (-7, 1, -3, False, True)),
]
assert F(18 - 6, -4) == -3 and F(11 + 4, 3) == 5

def practice(key):
    h = page_head("NC.8.EE.7 · Practice", "Solving Equations &amp; Inequalities", "Use the flowchart. Show every step. Check your answer.", key)
    cells = []
    for i, (lab, eq, x, w) in enumerate(P):
        ans = f'<div class="work">{"<br>".join(w)}</div><div class="ansm">x = {neg(x)}</div>' if key else '<div style="height:82px"></div><div>x = <span class="line"></span></div>'
        cells.append(f'<div class="q"><span class="qn">{i + 1}</span><span class="small">{lab}</span><div class="m" style="font-size:12pt;margin:3px 0">{eq}</div>{ans}</div>')
    for j, (lab, eq, sol, w, nl) in enumerate(INEQ):
        lo, hi, at, closed, left = nl
        line = numline(lo, hi, at if key else None, closed, left, 240)
        ans = f'<div class="work">{"<br>".join(w)}</div><div class="ansm">{sol}</div>' if key else '<div style="height:40px"></div><div>Answer: <span class="line"></span></div>'
        cells.append(f'<div class="q"><span class="qn">{len(cells) + 1}</span><span class="small">{lab} — solve and graph</span><div class="m" style="font-size:12pt;margin:3px 0">{eq}</div>{ans}{line}</div>')
    word = ("A phone plan costs <b>$20</b> a month plus <b>$5</b> for each GB of data. Maya can spend <b>at most $55</b>. "
            "Write and solve an inequality to find how many GB, <i>g</i>, she can use.")
    wans = ('<div class="work">20 + 5g ≤ 55 → 5g ≤ 35 → g ≤ 7</div><div class="ansm">20 + 5g ≤ 55; g ≤ 7. She can use at most 7 GB.</div>' if key
            else '<div style="margin-top:6px">Inequality: <span class="line" style="min-width:150px"></span></div><div style="height:22px"></div><div>Answer: <span class="line" style="min-width:200px"></span></div>')
    cells.append(f'<div class="q"><span class="qn">10</span><span class="small">Word problem</span><div class="stem" style="margin-top:3px">{word}</div>{wans}</div>')
    assert F(55 - 20, 5) == 7
    return h + f'<div class="grid2">{"".join(cells)}</div>'

if __name__ == "__main__":
    render([notes], f"{OUT}/Equations_Notes_Flowchart.pdf", footer="Equations & Inequalities Notes")
    render([practice(False)], f"{OUT}/Equations_Practice.pdf", footer="Equations & Inequalities Practice")
    render([practice(True)], f"{OUT}/Equations_Practice_AnswerKey.pdf", footer="Equations & Inequalities Practice — Answer Key")
    print("ok")

