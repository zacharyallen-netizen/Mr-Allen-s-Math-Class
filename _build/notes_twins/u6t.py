"""Unit 6 tables & systems notes (unit6-notes-tables-systems.html). Every line, point and solution is checked here."""
from twinlib import *

T = {}


def L(m, b): return lambda x: F(m) * x + b


def xy_table(rows, cols=('x', 'y'), cls='xy-table'):
    return f'<table class="{cls}"><tr>' + ''.join(f'<th>{c}</th>' for c in cols) + '</tr>' + ''.join('<tr>' + ''.join(f'<td>{fnum(v)}</td>' for v in r) + '</tr>' for r in rows) + '</table>'


def lin(m, b, x='x'):
    return 'y = ' + fmt_lin(Lin(m, b), x)


def plane(lines, pts=(), rng=6, every=None, alt='graph', size=228):
    s = {"type": "plane", "xmin": -rng if isinstance(rng, int) else rng[0], "xmax": rng if isinstance(rng, int) else rng[1],
         "ymin": -rng if isinstance(rng, int) else rng[2], "ymax": rng if isinstance(rng, int) else rng[3], "size": size,
         "lines": [{"m": float(m), "b": float(b), "c": c} for m, b, c in lines], "alt": alt}
    if every: s["labelEvery"] = every
    if pts: s["points"] = [dict(p) for p in pts]
    return f"<div class=\"graph-wrap\"><div class=\"pfig\" style=\"margin:0 auto\" data-geo='{json.dumps(s, ensure_ascii=False)}'></div>"


def legend(a, b): return f'<div class="pfig-legend"><span><i style="border-top:3px solid #1E2D4F"></i>{a}</span><span><i style="border-top:3px solid #B45309"></i>{b}</span></div></div>'


def sys_eqs(e1, e2): return f'<div class="system-eqs"><div class="eq-line"><span class="eq-tag">EQ 1</span><span>{e1}</span></div><div class="eq-line"><span class="eq-tag">EQ 2</span><span>{e2}</span></div></div>'


def meet(m1, b1, m2, b2):
    x = F(b2 - b1, 1) / (F(m1) - F(m2)); return x, F(m1) * x + b1


def pair_ans(p): return f"({plain(p[0])},{plain(p[1])})|{plain(p[0])},{plain(p[1])}", f"({fnum(p[0])}, {fnum(p[1])})"


def eq_ans(m, b):
    t = fmt_lin(Lin(m, b)).replace(M, '-').replace(' ', '')
    alt = (plain(b) + ('+' if m > 0 else '-') + (str(abs(m)) if abs(m) != 1 else '') + 'x').replace('+-', '-')
    return f"y={t}|{t}|y={alt}|{alt}", lin(m, b)


# 1. tables
rows = [(x, 3 * x + 4) for x in range(4)]
T['np1-1'] = {'p': 'What is the slope <strong>m</strong> of this table? Type just the number.', 'fig': xy_table(rows), 'a': '3', 'show': '3',
              'sol': 'Each time x goes up 1, y goes up 3 (4 → 7 → 10 → 13). So m = 3 ÷ 1 = 3.'}
rows = [(x, -3 * x + 8) for x in range(4)]; a, s = eq_ans(-3, 8); assert a.split('|')[0] == 'y=-3x+8' and 'y=8-3x' in a
T['np1-2'] = {'p': 'Write the equation for this table in the form y = mx + b.', 'fig': xy_table(rows), 'a': a, 'show': s, 'ph': 'y = mx + b',
              'sol': 'Slope: y changes by −3 each time x goes up 1, so m = −3. When x = 0, y = 8, so b = 8. Equation: y = −3x + 8.'}
rows = [(x, 2 * x - 7) for x in (2, 4, 6, 8)]; assert rows[0] == (2, -3)
T['np1-3'] = {'p': 'This table has no x = 0 row. Find <strong>b</strong>, the y-intercept. Type just the number.', 'fig': xy_table(rows), 'a': '-7', 'show': 'b = −7',
              'sol': 'm: y goes up 4 when x goes up 2, so m = 4 ÷ 2 = 2. Work backward from (2, −3): x goes back 2 to 0, so y drops 2 × 2 = 4. −3 − 4 = −7. Equation: y = 2x − 7.'}
# 2. graphs
p = meet(1, 2, -2, -4); assert p == (-2, 0)
a, s = pair_ans(p)
T['np2-1'] = {'p': 'Where do the two lines cross? Type the ordered pair, like (2, 3).', 'fig': plane([(1, 2, 'navy'), (-2, -4, 'gold')], alt='y = x + 2 and y = −2x − 4') + legend('y = x + 2', 'y = −2x − 4'),
              'a': a, 'show': s, 'ph': '(x, y)', 'sol': 'The lines cross at (−2, 0). Check: −2 + 2 = 0 ✓ and −2(−2) − 4 = 0 ✓.'}
p = meet(3, -2, -1, 6); assert p == (2, 4)
a, s = pair_ans(p)
T['np2-2'] = {'p': 'Graph both lines on the grid. Where do they cross? Type the ordered pair.', 'fig': plane([], alt='empty grid for graphing y = 3x − 2 and y = −x + 6') + legend('y = 3x − 2', 'y = −x + 6'),
              'a': a, 'show': s, 'ph': '(x, y)', 'sol': 'y = 3x − 2: start at (0, −2), then up 3, right 1. y = −x + 6: start at (0, 6), then down 1, right 1. They cross at (2, 4). Check: 3(2) − 2 = 4 ✓ and −2 + 6 = 4 ✓.'}
T['np2-3'] = {'p': 'Which system has <strong>infinitely many solutions</strong>?', 'choices': ['y = 3x + 2 and y = 3x − 1', 'y = 2x + 4 and y = 2x + 4', 'y = x − 2 and y = −x − 2'], 'a': 'y = 2x + 4 and y = 2x + 4',
              'sol': 'First: same slope 3, different y-intercepts → parallel → no solution. Second: the same line twice → infinitely many. Third: slopes 1 and −1 are different → one solution.'}
# 3. checking solutions
assert 2 * 4 - 1 == 7
T['np3-1'] = {'p': 'Does the point <strong>(4, 7)</strong> make <strong>y = 2x − 1</strong> true?', 'choices': ['Yes', 'No'], 'a': 'Yes',
              'fig': '<div class="pfig" style="margin:0 auto" data-fig=\'{"type":"machine","lab":"put in x = 4","inp":"x = 4","rule":"2x − 1","out":"y = ?","cmp":"is it 7?","alt":"Put x = 4 into 2x − 1. Is the output 7?"}\'></div>',
              'sol': '2(4) − 1 = 8 − 1 = 7. That matches y = 7, so yes ✓.'}
assert 3 * 2 - 4 == 2 and -2 + 6 != 2
T['np3-2'] = {'p': 'Is <strong>(2, 2)</strong> a solution of this system?', 'choices': ['Yes', 'No'], 'a': 'No', 'fig': sys_eqs('y = 3x − 4', 'y = −x + 6') +
              plane([(3, -4, 'navy'), (-1, 6, 'gold')], [{"x": 2, "y": 2, "c": "red", "r": 6, "label": "(2, 2)", "pos": "nw"}], (-1, 6, -3, 7), alt='y = 3x − 4 and y = −x + 6 with the point (2, 2)') + legend('y = 3x − 4', 'y = −x + 6'),
              'sol': 'EQ 1: 3(2) − 4 = 2 ✓ true. EQ 2: −(2) + 6 = 4, but y is 2 ✗. It fails EQ 2, so no, (2, 2) is not a solution.'}
ch = [(1, 4), (2, 5), (4, 7), (5, 8)]
assert all(y == x + 3 for x, y in ch) and [p for p in ch if p[1] == 2 * p[0] + 1] == [(2, 5)]
T['np3-3'] = {'p': 'Which point is the solution of this system?', 'choices': ['(1, 4)', '(2, 5)', '(4, 7)', '(5, 8)'], 'a': '(2, 5)', 'fig': sys_eqs('y = x + 3', 'y = 2x + 1'),
              'sol': 'All four points work in EQ 1. Now test EQ 2: 2(1) + 1 = 3 ✗, 2(2) + 1 = 5 ✓, 2(4) + 1 = 9 ✗, 2(5) + 1 = 11 ✗. Only (2, 5) works in both.'}
# 4. substitution
assert solve('x + 3x = 20') == 5
T['np4-1'] = {'p': 'Solve for x. Type just the x-value.', 'fig': sys_eqs('y = 3x', 'x + y = 20'), 'a': '5', 'show': 'x = 5',
              'sol': 'Put 3x in place of y: x + 3x = 20 → 4x = 20 → x = 5. (Then y = 3(5) = 15.)'}
p = meet(5, -4, 2, 5); assert p == (3, 11); a, s = pair_ans(p)
T['np4-2'] = {'p': 'Solve by substitution. Type the ordered pair (x, y).', 'fig': sys_eqs('y = 5x − 4', 'y = 2x + 5'), 'a': a, 'show': s, 'ph': '(x, y)',
              'sol': '5x − 4 = 2x + 5 → 3x − 4 = 5 → 3x = 9 → x = 3. Then y = 2(3) + 5 = 11. Solution: (3, 11). Check EQ 1: 5(3) − 4 = 11 ✓'}
x = solve('4x + 15 = 7x + 3'); assert x == 4 and 4 * 4 + 15 == 31
T['np4-3'] = {'p': 'Pool A costs y = 4x + 15 dollars and Pool B costs y = 7x + 3 dollars for x visits. After how many visits do they cost the same?', 'a': '4', 'show': '4 visits',
              'fig': xy_table([(v, 4 * v + 15, 7 * v + 3) for v in range(3)] , ('x', 'Pool A ($)', 'Pool B ($)'), 'xy-table gym-t'),
              'sol': '4x + 15 = 7x + 3 → 15 = 3x + 3 → 12 = 3x → x = 4. After 4 visits both cost 4(4) + 15 = $31.'}
# 5. comprehensive
T['np5-1'] = {'p': 'In <strong>y = −4x + 9</strong>, what is b, the y-intercept? Type just the number.', 'a': '9', 'show': 'b = 9', 'sol': 'y = mx + b. Here m = −4 and b = 9.'}
rows = [(x, 2 * x + 3) for x in (0, 3, 6, 9)]; a, s = eq_ans(2, 3)
T['np5-2'] = {'p': 'Write the equation for this table in the form y = mx + b.', 'fig': xy_table(rows), 'a': a, 'show': s, 'ph': 'y = mx + b',
              'sol': 'When x goes up 3, y goes up 6, so m = 6 ÷ 3 = 2. When x = 0, y = 3, so b = 3. Equation: y = 2x + 3.'}
T['np5-3'] = {'p': 'Two lines are the same line (one on top of the other). How many solutions does the system have?', 'choices': ['One solution', 'No solution', 'Infinitely many solutions'], 'a': 'Infinitely many solutions',
              'sol': 'The same line touches itself at every point, so there are infinitely many solutions.'}
p = meet(1, -3, -2, 3); assert p == (2, -1); a, s = pair_ans(p)
T['np5-4'] = {'p': 'Where do the two lines cross? Type the ordered pair.', 'fig': plane([(1, -3, 'navy'), (-2, 3, 'gold')], alt='y = x − 3 and y = −2x + 3') + legend('y = x − 3', 'y = −2x + 3'), 'a': a, 'show': s, 'ph': '(x, y)',
              'sol': 'The lines cross at (2, −1). Check: 2 − 3 = −1 ✓ and −2(2) + 3 = −1 ✓.'}
assert 3 * -2 + 7 == 1 and -2 + 3 == 1
T['np5-5'] = {'p': 'Is <strong>(−2, 1)</strong> a solution of this system?', 'choices': ['Yes', 'No'], 'a': 'Yes', 'fig': sys_eqs('y = 3x + 7', 'y = x + 3'),
              'sol': 'EQ 1: 3(−2) + 7 = −6 + 7 = 1 ✓. EQ 2: −2 + 3 = 1 ✓. Both true, so yes.'}
assert 2 * 1 + 3 == 5 and 3 * 1 + 3 == 6 + 0 and 4 * 1 + 1 == 5
T['np5-6'] = {'p': 'Lee says (1, 5) is a solution of y = 2x + 3 and y = 3x + 3, because it works in the first equation. Is Lee right?', 'choices': ['Yes, one true equation is enough', 'No, it must make both equations true'],
              'a': 'No, it must make both equations true', 'sol': 'EQ 1: 2(1) + 3 = 5 ✓. EQ 2: 3(1) + 3 = 6, not 5 ✗. A solution must work in both equations, so Lee is wrong.'}
assert solve('x + 4x = 15') == 3
T['np5-7'] = {'p': 'Solve for x. Type just the x-value.', 'fig': sys_eqs('y = 4x', 'x + y = 15'), 'a': '3', 'show': 'x = 3', 'sol': 'x + 4x = 15 → 5x = 15 → x = 3. (Then y = 4(3) = 12.)'}
p = meet(1, 5, 2, 1); assert p == (4, 9); a, s = pair_ans(p)
T['np5-8'] = {'p': 'Solve by substitution. Type the ordered pair (x, y).', 'fig': sys_eqs('y = x + 5', 'y = 2x + 1'), 'a': a, 'show': s, 'ph': '(x, y)',
              'sol': 'x + 5 = 2x + 1 → 5 − 1 = 2x − x → 4 = x. y = 4 + 5 = 9. Solution: (4, 9). Check: 2(4) + 1 = 9 ✓'}
# x − y = 2 → y = x − 2;  3x + y = 14 → y = −3x + 14
p = meet(1, -2, -3, 14); assert p == (4, 2) and 4 - 2 == 2 and 3 * 4 + 2 == 14; a, s = pair_ans(p)
T['np5-9'] = {'p': 'Neither equation is solved for y. Solve the system and type the ordered pair.', 'fig': sys_eqs('x − y = 2', '3x + y = 14'), 'a': a, 'show': s, 'ph': '(x, y)',
              'sol': 'Solve EQ 1 for y: y = x − 2. Substitute: 3x + (x − 2) = 14 → 4x − 2 = 14 → 4x = 16 → x = 4. y = 4 − 2 = 2. Solution: (4, 2). Check EQ 2: 3(4) + 2 = 14 ✓'}
assert F(5 - 2, 1 - 0) == 3
T['np5-10'] = {'p': 'Line A is y = 3x − 4. Line B goes through (0, 2) and (1, 5). How many solutions does the system have?', 'choices': ['One solution', 'No solution', 'Infinitely many solutions'], 'a': 'No solution',
               'fig': plane([(3, -4, 'navy')], [{"x": 0, "y": 2, "c": "gold", "label": "(0, 2)", "pos": "w"}, {"x": 1, "y": 5, "c": "gold", "label": "(1, 5)", "pos": "e"}], alt='Line A, y = 3x − 4, and the two points of Line B') + legend('Line A: y = 3x − 4', 'Line B: through the 2 points'),
               'sol': 'Line B: slope = (5 − 2) ÷ (1 − 0) = 3, and b = 2, so y = 3x + 2. Same slope as Line A (3), different y-intercepts (−4 and 2) → parallel → no solution.'}
