"""Equation Master: Math 1 (Nov 20, 2026, Zach: "The equations and inequalities unit can replicate Equation Master").

Makes math1/equation-master.html from grade8/equation_master.html (same game, same arena, same rules) with
NC Math 1 Unit 1 levels in place of the 8th grade ones:

  0 Multi-Step      distributing, variables on both sides, fractions, no-solution / infinitely-many cases
  1 Justify It      name the property that allows each step (Math 1 Unit 1, section 4)
  2 Literal         solve a formula for one letter (section 6)
  4 Inequalities    flip for negatives, both sides, compound inequalities, then pick the graph (section 5)
  5 Create & Solve  pick the equation or inequality for a story, solve it, say what it means (section 6)
  3 Mixed           all of them

Every step is checked: a one-letter line must have the SAME solution set as the start (exact fractions on a grid of
test values); a formula line must stay true for random values of every letter. Every wrong choice has its own note.
Re-run any time (the page is rebuilt from the 8th grade game, so engine fixes there carry over):

    python3 _build/math1_arcade/equation_master_m1.py
"""
import json, re, os, random
from fractions import Fraction as F

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..')
SRC = os.path.join(ROOT, 'grade8', 'equation_master.html')
OUT = os.path.join(ROOT, 'math1', 'equation-master.html')
R = random.Random(20261120)

# ---------- exact checking (same method as _build/equation_master_levels.py) ----------
REL = ['≤', '≥', '<', '>', '=']
def to_py(s, var):
    s = s.replace('−', '-').replace(var, 'x')
    s = re.sub(r'(\d+(?:\.\d+)?)', r"F('\1')", s)
    s = re.sub(r"(\)|x)\s*(\(|F|x)", r'\1*\2', s)
    s = re.sub(r"(\))\s*(\()", r'\1*\2', s)
    return s
def parts(s):
    out, rels, cur = [], [], ''
    for ch in s:
        if ch in '≤≥<>=': out.append(cur); rels.append(ch); cur = ''
        else: cur += ch
    out.append(cur); return out, rels
def truth(s, x, var):
    ps, rels = parts(s)
    vals = [eval(to_py(p, var), {'F': F, 'x': x}) for p in ps]
    op = {'=': lambda a, b: a == b, '<': lambda a, b: a < b, '>': lambda a, b: a > b, '≤': lambda a, b: a <= b, '≥': lambda a, b: a >= b}
    return all(op[r](vals[i], vals[i + 1]) for i, r in enumerate(rels))
PTS = [F(n, 4) for n in range(-120, 121)]
def same_set(s1, s2, var): return all(truth(s1, x, var) == truth(s2, x, var) for x in PTS)

# formulas: every line must stay true when the solved-for letter takes its true value
def fpy(s):
    s = s.replace('−', '-').replace('·', '*')
    s = re.sub(r'(\d)\s*([A-Za-z(])', r'\1*\2', s)
    s = re.sub(r'([A-Za-z)])\s*(?=[A-Za-z(\d])', r'\1*', s)
    return s
def ftrue(line, env):
    a, b = line.split('=')
    return abs(eval(fpy(a), {}, env) - eval(fpy(b), {}, env)) < 1e-9

# ---------- display ----------
def disp(s): return re.sub(r'\((\d+)/(\d+)\)', r"<span class='fr'><span>\1</span><span>\2</span></span>", s)
def plain(s): return re.sub(r'\((\d+)/(\d+)\)', r'\1/\2', s)
C = lambda t: "<span class='cancelled'>" + t + "</span>"
O = lambda t: "<span class='op'>" + t + "</span>"
H = lambda t: "<span class='highlight'>" + t + "</span>"
def N(v): v = F(v); s = str(abs(v.numerator)) if v.denominator == 1 else f"({abs(v.numerator)}/{v.denominator})"; return ('−' if v < 0 else '') + s
def T(a, v='x'):  # 3x, −x
    return ('−' if a < 0 else '') + ('' if abs(a) == 1 else str(abs(a))) + v
def lin(a, b, v='x'):
    if a == 0: return N(b)
    s = T(a, v)
    return s if b == 0 else s + (' − ' if b < 0 else ' + ') + N(abs(b))
def pm(b): return ('− ' if b < 0 else '+ ') + N(abs(b))          # "+ 4" / "− 4"
def undo(b): return (f"Subtract {N(b)} from both sides" if b > 0 else f"Add {N(-b)} to both sides")
def wrongway(b): return (f"Add {N(b)} to both sides" if b > 0 else f"Subtract {N(-b)} from both sides")
def opn(b): return O(('− ' if b > 0 else '+ ') + N(abs(b)))

def st(prompt, ok, action, tr, res, wrongs, hint, **kw):
    d = dict(prompt=prompt, ok=ok, action=action, tr=tr, res=res, wrongs=wrongs, hint=hint); d.update(kw); return d

def numline(at, closed, left, lo=None, hi=None, at2=None, closed2=None):
    """one ray (at, closed, left) or, with at2, a segment between at and at2"""
    lo = lo if lo is not None else min(at, at2 if at2 is not None else at) - 4
    hi = hi if hi is not None else max(at, at2 if at2 is not None else at) + 4
    W, pad = 300, 16; sx = lambda v: pad + (v - lo) * (W - 2 * pad) / (hi - lo)
    t = ''.join(f"<line x1='{sx(v):.1f}' y1='22' x2='{sx(v):.1f}' y2='30' stroke='#1E2D4F' stroke-width='1.5'/>"
                f"<text x='{sx(v):.1f}' y='44' font-size='11' text-anchor='middle' fill='#1E2D4F' font-family='Inter,sans-serif'>{str(v).replace('-', '−')}</text>"
                for v in range(lo, hi + 1))
    dot = lambda x, c: f"<circle cx='{sx(x):.1f}' cy='26' r='6' fill='{'#1E2D4F' if c else '#fff'}' stroke='#1E2D4F' stroke-width='2.5'/>"
    if at2 is None:
        x0 = sx(at); x1 = pad - 4 if left else W - pad + 4
        body = (f"<line x1='{x0:.1f}' y1='26' x2='{x1:.1f}' y2='26' stroke='#E0A800' stroke-width='6'/>"
                f"<path d='M{x1:.1f},26 l{8 if not left else -8},-6 v12 z' fill='#E0A800' transform='translate({-8 if not left else 8},0)'/>" + dot(at, closed))
    else:
        body = f"<line x1='{sx(at):.1f}' y1='26' x2='{sx(at2):.1f}' y2='26' stroke='#E0A800' stroke-width='6'/>" + dot(at, closed) + dot(at2, closed2)
    return (f"<svg viewBox='0 0 {W} 50' width='{W}' height='50' style='max-width:100%'><line x1='4' y1='26' x2='{W - 4}' y2='26' stroke='#1E2D4F' stroke-width='2'/>" + t + body + "</svg>")

def graph_step(at, rel, var='x'):
    closed = rel in ('≤', '≥'); left = rel in ('<', '≤'); A = N(at)
    d = lambda c, l: ('Closed' if c else 'Open') + f" circle at {A}, shade {'left' if l else 'right'}"
    wr = [(d(not closed, left), "≤ and ≥ include the number, so the circle is CLOSED." if closed else "< and > do not include the number, so the circle is OPEN."),
          (d(closed, not left), f"{var} {rel} {A} means numbers {'LESS' if left else 'GREATER'} than {A}: shade to the {'left' if left else 'right'}."),
          (d(not closed, not left), "Check both: open or closed circle, AND which way to shade.")]
    return st("Which graph matches?", d(closed, left), "↓ Graph it", numline(at, closed, left), None, wr,
              "Closed circle for ≤ ≥, open for < >. Shade toward the numbers that work.", final=True, graph=(at, rel))

def graph2(lo, r1, hi, r2, var='x'):
    c1, c2 = r1 == '≤', r2 == '≤'; c = lambda b: 'closed' if b else 'open'
    d = lambda a, b, between=True: f"{c(a).capitalize()} at {N(lo)}, {c(b)} at {N(hi)}, shade {'between' if between else 'outside'}"
    wr = [(d(not c1, c2), f"Look at the sign next to {N(lo)}: {'≤ includes it (closed)' if c1 else '< does not include it (open)'}." ),
          (d(c1, not c2), f"Look at the sign next to {N(hi)}: {'≤ includes it (closed)' if c2 else '< does not include it (open)'}."),
          (d(c1, c2, False), f"{N(lo)} {r1} {var} {r2} {N(hi)} means {var} is BETWEEN them: shade between the circles.")]
    return st("Which graph matches?", d(c1, c2), "↓ Graph it", numline(lo, c1, False, at2=hi, closed2=c2), None, wr,
              "The answer is between the two numbers. Closed circle for ≤, open for <.", final=True, graph2=(lo, r1, hi, r2))

# =====================================================================
# Level 0: Multi-Step
# =====================================================================
def t_dist():
    a = R.choice([2, 3, 4, 5, 6]); b = R.choice([v for v in range(-7, 8) if v]); s = R.choice([v for v in range(-6, 10) if v != 0])
    c = a * (s + b); ab = a * b
    start = f"{a}(x {pm(b)}) = {N(c)}"
    return dict(title=f"Bracket Brute: {start}", start=start, sol=F(s), steps=[
        st("Clear the parentheses:", f"Distribute the {a}", f"↓ Distribute {a}", H(str(a)) + "(x) " + pm(b).split()[0] + " " + H(str(a)) + f"({abs(b)}) = {N(c)}", f"{lin(a, ab)} = {N(c)}",
           [(f"Distribute: {lin(a, b)} = {N(c)}", f"Multiply {a} by BOTH terms: {a} · {abs(b)} = {abs(ab)}."),
            (f"{undo(b)}", f"The {N(abs(b))} is stuck inside the parentheses. Distribute first."),
            (f"Subtract {a} from both sides", f"The {a} is MULTIPLYING. Subtracting {a} does not undo it.")],
           f"Multiply {a} by x AND by {N(b)}."),
        st(f"Undo the {pm(ab)}:", undo(ab), "↓ " + undo(ab), f"{T(a)} " + C(pm(ab)) + " " + opn(ab) + f" = {N(c)} " + opn(ab), f"{T(a)} = {N(c - ab)}",
           [(wrongway(ab), f"{pm(ab)} is undone by the OPPOSITE operation."),
            (f"Divide both sides by {a} first", f"Undo the {pm(ab)} first. That keeps the numbers whole."),
            (undo(ab).replace('both sides', 'the left side only'), "Whatever you do to one side, do to the other side.")],
           f"What undoes {pm(ab)}?"),
        st("Get x alone:", f"Divide both sides by {a}", f"↓ Divide both sides by {a}", C(str(a)) + "x " + O(f"÷ {a}") + f" = {N(c - ab)} " + O(f"÷ {a}"), f"x = {N(s)}",
           [(f"Subtract {a} from both sides", f"{a}x means {a} TIMES x. Undo multiplying by dividing."),
            (f"Multiply both sides by {a}", f"That makes {a * a}x. Divide to get x alone."),
            (f"Divide both sides by {N(c - ab)}", f"Divide by the number in front of x: {a}.")],
           f"{a}x means {a} times x.", final=True)])

def t_both():
    a, c = R.sample(range(2, 10), 2)
    if a < c: a, c = c, a
    s = R.choice([v for v in range(-6, 10) if v]); b = R.choice([v for v in range(-9, 10) if v]); d = (a - c) * s + b; k = a - c
    start = f"{lin(a, b)} = {lin(c, d)}"
    steps = [st("x's on both sides:", f"Subtract {c}x from both sides", f"↓ Subtract {c}x from both sides",
                f"{T(a)} " + O(f"− {c}x") + f" {pm(b)} = " + C(T(c)) + " " + O(f"− {c}x") + f" {pm(d)}", f"{lin(k, b)} = {N(d)}",
                [(f"Add {c}x to both sides", f"Adding {c}x makes {2 * c}x on the right. SUBTRACT {c}x to cancel it."),
                 (f"Subtract {a}x from both sides", f"That works, but it leaves −{k}x. Cancel the SMALLER x-term ({c}x) so x stays positive."),
                 (undo(b), "The x's are still on both sides. Gather them on one side first.")],
                "Cancel the smaller x-term so x stays positive.")]
    if k == 1:
        steps.append(st(f"Undo the {pm(b)}:", undo(b), "↓ " + undo(b), "x " + C(pm(b)) + " " + opn(b) + f" = {N(d)} " + opn(b), f"x = {N(s)}",
                        [(wrongway(b), f"{pm(b)} is undone by the OPPOSITE operation."),
                         (f"Divide both sides by {N(d)}", "x is already times 1. Just undo the number added to it."),
                         (undo(b).replace('both sides', 'the right side only'), "Do it to BOTH sides.")], f"What undoes {pm(b)}?", final=True))
    else:
        steps.append(st(f"Undo the {pm(b)}:", undo(b), "↓ " + undo(b), f"{T(k)} " + C(pm(b)) + " " + opn(b) + f" = {N(d)} " + opn(b), f"{T(k)} = {N(d - b)}",
                        [(wrongway(b), f"{pm(b)} is undone by the OPPOSITE operation."),
                         (f"Divide both sides by {k} first", f"Undo the {pm(b)} first."),
                         (f"Subtract {k} from both sides", f"{k}x means {k} times x. Move the {N(abs(b))} first.")], f"What undoes {pm(b)}?"))
        steps.append(st("Get x alone:", f"Divide both sides by {k}", f"↓ Divide both sides by {k}", C(str(k)) + "x " + O(f"÷ {k}") + f" = {N(d - b)} " + O(f"÷ {k}"), f"x = {N(s)}",
                        [(f"Subtract {k} from both sides", f"{k}x means {k} TIMES x. Divide."),
                         (f"Divide both sides by {N(d - b)}", f"Divide by the number in front of x: {k}."),
                         (f"Multiply both sides by {k}", "Multiplying makes it bigger. Divide.")], f"{k}x means {k} times x.", final=True))
    return dict(title=f"Two-Sided Titan: {start}", start=start, sol=F(s), steps=steps)

def t_frac():
    p = R.choice([2, 3, 4, 5, 6]); q = R.choice([v for v in range(-8, 9) if v]); s = p * R.choice([v for v in range(-5, 7) if v]); r = F(s, p) + q
    start = f"x/{p} {pm(q)} = {N(r)}"
    return dict(title=f"Fraction Phantom: {start}", start=start, sol=F(s), steps=[
        st(f"Undo the {pm(q)} first:", undo(q), "↓ " + undo(q), f"x/{p} " + C(pm(q)) + " " + opn(q) + f" = {N(r)} " + opn(q), f"x/{p} = {N(r - q)}",
           [(wrongway(q), f"{pm(q)} is undone by the OPPOSITE operation."),
            (f"Divide both sides by {p}", f"x is already DIVIDED by {p}. Dividing again makes it worse."),
            (f"Multiply only x/{p} by {p}", f"Whatever you do, do it to EVERY part of both sides. Undo the {pm(q)} first.")],
           f"Undo the {pm(q)}. What is the opposite?"),
        st(f"x is divided by {p}:", f"Multiply both sides by {p}", f"↓ Multiply both sides by {p}", C(f"x/{p}") + " " + O(f"· {p}") + f" = {N(r - q)} " + O(f"· {p}"), f"x = {N(s)}",
           [(f"Divide both sides by {p}", f"x is already divided by {p}. Undo dividing by MULTIPLYING."),
            (f"Subtract {p} from both sides", f"x/{p} means x DIVIDED by {p}. Multiply to undo it."),
            (f"Multiply both sides by {N(r - q)}", f"Multiply by the number x is divided by: {p}.")],
           "The opposite of dividing is multiplying.", final=True)])

def t_distboth():
    a = R.choice([2, 3, 4, 5]); c = R.choice([2, 3, 4, 5, 6, 7]); b = R.choice([v for v in range(-6, 7) if v])
    if a == c: c += 1
    s = R.choice([v for v in range(-5, 8) if v]); hi, lo = max(a, c), min(a, c); ab = a * b
    d = a * (s + b) - c * s   # a(x + b) = cx + d
    start = f"{a}(x {pm(b)}) = {lin(c, d)}"
    if a > c:
        k = a - c; mid = f"{lin(k, ab)} = {N(d)}"; mv = f"Subtract {c}x from both sides"; trm = f"{T(a)} " + O(f"− {c}x") + f" {pm(ab)} = " + C(T(c)) + " " + O(f"− {c}x") + f" {pm(d)}"
        b2 = ab; r2 = d - ab; side = 'left'
    else:
        k = c - a; mid = f"{N(ab)} = {lin(k, d)}"; mv = f"Subtract {a}x from both sides"; trm = C(T(a)) + " " + O(f"− {a}x") + f" {pm(ab)} = {T(c)} " + O(f"− {a}x") + f" {pm(d)}"
        b2 = d; r2 = ab - d; side = 'right'
    steps = [st("Parentheses first:", f"Distribute the {a}", f"↓ Distribute {a}", H(str(a)) + "(x) " + pm(b).split()[0] + " " + H(str(a)) + f"({abs(b)}) = {lin(c, d)}", f"{lin(a, ab)} = {lin(c, d)}",
                [(f"Distribute: {lin(a, b)} = {lin(c, d)}", f"Multiply {a} by BOTH terms inside."),
                 (f"Subtract {c}x from both sides", "The left x is still inside parentheses. Distribute first."),
                 (f"Divide both sides by {a}", f"That would make {c}x/{a} on the right: messy. Distribute first.")], f"Multiply {a} by x AND by {N(b)}."),
             st("Gather the x's:", mv, "↓ " + mv, trm, mid,
                [(mv.replace('Subtract', 'Add').replace('from', 'to'), "Adding makes MORE x's. Subtract to cancel."),
                 (f"Subtract {hi}x from both sides", f"That leaves a negative x-term. Cancel the SMALLER x-term ({lo}x)."),
                 (undo(ab), "The x's are on both sides. Gather them first.")], f"Cancel the smaller x-term, {lo}x.")]
    if k == 1:
        res = f"x = {N(s)}" if side == 'left' else f"{N(s)} = x"
        steps.append(st(f"Undo the {pm(b2)}:", undo(b2), "↓ " + undo(b2), (("x " + C(pm(b2)) + " " + opn(b2) + f" = {N(d)} " + opn(b2)) if side == 'left' else (f"{N(ab)} " + opn(b2) + " = x " + C(pm(b2)) + " " + opn(b2))), res,
                        [(wrongway(b2), f"{pm(b2)} is undone by the OPPOSITE operation."),
                         (undo(b2).replace('both sides', 'one side only'), "Do it to BOTH sides."),
                         (f"Divide both sides by {N(abs(b2))}", "x is already times 1. Undo the number added to it.")], f"What undoes {pm(b2)}?", final=True,
                        show=(None if side == 'left' else f"{N(s)} = x, so x = {N(s)}")))
    else:
        if side == 'left':
            tr3 = f"{T(k)} " + C(pm(b2)) + " " + opn(b2) + f" = {N(d)} " + opn(b2); res3 = f"{T(k)} = {N(r2)}"
        else:
            tr3 = f"{N(ab)} " + opn(b2) + f" = {T(k)} " + C(pm(b2)) + " " + opn(b2); res3 = f"{N(r2)} = {T(k)}"
        steps.append(st(f"Undo the {pm(b2)}:", undo(b2), "↓ " + undo(b2), tr3, res3,
                        [(wrongway(b2), f"{pm(b2)} is undone by the OPPOSITE operation."),
                         (f"Divide both sides by {k} first", f"Undo the {pm(b2)} first."),
                         (undo(b2).replace('both sides', 'one side only'), "Do it to BOTH sides.")], f"What undoes {pm(b2)}?"))
        res4 = f"x = {N(s)}" if side == 'left' else f"{N(s)} = x"
        steps.append(st("Get x alone:", f"Divide both sides by {k}", f"↓ Divide both sides by {k}",
                        (C(str(k)) + "x " + O(f"÷ {k}") + f" = {N(r2)} " + O(f"÷ {k}")) if side == 'left' else (f"{N(r2)} " + O(f"÷ {k}") + " = " + C(str(k)) + "x " + O(f"÷ {k}")), res4,
                        [(f"Subtract {k} from both sides", f"{k}x means {k} TIMES x. Divide."),
                         (f"Divide both sides by {N(r2)}", f"Divide by the number in front of x: {k}."),
                         (f"Multiply both sides by {k}", "Multiplying makes it bigger. Divide.")], f"{k}x means {k} times x.", final=True,
                        show=(None if side == 'left' else f"{N(s)} = x, so x = {N(s)}")))
    return dict(title=f"Double Bracket: {start}", start=start, sol=F(s), steps=steps)

def t_special(kind):
    a = R.choice([2, 3, 4, 5]); b = R.choice([v for v in range(-6, 7) if v]); ab = a * b
    e = ab if kind == 'infinite' else R.choice([v for v in range(-12, 13) if v != ab])
    start = f"{a}(x {pm(b)}) = {lin(a, e)}"
    ok_txt = f"{N(ab)} = {N(e)} is " + ('TRUE: infinitely many solutions' if kind == 'infinite' else 'FALSE: no solution')
    return dict(title=("Shape Shifter: " if kind == 'infinite' else "Ghost Equation: ") + start, start=start, special=kind, steps=[
        st("Clear the parentheses:", f"Distribute the {a}", f"↓ Distribute {a}", H(str(a)) + "(x) " + pm(b).split()[0] + " " + H(str(a)) + f"({abs(b)}) = {lin(a, e)}", f"{lin(a, ab)} = {lin(a, e)}",
           [(f"Distribute: {lin(a, b)} = {lin(a, e)}", f"Multiply {a} by BOTH terms inside."),
            (f"Divide both sides by {a}", f"Not the best move: the {N(e)} would become a fraction. Distribute first."),
            (f"Subtract {a}x from the left side only", "Do the same thing to BOTH sides, and distribute first.")], f"Multiply {a} by x and by {N(b)}."),
        st("Gather the x's:", f"Subtract {a}x from both sides", f"↓ Subtract {a}x from both sides",
           C(T(a)) + " " + O(f"− {a}x") + f" {pm(ab)} = " + C(T(a)) + " " + O(f"− {a}x") + f" {pm(e)}", f"{N(ab)} = {N(e)}",
           [(f"Add {a}x to both sides", f"SUBTRACT {a}x to cancel it."),
            (f"Divide both sides by {a}", "Gather the x's first."),
            (undo(ab), "Gather the x's first. What happens when they cancel?")],
           f"Subtract {a}x from both sides. What is left?"),
        st(f"The x's are gone. What does {N(ab)} = {N(e)} tell you?", ok_txt, "↓ Decide", f"{N(ab)} = {N(e)}", None,
           [(f"{N(ab)} = {N(e)} is " + ('FALSE: no solution' if kind == 'infinite' else 'TRUE: infinitely many solutions'),
             (f"{N(ab)} and {N(e)} ARE equal, so the statement is true for every x." if kind == 'infinite' else f"{N(ab)} and {N(e)} are NOT equal, so no x can make it true.")),
            ("x = 0", "The x's cancelled out. x = 0 is not the answer: decide if the leftover statement is true or false."),
            (f"x = {N(e - ab) if e != ab else 1}", "The x's are gone. Decide if the leftover statement is true or false.")],
           "True statement → infinitely many solutions. False statement → no solution.", final=True, special=kind,
           show=f"{N(ab)} = {N(e)} → " + ('TRUE → infinitely many solutions' if kind == 'infinite' else 'FALSE → no solution'))])

# =====================================================================
# Level 1: Justify It (name the property)
# =====================================================================
P_DIST, P_COMB = 'Distributive Property', 'Combining like terms'
P = {'+': 'Addition Property of Equality', '-': 'Subtraction Property of Equality', '*': 'Multiplication Property of Equality', '/': 'Division Property of Equality'}
WHY = {
    P_DIST: "No parentheses were multiplied out in this step.",
    P_COMB: "Nothing was combined on one side. Something was done to BOTH sides.",
    P['+']: "Nothing was ADDED to both sides in this step.",
    P['-']: "Nothing was SUBTRACTED from both sides in this step.",
    P['*']: "Both sides were not MULTIPLIED by a number in this step.",
    P['/']: "Both sides were not DIVIDED by a number in this step.",
}
def jstep(cur, nxt, right, what, tr):
    pool = [p for p in [P_DIST, P_COMB, P['+'], P['-'], P['*'], P['/']] if p != right]
    # likely mix-ups first: the opposite operation, then the others
    opp = {P['+']: P['-'], P['-']: P['+'], P['*']: P['/'], P['/']: P['*'], P_DIST: P_COMB, P_COMB: P_DIST}[right]
    rest = [p for p in pool if p != opp]; R.shuffle(rest)
    wr = [(opp, WHY[opp] + " " + what)] + [(p, WHY[p] + " " + what) for p in rest[:2]]
    return st(f"Next line: {nxt}. Which reason allows this step?", right, "↓ " + right, tr, nxt, wr,
              "Compare the new line with the line before it. Parentheses gone? Terms joined on one side? Or the same thing done to BOTH sides?")

def justify():
    a = R.choice([2, 3, 4, 5]); b = R.choice([v for v in range(-6, 7) if v]); s = R.choice([v for v in range(-5, 8) if v]); c2 = R.choice([2, 3])
    form = R.choice(['dist', 'comb', 'divx'])
    if form == 'dist':   # a(x + b) = c  → ax + ab = c → ax = c − ab → x = s
        ab = a * b; c = a * (s + b); start = f"{a}(x {pm(b)}) = {N(c)}"
        l1 = f"{lin(a, ab)} = {N(c)}"; l2 = f"{T(a)} = {N(c - ab)}"; l3 = f"x = {N(s)}"
        steps = [jstep(start, l1, P_DIST, f"Look at the parentheses: where did they go?", H(str(a)) + "(x) " + pm(b).split()[0] + " " + H(str(a)) + f"({abs(b)}) = {N(c)}"),
                 jstep(l1, l2, P['-'] if ab > 0 else P['+'], f"Look at the {pm(ab)}: what was done to BOTH sides to make it go away?", f"{T(a)} " + C(pm(ab)) + " " + opn(ab) + f" = {N(c)} " + opn(ab)),
                 jstep(l2, l3, P['/'], f"Look at the {a} in front of x: what was done to BOTH sides?", C(str(a)) + "x " + O(f"÷ {a}") + f" = {N(c - ab)} " + O(f"÷ {a}"))]
    elif form == 'comb':  # ax + cx + b = d → (a+c)x + b = d → (a+c)x = d − b → x = s
        k = a + c2; d = k * s + b; start = f"{T(a)} + {T(c2)} {pm(b)} = {N(d)}"
        l1 = f"{lin(k, b)} = {N(d)}"; l2 = f"{T(k)} = {N(d - b)}"; l3 = f"x = {N(s)}"
        steps = [jstep(start, l1, P_COMB, f"Look at {T(a)} + {T(c2)}: what happened on the left side?", H(f"{T(a)} + {T(c2)}") + f" {pm(b)} = {N(d)}"),
                 jstep(l1, l2, P['-'] if b > 0 else P['+'], f"Look at the {pm(b)}: what was done to BOTH sides to make it go away?", f"{T(k)} " + C(pm(b)) + " " + opn(b) + f" = {N(d)} " + opn(b)),
                 jstep(l2, l3, P['/'], f"Look at the {k} in front of x: what was done to BOTH sides?", C(str(k)) + "x " + O(f"÷ {k}") + f" = {N(d - b)} " + O(f"÷ {k}"))]
    else:                 # x/a + b = c → x/a = c − b → x = a(c − b)
        s = a * R.choice([v for v in range(-4, 7) if v]); c = F(s, a) + b; start = f"x/{a} {pm(b)} = {N(c)}"
        l1 = f"x/{a} = {N(c - b)}"; l2 = f"x = {N(s)}"
        steps = [jstep(start, l1, P['-'] if b > 0 else P['+'], f"Look at the {pm(b)}: what was done to BOTH sides to make it go away?", f"x/{a} " + C(pm(b)) + " " + opn(b) + f" = {N(c)} " + opn(b)),
                 jstep(l1, l2, P['*'], f"x was divided by {a}. What was done to BOTH sides to undo that?", C(f"x/{a}") + " " + O(f"· {a}") + f" = {N(c - b)} " + O(f"· {a}"))]
    steps[-1]['final'] = True
    return dict(title=f"Proof Knight: {start}", start=start, sol=F(s), steps=steps)

# =====================================================================
# Level 2: Literal equations (written out, checked with random values)
# =====================================================================
def lit(title, start, var, steps, env_vars):
    return dict(title=title, start=start, var=var, literal=True, env=env_vars, steps=steps)
LITERAL = [
 lit("Area Ace: A = lw, solve for w", "A = lw", 'w', [
   st("w is MULTIPLIED by l:", "Divide both sides by l", "↓ Divide both sides by l", "A " + O("÷ l") + " = " + C("l") + "w " + O("÷ l"), "A/l = w",
      [("Subtract l from both sides", "lw means l TIMES w. Undo multiplying by dividing."),
       ("Divide both sides by A", "You want w alone. Divide by the letter that is WITH w: l."),
       ("Multiply both sides by l", "That makes l·l·w. Divide by l instead.")],
      "Circle w. Treat l like a number. What is being done to w?", final=True, show="w = A/l")], 'Alw'),
 lit("Speed Demon: d = rt, solve for t", "d = rt", 't', [
   st("t is MULTIPLIED by r:", "Divide both sides by r", "↓ Divide both sides by r", "d " + O("÷ r") + " = " + C("r") + "t " + O("÷ r"), "d/r = t",
      [("Subtract r from both sides", "rt means r TIMES t. Divide."),
       ("Divide both sides by d", "Divide by the letter that is WITH t: r."),
       ("Multiply both sides by r", "Multiplying makes it r·r·t. Divide by r instead.")],
      "Treat r like a number. 5t = d would need ÷ 5.", final=True, show="t = d/r")], 'drt'),
 lit("Slope Shifter: y = mx + b, solve for x", "y = mx + b", 'x', [
   st("Undo the + b first:", "Subtract b from both sides", "↓ Subtract b from both sides", "y " + O("− b") + " = mx " + C("+ b") + " " + O("− b"), "y − b = mx",
      [("Add b to both sides", "+ b is undone by SUBTRACTING b."),
       ("Divide both sides by m", "Not yet. Undo the + b first (like undoing + 4 before ÷ 3)."),
       ("Subtract m from both sides", "m is MULTIPLIED by x. Move the + b first.")],
      "Solve it like y = 3x + 4. What do you undo first?"),
   st("x is MULTIPLIED by m:", "Divide both sides by m", "↓ Divide both sides by m", "(y − b) " + O("÷ m") + " = " + C("m") + "x " + O("÷ m"), "(y − b)/m = x",
      [("Subtract m from both sides", "mx means m TIMES x. Divide."),
       ("Divide only y by m", "Divide the WHOLE side by m: (y − b)/m."),
       ("Multiply both sides by m", "Multiplying makes it bigger. Divide by m.")],
      "Divide the whole left side by m.", final=True, show="x = (y − b)/m")], 'ymxb'),
 lit("Fence Builder: P = 2l + 2w, solve for w", "P = 2l + 2w", 'w', [
   st("Undo the 2l first:", "Subtract 2l from both sides", "↓ Subtract 2l from both sides", "P " + O("− 2l") + " = " + C("2l") + " " + O("− 2l") + " + 2w", "P − 2l = 2w",
      [("Add 2l to both sides", "+ 2l is undone by SUBTRACTING 2l."),
       ("Divide both sides by 2l", "2l is ADDED, not multiplied. Subtract it."),
       ("Subtract 2 from both sides", "The 2 is multiplied by l. Move the whole term 2l.")],
      "Which term is NOT the w-term? Move it away."),
   st("w is MULTIPLIED by 2:", "Divide both sides by 2", "↓ Divide both sides by 2", "(P − 2l) " + O("÷ 2") + " = " + C("2") + "w " + O("÷ 2"), "(P − 2l)/2 = w",
      [("Divide only P by 2", "Divide the WHOLE side by 2: (P − 2l)/2."),
       ("Subtract 2 from both sides", "2w means 2 TIMES w. Divide."),
       ("Multiply both sides by 2", "Multiplying makes 4w. Divide by 2.")],
      "Divide the whole left side by 2.", final=True, show="w = (P − 2l)/2")], 'Plw'),
 lit("Standard Form Sorcerer: 3x + 2y = 12, solve for y", "3x + 2y = 12", 'y', [
   st("Move the x-term:", "Subtract 3x from both sides", "↓ Subtract 3x from both sides", C("3x") + " " + O("− 3x") + " + 2y = 12 " + O("− 3x"), "2y = 12 − 3x",
      [("Add 3x to both sides", "+ 3x is undone by SUBTRACTING 3x."),
       ("Subtract 12 from both sides", "Keep the 12. Move the term that is NOT the y-term: 3x."),
       ("Divide both sides by 2", "Not yet. Move the 3x first.")],
      "Get the y-term alone first."),
   st("y is MULTIPLIED by 2:", "Divide both sides by 2", "↓ Divide both sides by 2", C("2") + "y " + O("÷ 2") + " = (12 − 3x) " + O("÷ 2"), "y = 6 − (3/2)x",
      [("Divide only 12 by 2", "Divide EVERY term by 2: 12 ÷ 2 AND 3x ÷ 2."),
       ("Subtract 2 from both sides", "2y means 2 TIMES y. Divide."),
       ("Divide both sides by 3", "Divide by the number WITH y: 2.")],
      "Divide every term on the right by 2.", final=True, show="y = 6 − (3/2)x, or y = −(3/2)x + 6")], 'xy'),
 lit("Temperature Twister: F = (9/5)C + 32, solve for C", "F = (9/5)C + 32", 'C', [
   st("Undo the + 32:", "Subtract 32 from both sides", "↓ Subtract 32 from both sides", "F " + O("− 32") + " = (9/5)C " + C("+ 32") + " " + O("− 32"), "F − 32 = (9/5)C",
      [("Add 32 to both sides", "+ 32 is undone by SUBTRACTING 32."),
       ("Multiply both sides by 5/9", "Not yet. Undo the + 32 first."),
       ("Divide both sides by 32", "32 is ADDED. Subtract it.")],
      "What undoes + 32?"),
   st("C is multiplied by 9/5:", "Multiply both sides by 5/9 (the reciprocal)", "↓ Multiply both sides by 5/9", O("(5/9)") + "(F − 32) = " + C("(9/5)") + "C · " + O("(5/9)"), "(5/9)(F − 32) = C",
      [("Multiply both sides by 9/5", "That makes (81/25)C. Use the reciprocal 5/9."),
       ("Subtract 9/5 from both sides", "9/5 is MULTIPLIED by C. Use the reciprocal."),
       ("Divide both sides by 9", "That leaves (1/5)C. Multiply by 5/9 to get 1C.")],
      "The reciprocal of 9/5 is 5/9.", final=True, show="C = (5/9)(F − 32)")], 'FC'),
 lit("Cone Commander: V = (1/3)Bh, solve for h", "V = (1/3)Bh", 'h', [
   st("Clear the 1/3:", "Multiply both sides by 3", "↓ Multiply both sides by 3", O("3") + "V = " + O("3") + " · " + C("(1/3)") + "Bh", "3V = Bh",
      [("Divide both sides by 3", "Dividing makes (1/9). Multiply by 3 to undo the 1/3."),
       ("Subtract 1/3 from both sides", "1/3 is MULTIPLIED. Undo it by multiplying by 3."),
       ("Divide both sides by B", "That works too, but clear the fraction first to keep it simple.")],
      "The reciprocal of 1/3 is 3."),
   st("h is multiplied by B:", "Divide both sides by B", "↓ Divide both sides by B", "3V " + O("÷ B") + " = " + C("B") + "h " + O("÷ B"), "3V/B = h",
      [("Subtract B from both sides", "Bh means B TIMES h. Divide."),
       ("Divide both sides by 3V", "Divide by the letter WITH h: B."),
       ("Multiply both sides by B", "Multiplying makes B·B·h. Divide by B.")],
      "Treat B like a number.", final=True, show="h = 3V/B")], 'VBh'),
 lit("Interest Inspector: I = Prt, solve for r", "I = Prt", 'r', [
   st("r is multiplied by P AND t:", "Divide both sides by Pt", "↓ Divide both sides by Pt", "I " + O("÷ Pt") + " = " + C("P") + "r" + C("t") + " " + O("÷ Pt"), "I/(Pt) = r",
      [("Divide both sides by P only", "That leaves rt. Divide by EVERYTHING multiplied with r: P and t."),
       ("Subtract Pt from both sides", "Prt means P TIMES r TIMES t. Divide."),
       ("Divide both sides by I", "Divide by the letters WITH r: P and t.")],
      "Everything multiplied with r goes: divide by Pt.", final=True, show="r = I/(Pt)")], 'IPrt'),
]
LIT_VALUES = {'Alw': ['l', 'w'], 'drt': ['r', 't'], 'ymxb': ['m', 'x', 'b'], 'Plw': ['l', 'w'], 'xy': ['x', 'y'], 'FC': ['C'], 'VBh': ['B', 'h'], 'IPrt': ['P', 'r', 't']}
def lit_check(Pr):
    for _ in range(25):
        env = {}
        for v in 'AlwdrtymxbPFCVBhI':
            env[v] = R.choice([2, 3, 5, 7, 1.5, 4, 6, 11, -3, 9])
        # make the start true: compute the left letter from the others
        lhs, rhs = Pr['start'].split('=')
        env[lhs.strip()] = 0
        env[lhs.strip()] = eval(fpy(rhs), {}, env)
        if Pr['start'] == '3x + 2y = 12':
            env['x'] = R.choice([1, 2, 5, -4]); env['y'] = (12 - 3 * env['x']) / 2
        assert ftrue(Pr['start'], env), Pr['title']
        for s in Pr['steps']:
            for line in [s['res'], s.get('show', '').split(',')[0] if s.get('show') else None]:
                if line and '=' in line: assert ftrue(line.replace(', or', ''), env), (Pr['title'], line, env)
        # the final line has the target letter alone on one side
    fin = Pr['steps'][-1]['show']
    assert fin.startswith(Pr['var'] + ' = '), Pr['title']

# =====================================================================
# Level 4: Inequalities (Math 1: both sides, negatives, compound)
# =====================================================================
FLIP = {'<': '>', '>': '<', '≤': '≥', '≥': '≤'}
def t_ineq_neg():
    a = -R.choice([2, 3, 4, 5]); b = R.choice([v for v in range(-8, 9) if v]); s = R.choice([v for v in range(-5, 7)]); rel = R.choice(['<', '>', '≤', '≥'])
    c = a * s + b; start = f"{lin(a, b)} {rel} {N(c)}"; fr = FLIP[rel]
    return dict(title=f"Flip Fiend: {start}", start=start, ans=(s, fr), steps=[
        st(f"Undo the {pm(b)}:", undo(b), "↓ " + undo(b), f"{T(a)} " + C(pm(b)) + " " + opn(b) + f" {rel} {N(c)} " + opn(b), f"{T(a)} {rel} {N(c - b)}",
           [(wrongway(b), f"{pm(b)} is undone by the OPPOSITE operation."),
            (f"{undo(b)} and flip the sign", "Adding or subtracting NEVER flips the sign."),
            (f"Divide both sides by {N(a)} first", f"Undo the {pm(b)} first.")], f"Solve it like an equation. What undoes {pm(b)}?"),
        st("Divide by the negative:", f"Divide both sides by {N(a)} and FLIP {rel} to {fr}", f"↓ Divide by {N(a)} and flip the sign",
           C(N(a)) + "x " + O(f"÷ ({N(a)})") + " " + O(fr) + f" {N(c - b)} " + O(f"÷ ({N(a)})"), f"x {fr} {N(s)}",
           [(f"Divide both sides by {N(a)} and keep {rel}", f"Dividing by a NEGATIVE flips the sign: {rel} becomes {fr}."),
            (f"Divide both sides by {-a} and keep {rel}", f"Divide by {N(a)} (sign and all), then flip."),
            (f"Divide both sides by {N(a)} and get x {fr} {N(-s) if s else 1}", f"{N(c - b)} ÷ ({N(a)}) = {N(s)}. Check the sign of the number.")],
           "Negative in front of x? Divide and FLIP."),
        graph_step(s, fr)])

def t_ineq_both():
    a, c = R.sample(range(2, 9), 2); s = R.choice(range(-5, 7)); b = R.choice([v for v in range(-8, 9) if v]); d = (a - c) * s + b; rel = R.choice(['<', '>', '≤', '≥'])
    start = f"{lin(a, b)} {rel} {lin(c, d)}"; k = a - c
    if k > 0:
        mv = f"Subtract {c}x from both sides"; mid = f"{lin(k, b)} {rel} {N(d)}"
        tr = f"{T(a)} " + O(f"− {c}x") + f" {pm(b)} {rel} " + C(T(c)) + " " + O(f"− {c}x") + f" {pm(d)}"; frel = rel
        st2 = st(f"Undo the {pm(b)}:", undo(b), "↓ " + undo(b), f"{T(k)} " + C(pm(b)) + " " + opn(b) + f" {rel} {N(d)} " + opn(b), f"{T(k)} {rel} {N(d - b)}",
                 [(wrongway(b), f"{pm(b)} is undone by the OPPOSITE operation."), (f"{undo(b)} and flip the sign", "Adding or subtracting never flips the sign."),
                  (f"Divide both sides by {k} first", f"Undo the {pm(b)} first.")], f"What undoes {pm(b)}?")
        st3 = st("Get x alone:", f"Divide both sides by {k} (keep {rel})", f"↓ Divide both sides by {k}", C(str(k)) + "x " + O(f"÷ {k}") + f" {rel} {N(d - b)} " + O(f"÷ {k}"), f"x {rel} {N(s)}",
                 [(f"Divide both sides by {k} and flip to {FLIP[rel]}", f"{k} is POSITIVE. Only flip for a NEGATIVE."), (f"Subtract {k} from both sides", f"{k}x means {k} times x. Divide."),
                  (f"Divide both sides by {N(d - b)}", f"Divide by the number in front of x: {k}.")], f"Is {k} positive or negative?")
    else:
        k2 = c - a; mv = f"Subtract {a}x from both sides"; mid = f"{N(b)} {rel} {lin(k2, d)}"
        tr = C(T(a)) + " " + O(f"− {a}x") + f" {pm(b)} {rel} {T(c)} " + O(f"− {a}x") + f" {pm(d)}"; frel = rel
        st2 = st(f"Undo the {pm(d)}:", undo(d), "↓ " + undo(d), f"{N(b)} " + opn(d) + f" {rel} {T(k2)} " + C(pm(d)) + " " + opn(d), f"{N(b - d)} {rel} {T(k2)}",
                 [(wrongway(d), f"{pm(d)} is undone by the OPPOSITE operation."), (f"{undo(d)} and flip the sign", "Adding or subtracting never flips the sign."),
                  (f"Divide both sides by {k2} first", f"Undo the {pm(d)} first.")], f"What undoes {pm(d)}?")
        st3 = st("Get x alone:", f"Divide both sides by {k2} (keep {rel})", f"↓ Divide both sides by {k2}", f"{N(b - d)} " + O(f"÷ {k2}") + f" {rel} " + C(str(k2)) + "x " + O(f"÷ {k2}"), f"{N(s)} {rel} x",
                 [(f"Divide both sides by {k2} and flip to {FLIP[rel]}", f"{k2} is POSITIVE. Only flip for a NEGATIVE."), (f"Subtract {k2} from both sides", f"{k2}x means {k2} times x. Divide."),
                  (f"Divide both sides by {N(b - d)}", f"Divide by the number in front of x: {k2}.")], f"Is {k2} positive or negative?")
        st4 = st(f"{N(s)} {rel} x: read it with x first.", f"x {FLIP[rel]} {N(s)}", "↓ Rewrite with x first", f"{N(s)} {rel} x", f"x {FLIP[rel]} {N(s)}",
                 [(f"x {rel} {N(s)}", f"Turn the whole statement around: the sign must still point at the same thing. {N(s)} {rel} x means x {FLIP[rel]} {N(s)}."),
                  (f"x {FLIP[rel]} {N(-s) if s else 1}", "Turning it around does not change the number."),
                  (f"x = {N(s)}", "It is an inequality: keep the sign.")], "The sign must point at the same side: the open mouth faces the bigger side.")
        frel = FLIP[rel]
    stp = [st("x's on both sides:", mv, "↓ " + mv, tr, mid,
              [(mv.replace('Subtract', 'Add').replace('from', 'to'), "Adding makes MORE x's. Subtract to cancel."),
               (f"Subtract {max(a, c)}x from both sides", f"That leaves a negative x-term (then you must flip). Cancel the SMALLER x-term, {min(a, c)}x."),
               (f"{mv} and flip the sign", "Subtracting never flips the sign.")], "Cancel the smaller x-term.")]
    stp += [st2, st3] + ([st4] if k < 0 else []) + [graph_step(s, frel)]
    return dict(title=f"Balance Brawler: {start}", start=start, ans=(s, frel), steps=stp)

def t_compound():
    a = R.choice([2, 3, 4]); b = R.choice([v for v in range(-6, 7) if v]); lo = R.choice(range(-4, 2)); hi = lo + R.choice([3, 4, 5])
    r1, r2 = R.choice(['<', '≤']), R.choice(['<', '≤'])
    L, U = a * lo + b, a * hi + b; start = f"{N(L)} {r1} {lin(a, b)} {r2} {N(U)}"
    return dict(title=f"Sandwich Storm: {start}", start=start, ans2=(lo, r1, hi, r2), steps=[
        st(f"Three parts! Undo the {pm(b)}:", undo(b).replace('both sides', 'ALL THREE parts'), "↓ " + undo(b).replace('both sides', 'all three parts'),
           f"{N(L)} " + opn(b) + f" {r1} {T(a)} " + C(pm(b)) + " " + opn(b) + f" {r2} {N(U)} " + opn(b), f"{N(L - b)} {r1} {T(a)} {r2} {N(U - b)}",
           [(undo(b).replace('both sides', 'the middle only'), "Do the same thing to ALL THREE parts, or the statement changes."),
            (wrongway(b).replace('both sides', 'all three parts'), f"{pm(b)} is undone by the OPPOSITE operation."),
            (f"Divide all three parts by {a} first", f"Undo the {pm(b)} first.")], "Whatever you do to the middle, do to the left and the right too."),
        st("Get x alone:", f"Divide all three parts by {a}", f"↓ Divide all three parts by {a}",
           f"{N(L - b)} " + O(f"÷ {a}") + f" {r1} " + C(str(a)) + "x " + O(f"÷ {a}") + f" {r2} {N(U - b)} " + O(f"÷ {a}"), f"{N(lo)} {r1} x {r2} {N(hi)}",
           [(f"Divide only the middle by {a}", "Divide ALL THREE parts."), (f"Divide all three parts by {a} and flip both signs", f"{a} is POSITIVE. No flip."),
            (f"Subtract {a} from all three parts", f"{a}x means {a} TIMES x. Divide.")], f"{a}x means {a} times x."),
        graph2(lo, r1, hi, r2)])

# =====================================================================
# Level 5: Create & Solve (story → equation → solve → meaning)
# =====================================================================
def story():
    k = R.choice(['phone', 'gym', 'plans', 'budget', 'save'])
    if k in ('phone', 'gym'):
        f, r, n = (R.choice([20, 25, 30, 35]), R.choice([5, 8, 10, 12, 15]), R.choice(range(3, 11))) if k == 'phone' else (R.choice([40, 50, 60]), R.choice([15, 20, 25, 30]), R.choice(range(2, 9)))
        tot = f + r * n; v = 'm'
        txt = (f"A phone plan costs ${f} to start plus ${r} per month. Jada has paid ${tot} in all. How many months (m)?" if k == 'phone'
               else f"A gym charges a ${f} sign-up fee plus ${r} per month. Leo paid ${tot} in all. How many months (m)?")
        start = f"{f} + {r}m = {tot}"
        return dict(title=("Plan Planner" if k == 'phone' else "Gym Grinder") + f": {f} + {r}m = {tot}", start=start, var=v, sol=F(n), story=txt, steps=[
            st("Which equation fits the story?", f"{f} + {r}m = {tot}", "↓ Write the equation", f"{f} + {r}m = {tot}", start,
               [(f"{r} + {f}m = {tot}", f"Swapped: the ${r} happens EVERY month, so it goes with m. The ${f} happens once."),
                (f"{f}m + {r}m = {tot}", f"The ${f} is paid only once, so it does not go with m."),
                (f"{f} − {r}m = {tot}", "Each month ADDS to the cost.")], "The one-time cost stands alone. The per-month cost goes with m."),
            st(f"Undo the + {f}:", f"Subtract {f} from both sides", f"↓ Subtract {f} from both sides", C(str(f)) + " " + O(f"− {f}") + f" + {r}m = {tot} " + O(f"− {f}"), f"{r}m = {tot - f}",
               [(f"Add {f} to both sides", f"+ {f} is undone by SUBTRACTING."), (f"Divide both sides by {r}", f"Undo the + {f} first."), (f"Subtract {r} from both sides", f"{r}m means {r} times m. Move the {f} first.")], f"What undoes + {f}?"),
            st("Get m alone:", f"Divide both sides by {r}", f"↓ Divide both sides by {r}", C(str(r)) + "m " + O(f"÷ {r}") + f" = {tot - f} " + O(f"÷ {r}"), f"m = {n}",
               [(f"Subtract {r} from both sides", f"{r}m means {r} TIMES m. Divide."), (f"Divide both sides by {tot - f}", f"Divide by the number with m: {r}."), (f"Multiply both sides by {r}", "Multiplying makes it bigger. Divide.")], f"{r}m means {r} times m.", final=True,
               show=f"m = {n} → {n} months")])
    if k == 'plans':
        f1, r1 = R.choice([10, 20, 30]), R.choice([6, 7, 8, 9]); r2 = R.choice([v for v in range(2, r1)]); n = R.choice(range(2, 9)); f2 = f1 + (r1 - r2) * n; dk = r1 - r2
        txt = f"Bike Rental A costs ${f1} plus ${r1} per hour. Rental B costs ${f2} plus ${r2} per hour. After how many hours (h) do they cost the same?"
        start = f"{f1} + {r1}h = {f2} + {r2}h"
        stp = [st("Which equation fits the story?", start, "↓ Write the equation", start, start,
                  [(f"{f1} + {r1}h = {f2} − {r2}h", "Each hour ADDS to Rental B's cost too."),
                   (f"{r1} + {f1}h = {r2} + {f2}h", "Swapped: the per-hour cost goes with h."),
                   (f"{f1} + {r1}h + {f2} + {r2}h = 0", "Same cost means set the two costs EQUAL to each other.")], "Cost of A = cost of B."),
               st("h on both sides:", f"Subtract {r2}h from both sides", f"↓ Subtract {r2}h from both sides", f"{f1} + {r1}h " + O(f"− {r2}h") + f" = {f2} + " + C(f"{r2}h") + " " + O(f"− {r2}h"), f"{f1} + {lin(dk, 0, 'h')} = {f2}",
                  [(f"Add {r2}h to both sides", "SUBTRACT to cancel it."), (f"Subtract {f1} from both sides and stop", "Gather the h's on one side too."), (f"Subtract {r1}h from both sides", f"That leaves a negative h-term. Cancel the smaller one, {r2}h.")], "Cancel the smaller h-term."),
               st(f"Undo the + {f1}:", f"Subtract {f1} from both sides", f"↓ Subtract {f1} from both sides", C(str(f1)) + " " + O(f"− {f1}") + f" + {lin(dk, 0, 'h')} = {f2} " + O(f"− {f1}"), f"{lin(dk, 0, 'h')} = {f2 - f1}",
                  [(f"Add {f1} to both sides", f"+ {f1} is undone by SUBTRACTING."), (f"Divide both sides by {dk}", f"Undo the + {f1} first."), (f"Subtract {f2} from both sides", f"Move the number that is WITH the h-term: {f1}.")], f"What undoes + {f1}?")]
        if dk > 1:
            stp.append(st("Get h alone:", f"Divide both sides by {dk}", f"↓ Divide both sides by {dk}", C(str(dk)) + "h " + O(f"÷ {dk}") + f" = {f2 - f1} " + O(f"÷ {dk}"), f"h = {n}",
                          [(f"Subtract {dk} from both sides", f"{dk}h means {dk} TIMES h."), (f"Divide both sides by {f2 - f1}", f"Divide by the number with h: {dk}."), (f"Multiply both sides by {dk}", "Divide instead.")], f"{dk}h means {dk} times h."))
        stp[-1]['final'] = True; stp[-1]['show'] = f"h = {n} → same cost after {n} hours"
        return dict(title=f"Rental Rumble: {start}", start=start, var='h', sol=F(n), story=txt, steps=stp)
    # inequalities: at most / at least
    if k == 'budget':
        f, r = R.choice([12, 15, 18, 20]), R.choice([4, 5, 6, 8]); n = R.choice(range(3, 10)); B = f + r * n
        txt = f"A field trip costs ${f} for the bus plus ${r} per ticket. The club can spend at most ${B}. How many tickets (t) can it buy?"
        start = f"{f} + {r}t ≤ {B}"
        return dict(title=f"Budget Boss: {start}", start=start, var='t', ans=(n, '≤'), story=txt, steps=[
            st("Which inequality fits the story?", start, "↓ Write the inequality", start, start,
               [(f"{f} + {r}t ≥ {B}", "\"At most\" means no more than: use ≤."), (f"{r} + {f}t ≤ {B}", f"Swapped: the ${r} is per ticket, so it goes with t."), (f"{f} + {r}t < {B}", f"\"At most ${B}\" INCLUDES spending exactly ${B}: use ≤.")],
               "At most → ≤. At least → ≥."),
            st(f"Undo the + {f}:", f"Subtract {f} from both sides", f"↓ Subtract {f} from both sides", C(str(f)) + " " + O(f"− {f}") + f" + {r}t ≤ {B} " + O(f"− {f}"), f"{r}t ≤ {B - f}",
               [(f"Add {f} to both sides", f"+ {f} is undone by SUBTRACTING."), (f"Subtract {f} and flip the sign", "Subtracting never flips the sign."), (f"Divide both sides by {r}", f"Undo the + {f} first.")], f"What undoes + {f}?"),
            st("Get t alone:", f"Divide both sides by {r} (keep ≤)", f"↓ Divide both sides by {r}", C(str(r)) + "t " + O(f"÷ {r}") + f" ≤ {B - f} " + O(f"÷ {r}"), f"t ≤ {n}",
               [(f"Divide both sides by {r} and flip to ≥", f"{r} is positive: no flip."), (f"Subtract {r} from both sides", f"{r}t means {r} TIMES t."), (f"Divide both sides by {B - f}", f"Divide by the number with t: {r}.")], f"Is {r} positive or negative?"),
            st(f"What does t ≤ {n} mean here?", f"The club can buy at most {n} tickets", "↓ Answer the question", f"t ≤ {n}", f"t ≤ {n}",
               [(f"The club must buy at least {n} tickets", "≤ means that many OR FEWER: at most."), (f"The club can buy at most {B - f} tickets", f"{B - f} is dollars, not tickets. {B - f} ÷ {r} = {n}."), (f"The club can buy exactly {n + 1} tickets", f"{n + 1} tickets would cost ${f + r * (n + 1)}: over budget.")],
               f"≤ {n} means {n} or fewer.", final=True, show=f"t ≤ {n} → at most {n} tickets")])
    g, r = R.choice([40, 60, 80, 100]), R.choice([10, 15, 20, 25]); n = R.choice(range(4, 12)); goal = g + r * n
    txt = f"Mia has ${g} saved and saves ${r} more each week. She needs at least ${goal} for a bike. How many weeks (w) until she has enough?"
    start = f"{g} + {r}w ≥ {goal}"
    return dict(title=f"Saver Supreme: {start}", start=start, var='w', ans=(n, '≥'), story=txt, steps=[
        st("Which inequality fits the story?", start, "↓ Write the inequality", start, start,
           [(f"{g} + {r}w ≤ {goal}", "\"At least\" means that much OR MORE: use ≥."), (f"{r} + {g}w ≥ {goal}", f"Swapped: the ${r} is saved each week, so it goes with w."), (f"{g}w + {r} ≥ {goal}", f"The ${g} is already saved once. The ${r} goes with w.")],
           "At least → ≥."),
        st(f"Undo the + {g}:", f"Subtract {g} from both sides", f"↓ Subtract {g} from both sides", C(str(g)) + " " + O(f"− {g}") + f" + {r}w ≥ {goal} " + O(f"− {g}"), f"{r}w ≥ {goal - g}",
           [(f"Add {g} to both sides", f"+ {g} is undone by SUBTRACTING."), (f"Subtract {g} and flip the sign", "Subtracting never flips the sign."), (f"Divide both sides by {r}", f"Undo the + {g} first.")], f"What undoes + {g}?"),
        st("Get w alone:", f"Divide both sides by {r} (keep ≥)", f"↓ Divide both sides by {r}", C(str(r)) + "w " + O(f"÷ {r}") + f" ≥ {goal - g} " + O(f"÷ {r}"), f"w ≥ {n}",
           [(f"Divide both sides by {r} and flip to ≤", f"{r} is positive: no flip."), (f"Subtract {r} from both sides", f"{r}w means {r} TIMES w."), (f"Divide both sides by {goal - g}", f"Divide by the number with w: {r}.")], f"Is {r} positive or negative?"),
        st(f"What does w ≥ {n} mean here?", f"She needs at least {n} weeks", "↓ Answer the question", f"w ≥ {n}", f"w ≥ {n}",
           [(f"She needs at most {n} weeks", "≥ means that many OR MORE: at least."), (f"She needs at least {goal - g} weeks", f"{goal - g} is dollars. {goal - g} ÷ {r} = {n} weeks."), (f"She will have enough after {n - 1} weeks", f"After {n - 1} weeks she has ${g + r * (n - 1)}: not enough.")],
           f"≥ {n} means {n} or more.", final=True, show=f"w ≥ {n} → at least {n} weeks")])

# ---------- check + emit ----------
class Dup(Exception): pass
SKIP = [0]
def check(Pr):
    if Pr.get('literal'): return lit_check(Pr)
    var = Pr.get('var', 'x'); start = Pr['start']
    for i, s in enumerate(Pr['steps']):
        if len({s['ok']} | {w[0] for w in s['wrongs']}) != 4: raise Dup(Pr['title'])   # two choices came out the same: make another
        if s.get('graph'):
            at, rel = s['graph']; assert same_set(start, f"{var} {rel} {N(at)}", var), Pr['title']; continue
        if s.get('graph2'):
            lo, r1, hi, r2 = s['graph2']; assert same_set(start, f"{N(lo)} {r1} {var} {r2} {N(hi)}", var), Pr['title']; continue
        if s['res'] is None: continue
        assert same_set(start, s['res'], var), (Pr['title'], i, s['res'])
    if 'sol' in Pr and Pr['sol'] is not None:
        assert truth(start, Pr['sol'], var) and sum(truth(start, x, var) for x in PTS) == 1, Pr['title']
    if Pr.get('special') == 'infinite': assert all(truth(start, x, var) for x in PTS)
    if Pr.get('special') == 'no-solution': assert not any(truth(start, x, var) for x in PTS)
    if 'ans' in Pr: a, rel = Pr['ans']; assert same_set(start, f"{var} {rel} {N(a)}", var), Pr['title']
    assert Pr['steps'][-1].get('final'), Pr['title']

def emit(Pr):
    steps = []; cur = Pr['start']; var = Pr.get('var', 'x')
    for s in Pr['steps']:
        ch = [{'text': plain(s['ok']), 'correct': True}] + [{'text': plain(t), 'correct': False, 'why': plain(w)} for t, w in s['wrongs']]
        if s.get('graph'): res = f"{var} {s['graph'][1]} {N(s['graph'][0])}  ✓ graphed"
        elif s.get('graph2'): lo, r1, hi, r2 = s['graph2']; res = f"{N(lo)} {r1} {var} {r2} {N(hi)}  ✓ graphed"
        else: res = s.get('show') or (s['res'] or cur)
        oc = {'action': plain(s['action']), 'transform': disp(s['tr']), 'result': disp(res)}
        if s.get('final'): oc['isFinal'] = True
        if s.get('special'): oc['isSpecial'] = s['special']
        steps.append({'current': disp(cur), 'prompt': plain(s['prompt']), 'choices': ch, 'onCorrect': oc, 'wrongHint': plain(s['hint'])})
        if s['res']: cur = s['res']
    d = {'title': plain(Pr['title']), 'startEq': disp(Pr['start']), 'steps': steps}
    if Pr.get('story'): d['story'] = Pr['story']
    return d

def many(fns, n):
    out, seen = [], set()
    while len(out) < n:
        p = R.choice(fns)()
        if p['start'] in seen: continue
        try: check(p)
        except Dup: SKIP[0] += 1; continue
        seen.add(p['start']); out.append(p)
    return out

L0 = many([t_dist, t_both, t_frac, t_distboth], 10) + [t_special('no-solution'), t_special('infinite')]
for p in L0[-2:]: check(p)
L1 = many([justify], 10)
for p in LITERAL: check(p)
L4 = many([t_ineq_neg, t_ineq_both, t_compound], 10)
L5 = many([story], 10)
LEVELS = {'apprentice': L0, 'journeyman': L1, 'master': LITERAL, 'champion': L4, 'inequalities': L5}

# ---------- build the page from the 8th grade game ----------
h = open(SRC, encoding='utf-8').read()
def rep(a, b, n=1):
    global h
    assert h.count(a) == n, (a[:80], h.count(a)); h = h.replace(a, b)

s0 = h.index('var PROBLEMS'); s1 = h.index('// ═══', h.index('// END BUILT'))
data = 'var PROBLEMS = {\n// BUILT by _build/math1_arcade/equation_master_m1.py: do not edit by hand\n' + ',\n'.join(
    f"{k}: " + json.dumps([emit(p) for p in v], ensure_ascii=False, indent=1) for k, v in LEVELS.items()) + '\n};\n\n'
h = h[:s0] + data + h[s1:]

GATE = """<script>
(function(){
  // Math 1 lite gate — mild deterrent only (pages remain public).
  try{
    if(sessionStorage.getItem('m1ok')==='1') return;
    var here = window.location.pathname.split('/').pop() || 'index.html';
    sessionStorage.setItem('m1dest', here + window.location.search + window.location.hash);
  }catch(e){}
  window.location.replace('gate.html');
})();
</script>
"""
h = h.replace('<head>', '<head>\n' + GATE, 1)
h = re.sub(r'<title>[^<]*</title>', '<title>Equation Master: Math 1 | Math 1 Arcade</title>', h, count=1)
rep('data-game="Equation Master" data-unit="3"', 'data-game="Equation Master: Math 1" data-unit="M1 Unit 1"')
h = re.sub(r'<nav class="sb-local".*?</nav>', '<nav class="sb-local" aria-label="On this page"><a href="arcade.html">← Math 1 Arcade</a> <a href="unit1.html">Unit 1</a> <a href="unit1-notes.html">Unit 1 notes</a></nav>', h, count=1, flags=re.S)
rep('<a class="btn btn-navy" href="unit3.html" style="text-decoration:none">📖 Review Notes</a>', '<a class="btn btn-navy" href="unit1-notes.html" style="text-decoration:none">📖 Review Notes</a>')
rep('<a class="btn btn-navy" href="unit3-notes.html" style="text-decoration:none">✏️ Practice</a>', '<a class="btn btn-navy" href="arcade.html" style="text-decoration:none">🎮 Math 1 Arcade</a>')
# grade8-local files now live one folder over
for f in sorted(set(re.findall(r'(?:src|href)="([a-z0-9_.-]+\.(?:js|css)(?:\?[^"]*)?)"', h))):
    if os.path.exists(os.path.join(ROOT, 'grade8', f.split('?')[0])): h = h.replace(f'"{f}"', f'"../grade8/{f}"')
for f in sorted(set(re.findall(r'href="([a-z0-9_-]+\.html)"', h))):
    if not os.path.exists(os.path.join(ROOT, 'math1', f)) and os.path.exists(os.path.join(ROOT, 'grade8', f)): h = h.replace(f'href="{f}"', f'href="../grade8/{f}"')
# levels: names and menu
rep("var levelNames = ['Apprentice','Journeyman','Master','Mixed','Champion','Inequalities'];",
    "var levelNames = ['Multi-Step','Justify It','Literal','Mixed','Inequalities','Create & Solve'];")
rep("[['apprentice',1],['journeyman',1],['master',2],['champion',2],['inequalities',2]]", "[['apprentice',2],['journeyman',1],['master',1],['champion',2],['inequalities',2]]")
MENU = [(0, '🧮 Multi-Step', 'Distribute, both sides, fractions<br>No solution &amp; infinitely many'),
        (1, '📜 Justify It', 'Name the property<br>that allows each step'),
        (2, '🔤 Literal', 'Solve a formula<br>for one letter'),
        (4, '🛡️ Inequalities', 'Flip for negatives, both sides<br>Compound, then graph it'),
        (5, '📖 Create &amp; Solve', 'Write the equation from a story<br>Solve it and say what it means'),
        (3, '🏆 Mixed', 'All types, random order<br>True test of mastery!')]
m0 = h.index('<div class="level-select">'); m1 = h.index('<div class="how-it-works">')
h = h[:m0] + '<div class="level-select">\n' + ''.join(
    f'    <div class="level-opt{" selected" if i == 0 else ""}" onclick="selectLevel({k},this)" id="lvl-{k}">\n      <h4>{t}</h4>\n      <p>{d}</p>\n    </div>\n'
    for i, (k, t, d) in enumerate(MENU)) + '  </div>\n  ' + h[m1:]
h = re.sub(r'(<h1[^>]*>)(.*?)(</h1>)', lambda m: m.group(1) + m.group(2).replace('Equation Master', 'Equation Master: Math 1') + m.group(3), h, count=1, flags=re.S)
rep('Solve equations step-by-step — choose the right move at each stage! · Unit 3 · NC.8.EE.7', 'Solve step by step: choose the right move at each stage! · Math 1 Unit 1 · NC.M1.A-REI.1, A-REI.3, A-CED.1, A-CED.4')
# show each step's own question (Justify It shows the next line there); the solved message as plain text
rep("  lockFor(THINK_MS, 'Read the equation first…');", "  var cl = document.querySelector('.choices-label'); if (cl) cl.textContent = step.prompt || \"What's the next step?\";\n  lockFor(THINK_MS, 'Read the equation first…');")
rep("showFeedback('ok', '🎉 Solved! The answer is ' + oc.result);", "showFeedback('ok', '🎉 Solved! The answer is ' + oc.result.replace(/<span class='fr'><span>(\\d+)<\\/span><span>(\\d+)<\\/span><\\/span>/g, '$1/$2').replace(/<[^>]+>/g, ''));")
h = h.replace('<!-- START SCREEN -->', '<!-- START SCREEN (Math 1 copy, built by _build/math1_arcade/equation_master_m1.py from grade8/equation_master.html) -->', 1)
open(OUT, 'w', encoding='utf-8').write(h)
n = {k: len(v) for k, v in LEVELS.items()}
print('ok', n, 'skipped (same choice twice):', SKIP[0], sum(len(p['steps']) for v in LEVELS.values() for p in v), 'steps checked')
