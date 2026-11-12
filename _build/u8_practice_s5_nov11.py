#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Two Score 5 problems added to Unit 8 Extra Practice (grade8/unit8-practice.html), Nov 11, 2026
(Zach: "add 2 score 5 questions to Unit 8 ... Make sure to have visuals"). The page had 1 Score 5 of 12.
From his NC.8.G.3 / NC.8.G.2 proficiency scales (Score 5: effect of a dilation on AREA; justify congruent vs. similar
after a sequence that includes a dilation). Both have a coordinate-plane picture drawn by the page's own TX helper,
and every wrong choice names its mistake (data-why, shown by mc()). Problems are renumbered 1-14.
Safe to run again (it replaces its own cards).      python3 _build/u8_practice_s5_nov11.py
"""
import os, re
from fractions import Fraction as F
P = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'grade8', 'unit8-practice.html')
s = open(P, encoding='utf-8').read()
s = re.sub(r'\n*<!-- U8S5 -->.*?<!-- /U8S5 -->', '', s, flags=re.S)

# ---- checked answers ----
pre = [(1, 1), (3, 1), (3, 2), (1, 2)]; k = 3
area = lambda pts: abs(sum(F(pts[i][0] * pts[(i + 1) % 4][1] - pts[(i + 1) % 4][0] * pts[i][1]) for i in range(4))) / 2
img = [(k * x, k * y) for x, y in pre]
assert area(pre) == 2 and area(img) == 18 == area(pre) * k * k
P2 = [(1, 1), (3, 1), (1, 3)]
step1 = [(2 * x, 2 * y) for x, y in P2]; step2 = [(-x, y) for x, y in step1]
assert step2 == [(-2, 2), (-6, 2), (-2, 6)]
side = lambda a, b: ((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2)
assert side(step2[0], step2[1]) == 4 * side(P2[0], P2[1])        # every side is twice as long: similar, not congruent


def esc(t): return t.replace('&', '&amp;').replace('"', '&quot;')


def card(qid, tx, key, q, right, opts, fb):
    """opts = [(text, why or None for the right one)] in page order"""
    assert sum(1 for t, w in opts if w is None) == 1 and any(t == right for t, w in opts)
    btns = '\n'.join('    <button class="opt-btn"%s onclick="mc(this,\'%s\',\'%s\')">%s</button>' % (
        '' if w is None else ' data-why="%s"' % esc(w), qid, right, t) for t, w in opts)
    return ('\n\n<div class="q-card" id="%s">\n  <div class="q-num">Problem 0<span class="pr-lv l5">Score 5</span></div>\n'
            '  <div class="dia"><div class="tx" data-tx=\'%s\'></div><div class="fig-key">%s</div></div>\n'
            '  <div class="q-text">%s</div>\n  <div class="opts">\n%s\n  </div>\n  <div class="feedback">%s</div>\n</div>') % (qid, tx, key, q, btns, fb)


AREA = card('8m',
    '{"pre":[[1,1],[3,1],[3,2],[1,2]],"names":"ABCD","ops":[{"op":"D","k":3}],"show":"pm","reveal":"1","rule":true,"hint":"the image appears after you answer","win":[-1,10,-1,7],"alt":"rectangle ABCD, 2 units by 1 unit, and the center of dilation at the origin"}',
    '<b class="b">blue</b> = pre-image · <b class="g">gold dashed</b> = image',
    'Rectangle ABCD has A(1, 1), B(3, 1), C(3, 2), D(1, 2). Its area is 2 square units. It is dilated by k = 3 about the origin. What is the AREA of the image?',
    '18 square units',
    [('6 square units', 'You multiplied the area by 3. A dilation by 3 makes the length AND the width 3 times as long, so the area is 3 × 3 = 9 times as large.'),
     ('18 square units', None),
     ('54 square units', 'You multiplied by 3 three times (3 × 3 × 3). Area uses two lengths, so it grows by 3 × 3 = 9, not 27.'),
     ('2 square units', 'Only rigid moves keep the same area. A dilation with k = 3 changes the size.')],
    'The image is 6 units long and 3 units wide: 6 &times; 3 = 18. Every length grew by 3, so the area grew by 3 &times; 3 = 9: 2 &times; 9 = 18 square units.')
SIM = card('8n',
    '{"pre":[[1,1],[3,1],[1,3]],"names":"PQR","ops":[{"op":"D","k":2},{"op":"Ry"}],"rule":"name","arrows":[0],"win":[-7,4,-1,7],"alt":"triangle PQR grows by 2 from the origin, then flips over the y-axis"}',
    '<b class="b">original</b> → <b class="g">dilated</b> → <b class="gr">flipped</b>',
    'Triangle PQR is dilated by k = 2 about the origin, then reflected over the y-axis (shown above). Which statement about the final image is TRUE?',
    'Similar to PQR, not congruent: the dilation makes every side twice as long.',
    [('Congruent to PQR: a reflection keeps the same size.', 'The reflection keeps the size, but the dilation before it doubled every side. Any dilation with k ≠ 1 means NOT congruent.'),
     ('Similar to PQR, not congruent: the dilation makes every side twice as long.', None),
     ('Neither: two moves in a row change the shape.', 'Dilations and reflections both keep the angles, so the shape stays the same. The image IS similar.'),
     ('Both congruent and similar: the angles stay the same.', 'Same angles make it similar. Congruent also needs the same side lengths, and k = 2 doubles them.')],
    'The dilation by 2 keeps the angles but doubles the sides. The reflection is rigid (same size): P(1, 1) &rarr; (2, 2) &rarr; (&minus;2, 2). Same shape, bigger size = similar, not congruent.')

# Score 5 dilation-area card ends the Dilations section; the similarity card ends the page's problems
k8g = s.index('<div class="q-card" id="8g">'); e = s.index('</div>\n</div>', k8g) + len('</div>\n</div>')
s = s[:e] + '\n<!-- U8S5 -->' + AREA + '\n<!-- /U8S5 -->' + s[e:]
k8j = s.index('<div class="q-card" id="8j">'); e = s.index('</div>\n</div>', k8j) + len('</div>\n</div>')
s = s[:e] + '\n<!-- U8S5 -->' + SIM + '\n<!-- /U8S5 -->' + s[e:]

# renumber Problem 1..N in page order
n = [0]
def ren(m): n[0] += 1; return 'Problem %d<span class="pr-lv' % n[0]
s = re.sub(r'Problem \d+<span class="pr-lv', ren, s)
assert n[0] == 14, n
s = re.sub(r'(id="answered">0</span> / )\d+', r'\g<1>14', s)
s = s.replace('var SS_STD={"8g": "NC.8.G.4", "8h": "NC.8.G.4", "8i": "NC.8.G.2", "8j": "NC.8.G.4"};',
              'var SS_STD={"8g": "NC.8.G.4", "8h": "NC.8.G.4", "8i": "NC.8.G.2", "8j": "NC.8.G.4", "8m": "NC.8.G.3", "8n": "NC.8.G.4"};')
assert '"8n": "NC.8.G.4"' in s
# a wrong tap names its mistake (data-why on that button)
old = "fb.textContent='✗ The answer is '+correct+'. '+fb.textContent;"
new = "fb.textContent='✗ The answer is '+correct+'. '+(btn.getAttribute('data-why')?btn.getAttribute('data-why')+' ':'')+fb.textContent;"
if old in s: s = s.replace(old, new)
assert new in s
open(P, 'w', encoding='utf-8').write(s)
print('ok: 14 problems,', s.count('pr-lv l5'), 'Score 5')
