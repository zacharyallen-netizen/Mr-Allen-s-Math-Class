#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Pre-test questions added Nov 11, 2026 (Zach: "make sure there are adequate questions to address those standards").
The Unit 6 pre-test had no NC.8.F.3 (linear vs. nonlinear) or NC.8.F.5 (reading graph stories) questions, and the
Unit 7 pre-test had no NC.8.SP.2 (fitting a line and judging the fit) questions. Levels follow his proficiency scales
(Score 3 = basic, 4 = target, 5 = advanced: explain / interpret in context).

Edits the two built pages in place (safe to run again) and re-numbers the questions 1..N in the order they show.
build_all_units.py does not know these questions: run this again after rebuilding the pre-tests.

    python3 _build/pretest_add_nov11.py          then re-make the PDFs:  node _build/pretest_pdf_nov11.js
"""
import os, re, json, sys
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
from pretest_svg import _svg, T, line, dot, NAVY, BLUE, GOLD, GRID, RED, GREEN
G = os.path.join(HERE, '..', 'grade8')

# ---------- diagrams (same look as pretest_svg.py) ----------
def plot(xmax, ymax, xstep, ystep, xlab, ylab):
    L, R, Tp, B = 34, 12, 12, 30; pw, ph = 168, 120; W, H = L + pw + R, Tp + ph + B
    X = lambda x: L + x / float(xmax) * pw
    Y = lambda y: Tp + ph - y / float(ymax) * ph
    o = []
    k = 0
    while k * xstep <= xmax + 1e-9:
        xv = k * xstep; o.append(line(X(xv), Tp, X(xv), Tp + ph, GRID, 1)); o.append(T(X(xv), Tp + ph + 12, '%g' % xv, NAVY, 'middle', 9, 'normal')); k += 1
    k = 0
    while k * ystep <= ymax + 1e-9:
        yv = k * ystep; o.append(line(L, Y(yv), L + pw, Y(yv), GRID, 1)); o.append(T(L - 4, Y(yv) + 3, '%g' % yv, NAVY, 'end', 9, 'normal')); k += 1
    o.append(line(L, Tp, L, Tp + ph, NAVY, 1.8)); o.append(line(L, Tp + ph, L + pw, Tp + ph, NAVY, 1.8))
    o.append(T(L + pw / 2, Tp + ph + 25, xlab, NAVY, 'middle', 9.5, 'bold', 'italic'))
    o.append('<text x="10" y="%.1f" transform="rotate(-90 10 %.1f)" text-anchor="middle" font-family="Arvo,serif" font-size="9.5" font-weight="bold" font-style="italic" fill="%s">%s</text>' % (Tp + ph / 2, Tp + ph / 2, NAVY, ylab))
    return o, X, Y, W, H
def path(pts, X, Y, col=GOLD, w=2.8):
    return '<polyline points="%s" fill="none" stroke="%s" stroke-width="%s" stroke-linejoin="round" stroke-linecap="round"/>' % (' '.join('%.1f,%.1f' % (X(x), Y(y)) for x, y in pts), col, w)
def curve_sq():                                   # y = x² + 1
    o, X, Y, W, H = plot(4, 18, 1, 3, 'x', 'y'); pts = [(i / 10.0, (i / 10.0) ** 2 + 1) for i in range(0, 41)]
    return _svg(W, H, ''.join(o) + path(pts, X, Y))
WALK = [(0, 0), (2, 4), (5, 4), (8, 0)]
def walk(xlab='x', ylab='y'):
    o, X, Y, W, H = plot(8, 5, 1, 1, xlab, ylab)
    return _svg(W, H, ''.join(o) + path(WALK, X, Y) + ''.join(dot(X(x), Y(y), 3.4, NAVY) for x, y in WALK))
def table(xs, ys):
    cw, rh, x0, y0 = 34, 24, 30, 6; W = x0 + cw * len(xs) + 6; H = y0 + 2 * rh + 6; o = []
    for r, (lab, vals) in enumerate((('x', xs), ('y', ys))):
        yy = y0 + r * rh
        o.append('<rect x="4" y="%d" width="%d" height="%d" fill="#1E2D4F"/>' % (yy, x0 - 4, rh)); o.append(T(4 + (x0 - 4) / 2.0, yy + 16, lab, '#fff', 'middle', 12, 'bold', 'italic'))
        for i, v in enumerate(vals):
            o.append('<rect x="%d" y="%d" width="%d" height="%d" fill="#fff" stroke="#b7ae97" stroke-width="1"/>' % (x0 + i * cw, yy, cw, rh)); o.append(T(x0 + i * cw + cw / 2.0, yy + 16, str(v).replace('-', '−'), NAVY, 'middle', 12, 'bold'))
    return _svg(W, H, ''.join(o))
def rental():                                     # y = 6x + 10
    o, X, Y, W, H = plot(5, 40, 1, 10, 'hours', 'cost ($)')
    return _svg(W, H, ''.join(o) + path([(0, 10), (5, 40)], X, Y) + dot(X(0), Y(10), 3.6, NAVY))
PTS = [(1, 27), (2, 28), (3, 37), (4, 38), (5, 47), (6, 48), (7, 57), (8, 58), (9, 63)]      # close to y = 5x + 20
def fit(lines, mark=None, labels=True):
    o, X, Y, W, H = plot(10, 80, 2, 20, 'hours of practice', 'points scored'); s = ''.join(o)
    for name, m, b, col in lines:
        s += path([(0, b), (10, m * 10 + b)], X, Y, col, 2.4)
        if labels and name: s += T(X(1.2), Y(m * 1.2 + b) + (-7 if name == 'B' else 17), name, col, 'middle', 12.5)
    s += ''.join(dot(X(x), Y(y), 3.3, BLUE) for x, y in PTS)
    for (x, y) in (mark or []): s += dot(X(x), Y(y), 4.2, NAVY) + T(X(x) + 6, Y(y) + 12, '(%g, %g)' % (x, y), NAVY, 'start', 9.5)
    return _svg(W, H, s)

U6 = [
 dict(id=21, lvl='basic', std='NC.8.F.3', op='Linear?', expr='Is y = x² + 1 linear or nonlinear?', disp='nonlinear', chk=['text', ['nonlinear', 'non-linear', 'not linear']], lab='Answer:', svg=curve_sq()),
 dict(id=22, lvl='basic', std='NC.8.F.5', op='Read a graph', expr='Look at the graph. From x = 2 to x = 5, is the graph increasing, decreasing or constant?', disp='constant', chk=['text', ['constant', 'flat', 'staying the same']], lab='Answer:', svg=walk()),
 dict(id=23, lvl='target', std='NC.8.F.3', op='From a table', expr='Is this table linear or nonlinear?', disp='nonlinear', chk=['text', ['nonlinear', 'non-linear', 'not linear']], lab='Answer:', svg=table([0, 1, 2, 3], [1, 2, 5, 10])),
 dict(id=24, lvl='target', std='NC.8.F.3', op='From a table', expr='Is this table linear or nonlinear?', disp='linear', chk=['text', ['linear']], lab='Answer:', svg=table([0, 2, 4, 6], [3, 7, 11, 15])),
 dict(id=25, lvl='target', std='NC.8.F.5', op='Read a graph', expr='On which part is the graph decreasing?', disp='x = 5 to x = 8', chk=['text', ['x = 5 to x = 8', '5 to 8', 'from 5 to 8']], lab='Answer:', svg=walk(),
      choices=['x = 0 to x = 2', 'x = 2 to x = 5', 'x = 5 to x = 8'],
      why={'x = 0 to x = 2': 'On that part the graph goes UP. Decreasing means it goes down as you read left to right.', 'x = 2 to x = 5': 'That part is flat. Flat means constant: no change.'}),
 dict(id=26, lvl='advanced', std='NC.8.F.5', op='Graph story', expr='Mia walks to the store, shops, and walks home. The graph shows her distance from home. What does the flat part mean?', disp='Mia is at the store. Her distance is not changing.',
      chk=['text', ['Mia is at the store. Her distance is not changing.']], lab='Answer:', svg=walk('time (minutes)', 'distance (blocks)'),
      choices=['Mia is walking at a steady speed.', 'Mia is at the store. Her distance is not changing.', 'Mia is walking back home.', 'Mia is walking on flat ground.'],
      why={'Mia is walking at a steady speed.': 'A steady walk makes a SLANTED straight line: the distance keeps changing. Flat means the distance stays the same.', 'Mia is walking back home.': 'Walking home makes the distance go DOWN. Flat means it does not change.',
           'Mia is walking on flat ground.': 'The graph is not a picture of the ground. It shows distance from home. Flat means the distance is not changing.'}),
 dict(id=27, lvl='advanced', std='NC.8.F.3', op='Slope in a story', expr='A bike rental costs y = 6x + 10 dollars for x hours. What do the 6 and the 10 mean?', disp='$6 for each hour, plus a $10 starting fee',
      chk=['text', ['$6 for each hour, plus a $10 starting fee']], lab='Answer:', svg=rental(),
      choices=['$10 for each hour, plus a $6 starting fee', '$6 for each hour, plus a $10 starting fee', '6 hours cost $10', '$16 for each hour'],
      why={'$10 for each hour, plus a $6 starting fee': 'You switched them. The number WITH x (6) is the rate for each hour. The number alone (10) is the starting fee.', '6 hours cost $10': 'Put in x = 6: y = 6(6) + 10 = 46. The 6 is the cost for each hour.',
           '$16 for each hour': 'Do not add them. 6 is the cost for each hour. 10 is charged one time, at the start.'}),
]
U7 = [
 dict(id=19, lvl='basic', std='NC.8.SP.2', op='Line of best fit', expr='Does a line of best fit have to go through every point? (yes or no)', disp='no', chk=['text', ['no', 'n', 'no it does not']], lab='Answer:', svg=fit([('', 5, 20, GOLD)], labels=False)),
 dict(id=20, lvl='target', std='NC.8.SP.2', op='Line of best fit', expr='The line of best fit goes through (2, 30) and (6, 50). Find its slope.', disp='5', chk=['val', 5], lab='slope =', svg=fit([('', 5, 20, GOLD)], mark=[(2, 30), (6, 50)], labels=False)),
 dict(id=21, lvl='target', std='NC.8.SP.2', op='Judge the fit', expr='Is this line a good fit for the data? (yes or no)', disp='no', chk=['text', ['no', 'n', 'not a good fit']], lab='Answer:', svg=fit([('', 5, 35, GOLD)], labels=False)),
 dict(id=22, lvl='advanced', std='NC.8.SP.2', op='Compare two lines', expr='Line A and Line B are drawn on the scatter plot. Which line is the better fit, and why?', disp='Line A. The points are close to it, with some above and some below.',
      chk=['text', ['Line A. The points are close to it, with some above and some below.']], lab='Answer:', svg=fit([('B', 5, 35, RED), ('A', 5, 20, GOLD)]),
      choices=['Line B. It is above all of the points.', 'Line A. The points are close to it, with some above and some below.', 'Line A. It touches every point.', 'They fit the same. Both lines have the same slope.'],
      why={'Line B. It is above all of the points.': 'A good line goes through the MIDDLE of the points. Line B is far from most of them.', 'Line A. It touches every point.': 'Line A is the better fit, but it does not touch every point. A line of best fit only needs to be CLOSE to the points.',
           'They fit the same. Both lines have the same slope.': 'Same slope is not enough. Look at how close the points are to each line.'}),
]
CODES = {
 'unit6-pretest.html': [('NC.8.F.1', 'NC.8.F.1 · NC.8.F.3 · NC.8.F.5'), ('NC.8.F.4', 'NC.8.F.3 · NC.8.F.4 · NC.8.F.5'), ('NC.8.F.2 · NC.8.EE.8', 'NC.8.F.2 · NC.8.F.3 · NC.8.F.5 · NC.8.EE.8')],
 'unit7-pretest.html': [('NC.8.SP.1', 'NC.8.SP.1 · NC.8.SP.2'), ('NC.8.SP.3, NC.8.SP.4', 'NC.8.SP.2, NC.8.SP.3, NC.8.SP.4'), ('NC.8.SP.4', 'NC.8.SP.2 · NC.8.SP.4')],
}
for fn, new in (('unit6-pretest.html', U6), ('unit7-pretest.html', U7)):
    p = os.path.join(G, fn); s = open(p, encoding='utf-8').read()
    a = s.index('const QS=') + 9; b = s.index('\n', a); tail = s[a:b].rstrip(); semi = tail.endswith(';'); QS = json.loads(tail.rstrip(';'))
    ids = {q['id'] for q in new}; QS = [q for q in QS if q['id'] not in ids] + new      # run again = the new questions are written again
    n = 0                                          # the number each question shows: 1..N in the order on the page
    for lvl in ('basic', 'target', 'advanced'):
        for q in QS:
            if q['lvl'] == lvl: n += 1; q['n'] = n
    s = s[:a] + json.dumps(QS, ensure_ascii=False) + (';' if semi else '') + s[b:]
    old = """'<div><span class="n">'+q.id+'.</span>'"""
    if old in s: s = s.replace(old, """'<div><span class="n">'+(q.n||q.id)+'.</span>'""")
    assert "(q.n||q.id)+'.</span>'" in s, fn
    m = re.search(r'const PT_STD=(\{.*?\});', s); std = json.loads(m.group(1))
    for q in new: std[str(q['id'])] = q['std']
    s = s[:m.start(1)] + json.dumps(std) + s[m.end(1):]
    for o_, n_ in CODES[fn]:
        if '<span class="code">%s</span>' % n_ not in s:
            assert s.count('<span class="code">%s</span>' % o_) == 1, (fn, o_); s = s.replace('<span class="code">%s</span>' % o_, '<span class="code">%s</span>' % n_)
    open(p, 'w', encoding='utf-8').write(s); print(fn, len(QS), 'questions')
