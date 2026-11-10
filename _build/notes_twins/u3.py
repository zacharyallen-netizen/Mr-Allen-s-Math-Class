"""Unit 3 notes (unit3-notes.html): equations and inequalities. Twin = same skill, new numbers."""
from twinlib import *

T = {}


def br(lines): return '<br>'.join(lines)


def np_eq(id, eq, prompt=None, sol=None):
    v = solve(eq); assert isinstance(v, F), (id, eq, v)
    T[id] = {'p': prompt or 'Solve: ' + eq_html(eq), 'a': plain(v), 'show': fnum(v), 'sol': sol or br(steps(eq))}
    return v


def np_ineq(id, eq, prompt=None, sol=None):
    op, v = solve(eq)
    T[id] = {'p': prompt or f'Solve: {eq}. <span class="np-type">Tap the buttons for &lt; &gt; ≤ ≥, or type x&lt;=4.</span>',
             'a': '|'.join(ineq_answers(op, v)), 'show': ineq_show(op, v), 'ineq': True, 'ph': 'like x<=4',
             'sol': sol or br(steps(eq))}
    return op, v


def np_many(id, eq, prompt=None):
    st = steps(eq)
    if how_many(eq) == 'One solution': st.append(f"The x's did NOT cancel → One solution (x = {fnum(solve(eq))}).")
    T[id] = {'p': prompt or f'How many solutions does {eq} have?', 'choices': HOW_MANY, 'a': how_many(eq), 'sol': br(st)}


# Section 1 — one-step
np_eq('np1-1', 'x + 8 = 19')
np_eq('np1-2', 'x/4 = −5')
assert 2 - 9 == -7
T['np1-3'] = {'p': 'Kai solved x − 9 = <b>?</b> and got x = 2. What number is the <b>?</b>', 'a': '-7', 'show': '−7',
              'sol': 'Put x = 2 back into the left side.<br>2 − 9 = −7<br>So the equation was x − 9 = −7.'}
# Section 2 — two-step
np_eq('np2-1', '4x + 3 = 27')
np_eq('np2-2', '−5x + 2 = 22')
assert (14 + 7) / 3 == 7
T['np2-3'] = {'p': 'Ana solved 3x − 7 = 14 and wrote 3x = 7, so x = 7/3. Find her mistake. What is the correct answer?', 'a': '7', 'show': '7',
              'sol': 'Ana subtracted 7. To undo − 7 you must ADD 7.<br>3x − 7 + 7 = 14 + 7 → 3x = 21<br>Divide by 3: x = 7'}
# Section 3 — distributive
np_eq('np3-1', '4(x + 3) = 28')
np_eq('np3-2', '−3(x − 4) = 27')
np_eq('np3-3', '4(x − 2) − x = 13')
# Section 4 — both sides
np_eq('np4-1', '5x + 2 = x + 18')
np_eq('np4-2', '3x + 8 = 7x − 16')
v = solve('30 + 4x = 6x'); assert v == 15
T['np4-3'] = {'p': 'Gym A costs $30 plus $4 per visit. Gym B costs $6 per visit. After how many visits do they cost the same? Type just the number.',
              'a': '15', 'show': '15', 'sol': 'Let x = number of visits.<br>30 + 4x = 6x<br>Subtract 6x: 30 − 2x = 0 → −2x = −30<br>Divide by −2: x = 15 visits'}
# Section 5 — multi-step
np_eq('np5-1', '3(x + 2) + 2x = 31')
np_eq('np5-2', '4(x − 1) = x + 11')
np_eq('np5-3', '5(x + 1) − 3x = 2(x − 3) + x + 14')
# Section 6 — special cases
T['np6-1'] = {'p': "You solve an equation. The x's cancel and you get 6 = 6. How many solutions?", 'choices': HOW_MANY,
              'a': 'Infinitely many solutions', 'sol': '6 = 6 is TRUE. A true statement means every number works → Infinitely many solutions.'}
np_many('np6-2', '4(x + 3) = 4x + 12'); assert how_many('4(x + 3) = 4x + 12') == 'Infinitely many solutions'
np_many('np6-3', '5x − 2 = 3x − 2'); assert how_many('5x − 2 = 3x − 2') == 'One solution'
assert how_many('3(x − 4) = 3x − 12') == 'Infinitely many solutions'
T['np6-4'] = {'p': 'What number goes in the box so 3(x − 4) = 3x − ☐ has infinitely many solutions? Type just the number.', 'a': '12', 'show': '12',
              'sol': 'Distribute: 3(x − 4) = 3x − 12.<br>For a TRUE statement, both sides must be the same: 3x − 12 = 3x − 12. The box is 12.'}
# Section 7 — inequalities
np_ineq('np7-1', 'x + 4 ≥ 9')
T['np7-2'] = {'p': 'What inequality does this number line show? <span class="np-type">Tap the buttons for &lt; &gt; ≤ ≥, or type x&lt;=4.</span>',
              'fig': '<div class="eqfig sm"><div data-eq=\'{"type":"nline","min":-1,"max":5,"at":3,"open":true,"dir":"L","c":"blue","alt":"number line: open circle at 3, shaded to the left"}\'></div></div>',
              'a': '|'.join(ineq_answers('<', 3)), 'show': 'x < 3', 'ineq': True, 'ph': 'like x>3',
              'sol': 'Open circle at 3 → 3 is NOT included. Shaded left → less. x < 3'}
np_ineq('np7-3', '−3x + 2 > 14')
op, v = solve('−4x ≤ 24'); assert (op, v) == ('≥', -6)
T['np7-4'] = {'p': 'Rae solved −4x ≤ 24 and got x ≤ −6. Find her mistake. What is the correct answer? <span class="np-type">Tap the buttons for &lt; &gt; ≤ ≥, or type x&lt;=4.</span>',
              'a': '|'.join(ineq_answers(op, v)), 'show': ineq_show(op, v), 'ineq': True, 'ph': 'like x<=4',
              'sol': 'Rae divided by −4 but forgot to FLIP the sign.<br>−4x ≤ 24 → divide by −4 and flip → x ≥ −6'}
# Section 8 — word problems
assert 63 / 9 == 7
T['np8-1'] = {'p': 'Books cost $9 each. Leo spent $63. How many books did he buy? Type just the number.', 'a': '7', 'show': '7',
              'sol': 'Let x = number of books.<br>9x = 63<br>Divide by 9: x = 7 books'}
assert solve('3x + 4 = 19') == 5
T['np8-2'] = {'p': 'Which equation matches: “Three times a number, increased by 4, is 19”?',
              'choices': ['3x + 4 = 19', '3(x + 4) = 19', '4x + 3 = 19', '3x − 4 = 19'], 'a': '3x + 4 = 19',
              'sol': 'Three times a number → 3x. Increased by 4 → 3x + 4. Is 19 → = 19. So 3x + 4 = 19 (and x = 5).'}
assert solve('40 + 25x = 190') == 6
T['np8-3'] = {'p': 'A tutor charges $40 plus $25 per hour. The bill was $190. How many hours did the tutor work? Type just the number.', 'a': '6', 'show': '6',
              'sol': 'Let x = hours.<br>40 + 25x = 190<br>Subtract 40: 25x = 150<br>Divide by 25: x = 6 hours'}
op, v = solve('5 + 3x ≤ 30'); assert (op, v) == ('≤', F(25, 3)) and math.floor(v) == 8
T['np8-4'] = {'p': 'Sam has $30. There is a $5 fee, and each ride ticket costs $3. What is the greatest number of tickets Sam can buy? Type just the number.',
              'a': '8', 'show': '8', 'sol': 'Let x = tickets. “Has $30” means the cost is at most 30.<br>5 + 3x ≤ 30<br>Subtract 5: 3x ≤ 25<br>Divide by 3: x ≤ 8 1/3<br>You can\'t buy part of a ticket, so the greatest number is 8.'}
# Comprehensive practice (np9)
np_eq('np9-1', 'x − 5 = −1', prompt='Section 1 · Solve: x − 5 = −1')
np_eq('np9-2', '4x − 3 = 25', prompt='Section 2 · Solve: 4x − 3 = 25')
T['np9-3'] = {'p': 'Section 7 · Which inequality means “x is at least 8”?', 'choices': ['x ≥ 8', 'x > 8', 'x ≤ 8', 'x < 8'], 'a': 'x ≥ 8',
              'sol': 'At least 8 → 8 is allowed, and anything more → x ≥ 8.'}
np_eq('np9-4', '−2(x + 5) = 4', prompt='Section 3 · Solve: −2(x + 5) = 4')
np_eq('np9-5', '7x − 4 = 3x + 20', prompt='Section 4 · Solve: 7x − 4 = 3x + 20')
np_many('np9-6', '2(3x + 1) = 6x − 2', prompt='Section 6 · How many solutions does 2(3x + 1) = 6x − 2 have?')
assert how_many('2(3x + 1) = 6x − 2') == 'No solution'
np_ineq('np9-7', '10 − 2x ≥ 16', prompt='Section 7 · Solve: 10 − 2x ≥ 16. <span class="np-type">Tap the buttons for &lt; &gt; ≤ ≥, or type x&lt;=4.</span>')
np_eq('np9-8', '3(2x − 2) + 5 = 2(x + 3) + 1', prompt='Section 5 · Solve: 3(2x − 2) + 5 = 2(x + 3) + 1')
assert solve('4x + 6 = −18') == -6
T['np9-9'] = {'p': 'Section 8 · The sum of four times a number and 6 is −18. What is the number?', 'a': '-6', 'show': '−6',
              'sol': '4x + 6 = −18<br>Subtract 6: 4x = −24<br>Divide by 4: x = −6'}
assert solve('12 + 5x = 60 − 3x') == 6 and 12 + 30 == 60 - 18
T['np9-10'] = {'p': 'Section 8 · Mia has 12 shells and finds 5 more each day. Tom has 60 shells and gives away 3 each day. After how many days do they have the same number? Type just the number.',
               'a': '6', 'show': '6', 'sol': 'Let x = days.<br>12 + 5x = 60 − 3x<br>Add 3x: 12 + 8x = 60<br>Subtract 12: 8x = 48<br>Divide by 8: x = 6 days (both have 42 shells)'}

# Quick check (multiple choice)
T['chk36a'] = {'p': '<span class="badge">MC</span> Solving an equation gives 4 = −4. The equation has…', 'choices': HOW_MANY, 'a': 'No solution',
               'why': 'The variables cancelled and a FALSE statement remains → no solution.'}


# Part 2 practice (typed, checked by the page's own chkVal)
def pv(id, label, eq):
    v = solve(eq)
    if isinstance(v, tuple):
        op, n = v
        a = [f"x{ {'≤':'<=','≥':'>=','<':'<','>':'>'}[op] }{plain(n)}".replace(' ', '')]
        if op in '≤≥': a.append(f"x{op}{plain(n)}")
        after = (f'<div class="vw" data-vw=\'{json.dumps({"eq": eq}, ensure_ascii=False)}\'></div>'
                 f'<div class="eqfig"><div data-eq=\'{json.dumps({"type": "nline", "min": int(n) - 3, "max": int(n) + 3, "at": int(n), "open": op in "<>", "dir": "R" if op in ">≥" else "L", "c": "red", "label": ineq_show(op, n), "alt": "number line for " + ineq_show(op, n)}, ensure_ascii=False)}\'></div></div>')
        assert n.denominator == 1
        T[id] = {'p': f'{label} {eq}', 'a': a, 'ineq': True, 'after': after}
    elif v in ('INF', 'NONE'):
        a = ["infinitely many solutions", "infinite", "infinite solutions", "infinitely many"] if v == 'INF' else ["no solution", "no solutions", "none", "0 solutions"]
        T[id] = {'p': f'{label} {eq}', 'a': a, 'after': f'<div class="vw" data-vw=\'{json.dumps({"eq": eq}, ensure_ascii=False)}\'></div>'}
    else:
        T[id] = {'p': f'{label} {eq_html(eq)}', 'a': [plain(v), 'x=' + plain(v)], 'after': f'<div class="vw" data-vw=\'{json.dumps({"eq": eq}, ensure_ascii=False)}\'></div>'}
    return v


L1, L2, L3 = '<span class="np-lv l1">Score 3</span>', '<span class="np-lv l2">Score 4</span>', '<span class="np-lv l3">Score 5</span>'
assert pv('pA1', L1, '4x + 5 = 29') == 6
assert pv('pA2', L1, '3(x − 2) = 15') == 7
assert pv('pA3', L2, '6x − 5 = 2x + 15') == 5
assert pv('pA4', L2, '−3(x + 1) = 9') == -4
assert pv('pA5', L2, '5x + 6 = 2x − 9') == -5
assert pv('pA6', L3, '2(3x + 2) = 4x + 10') == 3
assert pv('pA7', L1, 'x/3 + 4 = 9') == 15
assert pv('pA8', L2, '9 − 3x = 2x + 24') == -3
assert pv('pA9', L2, '0.5x + 4 = 10') == 12
assert pv('pA10', L3, '−(x − 8) = 3x − 4') == 3
assert pv('pB1', L1, '5x + 4 = 5x − 4') == 'NONE'
assert pv('pB2', L1, '3x − 6 = 3x − 6') == 'INF'
assert pv('pB3', L2, '4(x + 1) = 4x + 1') == 'NONE'
assert pv('pB4', L2, '2x + 6 = 2(x + 3)') == 'INF'
assert pv('pB5', L1, '6x − 1 = 6x + 1') == 'NONE'
assert pv('pB6', L1, 'x + 9 = 9 + x') == 'INF'
assert pv('pC1', L1, '4x + 1 > 17') == ('>', 4)
assert pv('pC2', L1, '3x − 4 ≤ 11') == ('≤', 5)
assert pv('pC3', L2, '−5x > 10') == ('<', -2)
T['pC3']['p'] += ' (flip!)'
assert pv('pC4', L1, '2x + 3 ≥ 13') == ('≥', 5)
assert pv('pC5', L3, '9 − x < 5') == ('>', 4)
T['pC5']['p'] += ' (flip!)'
assert pv('pC6', L2, '3(x + 1) ≤ 12') == ('≤', 3)
assert pv('pC7', L3, '−2x + 8 ≥ 0') == ('≤', 4)
T['pC7']['p'] += ' (flip!)'
assert pv('pC8', L2, '5x − 2 > 3x + 6') == ('>', 4)
