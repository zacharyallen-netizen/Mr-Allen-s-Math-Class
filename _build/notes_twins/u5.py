"""Unit 5 notes (unit5-notes.html): Pythagorean Theorem. Every triple and root is checked here."""
from twinlib import *

T = {}
SQ = '²'


def hyp(a, b): return math.sqrt(a * a + b * b)


def is_right(a, b, c): return a * a + b * b == c * c


def roots(n, show_prefix):
    """answers for √n rounded to tenths + exact forms; returns (ans, show)."""
    r = round(math.sqrt(n), 1)
    assert not isqrt_exact(n)
    return f"{r}|√{n}|sqrt{n}|sqrt({n})|√({n})", f"{show_prefix} = √{n} ≈ {r}"


def fig_tri(a, b, la, lb, lc, hl=None): return right_tri(a, b, la, lb, lc, f'right triangle with sides {la}, {lb}, {lc}', 220, hl)


# ---- 1. parts of a right triangle ----
T['np1-1'] = {'p': 'Look at the right triangle. Which side is the hypotenuse?', 'choices': ['5', '12', '13'], 'a': '13', 'fig': fig_tri(12, 5, '12', '5', '13'),
              'sol': 'The hypotenuse is across from the right angle (the little square). It is always the longest side. Here it is 13.'}
assert 40 + 50 + 90 == 180
T['np1-2'] = {'p': 'A triangle has angles of 40°, 50°, and 90°. Can you use a² + b² = c² on it?', 'choices': ['Yes', 'No'], 'a': 'Yes',
              'sol': 'One angle is 90°, so it IS a right triangle. The theorem works on right triangles. Answer: Yes.'}
assert 81 + 144 == 225
T['np1-3'] = {'p': 'The squares on the two legs of a right triangle have areas 81 and 144. What is the area of the square on the hypotenuse?', 'a': '225', 'show': '225',
              'sol': 'a² + b² = c² → 81 + 144 = c² → c² = 225. (So the hypotenuse is √225 = 15.)'}
assert 100 - 36 == 64
T['np1-4'] = {'p': 'The square on the hypotenuse has area 100. The square on one leg has area 36. What is the area of the square on the other leg?', 'a': '64', 'show': '64',
              'sol': 'a² + 36 = 100 → a² = 100 − 36 = 64. (So that leg is √64 = 8.)'}
# ---- 2. hypotenuse ----
assert hyp(9, 12) == 15
T['np2-1'] = {'p': 'The legs of a right triangle are 9 and 12. Find the hypotenuse c.', 'fig': fig_tri(12, 9, '12', '9', 'c', 'c'), 'a': '15', 'show': '15',
              'sol': '9² + 12² = c² → 81 + 144 = c² → 225 = c² → c = √225 = 15'}
a, s = roots(3 * 3 + 5 * 5, 'c'); assert a.startswith('5.8')
T['np2-2'] = {'p': 'The legs are 3 and 5. Find the hypotenuse c. Round to the nearest tenth (or give the exact √ answer).', 'fig': fig_tri(5, 3, '5', '3', 'c', 'c'), 'a': a, 'show': s, 'tol': 0.06,
              'sol': '3² + 5² = c² → 9 + 25 = c² → 34 = c² → c = √34 ≈ 5.831 ≈ 5.8'}
assert hyp(8, 15) == 17
T['np2-3'] = {'p': 'The legs are 8 and 15. Jon says c = 23, because 8 + 15 = 23. What is the correct value of c?', 'fig': fig_tri(15, 8, '15', '8', 'c', 'c'), 'a': '17', 'show': '17',
              'sol': 'Jon forgot to square the legs. 8² + 15² = c² → 64 + 225 = 289 → c = √289 = 17'}
# ---- 3. missing leg ----
assert 13 ** 2 - 5 ** 2 == 144
T['np3-1'] = {'p': 'One leg is 5 and the hypotenuse is 13. Find the other leg.', 'fig': fig_tri(12, 5, 'b', '5', '13', 'a'), 'a': '12', 'show': '12',
              'sol': '5² + b² = 13² → 25 + b² = 169 → b² = 169 − 25 = 144 → b = √144 = 12'}
a, s = roots(11 ** 2 - 6 ** 2, 'b'); assert 11 ** 2 - 6 ** 2 == 85 and a.startswith('9.2')
T['np3-2'] = {'p': 'One leg is 6 and the hypotenuse is 11. Find the other leg. Round to the nearest tenth (or give the exact √ answer).', 'fig': fig_tri(9.2, 6, 'b', '6', '11', 'a'), 'a': a, 'show': s, 'tol': 0.06,
              'sol': '6² + b² = 11² → 36 + b² = 121 → b² = 85 → b = √85 ≈ 9.220 ≈ 9.2'}
assert 17 ** 2 - 8 ** 2 == 225 and 8 + 15 + 17 == 40
T['np3-3'] = {'p': 'A right triangle has a hypotenuse of 17 and one leg of 8. What is its perimeter?', 'fig': fig_tri(15, 8, '?', '8', '17', 'a'), 'a': '40', 'show': '40',
              'sol': 'Missing leg: 8² + b² = 17² → 64 + b² = 289 → b² = 225 → b = 15. Perimeter = 8 + 15 + 17 = 40'}
# ---- 4. converse ----
assert is_right(9, 12, 15) and is_right(7, 24, 25) and not is_right(6, 9, 11) and is_right(12, 35, 37)
T['np4-1'] = {'p': 'A triangle has sides 9, 12, and 15. Is it a right triangle?', 'choices': ['Yes', 'No'], 'a': 'Yes', 'sol': '9² + 12² = 81 + 144 = 225 and 15² = 225. They are equal, so Yes.'}
T['np4-2'] = {'p': 'A triangle has sides 25, 7, and 24. Is it a right triangle?', 'choices': ['Yes', 'No'], 'a': 'Yes',
              'sol': 'Put the sides in order: 7, 24, 25. Test: 7² + 24² = 49 + 576 = 625 and 25² = 625. Equal, so Yes.'}
T['np4-3'] = {'p': 'A triangle has sides 6, 9, and 11. Is it a right triangle?', 'choices': ['Yes', 'No'], 'a': 'No', 'sol': '6² + 9² = 36 + 81 = 117, but 11² = 121. 117 ≠ 121, so No.'}
T['np4-4'] = {'p': 'A triangle has sides 12, 35, and x. The side x is the longest. What must x be for a right triangle?', 'a': '37', 'show': '37',
              'sol': 'For a right triangle, 12² + 35² = x² → 144 + 1225 = 1369 → x = √1369 = 37'}
# ---- 5. word problems ----
assert hyp(12, 5) == 13
T['np5-1'] = {'p': 'A rectangular park is 12 m long and 5 m wide. A path goes from one corner to the opposite corner. How long is the path?', 'a': '13|13 m', 'show': '13 m',
              'fig': fig_tri(12, 5, '12 m', '5 m', 'path', 'c'), 'sol': 'The path is the hypotenuse. 5² + 12² = c² → 25 + 144 = 169 → c = √169 = 13 m'}
assert 13 ** 2 - 5 ** 2 == 144
T['np5-2'] = {'p': 'A 13-foot ladder leans against a wall. The bottom is 5 feet from the wall. How high up the wall does it reach?', 'a': '12|12 ft|12 feet', 'show': '12 ft',
              'fig': fig_tri(5, 12, '5 ft', 'h', '13 ft', 'b'), 'sol': 'The ladder is the hypotenuse. 5² + h² = 13² → 25 + h² = 169 → h² = 144 → h = 12 ft'}
assert hyp(8, 6) == 10 and 8 + 6 - 10 == 4
T['np5-3'] = {'p': 'Ella walks 8 blocks east, then 6 blocks north. How many blocks shorter is the straight path back to where she started?', 'a': '4|4 blocks', 'show': '4 blocks',
              'sol': 'Straight path: 8² + 6² = 64 + 36 = 100 → √100 = 10 blocks. She walked 8 + 6 = 14 blocks. 14 − 10 = 4 blocks shorter.'}
# ---- 6. distance ----
assert hyp(12, 5) == 13
T['np6-1'] = {'p': 'Find the distance between (1,&nbsp;2) and (13,&nbsp;7).', 'a': '13', 'show': '13', 'fig': grid_pts((1, 2), (13, 7), 'points (1, 2) and (13, 7)', 0, 14),
              'sol': 'Across: 13 − 1 = 12. Up: 7 − 2 = 5. 12² + 5² = 144 + 25 = 169 → d = √169 = 13'}
a, s = roots(3 * 3 + 5 * 5, 'd')
T['np6-2'] = {'p': 'Find the distance between (−1,&nbsp;4) and (2,&nbsp;−1). Round to the nearest tenth (or give the exact √ answer).', 'a': a, 'show': s, 'tol': 0.06,
              'fig': grid_pts((-1, 4), (2, -1), 'points (−1, 4) and (2, −1)', -2, 5),
              'sol': 'Across: 2 − (−1) = 3. Down: 4 − (−1) = 5. 3² + 5² = 9 + 25 = 34 → d = √34 ≈ 5.831 ≈ 5.8'}
assert 10 ** 2 - 6 ** 2 == 64
T['np6-3'] = {'p': 'Point P is in Quadrant I. It is 10 units from (0,&nbsp;0), and its x-coordinate is 6. What is its y-coordinate?', 'a': '8', 'show': '8',
              'sol': 'The distance 10 is the hypotenuse and 6 is one leg. 6² + y² = 10² → 36 + y² = 100 → y² = 64 → y = 8. So P = (6, 8).'}
# ---- 7. comprehensive ----
T['np7-1'] = {'p': 'A right triangle has legs 8 and 15 and hypotenuse 17. Which equation is true?', 'choices': ['8² + 15² = 17²', '8² + 17² = 15²', '8 + 15 = 17'], 'a': '8² + 15² = 17²',
              'sol': 'The two legs go on the left. The hypotenuse goes alone on the right: 8² + 15² = 17² (64 + 225 = 289).'}
assert hyp(18, 24) == 30
T['np7-2'] = {'p': 'The legs of a right triangle are 18 and 24. Find the hypotenuse.', 'a': '30', 'show': '30', 'sol': '18² + 24² = c² → 324 + 576 = 900 → c = √900 = 30'}
assert is_right(15, 20, 25)
T['np7-3'] = {'p': 'A triangle has sides 15, 20, and 25. Is it a right triangle?', 'choices': ['Yes', 'No'], 'a': 'Yes', 'sol': '15² + 20² = 225 + 400 = 625 and 25² = 625. Equal, so Yes.'}
assert 61 ** 2 - 11 ** 2 == 3600
T['np7-4'] = {'p': 'One leg is 11 and the hypotenuse is 61. Find the other leg.', 'a': '60', 'show': '60', 'sol': '11² + b² = 61² → 121 + b² = 3721 → b² = 3600 → b = √3600 = 60'}
a, s = roots(3 * 3 + 4 * 4 + 1, 'c'); assert 9 + 4 * 4 + 1 == 26
a, s = roots(1 + 5 * 5, 'c')
T['np7-5'] = {'p': 'The legs are 1 and 5. Find the hypotenuse. Round to the nearest tenth (or give the exact √ answer).', 'a': a, 'show': s, 'tol': 0.06,
              'sol': '1² + 5² = c² → 1 + 25 = 26 → c = √26 ≈ 5.099 ≈ 5.1'}
assert a.startswith('5.1')
assert not is_right(9, 12, 16)
T['np7-6'] = {'p': 'A triangle has sides 9, 12, and 16. Is it a right triangle?', 'choices': ['Yes', 'No'], 'a': 'No', 'sol': '9² + 12² = 81 + 144 = 225, but 16² = 256. 225 ≠ 256, so No.'}
assert hyp(9, 40) == 41
T['np7-7'] = {'p': 'A plane flies 9 miles east, then 40 miles north. How far is it from where it started?', 'a': '41|41 miles|41 mi', 'show': '41 miles',
              'sol': 'The straight-line distance is the hypotenuse. 9² + 40² = 81 + 1600 = 1681 → √1681 = 41 miles'}
assert hyp(12, 5) == 13
T['np7-8'] = {'p': 'Find the distance between (−4,&nbsp;1) and (8,&nbsp;6).', 'a': '13', 'show': '13', 'fig': grid_pts((-4, 1), (8, 6), 'points (−4, 1) and (8, 6)', -5, 9),
              'sol': 'Across: 8 − (−4) = 12. Up: 6 − 1 = 5. 12² + 5² = 144 + 25 = 169 → d = √169 = 13'}
assert round(math.sqrt(72), 1) == 8.5
T['np7-9'] = {'p': 'A square has a diagonal of 12&nbsp;cm. How long is each side? Round to the nearest tenth (or give the exact √ answer).', 'a': '8.5|√72|sqrt72|sqrt(72)|√(72)|6√2', 'show': 's = √72 ≈ 8.5 cm', 'tol': 0.06,
              'sol': 'Both legs are the same length, s. s² + s² = 12² → 2s² = 144 → s² = 72 → s = √72 ≈ 8.485 ≈ 8.5 cm'}
assert hyp(6, 8) == 10 and 6 + 8 + 10 == 24
T['np7-10'] = {'p': 'A triangle has corners at (0,&nbsp;0), (6,&nbsp;0), and (6,&nbsp;8). What is its perimeter?', 'a': '24', 'show': '24',
               'sol': 'Bottom side: 6. Right side: 8. Slanted side: 6² + 8² = 36 + 64 = 100 → √100 = 10. Perimeter = 6 + 8 + 10 = 24'}

# ---- quick checks (page checker) ----
LV1, LV2, LV3 = '<span class="np-lv l1 lvb">★ Try it</span> ', '<span class="np-lv l2 lvb">★★ On level</span> ', '<span class="np-lv l3 lvb">★★★ Challenge</span> '
for id, (a, b) in {'u5h1': (6, 8), 'u5h2': (9, 12), 'u5h3': (8, 15), 'u5h4': (5, 12)}.items():
    c = hyp(a, b); assert c == int(c)
    T[id] = {'p': f'{LV1}Legs {a} and {b}: {a}² + {b}² = c² → c = ?', 'a': [str(int(c))], 'fig': fig_tri(b, a, str(b), str(a), 'c', 'c')}
assert is_right(8, 15, 17) and not is_right(5, 8, 10)
T['chk54a'] = {'p': f'{LV1}<span class="badge">MC</span> Sides 8, 15, 17 — right triangle?', 'choices': ['Yes', 'No'], 'a': 'Yes', 'why': '8² + 15² = 64 + 225 = 289; 17² = 289; 289 = 289 → YES, right triangle.'}
T['chk54b'] = {'p': f'{LV1}<span class="badge">MC</span> Sides 5, 8, 10 — right triangle?', 'choices': ['Yes', 'No'], 'a': 'No', 'why': '5² + 8² = 25 + 64 = 89; 10² = 100; 89 ≠ 100 → NO, not a right triangle.'}
A = {'u5pA1': (LV1, 6, 8), 'u5pA2': (LV1, 9, 12), 'u5pA3': (LV1, 8, 15), 'u5pA4': (LV1, 5, 12), 'u5pA5': (LV2, 9, 40), 'u5pA6': (LV2, 12, 16), 'u5pA7': (LV2, 7, 24), 'u5pA8': (LV2, 12, 35)}
for k, (id, (lv, a, b)) in enumerate(A.items(), 1):
    c = hyp(a, b); assert c == int(c), (a, b)
    T[id] = {'p': f'{lv}{k}) Legs {a}, {b}. c = ?', 'a': [str(int(c))], 'fig': fig_tri(b, a, str(b), str(a), 'c', 'c')}
B = {'u5pB1': (LV1, 3, 5), 'u5pB2': (LV1, 5, 13), 'u5pB3': (LV1, 6, 10), 'u5pB4': (LV1, 8, 17), 'u5pB5': (LV2, 12, 15), 'u5pB6': (LV2, 7, 25), 'u5pB7': (LV2, 21, 29), 'u5pB8': (LV2, 12, 20)}
for k, (id, (lv, a, c)) in enumerate(B.items(), 1):
    b = isqrt_exact(c * c - a * a); assert b, (a, c)
    T[id] = {'p': f'{lv}{k}) Known leg {a}, hyp {c}. Leg = ?', 'a': [str(b)], 'fig': fig_tri(b, a, '?', str(a), str(c), 'a')}
D = {'u5pD1': (LV1, (2, 1), (8, 9)), 'u5pD2': (LV1, (0, 0), (6, 8)), 'u5pD3': (LV2, (-3, 2), (2, 14)), 'u5pD4': (LV2, (2, -4), (5, 0)), 'u5pD5': (LV2, (-3, -1), (5, 14)), 'u5pD6': (LV1, (1, 3), (7, 11))}
for k, (id, (lv, p, q)) in enumerate(D.items(), 1):
    d = isqrt_exact((q[0] - p[0]) ** 2 + (q[1] - p[1]) ** 2); assert d
    lo, hi = min(p + q + (0,)) - 1, max(p + q + (0,)) + 1
    T[id] = {'p': f'{lv}{k}) ({fnum(p[0])},{fnum(p[1])}) → ({fnum(q[0])},{fnum(q[1])}). d = ?', 'a': [str(d)], 'fig': grid_pts(p, q, f'points {p} and {q}', lo, hi, 200)}
YES = ["yes", "y", "right", "right triangle", "yes it is"]
NO = ["no", "n", "not right", "no it is not", "not a right triangle"]
E = {'u5pE1': (LV1, 6, 8, 11), 'u5pE2': (LV2, 9, 12, 15), 'u5pE3': (LV1, 8, 14, 17), 'u5pE4': (LV2, 8, 15, 17), 'u5pE5': (LV3, 12, 35, 38), 'u5pE6': (LV3, 12, 35, 37)}
for k, (id, (lv, a, b, c)) in enumerate(E.items(), 1):
    r = is_right(a, b, c)
    assert r == (id in ('u5pE2', 'u5pE4', 'u5pE6'))
    lead = (f"Yes — {a}² + {b}² = {a*a+b*b}, and {c}² = {c*c}, so {a*a+b*b} = {c*c}" if r else f"No — {a}² + {b}² = {a*a+b*b}, and {c}² = {c*c}, so {a*a+b*b} ≠ {c*c}")
    T[id] = {'p': f'{lv}{k}) Sides {a}, {b}, {c} — right triangle? (type <em>yes</em> or <em>no</em>)', 'a': [lead] + (YES if r else NO)}
