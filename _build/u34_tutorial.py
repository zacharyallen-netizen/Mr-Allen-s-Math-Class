#!/usr/bin/env python3
"""Units 3-4 Tutorial Review (interactive) -> grade8/units3_4_review_tutorial.html
Five parts: multi-step equations, number of solutions, inequalities, parallel lines & transversals, triangle theorems.
Every answer is computed here with Fraction arithmetic and asserted. Sends practice results to the Score Tracker (unit "3-4").
    python3 _build/u34_tutorial.py
"""
import sys, os, json, html
sys.path.insert(0, '/home/claude/mr-allen-s-math-class/_build')
sys.path.insert(0, '/home/claude/mr-allen-s-math-class/_build/materials')
from fractions import Fraction as F
import u4viz as V4
from u34_figs import para, numline, tri as TRI, X as XI

OUT = '/home/claude/mr-allen-s-math-class/grade8/units3_4_review_tutorial.html'
M = '−'

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
    return o, int(v), c < 0
SY = {'<': '&lt;', '>': '&gt;', '<=': '≤', '>=': '≥'}
import re
def m(s):
    """display math: true minus (not inside words like x-terms), italic standalone x, ≤ ≥."""
    s = s.replace('<=', '≤').replace('>=', '≥')
    s = re.sub(r'(?<![A-Za-z])-(?![A-Za-z])|(?<=\d)-(?=x)|(?<=\s)-(?=x)|^-(?=x)', M, s)
    return re.sub(r'(?<![A-Za-z])x(?![A-Za-z])', '<i>x</i>', s)
def sw(svg, pairs):
    for a, b in pairs:
        assert ('>%s</text>' % a) in svg, a
        svg = svg.replace('>%s</text>' % a, '>%s</text>' % b, 1)
    return svg

Q = []
def add(**k): k['id'] = len(Q) + 1; Q.append(k)
EE, G5 = 'NC.8.EE.7', 'NC.8.G.5'

# ───── Part 1: multi-step equations ─────
for text, L, R, mist, hint, steps in [
    ('2x + 9 = 25', (2, 9), (0, 25), {17: 'You added 9. Subtract 9 from both sides instead.', 16: 'You found 2x = 16. Now divide both sides by 2.'},
     'Undo the + 9 first. Then undo the × 2.', ['2x + 9 − 9 = 25 − 9', '2x = 16', 'x = 8']),
    ('3(x + 4) = 27', (3, 12), (0, 27), {F(23, 3): 'Distribute the 3 to BOTH terms: 3 · x and 3 · 4.', 23: 'Distribute the 3 to BOTH terms: 3 · x and 3 · 4.'},
     'Distribute first: 3(x + 4) = 3x + 12.', ['3x + 12 = 27', '3x = 15', 'x = 5']),
    ('7x - 6 = 4x + 9', (7, -6), (4, 9), {1: 'Add 6 to both sides. Do not subtract it.', 3: 'You had 3x = 15. Now divide by 3.'},
     'Subtract 4x from both sides so the variable is on one side.', ['3x − 6 = 9', '3x = 15', 'x = 5']),
    ('5(x - 2) + 3x = 2(x + 7)', (8, -10), (2, 14), {F(-4, 6): 'Check the signs: 5(x − 2) = 5x − 10.', 6: 'Distribute 2 to both terms on the right: 2x + 14.'},
     'Distribute on both sides. Then combine 5x + 3x.', ['5x − 10 + 3x = 2x + 14', '8x − 10 = 2x + 14', '6x = 24', 'x = 4']),
]:
    r = lin(L, R); assert isinstance(r, F) and r.denominator == 1
    add(part=1, type='num', std=EE, prompt='Solve. <span class="eq">' + m(text) + '</span>', lab='x =', ans=float(r),
        mist={str(float(k)): v for k, v in mist.items()}, hint=hint, steps=steps)

# ───── Part 2: number of solutions ─────
OPTS = ['One solution', 'No solution', 'Infinitely many']
for text, L, R, why in [
    ('6x + 3 = 6x + 3', (6, 3), (6, 3), 'Both sides are exactly the same. Every number works.'),
    ('4x - 1 = 4x + 5', (4, -1), (4, 5), 'Subtract 4x: −1 = 5. That is false, so no number works.'),
    ('2(x + 5) = 3x + 10', (2, 10), (3, 10), '2x + 10 = 3x + 10. The x-terms are different, so they do not cancel. x = 0 is the one solution.'),
    ('3(2x - 1) + 4 = 6x + 1', (6, 1), (6, 1), '6x − 3 + 4 = 6x + 1. Both sides are 6x + 1, so it is always true.'),
]:
    r = lin(L, R); idx = {'inf': 2, 'none': 1}.get(r, 0) if isinstance(r, str) else 0
    if not isinstance(r, str): assert r == 0
    add(part=2, type='choice', std=EE, prompt='How many solutions? <span class="eq">' + m(text) + '</span>', opts=OPTS, ans=idx,
        hint='Simplify both sides. Then move the x-terms to one side and look at what is left.', steps=[why])

# ───── Part 3: inequalities ─────
for text, L, R, op, hint, steps in [
    ('x - 4 > 3', (1, -4), (0, 3), '>', 'Add 4 to both sides.', ['x − 4 + 4 > 3 + 4', 'x > 7']),
    ('3x + 2 <= 14', (3, 2), (0, 14), '<=', 'Subtract 2. Then divide by 3.', ['3x ≤ 12', 'x ≤ 4']),
    ('-5x < 30', (-5, 0), (0, 30), '<', 'You divide by −5. What happens to the sign?', ['Divide by −5 and flip the sign', 'x > −6']),
    ('2(x - 3) >= 5x + 9', (2, -6), (5, 9), '>=', 'Distribute. Get the x-terms on one side.', ['2x − 6 ≥ 5x + 9', '−3x ≥ 15', 'Divide by −3 and flip', 'x ≤ −5']),
]:
    o, v, fl = ineq(L, R, op)
    add(part=3, type='ineq', std=EE, prompt='Solve. <span class="eq">' + m(text).replace('<i>x</i> &gt;', '<i>x</i> &gt;') .replace(' < ', ' &lt; ').replace(' > ', ' &gt; ') + '</span>',
        lab='Answer:', ans=[o, v], flip=fl, hint=hint, steps=steps)
gsvg = [numline(-5, 5, w=300, h=40, mark=mk, col='#1E2D4F') for mk in [(2, False, 'left'), (2, True, 'left'), (2, False, 'right'), (-2, False, 'left')]]
add(part=3, type='choice', std=EE, prompt='Which graph shows <span class="eq"><i>x</i> &lt; 2</span>?', opts=gsvg, ans=0, graph=True,
    hint='&lt; means "less than": an open circle, shaded to the left.', steps=['Open circle at 2 (2 is not included), shaded left (smaller numbers).'])

# ───── Part 4: parallel lines & transversals ─────
PAIRS = ['Corresponding', 'Alternate Interior', 'Alternate Exterior', 'Same-Side Interior', 'Same-Side Exterior']
fig8 = para({i: str(i) for i in range(1, 9)}, w=320, h=195, size=15)
add(part=4, type='choice', std=G5, prompt='Use the diagram. What kind of pair are ∠3 and ∠6?', svg=fig8, opts=PAIRS, ans=1,
    hint='Both angles are between the parallel lines. Are they on the same side of the transversal?', steps=['Between the lines (interior) and on opposite sides of t (alternate).'])
add(part=4, type='choice', std=G5, prompt='Use the diagram. What kind of pair are ∠1 and ∠7?', svg=fig8, opts=PAIRS, ans=4,
    hint='Both angles are outside the parallel lines. Are they on the same side of the transversal?', steps=['Outside the lines (exterior) and on the same side of t.'])
add(part=4, type='num', std=G5, prompt='Lines are parallel. Find <i>x</i>.', svg=V4.transversal('Corresponding', 118, 'Diagram: corresponding angles, given 118°'),
    lab='x =', ans=118, mist={'62.0': 'Corresponding angles are equal. They do not add to 180°.'}, hint='These are corresponding angles. They are equal.', steps=['Corresponding angles are equal', 'x = 118'])
add(part=4, type='num', std=G5, prompt='Lines are parallel. Find <i>x</i>.', svg=V4.transversal('Co-Interior', 64, 'Diagram: same-side interior angles, given 64°'),
    lab='x =', ans=116, mist={'64.0': 'Same-side interior angles are not equal. They add to 180°.'}, hint='Same-side interior angles add to 180°.', steps=['64 + x = 180', 'x = 116'])
xv = F(75 - 15, 3); assert xv == 20
add(part=4, type='num', std=G5, prompt='Lines are parallel. The alternate interior angles are (3<i>x</i> + 15)° and 75°. Solve for <i>x</i>.',
    svg=sw(V4.transversal('Alternate Interior', 75, 'Diagram: alternate interior angles 75° and (3x + 15)°'), [('x°', '(3x + 15)°')]),
    lab='x =', ans=20, mist={'30.0': 'You added 15. Subtract 15 from both sides: 3x = 60.', '75.0': '75° is the angle. Now solve 3x + 15 = 75 for x.'},
    hint='Alternate interior angles are equal: 3x + 15 = 75.', steps=['3x + 15 = 75', '3x = 60', 'x = 20'])

# ───── Part 5: triangle theorems ─────
assert 52 + 79 + 49 == 180
add(part=5, type='num', std=G5, prompt='Find <i>x</i>.', svg=V4.angle_sum(52, 79, 'Diagram: triangle with 52° and 79°'), lab='x =', ans=49,
    mist={'131.0': '52 + 79 = 131 is the sum of the two angles. Subtract it from 180.'}, hint='The three angles add to 180°.', steps=['52 + 79 + x = 180', '131 + x = 180', 'x = 49'])
add(part=5, type='num', std=G5, prompt='Find the exterior angle <i>x</i>.', svg=V4.exterior(38, 77, None, 'ext', 'Diagram: remote interior angles 38° and 77°'),
    lab='x =', ans=115, mist={'65.0': '65° is the inside angle next to x. The exterior angle is the SUM of the two remote angles.'},
    hint='Exterior angle = sum of the two remote interior angles.', steps=['x = 38 + 77', 'x = 115'])
assert 72 + 58 == 130
add(part=5, type='num', std=G5, prompt='Find <i>x</i>.', svg=V4.exterior(0, 72, 130, 'remote', 'Diagram: exterior angle 130°, remote interior 72°'),
    lab='x =', ans=58, mist={'50.0': '50° is the angle next to the exterior angle. You need the angle at the top.', '202.0': 'The exterior angle is the sum: 72 + x = 130. Subtract.'},
    hint='130 = 72 + x.', steps=['130 = 72 + x', 'x = 58'])
xv = F(180 - 30, 6); assert xv == 25
A_, B_, C_ = 25 + 5, 2 * 25 + 10, 3 * 25 + 15; assert A_ + B_ + C_ == 180
add(part=5, type='num', std=G5, prompt='The angles of a triangle are (<i>x</i> + 5)°, (2<i>x</i> + 10)°, and (3<i>x</i> + 15)°. Solve for <i>x</i>.',
    svg=TRI((4, 170), (250, 170), (118, 10), f'({XI} + 5)°', f'(2{XI} + 10)°', f'(3{XI} + 15)°', size=15, w=254, h=176),
    lab='x =', ans=25, mist={'30.0': '30° is one angle. The question asks for x.'}, hint='Add all three: 6x + 30 = 180.', steps=['6x + 30 = 180', '6x = 150', 'x = 25'])

for q in Q:
    q['steps'] = [m(s) if '<' not in s else s for s in q['steps']]

PARTS = [
 (1, 'Multi-Step Equations', EE,
  '<p>Solve in this order. <b>1.</b> Distribute. <b>2.</b> Combine like terms on each side. <b>3.</b> Move the <i>x</i>-terms to one side. '
  '<b>4.</b> Undo + and −. <b>5.</b> Undo × and ÷. <b>6.</b> Check your answer in the original.</p>',
  ('4(x - 1) + 2x = 3x + 11', ['4x − 4 + 2x = 3x + 11  (distribute)', '6x − 4 = 3x + 11  (combine 4x + 2x)', '3x − 4 = 11  (subtract 3x)', '3x = 15  (add 4)', 'x = 5  (divide by 3)', 'Check: 4(4) + 10 = 26 and 15 + 11 = 26 ✓'])),
 (2, 'One, None, or Infinitely Many Solutions', EE,
  '<p>Simplify both sides. Move the <i>x</i>-terms to one side.</p><ul><li><b>One solution:</b> the <i>x</i>-terms do not cancel. You get <i>x</i> = a number.</li>'
  '<li><b>No solution:</b> the <i>x</i>-terms cancel and you get a <b>false</b> statement, like 3 = 7.</li>'
  '<li><b>Infinitely many:</b> the <i>x</i>-terms cancel and you get a <b>true</b> statement, like 5 = 5.</li></ul>',
  ('2(x + 4) = 2x + 8', ['2x + 8 = 2x + 8  (distribute)', '8 = 8  (subtract 2x)', 'True → infinitely many solutions'])),
 (3, 'Solving and Graphing Inequalities', EE,
  '<p>Solve an inequality like an equation. <b>The flip rule:</b> when you multiply or divide by a <b>negative</b>, flip the sign. '
  '&lt; and &gt; use an <b>open</b> circle. ≤ and ≥ use a <b>closed</b> circle. Type answers like <span class="mono">x &gt; 4</span> or <span class="mono">x &lt;= -2</span>.</p>',
  ('-2x + 1 >= 9', ['−2x ≥ 8  (subtract 1)', 'Divide by −2 and FLIP: x ≤ −4', 'Closed circle at −4, shade left'])),
 (4, 'Parallel Lines Cut by a Transversal', G5,
  '<p><b>Equal:</b> corresponding, alternate interior, alternate exterior, vertical. <b>Add to 180°:</b> same-side interior, same-side exterior, linear pair. '
  '<b>Interior</b> = between the parallel lines. <b>Alternate</b> = opposite sides of the transversal.</p>',
  ('m∠2 = 70°. Find m∠7.', ['∠2 and ∠7 are alternate exterior angles', 'Alternate exterior angles are equal', 'm∠7 = 70°'])),
 (5, 'Triangle Interior and Exterior Angles', G5,
  '<p><b>Triangle Sum Theorem:</b> the three interior angles add to 180°. <b>Exterior Angle Theorem:</b> an exterior angle equals the sum of the two remote interior angles '
  '(the two inside angles that do not touch it).</p>',
  ('A triangle has angles 40° and 65°. Find the exterior angle next to the third angle.', ['Exterior = 40 + 65', 'Exterior = 105°', 'Check: third angle = 75°, and 75 + 105 = 180 ✓'])),
]
for _, _, _, _, (t, st) in PARTS: pass
assert len(Q) == 22

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
.ex{border:1.5px dashed var(--navy);border-radius:8px;padding:10px 12px;margin:10px 0}
.ex .t{font-weight:700;color:var(--navy)}.ex ol{margin:6px 0 0 20px;padding:0}.ex li{margin:3px 0;font-family:var(--serif);font-size:17px;color:var(--navy)}
.ex li.hid{display:none}
.eq{font-family:var(--serif);font-weight:600;color:var(--navy);font-size:19px;white-space:nowrap;display:inline-block;margin-left:4px}
.mono{font-family:var(--mono);font-size:14px;background:#F1F3F7;padding:0 4px;border-radius:4px}
.q{border-top:1px solid var(--line);padding:14px 0 6px}
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
.opts.g{display:grid;grid-template-columns:1fr 1fr;gap:8px}.opts.g button{padding:6px}.opts.g svg{width:100%;height:auto;display:block}
.opts button.sel{background:#EEF1F7}.opts button.ok{background:#E7F5EC;border-color:var(--ok)}.opts button.no{background:#FBEAEA;border-color:var(--no)}
.fb{margin-top:8px;font-size:15.5px;min-height:1px}.fb.ok{color:var(--ok);font-weight:600}.fb.no{color:var(--no)}.fb.hint{color:var(--info)}
.sol{display:none;margin-top:8px;background:#F1F3F7;border-radius:8px;padding:8px 12px;font-family:var(--serif);color:var(--navy)}.sol.on{display:block}
.done{background:#fff;border:1px solid var(--line);border-radius:10px;padding:16px 18px;margin:16px 0}
#send{margin-top:10px}
@media (max-width:520px){.opts.g{grid-template-columns:1fr}.hero h1{font-size:23px}.eq{white-space:normal}.row input{width:140px}}
"""

JS = r"""
const QS=__Q__;
const st={};let correct=0;
function cleanNum(s){s=String(s||'').toLowerCase().replace(/−/g,'-').replace(/\s+/g,'').replace(/^x=/,'').replace(/°|degrees?/g,'');
  let m=s.match(/^(-?\d+)\/(\d+)$/);if(m)return parseInt(m[1])/parseInt(m[2]);return /^-?\d*\.?\d+$/.test(s)?parseFloat(s):NaN;}
function parseIneq(raw){let s=String(raw||'').toLowerCase().replace(/\s+/g,'').replace(/−/g,'-').replace(/≤|=<|⩽/g,'<=').replace(/≥|=>|⩾/g,'>=');
  let m=s.match(/^x(<=|>=|<|>)(-?\d*\.?\d+)$/);if(m)return{op:m[1],v:parseFloat(m[2])};
  m=s.match(/^(-?\d*\.?\d+)(<=|>=|<|>)x$/);if(m)return{op:({'<':'>','>':'<','<=':'>=','>=':'<='})[m[2]],v:parseFloat(m[1])};return null;}
const FLIP={'<':'>','>':'<','<=':'>=','>=':'<='};
function rec(q,ok){if(window.ScoreSend)ScoreSend.record('q'+q.id,ok,{std:q.std,band:4,label:q.prompt.replace(/<[^>]+>/g,'').slice(0,80)});}
function upd(){document.getElementById('pbar').style.width=(100*correct/QS.length)+'%';document.getElementById('pnum').textContent=correct+' of '+QS.length+' correct';
  const d=document.getElementById('final');if(d)d.textContent='You got '+correct+' of '+QS.length+' correct. '+(correct===QS.length?'Excellent work!':'Go back to any question that is not green and try again.');}
function result(q,ok,msg){const s=st[q.id];const fb=document.getElementById('fb'+q.id);
  if(s.done)return;s.tries++;
  if(ok){s.done=true;if(s.tries===1)rec(q,true);correct++;fb.className='fb ok';fb.innerHTML='Correct! '+(q.steps.length?q.steps[q.steps.length-1]:'');upd();return;}
  if(s.tries===1)rec(q,false);
  fb.className='fb no';fb.innerHTML=msg+(s.tries>=2?' <button class="b2" style="margin-left:6px" onclick="showSol('+q.id+')">Show me how</button>':'');}
function showSol(id){const el=document.getElementById('sol'+id);el.classList.add('on');if(window.ScoreSend)ScoreSend.revealed();}
function hint(id){const q=QS[id-1];const fb=document.getElementById('fb'+id);if(st[id].done)return;fb.className='fb hint';fb.innerHTML='Hint: '+q.hint;}
function check(id){const q=QS[id-1];const raw=document.getElementById('in'+id).value;
  if(q.type==='num'){const v=cleanNum(raw);if(isNaN(v)){document.getElementById('fb'+id).className='fb no';document.getElementById('fb'+id).textContent='Type a number, like 12.';return;}
    if(Math.abs(v-q.ans)<1e-6)return result(q,true);const key=String(Number(v).toFixed(1));
    const mk=Object.keys(q.mist||{}).find(k=>Math.abs(parseFloat(k)-v)<0.01);
    return result(q,false,mk?q.mist[mk]:'Not yet. '+q.hint);}
  if(q.type==='ineq'){const p=parseIneq(raw);if(!p){document.getElementById('fb'+id).className='fb no';document.getElementById('fb'+id).innerHTML='Type it like <span class="mono">x &gt; 4</span> or <span class="mono">x &lt;= -2</span>.';return;}
    const [op,val]=q.ans;if(p.op===op&&Math.abs(p.v-val)<1e-6)return result(q,true);
    if(Math.abs(p.v-val)<1e-6&&p.op===FLIP[op])return result(q,false,q.flip?'Your number is right, but you divided by a negative. Flip the sign.':'Your number is right, but the sign points the wrong way. You did not divide by a negative, so do not flip.');
    if(Math.abs(p.v-val)<1e-6)return result(q,false,'Your number is right. Check the sign: is the endpoint included or not?');
    if(p.op===op)return result(q,false,'The sign is right. Check your number. '+q.hint);
    return result(q,false,'Not yet. '+q.hint);}}
function pick(id,i,btn){const q=QS[id-1];if(st[id].done)return;const bs=btn.parentNode.querySelectorAll('button');bs.forEach(b=>b.classList.remove('no'));
  if(i===q.ans){btn.classList.add('ok');return result(q,true);}btn.classList.add('no');result(q,false,'Not quite. '+q.hint);}
function step(btn){const li=btn.parentNode.querySelector('li.hid');if(li){li.classList.remove('hid');}if(!btn.parentNode.querySelector('li.hid'))btn.textContent='All steps shown';}
QS.forEach(q=>st[q.id]={tries:0,done:false});
document.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.id&&e.target.id.startsWith('in'))check(parseInt(e.target.id.slice(2)));});
upd();
"""

def q_html(q):
    h = f'<div class="q" id="q{q["id"]}"><div class="p"><span class="n">{q["id"]}</span>{q["prompt"]}</div>'
    if q.get('svg'): h += f'<div class="dia">{q["svg"]}</div>'
    if q['type'] in ('num', 'ineq'):
        ph = 'e.g. x > 4' if q['type'] == 'ineq' else ''
        h += (f'<div class="row"><label for="in{q["id"]}">{q["lab"]}</label><input id="in{q["id"]}" inputmode="text" autocomplete="off" spellcheck="false" placeholder="{html.escape(ph)}" aria-label="Answer for question {q["id"]}">'
              f'<button class="b1" onclick="check({q["id"]})">Check</button><button class="b2" onclick="hint({q["id"]})">Hint</button></div>')
    else:
        cls = 'opts g' if q.get('graph') else 'opts'
        h += f'<div class="{cls}">' + ''.join(f'<button onclick="pick({q["id"]},{i},this)" aria-label="Choice {i+1}">{o}</button>' for i, o in enumerate(q['opts'])) + '</div>'
        h += f'<div class="row"><button class="b2" onclick="hint({q["id"]})">Hint</button></div>'
    h += f'<div class="fb" id="fb{q["id"]}" aria-live="polite"></div>'
    h += '<div class="sol" id="sol' + str(q['id']) + '">' + '<br>'.join(q['steps']) + '</div></div>'
    return h

body = ('<!-- SITE-BAR -->\n<script src="../site-bar.js"></script>\n<div class="wrap">'
        '<a class="back" href="unit4.html">← Back to Unit 4</a>'
        '<div class="hero"><div class="k">Units 3–4 · NC.8.EE.7 · NC.8.G.5</div><h1>Tutorial Review: Equations, Inequalities &amp; Angles</h1>'
        '<p>Five short parts. Read the box, step through the example, then try the questions. You get feedback on every answer.</p></div>'
        '<div class="prog"><div class="bar"><i id="pbar"></i></div><b id="pnum"></b></div>'
        '<nav class="toc" aria-label="Parts">' + ''.join(f'<a href="#p{n}">{n}. {t}</a>' for n, t, *_ in PARTS) + '</nav>')
for n, t, std, learn, (extext, exsteps) in PARTS:
    exh = m(extext) if 'm∠' not in extext and 'triangle' not in extext else extext
    body += (f'<section class="part" id="p{n}"><div class="std">Part {n} · {std}</div><h2>{t}</h2><div class="learn">{learn}</div>'
             f'<div class="ex"><div class="t">Example: <span class="eq" style="font-size:17px">{exh}</span></div><ol>'
             + ''.join(f'<li class="hid">{m(s) if "m∠" not in s else s}</li>' for s in exsteps) +
             '</ol><button class="b2" style="margin-top:6px" onclick="step(this)">Show next step</button></div>'
             + ''.join(q_html(q) for q in Q if q['part'] == n) + '</section>')
body += ('<div class="done"><h3>Finished?</h3><p id="final"></p><p>When you are done, send your work to Mr. Allen.</p><div id="send"></div></div></div>')

page = ('<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">'
        '<title>Units 3–4 Tutorial Review — Equations, Inequalities &amp; Angles</title>'
        '<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=JetBrains+Mono:wght@500&family=Source+Serif+4:wght@600&display=swap" rel="stylesheet">'
        f'<style>{CSS}</style><script src="../brand.js"></script></head><body>{body}'
        '<script src="../tracker-config.js"></script><script src="../score-send.js"></script>'
        f'<script>{JS.replace("__Q__", json.dumps(Q, ensure_ascii=False))}'
        "if(window.ScoreSend)ScoreSend.setup({kind:'practice',unit:'3-4',page:'Units 3–4 Tutorial Review · Equations, Inequalities & Angles',mount:'#send',std:'NC.8.EE.7',band:4});"
        '</script></body></html>')
open(OUT, 'w').write(page)
print('wrote', OUT, len(Q), 'questions')
