"""Reference diagrams for the Units 3-4 Tutorial Review. Each angle is drawn as a wedge with an id
(<prefix>-w1 … w8 for the transversal, <prefix>-wa … wd for the triangle) so step-solver.js can color it.
The prefix "__P__" is replaced on the page so one template can be mounted many times."""
import math

NAVY, GOLD = '#1E2D4F', '#E0A800'

def _ang(c, p):
    return math.degrees(math.atan2(p[1] - c[1], p[0] - c[0])) % 360

def wedge(c, p, q, r):
    """Path for the angle at c between rays c→p and c→q (the smaller one). Returns (path, bisector angle, span)."""
    a1, a2 = _ang(c, p), _ang(c, q)
    span = (a2 - a1) % 360
    if span > 180:
        a1, a2 = a2, a1
        span = 360 - span
    x1, y1 = c[0] + r * math.cos(math.radians(a1)), c[1] + r * math.sin(math.radians(a1))
    x2, y2 = c[0] + r * math.cos(math.radians(a2)), c[1] + r * math.sin(math.radians(a2))
    d = f'M{c[0]:.1f},{c[1]:.1f} L{x1:.1f},{y1:.1f} A{r},{r} 0 0 1 {x2:.1f},{y2:.1f} Z'
    return d, (a1 + span / 2) % 360, span

def _text(x, y, t, size=15, weight=700, fill=NAVY, italic=False, anchor='middle'):
    st = ' font-style="italic"' if italic else ''
    return (f'<text x="{x:.1f}" y="{y:.1f}" font-size="{size}" font-weight="{weight}" fill="{fill}" text-anchor="{anchor}" '
            f'dominant-baseline="middle" font-family="Inter, sans-serif"{st}>{t}</text>')

def para_ref(prefix='__P__', w=360, h=232, label_size=15, title='Parallel lines m and n cut by transversal t, angles numbered 1 to 8'):
    y1, y2 = 82, 162
    c1, c2 = (w * 0.42, y1), (w * 0.60, y2)
    dx, dy = c2[0] - c1[0], c2[1] - c1[1]
    top = (c1[0] - dx * 0.78, y1 - dy * 0.78)
    bot = (c1[0] + dx * 1.78, y1 + dy * 1.78)
    s = f'<svg viewBox="0 0 {w} {h}" width="{w}" height="{h}" role="img" aria-label="{title}" xmlns="http://www.w3.org/2000/svg">'
    s += f'<rect x="6" y="{y1}" width="{w-12}" height="{y2-y1}" fill="#F1F4FA"/>'
    s += _text(10, (y1 + y2) / 2, 'interior', 11, 600, '#7A8599', True, 'start')
    s += _text(10, y1 - 14, 'exterior', 11, 600, '#7A8599', True, 'start')
    s += _text(10, y2 + 16, 'exterior', 11, 600, '#7A8599', True, 'start')
    rays = {}
    for c in (c1, c2):
        rays[c] = dict(L=(6, c[1]), R=(w - 6, c[1]), U=top, D=bot)
    slots = {1: ('L', 'U'), 2: ('U', 'R'), 3: ('L', 'D'), 4: ('D', 'R')}
    wedges, labels = '', ''
    for k in range(1, 9):
        c = c1 if k <= 4 else c2
        a, b = slots[(k - 1) % 4 + 1]
        d, bis, span = wedge(c, rays[c][a], rays[c][b], 25)
        wedges += f'<path id="{prefix}-w{k}" class="ss-w" d="{d}" fill="transparent" stroke="#C3CAD8" stroke-width="1"/>'
        rl = 40 if span < 90 else 31
        labels += _text(c[0] + rl * math.cos(math.radians(bis)), c[1] + rl * math.sin(math.radians(bis)), str(k), label_size)
    s += wedges
    for y in (y1, y2):
        s += f'<line x1="6" y1="{y}" x2="{w-6}" y2="{y}" stroke="{NAVY}" stroke-width="2"/>'
        for off in (0, 8):
            xx = w - 46 + off
            s += f'<polyline points="{xx-6},{y-6} {xx},{y} {xx-6},{y+6}" fill="none" stroke="{GOLD}" stroke-width="2"/>'
    s += f'<line x1="{top[0]:.1f}" y1="{top[1]:.1f}" x2="{bot[0]:.1f}" y2="{bot[1]:.1f}" stroke="{NAVY}" stroke-width="2"/>'
    s += _text(w - 12, y1 - 12, 'm', 15, 600, NAVY, True, 'end') + _text(w - 12, y2 - 12, 'n', 15, 600, NAVY, True, 'end')
    s += _text(bot[0] + 10, bot[1] - 6, 't', 15, 600, NAVY, True, 'start')
    s += labels
    return s + '</svg>'

def tri_ref(prefix='__P__', w=360, h=196, title='Triangle with interior angles a, b, c and exterior angle d'):
    A, B, C, E = (34, 160), (222, 160), (104, 30), (346, 160)
    s = f'<svg viewBox="0 0 {w} {h}" width="{w}" height="{h}" role="img" aria-label="{title}" xmlns="http://www.w3.org/2000/svg">'
    s += f'<polygon points="{A[0]},{A[1]} {B[0]},{B[1]} {C[0]},{C[1]}" fill="#F1F4FA" stroke="none"/>'
    parts = [('a', A, B, C, 30, 50), ('b', C, A, B, 30, 46), ('c', B, A, C, 28, 44), ('d', B, E, C, 30, 50)]
    wd, lab = '', ''
    for name, v, p, q, r, rl in parts:
        d, bis, span = wedge(v, p, q, r)
        wd += f'<path id="{prefix}-w{name}" class="ss-w" d="{d}" fill="transparent" stroke="#C3CAD8" stroke-width="1"/>'
        lab += _text(v[0] + rl * math.cos(math.radians(bis)), v[1] + rl * math.sin(math.radians(bis)), name, 17, 700, NAVY, True)
    s += wd
    s += f'<polygon points="{A[0]},{A[1]} {B[0]},{B[1]} {C[0]},{C[1]}" fill="none" stroke="{NAVY}" stroke-width="2"/>'
    s += f'<line x1="{B[0]}" y1="{B[1]}" x2="{E[0]}" y2="{E[1]}" stroke="{NAVY}" stroke-width="2" stroke-dasharray="7 4"/>'
    s += _text(282, 182, 'side extended', 11, 600, '#7A8599', True)
    s += _text(118, 122, 'interior', 11, 600, '#7A8599', True)
    s += lab
    return s + '</svg>'

if __name__ == '__main__':
    open('/tmp/claude-0/ref_test.html', 'w').write('<body style="background:#fff">' + para_ref('a') + tri_ref('b') + '</body>')
    print('ok')
