# -*- coding: utf-8 -*-
"""Light makeover for HUB pages: shared top bar, site.css, no decorative emoji in
headings/labels. Text, links and order of content are left exactly as they are.
Usage: python3 makeover.py <site_root> <page> [<page> ...]   (pages relative to site_root)"""
import io, re, os, sys
EMOJI = re.compile('[\U0001F000-\U0001FAFF☀-➿⬀-⯿️‍⃣]+')
FONTS = ('<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700'
         '&family=Source+Serif+4:opsz,wght@8..60,600&family=JetBrains+Mono:wght@500;600&display=swap" rel="stylesheet">')

def strip_emoji_in(h, tag_re):
    def fix(m):
        inner = m.group(2)
        # only touch text outside of nested tags
        parts = re.split(r'(<[^>]+>)', inner)
        parts = [p if p.startswith('<') else EMOJI.sub('', p) for p in parts]
        inner = ''.join(parts)
        inner = re.sub(r'^\s+', '', inner); inner = re.sub(r'\s{2,}', ' ', inner).rstrip()
        return m.group(1) + inner + m.group(3)
    return re.sub(tag_re, fix, h, flags=re.S)

def kind(href, title):
    t = (href + ' ' + title).lower()
    if 'answerkey' in t or 'answer key' in t or '_key' in t: return '<span class="kind key">Answer key</span>'
    if '(game)' in t: return '<span class="kind">Game</span>'
    if href.lower().endswith('.pdf'): return '<span class="kind">PDF</span>'
    return '<span class="kind">Interactive</span>'

def transform(root, page):
    path = os.path.join(root, page)
    h = io.open(path, encoding='utf-8').read()
    depth = page.count('/')
    up = '../' * depth
    # stylesheet: theme.css -> site.css (root copy)
    h, n = re.subn(r'<link rel="stylesheet" href="(?:\.\./)*theme\.css">', '<link rel="stylesheet" href="%ssite.css">' % up, h)
    assert n == 1, (page, 'theme link', n)
    h = re.sub(r'<link href="https://fonts\.googleapis\.com/css2\?family=Arvo[^"]*" rel="stylesheet">', FONTS, h)
    # old nav out, shared bar in
    h, n = re.subn(r'\s*<nav class="top-nav">.*?</nav>', '', h, count=1, flags=re.S)
    if '<script src="%ssite-bar.js"></script>' % up not in h:
        h = re.sub(r'<body([^>]*)>', lambda m: '<body%s>\n<script src="%ssite-bar.js"></script>' % (m.group(1), up), h, count=1)
    # decorative emoji out of headings, labels, badges
    h = strip_emoji_in(h, r'(<h1[^>]*>)(.*?)(</h1>)')
    h = strip_emoji_in(h, r'(<div class="section-label"[^>]*>)(.*?)(</div>)')
    h = strip_emoji_in(h, r'(<div class="school-badge"[^>]*>)(.*?)(</div>)')
    h = strip_emoji_in(h, r'(<div class="section-title"[^>]*>)(.*?)(</div>)')
    h = strip_emoji_in(h, r'(<h2[^>]*>)(.*?)(</h2>)')
    # per-row accent colours are replaced by the single site style
    h = re.sub(r'(class="(?:feature-card|unit-card|doc-card)") style="border-(?:left|top)-color:[^"]*"', r'\1', h)
    # the home page's own course-card styles are now in site.css
    h = re.sub(r'<style>\s*\.course-grid\{.*?</style>\s*', '', h, flags=re.S)
    # unit pages: type label on each material row
    if re.search(r'(^|/)unit\d\.html$', page):
        def addkind(m):
            a, inner = m.group(1), m.group(2)
            if 'class="kind' in inner: return m.group(0)
            href = re.search(r'href="([^"]+)"', a).group(1)
            title = re.sub('<[^>]+>', '', inner)
            return a + inner + kind(href, title) + '</a>'
        h = re.sub(r'(<a href="[^"]+" class="feature-card"[^>]*>)(.*?)</a>', addkind, h, flags=re.S)
    io.open(path, 'w', encoding='utf-8').write(h)
    return page

if __name__ == '__main__':
    root = sys.argv[1]
    for p in sys.argv[2:]:
        print('made over:', transform(root, p))
