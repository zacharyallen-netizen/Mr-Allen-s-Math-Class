"""Unit pages (grade8/unit1.html … unit9.html): a "Start here" strip (steps in order) and the pre-test at the END.
Nothing is removed: sections are only reordered (pre-test sections move to the bottom) and labeled with ids.
Safe to run again (it replaces its own strip).   python3 _build/unit_start_here.py   (then python3 _build/build_units34.py)"""
import os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
G = os.path.join(ROOT, 'grade8')

CSS = '''<style id="start-here-css">
.start-here{background:#fff;border:1px solid #E3E5EA;border-top:5px solid #FFC107;border-radius:12px;padding:16px 18px 18px;margin:18px 0 8px;box-shadow:0 8px 28px rgba(0,0,0,.18)}
.start-here h2{font:600 1.3rem/1.2 "Source Serif 4",Georgia,serif;color:#1E2D4F;margin:0 0 4px}
.start-here>p{margin:0 0 12px;color:#5B6475;font:500 15px/1.4 Inter,system-ui,sans-serif}
.sh-steps{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;list-style:none;margin:0;padding:0}
.sh-steps a{display:flex;gap:10px;align-items:flex-start;height:100%;box-sizing:border-box;text-decoration:none;color:#1E2D4F;background:#F7F7F4;border:1px solid #E3E5EA;border-radius:10px;padding:12px}
.sh-steps a:hover{border-color:#E0A800;background:#FFF6D6}
.sh-steps a:focus-visible{outline:3px solid #2747A0;outline-offset:2px}
.sh-n{flex:0 0 30px;height:30px;border-radius:50%;background:#1E2D4F;color:#FFC107;font:600 15px "JetBrains Mono",monospace;display:flex;align-items:center;justify-content:center}
.sh-t{font:700 16px/1.25 Inter,system-ui,sans-serif;display:block}
.sh-d{font:500 13.5px/1.35 Inter,system-ui,sans-serif;color:#5B6475;display:block;margin-top:2px}
.section-label[id]{scroll-margin-top:70px}
@media (max-width:760px){.sh-steps{grid-template-columns:1fr 1fr}}
@media (max-width:420px){.sh-steps{grid-template-columns:1fr}}
@media print{.start-here{box-shadow:none}}
</style>'''

DEFAULT = [('notes', 'Notes', 'Learn it with the interactive notes.'),
           ('practice', 'Practice', 'Practice 1, then Practice 2.'),
           ('homework', 'Homework', 'Do each homework after its lesson.'),
           ('pretest', 'Pre-Test', 'Check yourself at the end, before the unit test.')]
UNIT2 = [('part1', 'Exponent Rules', 'Notes, then practice.'),
         ('part2', 'Scientific Notation', 'Notes, then practice.'),
         ('homework', 'Homework', 'Do each homework after its lesson.'),
         ('pretest', 'Pre-Tests', 'Check yourself at the end, before the unit test.')]

PRACTICE_DESC = {6: 'Practice, then More Practice & Review.', 9: 'Check each answer as you go.'}   # Nov 10, 2026


def strip(steps, title='Start here: do these in order'):
    lis = ''.join(f'<li><a href="#{a}"><span class="sh-n">{k}</span><span><span class="sh-t">{t}</span><span class="sh-d">{d}</span></span></a></li>'
                  for k, (a, t, d) in enumerate(steps, 1))
    return (f'<!--start-here--><section class="start-here" aria-labelledby="sh-h"><h2 id="sh-h">{title}</h2>'
            f'<p>Go step by step. Tap a step to jump to it.</p><ol class="sh-steps">{lis}</ol></section><!--/start-here-->\n')


def is_pretest(sec):
    return bool(re.match(r'<div class="section-label"[^>]*>[^<]*Pre-Test', sec))


def anchor_for(label, u):
    l = label.lower()
    if 'pre-test' in l: return 'pretest'
    if u == 2 and l.startswith('part 1'): return 'part1'
    if u == 2 and l.startswith('part 2'): return 'part2'
    if l == 'notes': return 'notes'
    if l.startswith('practice'): return 'practice'
    if l == 'homework': return 'homework'
    return None


def do(u):
    path = os.path.join(G, f'unit{u}.html'); s = open(path, encoding='utf-8').read()
    s = re.sub(r'<!--start-here-->.*?<!--/start-here-->\n?', '', s, flags=re.S)
    if 'id="start-here-css"' not in s: s = s.replace('</head>', CSS + '\n</head>', 1)
    start = s.index('<div class="section-label"')
    end = s.rindex('</div>', 0, s.index('<div class="site-footer">'))
    body = s[start:end]
    secs = [p for p in re.split(r'(?=<div class="section-label")', body) if p.strip()]
    assert ''.join(secs) == body
    order = [x for x in secs if not is_pretest(x)] + [x for x in secs if is_pretest(x)]
    used, out = set(), []
    for x in order:
        m = re.match(r'<div class="section-label"([^>]*)>([^<]*)', x)
        attrs, label = m.group(1), m.group(2).replace('&amp;', '&').strip()
        attrs = re.sub(r'\s*id="[^"]*"', '', attrs)
        a = anchor_for(label, u)
        if a and a not in used:
            used.add(a); attrs = f' id="{a}"' + attrs
        x = f'<div class="section-label"{attrs}>' + x[m.end(1) + 1:]
        if not x.endswith('\n\n'): x = x.rstrip('\n') + '\n\n'
        out.append(x)
    steps = UNIT2 if u == 2 else DEFAULT
    if u in PRACTICE_DESC: steps = [(a, t, PRACTICE_DESC[u] if a == 'practice' else d) for a, t, d in steps]
    missing = [a for a, _, _ in steps if a not in used]
    assert not missing, (u, missing)
    s = s[:start] + strip(steps) + ''.join(out) + s[end:]
    open(path, 'w', encoding='utf-8').write(s)
    print(f'unit{u}.html:', ' | '.join(re.findall(r'<div class="section-label"[^>]*>([^<]*)', ''.join(out))))


if __name__ == '__main__':
    for u in range(1, 10): do(u)
