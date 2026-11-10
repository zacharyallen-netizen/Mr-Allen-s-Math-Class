"""Unit page clean-up approved by Mr. Allen (Nov 10, 2026). Run once:  python3 _build/unit_layout_nov10.py
then python3 _build/unit_start_here.py && python3 _build/build_units34.py
- Unit 5: "Practice Problems 5.1–5.4" moves from Games & Extras to Practice 2.
- Unit 6: "Practice 2" is renamed "More Practice & Review".
- Units 7, 8: the worksheet PDF + key move from the unit page into Practice 2 (the PDF is Practice 2).
- Unit 9: Practice 1 = the interactive practice (PDF + key inside it); notes PDFs live inside the notes page."""
import os, re, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from pdf_links import row
G = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'grade8')
def rd(f): return open(os.path.join(G, f), encoding='utf-8').read()
def wr(f, s): open(os.path.join(G, f), 'w', encoding='utf-8').write(s)
def card(s, href):
    m = re.search(r'<a href="%s" class="feature-card">.*?</a>\n' % re.escape(href), s); assert m, href; return m
# Unit 5
s = rd('unit5.html'); m = card(s, 'unit5-practice-problems.html'); c = m.group(0); s = s[:m.start()] + s[m.end():]
i = s.index('<div class="section-label">Printable Project</div>'); s = s[:i].rstrip('\n') + '\n' + c + '\n' + s[i:]; wr('unit5.html', s)
# Unit 6
s = rd('unit6.html'); assert s.count('<div class="section-label">Practice 2</div>') == 1
wr('unit6.html', s.replace('<div class="section-label">Practice 2</div>', '<div class="section-label">More Practice &amp; Review</div>'))
# Units 7, 8
for u in (7, 8):
    s = rd(f'unit{u}.html')
    for h in (f'unit{u}_worksheet.pdf', f'unit{u}_answer_key.pdf'): m = card(s, h); s = s[:m.start()] + s[m.end():]
    wr(f'unit{u}.html', s)
    p = rd(f'unit{u}-practice-2.html'); assert 'pdf-links' not in p
    p = re.sub(r'(<div class="page-hdr">.*?</div>\n)', lambda m: m.group(1) + row(f'unit{u}_worksheet.pdf', f'unit{u}_answer_key.pdf') + '\n', p, count=1, flags=re.S)
    assert 'pdf-links' in p; wr(f'unit{u}-practice-2.html', p)
# Unit 9
s = rd('unit9.html')
for h in ('Unit9_Volume_Notes_Blank.pdf', 'Unit9_Volume_Notes_AnswerKey.pdf', 'volume_worksheet.pdf', 'volume_answer_key.pdf'): m = card(s, h); s = s[:m.start()] + s[m.end():]
m = card(s, 'unit9-practice.html'); c = m.group(0); s = s[:m.start()] + s[m.end():]
s = s.replace('<div class="section-label">Practice 2</div>\n\n', '', 1).replace('<div class="section-label">Practice 2</div>\n', '', 1)
s = s.replace('<div class="section-label" id="practice">Practice 1</div>\n', '<div class="section-label" id="practice">Practice</div>\n' + c.replace('Practice (Interactive)', 'Practice — Interactive'), 1)
assert '<div class="section-label">Practice 2' not in s; wr('unit9.html', s)
p = rd('unit9-practice.html'); assert 'pdf-links' not in p
p = re.sub(r'(<div class="page-hdr">.*?</p>\n?(</div>\n)?)', lambda m: m.group(1) + row('volume_worksheet.pdf', 'volume_answer_key.pdf') + '\n', p, count=1, flags=re.S)
assert 'pdf-links' in p; wr('unit9-practice.html', p)
v = rd('volume.html'); assert 'pdf-links' not in v
i = v.index('<div class="practice-cta"'); v = v[:i] + row('Unit9_Volume_Notes_Blank.pdf', 'Unit9_Volume_Notes_AnswerKey.pdf', 'Blank Notes (PDF)') + '\n' + v[i:]; wr('volume.html', v)
print('done')
