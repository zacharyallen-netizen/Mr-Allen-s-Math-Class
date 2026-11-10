"""Build grade8/units3-4.html, the combined Units 3–4 page (2026-27: Units 3 and 4 are taught together).
It reuses the cards on unit3.html and unit4.html, so rerun this after either unit page changes:
    python3 _build/build_units34.py"""
import os, re, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from unit_start_here import CSS as SH_CSS, strip as sh_strip

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
G = os.path.join(ROOT, 'grade8')

def unit(u):
    s = open(os.path.join(G, f'unit{u}.html'), encoding='utf-8').read()
    s = re.sub(r'<!--start-here-->.*?<!--/start-here-->\n?', '', s, flags=re.S)
    start = s.index('<div class="section-label"')
    end = s.rindex('</div>', 0, s.index('<div class="site-footer">'))
    secs = [p for p in re.split(r'(?=<div class="section-label")', s[start:end]) if p.strip()]
    info = dict(
        title=re.search(r'<h1>([^<]*)</h1>', s).group(1),
        dates=re.search(r'<h1>[^<]*</h1>\s*<p>([^<]*)</p>', s).group(1),
        stds=re.search(r'<p class="stds">([^<]*)</p>', s).group(1).replace('Standards: ', ''),
        head=s[:s.index('<div class="unit-bg"')])
    info['head'] = re.sub(r'<style id="start-here-css">.*?</style>\n?', '', info['head'], flags=re.S)
    shared = [x for x in secs if re.match(r'<div class="section-label"[^>]*>Units 3', x)]
    own = [x for x in secs if x not in shared]
    # label each section with its unit: "Notes" -> "Unit 3 · Notes"
    own = [re.sub(r'<div class="section-label"(?: id="([^"]*)")?([^>]*)>', lambda m: f'<div class="section-label"' + (f' id="u{u}-{m.group(1)}"' if m.group(1) else '') + f'{m.group(2)}>Unit {u} · ', x, count=1) for x in own]
    return info, shared, own

i3, sh3, own3 = unit(3)
i4, sh4, own4 = unit(4)
shared = (sh3 or sh4)[0]
shared = re.sub(r'<div class="section-label"[^>]*>[^<]*</div>', '<div class="section-label" id="pretest">Units 3–4 Pre-Test &amp; Review</div>', shared, count=1)

head = i3['head']
head = head.replace('</head>', SH_CSS + '\n</head>', 1)
head = re.sub(r'<title>[^<]*</title>', "<title>Units 3–4 — Equations &amp; Angles | Mr. Allen's 8th Grade Math</title>", head)
nav = ' '.join(f'<a class="nb" href="unit{n}.html">U{n}</a>' for n in range(1, 10)).replace(
    '<a class="nb" href="unit3.html">U3</a>', '<a class="nb active" href="units3-4.html" aria-current="page">U3–4</a> <a class="nb" href="unit3.html">U3</a>')
jump = ('<div class="topic-nav" aria-label="On this page"><a class="nb" href="#start-here">Start here</a> '
        '<a class="nb" href="#unit3">Unit 3 · Equations</a> <a class="nb" href="#unit4">Unit 4 · Angles</a> <a class="nb" href="#pretest">Pre-Test</a></div>')
start_here = sh_strip([('u3-notes', 'Unit 3: Notes & Practice', 'Equations. Notes first, then Practice 1 and 2.'),
                       ('u4-notes', 'Unit 4: Notes & Practice', 'Angles. Notes first, then Practice 1 and 2.'),
                       ('u3-homework', 'Homework', 'Unit 3 homework, then Unit 4 homework.'),
                       ('pretest', 'Units 3–4 Pre-Test', 'Check yourself at the end, before the unit test.')]).replace('<section class="start-here"', '<section class="start-here" id="start-here"')

def block(u, info, own):
    return (f'<h2 id="unit{u}" class="u34-h">{info["title"]}</h2>\n'
            f'<p class="u34-sub">{info["dates"]} · Standards: {info["stds"]} · <a href="unit{u}.html">Open the full Unit {u} page →</a></p>\n'
            + ''.join(own))

page = head + f'''<div class="unit-bg" aria-hidden="true" style="background-image:url('../images/unit-bg/unit3.jpg')"></div>
<script src="../site-bar.js"></script>
<style>
.u34-h{{font-family:var(--serif,"Source Serif 4",Georgia,serif);color:var(--navy,#1E2D4F);font-size:1.55rem;margin:34px 0 4px;scroll-margin-top:70px}}
.u34-sub{{margin:0 0 6px;color:var(--muted,#5B6475);font-size:15px}}
.u34-sub a{{color:var(--navy,#1E2D4F);font-weight:600}}
#start-here,#pretest{{scroll-margin-top:70px}}
</style>

<div class="page-wrap">
<a href="index.html" class="back-link">← Back to All Units</a>
<div class="page-hdr">
  <h1>Units 3–4 — Equations &amp; Angles</h1>
  <p>{i3["dates"].split("–")[0].strip()} – {i4["dates"].split("–")[-1].strip()} · Units 3 and 4 are taught together this year</p>
  <p class="stds">Standards: {i3["stds"]} · {i4["stds"]}</p>
</div>
<div class="topic-nav">{nav}</div>
{jump}
<div class="intro"><p>This year we learn Unit 3 (linear equations) and Unit 4 (angles) together. Work through Unit 3, then Unit 4.
Finish with the Units 3–4 pre-test and review. Each unit still has its own full page.</p></div>
{start_here}{block(3, i3, own3)}
{block(4, i4, own4)}
<h2 class="u34-h">Units 3–4 Pre-Test &amp; Review</h2>
{shared}
</div>
<div class="site-footer">© Mr. Allen's Math Class · 8th Grade Math</div>
<script src="unit-next.js?v=20261110a"></script>
</body>
</html>
'''
open(os.path.join(G, 'units3-4.html'), 'w', encoding='utf-8').write(page)
print('wrote grade8/units3-4.html')
