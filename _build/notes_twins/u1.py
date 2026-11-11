"""Unit 1 notes (unit1-notes.html): real numbers, square roots, decimals."""
from twinlib import *
T = {}
assert isqrt_exact(64) == 8 and not isqrt_exact(11)
T['chk1a'] = {'p': '<span class="badge">MC</span> Which number is irrational?', 'choices': ['0.25', '√64', '√11', '−2/3'], 'a': '√11',
              'why': '✓ 11 is not a perfect square, so √11 is a non-repeating, non-terminating decimal — irrational.'}
assert isqrt_exact(196) == 14 and not any(isqrt_exact(n) for n in (40, 90, 150))
T['chk2a'] = {'p': '<span class="badge">MC</span> Which of these is a perfect square?', 'choices': ['40', '90', '196', '150'], 'a': '196',
              'why': '✓ 196 = 14², so √196 = 14 exactly. The others fall between perfect squares.'}
T['chk2b'] = {'p': '<span class="badge">CALC</span> What is √225 ?', 'a': ['15'] if isqrt_exact(225) == 15 else None}
est = 4 + F(20 - 16, 25 - 16); assert round(float(est), 1) == 4.4 and round(math.sqrt(20), 1) == 4.5
T['chk4a'] = {'p': '<span class="badge">CALC</span> Estimate √20 to the nearest tenth using the algorithm. (Hint: 16 < 20 < 25)', 'a': ['4.4', '4.5', '4.47', '4.44']}
q = F(5, 11); assert str(float(q))[:8] == '0.454545'
T['chk5t'] = {'p': '<span class="badge">CALC</span> Use long division to write <span class="sf"><span>5</span><span class="sfx">/</span><span>11</span></span> as a decimal. Watch for a two-digit pattern. (Type the repeating digits in parentheses, like 0.(4) for 0.444…)',
              'a': ['0.(45), which means 0.454545…', '0.(45)', '0.454545', '0.454545...', '0.454545…', '0.4545...', '0.4545…', '0.45repeating', '0.45(repeating)']}
assert F(5, 8) == F(625, 1000)
T['chk5a'] = {'p': '<span class="badge">MC</span> Which decimal equals the fraction <span class="sf"><span>5</span><span class="sfx">/</span><span>8</span></span> ?', 'choices': ['0.58', '0.625', '0.85', '0.375'], 'a': '0.625',
              'why': '✓ 5 ÷ 8 = 0.625, a terminating (rational) decimal.'}

# Nov 11, 2026: twins for the three Score 5 questions in Part 2 section D (_build/notes_score5_nov11.py)
T['u1s5a'] = {'p': '<span class="badge">MC</span> Which statement about the real number system is TRUE?',
              'choices': ['Every integer is a whole number.', 'Every whole number is an integer.', 'Every irrational number can be written as a fraction of integers.', 'Every decimal is rational.'], 'a': 'Every whole number is an integer.',
              'why': '✓ The whole numbers (0, 1, 2, …) sit inside the integers. But −3 is an integer that is not a whole number.'}
T['u1s5b'] = {'p': '<span class="badge">MC</span> Why is <span class="sf"><span>√3</span><span class="sfx">/</span><span>3</span></span> irrational, even though it is written as a fraction?',
              'choices': ['It is not irrational. Every fraction is rational.', 'The top, √3, is not an integer.', 'Because 3 does not divide 3 evenly.', 'Because its decimal has more than 10 digits.'], 'a': 'The top, √3, is not an integer.',
              'why': '✓ A rational number is a ratio of two INTEGERS. √3 is not an integer, so √3/3 is irrational.'}
assert 60 ** (1 / 3.0) < 4 < 4.1 < 17 ** 0.5
T['u1s5c'] = {'p': '<span class="badge">MC</span> Which list is in order from least to greatest?',
              'choices': ['√16, ∛60, 4.1, √17', '∛60, √16, 4.1, √17', '√17, 4.1, √16, ∛60', '∛60, √16, √17, 4.1'], 'a': '∛60, √16, 4.1, √17',
              'why': '✓ ∛60 ≈ 3.91, √16 = 4, 4.1, and √17 ≈ 4.12.'}

# Nov 11, 2026: twins for Part 2 sections A-C, which are now checked questions (_build/notes_u1_part2_nov11.py)
RI = ['Rational', 'Irrational']
assert F(7, 9) == F(7, 9) and isqrt_exact(36) == 6 and not isqrt_exact(15) and isqrt_exact(64) == 8
for _i, (_q, _a, _w) in enumerate([('0.777…', 'Rational', 'The 7 repeats forever: 0.777… = 7/9.'), ('√36', 'Rational', '36 is a perfect square: √36 = 6.'), ('√15', 'Irrational', '15 is not a perfect square, so its decimal never stops and never repeats.'),
                                   ('0.121221222…', 'Irrational', 'The runs of 2s keep growing, so no block ever repeats.'), ('−√64', 'Rational', '64 = 8 × 8, so −√64 = −8.')], 1):
    T['u1pA%d' % _i] = {'p': '<span class="badge">MC</span> Is %s rational or irrational?' % _q, 'choices': RI, 'a': _a, 'why': '✓ ' + _w}
def _est(n, neg=False):
    lo = math.isqrt(n); alg = lo + F(n - lo * lo, (lo + 1) ** 2 - lo * lo); out = []
    for v in (round(float(alg) + 1e-9, 1), round(math.sqrt(n), 1), round(float(alg), 2), round(math.sqrt(n), 2)):
        t = ('−' if neg else '') + (('%.2f' % v).rstrip('0').rstrip('.') if abs(v * 10 - round(v * 10)) > 1e-9 else '%.1f' % v)
        if t not in out: out.append(t)
    return out
assert _est(8)[0] == '2.8' and _est(40)[0] == '6.3' and _est(85)[0] == '9.2' and _est(27, True)[0] == '−5.2'
for _i, (_n, _neg) in enumerate([(8, False), (40, False), (85, False), (27, True)], 1):
    T['u1pB%d' % _i] = {'p': '<span class="badge">CALC</span> Estimate %s√%d to the nearest tenth.' % ('−' if _neg else '', _n), 'a': _est(_n, _neg)}
assert 2.4 < 6 ** .5 < 2.5 < 7 ** .5 and 27 ** .5 < 5.3 < 16 / 3.0 < 30 ** .5 and -3.5 < -10 / 3.0 < -(11 ** .5)
T['u1pC1'] = {'p': '<span class="badge">MC</span> Which list is in order from least to greatest? 2.4, √6, <span class="sf"><span>5</span><span class="sfx">/</span><span>2</span></span>, √7',
              'choices': ['√6, 2.4, 5/2, √7', '2.4, √6, 5/2, √7', '√7, 5/2, √6, 2.4', '2.4, 5/2, √6, √7'], 'a': '2.4, √6, 5/2, √7', 'why': '✓ Decimals: 2.4, 2.45, 2.5, 2.65.'}
T['u1pC2'] = {'p': '<span class="badge">MC</span> Which list is in order from least to greatest? 5.3, √27, <span class="sf"><span>16</span><span class="sfx">/</span><span>3</span></span>, √30',
              'choices': ['5.3, √27, 16/3, √30', '√30, 16/3, 5.3, √27', '√27, 5.3, 16/3, √30', '√27, 16/3, 5.3, √30'], 'a': '√27, 5.3, 16/3, √30', 'why': '✓ Decimals: 5.20, 5.3, 5.33, 5.48.'}
T['u1pC3'] = {'p': '<span class="badge">MC</span> Which list is in order from least to greatest? −3.5, −√11, −<span class="sf"><span>10</span><span class="sfx">/</span><span>3</span></span>',
              'choices': ['−√11, −10/3, −3.5', '−3.5, −√11, −10/3', '−3.5, −10/3, −√11', '−10/3, −3.5, −√11'], 'a': '−3.5, −10/3, −√11', 'why': '✓ Decimals: −3.5, −3.33, −3.32. With negatives, the one farthest left is the least.'}

# Nov 10, 2026: Score labels to match the section checks on unit1-notes.html
import re as _re
for _k, _l in {'chk1a': 3, 'chk2a': 3, 'chk2b': 3, 'chk4a': 4, 'chk5t': 4, 'chk5a': 3, 'u1s5a': 5, 'u1s5b': 5, 'u1s5c': 5, 'u1pA1': 3, 'u1pA2': 3, 'u1pA3': 3, 'u1pA4': 4, 'u1pA5': 4, 'u1pB1': 3, 'u1pB2': 4, 'u1pB3': 4, 'u1pB4': 5, 'u1pC1': 3, 'u1pC2': 4, 'u1pC3': 5}.items():
    if _k in T: T[_k]['p'] = _re.sub(r'(<span class="badge">[^<]*</span>)', lambda m: m.group(1) + ' <span class="np-lv l%d">Score %d</span>' % (_l - 2, _l), T[_k]['p'], count=1)
