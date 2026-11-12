#!/usr/bin/env python3
"""Tap choices for the few practice-engine problems that no rule in grade8/tap-answers.js covers (Nov 11, 2026).
Adds "choices" to those problems inside each page's window.PRACTICE and makes sure the page loads tap-answers.js before
the engine. Safe to run again (rerun it after _build/practice/make_pages.py)."""
import re, json, glob, os
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
V = '20261111a'
# page -> (section index, problem n) -> choices (the right answer is the page's own "ans")
CH = {
 'unit1-practice-1.html': {(0, 3): ['0.83̅', '0.83', '0.8̅3̅', '1.2'], (4, 3): ['π', '√10', 'They are equal'],
   # review Nov 12, 2026: the old Natural/Whole/Integer/Rational/Irrational list marked the TRUE answer 'Rational' wrong
   (1, 5): (['whole number', 'integer', 'both'], {'whole number': 'Whole numbers are 0, 1, 2, 3 … They are never negative, so −5 is not a whole number.', 'both': '−5 is an integer, but it is not a whole number. Whole numbers are never negative.'})},
 'unit1-practice-2.html': {(0, 3): ['0.5̅', '0.5', '0.59', '1.8'], (4, 1): ['√5', '2.2', 'They are equal']},
 'unit6-practice.html': {(5, 2): ['Stopped', 'Speeding up', 'Slowing down', 'Going back home']},
}
n = 0
for f in sorted(glob.glob(os.path.join(ROOT, 'grade8', '*.html'))):
    s = open(f, encoding='utf-8').read()
    m = re.search(r'(window\.PRACTICE\s*=\s*)(\{.*?\})(;?\s*</script>)', s, re.S)
    if not m: continue
    name = os.path.basename(f); d = json.loads(m.group(2)); changed = False
    for (si, pn), ch in CH.get(name, {}).items():
        p = [x for x in d['data']['secs'][si]['probs'] if str(x['n']) == str(pn)][0]
        why = None
        if isinstance(ch, tuple): ch, why = ch
        if p.get('choices') != ch: p['choices'] = ch; changed = True
        if why and p.get('why') != why: p['why'] = why; changed = True
    if changed: s = s[:m.start(2)] + json.dumps(d, ensure_ascii=False) + s[m.end(2):]
    tag = '<script src="tap-answers.js?v=%s"></script>\n' % V
    s2 = re.sub(r'<script src="tap-answers\.js\?v=[0-9a-z]+"></script>\n', '', s)
    s2 = re.sub(r'(<script src="practice/practice-engine\.js\?v=[0-9a-z]+"></script>)', lambda k: tag + k.group(1), s2, count=1)
    if s2 != s or changed: open(f, 'w', encoding='utf-8').write(s2); n += 1
print('practice pages updated:', n)
