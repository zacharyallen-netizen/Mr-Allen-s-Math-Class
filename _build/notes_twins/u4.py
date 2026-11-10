"""Unit 4 notes (unit4-notes.html): angle relationships, parallel lines, triangle sums, similarity.
Figures use geo-svg.js specs drawn to the twin's own numbers (parallel: angles 2, 3, 6, 7 = theta; 1, 4, 5, 8 = 180 − theta)."""
from twinlib import *

T = {}


def geo(spec, maxW=None):
    if maxW: spec['maxW'] = maxW
    return f"<div data-geo='{json.dumps(spec, ensure_ascii=False)}'></div>"


def par_angle(theta, n): return theta if n in (2, 3, 6, 7) else 180 - theta


def rays(a1, a2, l1, l2, total, alt, c1="blue", c2="gold"):
    r = [{"deg": 0}, {"deg": a1}, {"deg": total}]
    s = {"type": "rays", "rays": r, "angles": [{"from": 0, "to": a1, "label": l1, "c": c1}, {"from": a1, "to": total, "label": l2, "c": c2}], "alt": alt}
    if total == 90: s["right"] = [[0, 90]]
    return geo(s, 260 if total == 90 else 300)


# ---- Section 1: angle pairs ----
assert 90 - 34 == 56
T['np1-1'] = {'p': 'The two angles are complementary. Find x. Type just the number.', 'fig': rays(34, 90, '34°', 'x°', 90, 'a right angle split into 34 degrees and x degrees'),
              'a': '56', 'show': '56', 'sol': 'Complementary angles add to 90°. x + 34 = 90, so x = 90 − 34 = 56.'}
assert solve('x + 30 = 75') == 45
T['np1-2'] = {'p': 'Two lines cross. Find x.', 'fig': geo({"type": "cross", "theta": 75, "angles": [{"q": 1, "label": "75°", "c": "blue"}, {"q": 3, "label": "(x + 30)°", "c": "gold"}], "alt": "two crossing lines; a 75 degree angle and its vertical angle x plus 30"}, 260),
              'a': '45', 'show': '45', 'sol': 'The angles are across from each other, so they are vertical angles. Vertical angles are equal: x + 30 = 75. Subtract 30 from both sides: x = 45.'}
x = solve('(4x − 5) + (x + 15) = 180'); assert x == 34 and 4 * 34 - 5 == 131
T['np1-3'] = {'p': 'The two angles form a linear pair. Find x.', 'fig': rays(131, 180, '(4x − 5)°', '(x + 15)°', 180, 'a linear pair: angles 4x minus 5 and x plus 15'),
              'a': '34', 'show': '34', 'sol': 'A linear pair adds to 180°. (4x − 5) + (x + 15) = 180. Combine like terms: 5x + 10 = 180. Subtract 10: 5x = 170. Divide by 5: x = 34. Check: 4(34) − 5 = 131° and 34 + 15 = 49°, and 131° + 49° = 180° ✓'}

# ---- Section 2: parallel lines ----
T['np2-1'] = {'p': 'Lines m and n are parallel. What kind of angle pair are ∠4 and ∠6?', 'choices': ['Corresponding', 'Alternate interior', 'Same-side interior'], 'a': 'Same-side interior',
              'fig': geo({"type": "parallel", "theta": 60, "numbers": True, "marks": {"4": "4", "6": "6"}, "colors": {"4": "gold", "6": "gold"}, "lineNames": ["m", "n"], "tName": "t", "alt": "parallel lines m and n cut by transversal t, angles 4 and 6 shaded"}, 380),
              'sol': '∠4 and ∠6 are both between the parallel lines (interior). They are on the SAME side of t. So they are same-side interior angles, and they add to 180°.'}
assert par_angle(70, 3) == 70 == par_angle(70, 7)
T['np2-2'] = {'p': 'Lines m and n are parallel. Find x.', 'fig': geo({"type": "parallel", "theta": 70, "marks": {"3": "70°", "7": "x°"}, "colors": {"3": "blue", "7": "gold"}, "lineNames": ["m", "n"], "tName": "t", "alt": "parallel lines cut by a transversal: 70 degrees and x in matching corners"}, 380),
              'a': '70', 'show': '70', 'sol': 'The 70° angle and x are in the same corner at each crossing, so they are corresponding angles. Corresponding angles are equal: x = 70.'}
x = solve('2x + 20 = 4x − 30'); assert x == 25 and 2 * 25 + 20 == 70 == par_angle(70, 3) == par_angle(70, 6)
T['np2-3'] = {'p': 'Lines m and n are parallel. Find x.', 'fig': geo({"type": "parallel", "theta": 70, "gap": 80, "marks": {"3": "(2x + 20)°", "6": "(4x − 30)°"}, "colors": {"3": "blue", "6": "gold"}, "lineNames": ["m", "n"], "tName": "t", "alt": "alternate interior angles 2x plus 20 and 4x minus 30"}, 380),
              'a': '25', 'show': '25', 'sol': 'Alternate interior angles are equal: 2x + 20 = 4x − 30. Subtract 2x: 20 = 2x − 30. Add 30: 50 = 2x. Divide by 2: x = 25. Check: 2(25) + 20 = 70° and 4(25) − 30 = 70° ✓'}
x = solve('(3x + 10) + (x + 10) = 180'); assert x == 40 and 3 * 40 + 10 == 130 == par_angle(50, 4) and 40 + 10 == 50 == par_angle(50, 6)
T['np2-4'] = {'p': 'Lines m and n are parallel. Find x. Then find the measure of the angle marked (3x + 10)°.',
              'fig': geo({"type": "parallel", "theta": 50, "gap": 80, "marks": {"4": "(3x + 10)°", "6": "(x + 10)°"}, "colors": {"4": "blue", "6": "gold"}, "lineNames": ["m", "n"], "tName": "t", "alt": "same-side interior angles 3x plus 10 and x plus 10"}, 380),
              'a': '130', 'show': '130', 'sol': 'Both angles are between the lines on the same side of t, so they are same-side interior angles. They add to 180°: (3x + 10) + (x + 10) = 180 → 4x + 20 = 180 → 4x = 160 → x = 40. The angle is 3(40) + 10 = 130°. Check: the other angle is 40 + 10 = 50°, and 130° + 50° = 180° ✓'}

# ---- Section 3: triangles ----
assert 180 - 52 - 71 == 57
T['np3-1'] = {'p': 'Find x. Type just the number.', 'fig': geo({"type": "triangle", "A": 52, "B": 71, "angles": {"A": "52°", "B": "71°", "C": "x°"}, "colors": {"A": "blue", "B": "green", "C": "gold"}, "alt": "triangle with angles 52, 71 and x degrees"}, 270),
              'a': '57', 'show': '57', 'sol': 'The angles of a triangle add to 180°. x + 52 + 71 = 180 → x + 123 = 180 → x = 57.'}
# A = x = 64, C = 62, B = 54, exterior at B = 126
assert 180 - 64 - 62 == 54 and 180 - 54 == 126 and 126 - 62 == 64
T['np3-2'] = {'p': 'The exterior (outside) angle is 126°. Find x.', 'fig': geo({"type": "triangle", "A": 64, "B": 54, "angles": {"A": "x°", "C": "62°"}, "colors": {"A": "gold", "C": "blue"}, "exterior": {"at": "B", "label": "126°", "c": "green"}, "alt": "triangle with exterior angle 126 degrees and far inside angles x and 62"}, 320),
              'a': '64', 'show': '64', 'sol': 'Exterior Angle Theorem: the outside angle = the sum of the two far (remote) inside angles. x + 62 = 126. Subtract 62: x = 64.'}
x = solve('2x + 20 = 40 + (x + 15)'); assert x == 35 and 2 * 35 + 20 == 90
# A = 40, C = 50, B = 90 → exterior 90
T['np3-3'] = {'p': 'Find x. Then find the measure of the exterior angle, (2x + 20)°.', 'fig': geo({"type": "triangle", "A": 40, "B": 90, "angles": {"A": "40°", "C": "(x + 15)°"}, "colors": {"A": "blue", "C": "green"}, "exterior": {"at": "B", "label": "(2x + 20)°", "c": "gold"}, "alt": "triangle with far inside angles 40 and x plus 15 and exterior angle 2x plus 20"}, 330),
              'a': '90', 'show': '90', 'sol': 'Exterior angle = sum of the two far inside angles: 2x + 20 = 40 + (x + 15). Simplify: 2x + 20 = x + 55. Subtract x: x + 20 = 55. Subtract 20: x = 35. Exterior angle = 2(35) + 20 = 90°. Check: 40 + (35 + 15) = 90 ✓'}

# ---- Section 4: similarity ----
T['np4-1'] = {'p': 'Are these two triangles similar?', 'choices': ['Yes — two pairs of angles match', 'No — they are different sizes', 'You can’t tell'], 'a': 'Yes — two pairs of angles match',
              'fig': geo({"type": "similar", "A": 40, "B": 80, "k": 1.4, "angles": {"A": "40°", "B": "80°"}, "colors": {"A": "blue", "B": "green"}, "left": {"names": ["A", "B", "C"]}, "right": {"names": ["D", "E", "F"]}, "alt": "two triangles of different sizes, each with 40 and 80 degree angles"}, 380),
              'sol': '∠A = ∠D = 40° and ∠B = ∠E = 80°. Two pairs of angles match, so the triangles are similar by AA. Size does not matter.'}
assert 180 - 55 - 63 == 62
T['np4-2'] = {'p': '△ABC ~ △DEF. Find the measure of ∠F.', 'fig': geo({"type": "similar", "A": 55, "B": 63, "k": 1.35, "left": {"names": ["A", "B", "C"], "angles": {"A": "55°", "B": "63°"}, "colors": {"A": "blue", "B": "green"}}, "right": {"names": ["D", "E", "F"], "angles": {"C": "?"}, "colors": {"C": "gold"}}, "caption": "F matches C", "alt": "similar triangles ABC and DEF; angle A is 55, angle B is 63, angle F is unknown"}, 380),
              'a': '62', 'show': '62', 'sol': '∠C = 180 − 55 − 63 = 62°. ∠F corresponds to ∠C, so ∠F = 62°.'}
assert F(10, 4) * 8 == 20
T['np4-3'] = {'p': 'The triangles are similar. Side 4 matches side 10, and side 8 matches side x. Find x.', 'fig': geo({"type": "similar", "A": 60, "B": 70, "k": 1.6, "left": {"sides": {"AB": "4", "CA": "8"}}, "right": {"sides": {"AB": "10", "CA": "x"}}, "caption": "4 → 10 and 8 → x", "alt": "similar triangles with sides 4 and 8, and 10 and x"}, 380),
              'a': '20', 'show': '20', 'sol': 'Scale factor = 10 ÷ 4 = 2.5. So x = 8 × 2.5 = 20.'}
assert 180 - 50 - 60 == 70 and 180 - 50 - 75 == 55
T['np4-4'] = {'p': 'Triangle 1 shows 50° and 60°. Triangle 2 shows 50° and 75°. Lia says they ARE similar. Is Lia right?', 'choices': ['Yes — they are similar', 'No — they are not similar'], 'a': 'No — they are not similar',
              'fig': geo({"type": "triangle", "A": 50, "B": 60, "base": 200, "angles": {"A": "50°", "B": "60°", "C": "?"}, "colors": {"A": "blue", "B": "green", "C": "gold"}, "names": ["", "", ""], "alt": "triangle with angles 50 and 60"}, 210) +
                     geo({"type": "triangle", "A": 50, "B": 75, "base": 200, "angles": {"A": "50°", "B": "75°", "C": "?"}, "colors": {"A": "blue", "B": "green", "C": "gold"}, "names": ["", "", ""], "alt": "triangle with angles 50 and 75"}, 210),
              'sol': 'Triangle 1: third angle = 180 − 50 − 60 = 70°, so its angles are 50°, 60°, 70°. Triangle 2: third angle = 180 − 50 − 75 = 55°, so its angles are 50°, 75°, 55°. Only one pair (50°) matches. They are NOT similar, so Lia is not right.'}

# ---- Comprehensive practice (np5) ----
T['np5-1'] = {'p': 'The two angles are supplementary. Find x.', 'fig': rays(52, 180, '52°', 'x°', 180, 'supplementary angles 52 degrees and x'), 'a': '128', 'show': '128',
              'sol': 'Supplementary angles add to 180°. x + 52 = 180, so x = 180 − 52 = 128.'}
T['np5-2'] = {'p': 'Two lines cross. Find x.', 'fig': geo({"type": "cross", "theta": 64, "angles": [{"q": 1, "label": "64°", "c": "blue"}, {"q": 2, "label": "x°", "c": "gold"}], "alt": "two crossing lines; 64 degrees and the angle x next to it"}, 260),
              'a': '116', 'show': '116', 'sol': 'x and 64° sit side by side on a straight line, so they are a linear pair. x + 64 = 180, so x = 116. (They are not vertical angles — vertical angles are across from each other.)'}
assert par_angle(57, 1) == 123 == par_angle(57, 8)
T['np5-3'] = {'p': 'Lines m and n are parallel. Find x.', 'fig': geo({"type": "parallel", "theta": 57, "marks": {"1": "123°", "8": "x°"}, "colors": {"1": "blue", "8": "gold"}, "lineNames": ["m", "n"], "tName": "t", "alt": "alternate exterior angles 123 degrees and x"}, 380),
              'a': '123', 'show': '123', 'sol': 'The angles are outside the parallel lines and on opposite sides of t, so they are alternate exterior angles. They are equal: x = 123.'}
x = solve('3x + 14 = 104'); assert x == 30 and par_angle(76, 1) == 104 == par_angle(76, 5)
T['np5-4'] = {'p': 'Lines m and n are parallel. Find x.', 'fig': geo({"type": "parallel", "theta": 76, "marks": {"1": "104°", "5": "(3x + 14)°"}, "colors": {"1": "blue", "5": "gold"}, "lineNames": ["m", "n"], "tName": "t", "alt": "corresponding angles 104 degrees and 3x plus 14"}, 380),
              'a': '30', 'show': '30', 'sol': 'The angles are in the same corner at each crossing, so they are corresponding angles and are equal. 3x + 14 = 104. Subtract 14: 3x = 90. Divide by 3: x = 30.'}
assert par_angle(115, 4) == 65 and par_angle(115, 6) == 115
T['np5-5'] = {'p': 'Lines m and n are parallel. Jay says x = 65 because the angles “look the same.” Find the correct value of x.', 'fig': geo({"type": "parallel", "theta": 115, "marks": {"4": "65°", "6": "x°"}, "colors": {"4": "blue", "6": "gold"}, "lineNames": ["m", "n"], "tName": "t", "alt": "same-side interior angles 65 degrees and x"}, 380),
              'a': '115', 'show': '115', 'sol': 'The angles are between the lines and on the same side of t, so they are same-side interior angles. Those add to 180°, they are not equal. x + 65 = 180, so x = 115. Jay’s mistake: he set them equal.'}
T['np5-6'] = {'p': 'Find x. (The square corner is a right angle.)', 'fig': geo({"type": "triangle", "A": 41, "B": 90, "angles": {"A": "41°", "C": "x°"}, "colors": {"A": "blue", "C": "gold"}, "alt": "right triangle with a 41 degree angle and angle x"}, 250),
              'a': '49', 'show': '49', 'sol': 'A right angle is 90°. x + 41 + 90 = 180 → x + 131 = 180 → x = 49.'}
assert 180 - 44 - 68 == 68 and 44 + 68 == 112
T['np5-7'] = {'p': 'Find the exterior angle x.', 'fig': geo({"type": "triangle", "A": 44, "B": 68, "angles": {"A": "44°", "C": "68°"}, "colors": {"A": "blue", "C": "green"}, "exterior": {"at": "B", "label": "x°", "c": "gold"}, "alt": "triangle with inside angles 44 and 68 and exterior angle x"}, 320),
              'a': '112', 'show': '112', 'sol': 'Exterior Angle Theorem: x = 44 + 68 = 112.'}
x = solve('x + 3x + 60 = 180'); assert x == 30
T['np5-8'] = {'p': 'Find x.', 'fig': geo({"type": "triangle", "A": 30, "B": 90, "angles": {"A": "x°", "B": "3x°", "C": "60°"}, "colors": {"A": "gold", "B": "green", "C": "blue"}, "alt": "triangle with angles x, 3x and 60 degrees"}, 270),
              'a': '30', 'show': '30', 'sol': 'The angles add to 180°: x + 3x + 60 = 180. Combine like terms: 4x + 60 = 180. Subtract 60: 4x = 120. Divide by 4: x = 30. Check: 30 + 90 + 60 = 180 ✓'}
assert 180 - 58 - 47 == 75
T['np5-9'] = {'p': '△JKL ~ △MNP. Find x.', 'fig': geo({"type": "similar", "A": 58, "B": 47, "k": 1.35, "left": {"names": ["J", "K", "L"], "angles": {"A": "58°", "B": "47°"}, "colors": {"A": "blue", "B": "green"}}, "right": {"names": ["M", "N", "P"], "angles": {"C": "x°"}, "colors": {"C": "gold"}}, "caption": "P matches L", "alt": "similar triangles JKL and MNP; angle J is 58, angle K is 47, angle P is x"}, 380),
              'a': '75', 'show': '75', 'sol': '∠L = 180 − 58 − 47 = 75°. ∠P corresponds to ∠L, so x = 75.'}
assert F(18, 3) * 6 == 36
T['np5-10'] = {'p': 'A 6 ft person casts a 3 ft shadow. At the same time, a pole casts an 18 ft shadow. The two triangles are similar (AA). How tall is the pole? Type just the number.',
               'fig': geo({"type": "similar", "A": 63.43, "B": 90, "k": 1.7, "left": {"names": ["", "", ""], "sides": {"AB": "3 ft", "BC": "6 ft"}}, "right": {"names": ["", "", ""], "sides": {"AB": "18 ft", "BC": "h"}}, "caption": "person and shadow → pole and shadow (not to scale)", "alt": "two similar right triangles: a 6 foot person with a 3 foot shadow, and a pole of height h with an 18 foot shadow"}, 380),
               'a': '36', 'show': '36', 'sol': 'The sun hits both at the same angle, and both stand straight up (90°), so the triangles are similar by AA. Scale factor = 18 ÷ 3 = 6. Pole height h = 6 × 6 = 36 ft.'}

T['chk41a'] = {'p': '<span class="badge">MC</span> Two angles form a linear pair. One measures 128°. What is the other?', 'choices': ['52°', '62°', '232°'], 'a': '52°',
               'fig': rays(128, 180, '128°', '?', 180, 'a linear pair: 128 degrees and an unknown angle on a straight line'),
               'why': 'A linear pair adds to 180°. 180° − 128° = 52°.'}

# ---- Part 2 practice (chkVal, page checker) ----
LV1 = '<span class="np-lv l1 u4-lv">Score 3</span> '
LV2 = '<span class="np-lv l2 u4-lv">Score 4</span> '


def pv(id, lv, text, ans, fig, sol):
    T[id] = {'p': lv + text, 'a': [str(ans)], 'fig': fig, 'after': f'<div class="np-sol u4-sol" style="display:block">{sol}</div>'}


def pair(id, n, kind, given):
    if kind in ('Supplementary', 'Linear Pair'):
        x = 180 - given; fig = rays(x, 180, 'x°', f'{given}°', 180, f'{kind.lower()}: x and {given} degrees', 'gold', 'blue')
        sol = f"{'Supplementary angles add' if kind == 'Supplementary' else 'A linear pair adds'} to 180°: x = 180 − {given} = {x}."
    elif kind == 'Complementary':
        x = 90 - given; fig = rays(given, 90, f'{given}°', 'x°', 90, f'complementary: {given} degrees and x')
        sol = f"Complementary angles add to 90°: x = 90 − {given} = {x}."
    else:
        x = given; fig = geo({"type": "cross", "theta": given, "angles": [{"q": 1, "label": f"{given}°", "c": "blue"}, {"q": 3, "label": "x°", "c": "gold"}], "alt": f"vertical angles {given} degrees and x"}, 220)
        sol = f"Vertical angles are equal: x = {given}."
    label = {'Supplementary': 'Supplementary Angles', 'Complementary': 'Complementary Angles', 'Vertical': 'Vertical Angles', 'Linear Pair': 'Linear Pair'}[kind]
    assert 0 < x < 180
    pv(id, LV1, f'{n}) {label}, given {given}°. x = ?', x, fig, sol)


pair('u4pA1', 1, 'Supplementary', 140); pair('u4pA2', 2, 'Complementary', 38); pair('u4pA3', 3, 'Vertical', 66)
pair('u4pA4', 4, 'Linear Pair', 128); pair('u4pA5', 5, 'Complementary', 25); pair('u4pA6', 6, 'Supplementary', 115)
pair('u4pA7', 7, 'Vertical', 58); pair('u4pA8', 8, 'Linear Pair', 146); pair('u4pA9', 9, 'Complementary', 61); pair('u4pA10', 10, 'Supplementary', 102)


def par(id, n, kind, given):
    # choose theta so the drawing matches; given angle at a, x at b
    a, b = {'Corresponding': (2, 6), 'Alternate Interior': (3, 6), 'Alternate Exterior': (1, 8), 'Same-Side Interior': (4, 6)}[kind]
    theta = given if a in (2, 3, 6, 7) else 180 - given
    x = par_angle(theta, b); assert par_angle(theta, a) == given
    sol = f"Same-side interior angles add to 180°: x = 180 − {given} = {x}." if kind == 'Same-Side Interior' else f"{kind} angles are equal: x = {x}."
    if kind == 'Same-Side Interior': assert x == 180 - given
    else: assert x == given
    fig = geo({"type": "parallel", "theta": theta, "marks": {str(a): f"{given}°", str(b): "x°"}, "colors": {str(a): "blue", str(b): "gold"}, "lineNames": ["m", "n"], "tName": "t", "alt": f"parallel lines: {kind.lower()} angles {given} degrees and x"}, 300)
    pv(id, LV1, f'{n}) {kind}, given {given}°. x = ?', x, fig, sol)


par('u4pB1', 1, 'Corresponding', 70); par('u4pB2', 2, 'Alternate Interior', 115); par('u4pB3', 3, 'Alternate Exterior', 80); par('u4pB4', 4, 'Corresponding', 52)
par('u4pB5', 5, 'Alternate Interior', 125); par('u4pB6', 6, 'Same-Side Interior', 60); par('u4pB7', 7, 'Alternate Exterior', 98); par('u4pB8', 8, 'Same-Side Interior', 135)


def tri_sum(id, n, a, b):
    x = 180 - a - b; assert x > 0
    A, B = (a, b) if b != 90 else (a, 90)
    fig = geo({"type": "triangle", "A": A, "B": B, "angles": {"A": f"{a}°", "B": f"{b}°", "C": "x°"}, "colors": {"A": "blue", "B": "green", "C": "gold"}, "alt": f"triangle with angles {a}, {b} and x"}, 230)
    pv(id, LV1, f'{n}) Angle Sum, given {a}°, {b}°. x = ?', x, fig, f"The angles of a triangle add to 180°: x = 180 − {a} − {b} = {x}.")


tri_sum('u4pC1', 1, 70, 72); tri_sum('u4pC2', 2, 35, 90); tri_sum('u4pC3', 3, 58, 49); tri_sum('u4pC4', 4, 25, 90)
# C5: remotes 50, 70 → exterior 120 (B = 60)
assert 50 + 75 == 125 == 180 - 55
pv('u4pC5', LV1, '5) Exterior Angle Theorem, remotes 50°, 75°. Exterior x = ?', 125,
   geo({"type": "triangle", "A": 50, "B": 55, "angles": {"A": "50°", "C": "75°"}, "colors": {"A": "blue", "C": "green"}, "exterior": {"at": "B", "label": "x°", "c": "gold"}, "alt": "remote angles 50 and 75, exterior x"}, 280),
   'Exterior angle = sum of the two far inside angles: x = 50 + 75 = 125.')
assert 145 - 60 == 85 and 180 - 60 - 85 == 35 and 180 - 35 == 145
pv('u4pC6', LV1, '6) Exterior Angle Theorem, remote 60°, exterior = 145°. x = ?', 85,
   geo({"type": "triangle", "A": 60, "B": 35, "angles": {"A": "60°", "C": "x°"}, "colors": {"A": "blue", "C": "gold"}, "exterior": {"at": "B", "label": "145°", "c": "green"}, "alt": "remote angle 60 and x, exterior 145"}, 280),
   'Exterior angle = sum of the two far inside angles: x + 60 = 145, so x = 145 − 60 = 85.')
assert 115 - 42 == 73 and 180 - 42 - 73 == 65 and 180 - 65 == 115
pv('u4pC7', LV1, '7) Exterior Angle Theorem, remote 42°, exterior = 115°. x = ?', 73,
   geo({"type": "triangle", "A": 42, "B": 65, "angles": {"A": "42°", "C": "x°"}, "colors": {"A": "blue", "C": "gold"}, "exterior": {"at": "B", "label": "115°", "c": "green"}, "alt": "remote angle 42 and x, exterior 115"}, 280),
   'Exterior angle = sum of the two far inside angles: x + 42 = 115, so x = 115 − 42 = 73.')
tri_sum('u4pC8', 8, 55, 55)

# D: similarity
assert 180 - 45 - 75 == 60
pv('u4pD1', LV2, '1) AA Similarity — two angles match: 45° and 75°. x = ?', 60,
   geo({"type": "similar", "A": 45, "B": 75, "k": 1.3, "left": {"names": ["", "", ""], "angles": {"A": "45°", "B": "75°"}, "colors": {"A": "blue", "B": "green"}}, "right": {"names": ["", "", ""], "angles": {"A": "45°", "B": "75°", "C": "x°"}, "colors": {"A": "blue", "B": "green", "C": "gold"}}, "alt": "two triangles with 45 and 75 degree angles; the third angle of triangle 2 is x"}, 340),
   'Two angles match (45° and 75°), so the triangles are similar by AA. The third angle: x = 180 − 45 − 75 = 60.')
assert 180 - 40 - 72 == 68
pv('u4pD2', LV2, '2) △ABC ~ △DEF, given 40° and 72°. x = ?', 68,
   geo({"type": "similar", "A": 40, "B": 72, "k": 1.3, "left": {"names": ["A", "B", "C"], "angles": {"A": "40°", "B": "72°"}, "colors": {"A": "blue", "B": "green"}}, "right": {"names": ["D", "E", "F"], "angles": {"C": "x°"}, "colors": {"C": "gold"}}, "caption": "F matches C", "alt": "similar triangles; angles 40 and 72, angle F is x"}, 340),
   '∠C = 180 − 40 − 72 = 68°. ∠F corresponds to ∠C, so x = 68.')
assert 180 - 60 - 52 == 68
pv('u4pD3', LV2, '3) Parallel line inside a triangle, given 60° and 52°. x = ?', 68,
   geo({"type": "triangle", "A": 60, "B": 52, "angles": {"A": "60°", "B": "52°", "C": "x°"}, "colors": {"A": "blue", "B": "green", "C": "gold"}, "alt": "big triangle with base angles 60 and 52; a line parallel to the base cuts off a small top triangle with top angle x"}, 240),
   'A line parallel to the base cuts off a small top triangle. It has the same angles as the big one (corresponding angles). The three angles add to 180°: x = 180 − 60 − 52 = 68.')
assert F(10, 4) * 6 == 15
pv('u4pD4', LV2, '4) Similar triangles — sides 4 and 6 match 10 and x. x = ?', 15,
   geo({"type": "similar", "A": 60, "B": 70, "k": 1.5, "left": {"sides": {"AB": "4", "CA": "6"}}, "right": {"sides": {"AB": "10", "CA": "x"}}, "alt": "similar triangles: 4 and 6 match 10 and x"}, 340),
   'Scale factor = 10 ÷ 4 = 2.5. x = 6 × 2.5 = 15.')
assert 180 - 90 - 28 == 62
pv('u4pD5', LV2, '5) Similar right triangles, given 28°. x = ?', 62,
   geo({"type": "similar", "A": 28, "B": 90, "k": 1.3, "left": {"names": ["", "", ""], "angles": {"A": "28°"}, "colors": {"A": "blue"}}, "right": {"names": ["", "", ""], "angles": {"A": "28°", "C": "x°"}, "colors": {"A": "blue", "C": "gold"}}, "alt": "two right triangles with a 28 degree angle; the other angle is x"}, 340),
   'Both triangles have a 90° angle and a 28° angle, so they are similar by AA. x = 180 − 90 − 28 = 62.')
assert 180 - 55 - 60 == 65 and 180 - 55 - 65 == 60
pv('u4pD6', LV2, '6) Triangle 1: 55°, 65°. Triangle 2: 55°, 60°. Find x, Triangle 2’s third angle.', 65,
   geo({"type": "triangle", "A": 55, "B": 60, "base": 200, "angles": {"A": "55°", "B": "60°", "C": "x°"}, "colors": {"A": "blue", "B": "green", "C": "gold"}, "names": ["", "", ""], "alt": "triangle 2 with angles 55 and 60 and x"}, 210),
   'Triangle 2’s angles add to 180°: x = 180 − 55 − 60 = 65. (Triangle 1’s third angle is 180 − 55 − 65 = 60°, so Triangle 1 has 55°, 65°, 60° and Triangle 2 has 55°, 60°, 65°: they ARE similar.)')
