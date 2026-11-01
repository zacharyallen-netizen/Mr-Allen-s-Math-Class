import sys, os, math
sys.path.insert(0, os.path.dirname(__file__))
from kit import *

C = "#B07D00"
def curve(fx=None, fy=None, lo=-5, hi=5, n=80):
    """y = fx(x) for x in [lo,hi]  or  x = fy(y) for y in [lo,hi]; clipped to the grid."""
    def f(X, Y, u):
        pts = []
        for i in range(n + 1):
            t = lo + (hi - lo) * i / n
            x, y = (t, fx(t)) if fx else (fy(t), t)
            if -5.2 <= x <= 5.2 and -5.2 <= y <= 5.2: pts.append(f"{X(x):.1f},{Y(y):.1f}")
        return f'<polyline points="{" ".join(pts)}" fill="none" stroke="{C}" stroke-width="2.2"/>'
    return f
def circle(r):
    return lambda X, Y, u: f'<circle cx="{X(0)}" cy="{Y(0)}" r="{r*u}" fill="none" stroke="{C}" stroke-width="2.2"/>'
def vline(x0):
    return lambda X, Y, u: f'<line x1="{X(x0)}" y1="{Y(-5)}" x2="{X(x0)}" y2="{Y(5)}" stroke="{C}" stroke-width="2.2"/>'
def dots(pts):
    return lambda X, Y, u: "".join(f'<circle cx="{X(a)}" cy="{Y(b)}" r="3.2" fill="{C}"/>' for a, b in pts)
def g(body, u=12): return grid(-5, 5, -5, 5, u=u, body=body, labels=False)

def is_function(pairs):
    seen = {}
    for x, y in pairs:
        if x in seen and seen[x] != y: return False
        seen[x] = y
    return True

# each problem: kind, prompt html, figure html, pairs (for checking) or truth, answer bool, reason
def T(xs, ys): return list(zip(xs, ys))
def ps(pairs): return "{" + ", ".join(pt(a, b) for a, b in pairs) + "}"

SETS = {
 "A": [
  ("Table", T([1, 2, 3, 4], [5, 7, 9, 11]), None, "Each x (1, 2, 3, 4) is used once."),
  ("Table", T([0, 1, 1, 2], [3, 4, 6, 8]), None, "x = 1 goes to 4 AND to 6."),
  ("Ordered pairs", [(-2, 4), (-1, 1), (0, 0), (1, 1), (2, 4)], None, "No x repeats. Repeated y's (4, 1) are OK."),
  ("Ordered pairs", [(3, 1), (5, 2), (3, -4), (7, 6)], None, "x = 3 goes to 1 AND to −4."),
  ("Mapping", ([1, 2, 3], [4, 6], [(0, 0), (1, 1), (2, 1)]), None, "Each input has one arrow. Two inputs sharing 6 is OK."),
  ("Mapping", ([2, 4, 6], [1, 3, 5], [(0, 1), (1, 0), (1, 2), (2, 2)]), None, "Input 4 has two arrows (to 1 and to 5)."),
  ("Graph", None, (g(curve(fx=lambda x: -x + 2)), True), "Any vertical line hits the line once."),
  ("Graph", None, (g(circle(3)), False), "A vertical line hits the circle twice."),
  ("Graph", None, (g(dots([(1, 2), (1, -2), (-2, 1), (3, 3), (-4, -3)])), False), "x = 1 has two points: (1, 2) and (1, −2)."),
 ],
 "B": [
  ("Table", T([-3, -1, 1, 3], [2, 2, 2, 2]), None, "Each x is used once. Every y being 2 is OK."),
  ("Table", T([4, 5, 6, 4], [1, 3, 5, 7]), None, "x = 4 goes to 1 AND to 7."),
  ("Ordered pairs", [(0, 5), (1, 6), (2, 7), (3, 8)], None, "Each x is used once."),
  ("Ordered pairs", [(-1, 3), (2, 3), (-1, 0), (4, 5)], None, "x = −1 goes to 3 AND to 0."),
  ("Mapping", ([5, 6, 7], [8], [(0, 0), (1, 0), (2, 0)]), None, "Each input has exactly one arrow. All going to 8 is OK."),
  ("Mapping", ([1, 2, 3], [4, 5, 6, 7], [(0, 0), (1, 1), (2, 2), (2, 3)]), None, "Input 3 has two arrows (to 6 and to 7)."),
  ("Graph", None, (g(curve(fx=lambda x: x * x - 3, lo=-3, hi=3)), True), "Any vertical line hits the U shape once."),
  ("Graph", None, (g(curve(fy=lambda y: y * y - 2, lo=-3, hi=3)), False), "A vertical line hits this sideways U twice."),
  ("Graph", None, (g(curve(fx=lambda x: 3)), True), "A horizontal line passes: each x has one y (3)."),
 ],
}
LAST = {
 "A": ("Which value of <i>k</i> makes this relation <b>NOT</b> a function?<div class='m' style='margin:3px 0'>{(1, 4), (<i>k</i>, 7), (5, 9), (8, 2)}</div>"
       "<span class='yn'><span>A. 2</span><span class='K'>B. 1</span><span>C. 6</span><span>D. 9</span></span>",
       "B. If k = 1, then x = 1 goes to 4 AND to 7.", [(1, 4), (1, 7), (5, 9), (8, 2)]),
 "B": ("Jada says {(2, 4), (3, 4), (5, 4)} is <b>not</b> a function because the outputs repeat. Is she right? Explain.",
       "No, Jada is wrong. Each x (2, 3, 5) is used once, so it IS a function. Repeated outputs are OK.", [(2, 4), (3, 4), (5, 4)]),
}

def check_sets():
    for k, probs in SETS.items():
        for kind, data, fig, why in probs:
            if kind in ("Table", "Ordered pairs"): ok = is_function(data)
            elif kind == "Mapping": ok = is_function([(data[0][a], data[1][b]) for a, b in data[2]])
            else: ok = fig[1]
            assert ("NOT" not in why) and ((ok and ("OK" in why or "once" in why or "passes" in why)) or (not ok and ("AND" in why or "two" in why or "twice" in why))), (k, kind, why)
    assert not is_function(LAST["A"][2]) and is_function(LAST["B"][2])
    assert all(is_function([(1, 4), (k, 7), (5, 9), (8, 2)]) for k in (2, 6, 9))

def answer_of(kind, data, fig):
    if kind in ("Table", "Ordered pairs"): return is_function(data)
    if kind == "Mapping": return is_function([(data[0][a], data[1][b]) for a, b in data[2]])
    return fig[1]

def practice(setk, key):
    h = page_head(f"NC.8.F.1 · Practice — Set {setk}", "Is It a Function?",
                  "For each one, circle <b>Yes</b> or <b>No</b>. Then tell why.", key)
    cells = []
    for i, (kind, data, fig, why) in enumerate(SETS[setk]):
        ok = answer_of(kind, data, fig)
        if kind == "Table": vis = vtable([a for a, b in data], [b for a, b in data])
        elif kind == "Ordered pairs": vis = f'<div class="m" style="margin:6px 0;font-size:11pt">{ps(data)}</div>'
        elif kind == "Mapping": vis = mapping(*data, w=150)
        else: vis = fig[0]
        yn = f'<span class="yn"><span class="{"on" if key and ok else ""}">Yes</span><span class="{"on" if key and not ok else ""}">No</span></span>'
        why_html = f'<div class="ans" style="font-size:8.6pt;margin-top:2px">{why}</div>' if key else '<div style="margin-top:4px">Why? <span class="line" style="min-width:170px"></span></div>'
        side = kind in ("Mapping", "Graph")
        body = (f'<div style="display:flex;gap:8px;align-items:center"><div>{vis}</div><div style="flex:1">Function?{yn}{why_html}</div></div>' if side
                else f'{vis}<div>Function?{yn}{why_html}</div>')
        cells.append(f'<div class="q"><span class="qn">{i + 1}</span><span class="small">{kind}</span>{body}</div>')
    stem, ans, _ = LAST[setk]
    if key: stem = stem.replace("class='K'", "class='on'")
    tail = f'<div class="ans" style="margin-top:4px">{ans}</div>' if key else '<div style="height:26px"></div><span class="line" style="min-width:300px"></span>'
    cells.append(f'<div class="q"><span class="qn">10</span><span class="small">Think about it</span><div class="stem" style="margin-top:3px">{stem}</div>{tail}</div>')
    return h + f'<div class="grid2" style="zoom:{ZP}">{"".join(cells)}</div>'

# ── notes A: four ways to see it
def notesA():
    h = page_head("NC.8.F.1 · Notes — Set A", "Is It a Function? Four Ways to Check", "Tables · Ordered pairs · Mapping diagrams · Graphs", name=False)
    h += f'<div style="zoom:{ZA}">'
    h += '''<div class="box navyb"><h3>What is a function?</h3><div style="font-size:10pt">A <b style="color:#FFC107">function</b> gives each <b>input (x)</b> <b>exactly one output (y)</b>. Think of a vending machine: press B4 and you always get the same snack.</div></div>
<div class="tip" style="font-size:10.5pt"><b>The ONE question:</b> Does any <b>x</b> repeat with a <b>different y</b>? &nbsp; <b>Yes → NOT a function.</b> &nbsp; <b>No → function.</b> &nbsp; (A repeated <b>y</b> is fine!)</div>'''
    panel = lambda title, good, bad, how: f'<div class="box"><h3>{title}</h3><div class="small" style="margin-bottom:3px">{how}</div><div class="cols"><div class="center">{good}<div class="ans" style="font-size:8.5pt">Function ✓</div></div><div class="center">{bad}<div style="color:#B42318;font:700 8.5pt Inter">NOT a function ✗</div></div></div></div>'
    h += '<div class="grid2">'
    h += panel("1 · Table", vtable([1, 2, 3], [5, 5, 8], False), vtable([2, 2, 4], [1, 6, 3], False), "Look down the x column. Any repeats with different y's?")
    h += panel("2 · Ordered pairs", '<div class="m" style="margin:14px 0">{(1, 3), (2, 5), (4, 3)}</div>', '<div class="m" style="margin:14px 0">{(6, 1), (6, 2), (8, 0)}</div>', "Look at the FIRST number in each pair.")
    h += panel("3 · Mapping diagram", mapping([1, 2, 3], [7, 9], [(0, 0), (1, 1), (2, 1)], 130), mapping([1, 2, 3], [7, 8, 9], [(0, 0), (0, 1), (1, 2), (2, 2)], 130), "Count arrows leaving each input. More than one → NOT.")
    vl = lambda x0: (lambda X, Y, u: f'<line x1="{X(x0)}" y1="{Y(-5)}" x2="{X(x0)}" y2="{Y(5)}" stroke="#B42318" stroke-width="1.4" stroke-dasharray="4 3"/>')
    h += panel("4 · Graph: vertical line test", grid(-5, 5, -5, 5, u=9, body=combine(curve(fx=lambda x: abs(x) - 2), vl(1.5)), labels=False),
               grid(-5, 5, -5, 5, u=9, body=combine(circle(3), vl(1.5)), labels=False), "Slide a vertical line across. Hits 2+ points anywhere → NOT.")
    h += '</div>'
    h += '''<div class="cols"><div class="box gold"><h3>Watch out!</h3><div style="font-size:9.3pt">• Repeated <b>outputs</b> are OK: {(1, 5), (2, 5)} is a function.<br>• A <b>vertical</b> line (like x = 2) is <b>never</b> a function.<br>• A <b>horizontal</b> line (like y = 3) <b>is</b> a function.</div></div>
<div class="box"><h3>Vocabulary</h3><div style="font-size:9.3pt"><b>Input / domain</b> — the x-values &nbsp;·&nbsp; <b>Output / range</b> — the y-values<br><b>Relation</b> — any set of ordered pairs<br><b>Function</b> — a relation where each x has only one y</div></div></div></div>'''
    return h

# ── notes B: a routine + real life
def notesB():
    h = page_head("NC.8.F.1 · Notes — Set B", "Functions: The 3-Step Check", "A routine that works for tables, ordered pairs, mapping diagrams, and graphs", name=False)
    h += f'<div style="zoom:{ZB}">'
    steps = [("1", "Find the inputs.", "The x-values: the left column of a table, the first number of each pair, the left oval of a mapping diagram."),
             ("2", "Look for a repeat.", "Does any input show up more than once?"),
             ("3", "Compare the outputs.", "Same input, <b>different</b> outputs → <b>NOT</b> a function. No repeats → function.")]
    h += '<div class="cols">' + "".join(f'<div class="box" style="display:flex;gap:8px"><div style="flex:none;width:28px;height:28px;border-radius:50%;background:#1E2D4F;color:#FFC107;font:700 14pt/28px Source Serif 4;text-align:center">{n}</div><div><b>{a}</b><div style="font-size:9pt">{b}</div></div></div>' for n, a, b in steps) + '</div>'
    ex = [("Table", vtable([0, 1, 2, 1], [4, 5, 6, 9]), "Inputs: 0, 1, 2, 1. The input 1 repeats. Outputs 5 and 9 are different.", False),
          ("Ordered pairs", '<div class="m" style="margin:8px 0">{(−3, 2), (0, 2), (3, 2)}</div>', "Inputs: −3, 0, 3. No repeats. (Every output is 2 — that is OK.)", True),
          ("Mapping", mapping([4, 5, 6], [0, 1], [(0, 0), (1, 1), (2, 1)], 130), "Each input has exactly one arrow.", True),
          ("Graph", grid(-5, 5, -5, 5, u=9, body=combine(dots([(-3, -1), (-1, 2), (1, 4), (1, -3), (4, 1)]), lambda X, Y, u: f'<line x1="{X(1)}" y1="{Y(-5)}" x2="{X(1)}" y2="{Y(5)}" stroke="#B42318" stroke-width="1.4" stroke-dasharray="4 3"/>'), labels=True, font=6.5),
           "The vertical line x = 1 hits two points: (1, 4) and (1, −3).", False)]
    h += '<h3 style="margin:4px 0 5px">Worked examples</h3><div class="grid2">'
    for kind, vis, txt, ok in ex:
        verdict = '<div class="ans">→ Function ✓</div>' if ok else '<div style="color:#B42318;font:700 9.5pt Inter">→ NOT a function ✗</div>'
        h += f'<div class="box" style="display:flex;gap:8px;align-items:center"><div>{vis}</div><div><b>{kind}</b><div style="font-size:9pt">{txt}</div>{verdict}</div></div>'
    h += '</div>'
    h += '''<div class="cols"><div class="box"><h3>Functions in real life</h3><table class="t"><tr><th>Input → Output</th><th>Function?</th></tr>
<tr><td>A student → their birthday</td><td class="ans">Yes — one birthday each</td></tr>
<tr><td>Number of $3 tickets → total cost</td><td class="ans">Yes — one cost each</td></tr>
<tr><td>A birthday → students born that day</td><td style="color:#B42318;font-weight:700">No — could be many</td></tr></table></div>
<div class="box gold"><h3>Quick rules</h3><div style="font-size:9.3pt">• One x → one y: <b>function</b><br>• One x → two y's: <b>NOT</b><br>• Two x's → same y: still a <b>function</b><br>• Vertical line test on graphs</div></div></div></div>'''
    return h

if __name__ == "__main__":
    import os
    ZA=float(os.environ.get('ZA','1.3')); ZB=float(os.environ.get('ZB','1.32')); ZP=float(os.environ.get('ZP','1.12'))
    check_sets()
    for k in "AB":
        render([notesA() if k == "A" else notesB()], f"{OUT}/Functions_Notes_Set{k}.pdf", footer=f"Functions Notes — Set {k}")
        render([practice(k, False)], f"{OUT}/Functions_Practice_Set{k}.pdf", footer=f"Functions Practice — Set {k}")
        render([practice(k, True)], f"{OUT}/Functions_Practice_Set{k}_AnswerKey.pdf", footer=f"Functions Practice — Set {k} — Answer Key")
    print("ok")

