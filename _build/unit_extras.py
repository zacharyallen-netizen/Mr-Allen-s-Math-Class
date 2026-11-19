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

# Units 3–4 page (Nov 19, 2026, Zach: "move the other activities down until after the Pre-Test and Tutorial and provide a
# brief summary of what they are and how they can be best utilized"): a "More for Units 3–4" section AFTER the pre-test
# and tutorial, grouped, each with what it is and how to use it best.
def card(href, title, what, new_tab=False):
    t = ' target="_blank" rel="noopener"' if new_tab else ''
    return f'<a class="mx-c" href="{href}"{t}><b>{title}</b><span>{what}</span></a>'
def group(title, best, cards):
    return f'<div class="mx-g"><h3>{title}</h3><p class="mx-best"><b>Best use:</b> {best}</p><div class="mx-row">' + ''.join(cards) + '</div></div>'
G = {h: (n, e) for u in (3, 4) for h, n, e in GAMES.get(u, [])}
DESC = {'equation_master.html': 'Solve equations by choosing the right move at each step.',
        'zero-pair-run.html': 'Algebra tiles: undo each step on both sides and watch the tiles cancel.',
        'laser-vault.html': 'Find angles with parallel lines and triangles to open laser doors.',
        'angle-pulse.html': 'Quick rounds on angle pairs, parallel lines and triangle sums.',
        'museum-of-angles.html': 'A treasure hunt for angle pairs hidden in original art.'}
assert set(G) == set(DESC), sorted(G)
more = ('<div class="mx" id="more"><div class="section-label" id="more-for-units-3-4">More for Units 3–4</div>'
  '<p class="mx-in">Do the Pre-Test and Tutorial first. Then use these to fix what was hard or to keep practicing.</p>'
  + group('Review the ideas', 'keep a chart open while you practice, and look back at it before the test.', [
      card('anchor-charts/' + ANCHOR[3] + '.pdf', '📌 Unit 3 anchor chart', 'One page: steps for equations and inequalities.', True),
      card('anchor-charts/' + ANCHOR[4] + '.pdf', '📌 Units 4–5 anchor chart', 'One page: angle pairs and triangle rules.', True)])
  + group('Skill Builders <span class="plain">(short lessons and videos)</span>', 'when a pre-test question was hard. Watch the lesson, then do the practice for that skill.', [
      card('skill-builders-unit3.html', '🧩 Unit 3 lessons', 'Short video lessons on solving equations.'),
      card('skill-builders-unit3-practice.html', '✏️ Unit 3 practice', 'Practice the same skills, one problem at a time.'),
      card('skill-builders-unit4.html', '🧩 Unit 4 lessons', 'Short video lessons on angles.'),
      card('skill-builders-unit4-practice.html', '✏️ Unit 4 practice', 'Practice the same skills, one problem at a time.')])
  + group('Words to know', 'learn the words that show up on the test. Flip the cards, then try Vocab Blitz.', [
      card('vocab-flashcards.html?unit=u3', '📇 Unit 3 flashcards', 'Equation and inequality words.'),
      card('vocab-flashcards.html?unit=u4', '📇 Unit 4 flashcards', 'Angle and triangle words.'),
      card('vocabulary.html', '🔤 Vocabulary', 'Every word with its meaning and an example.')])
  + group('Math games', 'after your work is done. The games use the same steps as class, and points count only for first tries.',
      [card(h, f'{G[h][1]} {html.escape(G[h][0])}', DESC[h]) for h in G])
  + '</div>')
MXCSS = ('<style id="units34-more-css">.mx{margin-top:28px}.mx-in{color:#C9D2E3;font:500 15px/1.5 Inter,sans-serif;margin:6px 0 14px}'
  '.mx-g{background:#fff;border-radius:14px;padding:16px 18px;margin:0 0 14px;color:#1E2D4F}'
  '.mx-g h3{font:600 20px "Source Serif 4",Georgia,serif;margin:0 0 4px;color:#1E2D4F}.mx-g h3 .plain{font:500 14px Inter,sans-serif;color:#5B6475}'
  '.mx-best{font:500 14.5px/1.45 Inter,sans-serif;color:#3D4760;margin:0 0 10px}.mx-best b{color:#8A6100}'
  '.mx-row{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:10px}'
  '.mx-c{display:flex;flex-direction:column;gap:3px;text-decoration:none;color:#1E2D4F;border:1px solid #D5DAE3;border-radius:10px;padding:10px 12px;background:#F7F7F4}'
  '.mx-c:hover,.mx-c:focus-visible{border-color:#E0A800;background:#FFF6D6}.mx-c b{font:600 15px Inter,sans-serif}.mx-c span{font:500 13.5px/1.4 Inter,sans-serif;color:#3D4760}'
  '@media print{.mx{display:none}}</style>')
p34 = os.path.join(G8, 'units3-4.html'); s34 = open(p34, encoding='utf-8').read()
for rx in (r'<!--unit-extras-->.*?<!--/unit-extras-->', r'<!--units34-more-->.*?<!--/units34-more-->', r'<style id="unit-extras-css">.*?</style>\n?', r'<style id="units34-more-css">.*?</style>\n?'):
    s34 = re.sub(rx, '', s34, flags=re.S)
end = '</div>\n<div class="site-footer">'; assert s34.count(end) == 1
s34 = s34.replace(end, '<!--units34-more-->' + more + '<!--/units34-more-->\n' + end).replace('</head>', MXCSS + '\n</head>', 1)
open(p34, 'w', encoding='utf-8').write(s34)
print('ok', {u: len(g) for u, g in sorted(GAMES.items())})
