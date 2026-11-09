"""Unit 2 scientific notation notes (unit2-notes-sci-notation.html)."""
from twinlib import *
T = {}
SUP = str.maketrans('0123456789-', '⁰¹²³⁴⁵⁶⁷⁸⁹⁻')


def sci(v):
    v = F(v); e = 0
    while abs(v) >= 10: v /= 10; e += 1
    while abs(v) < 1: v *= 10; e -= 1
    return dec(v), e


def sci_ans(v):
    m, e = sci(v); return [f"{m}×10{str(e).translate(SUP)}", f"{m}x10^{e}", f"{m}*10^{e}"]


def std(v):
    s = dec(F(v)); out = [s]
    if '.' not in s and len(s) > 3: out.insert(0, f"{int(s):,}")
    return out


B = [('1) 82,000,000 → scientific notation', sci_ans(82000000)), ('2) 0.00057 → scientific notation', sci_ans(F(57, 100000))),
     ('3) 4.03 × 10⁷ → standard form', std(F(403, 100) * 10 ** 7)), ('4) 6.4 × 10⁻⁵ → standard form', std(F(64, 10) / 10 ** 5)),
     ('5) 530,000 → scientific notation', sci_ans(530000)), ('6) 0.0000081 → scientific notation', sci_ans(F(81, 10 ** 7))),
     ('7) 2.76 × 10⁴ → standard form', std(F(276, 100) * 10 ** 4)), ('8) 4.5 × 10⁻³ → standard form', std(F(45, 10) / 1000)),
     ('9) 7,140,000,000 → scientific notation', sci_ans(7140000000)), ('10) 3.6 × 10⁻² → standard form', std(F(36, 10) / 100))]
for i, (p, a) in enumerate(B, 1): T[f'u2pB{i}'] = {'p': p, 'a': a}
assert T['u2pB1']['a'][0] == '8.2×10⁷' and T['u2pB2']['a'][0] == '5.7×10⁻⁴' and T['u2pB3']['a'] == ['40,300,000', '40300000']
assert T['u2pB4']['a'] == ['0.000064'] and T['u2pB6']['a'][1] == '8.1x10^-6' and T['u2pB7']['a'] == ['27,600', '27600'] and T['u2pB10']['a'] == ['0.036']
C = [('1) (2 × 10³)(4 × 10⁶)', 2 * 10 ** 3 * 4 * 10 ** 6), ('2) (9 × 10⁸) ÷ (3 × 10²)', F(9 * 10 ** 8, 3 * 10 ** 2)),
     ('3) (6 × 10⁴)(5 × 10⁵)', 6 * 10 ** 4 * 5 * 10 ** 5), ('4) (8.4 × 10⁹) ÷ (2.1 × 10⁴)', F(84, 10) * 10 ** 9 / (F(21, 10) * 10 ** 4))]
for i, (p, v) in enumerate(C, 1): T[f'u2pC{i}'] = {'p': p, 'a': sci_ans(v)}
assert T['u2pC1']['a'][0] == '8×10⁹' and T['u2pC2']['a'][0] == '3×10⁶' and T['u2pC3']['a'][0] == '3×10¹⁰' and T['u2pC4']['a'][0] == '4×10⁵'
