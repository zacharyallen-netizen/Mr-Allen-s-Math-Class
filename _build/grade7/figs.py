"""Inline SVG figures for the 7th grade notes and practice. Every figure is drawn from its own numbers."""
import math
from lib import num

INK = '#3E2414'; AMB = '#D98E1C'; AMB2 = '#F2B13C'; RUST = '#B4541C'; OLV = '#5E7A1F'; BLU = '#2C6E91'; GRY = '#7D6A58'; SAND = '#F6E7C8'

def svg(w, h, body, label):
    return ('<svg viewBox="0 0 %d %d" width="%d" height="%d" role="img" aria-label="%s" style="max-width:100%%;height:auto">' % (w, h, w, h, label.replace('"', "'"))
            + '<defs><marker id="ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="context-stroke"/></marker></defs>'
            + body + '</svg>')

def t(x, y, s, size=15, c=INK, a='middle', w=600, mono=True, it=False):
    return '<text x="%.1f" y="%.1f" text-anchor="%s" font-size="%s" font-weight="%s" fill="%s"%s%s>%s</text>' % (
        x, y, a, size, w, c, ' font-family="JetBrains Mono,ui-monospace,monospace"' if mono else ' font-family="Inter,system-ui,sans-serif"', ' font-style="italic"' if it else '', s)

def ln(x1, y1, x2, y2, c=INK, w=2, dash=None, arrow=False):
    return '<line x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f" stroke="%s" stroke-width="%s"%s%s/>' % (x1, y1, x2, y2, c, w, ' stroke-dasharray="%s"' % dash if dash else '', ' marker-end="url(#ah)"' if arrow else '')

# ---------- number line ----------
def numline(lo, hi, step=1, pts=(), jumps=(), w=560, label_every=1, frac_den=None, title='number line'):
    """pts: (value, label, color); jumps: (from, to, text, color) drawn as arcs above the line"""
    pad = 30; y = 70 + 26 * (1 if jumps else 0); H = y + 46
    X = lambda v: pad + (v - lo) * (w - 2 * pad) / (hi - lo)
    b = ln(pad - 14, y, w - pad + 14, y, w=2.2) + '<path d="M%d,%d l-9,-6 v12z M%d,%d l9,-6 v12z" fill="%s"/>' % (pad - 16, y, w - pad + 16, y, INK)
    k = 0; v = lo
    while v <= hi + 1e-9:
        b += ln(X(v), y - 7, X(v), y + 7, w=1.6)
        if k % label_every == 0:
            lab = num(round(v, 6)) if not frac_den else _fr(v, frac_den)
            b += t(X(v), y + 25, lab, 13, GRY)
        v += step; k += 1
    for i, (a, c, s, col) in enumerate(jumps):
        x1, x2 = X(a), X(c); hgt = 26 + 10 * (i % 2)
        b += '<path d="M%.1f,%d Q%.1f,%d %.1f,%d" fill="none" stroke="%s" stroke-width="2.4" marker-end="url(#ah)"/>' % (x1, y - 4, (x1 + x2) / 2, y - 4 - 2 * hgt, x2, y - 4, col)
        b += t((x1 + x2) / 2, y - 10 - hgt, s, 13, col)
    for (v, lab, col) in pts:
        b += '<circle cx="%.1f" cy="%d" r="6.5" fill="%s" stroke="#fff" stroke-width="1.5"/>' % (X(v), y, col)
        if lab: b += t(X(v), y - 14, lab, 14, col)
    return svg(w, H, b, title)

def _fr(v, d):
    n = round(v * d)
    if n % d == 0: return num(n // d)
    from fractions import Fraction
    f = Fraction(n, d)
    return ('−' if f < 0 else '') + '%d/%d' % (abs(f.numerator), f.denominator)

# ---------- tape / bar model ----------
def bars(rows, w=520, title='bar model'):
    """rows: list of (label, [(width_units, text, fill)], total_units)"""
    H = 24 + 52 * len(rows); b = ''; x0 = 110; W = w - x0 - 20
    for i, (lab, parts, tot) in enumerate(rows):
        y = 16 + i * 52; x = x0
        b += t(x0 - 10, y + 26, lab, 13, INK, 'end', mono=False)
        for (u, s, fill) in parts:
            ww = W * u / tot
            b += '<rect x="%.1f" y="%d" width="%.1f" height="36" fill="%s" stroke="%s" stroke-width="1.6"/>' % (x, y, ww, fill, INK)
            if s: b += t(x + ww / 2, y + 23, s, 13)
            x += ww
    return svg(w, H, b, title)

# ---------- double number line ----------
def dnl(top, bot, ltop, lbot, w=560, hide=(), title='double number line'):
    pad = 70; X = lambda i: pad + i * (w - pad - 30) / (len(top) - 1)
    b = ln(pad - 10, 40, w - 20, 40) + ln(pad - 10, 100, w - 20, 100)
    b += t(10, 44, ltop, 13, INK, 'start', mono=False) + t(10, 104, lbot, 13, INK, 'start', mono=False)
    for i, (a, c) in enumerate(zip(top, bot)):
        b += ln(X(i), 33, X(i), 47) + ln(X(i), 93, X(i), 107)
        b += t(X(i), 26, '?' if ('t', i) in hide else num(a), 14, RUST if ('t', i) in hide else INK)
        b += t(X(i), 128, '?' if ('b', i) in hide else num(c), 14, RUST if ('b', i) in hide else INK)
    return svg(w, 140, b, title)

# ---------- coordinate graph (first quadrant) ----------
def graph(xmax, ymax, xstep=1, ystep=1, pts=(), line=None, w=300, h=260, xl='x', yl='y', title='graph', mark=()):
    L, B, R, T = 44, 36, 14, 14
    X = lambda v: L + v * (w - L - R) / xmax; Y = lambda v: h - B - v * (h - B - T) / ymax
    b = ''
    v = 0
    while v <= xmax + 1e-9:
        b += ln(X(v), Y(0), X(v), Y(ymax), '#E9DCC4', 1) + t(X(v), h - B + 16, num(v), 11, GRY); v += xstep
    v = 0
    while v <= ymax + 1e-9:
        b += ln(X(0), Y(v), X(xmax), Y(v), '#E9DCC4', 1) + t(L - 6, Y(v) + 4, num(v), 11, GRY, 'end'); v += ystep
    b += ln(X(0), Y(0), X(xmax), Y(0), INK, 2) + ln(X(0), Y(0), X(0), Y(ymax), INK, 2)
    b += t((L + w - R) / 2, h - 4, xl, 12, INK, mono=False) + '<text x="12" y="%d" font-size="12" font-weight="600" fill="%s" font-family="Inter,sans-serif" transform="rotate(-90 12 %d)" text-anchor="middle">%s</text>' % ((h - B) / 2, INK, (h - B) / 2, yl)
    if line is not None:
        k = line; xe = min(xmax, ymax / k) if k else xmax
        b += ln(X(0), Y(0), X(xe), Y(k * xe), RUST, 2.5)
    for (a, c, *lab) in pts:
        b += '<circle cx="%.1f" cy="%.1f" r="5" fill="%s"/>' % (X(a), Y(c), INK)
        if lab: b += t(X(a) + 8, Y(c) - 8, lab[0], 12, RUST, 'start')
    return svg(w, h, b, title)

# ---------- angles at a point ----------
def angles(rays, arcs, w=320, h=200, title='angles', line_through=None):
    """rays: list of directions in degrees from the vertex; arcs: (from_deg, to_deg, label, color)"""
    cx, cy, L = w / 2, h - 40, min(w / 2 - 20, h - 60)
    b = ''
    for d in rays:
        r = math.radians(d); b += ln(cx, cy, cx + L * math.cos(r), cy - L * math.sin(r), INK, 2.4)
    for i, (a1, a2, lab, col) in enumerate(arcs):
        rr = 34 + 12 * (i % 2)
        x1, y1 = cx + rr * math.cos(math.radians(a1)), cy - rr * math.sin(math.radians(a1))
        x2, y2 = cx + rr * math.cos(math.radians(a2)), cy - rr * math.sin(math.radians(a2))
        large = 1 if (a2 - a1) % 360 > 180 else 0
        b += '<path d="M%.1f,%.1f A%d,%d 0 %d 0 %.1f,%.1f" fill="none" stroke="%s" stroke-width="2.6"/>' % (x1, y1, rr, rr, large, x2, y2, col)
        mid = math.radians((a1 + a2) / 2); lr = rr + 18 + 4 * len(lab)
        b += t(cx + lr * math.cos(mid), cy - lr * math.sin(mid) + 5, lab, 14, col)
    b += '<circle cx="%.1f" cy="%.1f" r="3.5" fill="%s"/>' % (cx, cy, INK)
    return svg(w, h, b, title)

def xlines(a, labels, w=320, h=220, title='two crossing lines'):
    """two lines crossing; acute angle a (degrees). labels: dict position->text; positions: right, top, left, bottom"""
    cx, cy, L = w / 2, h / 2, min(w, h) / 2 - 12
    b = ''
    for d in (0, a):
        r = math.radians(d); b += ln(cx - L * math.cos(r) * 1.3, cy + L * math.sin(r) * 1.3, cx + L * math.cos(r) * 1.3, cy - L * math.sin(r) * 1.3, INK, 2.4)
    mids = {'right': a / 2, 'top': (a + 180) / 2, 'left': 180 + a / 2, 'bottom': (a + 180) / 2 + 180}
    for pos, lab in labels.items():
        md = math.radians(mids[pos]); b += t(cx + 40 * math.cos(md), cy - 40 * math.sin(md) + 5, lab, 14, RUST)
    return svg(w, h, b, title)

# ---------- triangle ----------
def tri(A, B, C, labels=(), w=320, h=210, title='triangle'):
    """points in a 0..100 box; labels: (x, y, text, color)"""
    sx = lambda p: (20 + p[0] * (w - 40) / 100, h - 20 - p[1] * (h - 40) / 100)
    pa, pb, pc = sx(A), sx(B), sx(C)
    b = '<polygon points="%.1f,%.1f %.1f,%.1f %.1f,%.1f" fill="%s" stroke="%s" stroke-width="2.4" stroke-linejoin="round"/>' % (pa + pb + pc + (SAND, INK))
    for (x, y, s, *c) in labels:
        X, Y = sx((x, y)); b += t(X, Y, s, 14, c[0] if c else RUST)
    return svg(w, h, b, title)

# ---------- circle ----------
def circle(r_label=None, d_label=None, w=220, h=200, title='circle'):
    cx, cy, R = w / 2, h / 2, min(w, h) / 2 - 18
    b = '<circle cx="%.1f" cy="%.1f" r="%.1f" fill="%s" stroke="%s" stroke-width="2.4"/>' % (cx, cy, R, SAND, INK) + '<circle cx="%.1f" cy="%.1f" r="3.5" fill="%s"/>' % (cx, cy, INK)
    if r_label: b += ln(cx, cy, cx + R, cy, RUST, 2.4) + t(cx + R / 2, cy - 8, r_label, 14, RUST)
    if d_label: b += ln(cx - R, cy, cx + R, cy, BLU, 2.4) + t(cx, cy + 22, d_label, 14, BLU)
    return svg(w, h, b, title)

# ---------- rectangular prism ----------
def prism(l, wd, ht, w=300, h=210, title='rectangular prism'):
    x0, y0, W, H, dx, dy = 40, 70, 170, 100, 60, -40
    b = '<polygon points="%d,%d %d,%d %d,%d %d,%d" fill="%s" stroke="%s" stroke-width="2"/>' % (x0, y0, x0 + W, y0, x0 + W, y0 + H, x0, y0 + H, SAND, INK)
    b += '<polygon points="%d,%d %d,%d %d,%d %d,%d" fill="#FBE9C9" stroke="%s" stroke-width="2"/>' % (x0, y0, x0 + dx, y0 + dy, x0 + W + dx, y0 + dy, x0 + W, y0, INK)
    b += '<polygon points="%d,%d %d,%d %d,%d %d,%d" fill="#EFD9B0" stroke="%s" stroke-width="2"/>' % (x0 + W, y0, x0 + W + dx, y0 + dy, x0 + W + dx, y0 + H + dy, x0 + W, y0 + H, INK)
    b += t(x0 + W / 2, y0 + H + 22, l, 14, RUST) + t(x0 + W + dx / 2 + 14, y0 + H + dy / 2 + 22, wd, 14, RUST, 'start') + t(x0 - 8, y0 + H / 2 + 5, ht, 14, RUST, 'end')
    return svg(w, h, b, title)

# ---------- dot plot / box plot ----------
def dotplot(data, lo, hi, w=520, title='dot plot', label=''):
    pad = 30; X = lambda v: pad + (v - lo) * (w - 2 * pad) / (hi - lo)
    cnt = {}; b = ''
    mx = max([data.count(v) for v in set(data)] + [1]); H = 60 + mx * 16
    y = H - 34
    b += ln(pad - 8, y, w - pad + 8, y)
    for v in range(lo, hi + 1): b += ln(X(v), y - 5, X(v), y + 5, w=1.4) + t(X(v), y + 20, num(v), 12, GRY)
    for v in data:
        cnt[v] = cnt.get(v, 0) + 1; b += '<circle cx="%.1f" cy="%.1f" r="6" fill="%s"/>' % (X(v), y - 4 - 14 * cnt[v], RUST)
    if label: b += t(w / 2, H - 2, label, 12, INK, mono=False)
    return svg(w, H + 4, b, title)

def boxplot(rows, lo, hi, step=1, w=520, title='box plots'):
    """rows: (name, [min, q1, med, q3, max], color)"""
    pad = 70; X = lambda v: pad + (v - lo) * (w - pad - 20) / (hi - lo)
    H = 40 + 56 * len(rows); y = H - 30; b = ln(pad - 6, y, w - 14, y)
    v = lo
    while v <= hi + 1e-9: b += ln(X(v), y - 4, X(v), y + 4, w=1.3) + t(X(v), y + 18, num(v), 11, GRY); v += step
    for i, (name, f, col) in enumerate(rows):
        yy = 20 + i * 56
        b += t(pad - 12, yy + 22, name, 13, INK, 'end', mono=False)
        b += ln(X(f[0]), yy + 18, X(f[1]), yy + 18, col, 2) + ln(X(f[3]), yy + 18, X(f[4]), yy + 18, col, 2)
        b += '<rect x="%.1f" y="%d" width="%.1f" height="34" fill="%s" fill-opacity=".25" stroke="%s" stroke-width="2"/>' % (X(f[1]), yy + 1, X(f[3]) - X(f[1]), col, col)
        b += ln(X(f[2]), yy + 1, X(f[2]), yy + 35, col, 3) + ln(X(f[0]), yy + 8, X(f[0]), yy + 28, col, 2) + ln(X(f[4]), yy + 8, X(f[4]), yy + 28, col, 2)
    return svg(w, H, b, title)

# ---------- spinner ----------
def spinner(parts, w=200, title='spinner'):
    """parts: (label, size, color) sizes add to any total"""
    cx = cy = w / 2; R = w / 2 - 10; tot = sum(p[1] for p in parts); a = 90; b = ''
    for (lab, sz, col) in parts:
        a2 = a - 360 * sz / tot
        x1, y1 = cx + R * math.cos(math.radians(a)), cy - R * math.sin(math.radians(a))
        x2, y2 = cx + R * math.cos(math.radians(a2)), cy - R * math.sin(math.radians(a2))
        large = 1 if (a - a2) > 180 else 0
        b += '<path d="M%.1f,%.1f L%.1f,%.1f A%.1f,%.1f 0 %d 1 %.1f,%.1f Z" fill="%s" stroke="#fff" stroke-width="2"/>' % (cx, cy, x1, y1, R, R, large, x2, y2, col)
        md = math.radians((a + a2) / 2); b += t(cx + R * .62 * math.cos(md), cy - R * .62 * math.sin(md) + 5, lab, 15, '#fff')
        a = a2
    b += ln(cx, cy, cx + R * .55, cy - R * .35, INK, 3, arrow=True) + '<circle cx="%.1f" cy="%.1f" r="6" fill="%s"/>' % (cx, cy, INK)
    return svg(w, w, b, title)

def table(head, rows, cls='data'):
    h = '<table class="%s"><tr>%s</tr>' % (cls, ''.join('<th>%s</th>' % x for x in head))
    for r in rows: h += '<tr>%s</tr>' % ''.join('<td>%s</td>' % (num(x) if isinstance(x, (int, float)) else x) for x in r)
    return h + '</table>'

# ---------- inequality on a number line ----------
def ineq(lo, hi, b, op, w=520, title=None):
    """op in < > ≤ ≥ ; open circle for < >, closed for ≤ ≥; ray toward the solutions"""
    pad = 30; y = 46; H = 86
    X = lambda v: pad + (v - lo) * (w - 2 * pad) / (hi - lo)
    s = ln(pad - 14, y, w - pad + 14, y, w=2.2) + '<path d="M%d,%d l-9,-6 v12z M%d,%d l9,-6 v12z" fill="%s"/>' % (pad - 16, y, w - pad + 16, y, INK)
    for v in range(lo, hi + 1):
        s += ln(X(v), y - 7, X(v), y + 7, w=1.6) + t(X(v), y + 25, num(v), 13, GRY)
    right = op in ('>', '≥')
    end = w - pad + 12 if right else pad - 12
    s += '<line x1="%.1f" y1="%d" x2="%.1f" y2="%d" stroke="%s" stroke-width="6" stroke-linecap="round"/>' % (X(b), y, end, y, RUST)
    s += '<path d="M%.1f,%d l%d,-9 v18z" fill="%s"/>' % (end + (8 if right else -8), y, -12 if right else 12, RUST)
    s += '<circle cx="%.1f" cy="%d" r="8" fill="%s" stroke="%s" stroke-width="3"/>' % (X(b), y, RUST if op in ('≤', '≥') else '#fff', RUST)
    return svg(w, H, s, title or ('x %s %s on a number line' % (op, num(b))))
