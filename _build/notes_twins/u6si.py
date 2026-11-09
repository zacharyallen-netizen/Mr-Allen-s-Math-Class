"""Unit 6 slope-intercept notes (unit6-notes-slope-intercept.html): y = x, y = −x, y = x ± 3, y = ½x, y = ½x + 4.
Each twin keeps its section's line and uses a new x."""
from twinlib import *

T = {}
H = F(1, 2)


def geo(spec): return f"<div class=\"si-fig\"><div data-geo='{json.dumps(spec, ensure_ascii=False)}'></div></div>"


def xline(m, b, lab, x, lo, hi):
    return geo({"type": "plane", "xmin": lo[0], "xmax": lo[1], "ymin": hi[0], "ymax": hi[1], "size": 200, "labelEvery": 2, "maxW": 240,
                "lines": [{"m": float(m), "b": float(b), "c": "blue"}], "alt": f"graph of {lab} with the line x = {fnum(x)} marked",
                "segments": [{"p": [x, hi[0]], "q": [x, hi[1]], "c": "gold", "dash": "5 4", "w": 2, "label": f"x = {fnum(x)}", "dy": -100}]})


def val(id, m, b, lab, x, p, sol, fig=None):
    y = F(m) * x + b
    T[id] = {'p': p.format(x=fnum(x)), 'a': plain(y) + ('|' + dec(y) if y.denominator != 1 else ''), 'show': fnum(y), 'sol': sol.format(x=fnum(x), y=fnum(y))}
    if fig: T[id]['fig'] = fig
    return y


assert val('np1-1', 1, 0, 'y = x', 9, 'For y = x, what is y when x = {x}?', 'y = x, so y = {y}.') == 9
assert val('np1-2', 1, 0, 'y = x', -3, 'For y = x, what is y when x = {x}?', 'y = x, so y = {y}. The negative sign stays.', xline(1, 0, 'y = x', -3, (-6, 6), (-6, 6))) == -3
pts = [(5, -5), (2, 3), (-4, -4), (0, 1)]; ok = [p for p in pts if p[1] == p[0]]; assert ok == [(-4, -4)]
T['np1-3'] = {'p': 'Which point is on the line y = x?', 'choices': ['(5, −5)', '(2, 3)', '(−4, −4)', '(0, 1)'], 'a': '(−4, −4)',
              'sol': 'On y = x, the x-value and y-value match. Only (−4, −4) has matching numbers.'}
assert val('np2-1', -1, 0, 'y = −x', 8, 'For y = −x, what is y when x = {x}?', 'y = −({x}) = {y}.') == -8
assert val('np2-2', -1, 0, 'y = −x', -3, 'For y = −x, what is y when x = {x}?', 'y = −(−3) = {y}. The opposite of −3 is 3.', xline(-1, 0, 'y = −x', -3, (-6, 6), (-6, 6))) == 3
T['np2-3'] = {'p': 'Leo says the point (4, 4) is on the line y = −x. Is he right?', 'choices': ['Yes, he is right', 'No. When x = 4, y = −4', 'No. When x = 4, y = 0'], 'a': 'No. When x = 4, y = −4',
              'sol': 'y = −(4) = −4. So the point on the line is (4, −4), not (4, 4). Leo forgot to take the opposite.'}
assert val('np3-1', 1, 3, 'y = x + 3', 6, 'For y = x + 3, what is y when x = {x}?', 'y = {x} + 3 = {y}.') == 9
assert val('np3-2', 1, 3, 'y = x + 3', -7, 'For y = x + 3, what is y when x = {x}?', 'y = {x} + 3 = {y}.', xline(1, 3, 'y = x + 3', -7, (-8, 4), (-5, 7))) == -4
assert solve('x + 3 = 15') == 12
T['np3-3'] = {'p': 'On the line y = x + 3, what x-value gives y = 15?', 'a': '12', 'show': '12', 'sol': '15 = x + 3. Subtract 3 from both sides: x = 12. Check: 12 + 3 = 15 ✓'}
assert val('np4-1', 1, -3, 'y = x − 3', 9, 'For y = x − 3, what is y when x = {x}?', 'y = {x} − 3 = {y}.') == 6
assert val('np4-2', 1, -3, 'y = x − 3', -4, 'For y = x − 3, what is y when x = {x}?', 'y = {x} − 3 = {y}.', xline(1, -3, 'y = x − 3', -4, (-6, 6), (-8, 4))) == -7
T['np4-3'] = {'p': 'Compare the graphs of y = x and y = x + 3. How is y = x + 3 different?', 'choices': ['It is moved up 3', 'It is moved down 3', 'It is steeper', 'It goes down instead of up'], 'a': 'It is moved up 3',
              'fig': geo({"type": "plane", "xmin": -6, "xmax": 6, "ymin": -6, "ymax": 6, "size": 200, "labelEvery": 2, "maxW": 240, "lines": [{"m": 1, "b": 0, "c": "blue", "label": "y = x", "labelAt": [4.4, 2.6]}, {"m": 1, "b": 3, "c": "green", "label": "y = x + 3", "labelAt": [-1.2, 4.8]}], "alt": "graphs of y = x and y = x + 3 on one grid"}),
              'sol': 'Every y-value is 3 more than on y = x, so the whole line moves up 3. It crosses the y-axis at 3 instead of 0.'}
assert val('np5-1', H, 0, 'y = ½x', 14, 'For y = ½x, what is y when x = {x}?', 'y = ½ · {x} = {y}.') == 7
assert val('np5-2', H, 0, 'y = ½x', -6, 'For y = ½x, what is y when x = {x}?', 'y = ½ · ({x}) = {y}.', xline(H, 0, 'y = ½x', -6, (-8, 8), (-6, 6))) == -3
T['np5-3'] = {'p': 'Which line is steeper: y = 2x or y = ½x?', 'choices': ['y = 2x', 'y = ½x', 'They are equally steep'], 'a': 'y = 2x',
              'sol': 'On y = 2x, y goes up 2 each time x goes up 1. On y = ½x, y only goes up ½. So y = 2x is steeper.'}
assert val('np6-1', H, 4, 'y = ½x + 4', 6, 'For y = ½x + 4, what is y when x = {x}?', 'y = ½ · {x} + 4 = 3 + 4 = {y}.') == 7
assert val('np6-2', H, 4, 'y = ½x + 4', -4, 'For y = ½x + 4, what is y when x = {x}?', 'y = ½ · ({x}) + 4 = −2 + 4 = {y}.', xline(H, 4, 'y = ½x + 4', -4, (-8, 4), (-2, 7))) == 2
assert H * 16 + 4 == 12
T['np6-3'] = {'p': 'A plant’s height after x weeks is y = ½x + 4 (in cm). How tall is it after 16 weeks? Type just the number.', 'a': '12', 'show': '12',
              'sol': 'y = ½ · 16 + 4 = 8 + 4 = 12. The plant is 12 cm tall.'}
T['np7-1'] = {'p': 'On the line y = −x, the x-value and the y-value are always…', 'choices': ['equal', 'opposites', '3 apart'], 'a': 'opposites',
              'sol': 'y = −x means y is the opposite of x. Example: (4, −4) and (−2, 2).'}
T['np7-2'] = {'p': 'Which line goes UP from left to right?', 'choices': ['y = −x', 'y = −x + 3', 'y = ½x', 'y = −2x'], 'a': 'y = ½x',
              'sol': 'A positive number in front of x makes the line go up as you move to the right. Only y = ½x has a positive slope.'}
assert -1 * -7 == 7
T['np7-3'] = {'p': 'Ava says that on y = −x, when x = −7, y = −7. What is the correct y?', 'a': '7', 'show': '7', 'sol': 'y = −(−7) = 7. Ava forgot that the opposite of a negative number is positive.'}
T['np7-4'] = {'p': 'Where does the line y = x − 3 cross the y-axis? Type the y-value.', 'a': '-3', 'show': '−3', 'sol': 'On the y-axis, x = 0. So y = 0 − 3 = −3. The line crosses at (0, −3).'}
pts = [(1, 2), (2, 5), (0, -3), (4, 1)]; ok = [p for p in pts if p[1] == p[0] + 3]; assert ok == [(2, 5)]
T['np7-5'] = {'p': 'Which point is on the line y = x + 3?', 'choices': ['(1, 2)', '(2, 5)', '(0, −3)', '(4, 1)'], 'a': '(2, 5)',
              'sol': "2 + 3 = 5 ✓ so (2, 5) works. The others don't: 1 + 3 = 4, 0 + 3 = 3, 4 + 3 = 7."}
T['np7-6'] = {'p': 'Which equation matches this graph?', 'choices': ['y = x + 3', 'y = x − 3', 'y = −x + 3', 'y = ½x + 3'], 'a': 'y = x + 3',
              'fig': geo({"type": "plane", "xmin": -6, "xmax": 6, "ymin": -6, "ymax": 6, "size": 200, "labelEvery": 2, "maxW": 240, "lines": [{"m": 1, "b": 3, "c": "navy"}], "alt": "Graph of a line through (0, 3) and (−3, 0)", "points": [{"x": 0, "y": 3}, {"x": -3, "y": 0}, {"x": 2, "y": 5}, {"x": -6, "y": -3}]}),
              'sol': 'The line crosses the y-axis at 3, so the equation ends in + 3. It goes up 1 for every 1 step right, like y = x. So it is y = x + 3.'}
assert H * 9 == F(9, 2)
T['np7-7'] = {'p': 'For y = ½x, what is y when x = 9? Type a decimal or a fraction.', 'a': '4.5|9/2', 'show': '4.5', 'sol': 'y = ½ · 9 = 4.5 (or 9/2).'}
tb = [(0, 2), (2, 3), (4, 4), (6, 5)]; assert all(y == H * x + 2 for x, y in tb)
T['np7-8'] = {'p': 'Which equation matches this table?', 'choices': ['y = x + 2', 'y = ½x + 2', 'y = ½x', 'y = 2x + 2'], 'a': 'y = ½x + 2',
              'fig': '<div class="si-fig"><table class="eq-table si-table"><thead><tr><th>x</th><th>y</th></tr></thead><tbody>' + ''.join(f'<tr><td>{x}</td><td>{y}</td></tr>' for x, y in tb) + '</tbody></table></div>',
              'sol': 'When x = 0, y = 2, so the equation ends in + 2. When x goes up 2, y goes up 1. That is ½x. Check x = 6: ½ · 6 + 2 = 5 ✓'}
assert val('np7-9', -1, 2, 'y = −x + 2', 6, 'For y = −x + 2, what is y when x = {x}?', 'y = −({x}) + 2 = −6 + 2 = {y}.', xline(-1, 2, 'y = −x + 2', 6, (-3, 8), (-6, 5))) == -4
