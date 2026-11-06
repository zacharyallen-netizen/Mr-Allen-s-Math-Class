"""Step-by-step data for the Units 3-4 Tutorial Review (grade8/units3-4-review-tutorial.html).

Every problem in Parts 1-5 has a sequence of steps. A student picks the best next step from a menu;
the right choice shows the move, the work (colored), and the new line. The same steps make the
line-by-line solution shown after a correct answer.

Markup used in the lines (rendered to colored HTML by render()):
  [v:3x]  x-term (blue)          [k:12]  number term (purple)      [o:− 9]  done to BOTH sides (gold)
  [c:..]  cancels to zero (struck through in red)                 [d:3]   number being distributed (teal)
  [f:top|bottom]  stacked fraction                                [fl:>]  flipped inequality sign (orange)
  [T:..] / [F:..]  true / false statement chip                    [b:..]  bold
Every work line and result line is checked with Fraction arithmetic: it must have exactly the same
solutions as the original (equations) or the same truth values on a grid of test points (inequalities).
    python3 _build/u34_tut_steps.py      # prints a summary; raises if any line is wrong
"""
import re, html
from fractions import Fraction as F

MINUS = '−'

# ───────────────────────── rendering ─────────────────────────
TAG = re.compile(r'\[(\w+):([^\[\]]*)\]')

def _minus(s):
    # ASCII hyphen → true minus when it is math (not inside words like "x-terms" or "Same-Side")
    return re.sub(r'(?<![A-Za-z])-(?=(?:x(?![A-Za-z]))|[^A-Za-z]|$)', MINUS, s)

def render(s):
    if s is None: return ''
    s = _minus(s)
    s = s.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
    s = re.sub(r'(?<![A-Za-z&])x(?![A-Za-z])', '<i>x</i>', s)
    while True:
        m = TAG.search(s)
        if not m: break
        t, body = m.group(1), m.group(2)
        if t == 'f':
            a, b = body.split('|')
            rep = f'<span class="fr"><span>{a}</span><span>{b}</span></span>'
        elif t == 'b':
            rep = f'<b>{body}</b>'
        else:
            rep = f'<span class="t-{t}">{body}</span>'
        s = s[:m.start()] + rep + s[m.end():]
    assert '[' not in s and ']' not in s, s
    return s

def plain(s):
    s = _minus(s)
    while True:
        m = TAG.search(s)
        if not m: break
        t, body = m.group(1), m.group(2)
        rep = '({})/({})'.format(*body.split('|')) if t == 'f' else body
        s = s[:m.start()] + rep + s[m.end():]
    return s

# ───────────────────────── checking ─────────────────────────
RELS = ['≤', '≥', '<', '>', '=']
def _split(line):
    p = plain(line)
    for r in RELS:
        if r in p:
            L, R = p.split(r)
            return L, r, R
    raise ValueError('no relation: ' + line)

def _side(e, x):
    e = e.replace(MINUS, '-').replace('·', '*').replace('÷', '/').replace('°', '').replace(' ', '')
    e = re.sub(r'(\d)(x|\()', r'\1*\2', e)
    e = re.sub(r'\)(\(|x|\d)', r')*\1', e)
    e = re.sub(r'(\d+)', r'F(\1)', e)
    return eval(e, {'F': F, 'x': x})

TESTS = [F(k, 4) for k in range(-80, 81)]
OPS = {'<': lambda a, b: a < b, '>': lambda a, b: a > b, '≤': lambda a, b: a <= b, '≥': lambda a, b: a >= b, '=': lambda a, b: a == b}

def solset(line):
    L, r, R = _split(line)
    if r == '=':
        f = lambda t: _side(L, F(t)) - _side(R, F(t))
        a, b = f(1) - f(0), f(0)
        assert f(2) == 2 * a + b and f(-3) == -3 * a + b, 'not linear: ' + line
        if a != 0: return ('one', -b / a)
        return ('all',) if b == 0 else ('none',)
    return ('ineq', tuple(OPS[r](_side(L, t), _side(R, t)) for t in TESTS))

def expect_set(exp):
    kind = exp[0]
    if kind == 'one': return ('one', F(exp[1]))
    if kind in ('all', 'none'): return (kind,)
    op, v = exp[1], F(exp[2])
    return ('ineq', tuple(OPS[op](t, v) for t in TESTS))

def verify(seq):
    want = expect_set(seq['expect'])
    lines = ([seq['start']] if seq.get('start') else [])
    for st in seq['steps']:
        lines += st.get('work', []) + ([st['res']] if st.get('res') else [])
        oks = [c for c in st['choices'] if c[1]]
        assert len(oks) == 1 and len(st['choices']) == 3, (seq['key'], st['move'])
    for ln in lines:
        assert solset(ln) == want, (seq['key'], ln, solset(ln), want)
    return seq

# ───────────────────────── data ─────────────────────────
SEQ = {}
def add(key, expect, steps, start=None, given=None, check=None, final=None, graph=None, after='type'):
    si = len(SEQ)
    for i, st in enumerate(steps):   # where the right answer sits: vary it, never always first
        ok = [c for c in st['choices'] if c[1]][0]
        rest = [c for c in st['choices'] if not c[1]]
        rest.insert((si + 2 * i + 1) % 3, ok)
        st['choices'] = rest
    SEQ[key] = verify(dict(key=key, expect=expect, steps=steps, start=start, given=given, check=check,
                           final=final, graph=graph, after=after))

def S(choices, move, res=None, work=(), note=None, concl=None, ask=None):
    return dict(choices=list(choices), move=move, res=res, work=list(work), note=note, concl=concl, ask=ask)

# reusable step makers -------------------------------------------------------
def undo_plus(c, pre, rhs, res_l, res_r, k=None):
    """left side is  pre + c ; subtract c from both sides."""
    return S([(f'Subtract {c} from both sides', True, ''),
              (f'Add {c} to both sides', False, f'The {c} is being added. To undo adding, subtract {c}.'),
              (f'Divide both sides by {k}' if k else 'Multiply both sides by 2', False,
               f'Undo the + {c} before you divide.' if k else 'That does not undo anything. To undo + ' + str(c) + ', subtract.')],
             f'Subtract {c} from both sides.', f'{res_l} = {res_r}',
             [f'{pre} [c:+ {c} [o:- {c}]] = {rhs} [o:- {c}]'],
             f'+ {c} and − {c} cancel (they make 0).')

def undo_minus(c, pre, rhs, res_l, res_r, k=None, rel='='):
    """left side is  pre − c ; add c to both sides."""
    return S([(f'Add {c} to both sides', True, ''),
              (f'Subtract {c} from both sides', False, f'−{c} − {c} = −{2*c}. That moves away from 0. To undo − {c}, add {c}.'),
              (f'Divide both sides by {k}' if k else f'Add {c} and flip the sign', False,
               f'Undo the − {c} before you divide.' if k else 'Only flip when you multiply or divide by a negative. Adding never flips the sign.')],
             f'Add {c} to both sides.', f'{res_l} {rel} {res_r}',
             [f'{pre} [c:- {c} [o:+ {c}]] {rel} {rhs} [o:+ {c}]'],
             f'− {c} and + {c} cancel (they make 0).')

def divide(k, rhs, ans, rel='=', flip=False, rhs_note=None):
    """[v:kx] rel rhs  →  x rel' ans ;  k may be negative (then flip)."""
    ks = str(k)
    if k < 0:
        newrel = {'<': '>', '>': '<', '≤': '≥', '≥': '≤'}[rel]
        return S([(f'Divide both sides by {ks} and flip the sign', True, ''),
                  (f'Divide both sides by {ks} and keep the sign', False, f'You are dividing by a negative. That reverses the order, so the sign must flip: {rel} becomes {newrel}.'),
                  (f'Add {abs(k)} to both sides', False, f'{ks}x means {ks} times x. To undo times, divide.')],
                 f'Divide both sides by {ks}. Dividing by a negative flips the sign.', f'x [fl:{newrel}] {ans}',
                 [f'[f:[c:{ks}]x|[c:[o:{ks}]]] [fl:{newrel}] [f:{rhs}|[o:{ks}]]'],
                 f'{ks} ÷ ({ks}) = 1, so only x is left. {rel} flips to {newrel} because {ks} is negative.')
    third = ((f'Divide both sides by {ks} and flip the sign', False, f'{ks} is positive. Only flip when you divide by a NEGATIVE.') if rel != '='
             else (f'Multiply both sides by {ks}', False, f'Multiplying gives {k*k}x. To undo times, divide.'))
    return S([(f'Divide both sides by {ks}', True, ''),
              (f'Subtract {ks} from both sides', False, f'{ks}x means {ks} times x. Subtracting does not undo times. Divide.'),
              third],
             f'Divide both sides by {ks}.', f'x {rel} {ans}',
             [f'[f:[c:{ks}]x|[c:[o:{ks}]]] {rel} [f:{rhs}|[o:{ks}]]'],
             f'{ks} ÷ {ks} = 1, so only x is left. ' + (rhs_note or f'{rhs} ÷ {ks} = {ans}.') + (' The sign stays the same.' if rel != '=' else ''))

def sub_x(k, left_after, right_after, line, res, note, coef_div):
    return S([(f'Subtract {k} from both sides', True, ''),
              (f'Add {k} to both sides', False, f'Adding {k} puts more x on that side. Subtract {k} so the x-terms are on one side.'),
              (f'Divide both sides by {coef_div}', False, 'Divide last. First get all the x-terms on one side.')],
             f'Subtract {k} from both sides.', res, [line], note)

CLASSIFY = {
    'all': lambda stmt: S([('It is TRUE, so every number works: infinitely many solutions', True, ''),
                           (f'There is no x left, so there is no solution', False, f'No x left does not mean no solution. Read the statement: {stmt} is TRUE, so every x works.'),
                           (f'It is true, so x = {stmt.split(" = ")[0]}: one solution', False, f'{stmt} has no x in it. It does not tell you what x is. It is always true, so every x works.')],
                          'Read what is left.', concl=f'[T:{stmt} is always TRUE] → Infinitely many solutions',
                          note='The x-terms cancelled and what is left is TRUE. Every value of x works.',
                          ask=f'The x-terms are gone. What does {stmt} tell you?'),
    'none': lambda stmt: S([('It is FALSE, so no number works: no solution', True, ''),
                            ('It is false, so x = 0', False, 'A false statement means NO value of x works. There is no x to find, not even 0.'),
                            ('Infinitely many solutions', False, f'Infinitely many happens when what is left is TRUE, like 5 = 5. {stmt} is false.')],
                           'Read what is left.', concl=f'[F:{stmt} is never true] → No solution',
                           note='The x-terms cancelled and what is left is FALSE. No value of x works.',
                           ask=f'The x-terms are gone. What does {stmt} tell you?'),
}

# ═════════ PART 1 · multi-step equations ═════════
add('ex1', ('one', 5), start='4(x - 1) + 2x = 3x + 11', check='4(5 − 1) + 2(5) = 26 and 3(5) + 11 = 26 ✓', steps=[
    S([('Distribute the 4', True, ''), ('Add 1 to both sides', False, 'The 1 is inside the parentheses. Distribute first.'),
       ('Combine 4 and 2x', False, 'The 4 is multiplying the parentheses. Distribute first.')],
      'Distribute: multiply the 4 by EACH term inside.', '4x - 4 + 2x = 3x + 11', ['[d:4] · x - [d:4] · 1 + 2x = 3x + 11'], '4 · x = 4x and 4 · 1 = 4.'),
    S([('Combine like terms: 4x + 2x', True, ''), ('Combine 4x and −4', False, '4x and −4 are not like terms. One has x, one does not.'),
       ('Divide both sides by 4', False, 'Combine like terms first.')],
      'Combine like terms on the left.', '[v:6x] - 4 = 3x + 11', ['[v:4x] - 4 [v:+ 2x] = 3x + 11'], 'The blue x-terms are like terms: 4x + 2x = 6x.'),
    sub_x('3x', '', '', '[v:6x] [o:- 3x] - 4 = [c:3x [o:- 3x]] + 11', '[v:3x] - 4 = 11', '3x − 3x cancel on the right. On the left, 6x − 3x = 3x.', 6),
    undo_minus(4, '[v:3x]', '[k:11]', '[v:3x]', '[k:15]', k=3),
    divide(3, 15, 5),
])

add('t1', ('one', 8), start='2x + 9 = 25', check='2(8) + 9 = 16 + 9 = 25 ✓', steps=[
    undo_plus(9, '[v:2x]', '[k:25]', '[v:2x]', '[k:16]', k=2),
    divide(2, 16, 8),
])
SEQ['t1']['steps'][0]['note'] += ' 25 − 9 = 16.'
add('t2', ('one', 5), start='3(x + 4) = 27', check='3(5 + 4) = 3(9) = 27 ✓', steps=[
    S([('Distribute the 3 to both terms', True, ''), ('Subtract 4 from both sides', False, 'The 4 is inside the parentheses with the x. Distribute the 3 first.'),
       ('Subtract 3 from both sides', False, 'The 3 is multiplying. Subtracting will not undo it. Distribute the 3 first.')],
      'Distribute: multiply the 3 by EACH term inside.', '[v:3x] + [k:12] = 27', ['[d:3] · x + [d:3] · 4 = 27'], '3 · x = 3x and 3 · 4 = 12.'),
    undo_plus(12, '[v:3x]', '[k:27]', '[v:3x]', '[k:15]', k=3),
    divide(3, 15, 5),
])
SEQ['t2']['steps'][1]['note'] += ' 27 − 12 = 15.'
add('t3', ('one', 5), start='7x - 6 = 4x + 9', check='7(5) − 6 = 29 and 4(5) + 9 = 29 ✓', steps=[
    sub_x('4x', '', '', '[v:7x] [o:- 4x] - 6 = [c:4x [o:- 4x]] + 9', '[v:3x] - 6 = 9', '4x − 4x cancel on the right. On the left, 7x − 4x = 3x.', 7),
    undo_minus(6, '[v:3x]', '[k:9]', '[v:3x]', '[k:15]', k=3),
    divide(3, 15, 5),
])
SEQ['t3']['steps'][1]['note'] += ' 9 + 6 = 15.'
add('t4', ('one', 4), start='5(x - 2) + 3x = 2(x + 7)', check='5(4 − 2) + 3(4) = 22 and 2(4 + 7) = 22 ✓', steps=[
    S([('Distribute on both sides', True, ''), ('Add 2 to both sides', False, 'The 2 is inside the parentheses. Distribute first.'),
       ('Divide both sides by 5', False, 'Only part of the left side is multiplied by 5. Distribute first.')],
      'Distribute on both sides.', '5x - 10 + 3x = 2x + 14', ['[d:5] · x - [d:5] · 2 + 3x = [d:2] · x + [d:2] · 7'],
      '5(x − 2) = 5x − 10 and 2(x + 7) = 2x + 14.'),
    S([('Combine like terms: 5x + 3x', True, ''), ('Combine 5x and −10 to get −5x', False, '5x and −10 are not like terms. Only combine x-terms with x-terms.'),
       ('Divide both sides by 8', False, 'Combine like terms first. Then get the x-terms on one side.')],
      'Combine like terms on the left.', '[v:8x] - 10 = 2x + 14', ['[v:5x] - 10 [v:+ 3x] = 2x + 14'], 'The blue x-terms are like terms: 5x + 3x = 8x.'),
    sub_x('2x', '', '', '[v:8x] [o:- 2x] - 10 = [c:2x [o:- 2x]] + 14', '[v:6x] - 10 = 14', '2x − 2x cancel on the right. On the left, 8x − 2x = 6x.', 8),
    undo_minus(10, '[v:6x]', '[k:14]', '[v:6x]', '[k:24]', k=6),
    divide(6, 24, 4),
])
SEQ['t4']['steps'][3]['note'] += ' 14 + 10 = 24.'
for k in ('ex1',): SEQ[k]['steps'][3]['note'] += ' 11 + 4 = 15.'

# ═════════ PART 2 · how many solutions ═════════
def dist(c, inner, res, rest_l='', rest_r='', wrong1=None, wrong2=None):
    return S([(f'Distribute the {c}', True, ''),
              wrong1 or ('Divide both sides by x', False, 'Never divide by x. Distribute first.'),
              wrong2 or (f'Subtract {c} from both sides', False, f'The {c} is multiplying the parentheses. Distribute first.')],
             f'Distribute: multiply the {c} by EACH term inside.', res, [inner])

# samples (shown step by step in the lesson)
add('s_one', ('one', 4), start='5x - 3 = 2x + 9', after=None,
    check='5(4) − 3 = 17 and 2(4) + 9 = 17 ✓', steps=[
    sub_x('2x', '', '', '[v:5x] [o:- 2x] - 3 = [c:2x [o:- 2x]] + 9', '[v:3x] - 3 = 9',
          '2x − 2x cancel on the right. On the left 5x − 2x = 3x. The x-terms did NOT all cancel: there is still 3x.', 5),
    undo_minus(3, '[v:3x]', '[k:9]', '[v:3x]', '[k:12]', k=3),
    divide(3, 12, 4),
    S([('x = 4 is the one solution', True, ''), ('No solution', False, 'You found a number for x. That is a solution.'),
       ('Infinitely many', False, 'Only one number, 4, makes it true.')],
      'Read the answer.', concl='[T:x = 4] → One solution', ask='What does x = 4 tell you?',
      note='The x-terms did NOT cancel, so x equals exactly one number.'),
])
add('s_none', ('none',), start='3(x + 2) = 3x + 1', after=None, steps=[
    dist(3, '[d:3] · x + [d:3] · 2 = 3x + 1', '3x + 6 = 3x + 1'),
    S([('Subtract 3x from both sides', True, ''), ('Divide both sides by 3', False, 'Get the x-terms on one side first.'),
       ('Add 3x to both sides', False, 'That makes 6x on each side. Subtract 3x so the x-terms cancel.')],
      'Subtract 3x from both sides.', '6 = 1', ['[c:3x [o:- 3x]] + 6 = [c:3x [o:- 3x]] + 1'],
      'Watch the red lines: 3x − 3x = 0 on BOTH sides. All the x-terms cancelled.'),
    CLASSIFY['none']('6 = 1'),
])
add('s_inf', ('all',), start='4x + 8 - x = 3(x + 2) + 2', after=None, steps=[
    S([('Combine like terms on the left: 4x − x', True, ''), ('Combine 4x and 8', False, '4x and 8 are not like terms.'),
       ('Divide both sides by 3', False, 'Simplify each side first.')],
      'Combine like terms on the left.', '[v:3x] + 8 = 3(x + 2) + 2', ['[v:4x] [v:- x] + 8 = 3(x + 2) + 2'], 'The blue x-terms: 4x − x = 3x.'),
    dist(3, '3x + 8 = [d:3] · x + [d:3] · 2 + 2', '3x + 8 = 3x + 6 + 2'),
    S([('Combine like terms on the right: 6 + 2', True, ''), ('Combine 3x and 6', False, '3x and 6 are not like terms.'),
       ('Subtract 8 from both sides', False, 'Finish simplifying the right side first.')],
      'Combine the numbers on the right.', '3x + 8 = 3x [k:+ 8]', ['3x + 8 = 3x [k:+ 6 + 2]'], 'The purple numbers: 6 + 2 = 8.'),
    S([('Subtract 3x from both sides', True, ''), ('Divide both sides by 3', False, 'Get the x-terms on one side first.'),
       ('Add 3x to both sides', False, 'Subtract 3x so the x-terms cancel.')],
      'Subtract 3x from both sides.', '8 = 8', ['[c:3x [o:- 3x]] + 8 = [c:3x [o:- 3x]] + 8'],
      'Watch the red lines: 3x − 3x = 0 on BOTH sides. All the x-terms cancelled.'),
    CLASSIFY['all']('8 = 8'),
])

# problems 5-8
add('t5', ('all',), start='6x + 3 = 6x + 3', after='pick', steps=[
    S([('Subtract 6x from both sides', True, ''), ('Divide both sides by 6', False, 'That does not get rid of x. Move the x-terms to one side first.'),
       ('Add 6x to both sides', False, 'Adding 6x gives 12x on each side. Subtract 6x so the x-terms cancel.')],
      'Subtract 6x from both sides.', '3 = 3', ['[c:6x [o:- 6x]] + 3 = [c:6x [o:- 6x]] + 3'], '6x − 6x = 0 on BOTH sides. The x-terms are gone.'),
    CLASSIFY['all']('3 = 3'),
], check='Try x = 10: 6(10) + 3 = 63 on both sides ✓')
add('t6', ('none',), start='4x - 1 = 4x + 5', after='pick', steps=[
    S([('Subtract 4x from both sides', True, ''), ('Divide both sides by 4', False, 'Move the x-terms to one side first.'),
       ('Add 4x to both sides', False, 'Adding gives 8x on each side. Subtract 4x so the x-terms cancel.')],
      'Subtract 4x from both sides.', '-1 = 5', ['[c:4x [o:- 4x]] - 1 = [c:4x [o:- 4x]] + 5'], '4x − 4x = 0 on BOTH sides. The x-terms are gone.'),
    CLASSIFY['none']('−1 = 5'),
])
add('t7', ('one', 0), start='2(x + 5) = 3x + 10', after='pick', check='2(0 + 5) = 10 and 3(0) + 10 = 10 ✓', steps=[
    dist(2, '[d:2] · x + [d:2] · 5 = 3x + 10', '2x + 10 = 3x + 10',
         wrong2=('Divide both sides by 3', False, 'Only part of the right side is multiplied by 3. Distribute first.')),
    S([('Subtract 2x from both sides', True, ''), ('Add 2x to both sides', False, 'Subtract 2x so the x-terms are on one side.'),
       ('Divide both sides by 2', False, 'Get the x-terms on one side first.')],
      'Subtract 2x from both sides.', '10 = [v:x] + 10', ['[c:2x [o:- 2x]] + 10 = [v:3x] [o:- 2x] + 10'],
      '2x − 2x cancel on the left. On the right, 3x − 2x = x. There is still an x, so keep solving.'),
    S([('Subtract 10 from both sides', True, ''), ('Add 10 to both sides', False, 'The 10 is being added to x. To undo adding, subtract.'),
       ('Divide both sides by 10', False, 'x is not multiplied by 10. Subtract 10.')],
      'Subtract 10 from both sides.', '0 = x', ['10 [o:- 10] = [v:x] [c:+ 10 [o:- 10]]'], '+ 10 and − 10 cancel on the right. 10 − 10 = 0 on the left.'),
    S([('x = 0 is the one solution', True, ''), ('0 means no solution', False, '0 is a real number! x = 0 is one solution. Check: 2(0 + 5) = 10 and 3(0) + 10 = 10.'),
       ('Infinitely many solutions', False, 'x still equals one number, 0. That is one solution.')],
      'Read the answer.', concl='[T:x = 0] → One solution', ask='What does 0 = x tell you?',
      note='The x-terms did NOT all cancel. x = 0 is a real answer, so there is ONE solution.'),
])
add('t8', ('all',), start='3(2x - 1) + 4 = 6x + 1', after='pick', check='Try x = 2: 3(3) + 4 = 13 and 6(2) + 1 = 13 ✓', steps=[
    dist(3, '[d:3] · 2x - [d:3] · 1 + 4 = 6x + 1', '6x - 3 + 4 = 6x + 1'),
    S([('Combine like terms: −3 + 4', True, ''), ('Combine 6x and −3 to get 3x', False, '6x and −3 are not like terms. One has x, one does not.'),
       ('Divide both sides by 6', False, 'Simplify the left side first.')],
      'Combine the numbers on the left.', '6x [k:+ 1] = 6x + 1', ['6x [k:- 3 + 4] = 6x + 1'], 'The purple numbers: −3 + 4 = 1.'),
    S([('Subtract 6x from both sides', True, ''), ('Divide both sides by 6', False, 'Move the x-terms to one side first.'),
       ('Add 6x to both sides', False, 'Subtract 6x so the x-terms cancel.')],
      'Subtract 6x from both sides.', '1 = 1', ['[c:6x [o:- 6x]] + 1 = [c:6x [o:- 6x]] + 1'], '6x − 6x = 0 on BOTH sides.'),
    CLASSIFY['all']('1 = 1'),
])

# ═════════ PART 3 · inequalities ═════════
add('ex3', ('ineq', '≤', -4), start='-2x + 1 ≥ 9', after=None, graph=dict(v=-4, closed=True, dir='left'), steps=[
    S([('Subtract 1 from both sides', True, ''), ('Add 1 to both sides', False, 'To undo + 1, subtract 1.'),
       ('Divide both sides by −2', False, 'Undo the + 1 before you divide.')],
      'Subtract 1 from both sides.', '[v:-2x] ≥ [k:8]', ['[v:-2x] [c:+ 1 [o:- 1]] ≥ [k:9] [o:- 1]'], '+ 1 and − 1 cancel. 9 − 1 = 8.'),
    divide(-2, 8, -4, rel='≥'),
], check='Test x = −5 (shaded): −2(−5) + 1 = 11, and 11 ≥ 9 ✓')
add('t9', ('ineq', '>', 7), start='x - 4 > 3', graph=dict(v=7, closed=False, dir='right'), steps=[
    undo_minus(4, 'x', '[k:3]', 'x', '[k:7]', rel='>'),
], check='Test x = 8: 8 − 4 = 4, and 4 > 3 ✓')
SEQ['t9']['steps'][0]['note'] += ' 3 + 4 = 7. Adding does not flip the sign.'
add('t10', ('ineq', '≤', 4), start='3x + 2 ≤ 14', graph=dict(v=4, closed=True, dir='left'), steps=[
    S([('Subtract 2 from both sides', True, ''), ('Add 2 to both sides', False, 'The 2 is being added. To undo adding, subtract.'),
       ('Divide both sides by 3', False, 'Undo the + 2 before you divide.')],
      'Subtract 2 from both sides.', '[v:3x] ≤ [k:12]', ['[v:3x] [c:+ 2 [o:- 2]] ≤ [k:14] [o:- 2]'], '+ 2 and − 2 cancel. 14 − 2 = 12.'),
    divide(3, 12, 4, rel='≤'),
], check='Test x = 0: 3(0) + 2 = 2, and 2 ≤ 14 ✓')
add('t11', ('ineq', '>', -6), start='-5x < 30', graph=dict(v=-6, closed=False, dir='right'), steps=[
    divide(-5, 30, -6, rel='<'),
], check='Test x = 0: −5(0) = 0, and 0 < 30 ✓')
add('t12', ('ineq', '≤', -5), start='2(x - 3) ≥ 5x + 9', graph=dict(v=-5, closed=True, dir='left'), steps=[
    S([('Distribute the 2', True, ''), ('Add 3 to both sides', False, 'The 3 is inside the parentheses. Distribute first.'),
       ('Divide both sides by 5', False, 'Only part of the right side is multiplied by 5. Distribute first.')],
      'Distribute: multiply the 2 by EACH term inside.', '2x - 6 ≥ 5x + 9', ['[d:2] · x - [d:2] · 3 ≥ 5x + 9'], '2 · x = 2x and 2 · 3 = 6.'),
    sub_x('5x', '', '', '[v:2x] [o:- 5x] - 6 ≥ [c:5x [o:- 5x]] + 9', '[v:-3x] - 6 ≥ 9', '5x − 5x cancel on the right. On the left, 2x − 5x = −3x.', 2),
    undo_minus(6, '[v:-3x]', '[k:9]', '[v:-3x]', '[k:15]', k=-3, rel='≥'),
    divide(-3, 15, -5, rel='≥'),
], check='Test x = −6: 2(−9) = −18 and 5(−6) + 9 = −21. −18 ≥ −21 ✓')
SEQ['t12']['steps'][2]['note'] += ' 9 + 6 = 15.'

# ═════════ PART 4 · transversals ═════════
REL3 = lambda right, w1, w2: [(right, True, '')] + [w1, w2]
add('ex4', ('one', 70), given='m∠2 = 70°. Find m∠7.', after=None, steps=[
    S(REL3('Alternate Exterior', ('Corresponding', False, 'Corresponding angles are in the SAME position. ∠2 and ∠7 are not.'),
           ('Same-Side Exterior', False, '∠2 and ∠7 are on OPPOSITE sides of t.')),
      'Find ∠2 and ∠7. Both are OUTSIDE the parallel lines (exterior). They are on OPPOSITE sides of t (alternate).',
      concl='Alternate Exterior angles → they are EQUAL', ask='What kind of pair are ∠2 and ∠7?'),
    S([('Set them equal', True, ''), ('Add them to 180°', False, 'Only same-side pairs and linear pairs add to 180°. Alternate exterior angles are equal.'),
       ('Subtract 70 from 180', False, 'That would be for a linear pair. Alternate exterior angles are equal.')],
      'Alternate exterior angles are equal.', 'x = 70', note='So m∠7 = 70°.'),
])
SEQ['ex4']['hl'] = [2, 7]
add('t16', ('one', 118), given='Parallel lines are cut by a transversal. The angles are 118° and x°.', steps=[
    S(REL3('Corresponding', ('Same-Side Interior', False, 'Look again: the two angles are in the SAME spot at each crossing. That is corresponding.'),
           ('Alternate Interior', False, 'Alternate angles are on opposite sides of the transversal. These are on the same side, in the same spot.')),
      'They are in the same position at each crossing. Corresponding angles are EQUAL.', 'x = [k:118]',
      ask='Look at the diagram. What kind of pair are the angles?', note='Equal pair, so x is the same as the given angle.'),
], check='Corresponding angles are equal: 118° = 118° ✓')
add('t17', ('one', 116), given='Parallel lines are cut by a transversal. The angles are 64° and x°.', steps=[
    S(REL3('Same-Side Interior', ('Corresponding', False, 'Corresponding angles are in the same spot at each crossing. These are both between the lines, on the same side of t.'),
           ('Alternate Interior', False, 'Both angles are on the SAME side of the transversal, so they are not alternate.')),
      'Both are between the lines, on the same side of t. Same-side interior angles ADD to 180°.', '[k:64] + [v:x] = 180',
      ask='Look at the diagram. What kind of pair are the angles?'),
    S([('Subtract 64 from both sides', True, ''), ('Set x = 64', False, 'Same-side interior angles are not equal. They add to 180°.'),
       ('Add 64 to both sides', False, 'To undo + 64, subtract 64.')],
      'Subtract 64 from both sides.', 'x = [k:116]', ['[c:[k:64] [o:- 64]] + [v:x] = 180 [o:- 64]'], '64 − 64 = 0. 180 − 64 = 116.'),
], check='64 + 116 = 180 ✓')
add('t18', ('one', 20), given='Parallel lines are cut by a transversal. The angles are (3x + 15)° and 75°.', steps=[
    S(REL3('Alternate Interior', ('Same-Side Interior', False, 'The angles are on OPPOSITE sides of the transversal.'),
           ('Corresponding', False, 'The angles are not in the same spot. Both are between the lines, on opposite sides of t.')),
      'Both are between the lines, on opposite sides of t. Alternate interior angles are EQUAL.', '[v:3x] + 15 = [k:75]',
      ask='Look at the diagram. What kind of pair are the angles?'),
    undo_plus(15, '[v:3x]', '[k:75]', '[v:3x]', '[k:60]', k=3),
    divide(3, 60, 20),
], check='3(20) + 15 = 75 ✓')
SEQ['t18']['steps'][1]['note'] += ' 75 − 15 = 60.'

# ═════════ PART 5 · triangles ═════════
TRI3 = lambda right, w1, w2: [(right, True, '')] + [w1, w2]
add('ex5', ('one', 105), given='A triangle has angles 40° and 65°. Find the exterior angle x next to the third angle.', after=None, steps=[
    S(TRI3('Exterior Angle Theorem', ('Triangle Sum Theorem', False, 'x is OUTSIDE the triangle. Use the exterior angle theorem.'),
           ('Vertical angles', False, 'There are no crossing lines here. x is an exterior angle of the triangle.')),
      'x is an exterior angle. It equals the sum of the two remote interior angles.', 'x = [k:40] + [k:65]', ask='Which rule do you use?'),
    S([('Add 40 + 65', True, ''), ('Subtract 65 from 180', False, 'That finds the angle next to x, not x.'),
       ('Divide by 2', False, 'Nothing is being doubled. Just add the two remote angles.')],
      'Add the two remote angles.', 'x = [k:105]', ['x = [k:40 + 65]']),
], check='The third angle is 75°, and 75 + 105 = 180 (a linear pair) ✓')
add('t19', ('one', 49), given='A triangle has angles 52°, 79° and x°.', steps=[
    S(TRI3('Triangle Sum Theorem', ('Exterior Angle Theorem', False, 'All three angles are INSIDE the triangle. There is no exterior angle.'),
           ('Linear pair', False, 'These angles are not on a straight line. They are the three angles of a triangle.')),
      'All three angles are inside the triangle. They add to 180°.', '[k:52] + [k:79] + x = 180', ask='Which rule do you use?'),
    S([('Add 52 + 79', True, ''), ('Divide both sides by 3', False, 'x is not multiplied by 3. Add the numbers you know first.'),
       ('Add 180 to both sides', False, 'That moves away from x alone. Add the numbers you know first.')],
      'Combine the numbers on the left.', '[k:131] + x = 180', ['[k:52 + 79] + x = 180'], 'The purple numbers: 52 + 79 = 131.'),
    S([('Subtract 131 from both sides', True, ''), ('Add 131 to both sides', False, 'To undo + 131, subtract 131.'),
       ('Divide both sides by 131', False, 'x is not multiplied by 131. Subtract.')],
      'Subtract 131 from both sides.', 'x = [k:49]', ['[c:[k:131] [o:- 131]] + x = 180 [o:- 131]'], '131 − 131 = 0. 180 − 131 = 49.'),
], check='52 + 79 + 49 = 180 ✓')
add('t20', ('one', 115), given='The remote interior angles are 38° and 77°. The exterior angle is x°.', steps=[
    S(TRI3('Exterior Angle Theorem', ('Triangle Sum Theorem', False, 'x is OUTSIDE the triangle. Use the exterior angle theorem.'),
           ('Linear pair', False, 'x does make a linear pair with the inside angle at its corner, but you do not know that angle. Use the two remote angles.')),
      'x is an exterior angle. It equals the sum of the two remote interior angles.', 'x = [k:38] + [k:77]', ask='Which rule do you use?'),
    S([('Add 38 + 77', True, ''), ('Subtract 77 from 180', False, 'That finds the inside angle next to x, not x.'),
       ('Subtract 38 from 77', False, 'The exterior angle is the SUM of the remote angles. Add.')],
      'Add the two remote angles.', 'x = [k:115]', ['x = [k:38 + 77]']),
], check='The inside angle at that corner is 65°, and 65 + 115 = 180 ✓')
add('t21', ('one', 58), given='The exterior angle is 130°. One remote interior angle is 72°. The other is x°.', steps=[
    S(TRI3('Exterior Angle Theorem', ('Triangle Sum Theorem', False, 'You know the exterior angle. Use the exterior angle theorem.'),
           ('Linear pair', False, 'The linear pair would give the inside angle next to 130°, not x.')),
      'The exterior angle equals the sum of the two remote interior angles.', '130 = [k:72] + x', ask='Which rule do you use?'),
    S([('Subtract 72 from both sides', True, ''), ('Add 72 to both sides', False, '130 + 72 = 202. That is bigger than 180, so it cannot be an angle in a triangle. Subtract.'),
       ('Subtract 130 from 180', False, 'That finds the inside angle next to the exterior angle, not x.')],
      'Subtract 72 from both sides.', '[k:58] = x', ['130 [o:- 72] = [c:[k:72] [o:- 72]] + x'], '72 − 72 = 0. 130 − 72 = 58. So x = 58.'),
], check='72 + 58 = 130 ✓')
add('t22', ('one', 25), given='The angles of a triangle are (x + 5)°, (2x + 10)° and (3x + 15)°.', steps=[
    S(TRI3('Triangle Sum Theorem', ('Exterior Angle Theorem', False, 'All three angles are INSIDE the triangle.'),
           ('Set two angles equal', False, 'Nothing says two angles are equal. The three angles add to 180°.')),
      'The three interior angles add to 180°.', '(x + 5) + (2x + 10) + (3x + 15) = 180', ask='Which rule do you use?'),
    S([('Combine like terms', True, ''), ('Combine 2x and 10 to get 12x', False, '2x and 10 are not like terms. Combine x-terms with x-terms and numbers with numbers.'),
       ('Divide both sides by 3', False, 'Combine like terms first.')],
      'Combine like terms: blue x-terms together, purple numbers together.', '[v:6x] + [k:30] = 180',
      ['[v:x] + [k:5] [v:+ 2x] [k:+ 10] [v:+ 3x] [k:+ 15] = 180'], 'x + 2x + 3x = 6x. 5 + 10 + 15 = 30.'),
    undo_plus(30, '[v:6x]', '180', '[v:6x]', '[k:150]', k=6),
    divide(6, 150, 25),
], check='The angles are 30°, 60° and 90°. 30 + 60 + 90 = 180 ✓')
SEQ['t22']['steps'][2]['note'] += ' 180 − 30 = 150.'

def to_js(seq):
    """Render a sequence for the page: all strings become HTML."""
    out = dict(key=seq['key'], after=seq['after'], start=render(seq['start']) if seq.get('start') else None,
               given=render(seq['given']) if seq.get('given') else None, check=render(seq.get('check')) if seq.get('check') else None,
               hl=seq.get('hl'), graph=seq.get('graph'), steps=[])
    for st in seq['steps']:
        out['steps'].append(dict(ask=render(st['ask']) if st.get('ask') else None, move=render(st['move']), note=render(st.get('note')) if st.get('note') else None,
                                 work=[render(w) for w in st['work']], res=render(st['res']) if st.get('res') else None,
                                 concl=render(st['concl']) if st.get('concl') else None,
                                 choices=[[render(t), ok, render(w)] for t, ok, w in st['choices']]))
    return out

def trail_html(seq, title='Solution'):
    """Static line-by-line solution (shown after a correct answer)."""
    j = to_js(seq)
    h = f'<div class="ss-sol"><div class="ss-h">{title}</div><ol class="ss-trail">'
    if j['start']: h += f'<li><div class="ss-move">Start</div><div class="ss-line">{j["start"]}</div></li>'
    if j['given']: h += f'<li><div class="ss-move">Given</div><div class="ss-given">{j["given"]}</div></li>'
    for n, st in enumerate(j['steps'], 1):
        h += f'<li><div class="ss-move"><span class="ss-n">{n}</span><span>{st["move"]}</span></div>'
        h += ''.join(f'<div class="ss-work">{w}</div>' for w in st['work'])
        if st['res']: h += f'<div class="ss-line">{st["res"]}</div>'
        if st['concl']: h += f'<div class="ss-concl">{st["concl"]}</div>'
        if st['note']: h += f'<div class="ss-note">{st["note"]}</div>'
        h += '</li>'
    h += '</ol>'
    if j['check']: h += f'<div class="ss-check">Check: {j["check"]}</div>'
    return h + '</div>'

if __name__ == '__main__':
    for k, s in SEQ.items():
        last = s['steps'][-1]
        print(f'{k:6} {len(s["steps"])} steps → {plain(last["res"]) if last.get("res") else plain(last["concl"])}')
    print(render('[f:[c:2]x|[c:[o:2]]] = [f:16|[o:2]]'))
