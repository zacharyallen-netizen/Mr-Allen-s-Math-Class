"""Skill Builders pages (Nov 2026): the hub + a Mini-Lessons page and a Practice Set page per unit (Units 1-8).
The pages are thin shells; the content is in grade8/skills/uN.js and the engine in grade8/skills/sb.js.
Run from the repo root:  python3 _build/skill_builders/make_pages.py
Bump V after changing sb.js / sbfig.js / sb.css / uN.js (browsers keep .js files for 10 minutes)."""
import pathlib

V = '20261112k'
ROOT = pathlib.Path(__file__).resolve().parents[2]
G8 = ROOT / 'grade8'
UNITS = [
    (1, 'Real Numbers', 'Rational or irrational, the 9’s rule, square and cube roots, estimating roots.', 'NC.8.NS.1–2 · NC.8.EE.2'),
    (2, 'Exponents & Scientific Notation', 'What exponents mean, the exponent rules, and scientific notation.', 'NC.8.EE.1, 3–4'),
    (3, 'Equations & Inequalities', 'Two-step and multi-step equations, special cases, and inequalities.', 'NC.8.EE.7'),
    (4, 'Angle Relationships', 'Angle pairs, parallel lines cut by a transversal, and triangle angles.', 'NC.8.G.5'),
    (5, 'Pythagorean Theorem', 'Legs and hypotenuse, missing sides, the converse, and distance.', 'NC.8.G.6–8'),
    (6, 'Functions', 'Functions, slope, y = mx + b, rate and start value, and systems.', 'NC.8.F.1–5 · NC.8.EE.8'),
    (7, 'Statistics', 'Scatter plots, lines of best fit, and two-way tables.', 'NC.8.SP.1–4'),
    (8, 'Transformations', 'Slides, flips, turns, and dilations on the coordinate plane.', 'NC.8.G.2–4'),
]
FONTS = '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Source+Serif+4:opsz,wght@8..60,600&family=JetBrains+Mono:wght@500;600&display=swap" rel="stylesheet">'


def pdf(n, kind, key=False):
    return f'SkillBuilders_Unit{n}_{kind}{"_AnswerKey" if key else ""}.pdf'


def shell(n, title, mode):
    is_p = mode == 'practice'
    what = 'Practice Set' if is_p else 'Mini-Lessons'
    intro = ('One problem at a time. If a problem is tricky, the page helps you find the mistake and walks you through the steps.'
             if is_p else 'Short lessons on the core skills of this unit. Each lesson: watch a short animation, learn the big idea, '
             'walk through an example one step at a time, and check your understanding as you go.')
    how = '' if is_p else ('<ol class="sb-how"><li><span class="n">1</span><b>Watch</b>a short animation</li><li><span class="n">2</span><b>Learn</b>the big idea and key words</li>'
                           '<li><span class="n">3</span><b>Walk through</b>an example, one step at a time</li><li><span class="n">4</span><b>Check</b>your understanding</li></ol>')
    other = (f'<a href="skill-builders-unit{n}.html">Mini-Lessons<span>Go back to the lessons for Unit {n}.</span></a>' if is_p else
             f'<a href="skill-builders-unit{n}-practice.html">Practice Set →<span>Practice the Unit {n} skills, one problem at a time.</span></a>')
    kind = 'Practice' if is_p else 'Lessons'
    return f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Skill Builders · Unit {n} {what} — Mr. Allen's Math Class</title>
{FONTS}
<link rel="stylesheet" href="skills/sb.css?v={V}">
<script src="../tracker-config.js"></script>
<script src="../score-send.js?v=20261113a"></script>
<script src="step-work.js?v=20261112c"></script>
<script src="skills/sb.js?v={V}"></script>
<script src="skills/sbfig.js?v={V}"></script>
<script src="skills/u{n}.js?v={V}"></script>
<script src="../brand.js"></script>
</head>
<body>
<!-- SITE-BAR -->
<script src="../site-bar.js"></script>
<div class="sb-wrap">
<div class="noprint"><a class="sb-back" href="skill-builders.html">← All Skill Builders</a></div>
<header class="sb-head noprint"><div class="k">Skill Builders · Unit {n} · <span class="sb-pill">Score 3</span></div><h1>{title}: {what}</h1><p>{intro}</p></header>
<div class="noprint">{how}</div>
<div id="sb" data-unit="{n}" data-mode="{mode}"></div>
<div class="noprint">
<div id="send"></div>
<div class="sb-more">{other}<a href="unit{n}.html">Unit {n} page<span>Notes, practice, homework and the pre-test.</span></a></div>
<p class="pr-row pr-links">Printable copies: <a href="skills/pdf/{pdf(n, kind)}">{what} (PDF)</a><a href="skills/pdf/{pdf(n, kind, True)}">Answer key (PDF)</a></p>
</div>
</div>
<script src="../student-fx.js?v=20261113b"></script>
</body>
</html>
'''


def hub():
    cards = ''.join(f'''<div class="hub-card"><div class="u">UNIT {n}</div><h2>{t}</h2><p>{d}</p><div class="sb-std">{s}</div>
<div class="acts"><a class="p" href="skill-builders-unit{n}.html">Mini-Lessons</a><a href="skill-builders-unit{n}-practice.html">Practice Set</a></div>
<div class="pdfs">PDF: <a href="skills/pdf/{pdf(n, 'Lessons')}">lessons</a> · <a href="skills/pdf/{pdf(n, 'Practice')}">practice</a> · keys: <a href="skills/pdf/{pdf(n, 'Lessons', True)}">lessons</a>, <a href="skills/pdf/{pdf(n, 'Practice', True)}">practice</a></div></div>''' for n, t, d, s in UNITS)
    return f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Skill Builders — Mr. Allen's Math Class</title>
{FONTS}
<link rel="stylesheet" href="skills/sb.css?v={V}">
<script src="../brand.js"></script>
</head>
<body>
<!-- SITE-BAR -->
<script src="../site-bar.js"></script>
<div class="sb-wrap">
<a class="sb-back" href="index.html">← 8th Grade Math</a>
<header class="sb-head"><div class="k">Skill Builders · <span class="sb-pill">Score 3</span></div><h1>Skill Builders</h1>
<p>Short lessons on the core skills of each unit, then a practice set. Go at your own pace. Use them to learn a skill for the first time, to review before a test, or to fill a gap.</p></header>
<ol class="sb-how"><li><span class="n">1</span><b>Watch</b>a short animation of the idea</li><li><span class="n">2</span><b>Learn</b>the big idea and the key words</li>
<li><span class="n">3</span><b>Walk through</b>an example, one step at a time</li><li><span class="n">4</span><b>Check and practice</b>with help that points out the mistake</li></ol>
<div class="hub-grid">{cards}</div>
<p class="pr-row">All units in one file: <a href="skills/pdf/SkillBuilders_All_Units.pdf">every lesson and practice set (PDF)</a><a href="skills/pdf/SkillBuilders_All_Units_AnswerKey.pdf">answer key (PDF)</a></p>
<p class="sb-std" style="margin-top:14px">Score 3 = the core skills of each standard on the 1–5 scale. When these feel solid, move on to the unit's practice pages for Score 4 and 5.</p>
</div>
</body>
</html>
'''


if __name__ == '__main__':
    (G8 / 'skill-builders.html').write_text(hub())
    for n, t, d, s in UNITS:
        if not (G8 / 'skills' / f'u{n}.js').exists():
            continue
        (G8 / f'skill-builders-unit{n}.html').write_text(shell(n, t, 'lessons'))
        (G8 / f'skill-builders-unit{n}-practice.html').write_text(shell(n, t, 'practice'))
    print('pages written, V =', V)
