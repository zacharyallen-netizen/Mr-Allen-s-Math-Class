#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Unit 5 notes trimmed, Nov 11, 2026 (Zach: "trim down the Unit 5 notes problems, there should be varied problem types
across Scores 3, 4 and 5 so delete anything that is duplicated too much. Make sure to have visuals").
53 problems -> 36. Every kept problem has a picture and is checked at once (a number or a tap).
  Cut (same skill, same numbers type, already practiced next to it):
    2. Hypotenuse: legs 6 & 8, 5 & 12, 8 & 15 (legs 3 & 4 and 12 & 16 stay)
    4. Converse: sides 6, 8, 10 and 7, 9, 12 (5-12-13, 6-7-10, 17-8-15 and 9-40-x stay)
    Part 2 Score 4: legs 20 & 21, leg 20 / hyp 29, (−3,−1) to (5,5), 13-ft ladder (the same as the section 5 ladder)
    Part 2 Score 5: sides 11, 13, 17 (a second "is it right?"), baseball diamond (the same as the square diagonal),
                    kite (the same as the ladder)
  Changed to answer-and-check (they were "Reveal" only):
    3. Error analysis (a² = 13² + 5²) -> tap the fix
    Part 2 Score 5 "When do you add / subtract?" -> tap the rule
  New (a different kind of Score 5, NC.8.G.7 scale: multi-step / 3-D):
    Part 2 Score 5: longest stick in a 12 x 4 x 3 box -> 13
The twins move with the page (np4-* are numbered by position): see _build/notes_twins/u5.py.
    python3 _build/u5_trim_nov11.py && python3 _build/notes_twins/build.py u5
Refuses to run twice (looks for the U5-TRIM-NOV11 marker)."""
import math, os, re
G = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'grade8')
P = os.path.join(G, 'unit5-notes.html')
s = open(P, encoding='utf-8').read()
assert 'U5-TRIM-NOV11' not in s, 'already trimmed'
n0 = s.count('class="np-q"') + s.count('class="chk"') + s.count('<div class="sa">')


def block(s, i):
    """end index of the balanced <div …> that starts at i"""
    assert s.startswith('<div', i)
    depth, j = 0, i
    for m in re.compile(r'<div\b|</div>').finditer(s, i):
        depth += 1 if m.group() == '<div' else -1
        if depth == 0: return m.end()
    raise ValueError('unbalanced')


def start_of(s, needle, opener):
    k = s.index(needle); assert s.count(needle) == 1, needle
    return s.rindex(opener, 0, k)


def cut(s, needle, opener='<div', ws=True):
    i = start_of(s, needle, opener); j = block(s, i)
    while ws and i > 0 and s[i - 1] in ' \t': i -= 1
    if ws and s[j:j + 1] == '\n': j += 1
    return s[:i] + s[j:]


def replace_block(s, needle, new, opener='<div'):
    i = start_of(s, needle, opener); j = block(s, i)
    return s[:i] + new + s[j:]


# ---- 2. Finding the Hypotenuse: keep legs 3 & 4 ----
for q in ('id="u5h2"', 'id="u5h3"', 'id="u5h4"'): s = cut(s, q)

# ---- 3. Error analysis -> tap the fix (the triangle stays) ----
i = start_of(s, 'ERROR ANALYSIS</span> A student finds a missing leg', '<div class="sa">'); j = block(s, i)
old = s[i:j]
fig = re.search(r'<div class="np-fig old-fig">.*?</svg></div>', old, re.S).group()
assert 13 ** 2 - 5 ** 2 == 144 and 13 ** 2 + 5 ** 2 == 194 and math.isqrt(144) == 12
CH = ['They added the squares. To find a leg, subtract: 13² − 5² = 144, so a = 12.',
      'Nothing is wrong. a = √194 ≈ 13.9',
      'They should add the sides: a = 13 + 5 = 18.',
      'They should subtract the sides: a = 13 − 5 = 8.']
esc = lambda t: t.replace("'", "\\'")
btns = ' '.join('<button class="chk-btn" onclick="chk(\'u5ea\',\'%s\',\'%s\')">%s</button>' % (esc(CH[0]), esc(c), c) for c in CH)
new = ('<div class="chk" id="u5ea"> <div class="chk-q"><span class="np-lv l2 lvb">Score 4</span> <span class="badge">ERROR ANALYSIS</span> '
       'A student finds the missing leg when c = 13 and b = 5 by writing <span class="err-bad">a² = 13² + 5² = 194</span>. What is the fix?</div> '
       + fig + ' <div class="chk-opts s5col"> ' + btns + ' </div> '
       '<div class="chk-fb c" id="fb-u5ea" data-hint="Is a the hypotenuse or a leg? It is a LEG. Finding a leg means SUBTRACT the squares: c² − b².">'
       '✓ a is a leg, so subtract: a² = 13² − 5² = 169 − 25 = 144, and a = √144 = 12. Adding the squares is only for the hypotenuse.</div> </div>')
s = s[:i] + new + s[j:]
if '.s5col{' not in s:
    s = s.replace('</head>', '<style>.s5col{flex-direction:column;align-items:stretch}.s5col .chk-btn{text-align:left;white-space:normal;line-height:1.4}</style>\n</head>', 1)

# ---- 4. Converse: cut 6-8-10 and 7-9-12 (np4-1 and np4-3) ----
s = cut(s, 'data-hint="Test it: does 6² + 8² equal 10²?"', '<div class="np-q"')
s = cut(s, 'data-hint="Find 7² + 9². Then compare it to 12²."', '<div class="np-q"')

# ---- Part 2, Score 4: cut 6), 7), 8) and the 13-ft ladder ----
i = start_of(s, 'id="u5pA8"', '<div class="two-col">'); j = block(s, i)
assert 'u5pB7' in s[i:j] and 'u5pD5' in s[i:j]
s = s[:i] + s[j:].lstrip('\n')
s = cut(s, '<strong>9.</strong> A 13-foot ladder', '<div class="sa">')

# ---- Part 2, Score 5 ----
# 3) explain add / subtract -> tap the rule (the two triangles stay)
R = ['Add the squares to find the hypotenuse. Subtract the squares to find a leg.',
     'Add the squares to find a leg. Subtract the squares to find the hypotenuse.',
     'Always add the squares of the two numbers you know.',
     'Add the two sides you know. Do not square them.']
i = start_of(s, 'id="np7-11"', '<div class="np-q"'); k = s.index('>', i) + 1
s = s[:i] + ('<div class="np-q" data-level="3" data-ans="%s" data-choices="%s" data-hint="Look at the two pictures. Which side is missing in each one? '
             'The hypotenuse is the biggest side, so its square is the SUM of the other two." id="np7-11">' % (R[0], '|'.join(R))) + s[k:]
s = s.replace('<div class="np-prompt">Explain how you know when to ADD the squares and when to SUBTRACT them.</div>',
              '<div class="np-prompt">Which rule tells you when to ADD the squares and when to SUBTRACT them?</div>', 1)
assert 'Which rule tells you when to ADD' in s
# 5) sides 11, 13, 17: cut (20, 21, 29 stays)
s = cut(s, 'id="u5pE6"', '<div class="chk"', ws=False)
# baseball and kite: cut; the 3-D box takes their place
s = cut(s, '<strong>6.</strong> A baseball diamond', '<div class="sa">')
L, W, H = 12, 4, 3
fl = L * L + W * W; d = math.isqrt(fl + H * H); assert d * d == fl + H * H == 169 and d == 13 and fl == 160


def box_svg(l, w, h, unit):
    A, B, C, D = (30, 112), (170, 112), (170, 62), (30, 62)
    dx, dy = 44, -34
    sh = lambda p: (p[0] + dx, p[1] + dy)
    A2, B2, C2, D2 = sh(A), sh(B), sh(C), sh(D)
    ln = lambda p, q, st='#1E2D4F', w_=2.2, da='': f'<line x1="{p[0]}" y1="{p[1]}" x2="{q[0]}" y2="{q[1]}" stroke="{st}" stroke-width="{w_}"{(" stroke-dasharray=" + chr(34) + da + chr(34)) if da else ""}/>'
    t = lambda x, y, txt, a='middle', c='#0056B3': f'<text x="{x}" y="{y}" text-anchor="{a}" font-family="Arvo,serif" font-weight="bold" font-size="13" fill="{c}" paint-order="stroke" stroke="#fff" stroke-width="3">{txt}</text>'
    poly = lambda *pts: '<polygon points="%s" fill="#eef4ff" stroke="none"/>' % ' '.join(f'{x},{y}' for x, y in pts)
    return (f'<svg role="img" aria-label="Box {l} {unit} long, {w} {unit} wide and {h} {unit} tall, with a dashed line from a bottom front corner to the opposite top back corner" '
            f'width="262" height="146" viewBox="0 0 262 146" xmlns="http://www.w3.org/2000/svg">'
            + poly(A, B, C, D) + poly(D, C, C2, D2) + poly(B, B2, C2, C)
            + ln(A, A2, '#8a93a6', 1.5, '4 4') + ln(A2, B2, '#8a93a6', 1.5, '4 4') + ln(A2, D2, '#8a93a6', 1.5, '4 4')
            + ln(A, B2, '#8a93a6', 1.6, '2 4')
            + ln(A, B) + ln(B, C) + ln(C, D) + ln(D, A) + ln(D, D2) + ln(C, C2) + ln(D2, C2) + ln(B, B2) + ln(B2, C2)
            + ln(A, C2, '#b08800', 3, '7 4')
            + t(100, 131, f'{l} {unit}') + t(22, 92, f'{h} {unit}', 'end') + t(200, 104, f'{w} {unit}', 'start')
            + t(112, 52, 'd = ?', 'middle', '#b08800') + '</svg>')


BOX = ('<div class="chk" id="u5pF1" style="margin-bottom:10px">\n'
       '<div class="chk-q" style="font-size:0.92em"><span class="np-lv l3 lvb">Score 5</span> 5) A box is 12 in long, 4 in wide, and 3 in tall. '
       'What is the longest straight stick that fits inside, from a bottom corner to the opposite top corner?</div>\n'
       '<div style="text-align:center;margin:4px 0 8px">' + box_svg(L, W, H, 'in') + '</div>\n'
       '<div class="val-chk"><input id="u5pF1-in" placeholder="d =" type="text"/><button onclick="chkVal(\'u5pF1\',[&quot;13&quot;,&quot;13 in&quot;])">Check</button></div>\n'
       '<div class="chk-fb" id="fb-u5pF1" data-hint="Two steps. First the floor diagonal: 12² + 4² = 160. Then use it with the height: 160 + 3² = 169. Take the square root."></div>\n'
       '</div>\n')
s = replace_block(s, '<strong>7.</strong> A kite string', BOX + '<!-- U5-TRIM-NOV11 -->', '<div class="sa">')

n1 = s.count('class="np-q"') + s.count('class="chk"') + s.count('<div class="sa">')
assert '<div class="sa">' not in s, 'no reveal-only problems left'
print('problems', n0, '->', n1)
open(P, 'w', encoding='utf-8').write(s)
