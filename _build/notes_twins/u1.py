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

# Nov 10, 2026: Score labels to match the section checks on unit1-notes.html
import re as _re
for _k, _l in {'chk1a': 3, 'chk2a': 3, 'chk2b': 3, 'chk4a': 4, 'chk5t': 4, 'chk5a': 3}.items():
    if _k in T: T[_k]['p'] = _re.sub(r'(<span class="badge">[^<]*</span>)', lambda m: m.group(1) + ' <span class="np-lv l%d">Score %d</span>' % (_l - 2, _l), T[_k]['p'], count=1)
