"""Site search index for the side menu (Nov 18, 2026 site rebuild).

Reads the hub pages (home pages, unit pages, Arcade, EOG hub, Check-Ins, Skill Builders, Reset Room, Materials Index,
Math in Science / Financial Literacy, Grading) and the vocabulary glossary, and writes search-index.js:
    window.SITE_SEARCH = [[title, description, path from the site root, keywords, tag], ...]
Every card / link on those pages becomes one entry (same path = one entry, the best description wins); every glossary
word becomes an entry that opens the glossary. Forwarding stubs, archive pages and outside links are skipped.
Rerun after adding pages or cards:   python3 _build/search_index.py
"""
import os, re, json, html
from html.parser import HTMLParser
ROOT = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))

HUBS = ['index.html', 'class-information.html', 'grade8/index.html', 'grade8/arcade.html', 'grade8/8th_grade_eog_hub.html', 'grade8/benchmarks.html',
        'grade8/skill-builders.html', 'grade8/reset-room.html', 'grade8/materials_index.html', 'grade8/grading.html', 'grade8/units3-4.html',
        'grade8/math-science/index.html', 'grade8/math-finlit/index.html', 'grade8/tools.html'] + [f'grade8/unit{n}.html' for n in range(1, 10)]

def clean(t): return re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', t or ''))).strip()

class A(HTMLParser):
    """collects <a href> blocks with their inner html"""
    def __init__(self):
        super().__init__(convert_charrefs=False); self.out = []; self.stack = []
    def handle_starttag(self, tag, attrs):
        if tag == 'a':
            d = dict(attrs); self.stack.append([d.get('href', ''), ''])
        elif self.stack:
            self.stack[-1][1] += self.get_starttag_text()
    def handle_endtag(self, tag):
        if tag == 'a' and self.stack: self.out.append(self.stack.pop())
        elif self.stack: self.stack[-1][1] += f'</{tag}>'
    def handle_data(self, d):
        if self.stack: self.stack[-1][1] += d
    def handle_entityref(self, n):
        if self.stack: self.stack[-1][1] += f'&{n};'
    def handle_charref(self, n):
        if self.stack: self.stack[-1][1] += f'&#{n};'

def pick(inner, classes):
    for c in classes:
        m = re.search(r'<(\w+)[^>]*class="[^"]*\b' + c + r'\b[^"]*"[^>]*>(.*?)</\1>', inner, re.S)
        if m and clean(m.group(2)): return clean(m.group(2))
    return ''

def is_stub(path):
    try: t = open(path, encoding='utf-8', errors='ignore').read(3000)
    except OSError: return True
    return 'http-equiv="refresh"' in t.lower() or '/archive/' in path

def title_of(path):
    try: t = open(path, encoding='utf-8', errors='ignore').read(4000)
    except OSError: return ''
    m = re.search(r'<title>(.*?)</title>', t, re.S); return clean(m.group(1)) if m else ''

ent = {}
def add(title, desc, path, tag, kw=''):
    if not title or len(title) < 3: return
    k = path
    old = ent.get(k)
    if old and len(old[1]) >= len(desc): return
    ent[k] = [title[:90], desc[:160], path, kw[:200], tag]

UNIT = {f'grade8/unit{n}.html': f'Unit {n}' for n in range(1, 10)}
for hub in HUBS:
    fp = os.path.join(ROOT, hub)
    if not os.path.exists(fp): continue
    src = open(fp, encoding='utf-8').read()
    p = A(); p.feed(src)
    base = os.path.dirname(hub)
    for href, inner in p.out:
        if not href or href.startswith(('#', 'mailto:', 'javascript:', 'http')): continue
        h, frag = (href.split('#', 1) + [''])[:2]
        if not h: continue
        rel = os.path.normpath(os.path.join(base, h.split('?')[0])).replace('\\', '/')
        if rel.startswith('..'): continue
        full = os.path.join(ROOT, rel)
        if not os.path.exists(full) or (rel.endswith('.html') and is_stub(full)): continue
        title = pick(inner, ['unit-card-title', 'ft', 'title', 'name']) or clean(re.sub(r'<(small|span class="[^"]*(kind|tag|unit-num|unit-std)[^"]*")[^>]*>.*?</\w+>', ' ', inner, flags=re.S))
        m3 = re.search(r'<h3[^>]*>(.*?)</h3>', inner, re.S)
        if m3 and not pick(inner, ['unit-card-title', 'ft']): title = clean(m3.group(1))
        desc = pick(inner, ['unit-desc', 'fd', 'desc']) or (clean(re.search(r'<p[^>]*>(.*?)</p>', inner, re.S).group(1)) if re.search(r'<p[^>]*>(.*?)</p>', inner, re.S) else '')
        tagm = re.search(r'class="tag"[^>]*>(.*?)<', inner)
        tag = 'PDF' if rel.endswith('.pdf') else (clean(tagm.group(1)) if tagm else UNIT.get(hub, ''))
        if hub == 'grade8/arcade.html' and not rel.endswith('.pdf'): tag = ('Game · ' + tag) if tag else 'Game'
        if rel.endswith('.pdf') and 'Key' in rel: tag = 'Answer key'
        title = re.sub(r'^[^\w(]+', '', title).strip()
        if not title: continue
        if not desc and rel.endswith('.html'): desc = title_of(full)
        # generic names ("Interactive Guided Notes", "Mini-Lessons") get their unit in front
        um = re.search(r'unit-?(\d)', os.path.basename(rel), re.I) or re.search(r'Unit\s*(\d)', title_of(full) if rel.endswith('.html') else '')
        if um and not re.search(r'\bUnits?\s*\d', title) and hub != 'grade8/arcade.html': title = f'Unit {um.group(1)} · ' + title
        path = rel + ('#' + frag if frag and not rel.endswith('.pdf') else '')
        add(title, desc, path, tag, title_of(full) + ' ' + UNIT.get(hub, ''))

# glossary words
g = open(os.path.join(ROOT, 'grade8', 'vocabulary.html'), encoding='utf-8').read()
for blk in g.split('<div class="vcard" ')[1:]:
    t = clean(re.search(r'class="vcard-term">(.*?)</div>', blk, re.S).group(1)); d = clean(re.search(r'class="vcard-def">(.*?)</div>', blk, re.S).group(1))
    u = re.search(r'data-unit="(\w+)"', blk).group(1)
    ent['vocab:' + t] = [t, d[:160], 'grade8/vocabulary.html', 'vocabulary word definition ' + u, 'Vocab']

# a few hand entries students search for
for t, d, p, tag in [('Website tour video', '2 minutes with Digit: how the site works.', 'index.html#video-tour', 'Video'),
                     ('Student folder & I Can Tracker video', 'What is in your folder and how to raise a score.', 'grade8/grading.html#video-trackers', 'Video'),
                     ('Chill Math Music', 'Focus music for work time.', 'grade8/drift.html', 'Break'),
                     ('Desmos Graphing Calculator', 'Use only when the problem says Calculator OK.', 'https://www.desmos.com/calculator', 'Calculator'),
                     ('Desmos Scientific Calculator', 'Use only when the problem says Calculator OK.', 'https://www.desmos.com/scientific', 'Calculator')]:
    ent['x:' + t] = [t, d, p, '', tag]

rows = sorted(ent.values(), key=lambda r: (r[4] == 'PDF' or r[4] == 'Answer key', r[0].lower()))
out = ('/* Built by _build/search_index.py — do not edit by hand. [title, description, path, keywords, tag] */\n'
       'window.SITE_SEARCH = ' + json.dumps(rows, ensure_ascii=False, separators=(',', ':')) + ';\n')
open(os.path.join(ROOT, 'search-index.js'), 'w', encoding='utf-8').write(out)
print('ok', len(rows), 'entries,', sum(1 for r in rows if r[4] == 'Vocab'), 'vocab,', sum(1 for r in rows if r[4] in ('PDF', 'Answer key')), 'PDFs,', round(len(out) / 1024), 'KB')
