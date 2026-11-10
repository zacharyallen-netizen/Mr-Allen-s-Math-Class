"""Adds the "EOG Practice" section (two links: EOG-style set and Version 2) to grade8/unit1..9.html, right after Homework.
Safe to rerun. Then rerun _build/build_units34.py so the combined Units 3-4 page gets them too."""
import os, re
G = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), 'grade8')
BLOCK = ('<div class="section-label" id="eog">EOG Practice</div>\n'
  '<a href="unit{n}-eog.html" class="feature-card"><div class="fi">🎯</div><div><div class="ft">EOG Practice — Unit {n}</div>'
  '<div class="fd">10 questions like the NC End-of-Grade test, one at a time, with hints.</div></div><span class="kind">Interactive</span></a>\n'
  '<a href="unit{n}-eog-v2.html" class="feature-card"><div class="fi">🎯</div><div><div class="ft">EOG Practice — Version 2</div>'
  '<div class="fd">10 questions. Read the box first, then choose A, B or C.</div></div><span class="kind">Interactive</span></a>\n\n')
for n in range(1, 10):
    p = os.path.join(G, 'unit%d.html' % n); s = open(p, encoding='utf-8').read()
    if 'unit%d-eog.html' % n in s: print('unit%d: already there' % n); continue
    h = s.index('<div class="section-label" id="homework">')
    nxt = s.index('<div class="section-label"', h + 10)
    s = s[:nxt] + BLOCK.format(n=n) + s[nxt:]
    open(p, 'w', encoding='utf-8').write(s); print('unit%d: added before' % n, re.match(r'<div class="section-label"[^>]*>([^<]*)', s[nxt + len(BLOCK.format(n=n)):]).group(1))
