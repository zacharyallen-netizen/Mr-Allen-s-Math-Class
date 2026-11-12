"""Label the parts of two-answer (and three/four-answer) homework tap choices.

Zach, Nov 12, 2026: "there are some two answer questions but with an unlabelled multiple choice
format ... students cannot tell what choice represents what."  So a choice like
    "x = 25; 100° and 80°"   becomes   "x = 25;  4x° = 100°,  (2x + 30)° = 80°"
The names come from the printed problem (the angle expressions, side expressions, etc.).

Only the WORDS of a choice change. Its position (A, B, C, D) stays the same, and that position is
what HWCheck.tap and the "what went wrong" notes use, so checking, hints and saved drafts are not
touched. Safe to rerun (an already-labeled choice is left alone). If _build/hw_mc_build.py ever
rewrites grade8/homework/choices.js, run this again afterwards.

    python3 _build/hw_label_choices_nov12.py
"""
import json, os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PATH = os.path.join(ROOT, 'grade8', 'homework', 'choices.js')

src = open(PATH, encoding='utf-8').read()
m = re.match(r'(?s)(.*?window\.HW_MC = )(\{.*\})(;\s*)$', src)
assert m, 'unexpected choices.js layout'
head, body, tail = m.group(1), m.group(2), m.group(3)
MC = json.loads(body)

SEP = ',  '
D = '°'


def nums(s):
    """the numbers in a choice, in order (keeps fractions like 1/2 and decimals)."""
    return re.findall(r'−?\d+(?:\.\d+)?(?:/\d+)?', s)


def lab(names, unit=''):
    """choice text -> 'name = value' for each part, in order."""
    def f(s):
        v = nums(s)
        assert len(v) == len(names), (s, names)
        return SEP.join('%s = %s%s' % (n, x, unit) for n, x in zip(names, v))
    return f


def x_then(names):
    """'x = 25; 100° and 80°' -> 'x = 25;  4x° = 100°,  (2x + 30)° = 80°'"""
    def f(s):
        a, b = s.split(';', 1)
        v = nums(b)
        assert a.strip().startswith('x =') and len(v) == len(names), (s, names)
        return a.strip() + ';  ' + SEP.join('%s = %s%s' % (n, x, D) for n, x in zip(names, v))
    return f


def four_around(s):   # 4.1 #10: x°, 4x°, then the other two angles
    v = nums(s)
    assert len(v) == 4, s
    return 'x° = %s°,  4x° = %s°;  the other two: %s° and %s°' % tuple(v)


def x_angle(s):       # 4.6 #6: 'x = 10; 52°' -> 'x = 10;  the angle = 52°'
    a, b = s.split(';', 1)
    return a.strip() + ';  the angle = ' + b.strip()


def dom_rng(s):       # 6.2 #7: '−2 ≤ x ≤ 3   and   −4 ≤ y ≤ 1'
    a, b = [t.strip() for t in s.split('and')]
    return 'Domain: ' + a + ';   Range: ' + b


def ps_si(s):         # 'y − 1 = −3(x − 5);   y = −3x + 16'
    p = [t.strip() for t in s.split(';')]
    assert len(p) == 2, s
    return 'Point-slope: ' + p[0] + ';   Slope-intercept: ' + p[1]


def ps_si_mean(s):    # 6.11 #9: three parts
    p = [t.strip() for t in s.split(';')]
    assert len(p) == 3, s
    return 'Point-slope: ' + p[0] + ';   Slope-intercept: ' + p[1] + ';   Meaning: ' + p[2]


RULES = {
    ('1.3', '2'): lab(['√144', '∛8']),
    ('1.8', '2'): lab(['∛216', '13²']),
    ('2.3', '9'): lab(['2⁰', '2⁻¹', '2⁻²']),
    ('3.4', '9'): lab(['x', 'x + 2', '2x − 1']),
    ('4.1', '6'): x_then(['4x°', '(2x + 30)°']),
    ('4.1', '10'): four_around,
    ('4.2', '6'): x_then(['x°', '2x°', '(x + 40)°']),
    ('4.2', '10'): lab(['x°', '2x°', '3x°', '4x°'], D),
    ('4.5', '6'): x_then(['2x°', '(x + 25)°', '(3x + 5)°']),
    ('4.6', '6'): x_angle,
    ('6.2', '7'): dom_rng,
    ('6.10', '6'): ps_si,
    ('6.10', '9'): ps_si,
    ('6.11', '6'): ps_si,
    ('6.11', '9'): ps_si_mean,
}
DONE = ('Point-slope:', 'Domain:', 'the angle =', 'the other two')   # labels this script adds

changed = 0
for (hw, n), rule in RULES.items():
    e = MC[hw][n]
    cs = e['c'] if isinstance(e, dict) else e
    for i, c in enumerate(cs):
        if not isinstance(c, str) or any(d in c for d in DONE):
            continue
        try:
            new = rule(c)
        except AssertionError:   # already labeled: the names add numbers, so the count no longer fits
            continue
        if new != c:
            cs[i] = new
            changed += 1

# Review fix (Nov 12, 2026, C-M6): two more problems whose values were not tied to names. Exact text, position kept.
EXACT = {
    ('E.5', '9'): {
        'x = 13; the angles are 60° and 120°; alternate interior angles': 'x = 13;  (4x + 8)° = 60°,  (2x + 34)° = 120°;  alternate interior angles',
        'x = 13; both angles are 60°; alternate interior angles': 'x = 13;  (4x + 8)° = 60°,  (2x + 34)° = 60°;  alternate interior angles',
        'x = 7; both angles are 36°; corresponding angles': 'x = 7;  (4x + 8)° = 36°,  (2x + 34)° = 36°;  corresponding angles',
        'x = 23; the angles are 100° and 80°; same-side interior angles': 'x = 23;  (4x + 8)° = 100°,  (2x + 34)° = 80°;  same-side interior angles'},
}
for (hw, n), mp in EXACT.items():
    e = MC[hw][n]; cs = e['c'] if isinstance(e, dict) else e
    for i, c in enumerate(cs):
        if c in mp: cs[i] = mp[c]; changed += 1
# 4.1 #10: say WHICH angle each of "the other two" is across from
e = MC['4.1']['10']; cs = e['c'] if isinstance(e, dict) else e
for i, c in enumerate(cs):
    m2 = re.match(r'(.*);  the other two: (\S+) and (\S+)$', c)
    if m2: cs[i] = '%s;  across from x°: %s,  across from 4x°: %s' % (m2.group(1), m2.group(2), m2.group(3)); changed += 1

open(PATH, 'w', encoding='utf-8').write(head + json.dumps(MC, ensure_ascii=False, separators=(',', ':')) + tail)
print('labeled', changed, 'choices')
for (hw, n) in RULES:
    e = MC[hw][n]
    print(hw, n, '|', ' ‖ '.join(e['c'] if isinstance(e, dict) else e))
