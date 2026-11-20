"""7th grade hub pages: home (four doors), Skill Builders hub + shells, vocabulary, arcade."""
import html, json, os
from build import write, head, FONTS, V, OUT

G8 = '../grade8/'
# Games on the 7th grade site. Fluency games carry over from 8th grade (same files); the rest are new 7th grade games.
GAMES = [
    dict(name='Integer Knockout', href=G8 + 'integer-knockout.html', icon='🥊', units=[1], tag='Integer fluency', carry=1,
         desc='Arcade boxing. Every punch is an answer: add, subtract, multiply and divide integers from −20 to 20.'),
    dict(name='Nitro Numbers', href=G8 + 'nitro-numbers.html', icon='🏎️', units=[1], tag='Facts fluency', carry=1,
         desc='Hover racer. Steer through the gate with the right answer: times tables and the Integer Expressway track.'),
    dict(name='Tiles for Miles', href=G8 + 'zero-pair-run.html', icon='🧊', units=[1, 3], tag='Integers + zero pairs', carry=1,
         desc='Use zero pairs to add and subtract integers with tiles, then use them to solve equations.'),
    dict(name='Squeaky Cheeks', href=G8 + 'squeaky-cheeks.html', icon='💨', units=[1], tag='Integer & fraction fluency', carry=1,
         desc='Answer integer and fraction problems to build up gas, then clear the room. Five rooms.'),
    dict(name='Neon Integer Assault', href=G8 + 'neon-integer-assault.html', icon='👾', units=[1, 3], tag='Integers + equations', carry=1,
         desc='Blast invaders and a centipede. Every target carries a number: hit the one that solves the equation.'),
    dict(name='Equation Master', href=G8 + 'equation_master.html', icon='⚔️', units=[3], tag='Equations', carry=1,
         desc='Solve equations one move at a time. Start with the Apprentice and Journeyman levels (one- and two-step).'),
    dict(name='Market Day', href='market-day.html', icon='🧺', units=[4, 5], tag='NEW · Units 4–5',
         desc='Run a farmers market stall. Find unit rates, pick the better buy, and work out sales, tax and tips.'),
    dict(name='Canyon Surveyor', href='canyon-surveyor.html', icon='🧭', units=[6, 7], tag='NEW · Units 6–7',
         desc='Map a canyon trail. Use scale drawings, angle pairs and circles to find the missing measures.'),
    dict(name='Lantern Festival', href='lantern-festival.html', icon='🏮', units=[8, 9], tag='NEW · Units 8–9',
         desc='Light the lanterns. Find probabilities, run spinner and dice experiments, and read data from samples.'),
]
FLUENCY_LAB = G8 + 'Fluency-Lab-Package/fluency-lab/index.html'

DOOR_ART = {
 'learn': '<svg viewBox="0 0 160 110" aria-hidden="true"><ellipse cx="80" cy="100" rx="58" ry="6" fill="#3E2414" opacity=".12"/><path d="M80 30 C62 20 38 20 20 26 V92 C38 86 62 86 80 96 Z" fill="#fff" stroke="#3E2414" stroke-width="3" stroke-linejoin="round"/><path d="M80 30 C98 20 122 20 140 26 V92 C122 86 98 86 80 96 Z" fill="#FCEBC8" stroke="#3E2414" stroke-width="3" stroke-linejoin="round"/><path d="M80 30 V96" stroke="#3E2414" stroke-width="3"/><path d="M32 42 H66 M32 54 H62 M32 66 H66 M32 78 H56" stroke="#B9A48C" stroke-width="3" stroke-linecap="round"/><text x="110" y="62" text-anchor="middle" font-family="JetBrains Mono,monospace" font-weight="700" font-size="19" fill="#3E2414">−¾</text><path d="M94 74 H126" stroke="#D98E1C" stroke-width="3" stroke-linecap="round"/><circle cx="132" cy="14" r="9" fill="#F2B13C" stroke="#3E2414" stroke-width="2.5"/></svg>',
 'practice-review': '<svg viewBox="0 0 160 110" aria-hidden="true"><ellipse cx="80" cy="100" rx="58" ry="6" fill="#3E2414" opacity=".12"/><circle cx="72" cy="54" r="40" fill="#fff" stroke="#3E2414" stroke-width="3"/><circle cx="72" cy="54" r="27" fill="#FCEBC8" stroke="#3E2414" stroke-width="3"/><circle cx="72" cy="54" r="14" fill="#fff" stroke="#3E2414" stroke-width="3"/><circle cx="72" cy="54" r="5" fill="#C8642A" stroke="#3E2414" stroke-width="2.5"/><path d="M76 50 L132 14" stroke="#3E2414" stroke-width="4" stroke-linecap="round"/><path d="M124 10 L138 8 L134 22 Z" fill="#F2B13C" stroke="#3E2414" stroke-width="2.5" stroke-linejoin="round"/><path d="M122 58 l6 6 12-14" fill="none" stroke="#5E7A1F" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
 'my-progress': '<svg viewBox="0 0 160 110" aria-hidden="true"><ellipse cx="80" cy="100" rx="58" ry="6" fill="#3E2414" opacity=".12"/><path d="M22 94 H140" stroke="#3E2414" stroke-width="3" stroke-linecap="round"/><rect x="30" y="66" width="18" height="28" rx="3" fill="#fff" stroke="#3E2414" stroke-width="3"/><rect x="56" y="54" width="18" height="40" rx="3" fill="#fff" stroke="#3E2414" stroke-width="3"/><rect x="82" y="40" width="18" height="54" rx="3" fill="#FCEBC8" stroke="#3E2414" stroke-width="3"/><rect x="108" y="26" width="18" height="68" rx="3" fill="#F2B13C" stroke="#3E2414" stroke-width="3"/><path d="M36 50 L64 38 L90 26 L114 12" fill="none" stroke="#C8642A" stroke-width="3" stroke-dasharray="5 5" stroke-linecap="round"/></svg>',
 'take-a-break': '<svg viewBox="0 0 160 110" aria-hidden="true"><ellipse cx="80" cy="100" rx="58" ry="6" fill="#3E2414" opacity=".12"/><path d="M26 58 C26 42 38 38 52 38 H108 C122 38 134 42 134 58 L140 80 C142 92 128 98 118 88 L108 76 H52 L42 88 C32 98 18 92 20 80 Z" fill="#fff" stroke="#3E2414" stroke-width="3" stroke-linejoin="round"/><path d="M50 50 V66 M42 58 H58" stroke="#3E2414" stroke-width="4" stroke-linecap="round"/><circle cx="106" cy="52" r="5" fill="#F2B13C" stroke="#3E2414" stroke-width="2.5"/><circle cx="118" cy="62" r="5" fill="#C8642A" stroke="#3E2414" stroke-width="2.5"/><path d="M126 20 q8 -4 8 6 M132 10 q12 -2 10 14" fill="none" stroke="#D98E1C" stroke-width="3" stroke-linecap="round"/></svg>',
}

def card(href, icon, title, desc, kind='', num='', std='', extra=''):
    return '<a href="%s" class="unit-card"%s>%s<div class="unit-icon">%s</div><div class="unit-card-title">%s</div><div class="unit-desc">%s</div>%s</a>\n' % (
        href, extra, '<div class="unit-num">%s</div>' % num if num else '', icon, title, desc, '<div class="unit-std">%s</div>' % std if std else '')

def fcard(href, icon, title, desc, kind='', extra=''):
    return '<a href="%s" class="feature-card"%s><div class="fi">%s</div><div><div class="ft">%s</div><div class="fd">%s</div></div>%s</a>\n' % (href, extra, icon, title, desc, '<span class="kind">%s</span>' % kind if kind else '')

HOME_CSS = '''<style>
.tu-bar{display:flex;align-items:center;gap:14px;background:#3E2414;color:#fff;text-decoration:none;border-radius:14px;padding:14px 20px;margin:0 0 16px;box-shadow:0 4px 0 rgba(44,25,13,.3)}
.tu-bar:hover,.tu-bar:focus-visible{background:#5A3520}
.tu-k{font:700 13px Inter,sans-serif;letter-spacing:.1em;text-transform:uppercase;color:#F2B13C}
.tu-t{flex:1;font:600 22px/1.2 "Source Serif 4",Georgia,serif;color:#fff}
.tu-go{font:700 15px Inter,sans-serif;background:#F2B13C;color:#3E2414;border-radius:10px;padding:8px 16px}
.doors{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px;margin:0 0 18px}
.door{display:flex;flex-direction:column;gap:6px;text-decoration:none;color:#3E2414;background:#fff;border:2px solid #E2D2B6;border-radius:18px;padding:14px 16px 16px;box-shadow:0 4px 0 rgba(62,36,20,.12);transition:transform .12s,box-shadow .12s,border-color .12s}
.door:hover,.door:focus-visible{transform:translateY(-2px);border-color:#D98E1C;box-shadow:0 7px 0 rgba(62,36,20,.14)}
.door[aria-expanded="true"]{border-color:#3E2414;background:#FFF8EB;box-shadow:0 0 0 3px #F2B13C}
.door-art{display:block;background:#F8EFE0;border-radius:12px;padding:8px 6px 2px}.door-art svg{display:block;width:100%;height:auto;max-height:110px}
.d-practice .door-art{background:#FCEBC8}.d-progress .door-art{background:#EEF3DF}.d-break .door-art{background:#FBE3D3}
.door-t{font:600 22px/1.2 "Source Serif 4",Georgia,serif;margin-top:4px}
.door-d{font:500 14.5px/1.4 Inter,sans-serif;color:#5A4636}
.door-go{margin-top:auto;padding-top:4px;font:700 14px Inter,sans-serif;color:#A4471A}
.pn-art{display:inline-block;width:64px;vertical-align:middle;margin-right:10px}.pn-art svg{width:100%;height:auto;display:block}
.section-label.big{display:flex;align-items:center;font:600 24px/1.2 "Source Serif 4",Georgia,serif;color:#3E2414;letter-spacing:0;text-transform:none;margin-top:46px}
.group-intro{margin:-6px 0 14px;color:#6E5A48;font:500 15px/1.45 Inter,sans-serif;max-width:70ch}
.sub-label{font:700 13px Inter,sans-serif;color:#3E2414;margin:22px 0 10px}
.js-doors .door-panel{display:none}.js-doors .door-panel.open{display:block;animation:pn-in .25s ease}
@keyframes pn-in{from{opacity:0;transform:translateY(8px)}}
.door-panel{scroll-margin-top:12px}
.back-doors{margin:26px 0 0;font:600 15px Inter,sans-serif}.back-doors a{color:#3E2414}
.js-doors .back-doors{display:none}.js-doors.has-open .back-doors{display:block}
.plain{font:500 .82em Inter,sans-serif;color:#6E5A48}
.today-sub{display:flex;flex-wrap:wrap;gap:8px;margin:-4px 0 6px;font:500 14px Inter,sans-serif;color:#6E5A48}.today-sub a{color:#A4471A;font-weight:600}
.draft-note{background:#FFF8EB;border:1px dashed #D98E1C;border-radius:12px;padding:10px 14px;font:500 14px/1.45 Inter,sans-serif;color:#5A3520;margin:0 0 16px}
.hero h1{color:#3E2414}.unit-card .unit-num{color:#A4471A}.unit-card:hover,.feature-card:hover{border-color:#D98E1C}
@media (max-width:1100px){.doors{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (max-width:560px){.doors{grid-template-columns:1fr 1fr;gap:10px}.door{padding:10px 10px 12px}.door-d{display:none}.door-t{font-size:18px}.tu-t{font-size:18px}.tu-bar{flex-wrap:wrap;padding:12px 14px}}
@media print{.js-doors .door-panel{display:block}.doors,.tu-bar{display:none}}
@media (prefers-reduced-motion:reduce){.door{transition:none}.js-doors .door-panel.open{animation:none}}
</style>
'''

DOORS_JS = '''<script>
(function () {
  var U = %s;
  var n = +((window.SITE_CONFIG || {}).thisUnit7) || 1, u = U[n];
  if (u) { var a = document.getElementById('this-unit'); a.href = u[0]; document.getElementById('tu-t').textContent = u[1]; }
  var root = document.documentElement; root.classList.add('js-doors');
  var doors = [].slice.call(document.querySelectorAll('.door[data-door]'));
  function open(id, scroll) {
    var any = false;
    doors.forEach(function (d) { var on = d.getAttribute('data-door') === id; d.setAttribute('aria-expanded', on ? 'true' : 'false');
      var p = document.getElementById(d.getAttribute('data-door')); if (p) p.classList.toggle('open', on); any = any || on; });
    root.classList.toggle('has-open', any);
    if (any && scroll) { var p = document.getElementById(id); if (p) p.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' }); }
  }
  function fromHash() { var h = decodeURIComponent(location.hash.slice(1)); if (!h) return; var el = document.getElementById(h); if (!el) return;
    var panel = el.closest ? el.closest('.door-panel') : null; if (panel) { open(panel.id, false); el.scrollIntoView(); } }
  doors.forEach(function (d) { d.addEventListener('click', function (e) { e.preventDefault(); var id = d.getAttribute('data-door');
    if (d.getAttribute('aria-expanded') === 'true') { open('', false); history.replaceState(null, '', location.pathname + location.search); return; }
    history.replaceState(null, '', '#' + id); open(id, true); }); });
  window.addEventListener('hashchange', fromHash); fromHash();
})();
</script>
'''

def home_page(US):
    doors = [('learn', 'd-learn', 'Learn', 'Your units: guided notes and practice for each unit, plus vocabulary and formulas.'),
             ('practice-review', 'd-practice', 'Practice &amp; Review', 'Stuck on a skill? Short lessons and videos with Digit, and math facts practice.'),
             ('my-progress', 'd-progress', 'My Progress', 'How your grade works, good work habits and class information.'),
             ('take-a-break', 'd-break', 'Take a Break', 'Done with your work? The 7th Grade Arcade, the Reset Room and chill music.')]
    h = [head('7th Grade Math — Mr. Allen\'s Math Class', '<link rel="stylesheet" href="../site.css">\n' + HOME_CSS)]
    h.append('<body>\n<script src="../site-config.js"></script>\n<script src="../site-bar.js"></script>\n\n<div class="page-wrap wide">\n')
    h.append('<div class="hero"><h1>7th Grade Math</h1><p>Pick a door to get started. The gold button always takes you to the unit we are on.</p></div>\n')
    h.append('<a class="tu-bar" id="this-unit" href="unit1.html"><span class="tu-k">★ This unit</span><span class="tu-t" id="tu-t">Unit 1 · %s</span><span class="tu-go">Go →</span></a>\n' % US[0].UNIT['title'])
    h.append('<div class="doors" id="today" role="group" aria-label="Four doors">\n')
    for id_, cls, t, d in doors:
        h.append('  <a class="door %s" href="#%s" data-door="%s" aria-controls="%s" aria-expanded="false"><span class="door-art">%s</span><span class="door-t">%s</span><span class="door-d">%s</span><span class="door-go">Open %s <span aria-hidden="true">↓</span></span></a>\n' % (cls, id_, id_, id_, DOOR_ART[id_], t, d, t))
    h.append('</div>\n<div class="today-sub">New here? <a href="../index.html#video-tour">Watch the 2-minute website tour</a></div>\n')
    # LEARN
    h.append('<section class="door-panel" id="learn" aria-label="Learn">\n<div class="section-label big"><span class="pn-art">%s</span>Learn</div>\n' % DOOR_ART['learn'])
    h.append('<p class="group-intro">Each unit page has the guided notes, practice, Skill Builders and games for that unit, in order.</p>\n<div class="units-grid">\n')
    for m in US:
        U = m.UNIT
        h.append(card('unit%d.html' % U['n'], U['icon'], U['title'], U['desc'], num='UNIT %d' % U['n'], std=' · '.join(s[0] for s in U['stds'])))
    h.append('</div>\n<div class="sub-label">Look it up</div>\n<div class="units-grid">\n')
    h.append(card('vocabulary.html', '🔤', 'Vocabulary', 'Key math words for every 7th grade unit, with short meanings.'))
    h.append(card('formulas.html', '🧾', 'Formula Sheet', 'Circles, area, surface area, volume, percent and probability, all in one place.'))
    h.append('</div>\n<div class="sub-label">Look ahead</div>\n<div class="units-grid">\n')
    h.append(card(G8 + 'index.html', '🧭', '8th Grade Math <span class="plain">(next year)</span>', 'Want to look ahead or review? The 8th grade units, Skill Builders and games are open to you too.'))
    h.append('</div>\n</section>\n')
    # PRACTICE & REVIEW
    h.append('<section class="door-panel" id="practice-review" aria-label="Practice &amp; Review">\n<div class="section-label big"><span class="pn-art">%s</span>Practice &amp; Review</div>\n' % DOOR_ART['practice-review'])
    h.append('<p class="group-intro">Stuck on a skill, or getting ready for a test? Start here.</p>\n<div class="sub-label">Get help with a skill</div>\n<div class="units-grid">\n')
    h.append(card('skill-builders.html', '🧩', 'Skill Builders <span class="plain">(short lessons and videos)</span>', 'Short videos with Digit and step-by-step lessons on the core skills of every unit. Then practice with help.'))
    h.append(card(FLUENCY_LAB, '🧠', 'Fluency Lab <span class="plain">(math facts practice)</span>', 'Build core skills to automatic: multiplying, dividing, fractions, decimals, integers and expressions.'))
    h.append('</div>\n</section>\n')
    # MY PROGRESS
    h.append('<section class="door-panel" id="my-progress" aria-label="My Progress">\n<div class="section-label big"><span class="pn-art">%s</span>My Progress</div>\n' % DOOR_ART['my-progress'])
    h.append('<p class="group-intro">How your grade works and how to raise a score.</p>\n')
    h.append(fcard('../grade8/durable-skills.html', '🌱', 'Durable Skills <span class="plain">(good work habits)</span>', 'Perseverance, working with others and self-control: what they look like and a quick self-check.'))
    h.append(fcard('../class-information.html', '📋', 'Class Information', 'Syllabus, Google Classroom links, and family resources'))
    h.append('</section>\n')
    # BREAK
    h.append('<section class="door-panel" id="take-a-break" aria-label="Take a Break">\n<div class="section-label big"><span class="pn-art">%s</span>Take a Break</div>\n' % DOOR_ART['take-a-break'])
    h.append('<p class="group-intro">Finished your work? These still build your math skills.</p>\n')
    h.append(fcard('arcade.html', '🎮', 'Enter the 7th Grade Arcade <span class="plain">(math games)</span>', 'Integer and fact games, plus new games for ratios, percents, geometry and probability.'))
    h.append(fcard('../grade8/reset-room.html', '🌊', 'Reset Room <span class="plain">(a calm-down space)</span>', 'Calm-down activities: tap the water, breathe, and reset before you get back to work.'))
    h.append(fcard('../grade8/drift.html', '🎧', 'Chill Math Music', 'Focus music for work time. Opens in a new tab.', extra=' target="_blank" rel="noopener"'))
    h.append('</section>\n<p class="back-doors"><a href="#today">↑ Back to the four doors</a></p>\n</div>\n<div class="site-footer">© Mr. Allen\'s Math Class · 7th Grade Math</div>\n')
    h.append(DOORS_JS % json.dumps({m.UNIT['n']: ['unit%d.html' % m.UNIT['n'], 'Unit %d · %s' % (m.UNIT['n'], m.UNIT['title'])] for m in US}, ensure_ascii=False))
    h.append('</body>\n</html>\n')
    write('index.html', ''.join(h))

def vocab_page(US):
    h = [head('Vocabulary — 7th Grade Math', '<link rel="stylesheet" href="../site.css">\n<style>.vgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:12px}.vcard{background:#fff;border:1px solid #E9DCC4;border-left:5px solid #F2B13C;border-radius:10px;padding:12px 14px}.vcard b{display:block;font:600 1.05rem "Source Serif 4",Georgia,serif;color:#3E2414}.vcard span{color:#5A4636;font-size:.95rem}</style>\n')]
    h.append('<body>\n<script src="../site-bar.js"></script>\n<div class="page-wrap">\n<a href="index.html" class="back-link">← Back to 7th Grade Math</a>\n<div class="page-hdr"><h1>7th Grade Vocabulary</h1><p>Key words for every unit. Tap a unit to jump to it.</p></div>\n')
    h.append('<div class="topic-nav">%s</div>\n' % ' '.join('<a class="nb" href="#u%d">U%d</a>' % (m.UNIT['n'], m.UNIT['n']) for m in US))
    for m in US:
        U = m.UNIT; words = list(U.get('vocab', []))
        seen = {w[0].lower() for w in words}
        for t in m.T:
            for w in t.get('words', []):
                if w[0].lower() not in seen: words.append(w); seen.add(w[0].lower())
        h.append('<div class="section-label" id="u%d">Unit %d — %s</div>\n<div class="vgrid">%s</div>\n' % (U['n'], U['n'], U['title'], ''.join('<div class="vcard"><b>%s</b><span>%s</span></div>' % w for w in words)))
    h.append('</div>\n<div class="site-footer">© Mr. Allen\'s Math Class · 7th Grade Math</div>\n</body>\n</html>\n')
    write('vocabulary.html', ''.join(h))

SBV = V
def sb_shell(U, mode):
    n = U['n']; is_p = mode == 'practice'; what = 'Practice Set' if is_p else 'Mini-Lessons'
    intro = ('One problem at a time. If a problem is tricky, the page helps you find the mistake and walks you through the steps.' if is_p else
             'Short lessons on the core skills of this unit. Each lesson: watch a short video with Digit, learn the big idea, walk through an example one step at a time, and check your understanding as you go.')
    how = '' if is_p else ('<ol class="sb-how"><li><span class="n">1</span><b>Watch</b>a short video and animation</li><li><span class="n">2</span><b>Learn</b>the big idea and key words</li>'
                           '<li><span class="n">3</span><b>Walk through</b>an example, one step at a time</li><li><span class="n">4</span><b>Check</b>your understanding</li></ol>')
    other = ('<a href="skill-builders-unit%d.html">Mini-Lessons<span>Go back to the lessons for Unit %d.</span></a>' % (n, n) if is_p else
             '<a href="skill-builders-unit%d-practice.html">Practice Set →<span>Practice the Unit %d skills, one problem at a time.</span></a>' % (n, n))
    return '''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Skill Builders · Unit %(n)d %(what)s — 7th Grade Math</title>
%(fonts)s
<link rel="stylesheet" href="../grade8/skills/sb.css?v=%(V)s">
<script src="../tracker-config.js"></script>
<script src="../score-send.js?v=20261117a"></script>
<script src="../grade8/step-work.js?v=20261113e"></script>
<script src="../grade8/skills/sb.js?v=%(V)s"></script>
<script src="../grade8/skills/sbfig.js?v=20261118a"></script>
<script src="skills/g7-sb.js?v=%(V)s"></script>
<script src="skills/u%(n)d.js?v=%(V)s"></script>
<script src="../grade8/skills/sbcalc.js?v=20261118a"></script>%(video)s
<script src="../brand.js"></script>
<link rel="stylesheet" href="g7.css?v=%(V)s">
</head>
<body>
<script src="../site-bar.js"></script>
<div class="sb-wrap">
<div class="noprint"><a class="sb-back" href="skill-builders.html">← All Skill Builders</a></div>
<header class="sb-head noprint"><div class="k">Skill Builders · Grade 7 · Unit %(n)d · <span class="sb-pill">Score 3</span></div><h1>%(title)s: %(what)s</h1><p>%(intro)s</p></header>
<div class="noprint">%(how)s</div>
<div id="sb" data-unit="%(n)d" data-mode="%(mode)s"></div>
<div class="noprint">
<div id="send"></div>
<div class="sb-more">%(other)s<a href="unit%(n)d.html">Unit %(n)d page<span>Notes, practice and games.</span></a></div>
</div>
</div>
<script src="../student-fx.js?v=20261118a"></script>
</body>
</html>
''' % dict(n=n, what=what, fonts=FONTS, V=SBV, video='' if is_p else '\n<script src="../grade8/skills/sbvideo.js?v=%s"></script>' % SBV, title=U['title'], intro=intro, how=how, mode=mode, other=other)

def sb_pages(US):
    have = [m for m in US if os.path.exists(os.path.join(OUT, 'skills', 'u%d.js' % m.UNIT['n']))]
    for m in have:
        write('skill-builders-unit%d.html' % m.UNIT['n'], sb_shell(m.UNIT, 'lessons'))
        write('skill-builders-unit%d-practice.html' % m.UNIT['n'], sb_shell(m.UNIT, 'practice'))
    h = [head('Skill Builders — 7th Grade Math', '<link rel="stylesheet" href="../site.css">\n<style>.sbc{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:14px}.sbu{background:#fff;border:1px solid #E9DCC4;border-top:5px solid #F2B13C;border-radius:12px;padding:14px 16px}.sbu h2{font:600 1.2rem "Source Serif 4",Georgia,serif;color:#3E2414;margin:2px 0 4px}.sbu .k{font:700 12px Inter,sans-serif;letter-spacing:.08em;color:#A4471A;text-transform:uppercase}.sbu p{margin:0 0 10px;color:#5A4636;font-size:.95rem}.sbu .row{display:flex;flex-wrap:wrap;gap:8px}.sbu .row a{font:600 14px Inter,sans-serif;text-decoration:none;border-radius:9px;padding:8px 12px;border:1.5px solid #3E2414;color:#3E2414}.sbu .row a.v{background:#3E2414;color:#F2B13C}.sbu .row a:hover{background:#FCEBC8;color:#3E2414}</style>\n')]
    h.append('<body>\n<script src="../site-bar.js"></script>\n<div class="page-wrap">\n<a href="index.html" class="back-link">← Back to 7th Grade Math</a>\n')
    h.append('<div class="page-hdr"><h1>Skill Builders</h1><p>Short lessons on the core (Score 3) skill of each unit. Each lesson has a short video with Digit, an example you walk through one step at a time, and quick checks. Then try the practice set: the page helps you when you are stuck.</p></div>\n<div class="sbc">\n')
    for m in have:
        U = m.UNIT; n = U['n']
        h.append('<div class="sbu"><div class="k">Unit %d · %s</div><h2>%s</h2><p>%s</p><div class="row"><a class="v" href="skill-builders-unit%d.html#video">▶ Videos</a><a href="skill-builders-unit%d.html">Mini-Lessons</a><a href="skill-builders-unit%d-practice.html">Practice Set</a></div></div>\n' % (
            n, ' · '.join(s[0] for s in U['stds']), U['title'], U['desc'], n, n, n))
    h.append('</div>\n</div>\n<div class="site-footer">© Mr. Allen\'s Math Class · 7th Grade Math</div>\n</body>\n</html>\n')
    write('skill-builders.html', ''.join(h))

# ------------------------------------------------------------------ arcade (Nov 20, 2026)
ARCADE_CSS = '''<style>
:root{--bg:#22140B;--card:#3A2414;--bdr:#5E3B1F;--gold:#F2B13C;--amber:#D98E1C;--rust:#C8642A;--sage:#9BB55A;--cream:#FFF4DF;--dim:#D9C2A0}
*{box-sizing:border-box}
body{margin:0;font-family:Inter,system-ui,sans-serif;color:var(--cream);font-size:17px;line-height:1.5;background:var(--bg);
 background-image:radial-gradient(circle at 12% 6%,rgba(242,177,60,.14) 0,transparent 42%),radial-gradient(circle at 88% 78%,rgba(200,100,42,.14) 0,transparent 42%),linear-gradient(180deg,#2A180C 0,#170D06 100%);min-height:100vh}
.wrap{max-width:1180px;margin:0 auto;padding:24px 18px 60px}
.back{display:inline-block;color:var(--gold);font-weight:700;text-decoration:none;margin-bottom:14px}.back:hover{text-decoration:underline}
.hdr{text-align:center;padding:26px 10px 10px}
.hdr h1{margin:0;font:600 clamp(32px,6vw,52px)/1.1 "Source Serif 4",Georgia,serif;color:var(--gold);letter-spacing:.02em;text-shadow:0 3px 0 #000,0 0 24px rgba(242,177,60,.35)}
.hdr p{max-width:640px;margin:10px auto 0;color:var(--dim)}
.tags{display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-top:14px}
.tags span{font:700 12px Inter,sans-serif;letter-spacing:.08em;text-transform:uppercase;border:2px solid var(--bdr);border-radius:999px;padding:5px 12px;color:var(--gold)}
.section{margin-top:38px}
.sh{display:flex;align-items:baseline;gap:12px;flex-wrap:wrap;margin-bottom:14px;border-bottom:2px solid var(--bdr);padding-bottom:8px}
.sh h2{margin:0;font:600 26px "Source Serif 4",Georgia,serif;color:#fff}.sh p{margin:0;color:var(--dim);font-size:15px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:16px}
.card{position:relative;display:flex;flex-direction:column;gap:6px;text-decoration:none;color:var(--cream);background:var(--card);border:2px solid var(--bdr);border-radius:16px;padding:18px 18px 16px;box-shadow:0 5px 0 rgba(0,0,0,.35);transition:transform .12s,border-color .12s,box-shadow .12s}
.card:hover,.card:focus-visible{transform:translateY(-3px);border-color:var(--gold);box-shadow:0 8px 0 rgba(0,0,0,.35),0 0 22px rgba(242,177,60,.25)}
.card .em{font-size:40px;line-height:1}
.card h3{margin:2px 0 0;font:600 22px "Source Serif 4",Georgia,serif;color:#fff}
.card p{margin:0;color:var(--dim);font-size:15px}
.card .tag{align-self:flex-start;font:700 12px Inter,sans-serif;border-radius:6px;padding:3px 8px;background:rgba(242,177,60,.16);color:var(--gold)}
.card .tag.new{background:var(--rust);color:#fff}
.card .go{margin-top:auto;padding-top:6px;font:800 14px Inter,sans-serif;color:var(--gold)}
.note{margin-top:34px;background:rgba(255,244,223,.06);border:1px dashed var(--bdr);border-radius:12px;padding:12px 16px;color:var(--dim);font-size:15px}
.note b{color:var(--cream)}
.lb{margin-top:26px;background:linear-gradient(180deg,#3A2414,#2A180C);border:3px solid var(--gold);border-radius:16px;padding:16px 16px 12px}
.lb[hidden]{display:none}
.lb-top{display:flex;align-items:baseline;gap:12px;flex-wrap:wrap;margin-bottom:10px}
.lb-top h2{margin:0;font:600 24px "Source Serif 4",Georgia,serif;color:var(--gold)}.lb-top p{margin:0 0 0 auto;font-size:14px;color:var(--dim)}
.lb-row{display:flex;gap:12px;overflow-x:auto;padding-bottom:8px}
.lb-card{flex:0 0 220px;background:rgba(0,0,0,.25);border:2px solid var(--bdr);border-radius:12px;padding:10px 12px;text-decoration:none;color:inherit}
.lb-card:hover{border-color:var(--gold)}.lb-card h3{margin:0 0 6px;font:600 17px "Source Serif 4",Georgia,serif;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.lb-card ol{list-style:none;margin:0;padding:0}.lb-card li{display:flex;align-items:center;gap:8px;padding:3px 0;font-size:15px;border-top:1px dashed rgba(255,255,255,.1)}
.lb-card li:first-child{border-top:0}.lb-card .rk{flex:0 0 22px;height:22px;border-radius:50%;display:grid;place-items:center;font:700 12px Inter,sans-serif;background:#5E3B1F;color:#fff}
.lb-card li:nth-child(1) .rk{background:var(--gold);color:#3E2414}.lb-card .nm{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.lb-card .sc{font:600 14px "JetBrains Mono",monospace;color:var(--sage)}.lb-msg{color:var(--dim);font-size:15px;padding:6px 2px}
.foot{text-align:center;color:#8F7556;font-size:13px;margin-top:40px}
@media (prefers-reduced-motion:reduce){.card{transition:none}}
</style>
'''

LB_JS = """<script>
/* High Scores: asks the 7th grade teacher's Sheet (?leaders=1, MathClassTracker script) for the top 5 per game.
   Hidden until tracker-config.js has a 7th grade ENDPOINT. */
(function () {
  var cfg = window.TRACKER_CONFIG || {}, box = document.getElementById('lb'), row = document.getElementById('lbRow'), timer;
  if (!cfg.ENDPOINT || !box) return;
  box.hidden = false;
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function msg(t) { row.innerHTML = '<div class="lb-msg">' + t + '</div>'; }
  var cards = [].slice.call(document.querySelectorAll('a.card')).map(function (a) { var h = a.querySelector('h3'); return { name: h ? h.textContent.trim() : '', href: a.getAttribute('href') }; });
  function norm(s) { return String(s).toLowerCase().replace(/[^a-z0-9]/g, ''); }
  function idx(g) { for (var i = 0; i < cards.length; i++) if (norm(cards[i].name) === norm(g)) return i; return 999; }
  window.__arcadeLeaders = function (d) {
    clearTimeout(timer);
    if (!d || !d.ok || !d.games) return msg('High scores are not available right now.');
    var names = Object.keys(d.games).sort(function (a, b) { return idx(a) - idx(b); });
    if (!names.length) return msg('No high scores yet. Play a game with your full name to be the first!');
    row.innerHTML = names.map(function (g) {
      var c = cards[idx(g)];
      return '<a class="lb-card"' + (c ? ' href="' + esc(c.href) + '"' : '') + '><h3 title="' + esc(g) + '">' + esc(g) + '</h3><ol>' +
        d.games[g].map(function (r, i) { return '<li><span class="rk">' + (i + 1) + '</span><span class="nm">' + esc(r.name) + '</span><span class="sc">' + Number(r.score).toLocaleString() + '</span></li>'; }).join('') + '</ol></a>';
    }).join('');
  };
  var s = document.createElement('script');
  s.src = cfg.ENDPOINT + (cfg.ENDPOINT.indexOf('?') < 0 ? '?' : '&') + 'leaders=1&callback=__arcadeLeaders&t=' + Math.floor(Date.now() / 60000);
  s.onerror = function () { msg('High scores are not available right now.'); };
  timer = setTimeout(function () { if (/Loading/.test(row.textContent)) msg('High scores are not available right now.'); }, 12000);
  document.body.appendChild(s);
})();
</script>
"""

def arcade_page():
    new = [g for g in GAMES if not g.get('carry')]; old = [g for g in GAMES if g.get('carry')]
    def c(g, tag, cls=''):
        return ('<a class="card" href="%s"><div class="em">%s</div><span class="tag%s">%s</span><h3>%s</h3><p>%s</p><span class="go">Play →</span></a>\n'
                % (g['href'], g['icon'], cls, tag, g['name'], g['desc']))
    h = ['<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n'
         '<title>The 7th Grade Arcade — Mr. Allen\'s Math Class</title>\n%s\n%s</head>\n<body>\n<script src="../site-bar.js"></script>\n<div class="wrap">\n' % (FONTS, ARCADE_CSS)]
    h.append('<a class="back" href="index.html">← Back to 7th Grade Math</a>\n<div class="hdr"><h1>THE 7TH GRADE ARCADE</h1>'
             '<p>Finished your work? Every game here still builds your math. Pick a game, read each question, and go for 3 stars.</p>'
             '<div class="tags"><span>%d games + Fluency Lab</span><span>Units 1–9</span><span>Play anytime</span></div></div>\n' % len(GAMES))
    h.append('<div class="lb" id="lb" hidden><div class="lb-top"><h2>High Scores</h2><p>Top 5 for each new 7th grade game. Names show as first name and last initial.</p></div>'
             '<div class="lb-row" id="lbRow"><div class="lb-msg">Loading high scores…</div></div></div>\n')
    h.append('<div class="section"><div class="sh"><h2>New 7th grade games</h2><p>Ratios, percents, geometry, statistics and probability</p></div><div class="grid">\n')
    h.extend(c(g, g['tag'], ' new') for g in new)
    h.append('</div></div>\n<div class="section"><div class="sh"><h2>Fluency games</h2><p>Integers, facts and equations to automatic</p></div><div class="grid">\n')
    h.extend(c(g, '%s · Unit %s' % (g['tag'], ' & '.join(map(str, g['units'])))) for g in old)
    h.append(c(dict(href=FLUENCY_LAB, icon='🧠', name='Fluency Lab', desc='Short timed drills: multiplying, dividing, fractions, decimals, integers and expressions. Beat your own best.'), 'Every unit'))
    h.append('</div></div>\n<p class="note"><b>Earned Arcade time?</b> Watch 3 Skill Builder videos to the end and you get 5 minutes. Press <b>Start</b> on the gold chip when you are ready. '
             'The fluency games open in the 8th grade Arcade, so the menu may say 8th grade while you play. Use the back button to come back here.</p>\n')
    h.append('<div class="foot">© Mr. Allen\'s Math Class · 7th Grade Math</div>\n</div>\n<script src="../tracker-config.js"></script>\n<script src="../arcade-pass.js?v=20261118a"></script>\n' + LB_JS + '</body>\n</html>\n')
    write('arcade.html', ''.join(h))

# ------------------------------------------------------------------ formula sheet (Nov 20, 2026)
def _svg(body, w=170, h=110):
    return '<svg viewBox="0 0 %d %d" aria-hidden="true">%s</svg>' % (w, h, body)
S = 'stroke="#3E2414" stroke-width="2.5" fill="#FCEBC8"'
T = lambda x, y, t, a='middle': '<text x="%s" y="%s" text-anchor="%s" font-family="Inter,sans-serif" font-size="14" font-weight="700" fill="#3E2414">%s</text>' % (x, y, a, t)
FORMULAS = [
 ('Shapes: area', [
   ('Rectangle', 'A = bh', _svg('<rect x="25" y="20" width="120" height="66" %s/>' % S + T(85, 104, 'b') + T(155, 58, 'h', 'start')), 'A 6 by 4 rectangle: A = 6 × 4 = 24 square units.'),
   ('Parallelogram', 'A = bh', _svg('<path d="M45 20 H150 L125 86 H20 Z" %s/><path d="M45 20 V86" stroke="#C8642A" stroke-width="2" stroke-dasharray="4 3"/>' % S + T(72, 104, 'b') + T(52, 58, 'h', 'start')), 'Use the height that makes a square corner with the base, not the slanted side.'),
   ('Triangle', 'A = ½bh', _svg('<path d="M20 86 H150 L95 18 Z" %s/><path d="M95 18 V86" stroke="#C8642A" stroke-width="2" stroke-dasharray="4 3"/>' % S + T(85, 104, 'b') + T(101, 60, 'h', 'start')), 'Half of a rectangle. b = 10, h = 6: A = ½ × 10 × 6 = 30.'),
   ('Trapezoid', 'A = ½h(b₁ + b₂)', _svg('<path d="M50 22 H120 L150 86 H20 Z" %s/><path d="M50 22 V86" stroke="#C8642A" stroke-width="2" stroke-dasharray="4 3"/>' % S + T(85, 16, 'b₁') + T(85, 104, 'b₂') + T(56, 60, 'h', 'start')), 'Add the two bases, multiply by the height, then take half.'),
 ]),
 ('Circles', [
   ('Circumference', 'C = πd = 2πr', _svg('<circle cx="85" cy="55" r="40" %s/><path d="M45 55 H125" stroke="#C8642A" stroke-width="2.5"/><circle cx="85" cy="55" r="3" fill="#3E2414"/>' % S + T(85, 48, 'd')), 'The distance around. d = 10: C = 10π ≈ 31.4.'),
   ('Area of a circle', 'A = πr²', _svg('<circle cx="85" cy="55" r="40" %s/><path d="M85 55 H125" stroke="#C8642A" stroke-width="2.5"/><circle cx="85" cy="55" r="3" fill="#3E2414"/>' % S + T(105, 48, 'r')), 'r = 3: A = π × 3² = 9π ≈ 28.26. Square the radius first.'),
   ('Radius and diameter', 'd = 2r  ·  r = d ÷ 2', '', 'Use π ≈ 3.14, or leave the answer in terms of π.'),
 ]),
 ('Solids: volume and surface area', [
   ('Volume of a prism', 'V = Bh', _svg('<path d="M30 40 L60 20 H140 L110 40 Z" fill="#F2B13C" stroke="#3E2414" stroke-width="2.5"/><path d="M30 40 H110 V92 H30 Z" %s/><path d="M110 40 L140 20 V72 L110 92" %s/>' % (S, S) + T(70, 104, 'B = area of the base')), 'B is the AREA of the base (not a side length). Box 5 × 3 × 4: B = 15, V = 15 × 4 = 60 cubic units.'),
   ('Surface area', 'SA = sum of the areas of all the faces', '', 'Unfold it into a net. A box has 3 pairs of matching faces: SA = 2lw + 2lh + 2wh.'),
 ]),
 ('Angles', [
   ('Complementary', 'a + b = 90°', '', 'Two angles that make a right angle.'),
   ('Supplementary', 'a + b = 180°', '', 'Two angles that make a straight line.'),
   ('Vertical angles', 'a = b', '', 'Angles across from each other where two lines cross are equal.'),
   ('Triangle', 'a + b + c = 180°', '', 'The three angles of any triangle add to 180°.'),
 ]),
 ('Ratios and percents', [
   ('Unit rate', 'unit rate = amount ÷ 1 unit', '', '$6 for 4 pounds: 6 ÷ 4 = $1.50 per pound.'),
   ('Proportional', 'y = kx', '', 'k is the constant of proportionality (the unit rate): k = y ÷ x.'),
   ('Percent of a number', 'part = percent × whole', '', '30% of 60 = 0.30 × 60 = 18.'),
   ('Discount', 'sale price = (1 − rate) × price', '', '20% off $50: 0.80 × 50 = $40.'),
   ('Tax or tip', 'total = (1 + rate) × price', '', '6% tax on $30: 1.06 × 30 = $31.80.'),
   ('Simple interest', 'I = Prt', '', '$200 at 5% for 3 years: 200 × 0.05 × 3 = $30.'),
   ('Percent change', 'percent change = change ÷ original', '', '$40 up to $50: 10 ÷ 40 = 0.25 = 25% increase.'),
 ]),
 ('Statistics and probability', [
   ('Mean', 'mean = sum ÷ count', '', '4, 6, 8: 18 ÷ 3 = 6.'),
   ('Median', 'the middle number in order', '', 'Put the numbers in order first.'),
   ('Range', 'range = biggest − smallest', '', 'Shows how spread out the data is.'),
   ('Probability', 'P(event) = good outcomes ÷ all outcomes', '', 'Always from 0 (impossible) to 1 (certain).'),
   ('Not happening', 'P(not A) = 1 − P(A)', '', 'P(win) = 0.3, so P(not win) = 0.7.'),
   ('Counting outcomes', 'choices × choices', '', 'A coin and a number cube: 2 × 6 = 12 outcomes.'),
 ]),
]
FORM_CSS = '''<link rel="stylesheet" href="../site.css">
<style>
.fsec{margin-top:30px}.fgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:12px}
.fc{background:#fff;border:1px solid #E9DCC4;border-top:5px solid #F2B13C;border-radius:12px;padding:12px 14px;break-inside:avoid}
.fc h3{margin:0;font:600 1.05rem "Source Serif 4",Georgia,serif;color:#3E2414}
.fc .f{margin:6px 0;font:600 1.15rem "JetBrains Mono",monospace;color:#A4471A}
.fc p{margin:0;font:500 14.5px/1.45 Inter,sans-serif;color:#5A4636}
.fc svg{display:block;width:100%;max-width:200px;height:auto;margin:4px auto 2px}
@media print{.fgrid{grid-template-columns:repeat(3,1fr)}.fc{border-top-width:3px}.back-link,.topic-nav{display:none}}
</style>
'''

def formulas_page():
    h = [head('Formula Sheet — 7th Grade Math', FORM_CSS)]
    h.append('<body>\n<script src="../site-bar.js"></script>\n<div class="page-wrap">\n<a href="index.html" class="back-link">← Back to 7th Grade Math</a>\n'
             '<div class="page-hdr"><h1>7th Grade Formula Sheet</h1><p>Every formula from the year, with a quick example. Print it or keep it open while you work.</p></div>\n')
    h.append('<div class="topic-nav">%s</div>\n' % ' '.join('<a class="nb" href="#f%d">%s</a>' % (i, s[0]) for i, s in enumerate(FORMULAS)))
    for i, (sec, items) in enumerate(FORMULAS):
        h.append('<div class="fsec"><div class="section-label" id="f%d">%s</div>\n<div class="fgrid">\n' % (i, sec))
        for name, f, fig, ex in items:
            h.append('<div class="fc"><h3>%s</h3>%s<div class="f">%s</div><p>%s</p></div>\n' % (name, fig, f, ex))
        h.append('</div></div>\n')
    h.append('</div>\n<div class="site-footer">© Mr. Allen\'s Math Class · 7th Grade Math</div>\n</body>\n</html>\n')
    write('formulas.html', ''.join(h))
