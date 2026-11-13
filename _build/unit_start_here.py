"""Unit pages (grade8/unit1.html … unit9.html): "What you will learn" (learning targets + standards) at the top and the pre-test at the END.
Nothing is removed: sections are only reordered (pre-test sections move to the bottom) and labeled with ids.
Safe to run again (it replaces its own strip).   python3 _build/unit_start_here.py   (then python3 _build/build_units34.py)"""
import os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
G = os.path.join(ROOT, 'grade8')

# Nov 13, 2026 (Zach): the "Start here: do these in order" strip is gone. The top of each unit page now shows
# "What you will learn": the learning targets (the "I can" list from the unit's Interactive Notes) and the
# standards with a short meaning. The notes pages keep their own "I can" box for print, but hide it on screen.
CSS = """<style id="unit-goals-css">
.unit-goals{background:#fff;border:1px solid #E3E5EA;border-top:5px solid #FFC107;border-radius:12px;padding:16px 20px 18px;margin:18px 0 8px;box-shadow:0 8px 28px rgba(0,0,0,.18);color:#1E2D4F}
.unit-goals h2{font:600 1.3rem/1.2 "Source Serif 4",Georgia,serif;margin:0 0 12px}
.ug-cols{display:grid;grid-template-columns:1.25fr 1fr;gap:18px}
.ug-cols h3{font:700 13px Inter,system-ui,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:#7A5300;margin:0 0 8px}
.ug-t{list-style:none;margin:0;padding:0}.ug-t li{position:relative;padding:4px 0 4px 26px;font:500 15.5px/1.4 Inter,system-ui,sans-serif}
.ug-t li::before{content:"";position:absolute;left:0;top:7px;width:16px;height:16px;border-radius:50%;background:#FFC107;box-shadow:inset 0 0 0 4px #FFF3C4}
.ug-s{list-style:none;margin:0;padding:0}.ug-s li{display:flex;gap:10px;align-items:baseline;padding:4px 0;font:500 14.5px/1.4 Inter,system-ui,sans-serif;color:#46506A}
.ug-s b{flex:none;font:600 12.5px "JetBrains Mono",monospace;color:#1E2D4F;background:#EEF1F6;border-radius:6px;padding:2px 7px}
.section-label[id]{scroll-margin-top:70px}
@media (max-width:760px){.ug-cols{grid-template-columns:1fr}}
@media print{.unit-goals{box-shadow:none}}
</style>"""

NOTES = {1: ['unit1-notes.html'], 2: ['unit2-notes-exponents.html', 'unit2-notes-sci-notation.html'], 3: ['unit3-notes.html'],
         4: ['unit4-notes.html'], 5: ['unit5-notes.html'], 6: ['unit6-notes.html'], 7: ['unit7-notes.html'], 8: ['unit8-notes.html'], 9: ['volume.html']}
STD = {   # short meanings (student words)
 'NC.8.NS.1': 'Tell rational and irrational numbers apart using their decimals.',
 'NC.8.NS.2': 'Estimate irrational numbers and place them on a number line.',
 'NC.8.EE.1': 'Use the rules of exponents, including zero and negative exponents.',
 'NC.8.EE.2': 'Find square roots and cube roots, and solve x² = p and x³ = p.',
 'NC.8.EE.3': 'Write very large and very small numbers in scientific notation.',
 'NC.8.EE.4': 'Add, subtract, multiply and divide in scientific notation.',
 'NC.8.EE.7': 'Solve equations and inequalities in one variable, with one, none or infinitely many solutions.',
 'NC.8.EE.8': 'Solve systems of two linear equations.',
 'NC.8.F.1': 'Know that a function gives each input exactly one output.',
 'NC.8.F.2': 'Compare functions shown as graphs, tables, equations and words.',
 'NC.8.F.3': 'Tell linear and nonlinear functions apart.',
 'NC.8.F.4': 'Find and explain slope (rate of change) and y-intercept.',
 'NC.8.F.5': 'Describe and sketch a graph from a story.',
 'NC.8.G.2': 'Use translations, reflections and rotations to show figures are congruent.',
 'NC.8.G.3': 'Find the new coordinates after a translation, reflection, rotation or dilation.',
 'NC.8.G.4': 'Use dilations to show figures are similar.',
 'NC.8.G.5': 'Use angle facts: parallel lines cut by a transversal, triangle angle sums and exterior angles.',
 'NC.8.G.6': 'Explain the Pythagorean Theorem and its converse.',
 'NC.8.G.7': 'Use the Pythagorean Theorem to find missing sides in 2-D and 3-D.',
 'NC.8.G.8': 'Use the Pythagorean Theorem to find the distance between two points.',
 'NC.8.G.9': 'Find the volume of cylinders, cones and spheres.',
 'NC.8.SP.1': 'Make and read scatter plots and describe patterns.',
 'NC.8.SP.2': 'Draw a line of best fit and judge how well it fits.',
 'NC.8.SP.3': 'Use a line of best fit to make predictions and explain slope.',
 'NC.8.SP.4': 'Make and read two-way tables.'}
CODES = {1: ['NC.8.NS.1', 'NC.8.NS.2', 'NC.8.EE.2'], 2: ['NC.8.EE.1', 'NC.8.EE.3', 'NC.8.EE.4'], 3: ['NC.8.EE.7'], 4: ['NC.8.G.5'],
         5: ['NC.8.G.6', 'NC.8.G.7', 'NC.8.G.8'], 6: ['NC.8.F.1', 'NC.8.F.2', 'NC.8.F.3', 'NC.8.F.4', 'NC.8.F.5', 'NC.8.EE.8'],
         7: ['NC.8.SP.1', 'NC.8.SP.2', 'NC.8.SP.3', 'NC.8.SP.4'], 8: ['NC.8.G.2', 'NC.8.G.3', 'NC.8.G.4'], 9: ['NC.8.G.9']}


def targets(u):
    out = []
    for n in NOTES[u]:
        t = open(os.path.join(G, n), encoding='utf-8').read()
        i = t.find('By the end of this unit, I can')
        if i < 0: continue
        ul = t[t.index('<ul', i):t.index('</ul>', i)]
        for li in re.findall(r'<li[^>]*>(.*?)</li>', ul, re.S):
            li = re.sub(r'<[^>]+>', '', li).strip()
            if li and li not in out: out.append(li)
    assert out, u
    return out


def goals(u):
    ts = ''.join(f'<li>I can {t[0].lower() + t[1:]}</li>' for t in targets(u))
    ss = ''.join(f'<li><b>{c.replace("NC.", "")}</b><span>{STD[c]}</span></li>' for c in CODES[u])
    return (f'<!--unit-goals--><section class="unit-goals" aria-labelledby="ug-h"><h2 id="ug-h">What you will learn in Unit {u}</h2>'
            f'<div class="ug-cols"><div><h3>Learning targets</h3><ul class="ug-t">{ts}</ul></div>'
            f'<div><h3>Standards</h3><ul class="ug-s">{ss}</ul></div></div></section><!--/unit-goals-->\n')


def hide_in_notes():
    """The notes keep their "I can" box (it prints), but it is hidden on screen: the unit page shows it now."""
    css = '<style id="ican-hide">@media screen{body:not(.paper) .ican-box,body:not(.paper) .ican-box + p.stds{display:none!important}}</style>'
    for u, names in NOTES.items():
        for n in names:
            p = os.path.join(G, n); t = open(p, encoding='utf-8').read(); o = t
            i = t.find('By the end of this unit, I can')
            if i < 0: continue
            if 'class="ican-box"' not in t:
                j = t.rfind('<div style="background:#fff8e1', 0, i)
                assert 0 <= j and i - j < 400, (n, j, i)
                t = t[:j] + '<div class="ican-box" ' + t[j + 5:]
            if 'id="ican-hide"' not in t: t = t.replace('</head>', css + '\n</head>', 1) if '</head>' in t else t.replace('<div class="ican-box"', css + '<div class="ican-box"', 1)
            if t != o: open(p, 'w', encoding='utf-8').write(t)


def is_pretest(sec):
    return bool(re.match(r'<div class="section-label"[^>]*>[^<]*Pre-Test', sec))


def anchor_for(label, u):
    l = label.lower()
    if 'pre-test' in l: return 'pretest'
    if u == 2 and l.startswith('part 1'): return 'part1'
    if u == 2 and l.startswith('part 2'): return 'part2'
    if l == 'notes': return 'notes'
    if l.startswith('practice'): return 'practice'
    if l in ('homework', 'targeted practice'): return 'homework'
    return None


def do(u):
    path = os.path.join(G, f'unit{u}.html'); s = open(path, encoding='utf-8').read()
    s = re.sub(r'<!--start-here-->.*?<!--/start-here-->\n?', '', s, flags=re.S)
    s = re.sub(r'<!--unit-goals-->.*?<!--/unit-goals-->\n?', '', s, flags=re.S)
    s = re.sub(r'<style id="start-here-css">.*?</style>\n?', '', s, flags=re.S)
    s = re.sub(r'<style id="unit-goals-css">.*?</style>\n?', '', s, flags=re.S)
    s = s.replace('</head>', CSS + '\n</head>', 1)
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
    s = s[:start] + goals(u) + ''.join(out) + s[end:]
    open(path, 'w', encoding='utf-8').write(s)
    print(f'unit{u}.html:', ' | '.join(re.findall(r'<div class="section-label"[^>]*>([^<]*)', ''.join(out))))


if __name__ == '__main__':
    for u in range(1, 10): do(u)
    hide_in_notes()
