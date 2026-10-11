# -*- coding: utf-8 -*-
"""Site-wide makeover rollout.
 1. Every page loads the shared top bar (site-bar.js) as the first thing in <body>.
 2. The old site navigation strip at the top of a page is removed. Its site-wide links
    are all in the new bar; any page-specific links (← Unit 5, U1–U9, Fluency, Print)
    are kept in a slim row (.sb-local) under the bar.
 3. The floating round home buttons are removed (the bar replaces them).
 4. The eagle emoji is removed everywhere.
 5. Hub pages switch from theme.css to site.css (via makeover.py).
Page text, activities and links are otherwise left exactly as they are."""
import io, os, re, subprocess, sys, posixpath
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import makeover

ROOT = '/home/claude/mr-allen-s-math-class'
EMOJI = makeover.EMOJI
GLOBAL = {'index.html', 'grade8/index.html', 'math1/index.html', 'class-information.html',
          'grade8/class-information.html', 'math1/class-information.html',
          'grade8/8th_grade_eog_hub.html', 'grade8/arcade.html', 'about.html'}
HUBS = (['index.html', 'class-information.html', 'grade8/index.html', 'math1/index.html'] +
        ['grade8/unit%d.html' % i for i in range(1, 10)] + ['math1/unit%d.html' % i for i in range(1, 9)])
BRAND = re.compile(r'Mr\. Allen|IC Imagine|\U0001F985|nav-title|class="brand"|class="(?:top-nav|sitenav)"')

def norm(page, href):
    href = href.split('#')[0].split('?')[0]
    if not href or re.match(r'(https?:|mailto:|javascript:)', href): return None
    return posixpath.normpath(posixpath.join(posixpath.dirname(page), href))

def clean_text(t):
    t = EMOJI.sub('', t)
    return re.sub(r'\s+', ' ', t).strip()

def local_row(page, inner):
    items = []
    for m in re.finditer(r'<a\b([^>]*)>(.*?)</a>|<button\b([^>]*)>(.*?)</button>', inner, re.S):
        if m.group(1) is not None:
            attrs, text = m.group(1), m.group(2)
            hm = re.search(r'href="([^"]*)"', attrs)
            if not hm: continue
            target = norm(page, hm.group(1))
            if target in GLOBAL: continue
            label = clean_text(re.sub(r'<[^>]+>', ' ', text))
            if not label: continue
            act = ' aria-current="page"' if re.search(r'class="[^"]*\bactive\b', attrs) or target == page else ''
            items.append('<a href="%s"%s>%s</a>' % (hm.group(1), act, label))
        else:
            attrs, text = m.group(3), m.group(4)
            oc = re.search(r'onclick="([^"]*)"', attrs)
            label = clean_text(re.sub(r'<[^>]+>', ' ', text))
            if oc and label:
                items.append('<button type="button" onclick="%s">%s</button>' % (oc.group(1), label))
    return items

def roll(page):
    path = os.path.join(ROOT, page)
    h = io.open(path, encoding='utf-8').read()
    orig = h
    notes = []
    if 'http-equiv="refresh"' in h:          # redirect stubs: just drop the floating button
        h = re.sub(r'\s*<a href="[^"]*" title="[^"]*" style="position:fixed;bottom:20px;left:20px[^>]*>[^<]*</a>', '', h)
        if h != orig: io.open(path, 'w', encoding='utf-8').write(h)
        return 'stub'
    up = '../' * page.count('/')
    tag = '<script src="%ssite-bar.js"></script>' % up
    if tag not in h:
        h = re.sub(r'<body([^>]*)>', lambda m: '<body%s>\n%s' % (m.group(1), tag), h, count=1)
    b = h.index(tag) + len(tag)
    # old site nav near the top of the body
    window = h[b:b + 4000]
    for m in re.finditer(r'<nav\b[^>]*>.*?</nav>', window, re.S):
        if not BRAND.search(m.group(0)[:600]): continue
        items = local_row(page, m.group(0))
        new = ('<nav class="sb-local" aria-label="On this page">%s</nav>' % ' '.join(items)) if items else ''
        h = h[:b + m.start()] + new + h[b + m.end():]
        notes.append('nav→%d local' % len(items))
        break
    # floating round home buttons
    h, n = re.subn(r'\s*<a href="[^"]*" title="[^"]*" style="position:fixed;bottom:20px;left:20px[^>]*>[^<]*</a>', '', h)
    if n: notes.append('home-btn')
    # eagle
    k = h.count('\U0001F985')
    if k:
        h = h.replace('\U0001F985 ', '').replace(' \U0001F985', '').replace('\U0001F985', '')
        notes.append('eagle×%d' % k)
    io.open(path, 'w', encoding='utf-8').write(h)
    if page in HUBS:
        makeover.transform(ROOT, page)
        notes.append('hub')
    return ', '.join(notes)

if __name__ == '__main__':
    pages = subprocess.run(['git', 'ls-files', '*.html'], cwd=ROOT, capture_output=True, text=True).stdout.split()
    pages += [p for p in ['about.html', 'math-facts.html'] if p not in pages]
    for p in pages:
        print('%-62s %s' % (p, roll(p)))
