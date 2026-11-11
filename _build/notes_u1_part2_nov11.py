#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Unit 1 notes, Part 2 sections A-C: "tap ? to see the answer" → checked questions (Nov 11, 2026; Zach: "yes fix them").
His rule: every answer is a number or a multiple-choice tap, graded at once. The SAME 12 questions, pictures and
captions are kept; only the way the student answers changes:
  A. Classify Each Number      → tap Rational / Irrational                 (ids u1pA1-5, the page's chk())
  B. Estimate Each Square Root → type the estimate, Check                  (ids u1pB1-4, chkVal(); the algorithm answer and
                                 the calculator answer are both accepted, as the note in that section says)
  C. Order from Least to Greatest → tap the list that is in order          (ids u1pC1-3, chk(); wrong lists = common mistakes)
The old answer pictures stay: they show after the question is answered, and on the answer key.
Twins ("Try a similar one") are in _build/notes_twins/u1.py. Runs once (it reads the old markup); git has the old page.
    python3 _build/notes_u1_part2_nov11.py && python3 _build/notes_twins/build.py u1
"""
import os, re, math
p = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'grade8', 'unit1-notes.html'); s = open(p, encoding='utf-8').read()
if 'id="u1pA1"' in s: raise SystemExit('already done')
def sect(title):
    i = s.index(title + '</h2>'); a = s.rindex('<section', 0, i); b = s.index('</section>', i) + len('</section>'); return a, b
CSS = ('<style>.u1p2 .chk{margin:14px 0}.s5col{flex-direction:column;align-items:stretch}.s5col .chk-btn{text-align:left;white-space:normal;line-height:1.4}'
       '.pp-only{display:none}body.paper .pp-only{display:block;margin:8px 0 0}.after-ans{display:none;margin-top:10px}.chk-fb.show ~ .after-ans{display:block}body.paper .after-ans{display:block}</style>')
ESC = lambda t: t.replace('"', '&quot;')

# ---------- A ----------
a, b = sect('Classify Each Number'); A = s[a:b]
rows = re.findall(r'<tr><td style="text-align:left">(<span class="np-lv l\d">Score \d</span>) (\d+)\.\s*(.*?)</td><td><span class="blank" data-ans="([^"]*)" onclick="rb\(this\)">\?</span></td></tr>', A, flags=re.S)
assert len(rows) == 5, len(rows)
boxes = []
for lv, n, body, ans in rows:
    k = body.index('<div class="vfig"'); expr, fig = body[:k].strip(), body[k:]
    right = 'Rational' if ans.startswith('Rational') else 'Irrational'; assert ans.startswith(('Rational', 'Irrational'))
    qid = 'u1pA' + n
    btn = ' '.join('<button class="chk-btn" onclick="chk(\'%s\',\'%s\',\'%s\')">%s</button>' % (qid, right, c, c) for c in ('Rational', 'Irrational'))
    boxes.append('<div class="chk" id="%s"> <div class="chk-q">%s %s. Is %s rational or irrational?</div> %s <div class="chk-opts"> %s </div> '
                 '<div class="chk-fb c" id="fb-%s" data-hint="%s">✓ %s</div> </div>' % (qid, lv, n, expr, fig, btn, qid,
                 ESC(ans + '. A decimal that stops or repeats is rational. One that never stops and never repeats is irrational.'), ans))
head = A[:A.index('<table')]; newA = head.replace('<section class="topic" data-part2="trimmed">', '<section class="topic u1p2" data-part2="trimmed">', 1) + CSS + '\n' + '\n'.join(boxes) + '\n</section>'
s = s[:a] + newA + s[b:]

# ---------- B ----------
a, b = sect('Estimate Each Square Root (nearest tenth)'); B = s[a:b]
rows = re.findall(r'<tr><td style="text-align:left">(<span class="np-lv l\d">Score \d</span>) (\d+)\.\s*(.*?)</td><td>≈ <span class="blank" data-ans="([^"]*)" onclick="rb\(this\)">\?</span></td></tr>', B, flags=re.S)
assert len(rows) == 4, len(rows)
def accepted(expr, shown):
    """the algorithm's answer and the calculator's answer, to the tenth and to the hundredth (both are right)"""
    neg = expr.startswith('−'); n = int(re.search(r'√(\d+)', expr).group(1)); lo = int(math.isqrt(n)); alg = lo + (n - lo * lo) / float((lo + 1) ** 2 - lo * lo); cal = math.sqrt(n)
    vals = []
    half = int(round(alg * 100)) % 10 == 5                        # 5.45: rounding to 5.5 or to 5.4 are both taken (as the section check does)
    for v in (round(alg + 1e-9, 1), round(cal, 1)) + ((math.floor(alg * 10) / 10.0,) if half else ()) + (round(alg, 2), round(cal, 2)):
        t = ('%.2f' % v).rstrip('0').rstrip('.') if abs(v * 10 - round(v * 10)) > 1e-9 else '%.1f' % v
        t = ('−' if neg else '') + t
        if t not in vals: vals.append(t)
    assert vals[0] == shown, (expr, vals, shown); return vals
boxes = []
for lv, n, body, ans in rows:
    k = body.index('<div class="vfig"'); expr, fig = body[:k].strip(), body[k:]; qid = 'u1pB' + n; acc = accepted(expr, ans)
    boxes.append('<div class="chk" id="%s"> <div class="chk-q">%s %s. Estimate %s to the nearest tenth.</div> %s '
                 '<div class="val-chk"> <input id="%s-in" type="text" placeholder="≈ ?"> <button onclick="chkVal(\'%s\',[%s])">Check</button> </div> '
                 '<div class="chk-fb" id="fb-%s"></div> <p class="pp-only">≈ <span class="blank" data-ans="%s">?</span></p> </div>' % (qid, lv, n, expr, fig, qid, qid, ','.join("'%s'" % x for x in acc), qid, ans))
head = B[:B.index('<table')]; note = re.search(r'<div class="note" id="estB-note".*?</div>', B, flags=re.S).group(0).replace(' style="display:none"', '')
newB = head.replace('<section class="topic" data-part2="trimmed">', '<section class="topic u1p2" data-part2="trimmed">', 1) + '\n' + '\n'.join(boxes) + '\n' + note + ' </section>'
s = s[:a] + newB + s[b:]

# ---------- C ----------
a, b = sect('Order from Least to Greatest'); C = s[a:b]
items = re.findall(r'<div class="sa">\s*<div class="chk-q">(<span class="np-lv l\d">Score \d</span>) (\d+)\. Order: (.*?)</div>\s*(<div class="vfig".*?</p>)\s*<button class="sa-btn" onclick="sa\(this\)">Reveal</button>\s*<div class="sa-ans">(.*?)</div>\s*</div>(?=<div class="sa">|</section>)', C, flags=re.S)
assert len(items) == 3, len(items)
V = {'π': math.pi, '√10': 10 ** .5, '10/3': 10 / 3.0, '3.5': 3.5, '4.2': 4.2, '√18': 18 ** .5, '13/3': 13 / 3.0, '√20': 20 ** .5, '−2.5': -2.5, '−√5': -5 ** .5, '−8/3': -8 / 3.0}
ORD = {'1': ['π, √10, 10/3, 3.5', ['√10, π, 10/3, 3.5', '3.5, 10/3, √10, π', 'π, 10/3, √10, 3.5']],
       '2': ['4.2, √18, 13/3, √20', ['√18, 4.2, 13/3, √20', '√20, 13/3, √18, 4.2', '4.2, 13/3, √18, √20']],
       '3': ['−8/3, −2.5, −√5', ['−√5, −2.5, −8/3', '−2.5, −√5, −8/3', '−2.5, −8/3, −√5']]}
boxes = []
for lv, n, lst, fig, ans in items:
    right, wrong = ORD[n]; vals = [V[t] for t in right.split(', ')]; assert vals == sorted(vals), (n, vals)
    for w in wrong: assert sorted(w.split(', ')) == sorted(right.split(', ')) and w != right
    plain = re.sub(r'<span class="sf"><span>(.*?)</span><span class="sfx">/</span><span>(.*?)</span></span>', r'\1/\2', lst); assert sorted(plain.split(', ')) == sorted(right.split(', ')), (plain, right)
    qid = 'u1pC' + n; order = [wrong[0], right, wrong[1], wrong[2]] if n != '2' else [wrong[1], wrong[0], wrong[2], right]
    btn = ' '.join('<button class="chk-btn" onclick="chk(\'%s\',\'%s\',\'%s\')">%s</button>' % (qid, right, c, c) for c in order)
    dec = re.sub(r'<[^>]+>', '', ans.split('→')[0]).strip()
    boxes.append('<div class="chk" id="%s"> <div class="chk-q">%s %s. Which list is in order from least to greatest? %s</div> %s '
                 '<div class="chk-opts s5col"> %s </div> <div class="chk-fb c" id="fb-%s" data-hint="%s">✓ %s</div> '
                 '<div class="sa after-ans"> <button class="sa-btn" onclick="sa(this)">Show it on the number line</button> <div class="sa-ans">%s</div> </div> </div>'
                 % (qid, lv, n, lst, fig, btn, qid, ESC('Change each number to a decimal first. ' + dec + '. With negative numbers, the one farthest LEFT on the number line is the least.' if n == '3' else 'Change each number to a decimal first. ' + dec + '.'),
                    re.sub(r'<div class="vfig".*$', '', ans, flags=re.S).strip(), ans))
head = C[:C.index('<div class="sa">')]
newC = head.replace('<section class="topic" data-part2="trimmed">', '<section class="topic u1p2" data-part2="trimmed">', 1).replace('Convert each number to a decimal, then arrange from least to greatest. Show your decimal conversions!', 'Convert each number to a decimal. Then tap the list that goes from least to greatest. Show your decimal conversions on paper!') + '\n' + '\n'.join(boxes) + '\n</section>'
s = s[:a] + newC + s[b:]
# standards for Send my work
a0 = "u1s5a:'NC.8.NS.1'"; assert a0 in s
s = s.replace(a0, ','.join("u1pA%d:'NC.8.NS.1'" % i for i in range(1, 6)) + ',' + ','.join("u1pB%d:'NC.8.NS.2'" % i for i in range(1, 5)) + ',' + ','.join("u1pC%d:'NC.8.NS.2'" % i for i in range(1, 4)) + ',' + a0, 1)
open(p, 'w', encoding='utf-8').write(s)
print('done: A 5 taps, B 4 number boxes, C 3 taps | reveal blanks left in Part 2:', len(re.findall(r'onclick="rb\(this\)"', s[s.index('Classify Each Number'):])))
