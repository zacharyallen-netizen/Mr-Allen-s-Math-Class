"""Unit 8 notes (unit8-notes.html): transformations. Figures use the page's TX drawer (data-tx). Answers computed here."""
from twinlib import *

T = {}


def tx(spec): return f"<div class=\"tx\" data-tx='{json.dumps(spec, ensure_ascii=False)}'></div>"


KEY = '<div class="fig-key"><b class="b">blue</b> = pre-image · <b class="g">gold dashed</b> = image</div>'


def pt(p): return f"({fnum(p[0])}, {fnum(p[1])})"


def tr(p, h, k): return (p[0] + h, p[1] + k)
def rx(p): return (p[0], -p[1])
def ry(p): return (-p[0], p[1])
def r90ccw(p): return (-p[1], p[0])
def r90cw(p): return (p[1], -p[0])
def r180(p): return (-p[0], -p[1])
def dil(p, k): return (F(p[0]) * k, F(p[1]) * k)


def mc(id, badge, p, choices, a, why, fig=None):
    assert a in choices and len(set(choices)) == len(choices)
    T[id] = {'p': f'<span class="badge">{badge}</span> {p}', 'choices': choices, 'a': a, 'why': '✓ ' + why}
    if fig: T[id]['fig'] = fig + KEY


mc('chk1a', 'Q1', 'A triangle is rotated 180° about the origin. The pre-image and image are…', ['Similar but not congruent', 'Congruent', 'Neither'], 'Congruent',
   'Rotation is a rigid transformation — size and shape are preserved, so the figures are congruent.',
   tx({"pre": [[1, 1], [4, 1], [1, 3]], "names": "ABC", "ops": [{"op": "R", "deg": 180, "cw": False}], "win": [-5, 5, -4, 4], "alt": "a triangle rotated 180 degrees about the origin"}))
mc('chk1b', 'Q2', 'A triangle is dilated by a scale factor of 2. The pre-image and image are…', ['Similar but not congruent', 'Congruent', 'Neither'], 'Similar but not congruent',
   'Dilation is non-rigid — the shape stays the same but size changes, so the figures are similar but not congruent.',
   tx({"pre": [[1, 1], [3, 1], [1, 3]], "names": "ABC", "ops": [{"op": "D", "k": 2}], "win": [-1, 7, -1, 7], "rule": True, "alt": "a triangle dilated by 2 from the origin"}))

pre = [[2, 1], [5, 1], [5, 4], [2, 4]]
a = pt(tr(pre[0], -3, 2)); assert a == '(−1, 3)'
mc('p-trans-1', 'P1', 'Rectangle WXYZ has vertices W(2, 1), X(5, 1), Y(5, 4), Z(2, 4). Translate the rectangle by the rule (x − 3, y + 2). What are the coordinates of W′?',
   ['(−1, 3)', '(5, −1)', '(−1, −1)', '(−3, 2)'], a, 'Apply (x − 3, y + 2) to W(2, 1): (2 − 3, 1 + 2) = (−1, 3). Every other vertex shifts the same way.',
   tx({"pre": pre, "names": "WXYZ", "ops": [{"op": "T", "h": -3, "k": 2}], "show": "p", "reveal": "1m", "legs": 0, "rule": True, "hint": "the answer picture appears after you answer", "win": [-2, 6, -1, 7], "alt": "rectangle WXYZ on a coordinate plane"}))
p = (-2, 3); a = tr(p, 4, -3); assert a == (2, 0)
T['p-trans-2'] = {'p': '<span class="badge">P2</span> Hexagon ABCDEF has vertex B(−2, 3). The whole hexagon is translated by (x + 4, y − 3). Type the coordinates of B′.', 'xy': [2, 0],
                  'why': f'✓ B(−2, 3) → B′(−2 + 4, 3 − 3) = (2, 0). All six vertices shift by the same rule.'}
pre = [[0, 0], [3, 0], [4, 2], [1, 2]]; img = tr(pre[0], 3, -4); assert img == (3, -4)
mc('p-trans-3', 'P3', 'Parallelogram PQRS was translated to P′Q′R′S′ (shown). P(0, 0) maps to P′(3, −4). Which rule was used?',
   ['(x + 3, y − 4)', '(x − 3, y + 4)', '(x − 4, y + 3)', '(x + 3, y + 4)'], '(x + 3, y − 4)', 'P(0, 0) → P′(3, −4) means x increased by 3 and y decreased by 4. Rule: (x + 3, y − 4).',
   tx({"pre": pre, "names": "PQRS", "ops": [{"op": "T", "h": 3, "k": -4}], "show": "p1m", "arrows": [0], "legs": 0, "legsReveal": True, "rule": True, "ruleReveal": True, "hint": "the rule appears after you answer", "win": [-1, 8, -5, 3], "alt": "parallelogram PQRS and its image after a translation"}))
pre = [[1, 2], [4, 2], [4, 4], [1, 4]]
mc('p-refl-1', 'P1', 'Rectangle ABCD has vertex B(4, 2). The whole rectangle is reflected over the x-axis. What are the coordinates of B′?',
   ['(4, −2)', '(−4, 2)', '(−4, −2)', '(2, 4)'], pt(rx(pre[1])), 'Reflect over the x-axis: (x, y) → (x, −y). B(4, 2) → B′(4, −2).',
   tx({"pre": pre, "names": "ABCD", "ops": [{"op": "Rx"}], "show": "pm", "reveal": "1", "rule": True, "hint": "the answer picture appears after you answer", "win": [-1, 6, -5, 5], "alt": "rectangle ABCD and the x-axis mirror"}))
assert pt(rx(pre[1])) == '(4, −2)'
p = (3, 5); assert ry(p) == (-3, 5)
T['p-refl-2'] = {'p': '<span class="badge">P2</span> Trapezoid KLMN has vertex N(3, 5). The whole trapezoid is reflected over the y-axis. Type the coordinates of N′.', 'xy': [-3, 5],
                 'why': '✓ Reflect over the y-axis: (x, y) → (−x, y). N(3, 5) → N′(−3, 5).'}
pre = [[1, 1], [3, 1], [4, 3], [2, 5], [0, 3]]; assert ry(tuple(pre[2])) == (-4, 3)
mc('p-refl-3', 'P3', 'Pentagon ABCDE was reflected to A′B′C′D′E′ (shown). Which line is the mirror (line of reflection)?', ['the x-axis', 'the y-axis', 'the line y = x', 'the line y = 2'], 'the y-axis',
   'Each image point has the same y but the opposite x (e.g., C(4, 3) → C′(−4, 3)). That\'s the rule for reflection over the y-axis.',
   tx({"pre": pre, "names": "ABCDE", "ops": [{"op": "Ry"}], "show": "p1", "reveal": "m", "hint": "the mirror line appears after you answer", "win": [-6, 6, -1, 6], "alt": "pentagon ABCDE and its reflection"}))
pre = [[2, 1], [4, 1], [4, 4], [2, 4]]; a = pt(r180(pre[1])); assert a == '(−4, −1)'
mc('p-rot-1', 'P1', 'Rectangle PQRS has vertex Q(4, 1). The whole rectangle is rotated 180° about the origin. What are the coordinates of Q′?', ['(−4, −1)', '(4, −1)', '(−1, −4)', '(1, 4)'], a,
   '180° rule: (x, y) → (−x, −y). Q(4, 1) → Q′(−4, −1). Both signs flip.',
   tx({"pre": pre, "names": "PQRS", "ops": [{"op": "R", "deg": 180, "cw": False}], "turnAt": 1, "show": "pm", "reveal": "1", "rule": True, "hint": "the answer picture appears after you answer", "win": [-5, 5, -5, 5], "alt": "rectangle PQRS on a coordinate plane"}))
p = (3, 4); assert r90ccw(p) == (-4, 3)
T['p-rot-2'] = {'p': '<span class="badge">P2</span> L-shape ABCDEF has vertex C(3, 4). The whole shape is rotated 90° counterclockwise (CCW) about the origin. Type the coordinates of C′.', 'xy': [-4, 3],
                'why': '✓ 90° CCW rule: (x, y) → (−y, x). C(3, 4) → C′(−4, 3). Every vertex follows the same rule.'}
pre = [[1, 1], [4, 1], [3, 3], [2, 3]]; assert r90ccw((1, 1)) == (-1, 1) and r90ccw((4, 1)) == (-1, 4)
mc('p-rot-3', 'P3', 'Trapezoid ABCD was rotated to A′B′C′D′ (shown). All rotations are about the origin. Which rotation was used?',
   ['90° clockwise (CW)', '90° counterclockwise (CCW)', '180°', '270° counterclockwise (CCW)'], '90° counterclockwise (CCW)',
   'Check A(1, 1) → A′(−1, 1). The rule (x, y) → (−y, x) is 90° CCW. Also matches B(4, 1) → B′(−1, 4).',
   tx({"pre": pre, "names": "ABCD", "ops": [{"op": "R", "deg": 90, "cw": False}], "turnAt": 0, "show": "p1", "reveal": "m", "hint": "the turn appears after you answer", "win": [-5, 5, -1, 5], "alt": "trapezoid ABCD and its rotated image"}))
pre = [[1, 2], [3, 0], [-1, -1]]; a = pt(dil(pre[0], 3)); assert a == '(3, 6)'
mc('chk5a', 'P1', 'Triangle ABC has vertices A(1, 2), B(3, 0), C(−1, −1). The triangle is dilated by scale factor k = 3 (centered at origin). What are the new coordinates of A′?',
   ['(3, 6)', '(4, 5)', '(1, 6)', '(⅓, ⅔)'], a, 'Multiply both coordinates by 3: A′ = (1 · 3, 2 · 3) = (3, 6). Apply the same rule to B and C: B′(9, 0), C′(−3, −3).',
   tx({"pre": pre, "names": "ABC", "ops": [{"op": "D", "k": 3}], "show": "pm", "reveal": "1", "rule": True, "hint": "the answer picture appears after you answer", "win": [-4, 10, -4, 7], "alt": "triangle ABC on a coordinate plane"}))
assert pt(dil((3, 0), 3)) == '(9, 0)' and pt(dil((-1, -1), 3)) == '(−3, −3)'
p = (8, -6); assert dil(p, F(1, 2)) == (4, -3)
T['chk5b'] = {'p': '<span class="badge">P2</span> Triangle ABC has vertices A(2, 6), B(8, −6), C(−4, 0). The triangle is dilated by k = ¹⁄₂ (centered at origin). Type the new coordinates of vertex B′:', 'xy': [4, -3],
              'why': '✓ Multiply both coordinates by ½: B(8, −6) → B′(4, −3).'}
mc('chk5c', 'P3', 'A figure is dilated and the image is larger than the pre-image. The scale factor k must be…', ['greater than 1', 'equal to 1', 'between 0 and 1', 'negative'], 'greater than 1',
   'A scale factor greater than 1 (like 2 or 3.5) produces an enlargement — the image is bigger.')
assert (5 * 3, 12 * 3, 13 * 3) == (15, 36, 39)
mc('chk6a', 'P1', 'Triangle A has side lengths 5, 12, 13. Triangle B has side lengths 15, 36, 39 and the same angles. Triangles A and B are…', ['congruent', 'similar', 'neither'], 'similar',
   "Same shape, but B's sides are 3× A's sides. They are similar (related by a dilation with k = 3) but NOT congruent.")
mc('chk6b', 'P2', 'A triangle is reflected over the y-axis, then translated 3 units down. The pre-image and image are…', ['congruent', 'similar but not congruent', 'neither'], 'congruent',
   'Both transformations are rigid (no dilation). Size and shape are preserved → congruent.')
mc('chk6c', 'P3', 'Which transformation can change the size of a figure?', ['translation', 'reflection', 'rotation', 'dilation'], 'dilation',
   'Dilation is the only one that resizes the figure (changes side lengths). Translations, reflections and rotations keep the same size.')
mc('chk6d', '⭐ Challenge', 'A hexagon undergoes a sequence: rotation 180°, translation 4 units left, then reflection over the x-axis. The pre-image and image are…', ['congruent', 'similar but not congruent', 'neither'], 'congruent',
   'Rotations, translations and reflections are all rigid. No dilation, so size and shape stay the same → congruent.')

# Nov 11, 2026: twins for the three Score 5 questions P5-P7 (_build/notes_score5_nov11.py)
mc('chk6e', 'P5', 'A triangle is rotated 180° and then dilated by k = 3. How does the AREA of the image compare with the pre-image?', ['The same', '3 times as large', '6 times as large', '9 times as large'], '9 times as large',
   'The rotation keeps the size. The dilation triples the base AND the height, so the area is 3 × 3 = 9 times as large.')
assert rx(tr((1, 3), 0, 2)) == (1, -5) and tr(rx((1, 3)), 0, 2) == (1, -1)
mc('chk6f', 'P6', 'Point P(1, 3) is translated 2 units up, then reflected over the x-axis. Do you get the same image if you reflect FIRST and then translate?',
   ['Yes. The order never matters.', 'Yes. Both give (1, −5).', 'No. Translate then reflect gives (1, −5). Reflect then translate gives (1, −1).', 'No. Translate then reflect gives (−1, 5).'],
   'No. Translate then reflect gives (1, −5). Reflect then translate gives (1, −1).', 'Translate first: (1, 3) → (1, 5) → (1, −5). Reflect first: (1, 3) → (1, −3) → (1, −1). The order can change the image.')
mc('chk6g', 'P7', 'Rectangle PQRS is mapped to WXYZ by a reflection and then a dilation by k = 2. Mia says the rectangles are congruent. Who is right?',
   ['Mia is right. A reflection is rigid.', 'Mia is wrong. The dilation changes the size, so they are similar but not congruent.', 'Mia is right. Rectangles are always congruent.', 'Mia is wrong. They are neither congruent nor similar.'],
   'Mia is wrong. The dilation changes the size, so they are similar but not congruent.', 'One dilation is enough to change the size. The shape stays the same, so the rectangles are similar, not congruent.')

# Nov 10, 2026: Score 3/4/5 labels (same levels as the questions on unit8-notes.html); the old "⭐ Challenge" badge is P4
import re as _re
LV8 = {'chk1a': 3, 'chk1b': 3, 'p-trans-1': 3, 'p-trans-2': 4, 'p-trans-3': 4, 'p-refl-1': 3, 'p-refl-2': 4, 'p-refl-3': 4,
       'p-rot-1': 4, 'p-rot-2': 5, 'p-rot-3': 4, 'chk5a': 4, 'chk5b': 5, 'chk5c': 3, 'chk6a': 4, 'chk6b': 4, 'chk6c': 3, 'chk6d': 5, 'chk6e': 5, 'chk6f': 5, 'chk6g': 5}
for _k, _l in LV8.items():
    T[_k]['p'] = _re.sub(r'(<span class="badge">)⭐ Challenge(</span>)', r'\1P4\2', T[_k]['p'])
    T[_k]['p'] = _re.sub(r'(<span class="badge">[^<]*</span>)', lambda m: m.group(1) + ' <span class="np-lv l%d">Score %d</span>' % ({3: 1, 4: 2, 5: 3}[_l], _l), T[_k]['p'], count=1)
