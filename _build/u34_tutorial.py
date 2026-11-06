#!/usr/bin/env python3
"""Units 3-4 Tutorial Review (interactive) -> grade8/units3-4-review-tutorial.html
Five parts: multi-step equations, number of solutions, inequalities, parallel lines & transversals, triangle theorems.

Every equation, inequality and angle problem has a step chooser ("Solve it step by step"): the student picks the
best next step, and the right pick shows the move, the colored work and the new line. A correct answer shows the
full line-by-line solution. Inequalities are also graphed on a number line the student builds. Parts 4 and 5 have
labeled reference diagrams that color the angle pairs / theorems.
Step data and checks: _build/u34_tut_steps.py.  Diagrams: _build/u34_refsvg.py.  Page component: grade8/step-solver.js.
Sends practice results to the Score Tracker (unit "3-4").
    python3 _build/u34_tutorial.py
"""
import sys, json, html, re
sys.path.insert(0, '/home/claude/mr-allen-s-math-class/_build')
sys.path.insert(0, '/home/claude/mr-allen-s-math-class/_build/materials')
from fractions import Fraction as F
import u4viz as V4
from u34_figs import tri as TRI, X as XI
from u34_tut_steps import SEQ, to_js, trail_html, render, expect_set
from u34_refsvg import para_ref, tri_ref

OUT = '/home/claude/mr-allen-s-math-class/grade8/units3-4-review-tutorial.html'
EE, G5 = 'NC.8.EE.7', 'NC.8.G.5'

def sw(svg, pairs):
    for a, b in pairs:
        assert ('>%s</text>' % a) in svg, a
        svg = svg.replace('>%s</text>' % a, '>%s</text>' % b, 1)
    return svg

def ans_of(key):
    """The answer the student types, read from the checked step data."""
    e = SEQ[key]['expect']
    if e[0] == 'one': return float(F(e[1]))
    if e[0] == 'ineq': return [{'≤': '<=', '≥': '>='}.get(e[1], e[1]), float(F(e[2]))]
    return {'all': 2, 'none': 1}[e[0]]          # choice index: One / No / Infinitely many

def graph_spec(v, closed, d, label):
    word = {'right': 'greater than', 'left': 'less than'}[d]
    circ = ('CLOSED circle at {0} ({0} is included)' if closed else 'OPEN circle at {0} ({0} is not included)').format(render(str(v)))
    return dict(v=v, closed=closed, dir=d, lo=-8, hi=8,
                why=f'{render(label)}: {circ}, shaded {d.upper()} (numbers {word} {render(str(v))}).')

def simple_sol(given, steps, concl):
    """Line-by-line solution for questions that are not equations (naming an angle pair, graphing)."""
    h = f'<div class="ss-sol"><div class="ss-h">Solution</div><ol class="ss-trail"><li><div class="ss-move">Given</div><div class="ss-given">{given}</div></li>'
    for i, (mv, note) in enumerate(steps, 1):
        h += f'<li><div class="ss-move"><span class="ss-n">{i}</span><span>{mv}</span></div><div class="ss-note">{note}</div></li>'
    return h + f'</ol><div class="ss-check">{concl}</div></div>'

Q = []
def add(**k):
    k['id'] = len(Q) + 1
    if k.get('seq'):
        k['sol'] = trail_html(SEQ[k['seq']])
    Q.append(k)

# ───── Part 1: multi-step equations ─────
P1 = [('t1', '2x + 9 = 25', {'17': 'You added 9. Subtract 9 from both sides instead.', '16': 'You found 2x = 16. Now divide both sides by 2.'}, 'Undo the + 9 first. Then undo the × 2.'),
      ('t2', '3(x + 4) = 27', {str(23/3): 'Distribute the 3 to BOTH terms: 3 · x and 3 · 4.', '23': 'Distribute the 3 to BOTH terms: 3 · x and 3 · 4.'}, 'Distribute first: 3(x + 4) = 3x + 12.'),
      ('t3', '7x - 6 = 4x + 9', {'1': 'Add 6 to both sides. Do not subtract it.', '3': 'You had 3x = 15. Now divide by 3.'}, 'Subtract 4x from both sides so the variable is on one side.'),
      ('t4', '5(x - 2) + 3x = 2(x + 7)', {str(-4/6): 'Check the signs: 5(x − 2) = 5x − 10.', '6': 'Distribute 2 to both terms on the right: 2x + 14.'}, 'Distribute on both sides. Then combine 5x + 3x.')]
for key, text, mist, hint in P1:
    add(part=1, type='num', std=EE, seq=key, prompt='Solve. <span class="eq">' + render(text) + '</span>', lab='x =', ans=ans_of(key),
        mist={str(float(k)): render(v) for k, v in mist.items()}, hint=render(hint))

# ───── Part 2: number of solutions ─────
OPTS = ['One solution', 'No solution', 'Infinitely many']
for key, text in [('t5', '6x + 3 = 6x + 3'), ('t6', '4x - 1 = 4x + 5'), ('t7', '2(x + 5) = 3x + 10'), ('t8', '3(2x - 1) + 4 = 6x + 1')]:
    e = SEQ[key]['expect']
    idx = 0 if e[0] == 'one' else ans_of(key)
    add(part=2, type='choice', std=EE, seq=key, prompt='How many solutions? <span class="eq">' + render(text) + '</span>', opts=OPTS, ans=idx,
        hint=render('Simplify both sides. Then move the x-terms to one side and look at what is left.'))

# ───── Part 3: inequalities ─────
for key, text, hint in [('t9', 'x - 4 > 3', 'Add 4 to both sides.'), ('t10', '3x + 2 ≤ 14', 'Subtract 2. Then divide by 3.'),
                        ('t11', '-5x < 30', 'You divide by −5. What happens to the sign?'), ('t12', '2(x - 3) ≥ 5x + 9', 'Distribute. Get the x-terms on one side.')]:
    op, v = ans_of(key)
    g = SEQ[key]['graph']
    sym = {'<=': '≤', '>=': '≥'}.get(op, op)
    add(part=3, type='ineq', std=EE, seq=key, prompt='Solve. Then graph your answer. <span class="eq">' + render(text) + '</span>', lab='Answer:', ans=[op, v],
        flip=key in ('t11', 't12'), hint=render(hint), graph=graph_spec(g['v'], g['closed'], g['dir'], f'x {sym} {g["v"]}'))
gs = graph_spec(2, False, 'left', 'x < 2')
add(part=3, type='graph', std=EE, prompt='Graph <span class="eq">' + render('x < 2') + '</span> on the number line.', graph=gs,
    hint=render('< means "less than." Is 2 included? Which way are the smaller numbers?'),
    sol=simple_sol(render('x < 2'), [('Read the sign.', render('< means "less than." 2 itself is NOT included.')),
                                     ('Choose the circle.', 'Not included → OPEN circle at 2.'),
                                     ('Choose the direction.', 'Less than → smaller numbers → shade LEFT.')],
                   'Open circle at 2, shaded left.'))

# ───── Part 4: parallel lines & transversals ─────
PAIRS = ['Corresponding', 'Alternate Interior', 'Alternate Exterior', 'Same-Side Interior', 'Same-Side Exterior']
add(part=4, type='choice', std=G5, prompt='Use the diagram. What kind of pair are ∠3 and ∠6?', svg=para_ref('q14'), opts=PAIRS, ans=1, hlq=[3, 6], ref='para',
    hint='Both angles are between the parallel lines. Are they on the same side of the transversal?',
    sol=simple_sol('∠3 and ∠6', [('Where are they?', 'Both are BETWEEN lines m and n → <b>interior</b>.'),
                                 ('Which side of t?', '∠3 is left of t. ∠6 is right of t → opposite sides → <b>alternate</b>.')],
                   'Alternate Interior angles. They are EQUAL.'))
add(part=4, type='choice', std=G5, prompt='Use the diagram. What kind of pair are ∠1 and ∠7?', svg=para_ref('q15'), opts=PAIRS, ans=4, hlq=[1, 7], ref='para',
    hint='Both angles are outside the parallel lines. Are they on the same side of the transversal?',
    sol=simple_sol('∠1 and ∠7', [('Where are they?', '∠1 is above line m. ∠7 is below line n. Both are OUTSIDE the parallel lines → <b>exterior</b>.'),
                                 ('Which side of t?', 'Both are left of t → <b>same side</b>.')],
                   'Same-Side Exterior angles. They ADD to 180°.'))
add(part=4, type='num', std=G5, seq='t16', ref='para', prompt=render('Lines are parallel. Find x.'), svg=V4.transversal('Corresponding', 118, 'Diagram: corresponding angles, given 118°'),
    lab='x =', ans=ans_of('t16'), mist={'62.0': 'Corresponding angles are equal. They do not add to 180°.'}, hint='These are corresponding angles. They are equal.')
add(part=4, type='num', std=G5, seq='t17', ref='para', prompt=render('Lines are parallel. Find x.'), svg=V4.transversal('Co-Interior', 64, 'Diagram: same-side interior angles, given 64°'),
    lab='x =', ans=ans_of('t17'), mist={'64.0': 'Same-side interior angles are not equal. They add to 180°.'}, hint='Same-side interior angles add to 180°.')
add(part=4, type='num', std=G5, seq='t18', ref='para', prompt=render('Lines are parallel. The alternate interior angles are (3x + 15)° and 75°. Solve for x.'),
    svg=sw(V4.transversal('Alternate Interior', 75, 'Diagram: alternate interior angles 75° and (3x + 15)°'), [('x°', '(3x + 15)°')]),
    lab='x =', ans=ans_of('t18'), mist={'30.0': render('You added 15. Subtract 15 from both sides: 3x = 60.'), '75.0': render('75° is the angle. Now solve 3x + 15 = 75 for x.')},
    hint=render('Alternate interior angles are equal: 3x + 15 = 75.'))

# ───── Part 5: triangle theorems ─────
add(part=5, type='num', std=G5, seq='t19', ref='tri', prompt=render('Find x.'), svg=V4.angle_sum(52, 79, 'Diagram: triangle with 52° and 79°'), lab='x =', ans=ans_of('t19'),
    mist={'131.0': '52 + 79 = 131 is the sum of the two angles. Subtract it from 180.'}, hint='The three angles add to 180°.')
add(part=5, type='num', std=G5, seq='t20', ref='tri', prompt=render('Find the exterior angle x.'), svg=V4.exterior(38, 77, None, 'ext', 'Diagram: remote interior angles 38° and 77°'),
    lab='x =', ans=ans_of('t20'), mist={'65.0': render('65° is the inside angle next to x. The exterior angle is the SUM of the two remote angles.')},
    hint='Exterior angle = sum of the two remote interior angles.')
add(part=5, type='num', std=G5, seq='t21', ref='tri', prompt=render('Find x.'), svg=V4.exterior(0, 72, 130, 'remote', 'Diagram: exterior angle 130°, remote interior 72°'),
    lab='x =', ans=ans_of('t21'), mist={'50.0': '50° is the angle next to the exterior angle. You need the angle at the top.', '202.0': render('The exterior angle is the sum: 72 + x = 130. Subtract.')},
    hint=render('130 = 72 + x.'))
A_, B_, C_ = 25 + 5, 2 * 25 + 10, 3 * 25 + 15
assert A_ + B_ + C_ == 180 and ans_of('t22') == 25
add(part=5, type='num', std=G5, seq='t22', ref='tri', prompt=render('The angles of a triangle are (x + 5)°, (2x + 10)°, and (3x + 15)°. Solve for x.'),
    svg=TRI((4, 170), (250, 170), (118, 10), f'({XI} + 5)°', f'(2{XI} + 10)°', f'(3{XI} + 15)°', size=15, w=254, h=176),
    lab='x =', ans=ans_of('t22'), mist={'30.0': '30° is one angle. The question asks for x.'}, hint=render('Add all three: 6x + 30 = 180.'))
assert len(Q) == 22
for q in Q:  # every typed / picked answer agrees with the checked step data
    if q.get('seq') and q['type'] == 'num': assert expect_set(SEQ[q['seq']]['expect']) == ('one', F(q['ans']).limit_denominator())

LEGEND = ('<div class="legend"><div class="lt">How to read the colored steps</div><div class="lg">'
          + ''.join(f'<span>{render(a)} {b}</span>' for a, b in [
              ('[o:− 9]', 'done to BOTH sides'), ('[c:+ 9 − 9]', 'cancels (makes 0)'), ('[v:3x]', 'x-terms (like terms)'),
              ('[k:12]', 'numbers (like terms)'), ('[d:3]', 'number being distributed'), ('[fl:>]', 'sign flipped')])
          + '</div></div>')

def demo(key, title, hl=None, svg=None):
    extra = f'<div class="dia">{svg}</div>' if svg else ''
    return (f'<div class="ex"><div class="t">{title}</div>{extra}'
            f'<div class="ss-demo" data-seq="{key}"{f" data-hl={chr(34)}{hl}{chr(34)}" if hl else ""}></div></div>')

PARTS = [
 (1, 'Multi-Step Equations', EE,
  '<p>Solve in this order. <b>1.</b> Distribute. <b>2.</b> Combine like terms on each side. <b>3.</b> Move the <i>x</i>-terms to one side. '
  '<b>4.</b> Undo + and −. <b>5.</b> Undo × and ÷. <b>6.</b> Check your answer in the original.</p>'
  '<p>Stuck? Every problem has a <b>Solve it step by step</b> button. Pick the best next step and watch the math happen.</p>',
  LEGEND + demo('ex1', 'Example: ' + render('4(x - 1) + 2x = 3x + 11'))),
 (2, 'One, None, or Infinitely Many Solutions', EE,
  '<p>Simplify both sides. Then move the <i>x</i>-terms to one side. Watch what happens to the <i>x</i>-terms:</p><ul>'
  '<li><b>One solution:</b> the <i>x</i>-terms do <b>not</b> all cancel. You get <i>x</i> = a number (even <i>x</i> = 0).</li>'
  '<li><b>No solution:</b> the <i>x</i>-terms cancel and what is left is <b>false</b>, like 6 = 1.</li>'
  '<li><b>Infinitely many:</b> the <i>x</i>-terms cancel and what is left is <b>true</b>, like 8 = 8.</li></ul>'
  '<p>Step through all three samples. Look for the red lines where the <i>x</i>-terms cancel.</p>',
  demo('s_one', 'Sample 1 · One solution: ' + render('5x - 3 = 2x + 9'))
  + demo('s_none', 'Sample 2 · No solution: ' + render('3(x + 2) = 3x + 1'))
  + demo('s_inf', 'Sample 3 · Infinitely many: ' + render('4x + 8 - x = 3(x + 2) + 2'))),
 (3, 'Solving and Graphing Inequalities', EE,
  '<p>Solve an inequality like an equation. <b>The flip rule:</b> when you multiply or divide by a <b>negative</b>, flip the sign. '
  'Then graph it: &lt; and &gt; use an <b>open</b> circle. ≤ and ≥ use a <b>closed</b> circle. Shade toward the numbers that work. '
  'Type answers like <span class="mono">x &gt; 4</span> or <span class="mono">x &lt;= -2</span>.</p>',
  demo('ex3', 'Example: ' + render('-2x + 1 ≥ 9'))),
 (4, 'Parallel Lines Cut by a Transversal', G5,
  '<p><b>Equal:</b> corresponding, alternate interior, alternate exterior, vertical. <b>Add to 180°:</b> same-side interior, same-side exterior, linear pair. '
  '<b>Interior</b> = between the parallel lines. <b>Alternate</b> = opposite sides of the transversal.</p>',
  '<div class="refmount" data-kind="para"></div>' + demo('ex4', 'Example: m∠2 = 70°. Find m∠7.', hl='ex4', svg=para_ref('ex4'))),
 (5, 'Triangle Interior and Exterior Angles', G5,
  '<p><b>Triangle Sum Theorem:</b> the three interior angles add to 180°. <b>Exterior Angle Theorem:</b> an exterior angle equals the sum of the two remote interior angles '
  '(the two inside angles that do not touch it).</p>',
  '<div class="refmount" data-kind="tri"></div>' + demo('ex5', 'Example: A triangle has angles 40° and 65°. Find the exterior angle next to the third angle.')),
]

CSS = r"""
:root{--navy:#1E2D4F;--gold:#FFC107;--goldl:#E0A800;--goldsoft:#FFF6D6;--bg:#F7F7F4;--line:#E3E5EA;--muted:#5B6475;--ok:#15803D;--no:#B42318;--info:#1D4ED8;
--serif:"Source Serif 4",Georgia,serif;--sans:Inter,system-ui,sans-serif;--mono:"JetBrains Mono",ui-monospace,monospace}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:#1B2333;font:16px/1.55 var(--sans)}
.wrap{max-width:860px;margin:0 auto;padding:12px 16px 60px}
.back{display:inline-block;margin:6px 0 10px;color:var(--navy);font-weight:600;text-decoration:none}.back:hover{text-decoration:underline}
h1,h2,h3{font-family:var(--serif);color:var(--navy);margin:0;font-weight:600}
.hero{background:var(--navy);color:#fff;border-radius:12px;padding:18px 20px;border-bottom:5px solid var(--gold)}
.hero h1{color:#fff;font-size:28px}.hero .k{color:var(--gold);font:700 12px var(--sans);letter-spacing:.12em;text-transform:uppercase}
.hero p{margin:6px 0 0;color:#D6DCEA}
.prog{position:sticky;top:0;z-index:5;background:var(--bg);padding:10px 0 8px;display:flex;align-items:center;gap:10px}
.bar{flex:1;height:10px;background:#E3E5EA;border-radius:99px;overflow:hidden}.bar i{display:block;height:100%;width:0;background:var(--ok);transition:width .3s}
.prog b{font:600 14px var(--sans);color:var(--navy);white-space:nowrap}
.toc{display:flex;flex-wrap:wrap;gap:8px;margin:12px 0}.toc a{border:1px solid var(--line);background:#fff;border-radius:99px;padding:8px 14px;color:var(--navy);font-weight:600;text-decoration:none;font-size:14px;min-height:44px;display:inline-flex;align-items:center}
section.part{background:#fff;border:1px solid var(--line);border-radius:10px;padding:16px 18px;margin:16px 0;box-shadow:0 1px 2px rgba(30,45,79,.05)}
.std{font:700 12px var(--sans);letter-spacing:.08em;color:var(--goldl);text-transform:uppercase}
.part h2{font-size:23px;margin:2px 0 8px}
.learn{background:var(--goldsoft);border-left:4px solid var(--gold);border-radius:6px;padding:8px 12px;margin:8px 0}.learn p{margin:4px 0}.learn ul{margin:4px 0 4px 18px;padding:0}
.legend{border:1px solid var(--line);border-radius:8px;padding:8px 12px;margin:10px 0;background:#fff}
.legend .lt{font:700 13px var(--sans);letter-spacing:.06em;text-transform:uppercase;color:var(--muted)}
.legend .lg{display:flex;flex-wrap:wrap;gap:6px 18px;margin-top:4px;font-size:14.5px}.legend .lg span{font-family:var(--sans)}
.ex{border:1.5px dashed var(--navy);border-radius:8px;padding:10px 12px;margin:10px 0}
.ex .t{font-weight:700;color:var(--navy);font-size:16.5px}
.eq{font-family:var(--serif);font-weight:600;color:var(--navy);font-size:19px;display:inline-block;margin-left:4px}
.mono{font-family:var(--mono);font-size:14px;background:#F1F3F7;padding:0 4px;border-radius:4px}
.q{border-top:1px solid var(--line);padding:14px 0 6px}
.q.qdone .n{background:var(--ok);color:#fff}
.q .n{display:inline-flex;align-items:center;justify-content:center;min-width:28px;height:28px;border-radius:6px;background:var(--navy);color:var(--gold);font:700 15px var(--serif);margin-right:8px}
.q .p{font-size:16.5px}
.dia{text-align:center;margin:8px 0}.dia svg{max-width:100%;height:auto}
.row{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin-top:8px}
.row label{font:600 16px var(--serif);color:var(--navy)}
.row input{font:500 17px var(--mono);border:1.5px solid #B9C0CC;border-radius:8px;padding:8px 10px;width:170px;min-height:44px;background:#fff}
.row input:focus,button:focus-visible{outline:3px solid var(--info);outline-offset:2px}
button{font:600 15px var(--sans);border-radius:8px;min-height:44px;padding:8px 14px;cursor:pointer;border:1.5px solid var(--navy)}
.b1{background:var(--navy);color:#fff}.b2{background:#fff;color:var(--navy)}
.opts{display:flex;flex-wrap:wrap;gap:8px;margin-top:8px}.opts button{background:#fff;color:var(--navy);text-align:left}
.opts button.ok{background:#E7F5EC;border-color:var(--ok)}.opts button.no{background:#FBEAEA;border-color:var(--no)}
.fb{margin-top:8px;font-size:15.5px;min-height:1px}.fb.ok{color:var(--ok);font-weight:600}.fb.no{color:var(--no)}.fb.hint{color:var(--info)}
.sol{display:none}.sol.on{display:block}
.reftog{margin-top:8px}
.done{background:#fff;border:1px solid var(--line);border-radius:10px;padding:16px 18px;margin:16px 0}
#send{margin-top:10px}
@media (max-width:520px){.hero h1{font-size:23px}.row input{width:140px}.ss-work,.ss-line{margin-left:4px!important}.ss-note,.ss-concl,.ss-given{margin-left:4px!important}}
"""

JS = r"""
const QS=__Q__;const SEQ=__S__;const REF=__R__;
const st={};let correct=0;
function cleanNum(s){s=String(s||'').toLowerCase().replace(/−/g,'-').replace(/\s+/g,'').replace(/^x=/,'').replace(/°|degrees?/g,'');
  let m=s.match(/^(-?\d+)\/(\d+)$/);if(m)return parseInt(m[1])/parseInt(m[2]);return /^-?\d*\.?\d+$/.test(s)?parseFloat(s):NaN;}
function parseIneq(raw){let s=String(raw||'').toLowerCase().replace(/\s+/g,'').replace(/−/g,'-').replace(/≤|=<|⩽/g,'<=').replace(/≥|=>|⩾/g,'>=');
  let m=s.match(/^x(<=|>=|<|>)(-?\d*\.?\d+)$/);if(m)return{op:m[1],v:parseFloat(m[2])};
  m=s.match(/^(-?\d*\.?\d+)(<=|>=|<|>)x$/);if(m)return{op:({'<':'>','>':'<','<=':'>=','>=':'<='})[m[2]],v:parseFloat(m[1])};return null;}
const FLIP={'<':'>','>':'<','<=':'>=','>=':'<='};
function rec(q,id,ok){if(window.ScoreSend)ScoreSend.record(id,ok,{std:q.std,band:4,label:q.prompt.replace(/<[^>]+>/g,'').slice(0,80)});}
function need(q){return q.type==='ineq'?['ans','graph']:q.type==='graph'?['graph']:['ans'];}
function upd(){document.getElementById('pbar').style.width=(100*correct/QS.length)+'%';document.getElementById('pnum').textContent=correct+' of '+QS.length+' done';
  const d=document.getElementById('final');if(d)d.textContent='You finished '+correct+' of '+QS.length+'. '+(correct===QS.length?'Excellent work!':'Go back to any question number that is not green and finish it.');}
function finish(q){const s=st[q.id];if(s.done)return;if(need(q).every(k=>s[k])){s.done=true;correct++;document.getElementById('q'+q.id).classList.add('qdone');upd();}}
function showSol(id,revealed){const el=document.getElementById('sol'+id);if(el)el.classList.add('on');if(revealed&&window.ScoreSend)ScoreSend.revealed();}
function result(q,ok,msg){const s=st[q.id];const fb=document.getElementById('fb'+q.id);
  if(s.ans)return;s.tries++;
  if(ok){s.ans=true;if(s.tries===1)rec(q,'q'+q.id,true);fb.className='fb ok';
    fb.innerHTML='Correct! '+(q.type==='ineq'&&!s.graph?'Now graph it below. ':'')+(q.sol?'Here is the full solution:':'');
    showSol(q.id,false);if(q.hlq)StepSolver.hl('q'+q.id,[[q.hlq,StepSolver.COLORS[0]]]);finish(q);return;}
  if(s.tries===1)rec(q,'q'+q.id,false);
  fb.className='fb no';fb.innerHTML=msg+(s.tries>=2&&q.sol?' <button class="b2" style="margin-left:6px" onclick="showSol('+q.id+',true)">Show me how</button>':'');}
function hint(id){const q=QS[id-1];const fb=document.getElementById('fb'+id);if(st[id].done)return;fb.className='fb hint';fb.innerHTML='Hint: '+q.hint;}
function check(id){const q=QS[id-1];const raw=document.getElementById('in'+id).value;const fb=document.getElementById('fb'+id);
  if(q.type==='num'){const v=cleanNum(raw);if(isNaN(v)){fb.className='fb no';fb.textContent='Type a number, like 12.';return;}
    if(Math.abs(v-q.ans)<1e-6)return result(q,true);
    const mk=Object.keys(q.mist||{}).find(k=>Math.abs(parseFloat(k)-v)<0.01);
    return result(q,false,mk?q.mist[mk]:'Not yet. '+q.hint);}
  if(q.type==='ineq'){const p=parseIneq(raw);if(!p){fb.className='fb no';fb.innerHTML='Type it like <span class="mono">x &gt; 4</span> or <span class="mono">x &lt;= -2</span>.';return;}
    const [op,val]=q.ans;if(p.op===op&&Math.abs(p.v-val)<1e-6)return result(q,true);
    if(Math.abs(p.v-val)<1e-6&&p.op===FLIP[op])return result(q,false,q.flip?'Your number is right, but you divided by a negative. Flip the sign.':'Your number is right, but the sign points the wrong way. You did not divide by a negative, so do not flip.');
    if(Math.abs(p.v-val)<1e-6)return result(q,false,'Your number is right. Check the sign: is the endpoint included or not?');
    if(p.op===op)return result(q,false,'The sign is right. Check your number. '+q.hint);
    return result(q,false,'Not yet. '+q.hint);}}
function pick(id,i,btn){const q=QS[id-1];if(st[id].ans)return;btn.parentNode.querySelectorAll('button').forEach(b=>b.classList.remove('no'));
  if(i===q.ans){btn.classList.add('ok');return result(q,true);}btn.classList.add('no');result(q,false,'Not quite. '+q.hint);}
QS.forEach(q=>st[q.id]={tries:0,ans:false,graph:false,done:false,grec:false});
document.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.id&&e.target.id.startsWith('in'))check(parseInt(e.target.id.slice(2)));});
// steppers, examples, graphs, references
document.querySelectorAll('.ss-mount').forEach(e=>StepSolver.mount(e,SEQ[e.dataset.seq],{hlPrefix:e.dataset.hl}));
document.querySelectorAll('.ss-demo').forEach(e=>StepSolver.demo(e,SEQ[e.dataset.seq],{hlPrefix:e.dataset.hl}));
document.querySelectorAll('.refmount').forEach(e=>StepSolver.ref(e,e.dataset.kind,REF[e.dataset.kind]));
document.querySelectorAll('.reftog').forEach(b=>{const box=document.getElementById(b.dataset.box);b.onclick=()=>{
  box.hidden=!box.hidden;b.setAttribute('aria-expanded',String(!box.hidden));b.textContent=box.hidden?'Show reference diagram':'Hide reference diagram';
  if(!box.hidden&&!box.firstChild)StepSolver.ref(box,b.dataset.kind,REF[b.dataset.kind]);};});
QS.filter(q=>q.graph).forEach(q=>{const host=document.getElementById('g'+q.id);
  StepSolver.graph(host,q.graph,{title:q.type==='graph'?'Build the graph':'Graph your answer',onResult:(ok,tries)=>{const s=st[q.id];
    const rid=q.type==='graph'?'q'+q.id:'q'+q.id+'g';if(!s.grec){s.grec=true;rec(q,rid,ok);}
    if(ok){s.graph=true;if(q.type==='graph')showSol(q.id,false);finish(q);}}});});
upd();
"""

def q_html(q):
    i = q['id']
    h = f'<div class="q" id="q{i}"><div class="p"><span class="n">{i}</span>{q["prompt"]}</div>'
    if q.get('svg'): h += f'<div class="dia">{q["svg"]}</div>'
    if q.get('ref') and q['type'] == 'num':
        h += (f'<button class="b2 reftog" data-box="rf{i}" data-kind="{q["ref"]}" aria-expanded="false">Show reference diagram</button>'
              f'<div id="rf{i}" hidden></div>')
    if q['type'] in ('num', 'ineq'):
        ph = 'e.g. x > 4' if q['type'] == 'ineq' else ''
        h += (f'<div class="row"><label for="in{i}">{q["lab"]}</label><input id="in{i}" inputmode="text" autocomplete="off" spellcheck="false" placeholder="{html.escape(ph)}" aria-label="Answer for question {i}">'
              f'<button class="b1" onclick="check({i})">Check</button><button class="b2" onclick="hint({i})">Hint</button></div>')
    elif q['type'] == 'choice':
        h += '<div class="opts">' + ''.join(f'<button onclick="pick({i},{k},this)">{o}</button>' for k, o in enumerate(q['opts'])) + '</div>'
        h += f'<div class="row"><button class="b2" onclick="hint({i})">Hint</button></div>'
    else:
        h += f'<div class="row"><button class="b2" onclick="hint({i})">Hint</button></div>'
    h += f'<div class="fb" id="fb{i}" aria-live="polite"></div>'
    if q.get('seq'):
        hl = f' data-hl="q{i}"' if q.get('hlq') else ''
        h += f'<div class="ss-mount" data-seq="{q["seq"]}"{hl}></div>'
    if q.get('sol'): h += f'<div class="sol" id="sol{i}">{q["sol"]}</div>'
    if q.get('graph'): h += f'<div id="g{i}"></div>'
    return h + '</div>'

body = ('<!-- SITE-BAR -->\n<script src="../site-bar.js"></script>\n<div class="wrap">'
        '<a class="back" href="unit4.html">← Back to Unit 4</a>'
        '<div class="hero"><div class="k">Units 3–4 · NC.8.EE.7 · NC.8.G.5</div><h1>Tutorial Review: Equations, Inequalities &amp; Angles</h1>'
        '<p>Five short parts. Read the box, step through the example, then try the questions. Every problem has step-by-step help, '
        'and every correct answer shows the full solution.</p></div>'
        '<div class="prog"><div class="bar"><i id="pbar"></i></div><b id="pnum"></b></div>'
        '<nav class="toc" aria-label="Parts">' + ''.join(f'<a href="#p{n}">{n}. {t}</a>' for n, t, *_ in PARTS) + '</nav>')
for n, t, std, learn, extra in PARTS:
    body += (f'<section class="part" id="p{n}"><div class="std">Part {n} · {std}</div><h2>{t}</h2><div class="learn">{learn}</div>{extra}'
             + ''.join(q_html(q) for q in Q if q['part'] == n) + '</section>')
body += '<div class="done"><h3>Finished?</h3><p id="final"></p><p>When you are done, send your work to Mr. Allen.</p><div id="send"></div></div></div>'

QJS = [{k: v for k, v in q.items() if k not in ('svg', 'sol')} | {'sol': bool(q.get('sol'))} for q in Q]
SJS = {k: to_js(v) for k, v in SEQ.items() if not k.startswith('pt')}
RJS = {'para': para_ref('__P__'), 'tri': tri_ref('__P__')}
page = ('<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">'
        '<title>Units 3–4 Tutorial Review — Equations, Inequalities &amp; Angles</title>'
        '<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=JetBrains+Mono:wght@500&family=Source+Serif+4:wght@500;600&display=swap" rel="stylesheet">'
        f'<style>{CSS}</style><script src="step-solver.js"></script><script src="ineq-keys.js"></script><script src="../brand.js"></script></head><body>{body}'
        '<script src="../tracker-config.js"></script><script src="../score-send.js"></script>'
        '<script>' + JS.replace('__Q__', json.dumps(QJS, ensure_ascii=False)).replace('__S__', json.dumps(SJS, ensure_ascii=False)).replace('__R__', json.dumps(RJS))
        + "if(window.ScoreSend)ScoreSend.setup({kind:'practice',unit:'3-4',page:'Units 3–4 Tutorial Review · Equations, Inequalities & Angles',mount:'#send',std:'NC.8.EE.7',band:4});"
        '</script></body></html>')
open(OUT, 'w').write(page)
print('wrote', OUT, len(Q), 'questions,', sum(1 for q in Q if q.get('seq')), 'with step choosers,', sum(1 for q in Q if q.get('graph')), 'with number lines')
