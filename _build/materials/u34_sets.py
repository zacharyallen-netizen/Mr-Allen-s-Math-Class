"""Units 3-4 handout sets (Nov 2026), each one sheet front + back, student copy + separate key.
  Set 1  Parallel Lines & Transversals (NC.8.G.5)
  Set 2  Solutions & Inequalities (NC.8.EE.7)
  Set 3  Triangle Interior & Exterior Angles + Equations/Inequalities review (NC.8.G.5, NC.8.EE.7)
    OUT_DIR=/path python3 _build/materials/u34_sets.py
"""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from u34_common import *
from u34_figs import para, cross, tri, numline, X as XI

D = '°'
# ───────── angle-pair rules for the 1–8 numbering (1 UL, 2 UR, 3 LL, 4 LR at m; 5–8 at n) ─────────
REL = {}
for a, b in [(1, 5), (2, 6), (3, 7), (4, 8)]: REL[(a, b)] = 'Corresponding'
for a, b in [(3, 6), (4, 5)]: REL[(a, b)] = 'Alternate Interior'
for a, b in [(1, 8), (2, 7)]: REL[(a, b)] = 'Alternate Exterior'
for a, b in [(3, 5), (4, 6)]: REL[(a, b)] = 'Same-Side Interior'
for a, b in [(1, 7), (2, 8)]: REL[(a, b)] = 'Same-Side Exterior'
for a, b in [(1, 4), (2, 3), (5, 8), (6, 7)]: REL[(a, b)] = 'Vertical'
for a, b in [(1, 2), (3, 4), (1, 3), (2, 4), (5, 6), (7, 8), (5, 7), (6, 8)]: REL[(a, b)] = 'Linear Pair'
EQUAL = {'Corresponding', 'Alternate Interior', 'Alternate Exterior', 'Vertical'}
def rel(a, b): return REL[(min(a, b), max(a, b))]
def acute_group(k): return k in (1, 4, 5, 8)   # same measure group

# ═════════════════════════ SET 1 ═════════════════════════
def set1():
    K = 'Set 1 · NC.8.G.5'
    main = para({i: str(i) for i in range(1, 9)}, w=330, h=195, size=15)
    # FRONT
    p = head(K, 'Parallel Lines &amp; Transversals', 'Name the angle pairs. Use one angle to find them all.')
    p += NAME
    p += ('<div class="goldbox"><b>Equal (congruent):</b> corresponding, alternate interior, alternate exterior, vertical. &nbsp; '
          '<b>Add to 180° (supplementary):</b> same-side interior, same-side exterior, linear pair.<br>'
          '<b>Interior</b> means between the parallel lines. <b>Exterior</b> means outside them. '
          '<b>Alternate</b> means opposite sides of the transversal. <b>Same-side</b> means the same side.</div>')
    p += '<h3 class="sec">Part A: Name the Angle Pair</h3>'
    p += '<p class="dir">Lines <i>m</i> and <i>n</i> are parallel. Line <i>t</i> is a transversal. Use the word bank to name each pair.</p>'
    p += '<div class="wordbank"><b>Word Bank:</b> Corresponding &nbsp;•&nbsp; Alternate Interior &nbsp;•&nbsp; Alternate Exterior &nbsp;•&nbsp; Same-Side Interior &nbsp;•&nbsp; Same-Side Exterior</div>'
    p += f'<div class="fig">{main}</div>'
    pairs = [(1, 5), (4, 5), (2, 7), (3, 5), (1, 7), (3, 6), (2, 6), (4, 6), (1, 8), (2, 8)]
    names = [rel(a, b) for a, b in pairs]
    assert sorted(set(names)) == sorted({'Corresponding', 'Alternate Interior', 'Alternate Exterior', 'Same-Side Interior', 'Same-Side Exterior'})
    assert all(names.count(n) == 2 for n in set(names))
    p += '<table class="pairs">'
    for i in range(0, 10, 2):
        p += '<tr>' + ''.join(f'<td class="n">{j+1}.</td><td class="pr">∠{pairs[j][0]} and ∠{pairs[j][1]}</td>'
                              f'<td><div class="ln" style="margin:0">{fill(names[j])}</div></td>' for j in (i, i + 1)) + '</tr>'
    p += '</table>'
    g = 124   # given m∠3
    meas = {k: (180 - g if acute_group(k) else g) for k in range(1, 9)}
    reason = {1: '∠1 and ∠3: linear pair', 2: '∠2 and ∠3: vertical', 4: '∠3 and ∠4: linear pair', 5: '∠3 and ∠5: same-side int.',
              6: '∠3 and ∠6: alt. interior', 7: '∠3 and ∠7: corresponding', 8: '∠5 and ∠8: vertical'}
    for k, t in reason.items():
        a, b = [int(c) for c in t.split(':')[0].replace('∠', '').split(' and ')]
        r = rel(a, b); ref = g if 3 in (a, b) else meas[a if b == k else b]
        assert (meas[k] == ref) if r in EQUAL else (meas[k] + ref == 180), (k, t)
    p += f'<h3 class="sec">Part B: Use One Angle to Find All Eight</h3>'
    p += f'<p class="dir"><span class="qn">11</span>In the diagram above, <b>m∠3 = {g}°</b>. Find the measure of every other angle. Write the pair you used.</p>'
    p += ('<table class="fill"><tr><th style="width:12%"></th>' + ''.join(f'<th>m∠{k}</th>' for k in range(1, 9)) + '</tr>'
          '<tr><th>Measure</th>' + ''.join(f'<td>{"<b>%d°</b>" % g if k == 3 else "<span class=k>%d°</span>" % meas[k]}</td>' for k in range(1, 9)) + '</tr>'
          '<tr><th>Pair used</th>' + ''.join(f'<td class="r">{"given" if k == 3 else "<span class=k style=font-size:7pt>%s</span>" % reason[k].split(": ")[1]}</td>' for k in range(1, 9)) + '</tr></table>')
    p += '<div class="workbox fillrest" style="margin-top:6px"></div>'
    p += footer('Set 1 · Front', 'Turn over →')
    front = p

    # BACK — 8 problems, 2 × 4, more room
    P = '<i>m</i> ∥ <i>n</i>.'
    probs = [  # (slots dict, plain labels for check, prompt, algebra)
        ({1: ('115', None), 5: (None, 'x')}, 'basic'),
        ({4: ('72', None), 5: (None, 'x')}, 'basic'),
        ({3: ('105', None), 5: (None, 'x')}, 'basic'),
        ({1: ('128', None), 7: (None, 'x')}, 'basic'),
        ({2: ('3x+20', None), 6: ('5x-40', None)}, 'alg'),
        ({3: ('6x-22', None), 6: ('4x+18', None)}, 'alg'),
        ({1: ('4x-8', None), 8: ('2x+26', None)}, 'alg'),
        ({2: ('3x+10', None), 8: ('2x+20', None)}, 'alg'),
    ]
    cells, keyrows = [], []
    for n, (sl, kind) in enumerate(probs, 12):
        (a, (ea, _)), (b, (eb, _)) = sorted((k, v) for k, v in sl.items())
        r = rel(a, b)
        if kind == 'basic':
            g0 = int(ea if ea else eb); xa = g0 if r in EQUAL else 180 - g0
            labels = {a: f'{ea}°' if ea else f'{XI}°', b: f'{eb}°' if eb else f'{XI}°'}
            ans = f'x = {xa}'; eqn = ''
            steps = [f'{r}: angles are {"equal" if r in EQUAL else "supplementary"}', f'{"x = %d" % xa if r in EQUAL else "%d + x = 180 → x = %d" % (g0, xa)}']
            keyrows.append((n, r, f'<i>x</i> = {xa}'))
        else:
            ca, ka = [int(t) for t in ea.replace('-', '+-').split('x+')]
            cb, kb = [int(t) for t in eb.replace('-', '+-').split('x+')]
            if r in EQUAL: res = lin((ca, ka), (cb, kb)); eq = f'{ea} = {eb}'
            else: res = lin((ca + cb, ka + kb), (0, 180)); eq = f'({ea}) + ({eb}) = 180'
            assert res[0] == 'one' and res[1].denominator == 1
            xv = int(res[1]); A, B = ca * xv + ka, cb * xv + kb
            assert (A == B) if r in EQUAL else (A + B == 180) and 0 < A < 180
            labels = {a: f'({mx(ea).replace(X, XI)})°', b: f'({mx(eb).replace(X, XI)})°'}
            angs = f'{A}°' if A == B else f'{A}° and {B}°'
            steps = [mx(eq), f'x = {xv}', f'Angles: {angs}']
            keyrows.append((n, r, f'{mx(eq)} → <i>x</i> = {xv}; angle{"s" if A != B else ""} = {angs}'))
        svg = para(labels, w=300, h=190, size=21 if kind == 'basic' else 19)
        tagh = '<span class="tag b">ONE STEP</span>' if kind == 'basic' else '<span class="tag a">ALGEBRA</span>'
        prm = f'{P} Find <i>x</i>.' if kind == 'basic' else f'{P} Solve for <i>x</i>. Find the angle{"s" if r not in EQUAL else ""}.'
        right = ln('Pair:', r)
        if kind != 'basic': right += ln('Equation:', mx(eq))
        right += work([mx(s) for s in steps[:-1]] if kind != 'basic' else [mx(steps[1])])
        right += ln('<i>x</i> =', fmt(xa) if kind == 'basic' else str(xv))
        if kind != 'basic': right += ln('Angle(s):', angs)
        cells.append(f'<div class="cell"><div style="display:flex;align-items:center"><span class="qn">{n}</span>{tagh}<span style="margin-left:7px;font-size:9.4pt">{prm}</span></div>'
                     f'<div style="display:flex;gap:8px;flex:1;min-height:0;margin-top:3px"><div class="fig" style="width:1.8in;flex:none;display:flex;align-items:center">{svg}</div>'
                     f'<div style="flex:1;display:flex;flex-direction:column;min-width:0">{right}</div></div></div>')
    p = head(K, 'Find the Missing Angles', 'Parallel lines cut by a transversal. Diagrams are not drawn to scale.')
    p += ('<div class="goldbox" style="margin-bottom:5px">Name the pair first. <b>Equal pairs:</b> set the angles equal. '
          '<b>Supplementary pairs:</b> add the angles and set the sum equal to 180.</div>')
    p += '<div class="grid2 fillrest" style="grid-template-rows:repeat(4,minmax(0,1fr))">' + ''.join(cells) + '</div>'
    p += footer('Set 1 · Back')
    css = '.cell .fig svg{width:1.8in;height:auto}'
    html = doc([front, p], 'Set 1 Transversals').replace('</style>', css + '</style>')
    return render(html, 'Set1_Parallel_Lines_Transversals', 2)

# ═════════════════════════ SET 2 ═════════════════════════
def eqcell(n, text, L, R, nocls=False, h=None):
    r = lin(L, R)
    w = {'one': 'one', 'none': 'none', 'inf': 'inf'}[r[0]]
    return r, w

def set2():
    K = 'Set 2 · NC.8.EE.7'
    p = head(K, 'Solutions &amp; Inequalities', 'How many solutions? Then solve and graph inequalities.')
    p += NAME
    p += '<h3 class="sec">Part 1: How Many Solutions Does an Equation Have?</h3>'
    p += ('<div class="goldbox"><b>Steps:</b> (1) Simplify each side: distribute and combine like terms. '
          '(2) Move the variable terms to one side. (3) Look at what is left. It tells you how many solutions there are.</div>')
    samples = [  # title, sym, rule, equation text, sides, worked steps, shortcut
        ('One Solution', '✓', 'The variables do <b>not</b> cancel. You end with <i>x</i> = a number.',
         '5x - 3 = 2x + 9', (5, -3), (2, 9), ['3x - 3 = 9', '3x = 12', 'x = 4'], 'Different <i>x</i>-coefficients'),
        ('No Solution', '✗', 'The variables cancel. You get a <b>false</b> statement.',
         '3(x + 2) = 3x + 1', (3, 6), (3, 1), ['3x + 6 = 3x + 1', '6 = 1 &nbsp;FALSE'], 'Same <i>x</i>-coefficient, different constants'),
        ('Infinitely Many', '∞', 'The variables cancel. You get a <b>true</b> statement.',
         '4x + 8 - x = 3(x + 2) + 2', (3, 8), (3, 8), ['3x + 8 = 3x + 8', '8 = 8 &nbsp;TRUE'], 'Same <i>x</i>-coefficient AND same constant'),
    ]
    want = ['one', 'none', 'inf']
    p += '<div class="three">'
    for (t, sy, rule, eqt, L, R, steps, sc), wnt in zip(samples, want):
        r = lin(L, R); assert r[0] == wnt
        if wnt == 'one': assert r[1] == 4
        p += (f'<div class="card"><div class="hd">{t} <span>{sy}</span></div><div class="bd"><div>{rule}</div>'
              f'<div style="margin-top:4px;font:700 7.5pt Inter;letter-spacing:.06em;color:#5B6475">TRY IT TOGETHER</div>'
              f'<div class="eq" style="font-size:10.5pt">{mx(eqt)}</div>'
              f'<div class="workbox" style="height:1.15in;flex:none"><div class="kw">{"<br>".join(mx(x) for x in steps)}</div></div>'
              f'<div class="res">{sc}</div></div></div>')
    p += '</div>'
    p += '<h3 class="sec">Part 2: Solving and Graphing Inequalities</h3>'
    p += '<div class="twocol"><div>'
    p += ('<table class="sym"><tr><th>Symbol</th><th>Words</th><th>Circle</th></tr>'
          '<tr><td class="big">&lt;</td><td>less than, fewer than</td><td>open ○</td></tr>'
          '<tr><td class="big">&gt;</td><td>greater than, more than</td><td>open ○</td></tr>'
          '<tr><td class="big">≤</td><td>at most, no more than</td><td>closed ●</td></tr>'
          '<tr><td class="big">≥</td><td>at least, no less than</td><td>closed ●</td></tr></table>')
    p += ('<div class="goldbox"><b>Solve it like an equation.</b> Undo adding and subtracting first. Then undo multiplying and dividing. '
          'An open circle means the number is <b>not</b> included. A closed circle means it <b>is</b> included. '
          '<b>Check:</b> put a number from your shaded part back into the original.</div>')
    p += ('<div class="navybox"><b>THE FLIP RULE</b><br>When you <b>multiply or divide by a negative</b> number, <b>flip</b> the inequality sign. '
          'Why? 2 &lt; 5, but −2 &gt; −5. A negative reverses the order.</div>')
    p += '</div><div>'
    def ex(tag, text, steps, mark, extra=''):
        return (f'<div class="example"><span class="t">{tag}</span> <span class="m">{mx(text)}</span>'
                '<div class="steps">' + '<span class="ar">→</span>'.join(f'<span class="s">{s}</span>' for s in steps) + '</div>'
                f'<div class="nl">{numline(-6, 6, w=330, h=40, mark=mark, col="#1E2D4F")}</div>{extra}</div>')
    assert ineq_solve((2, -1), (0, 7), '>') == ('>', 4)
    assert ineq_solve((-3, 5), (0, 17), '<=') == ('>=', -4)
    assert ineq_solve((2, -6), (0, 4), '<') == ('<', 5)
    p += ex('Example A:', '2x - 1 &gt; 7', [mx('2x &gt; 8'), '<b>' + mx('x &gt; 4') + '</b>'], (4, False, 'right'))
    p += ex('Example B:', '-3x + 5 ≤ 17', [mx('-3x ≤ 12'), '÷ (−3), <b>flip!</b>', '<b>' + mx('x ≥ -4') + '</b>'], (-4, True, 'right'))
    p += ex('Example C (distribute first):', '2(x - 3) &lt; 4', [mx('2x - 6 &lt; 4'), mx('2x &lt; 10'), '<b>' + mx('x &lt; 5') + '</b>'], (5, False, 'left'),
            '<div style="font-size:8.4pt;color:#5B6475">Check <i>x</i> = 0: 2(0 − 3) = −6, and −6 &lt; 4 is true. ✓</div>')
    p += '</div></div>'
    p += footer('Set 2 · Front', 'Turn over →')
    front = p

    # BACK
    eqs = [('4x + 7 = 2x + 15', (4, 7), (2, 15), ['2x + 7 = 15', '2x = 8']),
           ('3(x + 4) = 3x + 12', (3, 12), (3, 12), ['3x + 12 = 3x + 12', '12 = 12 TRUE']),
           ('5x - 2 = 5x + 9', (5, -2), (5, 9), ['-2 = 9 FALSE']),
           ('2(3x - 1) = 6x - 5', (6, -2), (6, -5), ['6x - 2 = 6x - 5', '-2 = -5 FALSE']),
           ('7x + 3 - 2x = 5x + 3', (5, 3), (5, 3), ['5x + 3 = 5x + 3', '3 = 3 TRUE']),
           ('4(x - 2) = 2(x + 3)', (4, -8), (2, 6), ['4x - 8 = 2x + 6', '2x = 14'])]
    p = head(K, 'Practice: Solutions &amp; Inequalities', 'Show every step. Check your answers.')
    p += '<h3 class="sec">Part A: One, None, or Infinitely Many?</h3>'
    p += '<p class="dir">Solve each equation. Check the box for the number of solutions. If there is one solution, write it.</p>'
    p += '<div class="grid3" style="grid-template-rows:repeat(2,minmax(0,1fr));flex:1.05;min-height:0">'
    for n, (t, L, R, steps) in enumerate(eqs, 1):
        r = lin(L, R)
        xa = fmt(r[1]) if r[0] == 'one' else ''
        p += (f'<div class="cell"><div><span class="qn">{n}</span><span class="eq">{mx(t)}</span></div>'
              f'{work([mx(s) for s in steps])}{cls_boxes(r[0], True)}{ln("If one solution, <i>x</i> =", xa)}</div>')
    p += '</div>'
    p += '<h3 class="sec">Part B: Solve and Graph Each Inequality</h3>'
    ins = [('3x - 2 ≤ 13', (3, -2), (0, 13), '<=', ['3x ≤ 15']),
           ('-4x &lt; 20', (-4, 0), (0, 20), '<', ['÷ (−4), flip']),
           ('5 - 2x ≥ 11', (-2, 5), (0, 11), '>=', ['-2x ≥ 6', '÷ (−2), flip']),
           ('2(x + 4) &gt; 3x + 6', (2, 8), (3, 6), '>', ['2x + 8 &gt; 3x + 6', '-x &gt; -2', '÷ (−1), flip'])]
    p += '<div class="grid2" style="grid-template-rows:repeat(2,minmax(0,1fr));flex:1;min-height:0">'
    for n, (t, L, R, op, steps) in enumerate(ins, 7):
        o, v = ineq_solve(L, R, op); assert v.denominator == 1
        sol = mx(f'x {SYM[o]} {fmt(v)}')
        mark = (int(v), o in ('<=', '>='), 'right' if o in ('>', '>=') else 'left')
        p += (f'<div class="cell"><div><span class="qn">{n}</span><span class="eq">{mx(t)}</span></div>'
              f'{work([mx(s) for s in steps])}{ln("Solution:", sol)}'
              f'<div class="nl nokey">{numline(-7, 7, w=330, h=38)}</div><div class="nl onlykey">{numline(-7, 7, w=330, h=38, mark=mark)}</div></div>')
    p += '</div>'
    p += footer('Set 2 · Back')
    return render(doc([front, p], 'Set 2 Solutions and Inequalities'), 'Set2_Solutions_Inequalities', 2)

# ═════════════════════════ SET 3 ═════════════════════════
TA, TB, TC = (14, 160), (180, 160), (80, 26)
def tsum(la, lb, lc, size=17, right=False, w=260, wide=False):
    if wide:
        return tri((4, 170), (250, 170), (118, 10), la, lb, lc, size=size, w=254, h=176)
    if right:
        A, B, C = (30, 160), (200, 160), (30, 28)
        return tri(A, B, C, '', lb, lc, right_at=(A, B, C), size=size, w=w)
    return tri(TA, TB, TC, la, lb, lc, size=size, w=w)
def text_(la, lc, ext, lb='', size=17, w=270):
    return tri(TA, TB, TC, la, lb, lc, ext=ext, size=size, w=w)

def set3():
    K = 'Set 3 · NC.8.G.5 · NC.8.EE.7'
    p = head(K, 'Triangle Interior &amp; Exterior Angles', 'Two triangle theorems. Then review equations and inequalities.')
    p += NAME
    A_ = '<tspan font-style="italic">a</tspan>'; B_ = '<tspan font-style="italic">b</tspan>'; C_ = '<tspan font-style="italic">c</tspan>'; D_ = '<tspan font-style="italic">d</tspan>'
    f1 = tsum(f'{A_}°', f'{B_}°', f'{C_}°', size=17, w=230)
    f2 = tri(TA, TB, TC, f'{A_}°', f'{C_}°', f'{B_}°', ext=f'{D_}°', size=17, w=270)
    p += ('<div class="twocol" style="margin-bottom:6px">'
          f'<div class="box" style="display:flex;gap:8px;align-items:center;margin:0"><div class="fig" style="width:1.35in;flex:none">{f1}</div>'
          '<div><h4>Triangle Sum Theorem</h4><div style="font-size:9.3pt">The three <b>interior</b> angles of every triangle add to 180°.</div>'
          '<div class="eq" style="margin-top:3px">' + mx('a + b + c = 180') + '°</div></div></div>'
          f'<div class="box" style="display:flex;gap:8px;align-items:center;margin:0"><div class="fig" style="width:1.5in;flex:none">{f2}</div>'
          '<div><h4>Exterior Angle Theorem</h4><div style="font-size:9.3pt">An <b>exterior angle</b> equals the sum of the two <b>remote interior angles</b> (the two angles that do not touch it).</div>'
          '<div class="eq" style="margin-top:3px">' + mx('d = a + b') + '</div></div></div></div>')
    p += ('<div class="goldbox"><b>Words to know.</b> <b>Interior angle:</b> an angle inside the triangle. '
          '<b>Exterior angle:</b> made when you extend one side of the triangle. '
          '<b>Remote interior angles:</b> the two inside angles far from the exterior angle.<br>'
          '<b>Why it works:</b> <i>c</i> + <i>d</i> = 180 (linear pair) and <i>a</i> + <i>b</i> + <i>c</i> = 180. So <i>d</i> must equal <i>a</i> + <i>b</i>.</div>')
    p += '<h3 class="sec">Try It Together</h3><p class="dir">Work these as a class. Name the theorem. Write an equation. Solve.</p>'
    XS = f'{XI}°'
    samples = [
        (tsum('47°', '68°', XS), 'Find <i>x</i>.', ['Triangle Sum: 47 + 68 + x = 180', '115 + x = 180', 'x = 65'], (47 + 68 + 65 == 180)),
        (text_('52°', '71°', XS), 'Find the exterior angle <i>x</i>.', ['Exterior Angle: x = 52 + 71', 'x = 123'], (52 + 71 == 123)),
        (tsum(f'(2{XI} + 10)°', f'(3{XI})°', '50°', size=15, wide=True), 'Solve for <i>x</i>. Find each angle.',
         ['(2x + 10) + 3x + 50 = 180', '5x + 60 = 180', '5x = 120 → x = 24', 'Angles: 58°, 72°, 50°'], (2*24+10 + 3*24 + 50 == 180)),
        (text_('40°', f'(2{XI})°', f'(3{XI} + 5)°', size=16), 'Solve for <i>x</i>. Find the exterior angle.',
         ['3x + 5 = 40 + 2x', 'x + 5 = 40 → x = 35', 'Exterior angle: 110°'], (3*35 + 5 == 40 + 2*35 == 110)),
    ]
    assert all(c for *_, c in samples)
    p += '<div class="grid2 fillrest" style="grid-template-rows:repeat(2,minmax(0,1fr))">'
    for i, (svg, prm, steps, _) in enumerate(samples):
        p += (f'<div class="cell"><div><span class="qn">{"ABCD"[i]}</span><span style="font-size:9.4pt">{prm}</span></div>'
              f'<div style="display:flex;gap:8px;flex:1;min-height:0;margin-top:3px"><div class="fig" style="width:2.0in;flex:none;display:flex;align-items:center">{svg}</div>'
              f'<div style="flex:1;display:flex;flex-direction:column">{work([mx(s) for s in steps])}</div></div></div>')
    p += '</div>' + footer('Set 3 · Front', 'Turn over →')
    front = p

    # BACK
    p = head(K, 'Practice: Triangles + Review', 'Part A: triangle theorems. Part B: equations and inequalities review.')
    p += '<h3 class="sec">Part A: Find the Missing Angle</h3><p class="dir">Diagrams are not drawn to scale.</p>'
    tris = [
        (tsum('38°', '85°', XS), 'Find <i>x</i>.', ['38 + 85 + x = 180'], 'x = 57', 38 + 85 + 57 == 180),
        (tsum('', '27°', XS, right=True), 'Find <i>x</i>.', ['90 + 27 + x = 180'], 'x = 63', 90 + 27 + 63 == 180),
        (text_('46°', '59°', XS), 'Find <i>x</i>.', ['x = 46 + 59'], 'x = 105', 46 + 59 == 105),
        (text_('65°', XS, '140°'), 'Find <i>x</i>.', ['140 = 65 + x'], 'x = 75', 65 + 75 == 140),
        (tsum(f'({XI} + 15)°', f'(2{XI})°', f'({XI} + 25)°', size=15, wide=True), 'Solve for <i>x</i>. Find each angle.',
         ['(x + 15) + 2x + (x + 25) = 180', '4x + 40 = 180'], 'x = 35; 50°, 70°, 60°', 35+15 + 70 + 35+25 == 180),
        (text_('35°', f'(2{XI} + 15)°', f'(4{XI} − 10)°', size=16), 'Solve for <i>x</i>. Find the exterior ∠.',
         ['4x - 10 = 35 + (2x + 15)', '2x = 60'], 'x = 30; exterior = 110°', 4*30 - 10 == 35 + 2*30 + 15 == 110),
    ]
    assert all(t[-1] for t in tris)
    p += '<div class="grid3" style="grid-template-rows:repeat(2,minmax(0,1fr));flex:1.15;min-height:0">'
    for n, (svg, prm, steps, ans, _) in enumerate(tris, 1):
        p += (f'<div class="cell"><div><span class="qn">{n}</span><span style="font-size:9.2pt">{prm}</span></div>'
              f'<div class="fig" style="height:1.05in">{svg}</div>{work([mx(s) for s in steps])}{ln("Answer:", mx(ans))}</div>')
    p += '</div>'
    p += '<h3 class="sec">Part B: Review — Equations and Inequalities</h3>'
    r7 = lin((6, -15), (4, 1)); assert r7 == ('one', 8)
    r8 = lin((4, 2), (4, 2)); assert r8 == ('inf',)
    o9 = ineq_solve((-3, 4), (0, 19), '>'); assert o9 == ('<', -5)
    o10 = ineq_solve((F(1, 2), 1), (0, 4), '<='); assert o10 == ('<=', 6)
    half = '<span class="frac"><span><i>x</i></span><span>2</span></span>'
    cells = [
        (7, mx('3(2x - 5) = 4x + 1'), work([mx('6x - 15 = 4x + 1'), mx('2x = 16')]) + cls_boxes('one') + ln('If one solution, <i>x</i> =', '8'), ''),
        (8, mx('6x + 2 - 2x = 4(x + 1) - 2'), work([mx('4x + 2 = 4x + 2'), '2 = 2 TRUE']) + cls_boxes('inf') + ln('If one solution, <i>x</i> =', ''), ''),
        (9, mx('-3x + 4 &gt; 19'), work([mx('-3x &gt; 15'), '÷ (−3), flip']) + ln('Solution:', mx('x &lt; -5')), (-5, False, 'left')),
        (10, half + ' + 1 ≤ 4', work([half + ' ≤ 3', '× 2']) + ln('Solution:', mx('x ≤ 6')), (6, True, 'left')),
    ]
    p += '<div class="grid2" style="grid-template-rows:repeat(2,minmax(0,1fr));flex:1;min-height:0">'
    for n, e, body, mark in cells:
        nl = (f'<div class="nl nokey">{numline(-7, 7, w=330, h=38)}</div><div class="nl onlykey">{numline(-7, 7, w=330, h=38, mark=mark)}</div>') if mark else ''
        p += f'<div class="cell"><div><span class="qn">{n}</span><span class="eq">{e}</span></div>{body}{nl}</div>'
    p += '</div>' + footer('Set 3 · Back')
    css = '.cell .fig svg{max-width:100%;height:100%;width:auto}.box .fig svg{width:100%;height:auto}'
    return render(doc([front, p], 'Set 3 Triangles').replace('</style>', css + '</style>'), 'Set3_Triangle_Theorems_Review', 2)

if __name__ == '__main__':
    for f in sys.argv[1:] or ['set1']:
        print(globals()[f]())
