"""Units 3-4 Notes Packet (Nov 2026): four two-sided sheets, student copy + separate key, all answers checked here.
  Notes 1  Angles Formed by Parallel Lines (NC.8.G.5): label the five pairs; back = missing angles / values
  Notes 2  Solutions & Inequalities (NC.8.EE.7): none / one / infinitely many; solve + graph; back = mix + error analysis
  Notes 3  Triangle Sum & Exterior Angle Theorems (NC.8.G.5); back = missing angles / values
  Notes 4  Word Problems: Equations & Inequalities (NC.8.EE.7): word bank, strategies, tips; back = 6 problems
    sh _build/materials/get_fonts.sh
    OUT_DIR=/path python3 _build/materials/u34_notes.py            # builds all four + the combined packet
"""
import sys, os, subprocess
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from u34_common import *
from u34_figs import para, tri, numline, X as XI
from u34_sets import REL, EQUAL, rel, TA, TB, TC, tsum, text_

D = '°'
XS = f'{XI}°'
OBTUSE = (2, 3, 6, 7)
# roomier triangles for long labels like (x + 12)°
def wide3(la, lb, lc, size=15):
    return tri((6, 172), (286, 172), (140, 12), la, lb, lc, size=size, w=292, h=182)
def ext3(la, lc, ext, size=15):
    return tri((10, 196), (232, 196), (120, 24), la, '', lc, ext=ext, size=size, w=345, h=210)          # in the drawing, slots 2, 3, 6, 7 look obtuse and 1, 4, 5, 8 look acute

def lin_of(e):
    """'7x-15' → (7, -15)"""
    import re as _re
    m = _re.fullmatch(r'(-?\d*)x([+-]\d+)?', e.replace('−', '-').replace(' ', ''))
    c = m.group(1); return (int(c) if c not in ('', '-') else (1 if c == '' else -1)), int(m.group(2) or 0)

def angle_ok(slot, v):
    assert 0 < v < 180 and v != 90, (slot, v)
    assert (v > 90) == (slot in OBTUSE), f'slot {slot} = {v}° would not match the drawing'

def choices(opts, right, cols=2):
    cells = ''.join(f'<div class="ch"><span class="bx{" kon" if i in right else ""}"></span><b>{"ABCDEFG"[i]}</b>&nbsp;{o}</div>' for i, o in enumerate(opts))
    return f'<div class="chs" style="grid-template-columns:repeat({cols},1fr)">{cells}</div>'

EXTRA_CSS = '''
.chs{display:grid;gap:4px 10px;margin-top:5px;font-size:9.6pt}
.ch .bx{display:inline-block;width:12px;height:12px;border:1.3px solid var(--navy);border-radius:50%;vertical-align:-2px;margin-right:4px}
body.key .ch .bx.kon{background:var(--ok);border-color:var(--ok)}
table.lab{width:100%;border-collapse:collapse;font-size:9.4pt}
table.lab th{background:var(--navy);color:#fff;font:600 8.6pt var(--sans);text-align:left;padding:4px 6px}
table.lab td{border-bottom:1px solid var(--line2);padding:3px 6px;vertical-align:middle}
table.lab td.pn{font-weight:700;color:var(--navy);width:25%}
table.lab td.pn small{display:block;font-weight:500;color:var(--muted);font-size:8pt}
table.lab td.wh{width:31%;font-size:8.8pt}
table.lab .fill.sm{flex:0 0 .42in}
table.lab .ln{margin:0}
.student{border:1.3px solid var(--gold-line);background:#FFFDF5;border-radius:8px;padding:4px 10px;font:600 10.5pt/1.55 var(--serif);color:var(--navy)}
.student .who{font:700 7.5pt var(--sans);letter-spacing:.06em;color:var(--muted);display:block}
.wb{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin:3px 0 6px}
.wb .op{border:1.3px solid var(--navy);border-radius:8px;overflow:hidden;font-size:8.8pt;line-height:1.35}
.wb .op .h{background:var(--navy);color:#fff;font:600 10pt var(--serif);padding:2px 8px;display:flex;justify-content:space-between}
.wb .op .h span{color:var(--gold);font-family:var(--mono)}
.wb .op .b{padding:4px 8px}
ol.strat{margin:0;padding-left:20px;font-size:9.3pt;line-height:1.45}
ol.strat li{margin:1px 0}
.tips{font-size:9.1pt;line-height:1.45;margin:0;padding-left:16px}
.tips li{margin:2px 0}
.cell .fig svg{max-width:100%;height:100%;width:auto}
.box .fig svg{width:100%;height:auto}
'''

def page_doc(pages, title):
    return doc(pages, title).replace('</style>', EXTRA_CSS + '</style>')

# ═════════════════════════ NOTES 1: PARALLEL LINES ═════════════════════════
def notes1():
    K = 'Notes 1 · NC.8.G.5'
    p = head(K, 'Angles Formed by Parallel Lines', 'A transversal crosses two parallel lines and makes 8 angles. Name the pairs.')
    p += NAME
    p += ('<div class="goldbox"><b>Transversal:</b> a line that crosses two or more lines. The arrows (&gt;&gt;) show the lines are <b>parallel</b>.<br>'
          '<b>Interior</b> = between the parallel lines. &nbsp;<b>Exterior</b> = outside them. &nbsp;'
          '<b>Alternate</b> = opposite sides of the transversal. &nbsp;<b>Same-side</b> = the same side.<br>'
          '<b>Also:</b> vertical angles are <b>equal</b>. A linear pair <b>adds to 180°</b>.</div>')
    p += '<h3 class="sec">Part A: Label the Angle Pairs</h3>'
    big = para({i: str(i) for i in range(1, 9)}, w=290, h=175, size=14)
    rows = [('Corresponding', '', 'Same spot at each crossing (same corner)', (1, 5)),
            ('Alternate Interior', '', 'Between the lines, opposite sides of <i>t</i>', (4, 5)),
            ('Alternate Exterior', '', 'Outside the lines, opposite sides of <i>t</i>', (1, 8)),
            ('Same-Side Interior', 'also called Consecutive Interior', 'Between the lines, same side of <i>t</i>', (3, 5)),
            ('Same-Side Exterior', 'also called Consecutive Exterior', 'Outside the lines, same side of <i>t</i>', (1, 7))]
    for nm, _, _, (a, b) in rows: assert rel(a, b) == nm
    p += (f'<div style="display:flex;gap:10px;align-items:center"><div class="fig" style="flex:none">{big}</div>'
          '<div style="font-size:9.4pt;line-height:1.5"><b>Lines <i>m</i> ∥ <i>n</i>. Line <i>t</i> is the transversal.</b><br>'
          '1. Lightly shade the <b>interior</b> (the space between <i>m</i> and <i>n</i>).<br>'
          '2. For each pair below, write one example from the diagram.<br>'
          '3. Decide: are the two angles <b>equal</b>, or do they <b>add to 180°</b>?</div></div>')
    p += '<table class="lab"><tr><th>Angle pair</th><th>Where to look</th><th>Example pair</th><th>Equal or add to 180°?</th></tr>'
    for nm, aka, wh, (a, b) in rows:
        how = 'Equal' if nm in EQUAL else 'Add to 180°'
        p += (f'<tr><td class="pn">{nm}{"<small>" + aka + "</small>" if aka else ""}</td><td class="wh">{wh}</td>'
              f'<td><div class="ln" style="margin:0">∠{fill(str(a), "sm")} and ∠{fill(str(b), "sm")}</div></td><td>{ln("", how)}</td></tr>')
    p += '</table>'
    p += ('<p class="onlykey" style="font-size:8pt;margin:3px 0 0;color:#15803D">Any correct pair counts. Corresponding: 1&amp;5, 2&amp;6, 3&amp;7, 4&amp;8. '
          'Alt. interior: 3&amp;6, 4&amp;5. Alt. exterior: 1&amp;8, 2&amp;7. Same-side interior: 3&amp;5, 4&amp;6. Same-side exterior: 1&amp;7, 2&amp;8.</p>')

    # Try it together (blank for students, worked on the key)
    g = 115   # m∠6
    meas = {k: (g if k in OBTUSE else 180 - g) for k in range(1, 9)}
    for k in range(1, 9): angle_ok(k, meas[k])
    ask = [(3, 'alternate interior with ∠6'), (2, 'corresponding with ∠6'), (5, 'linear pair with ∠6'), (4, 'alternate interior with ∠5')]
    for k, why in ask:
        other = 6 if '∠6' in why else 5
        r = rel(k, other) if 'linear' not in why else 'Linear Pair'
        assert (meas[k] == meas[other]) if r in EQUAL else (meas[k] + meas[other] == 180)
    ea, eb = '5x-22', '3x+18'           # ∠4 and ∠5: alternate interior
    assert rel(4, 5) == 'Alternate Interior'
    r = lin(lin_of(ea), lin_of(eb)); assert r == ('one', 20); A1 = 5 * 20 - 22; angle_ok(4, A1); angle_ok(5, 3 * 20 + 18); assert A1 == 78
    ec, ed = '4x-10', '2x+10'           # ∠3 and ∠5: same-side interior
    assert rel(3, 5) == 'Same-Side Interior'
    r2 = lin((6, 0), (0, 180)); assert r2 == ('one', 30); angle_ok(3, 4 * 30 - 10); angle_ok(5, 2 * 30 + 10)
    fB = para({4: f'({mx(ea).replace(X, XI)})°', 5: f'({mx(eb).replace(X, XI)})°'}, w=260, h=180, size=17)
    fC = para({3: f'({mx(ec).replace(X, XI)})°', 5: f'({mx(ed).replace(X, XI)})°'}, w=260, h=180, size=17)
    p += '<h3 class="sec">Try It Together</h3>'
    p += '<div class="grid3 fillrest" style="grid-template-rows:minmax(0,1fr)">'
    p += ('<div class="cell"><div><span class="qn">A</span><span style="font-size:9.2pt">Use the big diagram. <b>m∠6 = 115°.</b> Find each angle and name the pair.</span></div>'
          + ''.join(ln(f'm∠{k} =', f'{meas[k]}° ({why.split(" with")[0]})') for k, why in ask) + '</div>')
    p += ('<div class="cell"><div><span class="qn">B</span><span style="font-size:9.2pt">Solve for <i>x</i>. Find the angle.</span></div>'
          f'<div class="fig" style="height:1.0in">{fB}</div>{work([mx("Alt. interior → equal"), mx("5x - 22 = 3x + 18"), mx("2x = 40 → x = 20"), "Angle: 78°"])}</div>')
    p += ('<div class="cell"><div><span class="qn">C</span><span style="font-size:9.2pt">Solve for <i>x</i>. Find both angles.</span></div>'
          f'<div class="fig" style="height:1.0in">{fC}</div>{work([mx("Same-side int. → add to 180"), mx("(4x - 10) + (2x + 10) = 180"), mx("6x = 180 → x = 30"), "110° and 70°"])}</div>')
    p += '</div>' + footer('Notes 1 · Front', 'Turn over →')
    front = p

    # BACK: 9 diagram problems + 1 select-all
    P = '<i>m</i> ∥ <i>n</i>.'
    probs = [({2: '116', 6: None}, 'basic'), ({3: '118', 6: None}, 'basic'), ({4: '71', 6: None}, 'basic'),
             ({2: '137', 7: None}, 'basic'), ({1: '53', 7: None}, 'basic'),
             ({1: '7x-15', 5: '5x+11'}, 'alg'), ({4: '2x+28', 5: '3x+8'}, 'alg'), ({3: '3x+5', 5: '2x+15'}, 'alg'), ({1: '6x-4', 8: '4x+22'}, 'alg')]
    cells = []
    for n, (sl, kind) in enumerate(probs, 1):
        (a, ea), (b, eb) = sorted(sl.items())
        r = rel(a, b)
        if kind == 'basic':
            gv = int(ea or eb); known = a if ea else b; unk = b if ea else a
            xa = gv if r in EQUAL else 180 - gv
            angle_ok(known, gv); angle_ok(unk, xa)
            labels = {a: f'{ea}°' if ea else XS, b: f'{eb}°' if eb else XS}
            right = ln('Pair:', r) + work([mx(f'x = {xa}') if r in EQUAL else mx(f'{gv} + x = 180 → x = {xa}')]) + ln('<i>x</i> =', str(xa))
            prm = f'{P} Name the pair. Find <i>x</i>.'
        else:
            ca, ka = lin_of(ea); cb, kb = lin_of(eb)
            if r in EQUAL: res = lin((ca, ka), (cb, kb)); eq = f'{ea} = {eb}'
            else: res = lin((ca + cb, ka + kb), (0, 180)); eq = f'({ea}) + ({eb}) = 180'
            assert res[0] == 'one' and res[1].denominator == 1
            xv = int(res[1]); A, B = ca * xv + ka, cb * xv + kb
            angle_ok(a, A); angle_ok(b, B)
            assert (A == B) if r in EQUAL else (A + B == 180)
            labels = {a: f'({mx(ea).replace(X, XI)})°', b: f'({mx(eb).replace(X, XI)})°'}
            angs = f'{A}°' if A == B else f'{A}° and {B}°'
            right = ln('Pair:', r) + ln('Equation:', mx(eq)) + work([]) + ln('<i>x</i> =', str(xv)) + ln('Angle(s):', angs)
            prm = f'{P} Solve for <i>x</i>. Find the angle{"s" if r not in EQUAL else ""}.'
        svg = para(labels, w=300, h=190, size=21 if kind == 'basic' else 19)
        cells.append(f'<div class="cell"><div style="display:flex;align-items:center"><span class="qn">{n}</span>'
                     f'<span style="font-size:9pt">{prm}</span></div>'
                     f'<div style="display:flex;gap:8px;flex:1;min-height:0;margin-top:2px"><div class="fig" style="width:1.55in;flex:none;display:flex;align-items:center">{svg}</div>'
                     f'<div style="flex:1;display:flex;flex-direction:column;min-width:0">{right}</div></div></div>')
    # 10: select all (uses its own small diagram)
    g10 = 48; same = sorted(k for k in range(1, 9) if k != 5 and (k in OBTUSE) == (5 in OBTUSE)); assert same == [1, 4, 8]
    opts = [f'∠{k}' for k in (1, 2, 3, 4, 6, 7, 8)]
    right10 = [i for i, k in enumerate((1, 2, 3, 4, 6, 7, 8)) if k in same]
    svg10 = para({i: str(i) for i in range(1, 9)}, w=300, h=190, size=17)
    cells.append(f'<div class="cell"><div style="display:flex;align-items:center"><span class="qn">10</span>'
                 f'<span style="font-size:9pt">{P} m∠5 = {g10}°. <b>Select ALL</b> the angles that measure {g10}°.</span></div>'
                 f'<div style="display:flex;gap:8px;flex:1;min-height:0;margin-top:2px"><div class="fig" style="width:1.55in;flex:none;display:flex;align-items:center">{svg10}</div>'
                 f'<div style="flex:1">{choices(opts, right10, 2)}</div></div></div>')
    p = head(K, 'Practice: Find the Missing Angles', 'Parallel lines cut by a transversal. Diagrams are not drawn to scale.')
    p += ('<div class="goldbox" style="margin-bottom:5px">Name the pair first. <b>Equal pairs:</b> set the angles equal. '
          '<b>Add-to-180° pairs:</b> add the two angles and set the sum equal to 180.</div>')
    p += '<div class="grid2 fillrest" style="grid-template-rows:repeat(5,minmax(0,1fr))">' + ''.join(cells) + '</div>'
    p += footer('Notes 1 · Back')
    css = '.cell .fig svg{width:1.55in;height:auto;max-height:100%}'
    html = page_doc([front, p], 'Notes 1 Parallel Lines').replace('</style>', css + '</style>')
    return render(html, 'Notes1_Parallel_Lines_Transversals', 2)

# ═════════════════════════ NOTES 2: SOLUTIONS & INEQUALITIES ═════════════════════════
def nl_pair(mark):
    return (f'<div class="nl nokey">{numline(-7, 7, w=330, h=38)}</div>'
            f'<div class="nl onlykey">{numline(-7, 7, w=330, h=38, mark=mark)}</div>')

def mark_of(o, v):
    return (int(v), o in ('<=', '>='), 'right' if o in ('>', '>=') else 'left')

def notes2():
    K = 'Notes 2 · NC.8.EE.7'
    p = head(K, 'Solutions &amp; Inequalities', 'How many solutions does an equation have? How do you solve and graph an inequality?')
    p += NAME
    p += '<h3 class="sec">Part 1: No Solution, One Solution, or Infinitely Many?</h3>'
    p += ('<div class="goldbox"><b>Steps:</b> (1) Simplify each side: distribute and combine like terms. '
          '(2) Get the <i>x</i>-terms on one side. (3) Look at what is left.</div>')
    cards = [('One Solution', '1', 'The <i>x</i>-terms do <b>not</b> cancel. You end with <i>x</i> = a number.',
              '6x + 5 = 2x - 7', (6, 5), (2, -7), ['4x + 5 = -7', '4x = -12', 'x = -3'], 'Different numbers of <i>x</i>', 'one'),
             ('No Solution', '∅', 'The <i>x</i>-terms cancel. What is left is <b>false</b>.',
              '2(4x - 3) = 8x + 1', (8, -6), (8, 1), ['8x - 6 = 8x + 1', '-6 = 1 FALSE'], 'Same <i>x</i>-terms, different numbers', 'none'),
             ('Infinitely Many', '∞', 'The <i>x</i>-terms cancel. What is left is <b>true</b>.',
              '5x - 4 + x = 2(3x - 2)', (6, -4), (6, -4), ['6x - 4 = 6x - 4', '-4 = -4 TRUE'], 'Same <i>x</i>-terms AND same numbers', 'inf')]
    p += '<div class="three">'
    for t, sy, rule, eqt, L, R, steps, sc, want in cards:
        res = lin(L, R); assert res[0] == want
        if want == 'one': assert res[1] == -3
        p += (f'<div class="card"><div class="hd">{t} <span>{sy}</span></div><div class="bd"><div>{rule}</div>'
              f'<div style="margin-top:4px;font:700 7.5pt Inter;letter-spacing:.06em;color:#5B6475">TRY IT TOGETHER</div>'
              f'<div class="eq" style="font-size:10.5pt">{mx(eqt)}</div>'
              f'<div class="workbox" style="height:1.0in;flex:none"><div class="kw">{"<br>".join(mx(x) for x in steps)}</div></div>'
              f'<div class="res">Clue: {sc}</div></div></div>')
    p += '</div>'
    p += '<h3 class="sec">Part 2: Solving and Graphing Inequalities</h3>'
    p += '<div class="twocol fillrest"><div>'
    p += ('<table class="sym"><tr><th>Symbol</th><th>Words</th><th>Circle</th></tr>'
          '<tr><td class="big">&lt;</td><td>less than, fewer than</td><td>open ○</td></tr>'
          '<tr><td class="big">&gt;</td><td>greater than, more than</td><td>open ○</td></tr>'
          '<tr><td class="big">≤</td><td>at most, no more than</td><td>closed ●</td></tr>'
          '<tr><td class="big">≥</td><td>at least, no less than</td><td>closed ●</td></tr></table>')
    p += ('<div class="goldbox"><b>Solve it like an equation.</b> Undo + and − first, then × and ÷. '
          '<b>Open circle</b> = the number is not a solution. <b>Closed circle</b> = it is. '
          'Shade toward the solutions. <b>Check:</b> test a number from the shaded part.</div>')
    p += ('<div class="navybox"><b>THE FLIP RULE</b><br>When you <b>multiply or divide both sides by a negative</b>, '
          '<b>flip</b> the sign. Example: 2 &lt; 5, but −2 &gt; −5.</div>')
    p += '</div><div style="display:flex;flex-direction:column;gap:5px">'
    exs = [('A', '4x + 3 &lt; 19', (4, 3), (0, 19), '<', ['4x &lt; 16', 'x &lt; 4']),
           ('B', '7 - 3x ≥ 19', (-3, 7), (0, 19), '>=', ['-3x ≥ 12', '÷ (−3), flip!', 'x ≤ -4']),
           ('C', '3(x - 2) &gt; 2x - 4', (3, -6), (2, -4), '>', ['3x - 6 &gt; 2x - 4', 'x - 6 &gt; -4', 'x &gt; 2'])]
    for tag, t, L, R, op, steps in exs:
        o, v = ineq_solve(L, R, op)
        assert mx(f'x {SYM[o]} {fmt(v)}') == mx(steps[-1]), (t, o, v)
        p += (f'<div class="cell" style="flex:1"><div><span class="qn">{tag}</span><span class="eq">{mx(t)}</span></div>'
              f'<div class="workbox" style="min-height:.5in"><div class="kw">{" → ".join(mx(s) for s in steps)}</div></div>{nl_pair(mark_of(o, v))}</div>')
    p += '</div></div>' + footer('Notes 2 · Front', 'Turn over →')
    front = p

    # BACK
    p = head(K, 'Practice: Solutions &amp; Inequalities', 'Show every step. Check your answers.')
    p += '<h3 class="sec">Part A: How Many Solutions?</h3>'
    p += '<p class="dir">Solve. Check the box for the number of solutions. If there is one solution, write it.</p>'
    eqs = [('3x + 8 = 3x - 2', (3, 8), (3, -2), 'none'), ('2(x + 5) = 2x + 10', (2, 10), (2, 10), 'inf'),
           ('7x - 9 = 4x + 6', (7, -9), (4, 6), 'one'), ('5(x + 2) = 3x + 4', (5, 10), (3, 4), 'one')]
    p += '<div class="grid2" style="grid-template-rows:repeat(2,minmax(0,1fr));flex:1;min-height:0">'
    for n, (t, L, R, want) in enumerate(eqs, 1):
        r = lin(L, R); assert r[0] == want
        xa = fmt(r[1]) if want == 'one' else ''
        p += (f'<div class="cell"><div><span class="qn">{n}</span><span class="eq">{mx(t)}</span></div>'
              f'{work([])}{cls_boxes(want)}{ln("If one solution, <i>x</i> =", xa)}</div>')
    p += '</div>'
    mc = [('2x + 3 = 2x + 3', (2, 3), (2, 3)), ('4x - 1 = 4x + 5', (4, -1), (4, 5)), ('3x + 1 = x + 5', (3, 1), (1, 5)), ('6x = 0', (6, 0), (0, 0))]
    kinds = [lin(L, R)[0] for _, L, R in mc]; assert kinds.count('none') == 1
    p += (f'<div class="cell" style="margin-top:6px;flex:none"><div><span class="qn">5</span>Which equation has <b>no solution</b>?</div>'
          f'{choices([mx(t) for t, _, _ in mc], [kinds.index("none")], 4)}</div>')
    p += '<h3 class="sec">Part B: Solve and Graph</h3>'
    ins = [('5x - 4 ≥ 11', (5, -4), (0, 11), '>='), ('-5x &lt; 20', (-5, 0), (0, 20), '<'),
           ('10 - 3x &gt; 4', (-3, 10), (0, 4), '>'), ('4(x - 1) ≥ 6x + 2', (4, -4), (6, 2), '>=')]
    want = [('>=', 3), ('>', -4), ('<', 2), ('<=', -3)]
    p += '<div class="grid2" style="grid-template-rows:repeat(2,minmax(0,1fr));flex:1.15;min-height:0">'
    for n, ((t, L, R, op), w) in enumerate(zip(ins, want), 6):
        o, v = ineq_solve(L, R, op); assert (o, v) == w, (t, o, v)
        p += (f'<div class="cell"><div><span class="qn">{n}</span><span class="eq">{mx(t)}</span></div>'
              f'{work([])}{ln("Solution:", mx(f"x {SYM[o]} {fmt(v)}"))}{nl_pair(mark_of(o, v))}</div>')
    p += '</div>'
    # Error analysis
    o10, v10 = ineq_solve((-2, 5), (0, 11), '>'); assert (o10, v10) == ('<', -3)
    p += '<h3 class="sec">Part C: Find the Error</h3>'
    p += ('<div class="cell" style="flex:none"><div style="display:flex;gap:10px;align-items:flex-start"><div style="flex:none">'
          '<span class="qn">10</span></div><div style="flex:1">Jordan solved this inequality. Find the mistake and fix it.'
          '<div style="display:flex;gap:12px;margin-top:4px;align-items:stretch"><div class="student" style="flex:none">'
          '<span class="who">JORDAN\'S WORK</span>' + mx('-2x + 5 &gt; 11') + '<br>' + mx('-2x &gt; 6') + '<br>' + mx('x &gt; -3') + '</div>'
          '<div style="flex:1;display:flex;flex-direction:column">' + ln('The mistake:', 'Divided by −2 but did not flip the sign') +
          ln('Correct answer:', mx('x &lt; -3')) + nl_pair(mark_of(o10, v10)) + '</div></div></div></div></div>')
    p += footer('Notes 2 · Back')
    return render(page_doc([front, p], 'Notes 2 Solutions and Inequalities'), 'Notes2_Solutions_Inequalities', 2)

# ═════════════════════════ NOTES 3: TRIANGLE THEOREMS ═════════════════════════
def notes3():
    K = 'Notes 3 · NC.8.G.5'
    p = head(K, 'Triangle Angle Theorems', 'The Triangle Sum Theorem and the Exterior Angle Theorem.')
    p += NAME
    A_, B_, C_, D_ = ('<tspan font-style="italic">%s</tspan>' % c for c in 'abcd')
    f1 = tsum(f'{A_}°', f'{B_}°', f'{C_}°', size=17, w=230)
    f2 = tri(TA, TB, TC, f'{A_}°', f'{C_}°', f'{B_}°', ext=f'{D_}°', size=17, w=270)
    p += ('<div class="twocol" style="margin-bottom:6px">'
          f'<div class="box" style="display:flex;gap:8px;align-items:center;margin:0"><div class="fig" style="width:1.35in;flex:none">{f1}</div>'
          '<div><h4>Triangle Sum Theorem</h4><div style="font-size:9.3pt">The three <b>interior</b> angles of any triangle add up to <b>180°</b>.</div>'
          '<div class="eq" style="margin-top:3px">' + mx('a + b + c = 180') + '°</div></div></div>'
          f'<div class="box" style="display:flex;gap:8px;align-items:center;margin:0"><div class="fig" style="width:1.5in;flex:none">{f2}</div>'
          '<div><h4>Exterior Angle Theorem</h4><div style="font-size:9.3pt">An <b>exterior angle</b> equals the <b>sum</b> of the two <b>remote interior angles</b>.</div>'
          '<div class="eq" style="margin-top:3px">' + mx('d = a + b') + '</div></div></div></div>')
    p += ('<div class="goldbox"><b>Interior angle:</b> inside the triangle. <b>Exterior angle:</b> made by extending one side. '
          '<b>Remote interior angles:</b> the two inside angles that do <b>not</b> touch the exterior angle.<br>'
          '<b>Why it works:</b> <i>c</i> + <i>d</i> = 180 (a linear pair) and <i>a</i> + <i>b</i> + <i>c</i> = 180. So <i>d</i> = <i>a</i> + <i>b</i>.</div>')
    p += ('<div class="navybox"><b>WHICH THEOREM?</b> All three angles are <b>inside</b> → add them and set equal to <b>180</b>. '
          'An angle is <b>outside</b> → it equals the <b>two far inside angles</b> added together.</div>')
    p += '<h3 class="sec">Try It Together</h3><p class="dir">Name the theorem. Write an equation. Solve. Diagrams are not drawn to scale.</p>'
    samples = [
        (tsum('54°', '79°', XS), 'Find <i>x</i>.', ['Triangle Sum: 54 + 79 + x = 180', '133 + x = 180', 'x = 47'], 54 + 79 + 47 == 180),
        (text_('38°', '64°', XS), 'Find the exterior angle <i>x</i>.', ['Exterior Angle: x = 38 + 64', 'x = 102'], 38 + 64 == 102),
        (wide3(f'(3{XI} − 5)°', f'(2{XI} + 10)°', '75°'), 'Solve for <i>x</i>. Find each angle.',
         ['(3x - 5) + (2x + 10) + 75 = 180', '5x + 80 = 180', '5x = 100 → x = 20', 'Angles: 55°, 50°, 75°'], 3*20-5 + 2*20+10 + 75 == 180),
        (ext3(f'({XI} + 20)°', '45°', f'(3{XI} − 5)°'), 'Solve for <i>x</i>. Find the exterior angle.',
         ['3x - 5 = 45 + (x + 20)', '3x - 5 = x + 65', '2x = 70 → x = 35', 'Exterior angle: 100°'], 3*35 - 5 == 45 + 35 + 20 == 100),
    ]
    assert all(s[-1] for s in samples)
    p += '<div class="grid2 fillrest" style="grid-template-rows:repeat(2,minmax(0,1fr))">'
    for i, (svg, prm, steps, _) in enumerate(samples):
        p += (f'<div class="cell"><div><span class="qn">{"ABCD"[i]}</span><span style="font-size:9.4pt">{prm}</span></div>'
              f'<div style="display:flex;gap:8px;flex:1;min-height:0;margin-top:3px"><div class="fig" style="width:2.0in;flex:none;display:flex;align-items:center">{svg}</div>'
              f'<div style="flex:1;display:flex;flex-direction:column">{work([mx(s) for s in steps])}</div></div></div>')
    p += '</div>' + footer('Notes 3 · Front', 'Turn over →')
    front = p

    # BACK
    p = head(K, 'Practice: Find the Missing Angles', 'Name the theorem. Write an equation. Solve. Diagrams are not drawn to scale.')
    probs = [
        (tsum('61°', '74°', XS), 'Find <i>x</i>.', 'x = 45', 61 + 74 + 45 == 180),
        (tsum('', '34°', XS, right=True), 'Find <i>x</i>.', 'x = 56', 90 + 34 + 56 == 180),
        (text_('57°', '68°', XS), 'Find <i>x</i>.', 'x = 125', 57 + 68 == 125),
        (text_('82°', XS, '150°'), 'Find <i>x</i>.', 'x = 68', 82 + 68 == 150),
        (tsum(XS, XS, XS, size=17), 'All three angles are equal. Find <i>x</i>.', 'x = 60', 3 * 60 == 180),
        (wide3(f'(2{XI})°', f'(3{XI})°', f'(4{XI})°'), 'Solve for <i>x</i>. Find each angle.', 'x = 20 (40°, 60°, 80°)', 9 * 20 == 180),
        (wide3(f'({XI} + 12)°', f'({XI} + 28)°', f'(2{XI})°'), 'Solve for <i>x</i>. Find each angle.', 'x = 35 (47°, 63°, 70°)', 35+12 + 35+28 + 70 == 180),
        (ext3(f'(2{XI} + 5)°', '50°', f'(4{XI} − 15)°'), 'Solve for <i>x</i>. Find the exterior angle.', 'x = 35 (exterior 125°)', 4*35 - 15 == 50 + 2*35 + 5 == 125),
    ]
    assert all(t[-1] for t in probs)
    for svg, prm, ans, _ in probs:
        pass
    p += '<div class="grid2" style="grid-template-rows:repeat(4,minmax(0,1fr));flex:1;min-height:0">'
    for n, (svg, prm, ans, _) in enumerate(probs, 1):
        p += (f'<div class="cell"><div><span class="qn">{n}</span><span style="font-size:9.2pt">{prm}</span></div>'
              f'<div style="display:flex;gap:8px;flex:1;min-height:0;margin-top:2px"><div class="fig" style="width:1.7in;flex:none;display:flex;align-items:center">{svg}</div>'
              f'<div style="flex:1;display:flex;flex-direction:column;min-width:0">{ln("Theorem:", "Exterior Angle" if "exterior" in prm or n in (3, 4) else "Triangle Sum")}{work([])}{ln("Answer:", mx(ans))}</div></div></div>')
    p += '</div>'
    third = 180 - 35 - 95; ext = 180 - third; assert ext == 35 + 95 == 130
    opts = ['50°', '130°', '85°', '145°']
    p += ('<div class="grid2" style="margin-top:7px;flex:none">'
          f'<div class="cell"><div><span class="qn">9</span>Two angles of a triangle measure 35° and 95°. What is the <b>exterior</b> angle at the third corner?</div>'
          f'{choices(opts, [opts.index("130°")], 4)}</div>')
    xa = lin((4, 20), (0, 180)); assert xa == ('one', 40); angs = (40, 70, 70); assert sum(angs) == 180
    p += (f'<div class="cell"><div><span class="qn">10</span>The angles of a triangle are ' + mx('x°, (x + 30)°') + ' and ' + mx('(2x - 10)°') + '. Find each angle.</div>'
          f'{work([])}{ln("Angles:", mx("x = 40; 40°, 70°, 70°"))}</div></div>')
    p += footer('Notes 3 · Back')
    css = '.cell .fig svg{max-width:100%;height:100%;width:auto;max-height:1.3in}.box .fig svg{width:100%;height:auto}'
    return render(page_doc([front, p], 'Notes 3 Triangle Theorems').replace('</style>', css + '</style>'), 'Notes3_Triangle_Angle_Theorems', 2)

# ═════════════════════════ NOTES 4: WORD PROBLEMS ═════════════════════════
def wp_lines(letx, eq, sol, ans):
    return (ln('Let <i>x</i> =', letx) + '<div style="font-size:9.6pt;margin-top:4px">Equation or inequality:</div>' + ln('', mx(eq)) + work([mx(s) for s in sol]) + ln('Answer:', ans))

def notes4():
    K = 'Notes 4 · NC.8.EE.7'
    p = head(K, 'Word Problems: Equations &amp; Inequalities', 'Turn the words into math. Then solve and answer the question.')
    p += NAME
    p += '<h3 class="sec">Word Bank: Words That Point to an Operation</h3>'
    ops = [('Add', '+', 'sum, plus, total, more than, increased by, added to, combined, in all, gain'),
           ('Subtract', '−', 'difference, minus, less than*, fewer than*, decreased by, take away, left, spent, lost'),
           ('Multiply', '×', 'product, times, twice (×2), double, triple, of, each*, per*, every*'),
           ('Divide', '÷', 'quotient, divided by, split, shared equally, per (as a rate), half of, each one gets'),
           ('Equals', '=', 'is, equals, will be, gives, results in, the same as, total is, costs'),
           ('Inequality', '&lt; &gt; ≤ ≥', '<b>at least</b> ≥, <b>at most</b> ≤, <b>no more than</b> ≤, <b>no less than</b> ≥, '
            '<b>minimum</b> ≥, <b>maximum</b> ≤, <b>cannot exceed</b> ≤, <b>more than</b> &gt;, <b>less than</b> &lt;')]
    p += '<div class="wb">' + ''.join(f'<div class="op"><div class="h">{n}<span>{s}</span></div><div class="b">{w}</div></div>' for n, s, w in ops) + '</div>'
    p += ('<div class="twocol" style="margin-bottom:5px"><div class="box" style="margin:0"><h4>Strategy: 7 Steps</h4><ol class="strat">'
          '<li><b>Read</b> it twice.</li><li><b>Underline</b> the question.</li><li><b>Circle</b> the numbers and their labels.</li>'
          '<li><b>Let <i>x</i> =</b> the thing you do not know.</li><li><b>Write</b> the equation or inequality: start + rate × <i>x</i>.</li>'
          '<li><b>Solve</b> it.</li><li><b>Check</b> it in the story. Answer in a sentence with units.</li></ol></div>'
          '<div class="box" style="margin:0"><h4>Tips &amp; Watch Outs</h4><ul class="tips">'
          '<li>*<b>“Less than” switches the order.</b> “5 less than <i>x</i>” is <i>x</i> − 5, not 5 − <i>x</i>.</li>'
          '<li>*<b>“Each,” “per,” “every”</b> usually go with <i>x</i>: $7 each → 7<i>x</i>.</li>'
          '<li>A <b>one-time</b> fee or a starting amount is added once. It has no <i>x</i>.</li>'
          '<li><b>Two plans cost the same?</b> Set the two expressions equal.</li>'
          '<li><b>Whole things?</b> “At most” → round <b>down</b>. “At least” → round <b>up</b>.</li></ul></div></div>')
    p += '<h3 class="sec">Try It Together</h3>'
    # S1 equation, S2 inequality, S3 variables on both sides
    assert lin((15, 25), (0, 130)) == ('one', 7)
    assert ineq_solve((7, 18), (0, 60), '<=') == ('<=', 6)
    assert lin((5, 40), (9, 20)) == ('one', 5) and 40 + 5 * 5 == 20 + 9 * 5 == 65
    samples = [
        ('A gym charges a $25 sign-up fee plus $15 per month. Kai paid $130 in all. How many months did he pay for?',
         'number of months', '25 + 15x = 130', ['15x = 105', 'x = 7'], '7 months'),
        ('Mia has $60. She spends $18 on lunch. Movie tickets cost $7 each. What is the greatest number of tickets she can buy?',
         'number of tickets', '18 + 7x <= 60', ['7x <= 42', 'x <= 6'], 'At most 6 tickets'),
        ('Plan A costs $40 plus $5 per hour. Plan B costs $20 plus $9 per hour. After how many hours do they cost the same?',
         'number of hours', '40 + 5x = 20 + 9x', ['20 = 4x', 'x = 5'], '5 hours (both cost $65)'),
    ]
    p += '<div class="grid3 fillrest" style="grid-template-rows:minmax(0,1fr)">'
    for i, (q, lx, eq, sol, ans) in enumerate(samples):
        p += f'<div class="cell"><div style="font-size:9.1pt"><span class="qn">{"ABC"[i]}</span>{q}</div>{wp_lines(lx, eq, sol, ans)}</div>'
    p += '</div>' + footer('Notes 4 · Front', 'Turn over →')
    front = p

    # BACK
    assert lin((2, 5), (0, 31)) == ('one', 13)
    assert lin((2, F(7, 2)), (0, F(39, 2))) == ('one', 8)
    assert ineq_solve((20, 270), (0, 450), '>=') == ('>=', 9)
    o4, v4 = ineq_solve((45, 180), (0, 1200), '<='); assert o4 == '<=' and v4 == F(68, 3) and int(v4) == 22
    assert lin((F(-1, 2), 12), (F(-1, 4), 9)) == ('one', 12) and 12 - F(1, 2) * 12 == 9 - F(1, 4) * 12 == 6
    o6, v6 = ineq_solve((9, 10), (0, 100), '>'); assert (o6, v6) == ('>', 10)
    probs = [
        ('Five more than twice a number is 31. What is the number?', 'the number', '2x + 5 = 31', [], '13'),
        ('A taxi charges $3.50 plus $2 per mile. Leo’s ride cost $19.50. How many miles did he ride?', 'number of miles', '3.50 + 2x = 19.50', [], '8 miles'),
        ('Jada has 270 points. Each quiz is worth 20 points. She needs <b>at least</b> 450 points. How many more quizzes must she pass?', 'number of quizzes', '270 + 20x >= 450', [], 'At least 9 quizzes'),
        ('An elevator holds <b>at most</b> 1,200 pounds. A 180-pound worker rides with boxes that weigh 45 pounds each. What is the greatest number of boxes?', 'number of boxes', '180 + 45x <= 1200', [], '22 boxes (x ≤ 22.6…, round down)'),
        ('Candle A is 12 inches tall and burns 0.5 inch per hour. Candle B is 9 inches tall and burns 0.25 inch per hour. When are they the same height?', 'number of hours', '12 - 0.5x = 9 - 0.25x', [], 'After 12 hours (both 6 in.)'),
    ]
    p = head(K, 'Practice: Word Problems', 'Use the 7 steps. Define your variable. Answer in a sentence with units.')
    p += '<div class="grid2" style="grid-template-rows:repeat(3,minmax(0,1fr));flex:1;min-height:0">'
    for n, (q, lx, eq, sol, ans) in enumerate(probs, 1):
        p += f'<div class="cell"><div style="font-size:9.3pt"><span class="qn">{n}</span>{q}</div>{wp_lines(lx, eq, sol, ans)}</div>'
    mc = ['9x + 10 &gt; 100', '10x + 9 &gt; 100', '9x + 10 &lt; 100', '9 + 10x ≥ 100']
    p += (f'<div class="cell"><div style="font-size:9.3pt"><span class="qn">6</span>Sam earns $9 per hour. He also gets a $10 bonus. He wants to earn <b>more than</b> $100. '
          f'Which inequality shows this? Then solve it.</div>{choices([mx(c) for c in mc], [0], 2)}{work([])}{ln("Solution:", mx("x &gt; 10, more than 10 hours"))}</div>')
    p += '</div>' + footer('Notes 4 · Back')
    return render(page_doc([front, p], 'Notes 4 Word Problems'), 'Notes4_Word_Problems', 2)

def combine_all(parts):
    stu = [(t, s) for t, (s, k) in parts]; key = [(t, k) for t, (s, k) in parts]
    comb = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'combine.py')
    for name, lst in (('Units3-4_Notes_Packet.pdf', stu), ('Units3-4_Notes_Packet_AnswerKey.pdf', key)):
        subprocess.run([sys.executable, comb, os.path.join(OUT, name)] + [f'{t}={f}' for t, f in lst], check=True)
    return [os.path.join(OUT, 'Units3-4_Notes_Packet.pdf'), os.path.join(OUT, 'Units3-4_Notes_Packet_AnswerKey.pdf')]

if __name__ == '__main__':
    parts = [('Notes 1: Angles Formed by Parallel Lines', notes1()), ('Notes 2: Solutions & Inequalities', notes2()),
             ('Notes 3: Triangle Angle Theorems', notes3()), ('Notes 4: Word Problems', notes4())]
    print(combine_all(parts))
