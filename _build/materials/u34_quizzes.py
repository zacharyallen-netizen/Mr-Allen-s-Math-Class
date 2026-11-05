"""Units 3-4 paper quizzes (Nov 2026), 5 questions each, one page + separate key.
  Quiz A  Inequalities + One, None, or Infinitely Many Solutions (NC.8.EE.7)
  Quiz B  Parallel Lines & Transversals + Triangle Interior & Exterior Angles (NC.8.G.5)
    OUT_DIR=/path python3 _build/materials/u34_quizzes.py
"""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from u34_common import *
from u34_figs import para, tri, numline, X as XI
from u34_sets import rel, EQUAL, TA, TB, TC

CSS2 = ('.qc .workbox{min-height:.6in}.qc{border:1px solid #D5D9E0;border-radius:8px;padding:7px 10px;display:flex;flex-direction:column;flex:1;min-height:0}'
        '.qc .row{display:flex;gap:10px;flex:1;min-height:0;margin-top:4px}.qc .fig svg{height:1.45in;width:auto}'
        '.qs{display:flex;flex-direction:column;gap:8px;flex:1;min-height:0}')

def nls(mark):
    return (f'<div class="nl nokey">{numline(-7, 7, w=330, h=38)}</div>'
            f'<div class="nl onlykey">{numline(-7, 7, w=330, h=38, mark=mark)}</div>')

def quizA():
    p = head('Quiz · NC.8.EE.7', 'Quiz: Inequalities &amp; Number of Solutions', 'Show your work for every problem.') + NAME
    q = []
    r = lin((4, -12), (4, -12)); assert r == ('inf',)
    q.append((mx('4(x - 3) = 4x - 12'), 'How many solutions does this equation have? Show how you know.',
              work([mx('4x - 12 = 4x - 12'), mx('-12 = -12 TRUE')]) + cls_boxes('inf'), None))
    r = lin((6, 5), (6, -1)); assert r == ('none',)
    q.append((mx('6x + 5 = 6x - 1'), 'How many solutions does this equation have? Show how you know.',
              work(['5 = ' + M + '1 FALSE']) + cls_boxes('none'), None))
    r = lin((7, -2), (3, 18)); assert r == ('one', 5)
    q.append((mx('7x - 2 = 3x + 18'), 'Solve. Then check the number of solutions.',
              work([mx('4x - 2 = 18'), mx('4x = 20')]) + cls_boxes('one') + ln('If one solution, <i>x</i> =', '5'), None))
    o = ineq_solve((2, 7), (0, 1), '<='); assert o == ('<=', -3)
    q.append((mx('2x + 7 ≤ 1'), 'Solve and graph.', work([mx('2x ≤ -6')]) + ln('Solution:', mx('x ≤ -3')), (-3, True, 'left')))
    o = ineq_solve((-4, 9), (0, 17), '>'); assert o == ('<', -2)
    q.append((mx('9 - 4x &gt; 17'), 'Solve and graph. Remember the flip rule.', work([mx('-4x &gt; 8'), '÷ (−4), flip']) + ln('Solution:', mx('x &lt; -2')), (-2, False, 'left')))
    body = '<div class="qs">'
    for n, (e, prm, inner, mark) in enumerate(q, 1):
        body += (f'<div class="qc"><div><span class="qn">{n}</span><span style="font-size:9.6pt">{prm}</span></div>'
                 f'<div class="eq" style="margin:3px 0 0 26px;font-size:12pt">{e}</div>{inner}{nls(mark) if mark else ""}</div>')
    body += '</div>'
    p += body + footer('Quiz A', 'Score: ____ / 5')
    return render(doc([p], 'Quiz A').replace('</style>', CSS2 + '</style>'), 'Quiz_Inequalities_Solutions', 1)

def quizB():
    p = head('Quiz · NC.8.G.5', 'Quiz: Transversals &amp; Triangles', 'Lines <i>m</i> and <i>n</i> are parallel. Diagrams are not drawn to scale.') + NAME
    items = []
    # 1 one-step alternate interior
    assert rel(4, 5) == 'Alternate Interior'
    items.append(('Name the angle pair. Then find <i>x</i>.', para({4: '64°', 5: f'{XI}°'}, w=300, h=190, size=20),
                  ln('Pair:', 'Alternate Interior') + work(['Equal angles']) + ln('<i>x</i> =', '64')))
    # 2 corresponding algebra
    assert rel(2, 6) == 'Corresponding'; r = lin((5, -12), (3, 20)); assert r == ('one', 16); assert 5*16 - 12 == 68
    items.append(('Solve for <i>x</i>. Then find the angle.', para({2: f'(5{XI} − 12)°', 6: f'(3{XI} + 20)°'}, w=300, h=190, size=18),
                  ln('Pair:', 'Corresponding') + work([mx('5x - 12 = 3x + 20'), mx('2x = 32')]) + ln('<i>x</i> =', '16') + ln('Angle:', '68°')))
    # 3 same-side interior algebra
    assert rel(4, 6) == 'Same-Side Interior'; r = lin((5, 30), (0, 180)); assert r == ('one', 30); assert 2*30 + 15 + 3*30 + 15 == 180
    items.append(('Solve for <i>x</i>. Then find both angles.', para({4: f'(2{XI} + 15)°', 6: f'(3{XI} + 15)°'}, w=300, h=190, size=18),
                  ln('Pair:', 'Same-Side Interior') + work([mx('(2x + 15) + (3x + 15) = 180'), mx('5x + 30 = 180')]) + ln('<i>x</i> =', '30') + ln('Angles:', '75° and 105°')))
    # 4 triangle sum
    assert 54 + 71 + 55 == 180
    items.append(('Find <i>x</i>. Name the theorem you used.', tri(TA, TB, TC, '54°', '71°', f'{XI}°', size=17),
                  ln('Theorem:', 'Triangle Sum') + work(['54 + 71 + ' + X + ' = 180', '125 + ' + X + ' = 180']) + ln('<i>x</i> =', '55')))
    # 5 exterior algebra
    r = lin((4, 20), (0, 140)); assert r == ('one', 30); assert 30 + 20 + 3*30 == 140
    items.append(('Solve for <i>x</i>. Name the theorem you used.', tri(TA, TB, TC, f'({XI} + 20)°', '', f'(3{XI})°', ext='140°', size=15, w=270),
                  ln('Theorem:', 'Exterior Angle') + work([mx('(x + 20) + 3x = 140'), mx('4x + 20 = 140')]) + ln('<i>x</i> =', '30')))
    body = '<div class="qs">'
    for n, (prm, svg, inner) in enumerate(items, 1):
        body += (f'<div class="qc"><div><span class="qn">{n}</span><span style="font-size:9.6pt">{prm}</span></div>'
                 f'<div class="row"><div class="fig" style="display:flex;align-items:center">{svg}</div>'
                 f'<div style="flex:1;display:flex;flex-direction:column">{inner}</div></div></div>')
    body += '</div>'
    p += body + footer('Quiz B', 'Score: ____ / 5')
    return render(doc([p], 'Quiz B').replace('</style>', CSS2 + '</style>'), 'Quiz_Transversals_Triangles', 1)

if __name__ == '__main__':
    print(quizA()); print(quizB())
