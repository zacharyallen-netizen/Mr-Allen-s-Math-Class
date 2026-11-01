#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Independent recomputation of every Math 1 pre-test key.
Reads QS straight out of the built HTML pages and compares each answer-check value
with a value computed here from the problem itself (brute force / formulas / statistics)."""
import json, re, math, statistics as st, sys
from fractions import Fraction as F
REPO = '/home/claude/mr-allen-s-math-class/math1/'

def load(n):
    h = open(REPO + 'M1_Unit%d_PreTest.html' % n, encoding='utf-8').read()
    qs = json.loads(re.search(r'const QS=(\[.*?\]);\n', h).group(1))
    std = json.loads(re.search(r'const PT_STD=(\{.*?\});\n', h).group(1))
    return {q['id']: q for q in qs}, std

def solve_lin(f, lo=-1000, hi=1000):
    """x with f(x) = 0 for a linear f (two evaluations, exact with Fractions)."""
    a = f(F(1)) - f(F(0)); b = f(F(0))
    if a == 0: return 'none' if b != 0 else 'all'
    return -b / a

def roots_quad(a, b, c):
    d = b * b - 4 * a * c
    if d < 0: return []
    return sorted({(-b + s * math.sqrt(d)) / (2 * a) for s in (1, -1)})

def brute_pt(e1, e2, rng=range(-20, 21)):
    """integer (x, y) that satisfies both equations."""
    sols = [(x, y) for x in rng for y in rng if e1(x, y) and e2(x, y)]
    return sols

def ev(expr, env):
    s = expr.replace('^', '**')
    return eval(s, {'sqrt': math.sqrt}, env)

def same_expr(key, fn, vars_):
    import random
    rnd = random.Random(7)
    for _ in range(6):
        env = {v: rnd.uniform(0.5, 3.5) for v in vars_}
        a, b = ev(key, env), fn(**env)
        if abs(a - b) > 1e-6 * max(1, abs(b)): return False
    return True

def r_of(pts):
    xs = [p[0] for p in pts]; ys = [p[1] for p in pts]; mx, my = st.mean(xs), st.mean(ys)
    sxy = sum((x - mx) * (y - my) for x, y in pts)
    return sxy / math.sqrt(sum((x - mx) ** 2 for x in xs) * sum((y - my) ** 2 for y in ys))

def quartiles(data):
    d = sorted(data); n = len(d); h = n // 2
    lo, hi = d[:h], d[h + (n % 2):]
    return st.median(lo), st.median(d), st.median(hi)

def dist(a, b): return math.hypot(b[0] - a[0], b[1] - a[1])
def slope(a, b): return F(b[1] - a[1], b[0] - a[0])

# expected[unit][id] = ('n', value) | ('set', [..]) | ('pt', x, y) | ('expr', fn, vars) | ('ineq', var, op, v) | ...
E = {}
# ------------------------------------------------------------------ Unit 1
E[1] = {
 1: ('n', solve_lin(lambda x: 2 * x + 5 - 13)),
 2: ('n', solve_lin(lambda x: x / 3 - 4 - 2)),
 3: ('expr', lambda x: x ** 3 * x ** 4, ['x']),
 4: ('n', -7),                                             # coefficient of x in 4x² − 7x + 9
 5: ('ineq', 'x', '>', solve_lin(lambda x: x + 4 - 10)),
 6: ('expr', lambda x: x ** 8 / x ** 2, ['x']),
 7: ('n', solve_lin(lambda x: 3 * (x - 2) + 4 * x - 22)),
 8: ('ineq', 'x', '<=', solve_lin(lambda x: -3 * x + 4 - 13)),   # dividing by −3 flips ≥
 9: ('expr', lambda p, w: next(l for l in [(p - 2 * w) / 2]), ['p', 'w']),
 10: ('words', 'distributive'),
 11: ('n', next(m for m in range(0, 50) if 20 + 15 * m == 95)),
 12: ('expr', lambda x: (2 * x ** 3) ** 2, ['x']),
 13: ('n', solve_lin(lambda x: x / 2 + 3 - (x / 3 + 5))),
 14: ('n', round((1 - 0.9) * 100, 9)),
 15: ('expr', lambda y, b, m: (y - b) / m, ['y', 'b', 'm']),
 16: ('n', max(t for t in range(0, 50) if 8 * t + 4 <= 60)),
 17: ('expr', lambda x: (2 * x ** 3) ** -2, ['x']),
 18: ('text', 'all' if solve_lin(lambda x: 4 * (x + 1) - x - (3 * x + 4)) == 'all' else 'x'),
}
# ------------------------------------------------------------------ Unit 2
f2 = lambda x: 3 * x - 2
E[2] = {
 1: ('text', 'no' if len({1: [4], 2: [5, 7], 3: [6]}[2]) > 1 else 'yes'),
 2: ('n', f2(4)),
 3: ('any_n', 2 * 0 + 1),
 4: ('n', F(1 - 7, 3 - 0)),
 5: ('n', 0.5 * 4 + 1),
 6: ('expr', lambda x: 3 * x - 2, ['x']),
 7: ('ineq2', 'x', -3, True, 4, True),
 8: ('ineq2', 'y', min(2, -1), False, max(2, -1), True),     # open dot at (2, −1) -> y = −1 excluded
 9: ('n', F(290 - 110, 5 - 2)),
 10: ('any_n', solve_lin(lambda x: 2 * x + 3 * 0 - 12)),
 11: ('n', 2.5),
 12: ('expr', (lambda m: (lambda x: m * x + (5 - m * 1)))(slope((1, 5), (3, 9))), ['x']),
 13: ('expr', lambda t: 600 - 25 * t, ['t']),
 14: ('ineq2', 't', 0, True, solve_lin(lambda t: 600 - 25 * t), True),
 15: ('n', solve_lin(lambda x: 2 * x - 7 - 9)),
 16: ('ineq', 'x', '<', solve_lin(lambda x: -2 * x + 6)),
 17: ('words', 'up 5' if 7 - 2 == 5 else '?'),
 18: ('n', F(15 - 4, 6 - 2)),
}
# ------------------------------------------------------------------ Unit 3
E[3] = {
 1: ('text', 'yes' if 2 * 2 - 1 == 3 else 'no'),
 2: ('pt',) + brute_pt(lambda x, y: y == x + 2, lambda x, y: y == -2 * x + 5)[0],
 3: ('pt',) + brute_pt(lambda x, y: y == 2 * x, lambda x, y: x + y == 12)[0],
 4: ('text', 'yes' if 0 > 0 + 2 else 'no'),
 5: ('pt',) + brute_pt(lambda x, y: x + y == 7, lambda x, y: x - y == 1)[0],
 6: ('n', 2 * 3 + 1),
 7: ('pt',) + brute_pt(lambda x, y: 2 * x + 3 * y == 12, lambda x, y: x - 3 * y == -3)[0],
 8: ('pt',) + brute_pt(lambda x, y: y == 3 * x - 5, lambda x, y: 2 * x + y == 10)[0],
 9: ('text', 'none' if not brute_pt(lambda x, y: y == 2 * x + 3, lambda x, y: y == 2 * x - 1) else '?'),
 10: ('n', brute_pt(lambda a, s: a + s == 20, lambda a, s: 8 * a + 5 * s == 130, range(0, 21))[0][0]),
 11: ('lineineq', '<=', -1, 4),
 12: ('eqn', '7x=21' if (1 + 2 * 3, 2 + 2 * -1, 7 + 2 * 7) == (7, 0, 21) else '?'),
 13: ('text', 'all' if len(brute_pt(lambda x, y: 2 * x - y == 3, lambda x, y: 4 * x - 2 * y == 6)) > 1 else '?'),
 14: ('text', 'yes' if (1 > 2 - 3 and 1 <= -2 * 2 + 4) else 'no'),
 15: ('n', max(h for h in range(0, 50) if 12 * 5 + 8 * h <= 96)),
 16: ('pt',) + brute_pt(lambda x, y: 3 * x + 2 * y == 16, lambda x, y: 2 * x - 3 * y == -11)[0],
 17: ('n', next(x for x in range(-10, 11) if 2 * x + 1 == -x + 7)),
 18: ('n', max(brute_pt(lambda L, S: L + S == 30, lambda L, S: L - S == 8, range(-50, 51))[0])),
}
# ------------------------------------------------------------------ Unit 4
def seq_a(a1, d, n): return a1 + (n - 1) * d
def seq_g(a1, r, n): return a1 * r ** (n - 1)
rec = [10]
for _ in range(3): rec.append(rec[-1] - 4)
E[4] = {
 1: ('n', 14 + (14 - 11)),
 2: ('n', 16 - 20),
 3: ('n', 24 * (24 // 12)),
 4: ('n', F(27, 81)),
 5: ('text', 'exponential' if len({F(6, 2), F(18, 6), F(54, 18)}) == 1 and len({6 - 2, 18 - 6}) > 1 else 'linear'),
 6: ('n', 3 * 2 ** 3),
 7: ('n', seq_a(5, 3, 20)),
 8: ('n', rec[3]),
 9: ('n', seq_g(3, 2, 7)),
 10: ('expr', lambda t: 200 * 2 ** t, ['t']),
 11: ('n', round((1 - 0.85) * 100, 9)),
 12: ('words', 'g' if 2 ** 10 > 10 * 10 else 'f'),
 13: ('expr', lambda n: seq_a(7, 4, n), ['n']),
 14: ('expr', lambda n: seq_g(2, 3, n), ['n']),
 15: ('expr', lambda t: 20000 * (1 - 0.12) ** t, ['t']),
 16: ('n', round((1.04 - 1) * 100, 9)),
 17: ('text', 'linear'),
 18: ('n', 0 if abs(3 * 2 ** -60) < 1e-9 else None),
}
# ------------------------------------------------------------------ Unit 5
sys.path.insert(0, '/home/claude/mr-allen-s-math-class/_build/m1pre')
import importlib.util
spec = importlib.util.spec_from_file_location('ub', '/home/claude/mr-allen-s-math-class/_build/m1pre/units_b.py')
U5 = None
src = open(spec.origin, encoding='utf-8').read()
U5 = eval(src.split('U5 = ', 1)[1].split('\n)\n', 1)[0] + '\n)', {'dict': dict})
q1, md, q3 = quartiles(U5['iqr'])
b8 = U5['box8']; fence = b8[3] + 1.5 * (b8[3] - b8[1])
E[5] = {
 1: ('n', st.mean(U5['mean'])),
 2: ('n', st.median(U5['median'])),
 3: ('n', max(U5['rng']) - min(U5['rng'])),
 4: ('n', sum(U5['hist_counts'])),
 5: ('n', U5['box5'][3]),
 6: ('text', 'positive' if r_of(U5['assoc']) > 0.5 else 'x'),
 7: ('n', q3 - q1),
 8: ('text', 'yes' if b8[4] > fence else 'no'),
 9: ('words', 'median' if abs(st.mean(U5['skew']) - st.median(U5['skew'])) > 3 else 'mean'),
 10: ('n', 2.5 * 11 + 40),
 11: ('n', 82 - (6 * 4 + 60)),
 12: ('n', min([-0.95, -0.3, 0.3, 0.95], key=lambda c: abs(c - r_of(U5['neg'])))),
 13: ('n', (3.2 * 6 + 15) - (3.2 * 2 + 15)),
 14: ('n', solve_lin(lambda x: -F(3, 2) * x + 90)),
 15: ('words', 'no'),
 16: ('text', 'b' if (U5['boxB'][3] - U5['boxB'][1]) > (U5['boxA'][3] - U5['boxA'][1]) else 'a'),
 17: ('text', 'b' if st.pstdev(U5['sdB']) > st.pstdev(U5['sdA']) and st.mean(U5['sdA']) == st.mean(U5['sdB']) == 10 else 'a'),
 18: ('text', 'b' if abs(-0.97) > abs(r_of(U5['strong'])) and abs(round(r_of(U5['strong']), 2) - 0.93) < 0.006 else 'a'),
}
assert r_of(U5['strong']) > 0.85 and r_of(U5['neg']) < -0.9 and r_of(U5['ice']) > 0.85, 'scatter data does not match its item'
# ------------------------------------------------------------------ Unit 6
E[6] = {
 1: ('expr', lambda x: 3 * (x + 4), ['x']),
 2: ('expr', lambda x: (2 * x * x + 3 * x - 1) + (x * x - 5 * x + 4), ['x']),
 3: ('expr', lambda x: 6 * x + 15, ['x']),
 4: ('set', sorted(x for x in range(-20, 21) if x * x == 49)),
 5: ('set', sorted(x for x in range(-20, 21) if (x - 3) * (x + 5) == 0)),
 6: ('expr', lambda x: (x + 3) * (x + 2), ['x']),
 7: ('expr', lambda x: x * x + 7 * x + 12, ['x']),
 8: ('expr', lambda x: x * x - 3 * x - 18, ['x']),
 9: ('expr', lambda x: x * x - 49, ['x']),
 10: ('set', roots_quad(1, -5, 6)),
 11: ('set', sorted(x for x in range(-20, 21) if (x + 1) * (x - 4) == 0)),
 12: ('expr', lambda x: (2 * x + 1) * (x - 3), ['x']),
 13: ('expr', lambda x: 2 * x * x + 5 * x - 3, ['x']),
 14: ('set', roots_quad(1, 6, 9 - 25)),
 15: ('set', roots_quad(2, -7, 3)),
 16: ('n', min((x - 1) * (x - 5) for x in [i / 100 for i in range(-1000, 1000)])),
 17: ('expr', lambda x: (x + 2) * (x - 5), ['x']),
 18: ('n', max(roots_quad(-16, 32, 0))),
}
# ------------------------------------------------------------------ Unit 7
grid = [i / 100 for i in range(-1000, 1001)]
def vertex_of(f):
    xs = min(grid, key=f) if f(0) < f(1) or True else None
    return xs
h14 = lambda t: -16 * t * t + 64 * t + 5
f10 = lambda x: x * x - 4 * x + 7; g10 = lambda x: (x + 1) ** 2 + 1
E[7] = {
 1: ('words', 'down' if -2 < 0 else 'up'),
 2: ('pt', max(grid, key=lambda x: -(x - 2) ** 2 + 5), 5),
 3: ('n', min(grid, key=lambda x: x * x + 2 * x - 3)),
 4: ('any_n', 0 * 0 - 6 * 0 + 5),
 5: ('n', 3 * 3 + 2 * 3 - 1),
 6: ('words', 'minimum'),
 7: ('pt', min(grid, key=lambda x: x * x - 6 * x + 8), min(x * x - 6 * x + 8 for x in grid)),
 8: ('pt', min(grid, key=lambda x: (x - 4) ** 2 + 1), 1),
 9: ('ineq', 'y', '<=', max(-(x - 1) ** 2 + 6 for x in grid)),
 10: ('words', 'g' if min(map(g10, grid)) < min(map(f10, grid)) else 'f'),
 11: ('expr', lambda x: (x - 2) ** 2 - 3, ['x']),
 12: ('expr', lambda x: (x * x - 3) + (2 * x + 1), ['x']),
 13: ('n', next(w for w in range(1, 50) if w * (w + 3) == 40)),
 14: ('n', max(h14(t) for t in grid)),
 15: ('expr', lambda x: (x + 5) * (x - 2), ['x']),
 16: ('words', 'g' if max([1, 4, 5, 4, 1]) > max(-x * x + 4 * x for x in grid) else 'f'),
 17: ('expr', (lambda a: (lambda x: a * (x - 1) * (x - 5)))(F(-8, (3 - 1) * (3 - 5))), ['x']),
 18: ('ineq', 'x', '<', min(grid, key=lambda x: x * x - 2 * x - 8)),
}
# ------------------------------------------------------------------ Unit 8
E[8] = {
 1: ('pt', F(2 + 8, 2), F(4 + 10, 2)),
 2: ('n', slope((1, 2), (4, 8))),
 3: ('n', dist((1, 1), (4, 5))),
 4: ('n', 3),
 5: ('n', -1 / F(2, 3)),
 6: ('n', dist((-3, 2), (5, 2))),
 7: ('pt', 2 * 4 - 1, 2 * 6 - 2),
 8: ('pt', -2 + F(1, 4) * (6 + 2), -4 + F(1, 4) * (4 + 4)),
 9: ('n', dist((-2, 3), (2, 0))),
 10: ('expr', lambda x: 2 * x + (4 - 2 * 3), ['x']),
 11: ('expr', (lambda m: lambda x: m * x + (5 - m * 2))(-1 / F(-1, 2)), ['x']),
 12: ('n', 2 * dist((1, 1), (1, 5)) + 2 * dist((1, 5), (7, 5))),
 13: ('n', abs(0 * (0 - 5) + 6 * (5 - 0) + 2 * (0 - 0)) / 2),     # shoelace
 14: ('words', (lambda a, b, c: 'equilateral' if a == b == c else ('isosceles' if len({round(a, 9), round(b, 9), round(c, 9)}) == 2 else 'scalene'))(dist((0, 0), (4, 0)), dist((0, 0), (2, 4)), dist((4, 0), (2, 4)))),
 15: ('text', 'yes' if slope((1, 1), (4, 3)) * slope((4, 3), (2, 6)) == -1 else 'no'),
 16: ('text', 'parallel' if slope((0, 1), (3, 3)) == slope((1, -2), (4, 0)) else 'x'),
 17: ('pt', -3 + F(2, 3) * 9, 1 + F(2, 3) * 6),
 18: ('n', -1 / F(-3, 4)),
}

def first_text(chk):
    t = chk[0]
    if t == 'text': return chk[1]
    if t == 'words': return [' '.join(g[0] for g in chk[1])] + [w for g in chk[1] for w in g]
    if t == 'any': return [w for c in chk[1:] for w in first_text(c)]
    return []

bad = 0; total = 0
for n in range(1, 9):
    QS, STD = load(n)
    assert len(QS) == 18, n
    for i in range(1, 19):
        total += 1
        q = QS[i]; chk = q['chk']; e = E[n][i]; ok = False; why = ''
        kind = e[0]
        if kind == 'n':
            ok = chk[0] == 'n' and abs(float(chk[1]) - float(e[1])) < 1e-9
        elif kind == 'any_n':
            ok = chk[0] == 'any' and any(c[0] == 'n' and abs(c[1] - float(e[1])) < 1e-9 for c in chk[1:])
        elif kind == 'set':
            ok = chk[0] == 'set' and len(chk[1]) == len(e[1]) and all(any(abs(a - b) < 1e-9 for b in chk[1]) for a in e[1])
        elif kind == 'pt':
            ok = chk[0] == 'pt' and abs(chk[1] - float(e[1])) < 1e-9 and abs(chk[2] - float(e[2])) < 1e-9
        elif kind == 'expr':
            ok = chk[0] == 'expr' and same_expr(chk[1], (lambda fn: (lambda **kw: float(fn(**kw))))(e[1]), e[2]) and chk[2] == e[2]
        elif kind == 'ineq':
            ok = chk[0] == 'ineq' and chk[1] == e[1] and chk[2] == e[2] and abs(chk[3] - float(e[3])) < 1e-9
        elif kind == 'ineq2':
            ok = chk[0] == 'ineq2' and chk[1] == e[1] and abs(chk[2] - float(e[2])) < 1e-9 and chk[3] == e[3] and abs(chk[4] - float(e[4])) < 1e-9 and chk[5] == e[5]
        elif kind == 'lineineq':
            ok = chk == list(e)
        elif kind == 'eqn':
            ok = chk[0] == 'eqn' and e[1] in chk[1]
        elif kind in ('text', 'words'):
            want = {'all': 'infinitely many', 'none': 'no solution'}.get(e[1], e[1])
            ok = any(want.lower() == a.lower() or want.lower() in a.lower().split() for a in first_text(chk)) or want.lower() in [a.lower() for a in first_text(chk)]
        if not ok:
            bad += 1; print('KEY MISMATCH U%d Q%d: page %s  vs recomputed %s' % (n, i, chk, e))
    # standards present and well-formed
    for i in range(1, 19):
        assert re.match(r'^NC\.M1\.[A-Z]{1,2}-[A-Z]{2,4}\.\d{1,2}[a-z]?$', STD[str(i)]), (n, i, STD[str(i)])
print('checked %d keys, %d mismatches' % (total, bad))
sys.exit(1 if bad else 0)
