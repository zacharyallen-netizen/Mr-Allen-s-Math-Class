"""Two-sided handouts: FRONT = notes + sample problems (blank, done in class), BACK = NC Check-In level practice."""
import sys, os
sys.path.insert(0, os.path.dirname(__file__))
from kit import *
import kit
from fractions import Fraction as F
from equations import flowchart
from functions import curve, circle, dots, is_function
from transform import tr, RX, RY, R90, R180, R270, dil, P as PT, fig

L = "ABCDE"
kit.CSS += """
.lab{display:inline-block;font:700 7.5pt Inter;letter-spacing:.06em;text-transform:uppercase;color:#8A6100;background:#FFF6D6;border-radius:4px;padding:1px 6px;margin-left:2px;vertical-align:middle}
.op{display:flex;gap:6px;align-items:center;margin:2px 0;font-size:9.8pt}
.bb{flex:none;width:16px;height:16px;border:1.4px solid #1E2D4F;border-radius:50%;font:700 7.5pt/13px Inter;text-align:center;color:#1E2D4F}
.sq{border-radius:3px}
.on .bb{background:#15803D;border-color:#15803D;color:#fff}
.ops{display:grid;grid-template-columns:1fr 1fr;gap:1px 10px;margin-top:3px}
.ops.c1{grid-template-columns:1fr}.ops.c4{grid-template-columns:repeat(4,1fr)}
.ent{display:inline-block;min-width:96px;height:22px;border:1.6px solid #1E2D4F;border-radius:5px;vertical-align:middle;padding:1px 6px;font:700 10.5pt 'Source Serif 4';color:#15803D}
.sample{border:1px solid #E3E5EA;border-radius:8px;padding:5px 9px;margin-bottom:6px;break-inside:avoid}
.sample .eq{font:600 12pt 'Source Serif 4',Georgia,serif;color:#1E2D4F;margin:2px 0}
.blank{border-bottom:1px dashed #D5D9E0}
.side{font:700 7.5pt Inter;letter-spacing:.12em;text-transform:uppercase;color:#5B6475;margin:0 0 5px}
"""

def num(v):
    v = F(v); return neg(v.numerator) if v.denominator == 1 else fr(neg(v.numerator), v.denominator)

# ── generic Check-In style items
def item(n, typ, stem, body, key, ans_note="", span=False):
    note = f'<div class="ans" style="font-size:8.8pt;margin-top:3px">{ans_note}</div>' if key and ans_note else ""
    return f'<div class="q"{' style="grid-column:span 2"' if span else ""}><span class="qn">{n}</span><span class="lab">{typ}</span><div class="stem" style="margin-top:3px">{stem}</div>{body}{note}</div>'
def mc(opts, correct, key, cols=2):
    c = {1: "c1", 2: "", 4: "c4"}[cols]
    return f'<div class="ops {c}">' + "".join(f'<div class="op{" on" if key and j == correct else ""}"><span class="bb">{L[j]}</span><span>{o}</span></div>' for j, o in enumerate(opts)) + "</div>"
def sa(opts, correct, key, cols=1):
    c = {1: "c1", 2: ""}[cols]
    return f'<div class="ops {c}">' + "".join(f'<div class="op{" on" if key and j in correct else ""}"><span class="bb sq">{L[j]}</span><span>{o}</span></div>' for j, o in enumerate(opts)) + "</div>"
def entry(key, ans, label="Answer:", w=96):
    return f'<div style="margin-top:6px">{label} <span class="ent" style="min-width:{w}px">{ans if key else ""}</span></div>'
def work(h, key):
    return "" if key else f'<div style="height:{h}px"></div>'
def sample(title, eq, steps, key, h=62, extra=""):
    body = f'<div class="ans" style="font:600 9.5pt/1.45 Source Serif 4">{"<br>".join(steps)}</div>' if key else f'<div style="height:{h}px"></div>'
    return f'<div class="sample"><b style="font-size:9.5pt;color:#1E2D4F">{title}</b><div class="eq">{eq}</div>{body}{extra}</div>'
def front_head(k, t, s, key): return page_head(k, t, s, key) + '<div class="side">Side 1 · Notes &amp; sample problems — we do these together</div>'
def back_head(k, t, s, key): return page_head(k, t, s, key) + '<div class="side">Side 2 · Practice — NC Check-In style</div>'

def lin(a, b, c, d): return F(d - b, a - c)        # ax + b = cx + d

# ══════════════════════ EQUATIONS ══════════════════════
assert lin(-4, 9, 0, 37) == -7 and lin(10, -5, 0, 45) == 5 and lin(8, -3, 5, 18) == 7 and lin(1, 6, 4, -12) == 6
def eq_front(key):
    h = front_head("NC.8.EE.7 · Notes", "Solving Equations &amp; Inequalities", "Two-step · Distributive · Variables on both sides · Multi-step · Inequalities", key)
    samples = [
        sample("1 · Two-step", "−4x + 9 = 37", ["−9: −4x = 28", "÷(−4): <b>x = −7</b>"], key),
        sample("2 · Distributive property", "5(2x − 1) = 45", ["10x − 5 = 45", "+5: 10x = 50 → <b>x = 5</b>"], key),
        sample("3 · Variables on both sides", "8x − 3 = 5x + 18", ["−5x: 3x − 3 = 18", "+3: 3x = 21 → <b>x = 7</b>"], key),
        sample("4 · Multi-step", "3(x + 2) − 2x = 4(x − 3)", ["3x + 6 − 2x = 4x − 12", "x + 6 = 4x − 12 → 18 = 3x → <b>x = 6</b>"], key),
        sample("5 · Inequality — solve and graph", "6 − 2x ≤ 14", ["−6: −2x ≤ 8", "÷(−2) → FLIP: <b>x ≥ −4</b>"], key, 30,
               numline(-8, 2, -4 if key else None, True, False, 250)),
        sample("6 · How many solutions?", "2(3x + 1) = 6x + 5", ["6x + 2 = 6x + 5 → 2 = 5 (false)", "<b>No solution</b>"], key, 40)]
    assert F(14 - 6, -2) == -4
    h += f'''<div data-fit><div class="cols" style="gap:10px"><div style="flex:0 0 312px"><div class="box" style="padding:5px 4px 0 6px"><b style="font:600 11pt Source Serif 4;color:#1E2D4F">Follow the flowchart</b><div style="zoom:.8">{flowchart()}</div></div>
<div class="box gold" style="font-size:8.8pt"><b>If the x's cancel out:</b> true (6 = 6) → <b>infinitely many</b> solutions; false (6 = 5) → <b>no solution</b>.<br><b>Graphing:</b> open circle for &lt; &gt;; closed circle for ≤ ≥.</div></div>
<div>{"".join(samples)}</div></div></div>'''
    return h

EQB = dict(q1=lin(1, 7, 0, 13) if False else None)
def eq_back(key):
    h = back_head("NC.8.EE.7 · Practice", "Solving Equations &amp; Inequalities", "Show your work on scratch paper. Check every answer.", key)
    x1 = lin(3, 7, 2, 13); assert x1 == 6                            # 3(x+4) − 5 = 2x + 13
    x2 = lin(5, 6, 0, 41); assert x2 == 7                            # 7x − 2(x − 3) = 41
    x5 = lin(F(1, 2), 3, F(1, 4), 5); assert x5 == 8
    m8 = lin(15, 30, 10, 60); assert m8 == 6
    s9 = (F(40) - F(25, 2)) / F(13, 4); assert 8 < s9 < 9
    assert F(15 - 6, -3) == -3 and lin(3, -8, 0, 4) == 4
    items = [
        item(1, "Multiple choice", "Solve. <span class='m'>3(x + 4) − 5 = 2x + 13</span>", mc(["x = 2", "x = 4", "x = 6", "x = 14"], 2, key, 4), key, "3x + 7 = 2x + 13 → x = 6"),
        item(2, "Numeric entry", "Solve. <span class='m'>7x − 2(x − 3) = 41</span>", entry(key, "x = 7"), key, "5x + 6 = 41 → 5x = 35"),
        item(3, "Multiple choice", "How many solutions does <span class='m'>4(x − 2) + 3 = 4x − 5</span> have?", mc(["No solution", "One: x = 0", "One: x = −5", "Infinitely many"], 3, key), key, "4x − 5 = 4x − 5 is always true"),
        item(4, "Select all", "Select <b>ALL</b> equations that have <b>no solution</b>.", sa(["2(x + 1) = 2x + 3", "3x + 4 = 3x + 4", "5x − 1 = 5x + 1", "2x + 6 = 2(x + 3)", "4x = 2x"], [0, 2], key, 2), key, "A and C end false; B, D always true; E: x = 0"),
        item(5, "Numeric entry", "Solve. <span class='m'>" + fr(1, 2) + "x + 3 = " + fr(1, 4) + "x + 5</span>", entry(key, "x = 8"), key, "×4: 2x + 12 = x + 20"),
        item(6, "Multiple choice", "Solve. <span class='m'>−3(x − 2) ≥ 15</span>", mc(["x ≥ −3", "x ≤ −3", "x ≥ −7", "x ≤ 7"], 1, key, 4), key, "−3x + 6 ≥ 15 → −3x ≥ 9 → ÷(−3) FLIP"),
        item(7, "Solve and graph", "<span class='m'>5x − 8 &gt; 2x + 4</span>", entry(key, "x &gt; 4") + numline(0, 9, 4 if key else None, False, False, 240), key, "3x − 8 > 4 → 3x > 12"),
        item(8, "Numeric entry", "Gym A costs <b>$30</b> to join plus <b>$15</b> a month. Gym B costs <b>$60</b> to join plus <b>$10</b> a month. After how many months do they cost the same?", entry(key, "6 months"), key, "30 + 15m = 60 + 10m → 5m = 30"),
        item(9, "Numeric entry", "Lena has <b>$40</b>. She buys a <b>$12.50</b> ticket and some snacks that cost <b>$3.25</b> each. What is the <b>greatest</b> number of snacks she can buy?", entry(key, "8 snacks"), key, "12.50 + 3.25s ≤ 40 → s ≤ 8.46 → 8"),
        item(10, "Find the error", "Jamal solved <span class='m'>−2x + 6 &lt; 14</span>:<br>−2x &lt; 8 &nbsp;→&nbsp; x &lt; −4. &nbsp; What did he do wrong? Fix it.", work(34, key), key, "He divided by −2 but did not flip: x > −4"),
    ]
    return h + f'<div data-fit><div class="grid2">{"".join(items)}</div></div>'

# ══════════════════════ FUNCTIONS ══════════════════════
def gg(body, u=8): return grid(-5, 5, -5, 5, u=u, body=body, labels=False)
YN = lambda key, ok: f'<span class="yn"><span class="{"on" if key and ok else ""}">Yes</span><span class="{"on" if key and not ok else ""}">No</span></span>'
def fsample(n, kind, vis, ok, why, key, side=False):
    yn = f'Function? {YN(key, ok)}'
    w = f'<div class="ans" style="font-size:8.6pt">{why}</div>' if key else '<div style="margin-top:3px">Why? <span class="line" style="min-width:110px"></span></div>'
    inner = f'<div style="display:flex;gap:6px;align-items:center"><div>{vis}</div><div>{yn}{w}</div></div>' if side else f'{vis}<div>{yn}{w}</div>'
    return f'<div class="sample"><b style="font-size:9.3pt;color:#1E2D4F">{n} · {kind}</b>{inner}</div>'

def fn_notes_ref():
    return '''<div class="box navyb" style="padding:5px 10px"><div style="font-size:9.6pt">A <b style="color:#FFC107">function</b> gives each <b>input (x)</b> <b>exactly one output (y)</b>.
<b>The ONE question:</b> does any x repeat with a <b>different</b> y? Yes → NOT a function. (A repeated <b>y</b> is fine.)</div></div>
<table class="t" style="margin-bottom:6px"><tr><th>Representation</th><th>How to check</th></tr>
<tr><td><b>Table</b></td><td>Look down the x column. Same x with different y's? → NOT</td></tr>
<tr><td><b>Ordered pairs</b></td><td>Look at the FIRST number of each pair.</td></tr>
<tr><td><b>Mapping diagram</b></td><td>Count arrows leaving each input. More than one → NOT</td></tr>
<tr><td><b>Graph</b></td><td><b>Vertical line test:</b> a vertical line hits 2+ points anywhere → NOT</td></tr></table>'''

def fn_front(setk, key):
    if setk == "A":
        h = front_head("NC.8.F.1 · Notes — Set A", "Is It a Function?", "Tables · Ordered pairs · Mapping diagrams · Graphs", key)
        S = [("Table", vtable([2, 4, 6, 8], [1, 1, 3, 3]), [(2, 1), (4, 1), (6, 3), (8, 3)], "Each x used once. Repeated y's OK.", False),
             ("Ordered pairs", '<div class="m" style="margin:3px 0">{(5, 2), (7, −1), (5, 4), (9, 0)}</div>', [(5, 2), (7, -1), (5, 4), (9, 0)], "x = 5 → 2 AND 4", False),
             ("Mapping diagram", mapping([-1, 0, 2], [3, 5, 8], [(0, 0), (1, 1), (1, 2), (2, 0)], 130), [(-1, 3), (0, 5), (0, 8), (2, 3)], "Input 0 has two arrows", True),
             ("Graph", gg(curve(fx=lambda x: abs(x) - 1)), None, "A vertical line hits once", True),
             ("Graph", gg(lambda X, Y, u: f'<line x1="{X(3)}" y1="{Y(-5)}" x2="{X(3)}" y2="{Y(5)}" stroke="#B07D00" stroke-width="2.2"/>'), None, "x = 3 has many outputs", True)]
        oks = [True, False, False, True, False]
        last = ('<div class="sample"><b style="font-size:9.3pt;color:#1E2D4F">6 · Find k</b><div class="m" style="margin:3px 0">{(2, 3), (<i>k</i>, 6), (−1, 4)}</div>'
                '<div style="font-size:9.3pt">Name a value of <i>k</i> that makes this <b>NOT</b> a function.</div>'
                + ('<div class="ans">k = 2 or k = −1 (an x already used)</div>' if key else '<div style="margin-top:3px">k = <span class="line"></span></div>') + '</div>')
    else:
        h = front_head("NC.8.F.1 · Notes — Set B", "Functions: The 3-Step Check", "1. Find the inputs → 2. Look for a repeat → 3. Compare the outputs", key)
        S = [("Table", vtable([-2, -1, 0, 1], [4, 1, 0, 1]), [(-2, 4), (-1, 1), (0, 0), (1, 1)], "No x repeats", False),
             ("Ordered pairs", '<div class="m" style="margin:3px 0">{(3, 8), (4, 8), (3, 9)}</div>', [(3, 8), (4, 8), (3, 9)], "x = 3 → 8 AND 9", False),
             ("Mapping diagram", mapping([4, 5, 6], [2, 7], [(0, 0), (1, 0), (2, 1)], 130), [(4, 2), (5, 2), (6, 7)], "One arrow from each input", True),
             ("Graph", gg(curve(fx=lambda x: x * x - 4, lo=-3, hi=3)), None, "A vertical line hits once", True),
             ("Graph", gg(circle(2)), None, "A vertical line hits twice", True)]
        oks = [True, False, True, True, False]
        last = ('<div class="sample"><b style="font-size:9.3pt;color:#1E2D4F">6 · Real life</b><div style="font-size:9.3pt;margin-top:2px">Input: a person. Output: that person\'s age today. Is this a function? Why?</div>'
                + ('<div class="ans">Yes — each person has exactly one age.</div>' if key else '<div style="height:22px"></div>') + '</div>')
    for (kind, vis, pairs, why, side), ok in zip(S, oks):
        if pairs: assert is_function(pairs) == ok, (kind, pairs)
    cells = "".join(fsample(i + 1, k, v, ok, w, key, side) for i, ((k, v, p, w, side), ok) in enumerate(zip(S, oks)))
    return h + f'<div data-fit>{fn_notes_ref()}<div class="tip" style="font-size:9pt"><b>Watch out:</b> repeated <b>outputs</b> are OK · a <b>vertical</b> line is never a function · a <b>horizontal</b> line is a function.</div><div class="grid2">{cells}{last}</div></div>'

def tiny_table(xs, ys): return vtable(xs, ys).replace('class="vt"', 'class="vt" style="font-size:8.5pt;margin:2px 0"')
def fn_back(setk, key):
    h = back_head(f"NC.8.F.1 · Practice — Set {setk}", "Is It a Function?", "Read each question carefully. Watch for NOT.", key)
    if setk == "A":
        T = [([1, 1, 2, 3], [4, 6, 8, 9]), ([3, 4, 3, 5], [0, 1, 2, 3]), ([0, 2, 4, 6], [5, 5, 5, 5]), ([-1, 0, -1, 1], [2, 3, 4, 5])]
        assert [is_function(list(zip(*t))) for t in T] == [False, False, True, False]
        sets = [[(1, 2), (2, 4), (3, 6)], [(0, 1), (0, -1), (2, 3)], [(-2, 5), (-1, 5), (0, 5)], [(4, 1), (5, 2), (4, 3)], [(7, 0), (8, 1), (9, 0)]]
        assert [i for i, s in enumerate(sets) if is_function(s)] == [0, 2, 4]
        graphs = [gg(circle(3), 7), gg(curve(fy=lambda y: y * y - 3, lo=-3, hi=3), 7), gg(curve(fx=lambda x: 0.5 * x + 1), 7), gg(lambda X, Y, u: f'<line x1="{X(-2)}" y1="{Y(-5)}" x2="{X(-2)}" y2="{Y(5)}" stroke="#B07D00" stroke-width="2.2"/>', 7)]
        kset = [(-3, 1), (0, 4), (None, 7), (5, 2)]
        kopts = [1, 4, 5, 7]; kans = [i for i, k in enumerate(kopts) if not is_function([(k if a is None else a, b) for a, b in kset])]
        assert kans == [2]
        items = [
          item(1, "Multiple choice", "Which table shows <i>y</i> as a function of <i>x</i>?", mc([tiny_table(*t) for t in T], 2, key), key, "C: each x used once"),
          item(2, "Select all", "Select <b>ALL</b> relations that are functions.", sa(["{" + ", ".join(pt(*p) for p in s) + "}" for s in sets], [0, 2, 4], key), key, "B: x = 0 twice; D: x = 4 twice"),
          item(3, "Multiple choice", "Which graph shows a function?", mc(graphs, 2, key, 4), key, "C passes the vertical line test", span=True),
          item(4, "Multiple choice", "Which value of <i>k</i> makes this relation <b>NOT</b> a function?<div class='m'>{(−3, 1), (0, 4), (<i>k</i>, 7), (5, 2)}</div>", mc([str(k) for k in kopts], 2, key, 4), key, "k = 5 repeats the input 5"),
          item(5, "Multiple choice", "Which situation is <b>NOT</b> a function?", mc(["Input: a student → Output: their height today", "Input: hours worked at $12 an hour → Output: pay", "Input: a zip code → Output: a person who lives there", "Input: a side length → Output: the area of the square"], 2, key, 1), key, "Many people share one zip code"),
          item(6, "Select all", "Select <b>ALL</b> true statements.", sa(["A function can have two inputs with the same output.", "A function can have one input with two outputs.", "A vertical line is a function.", "A horizontal line is a function.", "A circle is a function."], [0, 3], key), key, "A and D"),
          item(7, "Is it a function?", "Write the ordered pairs. Then decide." + mapping([1, 2, 3], [6, 8], [(0, 0), (1, 0), (2, 1)], 130), entry(key, "{(1, 6), (2, 6), (3, 8)} — Yes", "Pairs:", 150), key),
          item(8, "Complete it", "Fill in the blank so the table is <b>NOT</b> a function." + tiny_table([2, 4, "?"], [7, 9, 11]), entry(key, "2 or 4", "? ="), key, "Use an x already in the table"),
          item(9, "Find the error", "Tia says {(3, 5), (4, 5), (6, 5)} is <b>not</b> a function because 5 repeats. Is she right? Explain.", work(30, key), key, "No. Each x is used once; repeated outputs are OK. It IS a function."),
        ]
        assert is_function([(1, 6), (2, 6), (3, 8)]) and is_function([(3, 5), (4, 5), (6, 5)])
    else:
        T = [([1, 2, 3, 4], [3, 5, 7, 9]), ([5, 6, 7, 8], [1, 1, 2, 2]), ([2, 2, 3, 4], [1, 5, 6, 7]), ([0, 1, 2, 3], [4, 4, 4, 4])]
        assert [is_function(list(zip(*t))) for t in T] == [True, True, False, True]
        sets = [[(1, 1), (1, 2), (2, 3)], [(4, 6), (5, 6), (6, 6)], [(-1, 0), (0, -1), (-1, 2)], [(8, 3), (9, 4), (10, 5)], [(2, 2), (3, 3), (2, -2)]]
        assert [i for i, s in enumerate(sets) if not is_function(s)] == [0, 2, 4]
        graphs = [gg(curve(fx=lambda x: -2 * x + 1), 7), gg(curve(fx=lambda x: x * x - 2, lo=-3, hi=3), 7), gg(curve(fx=lambda x: abs(x)), 7), gg(curve(fy=lambda y: y * y - 3, lo=-3, hi=3), 7)]
        kset = [(2, -1), (None, 3), (6, 0), (8, 5)]; kopts = [3, 5, 6, 0]
        assert [i for i, k in enumerate(kopts) if not is_function([(k if a is None else a, b) for a, b in kset])] == [2]
        gp = [(-3, 2), (-1, -1), (1, 3), (1, -2), (4, 0)]
        assert not is_function(gp) and is_function([p for p in gp if p != (1, -2)]) and not is_function([p for p in gp if p != (4, 0)])
        items = [
          item(1, "Multiple choice", "Which table is <b>NOT</b> a function?", mc([tiny_table(*t) for t in T], 2, key), key, "C: x = 2 → 1 AND 5"),
          item(2, "Select all", "Select <b>ALL</b> relations that are <b>NOT</b> functions.", sa(["{" + ", ".join(pt(*p) for p in s) + "}" for s in sets], [0, 2, 4], key), key, "A: x = 1; C: x = −1; E: x = 2 repeat"),
          item(3, "Multiple choice", "Which graph is <b>NOT</b> a function?", mc(graphs, 3, key, 4), key, "D fails the vertical line test", span=True),
          item(4, "Multiple choice", "Which value of <i>k</i> makes this relation <b>NOT</b> a function?<div class='m'>{(2, −1), (<i>k</i>, 3), (6, 0), (8, 5)}</div>", mc([str(k) for k in kopts], 2, key, 4), key, "k = 6 repeats the input 6"),
          item(5, "Multiple choice", "Which situation <b>IS</b> a function?", mc(["Input: a number → Output: a bigger number", "Input: a teacher → Output: a student in the class", "Input: gallons of gas at $3.50 → Output: total cost", "Input: a letter → Output: a word that starts with it"], 2, key, 1), key, "Each amount of gas has one cost"),
          item(6, "Select all", "The graph shows the points (−3, 2), (−1, −1), (1, 3), (1, −2), and (4, 0). Select <b>ALL</b> true statements." + grid(-5, 5, -5, 5, u=7, body=dots(gp), labels=False),
               sa(["It is a function.", "x = 1 has two outputs.", "Removing (1, −2) makes it a function.", "Removing (4, 0) makes it a function.", "The vertical line test fails at x = 1."], [1, 2, 4], key), key, "B, C and E"),
          item(7, "Is it a function?", "Use the rule <i>y</i> = 2<i>x</i> + 1. Complete the table, then decide." + tiny_table([-1, 0, 1, 2], ["−1" if key else "", "1" if key else "", "3" if key else "", "5" if key else ""]), entry(key, "Yes", "Function?"), key, "Each x has one y"),
          item(8, "Complete it", "Add one ordered pair to {(1, 4), (2, 5), (3, 6)} so it is <b>NOT</b> a function.", entry(key, "(1, 7) — any (1, y ≠ 4)", "Pair:", 150), key, "Reuse an x with a new y"),
          item(9, "Find the error", "Marco says the graph of <i>y</i> = −2 (a horizontal line) is <b>not</b> a function because all the y-values are the same. Is he right? Explain.", work(30, key), key, "No. Each x has exactly one y (−2). It passes the vertical line test."),
        ]
    return h + f'<div data-fit><div class="grid2">{"".join(items)}</div></div>'

# ══════════════════════ TRANSFORMATIONS ══════════════════════
RULES = '''<table class="t" style="margin-bottom:6px"><tr><th>Transformation</th><th>Rule</th><th>Remember</th></tr>
<tr><td><b>Translation</b> a right/left, b up/down</td><td class="m">(x + a, y + b)</td><td>Left and down are minus</td></tr>
<tr><td><b>Reflection</b> over the x-axis</td><td class="m">(x, −y)</td><td>y changes sign</td></tr>
<tr><td><b>Reflection</b> over the y-axis</td><td class="m">(−x, y)</td><td>x changes sign</td></tr>
<tr><td><b>Rotation</b> 90° counterclockwise</td><td class="m">(−y, x)</td><td>swap, then new 1st number changes sign</td></tr>
<tr><td><b>Rotation</b> 180°</td><td class="m">(−x, −y)</td><td>both signs change</td></tr>
<tr><td><b>Rotation</b> 90° clockwise (270° ccw)</td><td class="m">(y, −x)</td><td>swap, then new 2nd number changes sign</td></tr>
<tr><td><b>Dilation</b> scale factor k, center (0, 0)</td><td class="m">(kx, ky)</td><td>multiply both; similar, not congruent</td></tr></table>'''
DESCRIBE = '''<table class="t" style="margin-bottom:6px"><tr><th>What changed from (x, y)?</th><th>It is a…</th></tr>
<tr><td>Same number <b>added</b> to every x (and/or every y)</td><td><b>Translation</b></td></tr>
<tr><td>Only <b>y</b> changed sign</td><td><b>Reflection over the x-axis</b></td></tr>
<tr><td>Only <b>x</b> changed sign</td><td><b>Reflection over the y-axis</b></td></tr>
<tr><td><b>Both</b> signs changed, no swap</td><td><b>Rotation 180°</b></td></tr>
<tr><td>Numbers <b>swapped</b>; new 1st number changed sign</td><td><b>Rotation 90° counterclockwise</b></td></tr>
<tr><td>Numbers <b>swapped</b>; new 2nd number changed sign</td><td><b>Rotation 90° clockwise</b></td></tr>
<tr><td>Every number <b>multiplied</b> by k</td><td><b>Dilation, scale factor k</b></td></tr></table>'''
CS = '<div class="tip" style="font-size:9pt"><b>Congruent (≅):</b> translations, reflections, rotations keep size and shape. <b>Similar (~):</b> a dilation keeps shape, changes size. Angles never change.</div>'

def coords(pts, lab="ABC", prime=False): return ", ".join(f"{c}{'′' if prime else ''}{PT(p)}" for c, p in zip(lab, pts))

def tf_front(setk, key):
    if setk == "A":
        h = front_head("NC.8.G.3 · Notes — Set A", "Transformations with Coordinates", "Translations · Reflections · Rotations · Dilations", key)
        tri = [(1, 2), (4, 2), (2, 5)]
        six = [("Translate 5 left and 3 down", tr(-5, -3)), ("Reflect over the x-axis", RX), ("Rotate 90° counterclockwise", R90)]
        rows = "".join(f'<tr style="height:30px"><td><span class="qn">{i + 1}</span>{n}</td>' + "".join(f'<td class="{"ansm" if key else ""}" style="white-space:nowrap">{PT(f(p)) if key else ""}</td>' for p in tri) + "</tr>" for i, (n, f) in enumerate(six))
        g = fig(tri, [f(p) for p in tri] if False else None, rng=(-7, 7, -7, 7), u=10)
        extra_pre = [(2, 3), (5, 3), (5, 1)]; extra_img = [R90(p) for p in extra_pre]
        assert extra_img == [(-3, 2), (-3, 5), (-1, 5)]
        assert dil(F(1, 2))((6, -8)) == (3, -4)
        samples = (f'<div class="cols" style="align-items:flex-start;gap:8px"><div style="flex:none">{g}<div class="small center">{coords(tri)}</div></div>'
                   f'<div><table class="t"><tr><th style="width:44%">Do this to ABC</th><th>A′</th><th>B′</th><th>C′</th></tr>{rows}</table>'
                   f'<div class="sample" style="margin-top:6px"><b style="font-size:9.3pt;color:#1E2D4F">4 · Dilation</b> Point P(6, −8) is dilated by a scale factor of ½. Find P′.'
                   + (f'<div class="ansm">P′(3, −4) — multiply both by ½</div>' if key else '<div style="margin-top:4px">P′ = <span class="line"></span></div>') + '</div></div></div>'
                   f'<div class="sample"><b style="font-size:9.3pt;color:#1E2D4F">5 · Describe it</b> &nbsp;<span class="m" style="font-size:9.5pt">{coords(extra_pre, "DEF")} → {coords(extra_img, "DEF", True)}</span>'
                   + ('<div class="ansm">Numbers swapped, new 1st number changed sign → rotation 90° counterclockwise. Congruent.</div>' if key else '<div style="margin-top:6px">It is a <span class="line" style="min-width:240px"></span> &nbsp; Congruent or similar? <span class="line" style="min-width:80px"></span></div>') + '</div>')
        return h + f'<div data-fit>{RULES}{CS}{samples}</div>'
    h = front_head("NC.8.G.3 · Notes — Set B", "Describe the Transformation", "Compare the coordinates: what changed?", key)
    D = [("Reflection over the x-axis", [(1, 3), (4, 3), (2, 5)], RX, "congruent"),
         ("Rotation 180°", [(2, 1), (4, 1), (4, 2)], R180, "congruent"),
         ("Dilation, scale factor ½", [(2, 2), (4, 2), (2, 6)], dil(F(1, 2)), "similar")]
    cells = ""
    for i, (name, pre, f, cs) in enumerate(D):
        img = [f(p) for p in pre]
        cells += (f'<div class="sample"><b style="font-size:9.3pt;color:#1E2D4F">{i + 1} · Describe it</b> &nbsp;<span class="m" style="font-size:9.5pt">{coords(pre, "DEF")} → {coords(img, "DEF", True)}</span>'
                  + (f'<div class="ansm">{name}. {cs.capitalize()}.</div>' if key else '<div style="margin-top:5px">It is a <span class="line" style="min-width:230px"></span> &nbsp; Congruent or similar? <span class="line" style="min-width:80px"></span></div>') + '</div>')
    assert R270((-5, 2)) == (2, 5) and tr(-4, 7)((3, -6)) == (-1, 1)
    cells += '<div class="cols">'
    cells += ('<div class="sample"><b style="font-size:9.3pt;color:#1E2D4F">4 · Find it</b> Rotate (−5, 2) <b>90° clockwise</b>.' + ('<div class="ansm">(2, 5): (y, −x)</div>' if key else '<div style="margin-top:6px">Answer: <span class="line"></span></div>') + '</div>')
    cells += ('<div class="sample"><b style="font-size:9.3pt;color:#1E2D4F">5 · Find it</b> Translate (3, −6) <b>4 left and 7 up</b>.' + ('<div class="ansm">(−1, 1)</div>' if key else '<div style="margin-top:6px">Answer: <span class="line"></span></div>') + '</div></div>')
    return h + f'<div data-fit>{DESCRIBE}{CS}{cells}</div>'

def tf_back(setk, key):
    h = back_head(f"NC.8.G.3 · Practice — Set {setk}", "Transformations with Coordinates", "Use the rules. Sketch on scratch paper to check.", key)
    if setk == "A":
        assert RY((3, -2)) == (-3, -2) and tr(6, -9)((-4, 7)) == (2, -2) and R180((-2, 5)) == (2, -5) and dil(F(1, 4))((8, -4)) == (2, -1) and R90((4, 1)) == (-1, 4)
        W = [(1, 1), (4, 1), (4, 3), (1, 3)]; Wi = [RX(p) for p in W]
        dpre = [(1, 1), (3, 1), (1, 4)]; dimg = [tr(-3, 2)(p) for p in dpre]
        assert dil(3)((2, -1)) == (6, -3)
        items = [
          item(1, "Multiple choice", "Point P(3, −2) is reflected over the <b>y-axis</b>. Where is P′?", mc(["(3, 2)", "(−3, −2)", "(−3, 2)", "(−2, 3)"], 1, key, 4), key, "(−x, y)"),
          item(2, "Multiple choice", "Which rule describes a rotation of <b>90° clockwise</b> about the origin?", mc(["(x, y) → (−y, x)", "(x, y) → (y, −x)", "(x, y) → (−x, −y)", "(x, y) → (x, −y)"], 1, key), key),
          item(3, "Numeric entry", "Point K(−4, 7) is translated <b>6 right and 9 down</b>. Find K′.", entry(key, "(2, −2)", "K′ ="), key, "−4 + 6 = 2; 7 − 9 = −2"),
          item(4, "Select all", "A figure is dilated by a scale factor of <b>3</b> about the origin. Select <b>ALL</b> true statements.", sa(["The image is congruent to the figure.", "The image is similar to the figure.", "The angle measures stay the same.", "Each side is 3 times as long.", "The point (2, −1) moves to (5, 2)."], [1, 2, 3], key), key, "(2, −1) → (6, −3)"),
          item(5, "Multiple choice", "Point (−2, 5) is rotated <b>180°</b> about the origin. Where does it go?", mc(["(2, 5)", "(−2, −5)", "(2, −5)", "(5, −2)"], 2, key, 4), key, "(−x, −y)"),
          item(6, "Multiple choice", "Point (8, −4) is dilated by a scale factor of <b>¼</b>. Where does it go?", mc(["(32, −16)", "(2, −1)", "(4, −8)", "(2, 1)"], 1, key, 2), key, "8 × ¼ = 2; −4 × ¼ = −1"),
          item(7, "Numeric entry", f"Rectangle WXYZ has vertices {coords(W, 'WXYZ')}. It is reflected over the <b>x-axis</b>. Write the new vertices.", entry(key, coords(Wi, "WXYZ", True), "", 250) if key else '<div style="margin-top:6px;line-height:2.2">' + ' &nbsp; '.join(c + '′ <span class="line" style="min-width:70px"></span>' for c in 'WXYZ') + '</div>', key, "y changes sign"),
          item(8, "Multiple choice", "A(2, 1) → A′(2, −1) and B(5, 3) → B′(5, −3). Which transformation is it?", mc(["Reflection over the x-axis", "Reflection over the y-axis", "Rotation 180°", "Translation 2 down"], 0, key, 1), key, "Only y changed sign"),
          item(9, "Describe it", f"{coords(dpre, 'DEF')} → {coords(dimg, 'DEF', True)}. Describe the transformation. Congruent or similar?",
               '<div style="display:flex;gap:8px;align-items:center;margin-top:3px">' + fig(dpre, dimg, "DEF", (-4, 5, -1, 7), u=13) + ('' if key else '<div style="flex:1;line-height:2.4">It is a <span class="line" style="min-width:110px"></span><br>Congruent or similar?<br><span class="line" style="min-width:110px"></span></div>') + '</div>', key, "Translation 3 left and 2 up. Congruent."),
          item(10, "Find the error", "Sam rotated (4, 1) <b>90° counterclockwise</b> and got (1, −4). What went wrong? Fix it.", work(30, key), key, "He used the clockwise rule. 90° ccw: (−y, x) = (−1, 4)."),
        ]
    else:
        assert RX((-6, 2)) == (-6, -2) and R90((5, -3)) == (3, 5) and dil(F(1, 2))((4, -10)) == (2, -5) and R270((-3, -7)) == (-7, 3) and dil(F(1, 3))((6, 9)) == (2, 3)
        J = [(-4, 1), (-1, 1), (-1, 4)]; Ji = [R180(p) for p in J]
        assert tr(3, -3)((1, 2)) == (4, -1) and tr(3, -3)((3, 5)) == (6, 2)
        dpre = [(2, 1), (2, 3), (5, 1)]; dimg = [R90(p) for p in dpre]
        assert dimg == [(-1, 2), (-3, 2), (-1, 5)]
        items = [
          item(1, "Multiple choice", "Point M(−6, 2) is reflected over the <b>x-axis</b>. Where is M′?", mc(["(6, 2)", "(−6, −2)", "(6, −2)", "(2, −6)"], 1, key, 4), key, "(x, −y)"),
          item(2, "Multiple choice", "Which rule describes a reflection over the <b>y-axis</b>?", mc(["(x, y) → (x, −y)", "(x, y) → (−x, −y)", "(x, y) → (−x, y)", "(x, y) → (y, x)"], 2, key), key),
          item(3, "Numeric entry", "Point Q(5, −3) is rotated <b>90° counterclockwise</b> about the origin. Find Q′.", entry(key, "(3, 5)", "Q′ ="), key, "(−y, x) = (3, 5)"),
          item(4, "Select all", "Select <b>ALL</b> transformations that always make a <b>congruent</b> figure.", sa(["Translation 4 units up", "Reflection over the y-axis", "Rotation 90° clockwise", "Dilation, scale factor 2", "Dilation, scale factor ⅓"], [0, 1, 2], key), key, "Dilations change size"),
          item(5, "Multiple choice", "Point (4, −10) is dilated by a scale factor of <b>½</b>. Where does it go?", mc(["(8, −20)", "(2, 5)", "(2, −5)", "(−2, 5)"], 2, key, 4), key),
          item(6, "Multiple choice", "A transformation follows the rule (x, y) → (y, −x). Where does (−3, −7) go?", mc(["(7, 3)", "(−7, 3)", "(3, 7)", "(−7, −3)"], 1, key, 4), key, "y = −7; −x = 3"),
          item(7, "Numeric entry", f"Triangle JKL has vertices {coords(J, 'JKL')}. It is rotated <b>180°</b>. Write the new vertices.", entry(key, coords(Ji, "JKL", True), "", 250) if key else '<div style="margin-top:6px;line-height:2.2">' + ' &nbsp; '.join(c + '′ <span class="line" style="min-width:70px"></span>' for c in 'JKL') + '</div>', key, "Both signs change"),
          item(8, "Multiple choice", "A(1, 2) → A′(4, −1) and B(3, 5) → B′(6, 2). Which transformation is it?", mc(["Translation 3 right and 3 down", "Translation 3 left and 3 up", "Reflection over the x-axis", "Rotation 90° clockwise"], 0, key, 1), key, "+3 to x, −3 to y"),
          item(9, "Describe it", f"{coords(dpre, 'DEF')} → {coords(dimg, 'DEF', True)}. Describe the transformation. Congruent or similar?",
               '<div style="display:flex;gap:8px;align-items:center;margin-top:3px">' + fig(dpre, dimg, "DEF", (-4, 6, -1, 6), u=13) + ('' if key else '<div style="flex:1;line-height:2.4">It is a <span class="line" style="min-width:110px"></span><br>Congruent or similar?<br><span class="line" style="min-width:110px"></span></div>') + '</div>', key, "Rotation 90° counterclockwise. Congruent."),
          item(10, "Find the error", "Ava says dilating (6, 9) by a scale factor of ⅓ gives (18, 27). Is she right? Fix it.", work(30, key), key, "No. She multiplied by 3. × ⅓ gives (2, 3)."),
        ]
    return h + f'<div data-fit><div class="grid2">{"".join(items)}</div></div>'

HANDOUTS = [("Equations", eq_front, eq_back, None), ("Functions_SetA", fn_front, fn_back, "A"), ("Functions_SetB", fn_front, fn_back, "B"),
            ("Transformations_SetA", tf_front, tf_back, "A"), ("Transformations_SetB", tf_front, tf_back, "B")]
if __name__ == "__main__":
    os.makedirs(f"{OUT}/parts", exist_ok=True)
    for key in (False, True):
        for name, fr_, bk, s in HANDOUTS:
            pages = [fr_(key) if s is None else fr_(s, key), bk(key) if s is None else bk(s, key)]
            render(pages, f"{OUT}/parts/{name}{'_KEY' if key else ''}.pdf", footer=name.replace("_", " ") + (" — Answer Key" if key else ""), fit=True)
    print("ok")
