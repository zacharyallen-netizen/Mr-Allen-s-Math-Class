#!/usr/bin/env python3
"""Units 3-4 Pre-Test (interactive page + print PDF) and Units 3-4 Test (paper, parallel version).
Same engine and look as the other pre-tests (build_pretest.py). Score 3.0 / 4.0 / 5.0, both standards at every level.
    python3 _build/u34_pretest.py            -> grade8/Unit3_4_PreTest.html  and  $OUT_DIR/Unit3_4_Test.html
    node _build/u34_render.js                -> PDFs (pre-test print PDF in grade8; every answer key + the test stay OUT of the repo)
Every answer is re-derived below with Fraction arithmetic and asserted before the page is written.
"""
import sys, os, re
sys.path.insert(0, '/home/claude/mr-allen-s-math-class/_build')
from fractions import Fraction as F
from build_pretest import build, ENGINE
import u4viz as V4
sys.path.insert(0, '/home/claude/mr-allen-s-math-class/_build/materials')
from u34_figs import tri as TRI, X as XI

OUT = os.environ.get('OUT_DIR', '/home/claude/outputs/u34')
os.makedirs(OUT, exist_ok=True)
D = '°'

# ---- extra answer type: inequalities ("x > 4", "x>4", "4 < x", "x ≥ -4", "x >= −4") ----
INEQ_JS = r"""
function parseIneq(raw){
  let s=String(raw==null?'':raw).toLowerCase().replace(/\s+/g,'').replace(/−/g,'-').replace(/≤|=<|⩽/g,'<=').replace(/≥|=>|⩾/g,'>=');
  let m=s.match(/^x(<=|>=|<|>)(-?\d*\.?\d+)$/); if(m)return {op:m[1],v:parseFloat(m[2])};
  m=s.match(/^(-?\d*\.?\d+)(<=|>=|<|>)x$/); if(m)return {op:({'<':'>','>':'<','<=':'>=','>=':'<='})[m[2]],v:parseFloat(m[1])};
  return null;
}
"""
ENG = ENGINE.replace("function runCheck(chk,raw){", INEQ_JS + "function runCheck(chk,raw){").replace(
    "  if(t==='text')", "  if(t==='ineq'){const p=parseIneq(raw);return !!p&&p.op===chk[1]&&near(p.v,chk[2]);}\n  if(t==='text')", 1)
assert "t==='ineq'" in ENG

TXT = {'inf': ['infinitely many', 'infinitely many solutions', 'infinite', 'infinite solutions', 'many', 'all real numbers', 'all numbers'],
       'none': ['no solution', 'no solutions', 'none', 'zero', '0', 'zero solutions', 'no answer'],
       'one': ['one', 'one solution', '1', 'exactly one']}
DISP = {'inf': 'infinitely many solutions', 'none': 'no solution'}

def lin(L, R):
    (p, q), (r, s) = L, R
    if p == r: return 'inf' if q == s else 'none'
    return F(s - q, p - r)

def ineq(L, R, op):
    (p, q), (r, s) = L, R
    c, d = p - r, s - q; v = F(d, c)
    o = op if c > 0 else {'<': '>', '>': '<', '<=': '>=', '>=': '<='}[op]
    f = {'<': lambda a, b: a < b, '>': lambda a, b: a > b, '<=': lambda a, b: a <= b, '>=': lambda a, b: a >= b}
    for t in [v + F(k, 4) for k in range(-40, 41)]:
        assert f[op](p * t + q, r * t + s) == f[o](t, v)
    return o, v

SYMD = {'<': '<', '>': '>', '<=': '≤', '>=': '≥'}
def nd(v): v = F(v); assert v.denominator == 1; return ('−' if v < 0 else '') + str(abs(v.numerator))

def q_eq(i, lvl, text, L, R, std='NC.8.EE.7'):
    r = lin(L, R)
    if isinstance(r, str):
        return dict(id=i, lvl=lvl, op='How many solutions?', expr=text, disp=DISP[r], chk=['text', TXT[r]], lab='Answer:',
                    ph='e.g. no solution', std=std)
    return dict(id=i, lvl=lvl, op='Solve', expr=text, disp='x = ' + nd(r), chk=['val', float(r)], lab='x =', std=std)

def q_ineq(i, lvl, text, L, R, op):
    o, v = ineq(L, R, op)
    return dict(id=i, lvl=lvl, op='Solve the inequality', expr=text, disp='x ' + SYMD[o] + ' ' + nd(v),
                chk=['ineq', o, float(v)], lab='Answer:', ph='e.g. x > 4', std='NC.8.EE.7')

def q_ang(i, lvl, op, text, ans, svg, lab='x ='):
    return dict(id=i, lvl=lvl, op=op, expr=text, disp=(lab.replace(' =', '') + ' = ' + str(ans)) if lab != 'Answer:' else str(ans) + D,
                chk=['num', ans, 0.5], lab=lab, std='NC.8.G.5', svg=svg)

def sw(svg, pairs):
    """Swap given/unknown labels in a u4viz figure for expressions."""
    for a, b in pairs:
        assert ('>%s</text>' % a) in svg, (a, svg[:80])
        svg = svg.replace('>%s</text>' % a, '>%s</text>' % b, 1)
    return svg

# ---------- vocabulary (same for both versions) ----------
def vocab_table(terms, defs):
    opts = ''.join('<option>%s</option>' % L for L in 'ABCDEF'[:len(defs)])
    rows = []
    for term, (L, dtext) in zip(terms, defs):
        left = ('<td class="term"><select data-term="%s"><option value="">–</option>%s</select>'
                '<span class="word">%s</span><span class="fb"></span></td>') % (term.lower(), opts, term)
        rows.append('      <tr>%s\n          <td class="def"><b>%s.</b> %s</td></tr>' % (left, L, dtext))
    return '    <table class="vocab" id="vocab">\n' + '\n'.join(rows) + '\n    </table>'
terms = ['transversal', 'corresponding angles', 'alternate interior angles', 'same-side interior angles', 'exterior angle', 'no solution']
defs = [('A', 'Angles between the parallel lines, on the same side of the transversal. They add to 180°.'),
        ('B', 'An equation that is never true, for any value of x.'),
        ('C', 'A line that crosses two or more other lines.'),
        ('D', 'Angles in the same position at each crossing. They are equal when the lines are parallel.'),
        ('E', 'An angle outside a triangle, made by extending one side.'),
        ('F', 'Angles between the parallel lines, on opposite sides of the transversal. They are equal.')]
vkey = {'transversal': 'C', 'corresponding angles': 'D', 'alternate interior angles': 'F', 'same-side interior angles': 'A',
        'exterior angle': 'E', 'no solution': 'B'}
rb = ('    <div class="refbox"><p class="rl">Reference</p>'
      '<p style="text-align:center;font-size:15px;margin:6px 0">Equal: corresponding, alternate interior, alternate exterior  ·  '
      'Add to <b>180°</b>: same-side interior, linear pair, the 3 angles of a triangle</p>'
      '<p class="tag">Exterior angle = sum of the two remote interior angles.  Multiply or divide by a negative → flip the inequality sign.</p></div>')

BANDS = [
    dict(num='3.0', name='Basic Understanding', level='basic', code='NC.8.EE.7 · NC.8.G.5',
         obj='Solve one- and two-step equations and inequalities. Find angles with one step.',
         can='I can solve simple equations and inequalities, and use angle pairs and the triangle sum to find a missing angle.',
         prompt='Match each vocabulary term to its definition. Then answer each question.', vocab_html=vocab_table(terms, defs), refbox=rb),
    dict(num='4.0', name='Target Content', level='target', code='NC.8.EE.7 · NC.8.G.5',
         obj='Solve multi-step equations and inequalities. Use parallel lines and triangle theorems to find angles.',
         can='I can solve multi-step equations and inequalities, and use transversal angle pairs and the exterior angle theorem.',
         prompt='Answer each question. Show your work.'),
    dict(num='5.0', name='Advanced Content', level='advanced', code='NC.8.EE.7 · NC.8.G.5',
         obj='Identify the number of solutions and solve multi-step angle problems with algebra.',
         can='I can tell if an equation has one, no, or infinitely many solutions, and write and solve equations for angles.',
         prompt='Answer each question. Write "no solution" or "infinitely many" when that is the answer.'),
]

def version(v):
    """v = 'A' (pre-test) or 'B' (test, parallel numbers)."""
    A = v == 'A'
    qs = []
    # ---- 3.0 ----
    qs.append(q_eq(1, 'basic', '2x + 5 = 17' if A else '3x + 4 = 25', (2, 5) if A else (3, 4), (0, 17) if A else (0, 25)))
    qs.append(q_ineq(2, 'basic', 'x + 9 > 4' if A else 'x − 6 < 3', (1, 9) if A else (1, -6), (0, 4) if A else (0, 3), '>' if A else '<'))
    qs.append(q_eq(3, 'basic', '3x + 4 = 3x + 4' if A else '5x − 2 = 5x + 7', (3, 4) if A else (5, -2), (3, 4) if A else (5, 7)))
    g = 112 if A else 124
    qs.append(q_ang(4, 'basic', 'Corresponding', f'Parallel lines are cut by a transversal. Find the corresponding angle x.', g,
                    V4.transversal('Corresponding', g, f'Diagram: corresponding angles, given {g}°')))
    g = 58 if A else 63
    qs.append(q_ang(5, 'basic', 'Alt. interior', f'Parallel lines are cut by a transversal. Find the alternate interior angle x.', g,
                    V4.transversal('Alternate Interior', g, f'Diagram: alternate interior angles, given {g}°')))
    a, b = (70, 45) if A else (64, 52)
    qs.append(q_ang(6, 'basic', 'Triangle sum', f'A triangle has angles {a}° and {b}°. Find the third angle x.', 180 - a - b,
                    V4.angle_sum(a, b, f'Diagram: triangle with {a}° and {b}°')))
    # ---- 4.0 ----
    qs.append(q_eq(7, 'target', '5x − 7 = 2x + 8' if A else '6x − 5 = 2x + 15', (5, -7) if A else (6, -5), (2, 8) if A else (2, 15)))
    qs.append(q_eq(8, 'target', '3(x − 4) = x + 6' if A else '4(x − 3) = 2x + 10', (3, -12) if A else (4, -12), (1, 6) if A else (2, 10)))
    qs.append(q_ineq(9, 'target', '−2x + 3 ≤ 11' if A else '−3x + 5 ≥ 20', (-2, 3) if A else (-3, 5), (0, 11) if A else (0, 20), '<=' if A else '>='))
    g = 72 if A else 66
    qs.append(q_ang(10, 'target', 'Same-side interior', f'Same-side interior angles: one is {g}°. Find the other angle x.', 180 - g,
                    V4.transversal('Co-Interior', g, f'Diagram: same-side interior angles, given {g}°')))
    k, c, g = (3, 10, 70) if A else (4, 6, 74)          # corresponding: kx + c = g
    xv = F(g - c, k); assert xv.denominator == 1
    qs.append(q_ang(11, 'target', 'Solve', f'Corresponding angles measure ({k}x + {c})° and {g}°. Solve for x.', int(xv),
                    sw(V4.transversal('Corresponding', g, f'Diagram: corresponding angles {g}° and ({k}x + {c})°'), [('x°', f'({k}x + {c})°')])))
    r1, r2 = (48, 67) if A else (53, 71)
    qs.append(q_ang(12, 'target', 'Exterior angle', f'The remote interior angles are {r1}° and {r2}°. Find the exterior angle x.', r1 + r2,
                    V4.exterior(r1, r2, None, 'ext', f'Diagram: remote interior angles {r1}° and {r2}°')))
    # ---- 5.0 ----
    qs.append(q_eq(13, 'advanced', '2(3x + 1) = 6x − 5' if A else '3(2x − 4) = 6x + 1', (6, 2) if A else (6, -12), (6, -5) if A else (6, 1)))
    qs.append(q_eq(14, 'advanced', '4(x + 2) − x = 2(x + 7)' if A else '5(x − 1) + 2x = 3(x + 9)', (3, 8) if A else (7, -5), (2, 14) if A else (3, 27)))
    qs.append(q_ineq(15, 'advanced', '3(x − 2) > 5x + 4' if A else '2(x + 1) < 6x + 14', (3, -6) if A else (2, 2), (5, 4) if A else (6, 14), '>' if A else '<'))
    # alternate exterior with two expressions
    (p1, c1, p2, c2) = (4, -15, 2, 25) if A else (5, -20, 3, 16)
    xv = F(c2 - c1, p1 - p2); assert xv.denominator == 1; ang = p1 * xv + c1; assert ang == p2 * xv + c2 and 0 < ang < 180
    e1 = f'({p1}x − {-c1})°' if c1 < 0 else f'({p1}x + {c1})°'
    e2 = f'({p2}x + {c2})°'
    qs.append(q_ang(16, 'advanced', 'Solve', f'Alternate exterior angles measure {e1} and {e2}. Solve for x.', int(xv),
                    sw(V4.transversal('Alternate Exterior', int(ang), f'Diagram: alternate exterior angles {e1} and {e2}'), [(f'{int(ang)}°', e1), ('x°', e2)])))
    # triangle (x + a), (2x), (3x − b)
    (ta, tb) = (10, 10) if A else (20, 20)
    xv = F(180 - ta + tb, 6); assert xv.denominator == 1; xv = int(xv)
    angB, angC, angA = xv + ta, 2 * xv, 3 * xv - tb; assert angA + angB + angC == 180 and min(angA, angB, angC) > 0
    qs.append(q_ang(17, 'advanced', 'Solve', f'A triangle has angles (x + {ta})°, (2x)°, and (3x − {tb})°. Solve for x.', xv,
                    TRI((4, 170), (250, 170), (118, 10), f'({XI} + {ta})°', f'(2{XI})°', f'(3{XI} − {tb})°', size=15, w=254, h=176)))
    # exterior (5x − 6) = (2x + 9) + 39   /  B: (4x + 2) = (x + 14) + 48
    (ek, ec, rk, rc, rr) = (5, -6, 2, 9, 39) if A else (4, 2, 1, 14, 48)
    xv = F(rc + rr - ec, ek - rk); assert xv.denominator == 1; xv = int(xv)
    top = rk * xv + rc; ext = ek * xv + ec; assert ext == top + rr and top > 0 and 180 - ext > 0
    eE = f'({ek}x − {-ec})°' if ec < 0 else f'({ek}x + {ec})°'
    eT = f'({rk}x + {rc})°' if rk != 1 else f'(x + {rc})°'
    qs.append(q_ang(18, 'advanced', 'Solve', f'An exterior angle measures {eE}. The remote interior angles are {eT} and {rr}°. Solve for x.', xv,
                    sw(V4.exterior(top, rr, None, 'ext', f'Diagram: exterior angle {eE}, remote interior angles {eT} and {rr}°'), [(f'{top}°', eT), ('x°', eE)])))
    return qs

def cfg_for(v):
    A = v == 'A'
    name = 'Pre-Test' if A else 'Test'
    return dict(file='Unit3_4_PreTest.html' if A else 'Unit3_4_Test.html', unit='unit4', unitlabel='Unit 4',
                track_unit='3-4', track_page=f'Units 3–4 {name} — Equations, Inequalities & Angles',
                title=f'Units 3–4 {name} — Equations, Inequalities & Angles', h1=f'UNITS 3–4 {name.upper()}',
                sub='Equations, Inequalities &amp; Angle Relationships', std='Standards assessed: NC.8.EE.7 · NC.8.G.5',
                vocab_key=vkey, bands=BANDS, qs=version(v), engine=ENG,
                **({} if A else {'repo': OUT}))

if __name__ == '__main__':
    for v in 'AB':
        c = cfg_for(v)
        assert len(c['qs']) == 18 and [q['id'] for q in c['qs']] == list(range(1, 19))
        out = build(c)
        if v == 'A':   # online pre-test only: step choosers, colored solutions, number lines, reference diagrams (all hidden in print)
            import json
            from u34_pt_steps import PT
            from u34_tut_steps import to_js, trail_html, plain
            from u34_refsvg import para_ref, tri_ref
            for q in c['qs']:   # each step sequence ends on the answer the page checks
                seq = PT['pt%d' % q['id']]
                last = seq['steps'][-1]
                end = plain(last['res'] or last['concl']).replace('−', '-')
                assert q['disp'].replace('−', '-').split(' ')[-1].lower() in end.lower() or q['disp'] in DISP.values(), (q['id'], end, q['disp'])
            REF = {4: 'para', 5: 'para', 10: 'para', 11: 'para', 16: 'para', 6: 'tri', 12: 'tri', 17: 'tri', 18: 'tri'}
            data = dict(seq={str(q['id']): to_js(PT['pt%d' % q['id']]) for q in c['qs']},
                        sol={str(q['id']): trail_html(PT['pt%d' % q['id']]) for q in c['qs']},
                        graph={str(i): dict(PT['pt%d' % i]['graph'], lo=-8, hi=8) for i in (2, 9, 15)},
                        ref={str(k): v for k, v in REF.items()}, tpl={'para': para_ref('__P__'), 'tri': tri_ref('__P__')})
            for i in (2, 9, 15):
                g = data['graph'][str(i)]
                g['why'] = ('%s circle at %s, shaded %s.' % ('CLOSED' if g['closed'] else 'OPEN', ('−%d' % -g['v']) if g['v'] < 0 else g['v'], g['dir'].upper()))
            js = r"""
(function(){var D=__D__;
var css=document.createElement('style');css.textContent='.pt-extra{margin-top:8px}.pt-sol{display:none}.pt-sol.on{display:block}'+
 '.pt-tog{font:600 14.5px Inter,sans-serif;min-height:44px;padding:6px 12px;border-radius:8px;border:1.5px solid #1E2D4F;background:#fff;color:#1E2D4F;cursor:pointer;margin-top:8px}'+
 '@media print{.pt-extra{display:none!important}}';document.head.appendChild(css);
Object.keys(D.seq).forEach(function(id){var card=document.getElementById('q'+id);if(!card)return;
 var box=document.createElement('div');box.className='pt-extra';card.appendChild(box);
 if(D.ref[id]){var b=document.createElement('button');b.type='button';b.className='pt-tog';b.textContent='Show reference diagram';b.setAttribute('aria-expanded','false');
  var r=document.createElement('div');r.hidden=true;box.appendChild(b);box.appendChild(r);
  b.onclick=function(){r.hidden=!r.hidden;b.setAttribute('aria-expanded',String(!r.hidden));b.textContent=r.hidden?'Show reference diagram':'Hide reference diagram';
   if(!r.hidden&&!r.firstChild)StepSolver.ref(r,D.ref[id],D.tpl[D.ref[id]]);};}
 var m=document.createElement('div');box.appendChild(m);StepSolver.mount(m,D.seq[id]);
 if(D.graph[id]){var g=document.createElement('div');box.appendChild(g);StepSolver.graph(g,D.graph[id],{title:'Graph your answer'});}
 var s=document.createElement('div');s.className='pt-sol';s.id='ptsol'+id;s.innerHTML=D.sol[id];box.appendChild(s);});
function showSols(){Object.keys(D.sol).forEach(function(id){var c=document.getElementById('q'+id),s=document.getElementById('ptsol'+id);
 if(c&&s)s.classList.toggle('on',c.classList.contains('correct'));});}
['check','reveal'].forEach(function(b){var e=document.getElementById(b);if(e)e.addEventListener('click',function(){setTimeout(showSols,0);});});
var rs=document.getElementById('reset');if(rs)rs.addEventListener('click',function(){setTimeout(function(){document.querySelectorAll('.pt-sol').forEach(function(s){s.classList.remove('on');});},0);});
})();
"""
            h = open(out).read()
            tag = '<script src="step-solver.js"></script><script>' + js.replace('__D__', json.dumps(data, ensure_ascii=False)) + '</script>\n'
            i = h.rindex('</body>'); h = h[:i] + tag + h[i:]
            open(out, 'w').write(h)
        print('built', out)
