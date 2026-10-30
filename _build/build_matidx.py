# -*- coding: utf-8 -*-
"""Rebuild grade8/materials_index.html from the live unit pages, in the site.css hub look.
The unit pages are the source of truth, so the index can never point at a renamed or retired file."""
import io, re, os, html
G = '/home/claude/mr-allen-s-math-class/grade8/'

UNITS = [(1,'Real Numbers'),(2,'Exponents &amp; Scientific Notation'),
         (3,'Linear Equations'),(4,'Angles &amp; Geometry'),
         (5,'Pythagorean Theorem'),(6,'Functions, Slope &amp; Systems'),
         (7,'Data Analysis &amp; Statistics'),(8,'Transformations'),(9,'Volume')]
# (key, filter-button label, row label) -- plain words, no emoji (site style)
TYPES = [('pretest','Pre-Tests','Pre-Test'),('notes','Notes','Notes'),
         ('practice1','Practice 1','Practice 1'),('practice2','Practice 2','Practice 2'),
         ('games','Games &amp; Extras','Games &amp; Extras'),('project','Projects','Project'),
         ('key','Answer Keys','Answer Key'),('review','Year Review','Year Review')]
TLAB = {k: lab for k, _, lab in TYPES}

def sect_type(label):
    l = label.lower()
    if 'pre-test' in l or 'pretest' in l: return 'pretest'
    if 'note' in l: return 'notes'
    if 'practice 1' in l or 'classwork' in l: return 'practice1'
    if 'practice 2' in l or 'homework' in l: return 'practice2'
    if 'practice' in l: return 'practice1'
    if 'project' in l: return 'project'
    return 'games'

def card(href, title, typ):
    pdf = href.lower().endswith('.pdf')
    tgt = ' target="_blank"' if pdf else ''
    kind = 'PDF' if pdf else 'Interactive'
    return ('<a href="%s"%s class="feature-card" data-type="%s"><div><div class="mtype%s">%s</div>'
            '<div class="ft">%s</div></div><span class="kind">%s</span></a>'
            % (href.replace(' ', '%20'), tgt, typ, ' key' if typ == 'key' else '', TLAB[typ], title, kind))

def items_from(page):
    h = io.open(G + page, encoding='utf-8').read()
    out, cur, part = [], 'games', ''
    for m in re.finditer(r'<div class="section-label"[^>]*>(.*?)</div>|<a href="([^"]+)" class="feature-card"[^>]*>(.*?)</a>', h, re.S):
        if m.group(1) is not None:
            lab = html.unescape(re.sub('<[^>]+>', '', m.group(1)))
            cur = sect_type(lab)
            pm = re.search(r'Part \d+\s*[—-]\s*(.+)$', lab)
            part = pm.group(1).strip() + ' · ' if pm else ''
            continue
        href, inner = m.group(2), m.group(3)
        if href.startswith(('http', '#', '../', 'index.html', 'unit')) and not re.match(r'unit\d_', href): continue
        if not os.path.exists(G + href.split('#')[0]): continue
        ft = re.search(r'class="ft">(.*?)</div>', inner, re.S)
        title = re.sub(r'\s+', ' ', re.sub('<[^>]+>', '', ft.group(1) if ft else inner)).strip()
        typ = cur
        if re.search(r'\bnotes\b', title, re.I) and typ in ('games', 'practice1', 'practice2'): typ = 'notes'
        if re.search(r'practice 1', title, re.I): typ = 'practice1'
        if re.search(r'practice 2', title, re.I): typ = 'practice2'
        title = part + title
        if re.search(r'answer ?key|AnswerKey|_Key\b', title + ' ' + href, re.I): typ = 'key'
        elif re.search('project|handout', (title + href).lower()): typ = 'project'
        out.append((href, title, typ))
    return out

def section(sid, name, cards):
    n = len(cards)
    return ('<div class="section-label" id="%s">%s <span class="count" data-total="%d">%d item%s</span></div>\n'
            '<div class="mat-list">\n%s\n</div>' % (sid, name, n, n, '' if n == 1 else 's', '\n'.join(cards)))

body = []
seen = set()
for n, name in UNITS:
    its = [i for i in items_from('unit%d.html' % n) if i[0] not in seen]
    seen.update(i[0] for i in its)
    # the section heading names the unit, so the row title drops the "Unit N ·" prefix
    body.append(section('u%d' % n, 'Unit %d · %s' % (n, name), [card(h_, t, ty) for h_, t, ty in its]))

# General: the whole-year resources linked from the 8th-grade home page
gh = io.open(G + 'index.html', encoding='utf-8').read()
gen = []
for m in re.finditer(r'<a href="([^"]+)" class="unit-card"[^>]*>(.*?)</a>', gh, re.S):
    href = m.group(1)
    if re.match(r'unit\d\.html$', href) or href == 'materials_index.html' or href in seen or href.startswith(('http', '../')): continue
    if not os.path.exists(G + href.split('#')[0]): continue
    t = re.search(r'unit-card-title">(.*?)</div>', m.group(2), re.S)
    title = re.sub(r'\s+', ' ', re.sub('<[^>]+>', '', t.group(1))).strip() if t else href
    gen.append(card(href, title, 'review'))
    seen.add(href)
if 'Released Questions 2.pdf' not in seen:
    gen.append(card('Released Questions 2.pdf', 'Released EOG Questions (Form R, PDF)', 'review'))
body.append(section('general', 'General Resources', gen))

btns = '\n'.join(['<button type="button" class="fbtn active" aria-pressed="true" onclick="filterType(\'all\',this)">All</button>'] + [
    '<button type="button" class="fbtn" aria-pressed="false" onclick="filterType(\'%s\',this)">%s</button>' % (k, lab) for k, lab, _ in TYPES])
jump = ' '.join('<a href="#u%d">U%d</a>' % (n, n) for n, _ in UNITS) + ' <a href="#general">General</a>'

PAGE = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Materials Index — Mr. Allen's 8th Grade Math</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Source+Serif+4:opsz,wght@8..60,600&family=JetBrains+Mono:wght@500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../site.css">
<!-- GENERATED by build_matidx.py from the grade8/unitN.html pages. Edit the generator, not this file. -->
<style>
.mat-tools{display:flex;flex-direction:column;gap:14px;margin:0 0 8px}
.filter-row{display:flex;gap:8px;flex-wrap:wrap}
.fbtn{font:500 13px/1 var(--sans);padding:9px 13px;border:1px solid var(--line);border-radius:999px;background:var(--card);color:var(--muted);cursor:pointer;transition:border-color .12s,color .12s}
.fbtn:hover:not(.active){border-color:var(--line-2);color:var(--navy)}
.fbtn.active{background:var(--navy);border-color:var(--navy);color:#fff}
.mat-jump{margin:0}
.mat-list{background:var(--card);border:1px solid var(--line);border-radius:var(--radius);overflow:hidden}
.mat-list .feature-card{border:0;border-radius:0;margin:0;background:none}
.mat-list .feature-card:not([data-hidden="1"]) ~ .feature-card{border-top:1px solid var(--line)}
.mat-list .feature-card:hover{background:#FAFAF7}
.mat-list .feature-card>div{display:flex;align-items:baseline;gap:16px}
.mtype{flex:none;width:118px;font:500 12px/1.3 var(--mono);color:var(--faint);letter-spacing:.03em;text-transform:uppercase}
.mtype.key{color:var(--ok)}
.feature-card[data-hidden="1"],.section-label[data-hidden="1"],.mat-list[data-hidden="1"]{display:none}
.section-label .count{margin-left:auto;font:500 12px/1 var(--mono);color:var(--faint)}
.mat-empty{color:var(--muted);margin:24px 0}
@media (max-width:640px){
  .mat-list .feature-card>div{display:block}
  .mtype{width:auto;margin:0 0 3px;font-size:11px}
  .mat-jump{display:grid;grid-auto-flow:row;grid-template-columns:repeat(5,1fr)}
  .mat-jump a:nth-child(5){border-right:0}
  .mat-jump a:nth-child(n+6){border-top:1px solid var(--line)}
}
</style>
</head>
<body>
<script src="../site-bar.js"></script>

<div class="page-wrap">
<a href="index.html" class="back-link">← Back to 8th Grade Home</a>
<div class="page-hdr">
  <h1>Materials Index</h1>
  <p>Every note, worksheet, project, and answer key, organized by unit.</p>
  <p class="stds">Pre-Tests · Notes · Practice · Games · Projects · Answer Keys</p>
</div>
<div class="intro"><p><strong>Tip:</strong> Use the buttons to show one kind of material, like only Notes or only Practice. Use the unit links to jump to a unit. <em>Interactive</em> items open a page you can work through. <em>PDF</em> items open a printable document.</p></div>

<div class="mat-tools">
<div class="filter-row" role="group" aria-label="Show only">
%(btns)s
</div>
<nav class="topic-nav mat-jump" aria-label="Jump to a unit">%(jump)s</nav>
</div>

%(body)s
<p class="mat-empty" id="mat-empty" hidden>Nothing of this kind yet.</p>
</div>
<div class="site-footer">© 2026–27 · Mr. Allen's Math Class</div>
<script>
function filterType(t, btn){
  document.querySelectorAll('.fbtn').forEach(function(b){ b.classList.remove('active'); b.setAttribute('aria-pressed','false'); });
  btn.classList.add('active'); btn.setAttribute('aria-pressed','true');
  var shown = 0;
  document.querySelectorAll('.mat-list').forEach(function(list){
    var n = 0;
    list.querySelectorAll('.feature-card').forEach(function(c){
      var on = (t === 'all' || c.getAttribute('data-type') === t);
      c.setAttribute('data-hidden', on ? '0' : '1');
      if (on) n++;
    });
    shown += n;
    // hide a section with nothing to show; otherwise its count matches what is shown
    list.setAttribute('data-hidden', n ? '0' : '1');
    var label = list.previousElementSibling;
    if (label && label.classList.contains('section-label')) {
      label.setAttribute('data-hidden', n ? '0' : '1');
      var cnt = label.querySelector('.count');
      if (cnt) {
        var total = +cnt.getAttribute('data-total');
        cnt.textContent = (t === 'all' || n === total) ? total + (total === 1 ? ' item' : ' items') : n + ' of ' + total;
      }
    }
  });
  document.getElementById('mat-empty').hidden = shown > 0;
}
</script>
</body>
</html>
"""
out = PAGE % {'btns': btns, 'jump': jump, 'body': '\n\n'.join(body)}
io.open(G + 'materials_index.html', 'w', encoding='utf-8').write(out)
total = sum(len(re.findall('class="feature-card"', x)) for x in body)
print('materials_index.html rebuilt:', total, 'items')
