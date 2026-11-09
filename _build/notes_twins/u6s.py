"""Unit 6 slope notes (unit6-notes-slope.html). Figures: geo-svg 'plane'."""
from twinlib import *

T = {}


def geo(spec): return f"<div class=\"graph-area geo-fig\"><div class=\"geo\" data-geo='{json.dumps(spec, ensure_ascii=False)}'></div></div>"


def P(p): return f"({fnum(p[0])}, {fnum(p[1])})"


def slope(p, q): return None if q[0] == p[0] else F(q[1] - p[1], q[0] - p[0])


def frac_txt(v): return fnum(v)


def plane_pts(p, q, line=False, marks=True, every=1, maxW=280):
    xs, ys = [p[0], q[0], 0], [p[1], q[1], 0]
    x0, x1, y0, y1 = min(xs) - 1, max(xs) + (2 if marks else 1), min(ys) - 1, max(ys) + 1
    while (x1 - x0) < 0.75 * (y1 - y0): x0 -= 1; x1 += 1
    qpos = "e" if q[0] == p[0] else ("n" if q[1] > p[1] else "s")
    s = {"type": "plane", "xmin": x0, "xmax": x1, "ymin": y0, "ymax": y1, "size": 210, "labelEvery": every, "maxW": maxW,
         "points": [{"x": p[0], "y": p[1], "label": P(p), "pos": "w", "c": "blue"}, {"x": q[0], "y": q[1], "label": P(q), "pos": qpos, "c": "blue"}], "alt": f"the points {P(p)} and {P(q)}"}
    if line: s["lines"] = [{"p": list(p), "q": list(q), "c": "blue"}]
    if marks:
        seg = []
        if q[0] != p[0]: seg.append({"p": list(p), "q": [q[0], p[1]], "c": "green", "dash": "6 4", "label": "run = ?", "dy": 16})
        if q[1] != p[1]: seg.append({"p": [q[0], p[1]], "q": list(q), "c": "gold", "dash": "6 4", "label": "rise = ?", "dx": 34, "dy": 4})
        s["segments"] = seg
    return geo(s)


def formula(p, q):
    num, den = q[1] - p[1], q[0] - p[0]
    sub = lambda a, b: f"{fnum(a)} − {'(' + fnum(b) + ')' if b < 0 else fnum(b)}"
    if den == 0:
        return f"m = <span class=\"frac-inline\"><span class=\"fn\">{sub(q[1], p[1])}</span><span class=\"fb\"></span><span class=\"fd\">{sub(q[0], p[0])}</span></span> = <span class=\"frac-inline\"><span class=\"fn\">{fnum(num)}</span><span class=\"fb\"></span><span class=\"fd\">0</span></span>. We can't divide by 0, so the slope is undefined (a vertical line)."
    m = F(num, den)
    s = f"m = <span class=\"frac-inline\"><span class=\"fn\">{sub(q[1], p[1])}</span><span class=\"fb\"></span><span class=\"fd\">{sub(q[0], p[0])}</span></span> = <span class=\"frac-inline\"><span class=\"fn\">{fnum(num)}</span><span class=\"fb\"></span><span class=\"fd\">{fnum(den)}</span></span>"
    if m.denominator == 1: return s + f" = {fnum(m)}."
    if math.gcd(abs(num), abs(den)) > 1 or den < 0: return s + f". Simplify: {fnum(m)}."
    return s + '.'


def ans_of(m):
    if m is None: return 'undefined', 'undefined'
    if m.denominator == 1: return plain(m), fnum(m)
    d = dec(m) if (m * 100).denominator == 1 else None
    return plain(m) + (('|' + d) if d else ''), fnum(m)


T['np1-1'] = {'p': 'In y = mx + b, what does the letter b stand for?', 'choices': ['the slope', 'the y-intercept', 'the x-value'], 'a': 'the y-intercept',
              'sol': 'In y = mx + b, b is the y-intercept: where the line crosses the y-axis. (m is the slope.)'}
T['np1-2'] = {'p': 'What is the slope of y = −3x + 5? Type just the number.', 'a': '-3', 'show': '−3',
              'sol': 'Match it to y = mx + b. The number in front of x is m, so m = −3. (5 is b, the y-intercept.)'}
assert F(2, 5) * 20 == 8
T['np1-3'] = {'p': 'This hill goes right 5 and up 2. If you walk right 20 on the same hill, how far up do you climb?', 'a': '8', 'show': '8',
              'fig': geo({"type": "plane", "xmin": -1, "xmax": 11, "ymin": -1, "ymax": 6, "size": 210, "labelEvery": 2, "maxW": 280, "lines": [{"p": [0, 1], "q": [10, 5], "c": "blue"}], "slopeTri": {"p": [0, 1], "q": [5, 3]}, "alt": "a hill line that goes right 5 and up 2"}),
              'sol': 'Right 20 is 4 groups of right 5. Each group climbs 2. So you climb 2 + 2 + 2 + 2 = 8. The slope stays the same: 2/5 = 8/20.'}
T['np2-1'] = {'p': 'What type of slope does this line have?', 'choices': ['Positive', 'Negative', 'Zero', 'Undefined'], 'a': 'Positive',
              'fig': geo({"type": "plane", "xmin": -5, "xmax": 5, "ymin": -5, "ymax": 5, "size": 170, "labelEvery": 5, "maxW": 220, "lines": [{"p": [-4, -2], "q": [4, 3], "c": "navy"}], "alt": "a line going up from left to right"}),
              'sol': 'Reading left to right, the line goes up (uphill). So the slope is positive.'}
assert slope((3, 1), (3, 5)) is None
T['np2-2'] = {'p': 'A line goes through (3, 1) and (3, 5). What type of slope does it have?', 'choices': ['Positive', 'Negative', 'Zero', 'Undefined'], 'a': 'Undefined',
              'fig': geo({"type": "plane", "xmin": -1, "xmax": 6, "ymin": -1, "ymax": 6, "size": 190, "labelEvery": 1, "maxW": 250, "points": [{"x": 3, "y": 1, "label": "(3, 1)", "pos": "e", "c": "blue"}, {"x": 3, "y": 5, "label": "(3, 5)", "pos": "e", "c": "blue"}], "alt": "the points (3, 1) and (3, 5) on a grid"}),
              'sol': 'Both points have x = 3, so the line goes straight up and down (vertical). The run is 0, and we can’t divide by 0. The slope is undefined.'}
T['np2-3'] = {'p': 'Which equation has a positive slope?', 'choices': ['y = −4x + 1', 'y = −x − 3', 'y = 2x − 6', 'y = −5x'], 'a': 'y = 2x − 6',
              'sol': 'The slope is the number in front of x: −4, −1, 2 and −5. Only 2 is positive, so y = 2x − 6 goes uphill.'}
p, q = (1, 1), (3, 7); assert slope(p, q) == 3
T['np3-1'] = {'p': 'Count the rise and the run from one dot to the other. What is the slope?', 'a': '3', 'show': '3', 'fig': plane_pts(p, q, True),
              'sol': 'Rise: up 6 (from y = 1 to y = 7). Run: right 2 (from x = 1 to x = 3). Slope = 6/2 = 3.'}
p, q = (0, 7), (2, 1); assert slope(p, q) == -3
T['np3-2'] = {'p': 'Find the slope of this line. Use the two dots.', 'a': '-3', 'show': '−3', 'fig': plane_pts(p, q, True, False),
              'sol': 'From (0, 7), count down 6 to y = 1: rise = −6. Then right 2: run = 2. Slope = −6/2 = −3.'}
p, q = (-2, -2), (2, 1); assert slope(p, q) == F(3, 4)
T['np3-3'] = {'p': 'Find the slope of this line. Write it as a fraction in simplest form, like 3/4.', 'a': '3/4|0.75', 'show': '3/4', 'tol': 0.01, 'fig': plane_pts(p, q, True, False),
              'sol': 'Rise: up 3 (from −2 to 1). Run: right 4 (from −2 to 2). Slope = 3/4.'}
p, q = (2, 1), (4, 9); assert slope(p, q) == 4
T['np4-1'] = {'p': 'Use the slope formula to find the slope through (2, 1) and (4, 9).', 'a': '4', 'show': '4', 'fig': plane_pts(p, q, False, False), 'sol': formula(p, q)}
p, q = (-3, 2), (3, -2); m = slope(p, q); assert m == F(-2, 3)
T['np4-2'] = {'p': 'Find the slope through (−3, 2) and (3, −2). Write a fraction in simplest form.', 'a': '-2/3', 'show': '−2/3', 'tol': 0.01, 'fig': plane_pts(p, q, False, False), 'sol': formula(p, q)}
assert slope((1, 2), (5, 14)) == 3
T['np4-3'] = {'p': 'A line goes through (1, 2) and (5, y). Its slope is 3. What is y?', 'a': '14', 'show': '14',
              'sol': 'Run: 5 − 1 = 4. Slope 3 means rise ÷ 4 = 3, so the rise is 12. y = 2 + 12 = 14. Check: (14 − 2)/(5 − 1) = 12/4 = 3 ✓'}
T['np5-1'] = {'p': 'What does the y-intercept tell you?', 'choices': ['Where a line crosses the y-axis', 'How steep a line is', 'How long a line is'], 'a': 'Where a line crosses the y-axis',
              'sol': 'The y-intercept (b) is where the line crosses the y-axis, at (0, b). How steep the line is, is the slope.'}


def pv(id, p, q, lv_prompt):
    m = slope(p, q); a, show = ans_of(m)
    T[id] = {'p': lv_prompt.format(P=P(p), Q=P(q)), 'a': a, 'show': show, 'fig': plane_pts(p, q, False, True, 2), 'sol': formula(p, q)}
    return m


assert pv('p1', (2, 1), (5, 10), 'Find the slope through {P} and {Q}.') == 3
assert pv('p2', (1, 9), (3, 3), 'Find the slope through {P} and {Q}.') == -3
assert pv('p3', (-3, -2), (3, 2), 'Find the slope through {P} and {Q}. If the answer is a fraction, type it as a/b (like 3/4).') == F(2, 3)
assert pv('p4', (-2, 6), (2, -6), 'Find the slope through {P} and {Q}.') == -3
assert pv('p5', (-3, 5), (4, 5), 'Find the slope through {P} and {Q}. Type “undefined” if the slope is undefined.') == 0
assert pv('p6', (3, -2), (3, 6), 'Find the slope through {P} and {Q}. Type “undefined” if the slope is undefined.') is None
T['np5-3'] = {'p': 'Mia says, “A horizontal line has an undefined slope.” Is Mia right?', 'choices': ['Yes, a horizontal line has an undefined slope', 'No, a horizontal line has a slope of 0', 'No, a horizontal line has a positive slope'],
              'a': 'No, a horizontal line has a slope of 0', 'sol': 'No. A horizontal (flat) line has rise = 0, and 0 ÷ run = 0. So its slope is 0. A vertical line is the one with an undefined slope.'}
p, q = (0, 1), (5, -2); assert slope(p, q) == F(-3, 5)
T['np5-5'] = {'p': 'What is the slope of this line? Write a fraction, like 1/2.', 'a': '-3/5|-0.6', 'show': '−3/5', 'fig': plane_pts(p, q, True, False),
              'sol': 'Rise: down 3 (from 1 to −2), so rise = −3. Run: right 5 (from 0 to 5). Slope = −3/5.'}
assert F(3, 12) == F(1, 4)
T['np5-10'] = {'p': 'A ramp rises 3 feet over a run of 12 feet. What is its slope? Write a fraction in simplest form.', 'a': '1/4|0.25|3/12', 'show': '1/4',
               'fig': geo({"type": "righttri", "a": 12, "b": 3, "unitPx": 14, "labels": {"a": "run = 12 ft", "b": "rise = 3 ft", "c": "ramp"}, "maxW": 260, "alt": "a ramp: a right triangle with a run of 12 feet and a rise of 3 feet"}),
               'sol': 'slope = rise/run = 3/12. Divide top and bottom by 3: 1/4.'}
assert slope((2, 3), (5, 11)) == F(8, 3) and slope((2, 1), (4, 9)) == 4
T['np5-11'] = {'p': 'A line goes through (2, 1) and (x, 9). Its slope is 4. What is x?', 'a': '4', 'show': '4',
               'sol': 'Rise: 9 − 1 = 8. Slope 4 means 8 ÷ run = 4, so the run is 2. x = 2 + 2 = 4. Check: (9 − 1)/(4 − 2) = 8/2 = 4 ✓'}
