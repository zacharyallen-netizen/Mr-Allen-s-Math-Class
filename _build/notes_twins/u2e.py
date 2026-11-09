"""Unit 2 exponents notes (unit2-notes-exponents.html). Answers in both forms (superscript and ^), like the page."""
from twinlib import *
T = {}
SUP = str.maketrans('0123456789-', '⁰¹²³⁴⁵⁶⁷⁸⁹⁻')


def mono(c, ex):
    """c = coefficient, ex = {var: exponent}. Returns (pretty, caret)."""
    s1 = ('' if c == 1 else str(c)); s2 = s1
    for v, e in ex.items():
        if e == 0: continue
        s1 += v + ('' if e == 1 else str(e).translate(SUP)); s2 += v + ('' if e == 1 else f'^{e}')
    return s1 or '1', s2 or '1'


def ans(c, ex):
    a, b = mono(c, ex); return [a] if a == b else [a, b]


T['chk21a'] = {'p': '<span class="badge">MC</span> Simplify y⁴ · y⁶. Which rule applies, and what is the result?', 'choices': ['y¹⁰ (Product Rule)', 'y²⁴ (Power Rule)', 'y² (Quotient Rule)'],
               'a': 'y¹⁰ (Product Rule)', 'why': '✓ Same base, multiplication → Product Rule: ADD the exponents. y⁴·y⁶ = y¹⁰.'}
P = {}
P['u2pA1'] = ('1) Simplify x⁴ · x⁶', 1, {'x': 4 + 6})
P['u2pA2'] = ('2) Simplify (y⁵)²', 1, {'y': 5 * 2})
P['u2pA3'] = ('3) Simplify a¹⁰ ÷ a³', 1, {'a': 10 - 3})
P['u2pA4'] = ('4) Simplify (3x⁴)(4x²)', 3 * 4, {'x': 4 + 2})
P['u2pA5'] = ('5) Simplify (2m³)⁴', 2 ** 4, {'m': 3 * 4})
P['u2pA6'] = ('6) Simplify 20y⁹ ÷ 5y³', 20 // 5, {'y': 9 - 3})
P['u2pA7'] = ('7) Simplify (−3a²)²', (-3) ** 2, {'a': 2 * 2})
P['u2pA8'] = ('8) Simplify (4x³y)(2xy²)', 4 * 2, {'x': 3 + 1, 'y': 1 + 2})
P['u2pA9'] = ('9) Simplify 20n⁵ ÷ 4n⁵', 20 // 4, {'n': 0})
P['u2pA10'] = ('10) Simplify (3b²)² ÷ 3b', F(9, 3), {'b': 4 - 1})
P['u2pA11'] = ('11) Simplify (−5x³)(−2x⁴)', (-5) * (-2), {'x': 3 + 4})
P['u2pA12'] = ('12) Simplify (x⁴y³)²', 1, {'x': 8, 'y': 6})
assert P['u2pA10'][1] == 3 and P['u2pA7'][1] == 9
for k, (p, c, ex) in P.items():
    T[k] = {'p': p, 'a': ans(int(c), ex)}
assert T['u2pA8']['a'] == ['8x⁴y³', '8x^4y^3'] and T['u2pA9']['a'] == ['5'] and T['u2pA12']['a'] == ['x⁸y⁶', 'x^8y^6']
