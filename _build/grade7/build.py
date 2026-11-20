"""Build the 7th grade site (grade7/) from the unit files u1.py … u9.py.
   python3 _build/grade7/build.py            → notes, practice and unit pages for every unit file found,
                                               the 7th grade home, Skill Builders shells, vocabulary page.
   Pages reuse the 8th grade engines (notes-practice.js, notes-flow.js, practice-engine.js, sb.js …) by relative path."""
import html, importlib, json, os, re, sys
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
from lib import np_q, pr_prob, plain, F, num
ROOT = os.path.abspath(os.path.join(HERE, '..', '..')); OUT = os.path.join(ROOT, 'grade7')
V = '20261120a'                       # bump after changing a grade7 page script/style
FONTS = '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Source+Serif+4:opsz,wght@8..60,600&family=JetBrains+Mono:wght@500;600&display=swap" rel="stylesheet">'

def units():
    out = []
    for n in range(1, 10):
        if os.path.exists(os.path.join(HERE, 'u%d.py' % n)):
            out.append(importlib.import_module('u%d' % n))
    return out

def blanks(s):
    return re.sub(r'\{\{(.*?)\}\}', lambda g: '<span class="blank" tabindex="0" role="button" aria-label="tap to show the answer" data-ans="%s" onclick="rb(this)">?</span>' % html.escape(g.group(1), quote=True), s)

def write(name, text):
    with open(os.path.join(OUT, name), 'w') as f: f.write(text)

def head(title, css, extra=''):
    return ('<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n<title>%s</title>\n%s\n%s%s'
            '<script src="../brand.js"></script>\n<link rel="stylesheet" href="g7.css?v=%s">\n</head>\n') % (html.escape(title), FONTS, css, extra, V)

# ------------------------------------------------------------------ notes
def notes_page(mod):
    U, T, P2 = mod.UNIT, mod.T, mod.PART2; n = U['n']
    std_all = ' · '.join(s[0] for s in U['stds'])
    h = [head('Unit %d Guided Notes — %s | Mr. Allen\'s 7th Grade Math' % (n, U['title']), '<link rel="stylesheet" href="g7-notes.css?v=%s">\n' % V)]
    h.append('<body>\n<script src="../site-bar.js"></script>\n<div class="page-wrap">\n<a href="unit%d.html" class="back-link">← Back to Unit %d</a>\n' % (n, n))
    h.append('<div class="page-hdr">\n  <h1>Unit %d Guided Notes — %s</h1>\n  <p>%s</p>\n' % (n, U['title'], U['tag']))
    h.append('<style id="ican-hide">@media screen{body:not(.paper) .ican-box,body:not(.paper) .ican-box + p.stds{display:none!important}}</style>')
    h.append('<div class="ican-box"><b>By the end of this unit, I can…</b><ul>%s</ul></div><p class="stds">Standards: %s</p>\n</div>\n' % (''.join('<li>%s</li>' % x for x in U['ican']), std_all))
    h.append('<div class="topic-nav">%s<a href="#practice">✏ Part 2 Practice</a></div>\n' % ''.join('<a href="#t%d">%d. %s</a>' % (i + 1, i + 1, t['nav']) for i, t in enumerate(T)))
    h.append('<div class="intro"><p><strong>Part 1 — Guided Notes:</strong> fill in the blanks as you learn (tap a <span class="blank revealed" style="cursor:default">?</span> to check it). '
             'Tap each step of an example to see it. Each section ends with a <strong>✏ Practice</strong> box: one Score 3, one Score 4 and one Score 5 question. '
             '<strong>Part 2 — Comprehensive Practice</strong> at the end mixes all %d sections.</p></div>\n' % len(T))
    for i, t in enumerate(T):
        sid = 't%d' % (i + 1)
        h.append('<section class="topic" id="%s">\n<h2><span class="num">%d</span> %s <small class="std">%s</small></h2>\n' % (sid, i + 1, t['title'], t['std']))
        if t.get('words'):
            h.append('<div class="key words"><strong>📖 Words to know</strong>%s</div>\n' % ''.join('<div><b>%s</b>: %s</div>' % w for w in t['words']))
        h.append('<div class="key"><strong>📌 THE BIG IDEA:</strong> %s</div>\n' % t['big'])
        if t.get('fig'):
            h.append('<div class="fig">%s</div>%s\n' % (t['fig'], '<div class="fig-cap">%s</div>' % t['figcap'] if t.get('figcap') else ''))
        if t.get('table'):
            hd, rows = t['table']
            h.append('<table class="rules-table"><tr>%s</tr>%s</table>\n' % (''.join('<th>%s</th>' % x for x in hd), ''.join('<tr>%s</tr>' % ''.join('<td>%s</td>' % blanks(c) for c in r) for r in rows)))
        if t.get('fill'):
            h.append('<div class="fill">%s</div>\n' % ''.join('<p>%s</p>' % blanks(s) for s in t['fill']))
        if t.get('fill') or t.get('table'):
            h.append('<button class="reveal-all" type="button" onclick="rbAll(\'%s\')">Show all the blanks</button>\n' % sid)
        for k, ex in enumerate(t.get('examples', [])):
            eid = '%se%d' % (sid, k + 1)
            h.append('<h3 class="sub">%s</h3>\n' % ex['title'])
            if ex.get('vw'):
                h.append('<div class="vw" data-vw=\'%s\'></div>\n' % json.dumps({'eq': ex['vw']}, ensure_ascii=False))
            else:
                h.append('<div class="example" data-example="%s">%s%s<button class="reveal-all" type="button" onclick="revealAll(\'%s\')">Show all steps</button></div>\n' % (
                    eid, ('<div class="fig">%s</div>' % ex['fig']) if ex.get('fig') else '',
                    ''.join('<div class="step" tabindex="0" role="button" onclick="reveal(this)"><span class="n">%d</span><span class="st">%s</span></div>' % (j + 1, s) for j, s in enumerate(ex['steps'])), eid))
        if t.get('warn'):
            h.append('<div class="warn"><strong>⚠ Watch out:</strong> %s</div>\n' % t['warn'])
        h.append('<div class="np" data-title="%s" data-std="%s">\n%s\n</div>\n</section>\n\n' % (html.escape(t['title']), t['std'], '\n'.join(np_q(q, 'u%dn%d-%d' % (n, i + 1, k + 1)) for k, q in enumerate(t['np']))))
    h.append('<section class="topic" id="practice">\n<h2><span class="num">✏</span> Part 2 — Comprehensive Practice</h2>\n')
    h.append('<div class="key"><strong>📌 Show your work on paper.</strong> Then check on screen. Type just the number (for −4, type -4), or tap your answer.</div>\n')
    for j, (title, std, qs) in enumerate(P2):
        h.append('<h3 class="sub">%s</h3>\n<div class="np final" data-score="1" data-title="%s" data-std="%s">\n%s\n</div>\n' % (title, html.escape(title), std, '\n'.join(np_q(q, 'u%dp%s%d' % (n, 'ABCDEFG'[j], k + 1)) for k, q in enumerate(qs))))
    h.append('<div id="ss-mount"></div>\n</section>\n')
    h.append('<p style="text-align:center"><a class="back-link" href="unit%d-practice.html">✏️ Next: Unit %d Practice →</a></p>\n</div>\n' % (n, n))
    h.append('<div class="site-footer">© Mr. Allen\'s Math Class · 7th Grade Math</div>\n')
    h.append('<script src="g7-notes.js?v=%s"></script>\n<script src="../vwork.js?v=20261112a"></script>\n<script src="../grade8/tap-answers.js?v=20261112b"></script>\n'
             '<script src="../notes-practice.js?v=%s"></script>\n<script src="../paper.js?v=20261112a"></script>\n<script src="../tracker-config.js"></script>\n<script src="../score-send.js?v=20261117a"></script>\n' % (V, V))
    h.append("<script>if(window.ScoreSend) ScoreSend.setup({ kind:'practice', unit:'7-%d', page:'Grade 7 · Unit %d · Guided Notes practice', mount:'#ss-mount', std:'%s', band:3 });</script>\n" % (n, n, U['stds'][0][0]))
    h.append('<script src="../notes-flow.js?v=20261112a"></script>\n<script src="../grade8/step-work.js?v=20261113e"></script><script src="../notes-steps.js?v=20261112a"></script>\n</body>\n</html>\n')
    write('unit%d-notes.html' % n, ''.join(h))
    return sum(len(t['np']) for t in T) + sum(len(x[2]) for x in P2)

# ------------------------------------------------------------------ practice
def practice_page(mod):
    U, P = mod.UNIT, mod.PRACTICE; n = U['n']
    data = {'title': P['title'], 'sub': P['sub'], 'secs': []}
    for si, (title, std, hint, qs) in enumerate(P['secs']):
        data['secs'].append({'title': title, 'std': std, 'hint': hint, 'probs': [pr_prob(q, k + 1, 'g7u%ds%dp%d' % (n, si, k + 1)) for k, q in enumerate(qs)]})
    page = {'unit': '7-%d' % n, 'data': data}
    h = [head('Unit %d · Practice — Interactive | 7th Grade Math' % n, '<link rel="stylesheet" href="../site.css">\n<link rel="stylesheet" href="../grade8/practice/practice.css">\n',
              '<style>.pr-figwrap{margin:8px 0;text-align:center}.pr-figwrap svg{max-width:100%;height:auto}.fr{display:inline-flex;flex-direction:column;vertical-align:middle;text-align:center;font-size:.9em;line-height:1.1;margin:0 2px}.fr>span:first-child{border-bottom:1.5px solid currentColor;padding:0 2px}.m{font-family:"JetBrains Mono",monospace}table.data{border-collapse:collapse;margin:8px auto}table.data th,table.data td{border:1.5px solid #DCCAA9;padding:5px 12px;text-align:center}table.data th{background:#F6E7C8}</style>\n')]
    h.append('<body>\n<script src="../site-bar.js"></script>\n<div class="page-wrap">\n<a href="unit%d.html" class="back-link">← Back to Unit %d</a>\n<div id="practice"></div>\n</div>\n' % (n, n))
    h.append('<div class="site-footer">© Mr. Allen\'s Math Class · 7th Grade Math</div>\n')
    h.append('<script>window.PRACTICE = %s;</script>\n' % json.dumps(page, ensure_ascii=False))
    h.append('<script src="../grade8/tap-answers.js?v=20261112b"></script>\n<script src="../grade8/practice/practice-engine.js?v=%s"></script>\n<script src="../tracker-config.js"></script>\n<script src="../score-send.js?v=20261117a"></script>\n' % V)
    h.append("<script> ScoreSend.setup({ kind:'practice', unit:'7-%d', page:'Grade 7 · Unit %d · Practice', mount:'#ss-mount', std:'%s', band:3 }); </script>\n</body>\n</html>\n" % (n, n, U['stds'][0][0]))
    write('unit%d-practice.html' % n, ''.join(h))
    return sum(len(s['probs']) for s in data['secs'])

# ------------------------------------------------------------------ unit page
CANYON = ('<svg viewBox="0 0 1200 300" preserveAspectRatio="none" aria-hidden="true"><path d="M0 300 V190 L120 150 L210 175 L330 110 L430 150 L520 95 L640 160 L760 120 L860 170 L980 105 L1090 150 L1200 120 V300Z" fill="#5A3520"/>'
          '<path d="M0 300 V240 L150 205 L280 230 L420 190 L560 228 L700 196 L850 235 L1000 200 L1200 230 V300Z" fill="#3A2010"/>'
          '<path d="M0 300 V275 L200 258 L420 272 L640 252 L880 270 L1200 255 V300Z" fill="#2C190D"/></svg>')

def unit_page(mod, all_units, games):
    U = mod.UNIT; n = U['n']
    nav = ' '.join('<a class="nb%s" href="unit%d.html">U%d</a>' % (' active' if m.UNIT['n'] == n else '', m.UNIT['n'], m.UNIT['n']) for m in all_units)
    goals = ('<section class="unit-goals" aria-labelledby="ug-h"><h2 id="ug-h">What you will learn in Unit %d</h2><div class="ug-cols"><div><h3>Learning targets</h3><ul class="ug-t">%s</ul></div>'
             '<div><h3>Standards</h3><ul class="ug-s">%s</ul></div></div></section>') % (n, ''.join('<li>%s</li>' % x for x in U['ican']), ''.join('<li><b>%s</b><span>%s</span></li>' % (s[0].replace('NC.', ''), s[1]) for s in U['stds']))
    g = [x for x in games if n in x['units']]
    extras = '<div class="unit-extras" aria-label="Also for Unit %d"><b>Also for Unit %d:</b>%s<a href="skill-builders-unit%d.html">🧩 Skill Builders lessons</a><a href="skill-builders-unit%d-practice.html">✏️ Skill Builders practice</a><a href="vocabulary.html#u%d">🔤 Vocabulary</a></div>' % (
        n, n, ''.join('<a class="g" href="%s">%s %s</a>' % (x['href'], x['icon'], x['name']) for x in g), n, n, n)
    path = '<nav class="unit-path" aria-label="In this unit"><b>In this unit:</b><a href="#notes"><span class="n">1</span>Notes</a><a href="#practice"><span class="n">2</span>Practice</a><a href="#skill-builders"><span class="n">3</span>Skill Builders</a>%s</nav>' % (
        '<a href="#games"><span class="n">4</span>Games</a>' if g else '')
    h = [head('Unit %d — %s | Mr. Allen\'s 7th Grade Math' % (n, U['title']), '<link rel="stylesheet" href="../site.css">\n')]
    h.append('<body class="g7-unit">\n<div class="g7-bg" aria-hidden="true">%s</div>\n<script src="../site-bar.js"></script>\n\n<div class="page-wrap">\n<a href="index.html" class="back-link">← Back to 7th Grade Math</a>\n' % CANYON)
    h.append('<div class="page-hdr">\n  <h1>Unit %d — %s</h1>\n  <p>%s</p>\n  <p class="stds">Standards: %s</p>\n</div>\n' % (n, U['title'], U['desc'], ' · '.join(s[0] for s in U['stds'])))
    h.append('<div class="topic-nav">%s</div>\n%s%s%s\n' % (nav, goals, extras, path))
    h.append('<div class="section-label" id="notes">Notes</div>\n<a href="unit%d-notes.html" class="feature-card"><div class="fi">📔</div><div><div class="ft">Interactive Guided Notes</div><div class="fd">%d short sections with examples, then ✏ Practice in each section and Part 2 practice at the end.</div></div><span class="kind">Interactive</span></a>\n' % (n, len(mod.T)))
    h.append('<div class="section-label" id="practice">Practice</div>\n<a href="unit%d-practice.html" class="feature-card"><div class="fi">🖊️</div><div><div class="ft">Unit %d Practice — Interactive</div><div class="fd">Check each answer as you go, with hints. Send your work to Mr. Allen.</div></div><span class="kind">Interactive</span></a>\n' % (n, n))
    h.append('<div class="section-label" id="skill-builders">Skill Builders <span class="plain">(short lessons and videos)</span></div>\n'
             '<a href="skill-builders-unit%d.html" class="feature-card"><div class="fi">🧩</div><div><div class="ft">Skill Builders · Unit %d Mini-Lessons</div><div class="fd">Watch a short video with Digit, then walk through an example one step at a time.</div></div><span class="kind">Video</span></a>\n'
             '<a href="skill-builders-unit%d-practice.html" class="feature-card"><div class="fi">✏️</div><div><div class="ft">Skill Builders · Unit %d Practice Set</div><div class="fd">One problem at a time, with help when you are stuck.</div></div><span class="kind">Interactive</span></a>\n' % (n, n, n, n))
    if g:
        h.append('<div class="section-label" id="games">Games</div>\n' + ''.join('<a href="%s" class="feature-card"><div class="fi">%s</div><div><div class="ft">%s</div><div class="fd">%s</div></div><span class="kind">Game</span></a>\n' % (x['href'], x['icon'], x['name'], x['desc']) for x in g))
    h.append('</div>\n<div class="site-footer">© Mr. Allen\'s Math Class · 7th Grade Math</div>\n<script src="../grade8/unit-next.js?v=20261113a"></script>\n</body>\n</html>\n')
    write('unit%d.html' % n, ''.join(h))

if __name__ == '__main__':
    from site_pages import GAMES, home_page, vocab_page, sb_pages, arcade_page, formulas_page
    US = units()
    for mod in US:
        a = notes_page(mod); b = practice_page(mod); unit_page(mod, US, GAMES)
        print('unit %d: %d notes questions, %d practice problems' % (mod.UNIT['n'], a, b))
    home_page(US); vocab_page(US); sb_pages(US); arcade_page(); formulas_page()
