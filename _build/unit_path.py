"""Unit page path + Quick Check + plain meanings + section icons (Nov 19, 2026; Zach approved the plan:
"keep things in sequence but allow students to move through different parts at their discretion", a short diagnostic
screener at the start of each unit, plain meanings in parentheses "when appropriate", a picture or icon for each section).

On unit1-9.html it:
  1. puts a "Quick Check" section (link to unitN-screener.html, built by _build/screener/make.py) before the first section;
  2. gives every section label an id and an icon (data-ic, drawn by CSS) and adds a plain meaning in parentheses to the
     class terms (Targeted Practice (homework), Pre-Test (practice test ...), EOG Practice (...), Tutorial (...));
  3. writes an "In this unit" row of numbered jump links, in page order, right after the "Also for this unit" row.
Nothing is locked or reordered. units3-4.html gets the plain meanings and icons only.
Safe to rerun; run it LAST, after unit_start_here.py, unit_extras.py and build_units34.py:   python3 _build/unit_path.py
"""
import os, re, html
QUICK_CHECK = False   # Nov 19, 2026: Zach removed the Quick Checks from the unit pages ("lets remove them ... come back to the idea of a pre-diagnostic later"). True puts them back.
ROOT = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
G8 = os.path.join(ROOT, 'grade8')

PLAIN = [  # (label regex, plain meaning, icon, short name for the path row)
    (r'^Targeted Practice$', 'homework', 'homework', 'Targeted Practice'),
    (r'^EOG Practice$', 'practice for the end-of-year state test', 'eog', 'EOG Practice'),
    (r'^(Unit \d )?Pre-Tests?$', 'practice test to get ready for the unit test', 'pretest', 'Pre-Test'),
    (r'^Units 3–4 Review &amp; Pre-Test$', 'practice test for the Units 3–4 test', 'pretest', 'Units 3–4 Review'),
    (r'^Units 3–4 Pre-Test &amp; Tutorial$', 'practice test and step-by-step review for the Units 3–4 test', 'pretest', None),
    (r'^Tutorial$', 'step-by-step review', 'tutorial', 'Tutorial'),
    (r'^Interactive Review$', None, 'review', 'Review'),
    (r'^Notes$', None, 'notes', 'Notes'),
    (r'^Part 1 — Exponent Rules$', None, 'notes', 'Exponent Rules'),
    (r'^Part 2 — Scientific Notation$', None, 'notes', 'Scientific Notation'),
    (r'^Practice( \d)?$', None, 'practice', None),
    (r'^Printable Project$', None, 'project', 'Project'),
    (r'^Games &amp; Extras$', None, 'games', 'Games'),
]
ICON = {  # simple line icons (24×24, stroke = currentColor through a CSS mask)
 'check':    '<path d="M9 11l3 3 8-8"/><path d="M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9"/>',
 'notes':    '<path d="M4 4h9a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4z"/><path d="M20 4h-4M20 4v14h-4"/>',
 'practice': '<path d="M16 3l5 5L8 21H3v-5z"/><path d="M13 6l5 5"/>',
 'homework': '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/>',
 'eog':      '<path d="M5 21V4"/><path d="M5 4h12l-2 4 2 4H5"/>',
 'games':    '<rect x="2" y="7" width="20" height="11" rx="5"/><path d="M7 11v3M5.5 12.5h3"/><circle cx="16" cy="11.5" r="1"/><circle cx="18" cy="13.5" r="1"/>',
 'pretest':  '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V3h6v1"/><path d="M9 12l2 2 4-4"/>',
 'tutorial': '<circle cx="12" cy="12" r="9"/><path d="M10 8l6 4-6 4z"/>',
 'review':   '<path d="M20 11a8 8 0 1 0-2.3 5.7"/><path d="M20 4v7h-7"/>',
 'project':  '<path d="M3 17L17 3l4 4L7 21H3z"/><path d="M7 13l2 2M10 10l2 2M13 7l2 2"/>',
}
def svg_url(body):
    s = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" '
         'stroke-linecap="round" stroke-linejoin="round">' + body + '</svg>')
    return "url(\"data:image/svg+xml," + s.replace('"', "'").replace('#', '%23').replace('<', '%3C').replace('>', '%3E') + "\")"

CSS = ('<style id="unit-path-css">'
       '.section-label[data-ic]{display:flex;align-items:center;gap:8px}'
       '.section-label[data-ic]::before{content:"";flex:0 0 18px;width:18px;height:18px;background:currentColor;'
       '-webkit-mask:var(--ic) center/contain no-repeat;mask:var(--ic) center/contain no-repeat}'
       + ''.join(f'.section-label[data-ic="{k}"]{{--ic:{svg_url(v)}}}' for k, v in ICON.items()) +
       '.section-label .plain{font:500 13px Inter,sans-serif;color:inherit;opacity:.8;letter-spacing:0;text-transform:none}'
       '.unit-path{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin:10px 0 4px;font:500 14px Inter,sans-serif;color:inherit}'
       '.unit-path b{font:700 13px Inter,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:#C9D2E3;margin-right:4px}'
       '.unit-path a{display:inline-flex;align-items:center;gap:7px;text-decoration:none;color:#1E2D4F;background:#fff;border:1px solid #D5DAE3;'
       'border-radius:999px;padding:5px 12px 5px 5px;font:600 13.5px Inter,sans-serif}'
       '.unit-path a:hover,.unit-path a:focus-visible{border-color:#E0A800;background:#FFF6D6}'
       '.unit-path .n{display:inline-grid;place-items:center;width:22px;height:22px;border-radius:50%;background:#1E2D4F;color:#FFC107;font:700 12px Inter,sans-serif}'
       '.unit-path a.qc{border-color:#E0A800;background:#FFF6D6}'
       '@media print{.unit-path{display:none}}</style>')

def slug(t): return re.sub(r'[^a-z0-9]+', '-', html.unescape(t).lower()).strip('-')

def process(fn, unit):
    p = os.path.join(G8, fn); s = open(p, encoding='utf-8').read()
    # undo an earlier run
    s = re.sub(r'<!--unit-path-->.*?<!--/unit-path-->', '', s, flags=re.S)
    s = re.sub(r'<!--unit-screener-->.*?<!--/unit-screener-->\n?', '', s, flags=re.S)
    s = re.sub(r'<style id="unit-path-css">.*?</style>\n?', '', s, flags=re.S)
    s = re.sub(r' <span class="plain">\(.*?\)</span>', '', s)
    s = re.sub(r'(<div class="section-label"[^>]*?) data-ic="[^"]*"', r'\1', s)
    s = re.sub(r'(<div class="section-label"[^>]*?) data-pid="[^"]*"', r'\1', s)
    if unit and QUICK_CHECK:   # Quick Check section before the first section
        blk = ('<!--unit-screener--><div class="section-label" id="screener">Quick Check</div>'
               f'<a href="unit{unit}-screener.html" class="feature-card"><div class="fi">🔎</div><div><div class="ft">Unit {unit} Quick Check</div>'
               '<div class="fd">5 quick questions on skills you need for this unit. See what is ready and what to warm up on first.</div></div>'
               '<span class="kind">Start here</span></a><!--/unit-screener-->\n')
        i = s.index('<div class="section-label"'); s = s[:i] + blk + s[i:]
    used, path = set(re.findall(r'id="([^"]+)"', s)), []
    def lab(m):
        attrs, text = m.group(1), m.group(2).strip()
        ic, plain, short = 'practice', None, text
        if text == 'Quick Check': ic, short = 'check', 'Quick Check'
        else:
            for rx, pl, icon, sh in PLAIN:
                if re.match(rx, text): ic, plain, short = icon, pl, (sh or text); break
        idm = re.search(r'id="([^"]+)"', attrs)
        if idm: sid = idm.group(1)
        else:
            sid = base = slug(text) or 'part'; k = 2
            while sid in used: sid = f'{base}-{k}'; k += 1
            used.add(sid); attrs += f' id="{sid}"'
        nm = html.unescape(short).replace('&', '&amp;')
        if not path or path[-1][1] != nm: path.append((sid, nm))   # two sections in a row with one name = one stop
        out = f'<div class="section-label"{attrs} data-ic="{ic}">{text}'
        if plain: out += f' <span class="plain">({plain})</span>'
        return out + '</div>'
    s = re.sub(r'<div class="section-label"([^>]*)>(.*?)</div>', lab, s)
    if unit:
        row = '<nav class="unit-path" aria-label="In this unit"><b>In this unit:</b>' + ''.join(
            f'<a href="#{sid}"{" class=qc" if sid == "screener" else ""}><span class="n">{i + 1}</span>{t}</a>' for i, (sid, t) in enumerate(path)) + '</nav>'
        anchor = '<!--/unit-extras-->' if '<!--/unit-extras-->' in s else '<!--/unit-goals-->'
        assert anchor in s, fn
        s = s.replace(anchor, anchor + '<!--unit-path-->' + row + '<!--/unit-path-->', 1)
    s = s.replace('</head>', CSS + '\n</head>', 1)
    open(p, 'w', encoding='utf-8').write(s)
    return [t for _, t in path]

for n in range(1, 10): print(n, process(f'unit{n}.html', n))
print('3-4', process('units3-4.html', None))
