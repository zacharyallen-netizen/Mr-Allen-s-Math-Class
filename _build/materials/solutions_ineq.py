"""Set 2 — Solutions & Inequalities (NC.8.EE.7) — two-sided handout + separate answer key.
FRONT: notes (how many solutions table, inequality box, steps, vocab) + 6 blank sample problems
       (2 "how many solutions", 4 solve-and-graph inequalities), worked in green on the key.
BACK: 10 leveled Check-In style practice items (Approaching (3) / Proficient (4) / Mastery (5)).

    sh _build/materials/get_fonts.sh
    OUT_DIR=/path/to/out python3 _build/materials/solutions_ineq.py

Format copied from multistep.py. Every equation/inequality line (problem AND each worked step) is written
once in plain text and checked with Fraction arithmetic before rendering. For inequalities the final answer
"x op c" is checked against the original on a dense set of test values (integers and halves), so both the
direction and the endpoint (open/closed) are asserted; the graph is drawn from that same checked answer.
No fractions anywhere; distributive problems distribute integers only.
"""
import sys, os, re
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from kit import *
import kit
from fractions import Fraction as F
from handouts import mc, sa, front_head, back_head
import handouts

TOPIC, STD = "Solutions &amp; Inequalities", "NC.8.EE.7"
TOPIC_TXT = "Solutions & Inequalities"

kit.CSS += """
.lv{grid-column:span 2;display:flex;align-items:center;gap:8px;margin:2px 0 0;font:700 9pt Inter;color:#1E2D4F}
.stp{font:600 9pt/1.35 'Source Serif 4',Georgia,serif;color:#15803D}
.stp .sl{font:600 7.6pt Inter;color:#15803D;opacity:.8;margin-right:5px}.stp .sl:after{content:':'}
.stp .fl{font:800 7.4pt Inter;color:#fff;background:#B42318;border-radius:3px;padding:0 4px;margin-left:4px}
table.st{border-collapse:collapse;width:100%;font-size:8.6pt;margin-top:3px}
table.st th{background:#1E2D4F;color:#fff;font:600 8pt Inter;text-align:left;padding:3px 5px}
table.st td{border-bottom:1px solid #E3E5EA;padding:3px 5px;vertical-align:middle;line-height:1.3}
table.st td.e{font:600 9pt 'Source Serif 4',Georgia,serif;color:#1E2D4F;white-space:nowrap}
.sym{display:grid;grid-template-columns:28px 1fr 74px;gap:2px 6px;align-items:center;font-size:8.6pt;margin:3px 0 4px}
.sym .s{font:700 13pt 'Source Serif 4',Georgia,serif;color:#1E2D4F;text-align:center}
.flip{background:#1E2D4F;color:#fff;border-radius:6px;padding:4px 8px;font-size:8.8pt;margin:3px 0 2px}
.flip b{color:#FFC107}
"""

# ── plain text → checked math + HTML ──────────────────────────────────────────
OPS = {"≤": lambda a, b: a <= b, "≥": lambda a, b: a >= b, "<": lambda a, b: a < b, ">": lambda a, b: a > b, "=": lambda a, b: a == b}
FLIP = {"<": ">", ">": "<", "≤": "≥", "≥": "≤"}

def _py(side):
    s = side.replace("−", "-")
    s = re.sub(r"(\d|\))\s*(x|\()", r"\1*\2", s)
    return s

def val(side, x): return eval(_py(side), {"F": F, "x": F(x)})

def split(s):
    m = re.search(r"≤|≥|<|>|=", s); return s[:m.start()], m.group(), s[m.end():]

def holds(s, x):
    l, op, r = split(s); return OPS[op](val(l, x), val(r, x))

def html(s):
    s = s.replace("<", "&lt;").replace(">", "&gt;")
    return s.replace("-", "−").replace("x", "<i>x</i>")

def solve_lin(eq):
    """Linear equation: Fraction, 'all', or 'none' (evaluate at 0 and 1)."""
    l, op, r = split(eq); assert op == "="
    d0 = val(l, 0) - val(r, 0); d1 = val(l, 1) - val(r, 1); a = d1 - d0
    if a == 0: return "all" if d0 == 0 else "none"
    return -d0 / a

TESTS = [F(k, 2) for k in range(-80, 81)]
def same_set(a, b): return all(holds(a, t) == holds(b, t) for t in TESTS)

def ans_of(s):
    """'x op c' → (op, c)."""
    m = re.fullmatch(r"x ([<>≤≥]) (-?\d+)", s.strip()); assert m, s
    return m.group(1), int(m.group(2))

def worked_ineq(ineq, ans, steps):
    """Every step and the final 'x op c' must have exactly the same solution set as the original."""
    op, c = ans_of(ans)
    assert holds(ineq, c) == (op in "≤≥"), (ineq, "endpoint", c)                 # closed iff endpoint is a solution
    assert holds(ineq, c + 1) == (op in ">≥") and holds(ineq, c - 1) == (op in "<≤"), (ineq, "direction")
    assert same_set(ineq, ans), (ineq, ans)
    for lab, s in steps: assert same_set(ineq, s), (ineq, lab, s)
    assert steps[-1][1] == ans
    return steps

def worked_hm(eq, kind, steps):
    """How-many-solutions: original and each step have the same type; the last line is a number statement."""
    assert solve_lin(eq) == kind, (eq, solve_lin(eq))
    for lab, s in steps:
        if "x" in s: assert solve_lin(s) == kind, (eq, s)
    l, op, r = split(steps[-1][1]); assert "x" not in steps[-1][1]
    assert (val(l, 0) == val(r, 0)) == (kind == "all")
    return steps

def worked_eq(eq, x, steps):
    assert solve_lin(eq) == F(x), (eq, solve_lin(eq), x)
    for lab, s in steps: assert holds(s, x) and solve_lin(s) == F(x), (eq, lab, s)
    assert steps[-1][1].replace(" ", "") == f"x={x}"
    return steps

def graph_of(ans, lo, hi, w, key):
    op, c = ans_of(ans)
    assert lo + 2 <= c <= hi - 2, (ans, lo, hi)                              # endpoint well inside the line
    return numline(lo, hi, c if key else None, op in "≤≥", op in "<≤", w)

def check_txt(ineq, t):
    l, op, r = split(ineq); L, R = val(l, t), val(r, t)
    assert OPS[op](L, R) and L.denominator == R.denominator == 1
    return f"Test <i>x</i> = {neg(t)}: {neg(L)} {html(op)} {neg(R)} ✓"

COMPACT = [False]
def lab_html(lab):
    return lab.replace("FLIP", '<span class="fl">FLIP</span>')
def show(steps, check=None):
    rows = [f'<span class="sl">{lab_html(lab)}</span>{html(s) if s else ""}' for lab, s in steps[:-1]]
    rows.append(f'<span class="sl">{lab_html(steps[-1][0])}</span><b>{html(steps[-1][1])}</b>')
    if COMPACT[0]:
        return '<div class="stp" style="columns:2;column-gap:10px">' + "".join(f"<div>{r}</div>" for r in rows) + '</div>'
    out = "".join(f"<div>{r}</div>" for r in rows)
    if check: out += f'<div><span class="sl">Check</span>{check}</div>'
    return f'<div class="stp">{out}</div>'

# ══════════════════════ FRONT ══════════════════════
# notes table examples (checked)
T1 = ("2x + 1 = 7", 3); T2 = "x + 5 = x + 9"; T3 = "2(x + 3) = 2x + 6"
assert solve_lin(T1[0]) == T1[1] and solve_lin(T2) == "none" and solve_lin(T3) == "all"
FLIPEX = worked_ineq("-2x > 6", "x < -3", [("÷(−2) both sides FLIP", "x < -3")])

# samples: (title, problem, kind, answer, steps, check, number-line range)
S = [
  ("1 · How many solutions?", "4(x + 2) = 4x + 5", "hm", "none",
     [("Distribute 4", "4x + 8 = 4x + 5"), ("−4x both sides", "8 = 5")], "8 = 5 is FALSE → <b>No solution</b>", None),
  ("2 · How many solutions?", "3(2x - 1) + 4 = 6x + 1", "hm", "all",
     [("Distribute 3", "6x - 3 + 4 = 6x + 1"), ("Combine like terms", "6x + 1 = 6x + 1"), ("−6x both sides", "1 = 1")],
     "1 = 1 is TRUE → <b>Infinitely many</b>", None),
  ("3 · Solve and graph", "2x + 5 > 11", "in", "x > 3",
     [("−5 both sides", "2x > 6"), ("÷2 both sides", "x > 3")], 4, (-2, 8)),
  ("4 · Distribute first", "3(x - 2) ≥ 9", "in", "x ≥ 5",
     [("Distribute 3", "3x - 6 ≥ 9"), ("+6 both sides", "3x ≥ 15"), ("÷3 both sides", "x ≥ 5")], 6, (0, 10)),
  ("5 · Divide by a negative", "-4x + 3 ≥ 15", "in", "x ≤ -3",
     [("−3 both sides", "-4x ≥ 12"), ("÷(−4) both sides FLIP", "x ≤ -3")], -4, (-8, 2)),
  ("6 · Variables on both sides", "5x - 4 < 2x + 8", "in", "x < 4",
     [("−2x both sides", "3x - 4 < 8"), ("+4 both sides", "3x < 12"), ("÷3 both sides", "x < 4")], 0, (-2, 8)),
]
for t, p, kind, a, st, ck, rg in S:
    if kind == "hm": worked_hm(p, a, st)
    else: worked_ineq(p, a, st)

NLW_F = 172     # front number-line width (px)

def sample(t, p, kind, a, st, ck, rg, key):
    top = f'<b style="font-size:9.5pt;color:#1E2D4F">{t}</b><div class="eq">{html(p)}</div>'
    if kind == "hm":
        if key: body = show(st) + f'<div class="stp">{ck}</div><div style="flex:1"></div>'
        else: body = ('<div class="ws" style="flex:1;min-height:96px"></div><div style="text-align:right;font-size:9pt">'
                      'How many solutions?<br><span class="line" style="min-width:110px"></span></div>')
    else:
        line = f'<div style="margin-top:3px">{graph_of(a, rg[0], rg[1], NLW_F, key)}</div>'
        if key: body = show(st, check_txt(p, ck)) + '<div style="flex:1"></div>' + line
        else: body = ('<div class="ws" style="flex:1;min-height:96px"></div><div style="text-align:right;font-size:9.5pt">Answer: '
                      '<span class="line" style="min-width:70px"></span></div>' + line)
    return f'<div class="sample" style="display:flex;flex-direction:column;margin:0">{top}{body}</div>'

def mini_circle(closed):
    return (f'<svg width="74" height="16" viewBox="0 0 74 16"><line x1="2" y1="8" x2="72" y2="8" stroke="#1E2D4F" stroke-width="1.2"/>'
            f'<circle cx="37" cy="8" r="4.6" fill="{"#1E2D4F" if closed else "#fff"}" stroke="#1E2D4F" stroke-width="1.8"/></svg>')

def front(key):
    COMPACT[0] = False
    h = front_head(f"{STD} · Notes", TOPIC, "One, none, or infinitely many solutions · Solve and graph inequalities", key)
    hm = f'''<div class="box"><h3>How many solutions?</h3><div style="font-size:8.6pt">Solve it. Look at the <b>last line</b>.</div>
<table class="st"><tr><th>Last line</th><th>Example</th><th>Answer</th></tr>
<tr><td><i>x</i> = a number</td><td class="e">{html(T1[0])}<br>→ <i>x</i> = {T1[1]}</td><td><b>One solution</b></td></tr>
<tr><td><i>x</i>'s cancel.<br>It is <b>FALSE</b>.</td><td class="e">{html(T2)}<br>→ 5 = 9</td><td><b>No solution</b></td></tr>
<tr><td><i>x</i>'s cancel.<br>It is <b>TRUE</b>.</td><td class="e">{html(T3)}<br>→ 6 = 6</td><td><b>Infinitely many solutions</b></td></tr></table>
<div class="small" style="margin-top:3px"><i>x</i> = 0 is still <b>one</b> solution. Do not stop there!</div></div>'''
    ineq = f'''<div class="box gold"><h3>Inequalities</h3>
<div style="font-size:8.6pt">An <b>inequality</b> compares two sides with &lt;, &gt;, ≤, or ≥.</div>
<div class="sym">
<span class="s">&lt;</span><span>less than</span>{mini_circle(False)}
<span class="s">&gt;</span><span>greater than</span>{mini_circle(False)}
<span class="s">≤</span><span>less than or equal to <span class="small">(at most)</span></span>{mini_circle(True)}
<span class="s">≥</span><span>greater than or equal to <span class="small">(at least)</span></span>{mini_circle(True)}</div>
<div style="font-size:8.6pt"><b>Open circle</b> ○ for &lt; and &gt;: the number is NOT included.<br>
<b>Closed circle</b> ● for ≤ and ≥: the number IS included.<br>
With <i>x</i> on the left: &lt; or ≤ <b>shade left</b>. &gt; or ≥ <b>shade right</b>.</div>
<div class="flip"><b>FLIP</b> the inequality symbol when you <b>multiply or divide by a negative</b>.</div>
<div class="m" style="font-size:10pt">−2<i>x</i> &gt; 6 &nbsp;→&nbsp; ÷(−2) &nbsp;→&nbsp; <i>x</i> &lt; −3</div>
<div style="margin-top:2px">{numline(-7, 1, -3, False, True, 230)}</div></div>'''
    steps = '''<div class="box" style="font-size:8.6pt;line-height:1.45"><h3>Steps to solve an inequality</h3>
1. Solve it like an equation. Use the <b>flowchart</b>.<br>
2. Did you multiply or divide by a <b>negative</b>? <b>Flip</b> the symbol.<br>
3. Graph: draw the circle (open or closed). Then shade.<br>
4. Check: <b>test a number</b> in the shaded part.</div>'''
    vocab = '''<div class="box" style="font-size:8.6pt;line-height:1.45"><b>Solution</b>: a number that makes it true.<br>
<b>One solution</b>: only one number works.<br><b>No solution</b>: no number works.<br>
<b>Infinitely many solutions</b>: every number works.</div>'''
    cells = "".join(sample(*s, key) for s in S)
    return h + f'''<div data-fit data-fill style="display:flex;flex-direction:column"><div class="cols" style="gap:10px;flex:1"><div style="flex:0 0 330px">{hm}{ineq}{steps}{vocab}</div>
<div style="display:flex;flex-direction:column"><div class="grid2" style="gap:6px;flex:1;grid-template-rows:repeat(3,1fr);margin-bottom:7px">{cells}</div></div></div></div>'''

# ══════════════════════ BACK ══════════════════════
kit.CSS += """
.pq{border:1px solid #E3E5EA;border-radius:8px;padding:5px 9px 6px;position:relative;break-inside:avoid;display:flex;flex-direction:column}
.pq .hd{display:flex;align-items:center;gap:6px;font-size:9.8pt;flex-wrap:wrap}
.pq .eqn{font:600 11.5pt 'Source Serif 4',Georgia,serif;color:#1E2D4F}
.stars{font:700 8pt Inter;color:#8A6100;background:#FFF6D6;border-radius:4px;padding:1px 5px;white-space:nowrap}
.ws{flex:1 0 auto}
.corner{position:absolute;right:8px;bottom:6px;font-size:9.5pt}
.ft{display:flex;align-items:flex-end;justify-content:space-between;gap:6px;font-size:9.5pt}
"""
LV = {1: ("Approaching (3)", "#8A6100", "#FFF4D1"), 2: ("Proficient (4)", "#1D4ED8", "#E6EEFF"), 3: ("Mastery (5)", "#15803D", "#E3F5E8")}
NLW_B = 222

# 1 · MC how many (no solution)
Q1 = "5x + 2 = 5x - 7"; Q1_ST = worked_hm(Q1, "none", [("−5x both sides", "2 = -7")])
HM_OPTS = ["No solution", "Exactly one", "Infinitely many"]
# 2 · MC: which inequality does the graph show (closed at −2, shaded right)
Q2_ANS = "x ≥ -2"; Q2_OPTS = ["x > -2", "x ≥ -2", "x < -2", "x ≤ -2"]
assert ans_of(Q2_ANS) == ("≥", -2) and Q2_OPTS.index(Q2_ANS) == 1 and len(set(Q2_OPTS)) == 4
# solve-and-graph items: n: (problem, answer, steps, range)
G = {
  3: ("3x - 2 < 10", "x < 4", [("+2 both sides", "3x < 12"), ("÷3 both sides", "x < 4")], (-1, 9)),
  4: ("-3x + 5 ≤ 17", "x ≥ -4", [("−5 both sides", "-3x ≤ 12"), ("÷(−3) both sides FLIP", "x ≥ -4")], (-7, 3)),
  5: ("2(x + 3) > 14", "x > 4", [("Distribute 2", "2x + 6 > 14"), ("−6 both sides", "2x > 8"), ("÷2 both sides", "x > 4")], (-1, 9)),
  10: ("-5x + 2 > 17", "x < -3", [("−2 both sides", "-5x > 15"), ("÷(−5) both sides FLIP", "x < -3")], (-8, 2)),
}
for n, (p, a, st, rg) in G.items(): worked_ineq(p, a, st)
# 6 · select all: solutions of 4x − 1 ≥ 7  (x ≥ 2)
Q6 = "4x - 1 ≥ 7"; Q6_VALS = [-3, 1, 2, 4, 6]
Q6_ST = worked_ineq(Q6, "x ≥ 2", [("+1 both sides", "4x ≥ 8"), ("÷4 both sides", "x ≥ 2")])
Q6_OK = [j for j, v in enumerate(Q6_VALS) if holds(Q6, v)]
assert Q6_OK == [2, 3, 4]                                     # 2 (endpoint, closed), 4, 6
# 7 · MC how many: one solution (x = 0 trap)
Q7 = "2(3x + 1) = 4x + 2"
Q7_ST = worked_eq(Q7, 0, [("Distribute 2", "6x + 2 = 4x + 2"), ("−4x both sides", "2x + 2 = 2"), ("−2 both sides", "2x = 0"), ("÷2 both sides", "x = 0")])
# 8 · value of k
Q8 = "3(x + 2) = 3x + k"
assert solve_lin(Q8.replace("k", "6")) == "all"
assert all(solve_lin(Q8.replace("k", f"({k})")) == "none" for k in range(-30, 31) if k != 6)
# 9 · word problem: $50, ticket $8, snacks $6 each, at most → 8 + 6x ≤ 50
Q9 = "8 + 6x ≤ 50"
Q9_ST = worked_ineq(Q9, "x ≤ 7", [("Inequality", Q9), ("−8 both sides", "6x ≤ 42"), ("÷6 both sides", "x ≤ 7")])
assert 8 + 6 * 7 <= 50 < 8 + 6 * 8
# 10 · find the error: Jada did not flip.  Her steps: −5x > 15 (right), x > −3 (wrong)
assert same_set(G[10][0], "-5x > 15") and not same_set(G[10][0], "x > -3") and same_set(G[10][0], "x < -3")

def pq(n, lv, head, body, key, ws, foot=""):
    blank = f'<div class="ws" style="min-height:{ws}px"></div>' if not key else '<div class="ws"></div>'
    hd_style = ' style="display:block;line-height:1.45"' if "<!--blk-->" in head else ""
    return (f'<div class="pq"><div class="hd"{hd_style}><span class="qn">{n}</span><span class="stars" style="color:{LV[lv][1]};background:{LV[lv][2]}">{LV[lv][0]}</span>{head}</div>'
            f'{body}{blank}{foot}</div>')

def ans_box(label, ans, key, w=70):
    return f'<span style="white-space:nowrap">{label} <span class="ent" style="min-width:{w}px">{ans if key else ""}</span></span>'

def corner(inner, key):
    return f'<div style="text-align:right;font-size:9.5pt;margin-top:3px">{inner}</div>' if key else f'<div class="corner" style="text-align:right">{inner}</div>'

def graph_q(n, lv, key, ws, head=None, extra=""):
    p, a, st, rg = G[n]
    foot = f'<div class="ft">{graph_of(a, rg[0], rg[1], NLW_B, key)}{ans_box("", html(a), key)}</div>'
    return pq(n, lv, head or f'Solve and graph. <span class="eqn">{html(p)}</span>', extra + (show(st) if key else ""), key, ws, foot)

WS = 157     # px at zoom 1 (the number line row sits below this); render_ms reports the printed size

def back(key):
    COMPACT[0] = True
    h = back_head(f"{STD} · Practice", TOPIC, "Show every step. Flip the symbol if you multiply or divide by a negative. &nbsp;Levels: Approaching (3) · Proficient (4) · Mastery (5)", key)
    hm_mc = lambda opts_ok: mc(HM_OPTS, opts_ok, key, 1)
    items = [
      pq(1, 1, 'How many solutions?',
         f'<div style="display:flex;align-items:center;gap:10px;margin-top:1px"><span class="eqn" style="font:600 11.5pt \'Source Serif 4\',Georgia,serif;color:#1E2D4F;white-space:nowrap">{html(Q1)}</span>'
         + mc(HM_OPTS, 0, key, 2).replace('class="ops "', 'class="ops" style="flex:1;margin:0;gap:1px 8px"') + '</div>'
         + (show(Q1_ST) + '<div class="stp">2 = −7 is FALSE.</div>' if key else ""), key, 4),
      pq(2, 1, 'Which inequality is graphed?',
         f'<div style="display:flex;align-items:center;gap:8px;margin-top:2px"><div>{numline(-5, 5, -2, True, False, 196).replace("#15803D", "#1E2D4F")}</div>'
         + mc([html(o) for o in Q2_OPTS], 1, key, 2).replace('class="ops "', 'class="ops" style="flex:1;margin:0"') + '</div>', key, 4),
      graph_q(3, 1, key, WS),
      graph_q(4, 2, key, WS),
      graph_q(5, 2, key, WS),
      pq(6, 2, f'<b>Select all</b> solutions. <span class="eqn">{html(Q6)}</span>',
         (show(Q6_ST) if key else "") + sa([neg(v) for v in Q6_VALS], Q6_OK, key, 2).replace('class="ops "', 'class="ops c4" style="grid-template-columns:repeat(5,1fr)"'),
         key, WS),
      pq(7, 2, 'How many solutions?',
         f'<div class="eqn" style="font:600 11.5pt \'Source Serif 4\',Georgia,serif;color:#1E2D4F">{html(Q7)}</div>' + (show(Q7_ST) + '<div class="stp">The <i>x</i>\'s do not cancel. <i>x</i> = 0 is one solution.</div>' if key else "")
         + (hm_mc(1) if key else hm_mc(1).replace('class="ops c1"', 'class="ops c1" style="position:absolute;right:9px;bottom:6px;width:42%"')), key, WS),
      pq(8, 3, f'<span class="eqn">{html(Q8).replace("k", "<i>k</i>")}</span>',
         '<div class="stem" style="margin-top:2px">a) What value of <i>k</i> gives <b>infinitely many</b> solutions?<br>'
         'b) Give a value of <i>k</i> that gives <b>no solution</b>.</div>'
         + ('<div class="stp"><span class="sl">Distribute 3</span>3<i>x</i> + 6 = 3<i>x</i> + <i>k</i>. Both sides must match, so <i>k</i> = 6.<br>'
            'Any other <i>k</i> makes a FALSE statement (like 6 = 0).</div>' if key else ""), key, WS,
         corner(f'{ans_box("a) <i>k</i> =", "6", key, 54)}<br><span style="display:inline-block;height:5px"></span><br>{ans_box("b) <i>k</i> =", "any number but 6", key, 54)}', key)),
      pq(9, 3, '<!--blk--> <b style="font-size:9pt;color:#1E2D4F">Word problem</b> &nbsp;Maya can spend <b>at most $50</b>. A movie ticket is <b>$8</b>. Snacks are <b>$6</b> each. '
         'Write and solve an inequality. What is the <b>most</b> snacks she can buy?',
         ('<div class="stp" style="margin-bottom:2px">Let <i>x</i> = number of snacks.</div>' + show(Q9_ST)
            + '<div class="stp">8 + 6(7) = 50 ✓. 8 snacks would cost $56. Too much.</div>' if key else ""),
         key, WS, corner(ans_box("Snacks:", "7", key), key)),
      graph_q(10, 3, key, WS, f'<!--blk--> <b style="font-size:9pt;color:#1E2D4F">Find the error</b> &nbsp;Jada\'s work: <span class="m" style="font-weight:500;white-space:nowrap">{html(G[10][0])}</span> <span class="m" style="font-weight:500;white-space:nowrap">→ −5<i>x</i> &gt; 15</span> <span class="m" style="font-weight:500;white-space:nowrap">→ <i>x</i> &gt; −3</span>. '
         'What did she do wrong? Solve and graph it the right way.',
         ('<div class="stp">She divided by −5 but did not flip the symbol.</div>' if key else "")),
    ]
    return h + f'<div data-fit><div class="grid2">{"".join(items)}</div></div>'

# ── render with a private temp file and measure the printed layout (copied from multistep.py; never scales above 100%)
def render_ms(pages, path, footer):
    import tempfile
    from playwright.sync_api import sync_playwright
    body = "".join(f'<section style="break-after:page">{p}</section>' for p in pages[:-1]) + f"<section>{pages[-1]}</section>"
    html_ = f"<!doctype html><html><head><meta charset='utf-8'><style>@page{{size:letter;margin:0.4in 0.45in 0.45in}}{kit.CSS}</style></head><body>{body}</body></html>"
    fd, tmp = tempfile.mkstemp(suffix=".html"); os.write(fd, html_.encode()); os.close(fd)
    with sync_playwright() as p:
        b = p.chromium.launch(); pg = b.new_page(viewport={"width": 730, "height": 900}); pg.goto("file://" + tmp); pg.wait_for_timeout(300)
        pg.emulate_media(media="print")
        avail = 11 * 96 - 0.85 * 96 - 14
        zooms = pg.evaluate("""(avail) => { const zs = []; for (const sec of document.querySelectorAll('section')) {
            const f = sec.querySelector('[data-fit]'); if (!f) { zs.push(1); continue; }
            let z = 1.0; f.style.zoom = z;
            while (z > 0.8 && sec.getBoundingClientRect().height > avail) { z -= 0.02; f.style.zoom = z; }
            if (f.hasAttribute('data-fill')) { const gap = avail - sec.getBoundingClientRect().height;      // stretch the sample rows to the bottom margin
                if (gap > 0) f.style.minHeight = (f.getBoundingClientRect().height + gap) / z + 'px'; }
            zs.push(z); } return zs; }""", avail)
        info = pg.evaluate("""() => { const secs = [...document.querySelectorAll('section')];
            return { heights: secs.map(s => s.getBoundingClientRect().height),
                     front: [...secs[0].querySelectorAll('.sample .ws')].map(w => w.getBoundingClientRect().height),
                     ws: [...secs[secs.length-1].querySelectorAll('.pq')].map(q => q.querySelector('.ws').getBoundingClientRect().height) }; }""")
        pg.pdf(path=path, print_background=True, format="Letter", prefer_css_page_size=True, display_header_footer=True, header_template="<div></div>",
               footer_template=f'<div style="width:100%;font-family:Inter;font-size:7px;color:#8a93a8;padding:0 0.45in;display:flex;justify-content:space-between"><span>Mr. Allen&#39;s 8th Grade Math • {footer}</span><span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span></div>')
        b.close()
    os.unlink(tmp)
    return zooms, info

if __name__ == "__main__":
    name = "Solutions_and_Inequalities"
    for key in (False, True):
        z, info = render_ms([front(key), back(key)], f"{OUT}/{name}{'_AnswerKey' if key else ''}.pdf", TOPIC_TXT + (" — Answer Key" if key else ""))
        print("KEY" if key else "STUDENT", "fit zooms", [round(v, 2) for v in z], "page heights", [round(h) for h in info["heights"]])
        if not key:
            fr_in = [round(w / 96, 2) for w in info["front"]]; ins = [round(w / 96, 2) for w in info["ws"]]
            print("  front sample blank space (in):", fr_in)
            print("  back blank work space per item (in):", ins)
            if not os.environ.get("NOWS"): assert all(v >= 1.3 for i, v in enumerate(ins) if i not in (0, 1)), ins     # items 1–2 are the MC row
    print("built in", OUT)
