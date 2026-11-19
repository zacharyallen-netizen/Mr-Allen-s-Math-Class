""""Also for this unit" row on every unit page (Nov 18, 2026 site rebuild, Zach: students knowing what is available
and where to find it). Right under "What you will learn in Unit N" it lists, as chips: the Arcade games for that unit
(read from the tags on grade8/arcade.html), the unit's anchor chart, the Skill Builders lessons + practice for the unit,
the unit's vocab flashcards (vocab-flashcards.html?unit=uN) and the glossary.
Writes between <!--unit-extras--> and <!--/unit-extras--> after <!--/unit-goals-->; safe to rerun (run it after
_build/unit_start_here.py, which rewrites the goals block).   python3 _build/unit_extras.py
"""
import os, re, html
ROOT = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
G8 = os.path.join(ROOT, 'grade8')

arc = open(os.path.join(G8, 'arcade.html'), encoding='utf-8').read()
GAMES = {}
for m in re.finditer(r'<a class="card"[^>]*href="([^"]+)"[^>]*>(.*?)</a>', arc, re.S):
    href, inner = m.groups()
    tag = re.search(r'class="tag">(.*?)<', inner); name = re.search(r'<h3>(.*?)</h3>', inner, re.S)
    emo = re.search(r'class="emoji">(.*?)<', inner)
    if not tag or not name: continue
    units = [int(u) for u in re.findall(r'\d', html.unescape(tag.group(1)))] if re.search(r'Units?\s', tag.group(1)) else []
    for u in units: GAMES.setdefault(u, []).append((href, html.unescape(re.sub(r'<[^>]+>', '', name.group(1))).strip(), emo.group(1) if emo else '🎮'))

ANCHOR = {1: 'Unit1_Real_Number_System_Anchor_Chart', 2: 'Unit2_Exponents_Scientific_Notation_Anchor_Chart', 3: 'Unit3_Equations_Inequalities_Anchor_Chart',
          4: 'Units4-5_Angles_Pythagorean_Anchor_Chart', 5: 'Units4-5_Angles_Pythagorean_Anchor_Chart', 6: 'Unit6_Functions_Anchor_Chart',
          7: 'Unit7_Statistics_Anchor_Chart', 8: 'Unit8_Transformations_Anchor_Chart'}
for v in ANCHOR.values(): assert os.path.exists(os.path.join(G8, 'anchor-charts', v + '.pdf')), v

CSS = ('<style id="unit-extras-css">.unit-extras{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin:12px 0 4px;font:500 14px Inter,sans-serif;color:#1E2D4F}'
       '.unit-extras b{font:700 13px Inter,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:#C9D2E3;margin-right:4px}'
       '.unit-extras a{display:inline-flex;align-items:center;gap:6px;text-decoration:none;color:#1E2D4F;background:#fff;border:1px solid #D5DAE3;border-radius:999px;padding:6px 12px;font:600 13.5px Inter,sans-serif}'
       '.unit-extras a:hover{border-color:#E0A800;background:#FFF6D6}.unit-extras a.g{border-color:#C9B6F2;background:#F7F3FF}'
       '@media print{.unit-extras{display:none}}</style>')

def chips(n, label):
    out = []
    for href, name, emo in GAMES.get(n, []): out.append(f'<a class="g" href="{href}">{emo} {html.escape(name)}</a>')
    if n in ANCHOR: out.append(f'<a href="anchor-charts/{ANCHOR[n]}.pdf" target="_blank" rel="noopener">📌 Anchor chart</a>')
    if n <= 8: out += [f'<a href="skill-builders-unit{n}.html">🧩 Skill Builders lessons</a>', f'<a href="skill-builders-unit{n}-practice.html">✏️ Skill Builders practice</a>']
    out.append(f'<a href="vocab-flashcards.html?unit={"vol" if n == 9 else "u" + str(n)}">📇 Vocab flashcards</a>')
    out.append('<a href="vocabulary.html">🔤 Vocabulary</a>')
    return f'<div class="unit-extras" aria-label="Also for {label}"><b>Also for {label}:</b>' + ''.join(out) + '</div>'

def write(fn, block):
    p = os.path.join(G8, fn); s = open(p, encoding='utf-8').read()
    s = re.sub(r'<!--unit-extras-->.*?<!--/unit-extras-->', '', s, flags=re.S)
    s = re.sub(r'<style id="unit-extras-css">.*?</style>', '', s, flags=re.S)
    s = s.replace('</head>', CSS + '\n</head>', 1)
    blk = '<!--unit-extras-->' + block + '<!--/unit-extras-->'
    if '<!--/unit-goals-->' in s: s = s.replace('<!--/unit-goals-->', '<!--/unit-goals-->' + blk, 1)
    else:                                     # units3-4.html has no goals block: put it after the page header
        m = re.search(r'</h1>.*?</(div|header)>', s, re.S); assert m, fn; s = s[:m.end()] + blk + s[m.end():]
    open(p, 'w', encoding='utf-8').write(s)

for n in range(1, 10): write(f'unit{n}.html', chips(n, f'Unit {n}'))
both = chips(3, 'Unit 3').replace('Also for Unit 3', 'Also for Units 3–4')
extra4 = re.findall(r'<a class="g".*?</a>', chips(4, 'Unit 4'))
both = both.replace('<a href="anchor-charts', ''.join(extra4) + '<a href="anchor-charts', 1)
write('units3-4.html', both)
print('ok', {u: len(g) for u, g in sorted(GAMES.items())})
