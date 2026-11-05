"""Step-by-step scaffolds for the multi-step equations on the Units 3-4 Pre-Test and Tutorial Review
(interactive pages only; grade8/eq-stepper.js draws them). Students pick the best next step; the page then
shows the math (for example "Add 6 to both sides") and the new equation.
Every work line and result line is checked here: it must be true at the solution and not true at another x.
"""
import re
from fractions import Fraction as F

M = '−'

def _side(expr, x):
    s = expr.replace(M, '-').replace('÷', '/').replace('·', '*').replace(' ', '')
    s = re.sub(r'(\d)(x|\()', r'\1*\2', s)
    s = re.sub(r'\)(\(|x|\d)', r')*\1', s)
    s = re.sub(r'(\d+)', r'F(\1)', s)
    return eval(s, {'F': F, 'x': x})

def _holds(line, x):
    L, R = line.split('=')
    return _side(L, x) == _side(R, x)

def verify(eq):
    sol = eq['sol']
    lines = [eq['start']]
    for st in eq['steps']:
        lines += st['work'] + [st['res']]
        assert sum(1 for c in st['choices'] if c[1]) == 1, st
    for ln in lines:
        assert _holds(ln, F(sol)), (eq['start'], ln)
        assert not _holds(ln, F(sol) + 1), (eq['start'], ln, 'identity?')
    assert lines[-1].replace(' ', '') == f'x={sol}'.replace('-', M), lines[-1]
    return eq

def pos(choices, k):
    """put the correct choice at position k (0-2) so it is not always first."""
    ok = [c for c in choices if c[1]][0]
    rest = [c for c in choices if not c[1]]
    rest.insert(k % 3, ok)
    return rest

def num(n): return (M if n < 0 else '') + str(abs(n))

# ---- step helpers: (correct move, work lines, result) + mistakes that name the error ----
def sub_x(k, L, R, res, coef, i):
    return dict(choices=pos([(f'Subtract {k}x from both sides', True, ''),
                             (f'Add {k}x to both sides', False, f'Adding {k}x puts even more x on the left. Subtract {k}x so the x-terms are on one side.'),
                             (f'Divide both sides by {coef}', False, 'Divide last. First get all the x-terms on one side.')], i),
                move=f'Subtract {k}x from both sides.', work=[f'{L} {M} {k}x = {R} {M} {k}x'], res=res)

def undo_c(c, k, L, R, res, i):
    a = abs(c)
    if c < 0:
        ch = [(f'Add {a} to both sides', True, ''),
              (f'Subtract {a} from both sides', False, f'{M}{a} {M} {a} = {M}{2*a}. That makes it worse. To undo {M} {a}, add {a}.'),
              (f'Divide both sides by {k}', False, f'Undo the {M} {a} before you divide.')]
        mv, w = f'Add {a} to both sides.', [f'{L} + {a} = {R} + {a}']
    else:
        ch = [(f'Subtract {a} from both sides', True, ''),
              (f'Add {a} to both sides', False, f'The {a} is being added. To undo adding, subtract {a}.'),
              (f'Divide both sides by {k}', False, f'Undo the + {a} before you divide.')]
        mv, w = f'Subtract {a} from both sides.', [f'{L} {M} {a} = {R} {M} {a}']
    return dict(choices=pos(ch, i), move=mv, work=w, res=res)

def div(k, L, R, res, i):
    return dict(choices=pos([(f'Divide both sides by {k}', True, ''),
                             (f'Subtract {k} from both sides', False, f'{k}x means {k} times x. To undo times, divide.'),
                             (f'Multiply both sides by {k}', False, f'Multiplying makes it {k*k}x. To undo times, divide.')], i),
                move=f'Divide both sides by {k}.', work=[f'{L} ÷ {k} = {R} ÷ {k}'], res=res)

def custom(choices, move, work, res, i):
    return dict(choices=pos(choices, i), move=move, work=work, res=res)

EQS = {}
def eq(key, start, sol, steps, check):
    EQS[key] = verify(dict(start=start, sol=sol, steps=steps, check=check))

# ======== Tutorial Review (Part 1) ========
eq('t1', '2x + 9 = 25', 8, [
    undo_c(9, 2, '2x + 9', '25', '2x = 16', 1),
    div(2, '2x', '16', 'x = 8', 2)], '2(8) + 9 = 16 + 9 = 25 ✓')
eq('t2', '3(x + 4) = 27', 5, [
    custom([('Distribute the 3 to both terms', True, ''),
            ('Subtract 4 from both sides', False, 'The 4 is inside the parentheses with the x. Distribute the 3 first.'),
            ('Subtract 3 from both sides', False, 'The 3 is multiplying. Subtracting will not undo it. Distribute the 3 first.')],
           'Distribute: 3 · x and 3 · 4.', ['3 · x + 3 · 4 = 27'], '3x + 12 = 27', 0),
    undo_c(12, 3, '3x + 12', '27', '3x = 15', 2),
    div(3, '3x', '15', 'x = 5', 1)], '3(5 + 4) = 3(9) = 27 ✓')
eq('t3', '7x − 6 = 4x + 9', 5, [
    sub_x(4, '7x − 6', '4x + 9', '3x − 6 = 9', 7, 2),
    undo_c(-6, 3, '3x − 6', '9', '3x = 15', 0),
    div(3, '3x', '15', 'x = 5', 1)], '7(5) − 6 = 29 and 4(5) + 9 = 29 ✓')
eq('t4', '5(x − 2) + 3x = 2(x + 7)', 4, [
    custom([('Distribute on both sides', True, ''),
            ('Add 2 to both sides', False, 'The 2 is inside the parentheses. Distribute first.'),
            ('Divide both sides by 5', False, 'Only part of the left side is multiplied by 5. Distribute first.')],
           'Distribute: 5(x − 2) = 5x − 10 and 2(x + 7) = 2x + 14.', [], '5x − 10 + 3x = 2x + 14', 1),
    custom([('Combine like terms: 5x + 3x', True, ''),
            ('Combine 5x and −10 to get −5x', False, '5x and −10 are not like terms. Only combine x-terms with x-terms.'),
            ('Divide both sides by 8', False, 'Combine like terms first. Then get the x-terms on one side.')],
           'Combine like terms: 5x + 3x = 8x.', [], '8x − 10 = 2x + 14', 0),
    sub_x(2, '8x − 10', '2x + 14', '6x − 10 = 14', 8, 2),
    undo_c(-10, 6, '6x − 10', '14', '6x = 24', 1),
    div(6, '6x', '24', 'x = 4', 0)], '5(4 − 2) + 3(4) = 22 and 2(4 + 7) = 22 ✓')

# ======== Pre-Test (version A, online only) ========
eq('p1', '2x + 5 = 17', 6, [
    undo_c(5, 2, '2x + 5', '17', '2x = 12', 0),
    div(2, '2x', '12', 'x = 6', 2)], '2(6) + 5 = 17 ✓')
eq('p7', '5x − 7 = 2x + 8', 5, [
    sub_x(2, '5x − 7', '2x + 8', '3x − 7 = 8', 5, 1),
    undo_c(-7, 3, '3x − 7', '8', '3x = 15', 2),
    div(3, '3x', '15', 'x = 5', 0)], '5(5) − 7 = 18 and 2(5) + 8 = 18 ✓')
eq('p8', '3(x − 4) = x + 6', 9, [
    custom([('Distribute the 3 to both terms', True, ''),
            ('Add 4 to both sides', False, 'The 4 is inside the parentheses with the x. Distribute the 3 first.'),
            ('Divide both sides by x', False, 'Never divide by x. Distribute the 3 first.')],
           'Distribute: 3 · x and 3 · (−4).', ['3 · x + 3 · (−4) = x + 6'], '3x − 12 = x + 6', 2),
    sub_x(1, '3x − 12', 'x + 6', '2x − 12 = 6', 3, 0),
    undo_c(-12, 2, '2x − 12', '6', '2x = 18', 1),
    div(2, '2x', '18', 'x = 9', 2)], '3(9 − 4) = 15 and 9 + 6 = 15 ✓')
eq('p14', '4(x + 2) − x = 2(x + 7)', 6, [
    custom([('Distribute on both sides', True, ''),
            ('Subtract 2 from both sides', False, 'The 2s are inside parentheses. Distribute first.'),
            ('Divide both sides by 4', False, 'Only part of the left side is multiplied by 4. Distribute first.')],
           'Distribute: 4(x + 2) = 4x + 8 and 2(x + 7) = 2x + 14.', [], '4x + 8 − x = 2x + 14', 0),
    custom([('Combine like terms: 4x − x', True, ''),
            ('Combine 4x and 8 to get 12x', False, '4x and 8 are not like terms. Only combine x-terms with x-terms.'),
            ('Subtract 8 from both sides', False, 'That works later. Combine like terms on the left first so it is simpler.')],
           'Combine like terms: 4x − x = 3x.', [], '3x + 8 = 2x + 14', 2),
    sub_x(2, '3x + 8', '2x + 14', 'x + 8 = 14', 3, 1),
    undo_c(8, 1, 'x + 8', '14', 'x = 6', 0)], '4(6 + 2) − 6 = 26 and 2(6 + 7) = 26 ✓')

# "Subtract 1x" reads oddly: show it as "Subtract x"
for e in EQS.values():
    for st in e['steps']:
        st['choices'] = [(t.replace(' 1x ', ' x '), ok, w.replace(' 1x ', ' x ').replace('by 1', 'by 1')) for t, ok, w in st['choices']]
        st['move'] = st['move'].replace(' 1x ', ' x ')
        st['work'] = [w.replace(' 1x', ' x') for w in st['work']]
# p14's last step has "Divide by 1" as a distractor; replace it with a clearer one
st = EQS['p14']['steps'][-1]
st['choices'] = [c if 'Divide' not in c[0] else ('Add 14 to both sides', False, 'The 8 is being added to x. Subtract 8 from both sides.') for c in st['choices']]

if __name__ == '__main__':
    for k, e in EQS.items():
        print(k, e['start'], '→', ' | '.join(s['res'] for s in e['steps']))
