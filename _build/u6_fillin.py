# -*- coding: utf-8 -*-
"""
Rebuild Unit_6_Tables_And_Systems_FillIn.pdf.

Every line of the original worksheet is reproduced verbatim. What is NEW:
  * three case graphs under "Three Possible Outcomes"
  * practice problems 7-9 (graph-and-solve, and one "how many solutions")
Running header/footer come from Playwright templates, as in the original.
"""
import sys, io
sys.path.insert(0, '/home/claude/mr-allen-s-math-class/_build')
import u6grid as G

N, D = G.NAVY, G.GOLD
MINUS = u'−'


PRINT_RULE = '#C3CDDC'   # the web grey vanishes on paper


def blankgrid(uid):
    return G.blank(uid, rule=PRINT_RULE)


def casegrid(uid, lines, dots, note):
    return G.plane(uid, lines, dots, note=note, rule=PRINT_RULE)


CSS = u"""
:root{--navy:#1E2D4F;--gold:#C8A951;--gold2:#b08800;--ink:#1f2730;--soft:#5D6673;
  --rule:#d9cfb8;--panel:#f7f4ec;--green:#1F7A4D;
  --sans:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
  --mono:"SFMono-Regular",Consolas,Menlo,"DejaVu Sans Mono",monospace;}
*{box-sizing:border-box}
body{margin:0;font-family:var(--sans);font-size:11.3px;line-height:1.5;color:var(--ink)}
p{margin:5px 0}
b,strong{color:var(--navy)}
.nd{display:flex;gap:40px;margin:2px 0 16px;font-size:11.5px}
.nd div{flex:1;display:flex;align-items:flex-end;gap:8px}
.nd .ln{flex:1;border-bottom:1px solid #9aa2ad;height:15px}
.eyebrow{font-family:var(--mono);font-size:9.5px;letter-spacing:.14em;text-transform:uppercase;
  color:var(--gold2);font-weight:700;margin:0 0 2px}
h1{font-size:23px;margin:0 0 2px;color:var(--navy);font-weight:700;letter-spacing:-.01em}
.lede{font-style:italic;color:var(--gold2);margin:0 0 4px;font-size:11.5px}
.rule{border:0;border-top:2px solid var(--gold);margin:7px 0 14px}
.sec{display:flex;align-items:stretch;margin:18px 0 9px;page-break-after:avoid;break-after:avoid}
.sec .n{background:var(--gold);color:#fff;font-weight:700;font-size:16px;width:34px;
  display:flex;align-items:center;justify-content:center}
.sec .t{background:var(--navy);color:#fff;font-weight:700;font-size:14.5px;
  padding:8px 14px;flex:1;display:flex;align-items:center}
h3{font-size:13px;color:var(--navy);margin:14px 0 4px;page-break-after:avoid;break-after:avoid}
h4{font-size:11.8px;color:var(--navy);margin:11px 0 3px;page-break-after:avoid;break-after:avoid}
.steps{background:#eaf4ee;border-left:3px solid var(--green);padding:8px 12px;margin:8px 0}
.steps .lab{font-family:var(--mono);font-size:9px;letter-spacing:.12em;color:var(--green);
  font-weight:700;margin-bottom:3px}
.steps ol{margin:0;padding-left:18px} .steps li{margin:1px 0}
.tip{background:var(--panel);border-left:3px solid var(--gold);padding:8px 12px;margin:9px 0}
.tip .lab{font-family:var(--mono);font-size:9px;letter-spacing:.12em;color:var(--gold2);
  font-weight:700;margin-bottom:3px}
.eqbox{display:inline-block;border:1px solid var(--rule);margin:5px 0 7px}
.eqbox .r{display:flex;align-items:stretch;border-bottom:1px solid var(--rule)}
.eqbox .r:last-child{border-bottom:0}
.eqbox .tag{background:var(--gold);color:#fff;font-family:var(--mono);font-size:8.5px;
  font-weight:700;padding:5px 7px;display:flex;align-items:center;letter-spacing:.06em}
.eqbox .v{font-family:var(--mono);font-size:12.5px;padding:5px 18px 5px 11px;min-width:128px}
.fml{background:var(--navy);color:#fff;font-family:var(--mono);font-size:12px;
  padding:7px 12px;margin:7px 0;text-align:center}
.cols{display:flex;gap:18px;align-items:flex-start;margin:6px 0}
.cols>div{flex:1}
.mono{font-family:var(--mono)}
table.data{border-collapse:collapse;font-size:11px;margin:4px 0}
table.data th{background:var(--navy);color:#fff;padding:4px 16px;font-weight:600;font-size:10.5px}
table.data td{border:1px solid var(--rule);padding:3px 16px;text-align:center}
table.data tr:nth-child(even) td{background:#faf8f2}
table.cases{border-collapse:collapse;width:100%;font-size:11px;margin:5px 0}
table.cases th{background:var(--navy);color:#fff;padding:5px 9px;font-weight:600;font-size:10.5px;
  text-align:left}
table.cases th:first-child{text-align:center;width:46px}
table.cases td{border:1px solid var(--rule);padding:5px 9px}
table.cases td:first-child{text-align:center;font-weight:700;color:var(--navy)}
table.cases td:last-child{font-family:var(--mono);color:var(--gold2)}
table.cases tr:nth-child(even) td{background:#faf8f2}
.gridrow{display:flex;gap:10px;justify-content:center;margin:9px 0;page-break-inside:avoid}
.gridrow>div{flex:1;max-width:172px;text-align:center}
.gridrow .cap{font-family:var(--mono);font-size:8.6px;font-weight:700;letter-spacing:.05em;
  text-transform:uppercase;margin-bottom:2px}
.gridrow svg{width:100%;height:auto}
.gw{width:228px} .gw svg{width:100%;height:auto}
.prob{page-break-inside:avoid;break-inside:avoid;margin:13px 0 0}
.prob>.q{font-weight:700;color:var(--navy);margin-bottom:3px;font-size:11.8px}
.ans{font-family:var(--mono);font-size:11.5px;line-height:2.0}
.phead{background:var(--navy);color:#fff;font-weight:700;font-size:13px;padding:7px 13px;
  margin:20px 0 3px;letter-spacing:.02em}
.psub{font-style:italic;color:var(--soft);margin:0 0 6px}
@page{size:Letter;margin:0.62in 0.6in 0.56in 0.6in}
@media print{
  body{font-size:11.3px}
  .sec,.prob,.gridrow,.steps,.tip,.eqbox{page-break-inside:avoid}
  .newpage{page-break-before:always}
}
"""


def eqbox(e1, e2):
    return (u'<div class="eqbox">'
            u'<div class="r"><div class="tag">EQ 1</div><div class="v">%s</div></div>'
            u'<div class="r"><div class="tag">EQ 2</div><div class="v">%s</div></div>'
            u'</div>' % (e1, e2))


def U(n=5):
    return u'_' * n


B = []
A = B.append

# ───────────────────────── page 1 ─────────────────────────
A(u'<div class="nd"><div><span>Name:</span><span class="ln"></span></div>'
  u'<div><span>Date:</span><span class="ln"></span></div></div>')
A(u'<p class="eyebrow">Unit 6 · Functions · Guided Notes</p>')
A(u'<h1>Tables &amp; Systems of Equations</h1>')
A(u'<p class="lede">Fill in the blanks. Practice problems at the end.</p>')
A(u'<hr class="rule">')

A(u'<div class="sec"><span class="n">1</span><span class="t">Writing Linear Equations from a Table</span></div>')
A(u'<p>Every linear equation can be written as y = _____ x + _____ , where m is the ________ '
  u'(rate of change) and b is the ________ (the y-value when x = 0).</p>')
A(u'<div class="fml">m = (y<sub>2</sub> &#8722; y<sub>1</sub>) ÷ (x<sub>2</sub> &#8722; x<sub>1</sub>) '
  u'= change in y ÷ change in x</div>')

A(u'<h4>Example 1 · Table includes x = 0</h4>')
A(u'<div class="cols"><div style="flex:0 0 auto">'
  u'<table class="data"><tr><th>x</th><th>y</th></tr>'
  u'<tr><td>0</td><td>3</td></tr><tr><td>1</td><td>7</td></tr>'
  u'<tr><td>2</td><td>11</td></tr><tr><td>3</td><td>15</td></tr></table></div>'
  u'<div class="ans"><b>Step 1.</b> From (0, 3) to (1, 7):<br>'
  u'&nbsp;&nbsp;change in y = ___, change in x = ___<br>'
  u'&nbsp;&nbsp;slope m = ___<br>'
  u'<b>Step 2.</b> When x = 0, y = ___. So b = ___.<br>'
  u'<b>Step 3.</b> Equation: y = _____ x + _____</div></div>')

A(u'<h4>Example 2 · No x = 0 row — work backwards for b</h4>')
A(u'<div class="cols"><div style="flex:0 0 auto">'
  u'<table class="data"><tr><th>x</th><th>y</th></tr>'
  u'<tr><td>2</td><td>5</td></tr><tr><td>4</td><td>11</td></tr>'
  u'<tr><td>6</td><td>17</td></tr><tr><td>8</td><td>23</td></tr></table></div>'
  u'<div class="ans"><b>Step 1.</b> From (2, 5) to (4, 11):<br>'
  u'&nbsp;&nbsp;change in y = ___, change in x = ___. m = ___.<br>'
  u'<b>Step 2.</b> Use b = y &#8722; m·x. Pick (2, 5):<br>'
  u'&nbsp;&nbsp;b = ___ &#8722; (___)(___) = ___<br>'
  u'<b>Step 3.</b> Equation: y = _____ x + _____</div></div>')

A(u'<div class="tip"><div class="lab">Shortcut for finding b</div>'
  u'Once you know m, pick any row (x, y). Then: <span class="mono">b = y &#8722; m · x</span></div>')

# ───────────────────────── page 2 ─────────────────────────
A(u'<div class="newpage"></div>')
A(u'<div class="sec"><span class="n">2</span><span class="t">Solving Systems of Equations by Graphing</span></div>')
A(u'<p>A system of equations is ___ or more equations that use the same ________. In 8th grade, '
  u'we work with systems of two linear equations in x and y.</p>')
A(u'<h3>Graphing Method</h3>')
A(u'<p>Graph each line on the same coordinate plane. The solution is the ________ point.</p>')
A(u'<div class="steps"><div class="lab">Steps</div><ol>'
  u'<li>Graph the first line (using slope and y-intercept).</li>'
  u'<li>Graph the second line on the same plane.</li>'
  u'<li>Find where they ________. That ordered pair is the solution.</li>'
  u'<li>Check by plugging the point into both equations.</li></ol></div>')
A(u'<h4>Example · Graph and solve</h4>')
A(eqbox(u'y = x + 2', u'y = ' + MINUS + u'x + 4'))
A(u'<div class="cols"><div class="gw" style="flex:0 0 auto">' + blankgrid('wex') + u'</div>'
  u'<div class="ans"><b>EQ 1:</b> y = x + 2<br>'
  u'&nbsp;&nbsp;slope = ___,&nbsp; y-int = ___<br>'
  u'<b>EQ 2:</b> y = ' + MINUS + u'x + 4<br>'
  u'&nbsp;&nbsp;slope = ___,&nbsp; y-int = ___<br>'
  u'<b>Solution (intersection):</b><br>'
  u'&nbsp;&nbsp;( ____ , ____ )<br>'
  u'<b>Check:</b><br>'
  u'&nbsp;&nbsp;EQ 1: ___ = ___ + 2<br>'
  u'&nbsp;&nbsp;EQ 2: ___ = &#8722;___ + 4</div></div>')

A(u'<h3>Three Possible Outcomes</h3>')
A(u'<table class="cases">'
  u'<tr><th>Case</th><th>What You See</th><th>How Many Solutions?</th></tr>'
  u'<tr><td>1</td><td>Lines cross at one point</td><td>_____ solution</td></tr>'
  u'<tr><td>2</td><td>Lines are ________ (never cross)</td><td>_____ solutions</td></tr>'
  u'<tr><td>3</td><td>Both equations graph the same line</td><td>________ solutions</td></tr>'
  u'</table>')
# NEW: a picture for each case
A(u'<div class="gridrow">'
  u'<div><div class="cap" style="color:#1B2A4A">Case 1</div>' +
  casegrid('wc1', [(1, -1, N, u'y = x ' + MINUS + u' 1'), (-1, 3, D, u'y = ' + MINUS + u'x + 3')],
           [(2, 1, '(2, 1)')], 'They cross once') + u'</div>'
  u'<div><div class="cap" style="color:#B07D00">Case 2</div>' +
  casegrid('wc2', [(0.5, 2, N, u'y = ½x + 2'), (0.5, -2, D, u'y = ½x ' + MINUS + u' 2')],
           [], u'Parallel — never cross') + u'</div>'
  u'<div><div class="cap" style="color:#1F7A4D">Case 3</div>' +
  casegrid('wc3', [(2, 1, N, 'y = 2x + 1'), (2, 1, D, 'y = 2x + 1', True)],
           [], 'One line, drawn twice') + u'</div>'
  u'</div>')
A(u'<p style="text-align:center;color:var(--soft);font-size:10.5px;margin-top:0">'
  u'Count the intersection points: one point → one solution, zero points → no solution, '
  u'every point → infinitely many.</p>')

# ───────────────────────── page 3 ─────────────────────────
A(u'<div class="sec"><span class="n">3</span><span class="t">What Does &ldquo;Solution&rdquo; Actually Mean?</span></div>')
A(u'<p>A solution to a system of equations is an ordered pair (x, y) that makes ________ equations '
  u'________ at the same time.</p>')
A(u'<div class="tip"><div class="lab">Two ways to say it</div>'
  u'• <b>Graphically:</b> the solution is the ________ where the lines cross.<br>'
  u'• <b>Algebraically:</b> the solution is the (x, y) that, when plugged in, makes ________ '
  u'equations true.</div>')
A(u'<h3>Testing Whether a Point Is a Solution</h3>')
A(u'<p>Plug x and y into ________ equation. If the point makes ________ equations true, it is a '
  u'solution. If it fails even one, it is not a solution.</p>')
A(u'<h4>Example · Is (2, 5) a solution?</h4>')
A(eqbox(u'y = 2x + 1', u'y = 3x ' + MINUS + u' 1'))
A(u'<div class="ans">'
  u'<b>1</b>&nbsp; Test EQ 1 with x = 2, y = 5: ___ = 2(___) + 1 = ___. True? _____<br>'
  u'<b>2</b>&nbsp; Test EQ 2 with x = 2, y = 5: ___ = 3(___) &#8722; 1 = ___. True? _____<br>'
  u'<b>3</b>&nbsp; Both true, so (2, 5) ________ a solution.</div>')
A(u'<div class="tip"><div class="lab">Takeaway</div>'
  u'You cannot tell just by looking at a point. Always test ________ equations.</div>')

A(u'<div class="sec"><span class="n">4</span><span class="t">Solving Systems by Substitution</span></div>')
A(u'<p>Graphing shows the solution but is slow and hard to read when answers aren’t whole '
  u'numbers. Substitution is algebraic — it always gives an exact answer.</p>')
A(u'<div class="steps"><div class="lab">Substitution procedure</div><ol>'
  u'<li>One equation should be solved for a variable (usually y = ...).</li>'
  u'<li>Substitute the expression into the ________ equation.</li>'
  u'<li>Solve that equation for ___.</li>'
  u'<li>Plug that value back in to find the ________ variable.</li>'
  u'<li>Write the solution as an ________ pair (x, y) and check.</li></ol></div>')
A(u'<h4>Example 1 · Both equations in y = form</h4>')
A(eqbox(u'y = 2x + 3', u'y = ' + MINUS + u'x + 6'))
A(u'<div class="ans">'
  u'<b>1</b>&nbsp; Both equations equal y, so they equal each other: _____ = &#8722;x + 6<br>'
  u'<b>2</b>&nbsp; Solve for x. Add x: 3x + 3 = 6. Subtract 3: 3x = ___. Divide: x = ___.<br>'
  u'<b>3</b>&nbsp; Back-substitute into EQ 1: y = 2(___) + 3 = ___.<br>'
  u'<b>4</b>&nbsp; Solution: ( ___ , ___ )</div>')

# ───────────────────────── page 4 ─────────────────────────
A(u'<div class="newpage"></div>')
A(u'<h4>Example 2 · One equation in y = form, one not</h4>')
A(eqbox(u'y = 3x ' + MINUS + u' 1', u'2x + y = 9'))
A(u'<div class="ans">'
  u'<b>1</b>&nbsp; EQ 1 is already solved for y: y = _____<br>'
  u'<b>2</b>&nbsp; Substitute ( _____ ) for y in EQ 2: 2x + ( _____ ) = 9<br>'
  u'<b>3</b>&nbsp; Combine like terms: ___x &#8722; 1 = 9. Add 1: 5x = ___. Divide: x = ___.<br>'
  u'<b>4</b>&nbsp; Back-substitute: y = 3(___) &#8722; 1 = ___.<br>'
  u'<b>5</b>&nbsp; Solution: ( ___ , ___ )</div>')

A(u'<div class="phead">Practice Problems</div>')
A(u'<p class="psub">Show your work. Check your answers.</p>')

A(u'<div class="prob"><div class="q">1. Write the linear equation for this table.</div>'
  u'<div class="cols"><div style="flex:0 0 auto">'
  u'<table class="data"><tr><th>x</th><th>y</th></tr>'
  u'<tr><td>0</td><td>&#8722;4</td></tr><tr><td>1</td><td>&#8722;1</td></tr>'
  u'<tr><td>2</td><td>2</td></tr><tr><td>3</td><td>5</td></tr></table></div>'
  u'<div class="ans">slope m = ___<br>y-intercept b = ___<br><br>'
  u'Equation: y = _____ x + _____</div></div></div>')

A(u'<div class="prob"><div class="q">2. Write the linear equation for this table. (no x = 0 row)</div>'
  u'<div class="cols"><div style="flex:0 0 auto">'
  u'<table class="data"><tr><th>x</th><th>y</th></tr>'
  u'<tr><td>2</td><td>7</td></tr><tr><td>4</td><td>13</td></tr>'
  u'<tr><td>6</td><td>19</td></tr><tr><td>8</td><td>25</td></tr></table></div>'
  u'<div class="ans">slope m = ___<br>'
  u'Use b = y &#8722; m·x with (___, ___): b = ___ &#8722; (___)(___) = ___<br><br>'
  u'Equation: y = _____ x + _____</div></div></div>')

A(u'<div class="prob"><div class="q">3. Is (3, 5) a solution to this system? '
  u'Show your work. Circle YES or NO.</div>'
  + eqbox(u'y = 2x ' + MINUS + u' 1', u'y = ' + MINUS + u'x + 8') +
  u'<div class="ans">EQ 1 test: ___ = 2(___) &#8722; 1 = ___&nbsp;&nbsp;True or False? _____<br>'
  u'EQ 2 test: ___ = &#8722;(___) + 8 = ___&nbsp;&nbsp;True or False? _____<br>'
  u'Final answer (circle):&nbsp; YES&nbsp; /&nbsp; NO</div></div>')

# ───────────────────────── page 5 ─────────────────────────
A(u'<div class="prob"><div class="q">4. Solve this system by graphing on the grid below.</div>'
  + eqbox(u'y = x + 1', u'y = ' + MINUS + u'x + 5') +
  u'<div class="cols"><div class="gw" style="flex:0 0 auto">' + blankgrid('wp4') + u'</div>'
  u'<div class="ans">EQ 1 slope = ___, y-int = ___<br>'
  u'EQ 2 slope = ___, y-int = ___<br><br>'
  u'Solution: ( ____ , ____ )<br><br>'
  u'<b>Check:</b><br>'
  u'&nbsp;&nbsp;EQ 1: ___ = ___ + 1<br>'
  u'&nbsp;&nbsp;EQ 2: ___ = &#8722;___ + 5</div></div></div>')

A(u'<div class="prob"><div class="q">5. Solve by substitution.</div>'
  + eqbox(u'y = x + 3', u'y = 2x ' + MINUS + u' 1') +
  u'<div class="ans">Set equal: _____ = 2x &#8722; 1<br>'
  u'Solve for x:&nbsp; x = ___<br>'
  u'Find y:&nbsp; y = ___ + 3 = ___<br>'
  u'Solution: ( ____ , ____ )</div></div>')

A(u'<div class="prob"><div class="q">6. Solve by substitution. '
  u'<i>(One equation needs a quick substitution.)</i></div>'
  + eqbox(u'y = 3x + 2', u'x + y = 10') +
  u'<div class="ans">Substitute ( _____ ) for y in the second equation:&nbsp; x + ( _____ ) = 10<br>'
  u'Combine: ___x + ___ = 10<br>'
  u'Solve for x:&nbsp; x = ___<br>'
  u'Find y:&nbsp; y = 3(___) + 2 = ___<br>'
  u'Solution: ( ____ , ____ )</div></div>')

# ───────────────────────── page 6 (NEW) ─────────────────────────
A(u'<div class="prob"><div class="q">7. Solve this system by graphing on the grid below.</div>'
  + eqbox(u'y = 2x ' + MINUS + u' 3', u'y = x + 1') +
  u'<div class="cols"><div class="gw" style="flex:0 0 auto">' + blankgrid('wp7') + u'</div>'
  u'<div class="ans">EQ 1 slope = ___, y-int = ___<br>'
  u'EQ 2 slope = ___, y-int = ___<br><br>'
  u'Solution: ( ____ , ____ )<br><br>'
  u'<b>Check:</b><br>'
  u'&nbsp;&nbsp;EQ 1: ___ = 2(___) &#8722; 3<br>'
  u'&nbsp;&nbsp;EQ 2: ___ = ___ + 1</div></div></div>')

A(u'<div class="prob"><div class="q">8. Solve this system by graphing on the grid below.</div>'
  + eqbox(u'y = ⅓x + 1', u'y = ' + MINUS + u'x + 5') +
  u'<div class="cols"><div class="gw" style="flex:0 0 auto">' + blankgrid('wp8') + u'</div>'
  u'<div class="ans">EQ 1 slope = ___, y-int = ___<br>'
  u'EQ 2 slope = ___, y-int = ___<br><br>'
  u'Solution: ( ____ , ____ )<br><br>'
  u'<b>Check:</b><br>'
  u'&nbsp;&nbsp;EQ 1: ___ = ⅓(___) + 1<br>'
  u'&nbsp;&nbsp;EQ 2: ___ = &#8722;___ + 5</div></div></div>')

A(u'<div class="prob"><div class="q">9. One, none, or infinitely many? '
  u'Compare the slopes and y-intercepts first — you do not need to graph these.</div>'
  u'<div class="ans">'
  u'a)&nbsp; y = 2x + 1&nbsp; and&nbsp; y = 2x &#8722; 4&nbsp;&nbsp;&rarr;&nbsp; '
  u'slopes ____ and ____ , y-intercepts ____ and ____ &nbsp;&rarr;&nbsp; ______________ solution(s)<br>'
  u'b)&nbsp; y = 3x &#8722; 2&nbsp; and&nbsp; y = &#8722;x + 2&nbsp;&nbsp;&rarr;&nbsp; '
  u'slopes ____ and ____ , y-intercepts ____ and ____ &nbsp;&rarr;&nbsp; ______________ solution(s)<br>'
  u'c)&nbsp; y = &#8722;½x + 3&nbsp; and&nbsp; y = &#8722;½x + 3&nbsp;&nbsp;&rarr;&nbsp; '
  u'slopes ____ and ____ , y-intercepts ____ and ____ &nbsp;&rarr;&nbsp; ______________ solution(s)'
  u'</div></div>')
A(u'<div class="tip"><div class="lab">Remember</div>'
  u'Different slopes → the lines cross once. Same slope, different y-intercept → parallel, '
  u'never cross. Same slope <i>and</i> same y-intercept → one line written twice.</div>')

HTML = (u'<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">'
        u'<title>Tables &amp; Systems of Equations — Guided Notes</title>'
        u'<style>%s</style></head><body>%s</body></html>' % (CSS, u''.join(B)))

out = '/home/claude/mr-allen-s-math-class/_build/u6_fillin.html'
io.open(out, 'w', encoding='utf-8').write(HTML)
print('wrote', out, len(HTML), 'chars')
