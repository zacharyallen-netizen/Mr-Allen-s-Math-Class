#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Score 5 questions added to the Unit 1 and Unit 8 notes, Nov 11, 2026 (Zach: "add Score 5 to Units 1 and 8, look at the
proficiency scales"). Unit 1 had 2 Score 5 items and Unit 8 had 3. Each page gets 3 more, written from the scales
(NC.8.NS.1 / NS.2: generalize about the real number system, a fraction that is still irrational, rank numbers that
include a cube root; NC.8.G.2 / G.3: area after a dilation, why order can matter, justify congruent vs. similar).
They use the page's own multiple-choice check (chk), so they are graded at once; their "Try a similar one" twins are in
_build/notes_twins/u1.py and u8.py (run build.py u1 u8 after this). Safe to run again.
    python3 _build/notes_score5_nov11.py && python3 _build/notes_twins/build.py u1 u8
"""
import os, re
G = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'grade8')
assert 30 ** (1 / 3.0) < 3.14159 < 10 ** 0.5 < 3.2
P = lambda x, y: (x, y)
assert (-(2 + 3), 1) == (-5, 1) and ((-2) + 3, 1) == (1, 1)             # translate right 3 then reflect over y  vs  reflect then translate
def box(qid, badge, q, choices, right, ok, hint):
    assert right in choices and len(set(choices)) == len(choices)
    esc = lambda t: t.replace("'", "\\'")
    btns = ' '.join('<button class="chk-btn" onclick="chk(\'%s\',\'%s\',\'%s\')">%s</button>' % (qid, esc(right), esc(c), c) for c in choices)
    return ('<div class="chk" id="%s"> <div class="chk-q">%s<span class="np-lv l3">Score 5</span> %s</div> <div class="chk-opts s5col"> %s </div> '
            '<div class="chk-fb c" id="fb-%s" data-hint="%s">✓ %s</div> </div>') % (qid, badge, q, btns, qid, hint.replace('"', '&quot;'), ok)
CSS = '<style>.s5col{flex-direction:column;align-items:stretch}.s5col .chk-btn{text-align:left;white-space:normal;line-height:1.4}</style>'
U1 = ('<!-- SCORE5-NOV11 --><section class="topic" data-part2="trimmed"> <h2><span class="num">D</span> Explain Your Thinking</h2>' + CSS +
      '<p>These are Score 5 questions. Pick the answer you can <strong>defend</strong>. Change numbers to decimals when you need to.</p> ' +
      box('u1s5a', '', 'Which statement about the real number system is TRUE?',
          ['Every rational number is an integer.', 'Every integer is a rational number.', 'Some numbers are both rational and irrational.', 'Every square root is irrational.'], 'Every integer is a rational number.',
          'Every integer can be written over 1, like 5 = 5/1, so it is rational. The integers sit inside the rational numbers.',
          'Think of the nested diagram: natural → whole → integer → rational. Each set sits INSIDE the next one. Irrational numbers are a separate group. √25 = 5 is rational.') + ' ' +
      box('u1s5b', '', 'Why is <span class="sf"><span>5π</span><span class="sfx">/</span><span>2</span></span> irrational, even though it is written as a fraction?',
          ['It is not irrational. Every fraction is rational.', 'Because 2 does not divide 5 evenly.', 'The top, 5π, is not an integer.', 'Because its decimal has more than 10 digits.'], 'The top, 5π, is not an integer.',
          'A rational number is a ratio of two INTEGERS. 5π is not an integer, so 5π/2 is irrational. Its decimal never ends and never repeats.',
          'A fraction is rational only when the top AND the bottom are integers. π is irrational, so 5π is too. A long decimal can still be rational if it ends or repeats.') + ' ' +
      box('u1s5c', '', 'Which list is in order from least to greatest?',
          ['π, ∛30, √10, 3.2', '3.2, √10, π, ∛30', '∛30, π, √10, 3.2', '√10, ∛30, π, 3.2'], '∛30, π, √10, 3.2',
          '∛30 ≈ 3.11, π ≈ 3.14, √10 ≈ 3.16, and 3.2. The cube root is the smallest because 3 × 3 × 3 = 27 is just under 30.',
          'Change each one to a decimal: ∛30 ≈ 3.11 (3³ = 27), π ≈ 3.14, √10 ≈ 3.16 (3² = 9), 3.2. Then line them up from smallest to largest.') +
      ' </section><!-- /SCORE5-NOV11 -->')
U8 = ('<!-- SCORE5-NOV11 -->' + CSS +
      box('chk6e', '<span class="badge">P5</span> ', 'A rectangle is reflected over the y-axis and then dilated by k = 2. How does the AREA of the image compare with the pre-image?',
          ['The same', '2 times as large', '4 times as large', '8 times as large'], '4 times as large',
          'The reflection keeps the size. The dilation doubles BOTH the length and the width, so the area is 2 × 2 = 4 times as large.',
          'A dilation by 2 doubles every side. Area uses two sides (length × width), so it grows by 2 × 2 = 4. The reflection does not change the size.') + ' ' +
      box('chk6f', '<span class="badge">P6</span> ', 'Point P(2, 1) is translated 3 units right, then reflected over the y-axis. Do you get the same image if you reflect FIRST and then translate?',
          ['Yes. The order never matters.', 'Yes. Both give (−5, 1).', 'No. Translate then reflect gives (−5, 1). Reflect then translate gives (1, 1).', 'No. Translate then reflect gives (5, −1).'],
          'No. Translate then reflect gives (−5, 1). Reflect then translate gives (1, 1).',
          'Translate first: (2, 1) → (5, 1) → (−5, 1). Reflect first: (2, 1) → (−2, 1) → (1, 1). The order can change the image.',
          'Do each order one step at a time. Right 3 adds 3 to x. A flip over the y-axis changes the sign of x. Compare the two final points.') + ' ' +
      box('chk6g', '<span class="badge">P7</span> ', 'Triangle ABC is mapped to triangle DEF by a rotation and then a translation. Jay says the triangles are similar but NOT congruent. Who is right?',
          ['Jay is right. Two transformations always change the size.', 'Jay is wrong. Rotations and translations are rigid, so the triangles are congruent.', 'Jay is right. Only ONE transformation keeps a figure congruent.', 'Jay is wrong. The triangles are neither congruent nor similar.'],
          'Jay is wrong. Rotations and translations are rigid, so the triangles are congruent.',
          'Rigid moves (slides, flips, turns) keep every side and angle the same, no matter how many you do in a row. Only a dilation changes the size.',
          'Ask: is there a dilation? If not, every move is rigid, and the figures are congruent. It does not matter how many rigid moves there are.') +
      '<!-- /SCORE5-NOV11 -->')
for fn, block, where in (('unit1-notes.html', U1, 'u1'), ('unit8-notes.html', U8, 'u8')):
    p = os.path.join(G, fn); s = open(p, encoding='utf-8').read()
    s = re.sub(r'\s*<!-- SCORE5-NOV11 -->.*?<!-- /SCORE5-NOV11 -->', '', s, flags=re.S)
    if where == 'u1':
        k = s.index('<div id="ss-mount">'); s = s[:k].rstrip() + '\n' + block + '\n' + s[k:]
    else:
        k = s.index('id="fb-chk6d"'); k = s.index('</div>', k) + 6; k = s.index('</div>', k) + 6      # after the chk6d box
        s = s[:k] + '\n' + block + s[k:]
    if where == 'u8' and 'chk6e:' not in s:
        a0 = "chk6d:'NC.8.G.4' };"; assert a0 in s; s = s.replace(a0, "chk6d:'NC.8.G.4', chk6e:'NC.8.G.3', chk6f:'NC.8.G.2', chk6g:'NC.8.G.2' };")
    if where == 'u1' and 'u1s5a:' not in s:
        a0 = "chk4a:'NC.8.NS.2'})"; assert a0 in s; s = s.replace(a0, "chk4a:'NC.8.NS.2',u1s5a:'NC.8.NS.1',u1s5b:'NC.8.NS.1',u1s5c:'NC.8.NS.2'})")
    open(p, 'w', encoding='utf-8').write(s)
    print(fn, 'Score 5 labels now:', len(re.findall(r'np-lv l3', s)), '| boxes', re.findall(r'<div class="chk" id="((?:u1s5|chk6[efg])\w*)"', s))
