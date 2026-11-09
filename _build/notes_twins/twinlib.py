"""Helpers for the Interactive Notes "try a similar one" problems (Nov 2026).

Every twin answer is computed here with exact Fraction arithmetic and checked before the JS file is written.
Output: grade8/twins/<page>.js  →  window.NOTE_TWINS = { '<question id>': {...} }  (read by notes-flow.js).
"""
from fractions import Fraction as F
import json, os, re, math

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
M = '−'  # true minus for display


# ---------- numbers ----------
def fnum(v):
    """Display a Fraction/int with a true minus: 5, −3, 1/2, −7/4, 2.5 stays a fraction unless asked."""
    v = F(v)
    s = str(v.numerator if v.denominator == 1 else f"{abs(v.numerator)}/{v.denominator}")
    if v.denominator == 1:
        return (M + str(abs(v.numerator))) if v < 0 else str(v.numerator)
    return (M if v < 0 else '') + s


def plain(v):
    """ASCII form for answer matching: -3, 7/2."""
    v = F(v)
    return str(v.numerator) if v.denominator == 1 else f"{v.numerator}/{v.denominator}"


def dec(v, places=None):
    v = F(v)
    if places is None:
        for p in range(0, 7):
            if (v * 10 ** p).denominator == 1:
                places = p; break
        else:
            raise ValueError(v)
    q = round(v * 10 ** places)
    s = f"{abs(q) / 10 ** places:.{places}f}" if places else str(abs(q))
    return ('-' if q < 0 else '') + s


# ---------- linear expressions in x (exact) ----------
class Lin:
    def __init__(self, a=0, b=0): self.a, self.b = F(a), F(b)
    def __add__(s, o): o = lin_of(o); return Lin(s.a + o.a, s.b + o.b)
    def __sub__(s, o): o = lin_of(o); return Lin(s.a - o.a, s.b - o.b)
    def __neg__(s): return Lin(-s.a, -s.b)
    def __mul__(s, o):
        o = lin_of(o)
        if s.a and o.a: raise ValueError('not linear')
        return Lin(s.a * o.b + o.a * s.b, s.b * o.b)
    def __truediv__(s, o):
        o = lin_of(o)
        if o.a: raise ValueError('divide by x')
        return Lin(s.a / o.b, s.b / o.b)


def lin_of(o): return o if isinstance(o, Lin) else Lin(0, o)


def parse(expr, var='x'):
    """Parse a linear expression like '4(x + 1) − 2x', 'x/4 + 5', '0.5x + 3', '−(x − 6)'."""
    s = expr.replace(M, '-').replace('–', '-').replace('·', '*').replace('×', '*').replace(' ', '')
    toks = re.findall(r'\d+\.\d+|\d+|[a-z]|[-+*/()]', s)
    assert ''.join(toks) == s, (expr, toks)
    pos = [0]
    def peek(): return toks[pos[0]] if pos[0] < len(toks) else None
    def take(): t = toks[pos[0]]; pos[0] += 1; return t
    def expr_():
        v = term()
        while peek() in ('+', '-'):
            v = v + term() if take() == '+' else v - term()
        return v
    def term():
        v = unary()
        while True:
            p = peek()
            if p in ('*', '/'):
                take(); v = v * unary() if p == '*' else v / unary()
            elif p is not None and (p == '(' or p == var or re.match(r'\d', p)):
                v = v * unary()                                   # implicit multiplication
            else:
                return v
    def unary():
        if peek() == '-': take(); return -unary()
        if peek() == '+': take(); return unary()
        return atom()
    def atom():
        t = take()
        if t == '(':
            v = expr_(); assert take() == ')'; return v
        if t == var: return Lin(1, 0)
        return Lin(0, F(t))
    v = expr_()
    assert pos[0] == len(toks), expr
    return v


OPS = ['<=', '>=', '≤', '≥', '<', '>', '=']
FLIP = {'<': '>', '>': '<', '≤': '≥', '≥': '≤'}


def split(eq):
    e = eq.replace('<=', '≤').replace('>=', '≥')
    for op in ['≤', '≥', '<', '>', '=']:
        if op in e:
            l, r = e.split(op); return l.strip(), op, r.strip()
    raise ValueError(eq)


def solve(eq, var='x'):
    """'=' → Fraction | 'INF' | 'NONE';  inequality → (op, Fraction) with the variable on the left."""
    l, op, r = split(eq)
    d = parse(l, var) - parse(r, var)          # d.a x + d.b  op  0
    if op == '=':
        if d.a == 0: return 'INF' if d.b == 0 else 'NONE'
        return -d.b / d.a
    assert d.a != 0
    v = -d.b / d.a
    return (FLIP[op] if d.a < 0 else op), v


def fmt_lin(L, var='x'):
    a, b = L.a, L.b
    parts = []
    if a:
        if a.denominator != 1 and abs(a.numerator) == 1:
            parts.append(f"{M if a < 0 else ''}{var}/{a.denominator}")
        elif a.denominator != 1:
            parts.append(f"{M if a < 0 else ''}({abs(a.numerator)}/{a.denominator}){var}")
        else:
            c = '' if a == 1 else (M if a == -1 else fnum(a))
            parts.append(f"{c}{var}")
    if b or not parts:
        if parts:
            parts.append(('+ ' if b > 0 else M + ' ') + fnum(abs(b)))
        else:
            parts.append(fnum(b))
    return ' '.join(parts)


def steps(eq, var='x'):
    """Worked steps (html lines) for a linear equation or inequality, in the notes' style."""
    l, op, r = split(eq)
    L, R = parse(l, var), parse(r, var)
    out = []
    raw = f"{l} {op} {r}"
    simple = lambda s: re.fullmatch(r'\s*[−-]?\d*\.?\d*\s*[a-z]?\s*([+−-]\s*\d+\.?\d*)?\s*', s)
    if '(' in raw or not (simple(l) and simple(r)) or '/' in raw:
        nl, nr = f"{fmt_lin(L, var)} {op} {fmt_lin(R, var)}", None
        if nl.replace(' ', '') != raw.replace(' ', '').replace('-', M):
            out.append(('Distribute and combine like terms: ' if '(' in raw else 'Simplify each side: ') + nl)
    cur_op = op
    if R.a != 0:
        k = R.a
        L, R = L - Lin(k, 0), R - Lin(k, 0)
        word = f"Subtract {fmt_lin(Lin(k,0), var)}" if k > 0 else f"Add {fmt_lin(Lin(-k,0), var)}"
        out.append(f"{word} from both sides: {fmt_lin(L, var)} {cur_op} {fmt_lin(R, var)}" if k > 0 else
                   f"{word} to both sides: {fmt_lin(L, var)} {cur_op} {fmt_lin(R, var)}")
    if L.a == 0:
        tf = (L.b == R.b)
        out.append(f"The {var}'s cancel: {fnum(L.b)} = {fnum(R.b)} is {'TRUE → infinitely many solutions' if tf else 'FALSE → no solution'}.")
        return out
    if L.b != 0:
        k = L.b
        L, R = L - k, R - k
        out.append(f"{'Subtract' if k > 0 else 'Add'} {fnum(abs(k))}: {fmt_lin(L, var)} {cur_op} {fmt_lin(R, var)}")
    if L.a != 1:
        k = L.a
        v = R.b / k
        how = f"Divide by {fnum(k)}" if k.denominator == 1 else f"Multiply by {fnum(1 / k)}"
        if k < 0 and cur_op != '=':
            cur_op = FLIP[cur_op]
            out.append(f"{how} and FLIP the sign: {var} {cur_op} {fnum(v)}")
        else:
            out.append(f"{how}: {var} {cur_op} {fnum(v)}")
    return out


def ineq_answers(op, v, var='x'):
    n = plain(v)
    ascii_op = {'≤': '<=', '≥': '>=', '<': '<', '>': '>'}[op]
    rev = {'<=': '>=', '>=': '<=', '<': '>', '>': '<'}[ascii_op]
    out = [f"{var}{ascii_op}{n}", f"{n}{rev}{var}"]
    if op in '≤≥':
        out += [f"{var}{op}{n}", f"{n}{FLIP[op]}{var}", f"{var}{'=<' if op == '≤' else '=>'}{n}"]
    return out


def ineq_show(op, v, var='x'): return f"{var} {op} {fnum(v)}"


HOW_MANY = ['One solution', 'No solution', 'Infinitely many solutions']


def how_many(eq):
    r = solve(eq)
    return 'Infinitely many solutions' if r == 'INF' else 'No solution' if r == 'NONE' else 'One solution'


def eq_html(s):
    """x/4 → stacked fraction like the notes."""
    return re.sub(r'([a-z0-9]+)/(\d+)', r'<span class="sf"><span>\1</span><span class="sfx">/</span><span>\2</span></span>', s)


def write(page, twins, ids_expected=None):
    if ids_expected is not None:
        missing = sorted(set(ids_expected) - set(twins)); extra = sorted(set(twins) - set(ids_expected))
        assert not extra, ('twins for unknown ids', extra)
        if missing: print(f"  {page}: no twin for {missing}")
    path = os.path.join(ROOT, 'grade8', 'twins', page + '.js')
    with open(path, 'w') as f:
        f.write(f"/* {page}: similar problems for notes-flow.js. Built by _build/notes_twins/build.py — edit there, not here. */\n")
        f.write('window.NOTE_TWINS = ' + json.dumps(twins, ensure_ascii=False, indent=0) + ';\n')
    print(f"  wrote {path} ({len(twins)} twins)")


# ---------- small inline SVG figures (pages without a drawing library) ----------
NAVY, GOLD, BLUE, GREEN = '#1E2D4F', '#E0A800', '#0056B3', '#15803D'


def _t(x, y, s, size=15, c=NAVY, anchor='middle', w=700):
    return f'<text x="{x:.1f}" y="{y:.1f}" text-anchor="{anchor}" font-family="Inter,sans-serif" font-size="{size}" font-weight="{w}" fill="{c}">{s}</text>'


def right_tri(a, b, la, lb, lc, alt, maxw=240, hl=None):
    """Right triangle with legs a (bottom) and b (left side), right angle at bottom-left, drawn to scale.
    la, lb, lc = labels for bottom leg, side leg, hypotenuse.  hl = 'a'|'b'|'c' side to color gold."""
    a, b = float(a), float(b)
    s = min(170 / a, 120 / b)
    W, H = a * s, b * s
    x0, y0 = 40, 20 + H
    pts = [(x0, y0), (x0 + W, y0), (x0, y0 - H)]
    col = lambda k: GOLD if hl == k else NAVY
    out = [f'<svg role="img" aria-label="{alt}" viewBox="0 0 {W + 90:.0f} {H + 50:.0f}" width="{min(maxw, W + 90):.0f}" xmlns="http://www.w3.org/2000/svg">',
           f'<polygon points="{" ".join(f"{p[0]:.1f},{p[1]:.1f}" for p in pts)}" fill="#EEF3FB" stroke="none"/>',
           f'<line x1="{x0}" y1="{y0}" x2="{x0 + W:.1f}" y2="{y0}" stroke="{col("a")}" stroke-width="3"/>',
           f'<line x1="{x0}" y1="{y0}" x2="{x0}" y2="{y0 - H:.1f}" stroke="{col("b")}" stroke-width="3"/>',
           f'<line x1="{x0 + W:.1f}" y1="{y0}" x2="{x0}" y2="{y0 - H:.1f}" stroke="{col("c")}" stroke-width="3"/>',
           f'<rect x="{x0}" y="{y0 - 12}" width="12" height="12" fill="none" stroke="{NAVY}" stroke-width="1.5"/>',
           _t(x0 + W / 2, y0 + 20, la), _t(x0 - 8, y0 - H / 2 + 5, lb, anchor='end'),
           _t(x0 + W / 2 + 12, y0 - H / 2 - 4, lc, anchor='start'), '</svg>']
    return ''.join(out)


def grid_pts(p, q, alt, lo=None, hi=None, maxw=250):
    """Coordinate grid with two labeled points and the right-triangle legs between them."""
    xs, ys = [p[0], q[0], 0], [p[1], q[1], 0]
    lo = lo if lo is not None else min(min(xs), min(ys)) - 1
    hi = hi if hi is not None else max(max(xs), max(ys)) + 1
    n = hi - lo; c = 200 / n
    X = lambda x: 20 + (x - lo) * c
    Y = lambda y: 20 + (hi - y) * c
    o = [f'<svg role="img" aria-label="{alt}" viewBox="0 0 240 240" width="{maxw}" xmlns="http://www.w3.org/2000/svg">']
    for k in range(lo, hi + 1):
        o.append(f'<line x1="{X(k):.1f}" y1="{Y(lo):.1f}" x2="{X(k):.1f}" y2="{Y(hi):.1f}" stroke="#D5DBE6" stroke-width="1"/>')
        o.append(f'<line x1="{X(lo):.1f}" y1="{Y(k):.1f}" x2="{X(hi):.1f}" y2="{Y(k):.1f}" stroke="#D5DBE6" stroke-width="1"/>')
    if lo <= 0 <= hi:
        o.append(f'<line x1="{X(0):.1f}" y1="{Y(lo):.1f}" x2="{X(0):.1f}" y2="{Y(hi):.1f}" stroke="{NAVY}" stroke-width="1.6"/>')
        o.append(f'<line x1="{X(lo):.1f}" y1="{Y(0):.1f}" x2="{X(hi):.1f}" y2="{Y(0):.1f}" stroke="{NAVY}" stroke-width="1.6"/>')
    r = (q[0], p[1])
    o.append(f'<polyline points="{X(p[0]):.1f},{Y(p[1]):.1f} {X(r[0]):.1f},{Y(r[1]):.1f} {X(q[0]):.1f},{Y(q[1]):.1f}" fill="none" stroke="{BLUE}" stroke-width="2" stroke-dasharray="5 4"/>')
    o.append(f'<line x1="{X(p[0]):.1f}" y1="{Y(p[1]):.1f}" x2="{X(q[0]):.1f}" y2="{Y(q[1]):.1f}" stroke="{GOLD}" stroke-width="3"/>')
    for pt in (p, q):
        lab = f"({fnum(pt[0])}, {fnum(pt[1])})"
        o.append(f'<circle cx="{X(pt[0]):.1f}" cy="{Y(pt[1]):.1f}" r="4.5" fill="{NAVY}"/>')
        o.append(_t(X(pt[0]), Y(pt[1]) - 9 if pt[1] >= max(p[1], q[1]) else Y(pt[1]) + 19, lab, size=13))
    o.append('</svg>')
    return ''.join(o)


def isqrt_exact(n):
    r = math.isqrt(n); return r if r * r == n else None
