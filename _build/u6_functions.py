# -*- coding: utf-8 -*-
"""Add a 6.1 Functions tab to Unit_6_Functions_Guided_Notes.html (and point the 6.1 card at it)."""
import io, math

F = '/home/claude/mr-allen-s-math-class/grade8/Unit_6_Functions_Guided_Notes.html'
NAVY, BLUE, GOLD, GREEN, RED, GREY = '#1E2D4F', '#0056B3', '#b08800', '#1F7A4D', '#cc2222', '#8a93a6'


def mapping(inputs, outputs, arrows, bad=(), title=''):
    """Two ovals, arrows from inputs to outputs. bad = input values whose arrows are drawn red."""
    W, H = 260, 200
    lx, rx = 60, 200
    def ys(n): return [60 + i * (110 / max(1, n - 1)) if n > 1 else 115 for i in range(n)]
    yi, yo = dict(zip(inputs, ys(len(inputs)))), dict(zip(outputs, ys(len(outputs))))
    o = ['<svg viewBox="0 0 %d %d" width="%d" height="%d" role="img" aria-label="%s" xmlns="http://www.w3.org/2000/svg">' % (W, H, W, H, title)]
    o.append('<defs><marker id="ah%s" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="%s"/></marker>'
             '<marker id="ahr%s" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="%s"/></marker></defs>'
             % (title[:6].replace(' ', ''), NAVY, title[:6].replace(' ', ''), RED))
    for cx, lab in ((lx, 'Input (x)'), (rx, 'Output (y)')):
        o.append('<ellipse cx="%d" cy="115" rx="34" ry="78" fill="#f4f7fc" stroke="%s" stroke-width="2"/>' % (cx, NAVY))
        o.append('<text x="%d" y="22" text-anchor="middle" font-size="12" font-weight="bold" fill="%s">%s</text>' % (cx, NAVY, lab))
    for a, b in arrows:
        col, mk = (RED, 'ahr') if a in bad else (NAVY, 'ah')
        o.append('<line x1="%d" y1="%.1f" x2="%d" y2="%.1f" stroke="%s" stroke-width="2" marker-end="url(#%s%s)"/>'
                 % (lx + 14, yi[a], rx - 16, yo[b], col, mk, title[:6].replace(' ', '')))
    for v, y in yi.items():
        o.append('<text x="%d" y="%.1f" text-anchor="middle" font-size="15" font-weight="bold" fill="%s">%s</text>' % (lx - 4, y + 5, RED if v in bad else NAVY, v))
    for v, y in yo.items():
        o.append('<text x="%d" y="%.1f" text-anchor="middle" font-size="15" font-weight="bold" fill="%s">%s</text>' % (rx + 4, y + 5, NAVY, v))
    o.append('</svg>')
    return ''.join(o)


def plane(draw, title, hits=(), vx=None, lim=5, size=210):
    """Coordinate grid (explicit lines, so it prints) with a curve, an optional dashed vertical line and red hit dots."""
    c = size / (2 * lim + 2); O = size / 2
    X = lambda x: O + x * c
    Y = lambda y: O - y * c
    o = ['<svg viewBox="0 0 %d %d" width="%d" height="%d" role="img" aria-label="%s" xmlns="http://www.w3.org/2000/svg">' % (size, size, size, size, title)]
    for i in range(-lim, lim + 1):
        o.append('<line x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f" stroke="#d7def0" stroke-width="1"/>' % (X(i), Y(lim), X(i), Y(-lim)))
        o.append('<line x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f" stroke="#d7def0" stroke-width="1"/>' % (X(-lim), Y(i), X(lim), Y(i)))
    o.append('<line x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f" stroke="%s" stroke-width="1.6"/>' % (X(-lim), Y(0), X(lim), Y(0), NAVY))
    o.append('<line x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f" stroke="%s" stroke-width="1.6"/>' % (X(0), Y(lim), X(0), Y(-lim), NAVY))
    pts = draw()
    o.append('<polyline points="%s" fill="none" stroke="%s" stroke-width="2.6" stroke-linejoin="round"/>' % (' '.join('%.1f,%.1f' % (X(x), Y(y)) for x, y in pts), BLUE))
    if vx is not None:
        o.append('<line x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f" stroke="%s" stroke-width="2" stroke-dasharray="6 4"/>' % (X(vx), Y(lim), X(vx), Y(-lim), GOLD))
    for x, y in hits:
        o.append('<circle cx="%.1f" cy="%.1f" r="5" fill="%s" stroke="#fff" stroke-width="1.5"/>' % (X(x), Y(y), RED))
    o.append('</svg>')
    return ''.join(o)


def fill(qid, ans, cls='narrow'):
    return ('<input type="text" class="fill %s" data-qid="%s" data-answer="%s" autocomplete="off">'
            '<button type="button" class="btn-show" data-target="%s" onclick="showFill(\'%s\')">show</button>' % (cls, qid, ans, qid, qid))


def why(text):
    return '<details style="margin-top:6px"><summary style="cursor:pointer;color:#0056B3;font-weight:600">Why?</summary><p style="margin:6px 0 0">%s</p></details>' % text


fn_map = mapping(['1', '2', '3', '4'], ['5', '7', '9'], [('1', '5'), ('2', '7'), ('3', '9'), ('4', '9')], title='Function mapping')
not_map = mapping(['1', '2', '3'], ['4', '6', '8'], [('1', '4'), ('2', '6'), ('2', '8'), ('3', '8')], bad=('2',), title='Not a function mapping')
line_g = plane(lambda: [(-5, -3.5), (5, 1.5)], 'Line y = 0.5x - 1 with a vertical line touching it once', hits=[(2, 0)], vx=2)
side_g = plane(lambda: [(y * y / 4.0, y) for y in [i / 4.0 for i in range(-18, 19)]], 'Sideways curve x = y squared over 4 with a vertical line touching it twice',
               hits=[(4, 4), (4, -4)], vx=4)
circle_g = plane(lambda: [(3 * math.cos(t * math.pi / 30), 3 * math.sin(t * math.pi / 30)) for t in range(61)], 'Circle of radius 3', lim=5, size=180)
v_g = plane(lambda: [(-4, 4), (0, 0), (4, 4)], 'V shape y = absolute value of x', lim=5, size=180)

SECTION = '''
<div class="tab-pane active" id="tab-6-1">
<div class="sec-head">
  <span class="sec-num">6.1</span>
  <h2 class="sec-title">Functions</h2>
</div>
<p class="sec-standard">NC.8.F.1 &mdash; A function is a rule that gives each input exactly one output.</p>

<div class="sec-progress">
  <span><strong id="prog-6-1-count">0</strong> of <strong id="prog-6-1-total">0</strong> filled</span>
  <div class="bar"><div class="fill-bar" id="prog-6-1-bar"></div></div>
</div>

<div class="intro">
  <strong>What is this section about?</strong> A function is like a vending machine. You press one button (the input). You get one snack (the output). If one button ever gave you two different snacks, the machine would be broken. That broken machine is <em>not</em> a function.
</div>

<div class="concept">
  <h3 class="concept-h">The Rule</h3>
  <div class="fill-row">
    <p>A function gives each input exactly ''' + fill('6-1-1', 'one') + ''' output.</p>
    <p>The input is usually ''' + fill('6-1-2', 'x') + '''. The output is usually ''' + fill('6-1-3', 'y') + '''.</p>
  </div>
  <div class="key-fact"><strong>💡 Outputs may repeat.</strong> Two inputs can share the same output. Only an <em>input</em> with two different outputs breaks the rule.</div>
</div>

<div class="concept">
  <h3 class="concept-h">See It: Mapping Diagrams</h3>
  <div class="two-col">
    <div style="text-align:center">''' + fn_map + '''
      <p style="margin:4px 0 0"><strong style="color:#1F7A4D">Function ✓</strong><br>Each input has one arrow. 3 and 4 share the output 9. That is fine.</p></div>
    <div style="text-align:center">''' + not_map + '''
      <p style="margin:4px 0 0"><strong style="color:#cc2222">Not a function ✗</strong><br>The input 2 has two arrows: one to 6 and one to 8.</p></div>
  </div>
</div>

<div class="example">
  <p><strong>Worked example:</strong> Is this a function? &nbsp;(1, 4), (2, 5), (3, 4), (2, 6)</p>
  <div class="work">
    <div><strong>Step 1.</strong> List the inputs (the first numbers): 1, 2, 3, 2.</div>
    <div><strong>Step 2.</strong> Look for an input that shows up twice. The input 2 shows up twice.</div>
    <div><strong>Step 3.</strong> Check its outputs. (2, 5) and (2, 6): the input 2 has two different outputs.</div>
    <div><strong>Step 4.</strong> So this is <strong>not</strong> a function.</div>
  </div>
</div>

<div class="concept">
  <h3 class="concept-h">The Vertical Line Test (for graphs)</h3>
  <div class="fill-row">
    <p>Slide a vertical line across the graph. If it ever touches the graph more than ''' + fill('6-1-4', 'once') + ''', the graph is not a function.</p>
  </div>
  <div class="two-col">
    <div style="text-align:center">''' + line_g + '''
      <p style="margin:4px 0 0"><strong style="color:#1F7A4D">Function ✓</strong><br>Every vertical line touches it once.</p></div>
    <div style="text-align:center">''' + side_g + '''
      <p style="margin:4px 0 0"><strong style="color:#cc2222">Not a function ✗</strong><br>The line at x = 4 touches it twice.</p></div>
  </div>
</div>

<div class="callout warning">
  <p><strong>Find the mistake.</strong> Jay says (1, 2), (2, 2), (3, 2) is <em>not</em> a function, because the 2 shows up three times. Is Jay right? Type yes or no: ''' + fill('6-1-5', 'no') + '''</p>
  ''' + why('Jay is looking at the outputs. Outputs are allowed to repeat. Every input (1, 2 and 3) has only one output, so it IS a function.') + '''
</div>

<div class="try-it">
  <p><strong>Practice 1:</strong> Is this table a function? Type yes or no.</p>
  <table class="data-table" style="margin:6px 0"><tr><th>x</th><td>1</td><td>2</td><td>3</td><td>4</td></tr><tr><th>y</th><td>3</td><td>5</td><td>7</td><td>9</td></tr></table>
  <div class="fill-row"><p>Function? ''' + fill('6-1-6', 'yes') + '''</p></div>
  ''' + why('No input repeats, so each input has one output.') + '''
</div>

<div class="try-it">
  <p><strong>Practice 2:</strong> (2, 1), (4, 3), (2, 5), (6, 7). Function? Type yes or no.</p>
  <div class="fill-row"><p>Function? ''' + fill('6-1-7', 'no') + '''</p></div>
  ''' + why('The input 2 goes to 1 and also to 5. One input, two outputs.') + '''
</div>

<div class="try-it">
  <p><strong>Practice 3:</strong> (&minus;1, 4), (0, 4), (1, 4), (2, 4). Function? Type yes or no.</p>
  <div class="fill-row"><p>Function? ''' + fill('6-1-8', 'yes') + '''</p></div>
  ''' + why('Every output is 4, but no input repeats. Repeated outputs are fine.') + '''
</div>

<div class="try-it">
  <p><strong>Practice 4 and 5:</strong> Use the vertical line test. Type yes or no for each graph.</p>
  <div class="two-col">
    <div style="text-align:center">''' + circle_g + '''<div class="fill-row"><p>Circle: function? ''' + fill('6-1-9', 'no') + '''</p></div>
      ''' + why('A vertical line at x = 0 touches the circle at the top and the bottom: two points.') + '''</div>
    <div style="text-align:center">''' + v_g + '''<div class="fill-row"><p>V shape: function? ''' + fill('6-1-10', 'yes') + '''</p></div>
      ''' + why('Any vertical line touches the V only once.') + '''</div>
  </div>
</div>
</div>
'''

h = io.open(F, encoding='utf-8').read()
assert 'id="tab-6-1"' not in h
# 6.1 becomes the first tab and the one that opens first
h = h.replace('<button class="tab-btn active" data-tab="tab-6-4"', '<button class="tab-btn" data-tab="tab-6-4"', 1)
h = h.replace('<div class="tab-pane active" id="tab-6-4">', '<div class="tab-pane" id="tab-6-4">', 1)
h = h.replace('<div class="tabs">\n',
              '<div class="tabs">\n<button class="tab-btn active" data-tab="tab-6-1" onclick="switchTab(\'tab-6-1\')"><span class="tab-num">6.1</span>Functions<span class="check">✓</span></button>', 1)
i = h.find('<div class="tab-pane" id="tab-6-4">')
h = h[:i] + SECTION.strip() + '\n\n' + h[i:]
# the 6.1 card used to send students back to the hub
old = '<a href="unit6.html" style="display:flex;align-items:center;gap:10px;text-decoration:none;background:#fff;border:2px solid #e4dcc8;border-left:5px solid #FFC107;border-radius:10px;padding:11px 14px;transition:.15s"><span style="font-family:Georgia,serif;font-weight:700;color:#1E2D4F;font-size:1.05rem;min-width:34px">6.1</span>'
new = '<a href="#" onclick="switchTab(\'tab-6-1\');return false;" style="display:flex;align-items:center;gap:10px;text-decoration:none;background:#fff;border:2px solid #e4dcc8;border-left:5px solid #FFC107;border-radius:10px;padding:11px 14px;transition:.15s"><span style="font-family:Georgia,serif;font-weight:700;color:#1E2D4F;font-size:1.05rem;min-width:34px">6.1</span>'
assert h.count(old) == 1
h = h.replace(old, new)
h = h.replace('Topics 6.4–6.6 are interactive on this page; 6.1, 6.2, 6.3, and 6.7 open their full guided-notes pages.',
              'Topics 6.1 and 6.4–6.6 are interactive on this page; 6.2, 6.3, and 6.7 open their full guided-notes pages.', 1)
# yes/no and word synonyms for the new blanks
h = h.replace("const SYNONYMS = {", "const SYNONYMS = {\n  'one': ['1','exactly one','only one'], 'once': ['one time','1 time','one','1'],\n  'yes': ['y','yes it is','function','it is a function'], 'no': ['n','not','no it is not','not a function','it is not'],\n  'x': ['input','x-value','x value'], 'y': ['output','y-value','y value'],", 1)
io.open(F, 'w', encoding='utf-8').write(h)
print('6.1 added')
