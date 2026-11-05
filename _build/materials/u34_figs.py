"""Figures for the Units 3-4 handouts, quizzes and tests: parallel lines + transversal (slots 1-8 numbered like transversals.py:
1 upper-left, 2 upper-right, 3 lower-left, 4 lower-right at line m; 5-8 the same at line n), intersecting lines, triangles, number lines."""
import math

NAVY = '#1E2D4F'
GOLD = '#E0A800'

def norm(v):
    l = math.hypot(*v); return (v[0]/l, v[1]/l)

X = '<tspan font-style="italic">x</tspan>'

def plain(t):
    return t.replace(X, 'x')

def lab(x, y, t, size=13, anchor='middle', weight='normal'):
    return (f'<text x="{x:.1f}" y="{y:.1f}" font-size="{size}" text-anchor="{anchor}" '
            f'dominant-baseline="middle" font-family="Inter, sans-serif" font-weight="{weight}" fill="#1a1a1a">{t}</text>')

def arrow(x, y):
    s = ''
    for off in (0, 7):
        xx = x + off
        s += f'<polyline points="{xx-5},{y-5} {xx},{y} {xx-5},{y+5}" fill="none" stroke="{GOLD}" stroke-width="1.8"/>'
    return s

def para(labels, w=300, h=200, size=13):
    """Two parallel horizontal lines m, n cut by transversal t. Slots 1-4 top intersection (TL, TR, BL, BR), 5-8 bottom."""
    y1, y2 = 55, 140
    cx1, cx2 = w*0.42, w*0.58
    dx, dy = cx2-cx1, y2-y1
    t0, t1 = -0.6, 1.6
    s = f'<svg viewBox="0 0 {w} {h}" width="{w}" height="{h}" xmlns="http://www.w3.org/2000/svg">'
    for y in (y1, y2):
        s += f'<line x1="8" y1="{y}" x2="{w-8}" y2="{y}" stroke="{NAVY}" stroke-width="1.8"/>'
        s += arrow(w-40, y)
    s += f'<line x1="{cx1+dx*t0:.1f}" y1="{y1+dy*t0:.1f}" x2="{cx1+dx*t1:.1f}" y2="{y1+dy*t1:.1f}" stroke="{NAVY}" stroke-width="1.8"/>'
    s += f'<text x="{w-12}" y="{y1-9}" font-size="13" font-style="italic" font-family="Inter, sans-serif" text-anchor="end">m</text>'
    s += f'<text x="{w-12}" y="{y2-9}" font-size="13" font-style="italic" font-family="Inter, sans-serif" text-anchor="end">n</text>'
    s += f'<text x="{cx1+dx*t1+7:.1f}" y="{y1+dy*t1-2:.1f}" font-size="12" font-style="italic" font-family="Inter, sans-serif">t</text>'
    for slot, text in labels.items():
        i = (slot-1)//4; k = (slot-1) % 4
        cx, cy = (cx1, y1) if i == 0 else (cx2, y2)
        off = -13 if k < 2 else 14
        tx = cx + dx/dy*off
        right = k in (1, 3)
        xx = tx + (10 if right else -10)
        s += lab(xx, cy+off, text, size, 'start' if right else 'end')
    return s + '</svg>'

def cross(labels, w=240, h=170, size=13):
    """Two intersecting lines; labels by region 'top','right','bottom','left'."""
    cx, cy = w/2, h/2
    d1 = norm((1, -0.42)); d2 = norm((0.55, 1))
    L = min(w, h*1.4)/2 - 6
    s = f'<svg viewBox="0 0 {w} {h}" width="{w}" height="{h}" xmlns="http://www.w3.org/2000/svg">'
    for d in (d1, d2):
        s += f'<line x1="{cx-d[0]*L:.1f}" y1="{cy-d[1]*L:.1f}" x2="{cx+d[0]*L:.1f}" y2="{cy+d[1]*L:.1f}" stroke="{NAVY}" stroke-width="1.8"/>'
    rays = [d1, d2, (-d1[0], -d1[1]), (-d2[0], -d2[1])]
    angs = sorted(rays, key=lambda v: math.atan2(v[1], v[0]))
    regs = []
    for i in range(4):
        a, b = angs[i], angs[(i+1) % 4]
        bis = norm((a[0]+b[0], a[1]+b[1]))
        ang = math.acos(max(-1, min(1, a[0]*b[0]+a[1]*b[1])))
        regs.append((bis, ang))
    key = {'top': lambda b: b[0][1], 'bottom': lambda b: -b[0][1], 'left': lambda b: b[0][0], 'right': lambda b: -b[0][0]}
    for name, text in labels.items():
        bis, ang = min(regs, key=key[name])
        tw = len(plain(text))*size*0.5
        r = max(20, (tw/2+6)/math.sin(ang/2)) if ang < 1.4 else 24 + tw*0.3
        r = min(r + (8 if len(plain(text)) > 4 else 0), 80)
        s += lab(cx+bis[0]*r, cy+bis[1]*r, text, size)
    s += f'<circle cx="{cx}" cy="{cy}" r="2.5" fill="{NAVY}"/>'
    return s + '</svg>'

def tri(A, B, C, la, lb, lc, ext=None, right_at=None, w=260, h=175, size=15):
    s = f'<svg viewBox="0 0 {w} {h}" width="{w}" height="{h}" xmlns="http://www.w3.org/2000/svg">'
    s += f'<polygon points="{A[0]},{A[1]} {B[0]},{B[1]} {C[0]},{C[1]}" fill="#F1F3F7" stroke="{NAVY}" stroke-width="1.8"/>'
    def inner(P, Q, R, t, rr=30):
        if not t: return ''
        u = norm((Q[0]-P[0], Q[1]-P[1])); v = norm((R[0]-P[0], R[1]-P[1]))
        b = norm((u[0]+v[0], u[1]+v[1]))
        ang = math.acos(u[0]*v[0]+u[1]*v[1])
        tw = len(plain(t))*size*0.5
        r = max(rr, (tw/2+5)/math.sin(ang/2)+4)
        G = ((A[0]+B[0]+C[0])/3, (A[1]+B[1]+C[1])/3)
        r = min(r, 0.5*math.hypot(G[0]-P[0], G[1]-P[1]))
        return lab(P[0]+b[0]*r, P[1]+b[1]*r, t, size)
    s += inner(A, B, C, la) + inner(B, A, C, lb) + inner(C, A, B, lc)
    if ext:
        e = norm((B[0]-A[0], B[1]-A[1]))
        E = (B[0]+e[0]*70, B[1]+e[1]*70)
        s += f'<line x1="{B[0]}" y1="{B[1]}" x2="{E[0]:.1f}" y2="{E[1]:.1f}" stroke="{NAVY}" stroke-width="1.8"/>'
        u = e; v = norm((C[0]-B[0], C[1]-B[1]))
        b = norm((u[0]+v[0], u[1]+v[1]))
        tw = len(plain(ext))*size*0.5
        r = max(34, tw*0.6+14)
        s += lab(B[0]+b[0]*r, B[1]+b[1]*r, ext, size)
    if right_at:
        P, Q, R = right_at
        u = norm((Q[0]-P[0], Q[1]-P[1])); v = norm((R[0]-P[0], R[1]-P[1])); k = 13
        s += f'<polyline points="{P[0]+u[0]*k:.1f},{P[1]+u[1]*k:.1f} {P[0]+u[0]*k+v[0]*k:.1f},{P[1]+u[1]*k+v[1]*k:.1f} {P[0]+v[0]*k:.1f},{P[1]+v[1]*k:.1f}" fill="none" stroke="{NAVY}" stroke-width="1.3"/>'
    return s + '</svg>'

def numline(lo=-8, hi=8, w=360, h=46, mark=None, col='#15803D'):
    """mark: (value, closed:bool, direction:'left'|'right') for answer keys."""
    pad = 18
    s = f'<svg viewBox="0 0 {w} {h}" width="{w}" height="{h}" xmlns="http://www.w3.org/2000/svg">'
    y = 16
    s += f'<line x1="4" y1="{y}" x2="{w-4}" y2="{y}" stroke="{NAVY}" stroke-width="1.6"/>'
    s += f'<polyline points="12,{y-5} 4,{y} 12,{y+5}" fill="none" stroke="{NAVY}" stroke-width="1.6"/>'
    s += f'<polyline points="{w-12},{y-5} {w-4},{y} {w-12},{y+5}" fill="none" stroke="{NAVY}" stroke-width="1.6"/>'
    n = hi - lo
    step = (w - 2*pad) / n
    for i in range(n+1):
        x = pad + i*step
        v = lo + i
        s += f'<line x1="{x:.1f}" y1="{y-5}" x2="{x:.1f}" y2="{y+5}" stroke="{NAVY}" stroke-width="1.2"/>'
        s += f'<text x="{x:.1f}" y="{y+17}" font-size="10" text-anchor="middle" font-family="Inter, sans-serif" fill="#1a1a1a">{v}</text>'
    if mark:
        v, closed, d = mark
        x = pad + (v-lo)*step
        end = 6 if d == 'left' else w-6
        s += f'<line x1="{x:.1f}" y1="{y}" x2="{end}" y2="{y}" stroke="{col}" stroke-width="5"/>'
        s += f'<circle cx="{x:.1f}" cy="{y}" r="6" fill="{col if closed else "#fff"}" stroke="{col}" stroke-width="2"/>'
    return s + '</svg>'
