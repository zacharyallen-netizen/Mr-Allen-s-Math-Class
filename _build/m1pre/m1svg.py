#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Inline SVG pictures for the NC Math 1 pre-tests.
Every picture is drawn from the item's own numbers. Colours follow the Math 1 brief:
navy = given, gold = what we want ("?"), green = answer (never used before answering),
muted grey grid. Grids use explicit <line> elements. Text stays inside the viewBox."""
import math, re, html

NAVY = '#1E2D4F'; GOLD = '#E0A800'; GOLDT = '#7a5a00'; GOLDF = '#FFF4CC'
GREEN = '#15803D'; GRID = '#dde2ea'; AXIS = '#56607a'; MUTED = '#5b6475'
FILLN = '#e9eef7'; RED = '#b42318'; FILLR = '#fde4e1'; BLUE2 = '#2f6fb3'
FONT = "Georgia,'Times New Roman',serif"

def esc(s): return html.escape(str(s), quote=False)

def rich(s):
    """'x^2' / 'x^(n-1)' -> superscript tspans; '−' kept; '_n' -> subscript."""
    s = esc(s)
    def sup(m):
        return '<tspan baseline-shift="super" font-size="72%%">%s</tspan>' % (m.group(1) or m.group(2))
    s = re.sub(r'\^\(([^)]*)\)|\^([0-9a-zA-Zn−\-?]+)', sup, s)
    s = re.sub(r'_\(([^)]*)\)|_([0-9a-zA-Z]+)', lambda m: '<tspan baseline-shift="sub" font-size="72%%">%s</tspan>' % (m.group(1) or m.group(2)), s)
    return s

def visible_len(s):
    t = re.sub(r'\^\(([^)]*)\)|\^([0-9a-zA-Zn−\-?]+)', lambda m: (m.group(1) or m.group(2)), str(s))
    t = re.sub(r'_\(([^)]*)\)|_([0-9a-zA-Z]+)', lambda m: (m.group(1) or m.group(2)), t)
    return len(t)

def T(x, y, s, size=13, col=NAVY, anchor='middle', weight='normal', italic=False):
    return ('<text x="%.1f" y="%.1f" text-anchor="%s" font-family="%s" font-size="%s" font-weight="%s"%s fill="%s">%s</text>'
            % (x, y, anchor, FONT, size, weight, ' font-style="italic"' if italic else '', col, rich(s)))

def L(x1, y1, x2, y2, col=NAVY, w=2, dash=None, cap=None):
    return ('<line x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f" stroke="%s" stroke-width="%s"%s%s/>'
            % (x1, y1, x2, y2, col, w, ' stroke-dasharray="%s"' % dash if dash else '', ' stroke-linecap="%s"' % cap if cap else ''))

def R(x, y, w, h, fill='none', stroke=NAVY, sw=1.5, rx=0, dash=None):
    return ('<rect x="%.1f" y="%.1f" width="%.1f" height="%.1f" rx="%s" fill="%s" stroke="%s" stroke-width="%s"%s/>'
            % (x, y, w, h, rx, fill, stroke, sw, ' stroke-dasharray="%s"' % dash if dash else ''))

def C(x, y, r=4, fill=NAVY, stroke=None, sw=1.5):
    return '<circle cx="%.1f" cy="%.1f" r="%s" fill="%s"%s/>' % (x, y, r, fill, ' stroke="%s" stroke-width="%s"' % (stroke, sw) if stroke else '')

def PG(pts, fill='none', stroke=NAVY, sw=2, op=None):
    return '<polygon points="%s" fill="%s" stroke="%s" stroke-width="%s"%s/>' % (
        ' '.join('%.1f,%.1f' % p for p in pts), fill, stroke, sw, ' fill-opacity="%s"' % op if op else '')

def PL(pts, stroke=NAVY, sw=2.4, dash=None):
    return '<polyline points="%s" fill="none" stroke="%s" stroke-width="%s"%s stroke-linejoin="round"/>' % (
        ' '.join('%.1f,%.1f' % p for p in pts), stroke, sw, ' stroke-dasharray="%s"' % dash if dash else '')

def arrow(x1, y1, x2, y2, col=NAVY, w=2, head=7):
    a = math.atan2(y2 - y1, x2 - x1)
    p1 = (x2 - head * math.cos(a - 0.45), y2 - head * math.sin(a - 0.45))
    p2 = (x2 - head * math.cos(a + 0.45), y2 - head * math.sin(a + 0.45))
    bx, by = x2 - head * 0.7 * math.cos(a), y2 - head * 0.7 * math.sin(a)
    return L(x1, y1, bx, by, col, w) + PG([(x2, y2), p1, p2], col, col, 1)

def qbox(x, y, txt='?', size=14, minw=22):
    """Gold 'what we want' box centred at (x, y)."""
    w = max(minw, visible_len(txt) * size * 0.58 + 10); h = size + 8
    return R(x - w / 2, y - h / 2, w, h, GOLDF, GOLD, 2, 4) + T(x, y + size * 0.36, txt, size, NAVY, 'middle', 'bold')

def svg(w, h, body, label):
    return ('<svg role="img" aria-label="%s" width="%d" height="%d" viewBox="0 0 %d %d" xmlns="http://www.w3.org/2000/svg">%s</svg>'
            % (esc(label), w, h, w, h, body))

def fmt(v):
    if isinstance(v, str): return v
    if abs(v - round(v)) < 1e-9: v = int(round(v))
    s = str(v)
    return s.replace('-', '−')

# ------------------------------------------------------------------ coordinate plane
class Plane:
    """Coordinate grid. Equal units by default; square=False gives separate x / y scales (W x H)."""
    def __init__(self, xmin, xmax, ymin, ymax, W=260, maxH=280, H=None, square=True, lab=1, step=1,
                 ylab_every=None, ystep=None, xlab='x', ylab='y', padL=28, padR=16, padT=16, padB=24, rot_ylab=False):
        self.xmin, self.xmax, self.ymin, self.ymax = xmin, xmax, ymin, ymax
        self.xstep, self.ystep = step, (ystep or step)
        self.xlab_every, self.ylab_every = lab, (ylab_every or lab)
        if square:
            u = min((W - padL - padR) / float(xmax - xmin), (maxH - padT - padB) / float(ymax - ymin))
            # keep graphs readable: at least ~240 px wide unless that makes them taller than 350 px
            u = max(u, min((240 - padL - padR) / float(xmax - xmin), (350 - padT - padB) / float(ymax - ymin)))
            self.ux = self.uy = u
        else:
            self.ux = (W - padL - padR) / float(xmax - xmin)
            self.uy = ((H or maxH) - padT - padB) / float(ymax - ymin)
        self.padL, self.padT = padL, padT
        self.W = int(round(padL + padR + self.ux * (xmax - xmin)))
        self.H = int(round(padT + padB + self.uy * (ymax - ymin)))
        self.xlab, self.ylab, self.rot_ylab = xlab, ylab, rot_ylab
        self.body = []
        self._grid()

    def X(self, x): return self.padL + (x - self.xmin) * self.ux
    def Y(self, y): return self.padT + (self.ymax - y) * self.uy

    @staticmethod
    def _on(v, lo, every):
        k = (v - lo) / float(every)
        return abs(k - round(k)) < 1e-9

    def _grid(self):
        b = []
        x0, x1, y0, y1 = self.X(self.xmin), self.X(self.xmax), self.Y(self.ymin), self.Y(self.ymax)
        b.append(R(x0, y1, x1 - x0, y0 - y1, '#fff', 'none', 0))
        v = self.xmin
        while v <= self.xmax + 1e-9:
            b.append(L(self.X(v), y1, self.X(v), y0, GRID, 1)); v += self.xstep
        v = self.ymin
        while v <= self.ymax + 1e-9:
            b.append(L(x0, self.Y(v), x1, self.Y(v), GRID, 1)); v += self.ystep
        ax_y = 0 if self.ymin <= 0 <= self.ymax else self.ymin
        ax_x = 0 if self.xmin <= 0 <= self.xmax else self.xmin
        self.ax_x, self.ax_y = ax_x, ax_y
        b.append(L(x0, self.Y(ax_y), x1, self.Y(ax_y), AXIS, 1.6))
        b.append(L(self.X(ax_x), y0, self.X(ax_x), y1, AXIS, 1.6))
        ty = min(self.Y(ax_y) + 13, self.H - 3)
        both0 = (ax_x == 0 and ax_y == 0)
        v = self.xmin
        while v <= self.xmax + 1e-9:
            if self._on(v, 0, self.xlab_every) and not (both0 and abs(v) < 1e-9):
                b.append(T(self.X(v), ty, fmt(v), 10, MUTED))
            v += self.xstep
        v = self.ymin
        while v <= self.ymax + 1e-9:
            if self._on(v, 0, self.ylab_every) and not (both0 and abs(v) < 1e-9) and not (ax_y != 0 and abs(v - ax_y) < 1e-9 and ax_x != 0):
                b.append(T(self.X(ax_x) - 4, self.Y(v) + 3.5, fmt(v), 10, MUTED, 'end'))
            v += self.ystep
        if both0:
            b.append(T(self.X(0) - 4, self.Y(0) + 12, '0', 9.5, MUTED, 'end'))
        if self.rot_ylab:
            cy = (y0 + y1) / 2
            b.append('<text x="10" y="%.1f" transform="rotate(-90 10 %.1f)" text-anchor="middle" font-family="%s" font-size="10.5" font-style="italic" font-weight="bold" fill="%s">%s</text>'
                     % (cy, cy, FONT, AXIS, esc(self.ylab)))
            b.append(T((x0 + x1) / 2, self.H - 3, self.xlab, 10.5, AXIS, 'middle', 'bold', True))
        else:
            b.append(T(x1 + 1, self.Y(ax_y) - 5, self.xlab, 11, AXIS, 'end', 'bold', True))
            b.append(T(self.X(ax_x) + 5, y1 + 10, self.ylab, 11, AXIS, 'start', 'bold', True))
        self.body += b

    def add(self, s): self.body.append(s); return self

    def clip_line(self, m, b, x_from=None, x_to=None):
        xs = []
        lo = self.xmin if x_from is None else x_from
        hi = self.xmax if x_to is None else x_to
        pts = []
        if m == 0:
            return [(lo, b), (hi, b)] if self.ymin <= b <= self.ymax else []
        for x in (lo, hi):
            y = m * x + b
            if self.ymin - 1e-9 <= y <= self.ymax + 1e-9: pts.append((x, y))
        for y in (self.ymin, self.ymax):
            x = (y - b) / m
            if lo - 1e-9 <= x <= hi + 1e-9: pts.append((x, y))
        pts = sorted(set((round(p[0], 6), round(p[1], 6)) for p in pts))
        return [pts[0], pts[-1]] if len(pts) >= 2 else []

    def line(self, m, b, col=NAVY, w=2.4, dash=None, x_from=None, x_to=None):
        p = self.clip_line(m, b, x_from, x_to)
        if p: self.add(L(self.X(p[0][0]), self.Y(p[0][1]), self.X(p[1][0]), self.Y(p[1][1]), col, w, dash))
        return self

    def vline(self, x, col=NAVY, w=2.4, dash=None, y0=None, y1=None):
        self.add(L(self.X(x), self.Y(self.ymin if y0 is None else y0), self.X(x), self.Y(self.ymax if y1 is None else y1), col, w, dash)); return self

    def seg(self, x1, y1, x2, y2, col=NAVY, w=2.4, dash=None):
        self.add(L(self.X(x1), self.Y(y1), self.X(x2), self.Y(y2), col, w, dash)); return self

    def pt(self, x, y, col=NAVY, r=4.2, hollow=False):
        if hollow: self.add(C(self.X(x), self.Y(y), r, '#fff', col, 2))
        else: self.add(C(self.X(x), self.Y(y), r, col))
        return self

    def poly(self, pts, fill=FILLN, stroke=NAVY, sw=2.2, op=None):
        self.add(PG([(self.X(a), self.Y(b)) for a, b in pts], fill, stroke, sw, op)); return self

    def curve(self, f, x0, x1, col=NAVY, w=2.4, n=80, dash=None):
        pts = []
        for i in range(n + 1):
            x = x0 + (x1 - x0) * i / n
            y = f(x)
            if self.ymin - 0.01 <= y <= self.ymax + 0.01: pts.append((self.X(x), self.Y(y)))
            elif pts:
                self.add(PL(pts, col, w, dash)); pts = []
        if len(pts) > 1: self.add(PL(pts, col, w, dash))
        return self

    def _clamp(self, x, y, txt, size, anchor):
        wpx = visible_len(txt) * size * 0.56
        if anchor == 'middle': x = min(max(x, wpx / 2 + 2), self.W - wpx / 2 - 2)
        elif anchor == 'start': x = min(max(x, 2), self.W - wpx - 2)
        else: x = min(max(x, wpx + 2), self.W - 2)
        y = min(max(y, size + 1), self.H - 3)
        return x, y

    def label(self, x, y, txt, dx=6, dy=-6, col=NAVY, size=11.5, anchor='start', weight='bold', bg=True):
        px, py = self._clamp(self.X(x) + dx, self.Y(y) + dy, txt, size, anchor)
        if bg:
            wpx = visible_len(txt) * size * 0.5
            bx = px - (wpx / 2 if anchor == 'middle' else (wpx if anchor == 'end' else 0))
            self.add(R(bx - 2, py - size + 1, wpx + 4, size + 3, 'rgba(255,255,255,0.85)', 'none', 0, 2))
        self.add(T(px, py, txt, size, col, anchor, weight)); return self

    def q(self, x, y, txt='?', dx=0, dy=0, size=12):
        w = max(22, visible_len(txt) * size * 0.58 + 10); h = size + 8
        px = min(max(self.X(x) + dx, w / 2 + 1), self.W - w / 2 - 1)
        py = min(max(self.Y(y) + dy, h / 2 + 1), self.H - h / 2 - 1)
        self.add(qbox(px, py, txt, size)); return self

    def shade(self, m, b, above=True, col='#2f6fb3', op=0.16):
        # polygon of the half-plane, clipped to the window
        poly = []
        corners = [(self.xmin, self.ymin), (self.xmax, self.ymin), (self.xmax, self.ymax), (self.xmin, self.ymax)]
        inside = lambda p: (p[1] >= m * p[0] + b) if above else (p[1] <= m * p[0] + b)
        n = len(corners)
        for i in range(n):
            P, Q = corners[i], corners[(i + 1) % n]
            if inside(P): poly.append(P)
            fP, fQ = P[1] - (m * P[0] + b), Q[1] - (m * Q[0] + b)
            if (fP > 0) != (fQ > 0) and fP != fQ:
                t = fP / (fP - fQ)
                poly.append((P[0] + t * (Q[0] - P[0]), P[1] + t * (Q[1] - P[1])))
        if len(poly) >= 3:
            self.add(PG([(self.X(a), self.Y(c)) for a, c in poly], col, 'none', 0, op))
        return self

    def render(self, label):
        return svg(self.W, self.H, ''.join(self.body), label)

# ------------------------------------------------------------------ number line
def numline(lo, hi, label, step=1, lab_every=1, W=270, marks=(), ray=None, q=None, title=None):
    padL, padR = 16, 16
    u = (W - padL - padR) / float(hi - lo)
    H = 62 + (16 if title else 0)
    y = 30 + (16 if title else 0)
    X = lambda v: padL + (v - lo) * u
    b = []
    if title: b.append(T(W / 2, 14, title, 12, NAVY, 'middle', 'bold'))
    b.append(L(padL - 8, y, W - padR + 8, y, AXIS, 1.8))
    b.append(PG([(padL - 12, y), (padL - 5, y - 4.5), (padL - 5, y + 4.5)], AXIS, AXIS, 1))
    b.append(PG([(W - padR + 12, y), (W - padR + 5, y - 4.5), (W - padR + 5, y + 4.5)], AXIS, AXIS, 1))
    v = lo; i = 0
    while v <= hi + 1e-9:
        major = abs((v - lo) / lab_every - round((v - lo) / lab_every)) < 1e-9
        b.append(L(X(v), y - (6 if major else 4), X(v), y + (6 if major else 4), AXIS, 1.3))
        if major: b.append(T(X(v), y + 20, fmt(v), 10.5, MUTED))
        v += step
    if ray:  # (value, direction +1/-1, hollow)
        val, d, hollow = ray
        end = W - padR + 6 if d > 0 else padL - 6
        b.append(L(X(val), y, end, y, NAVY, 4))
        b.append(C(X(val), y, 5.5, '#fff' if hollow else NAVY, NAVY, 2.2))
    for m in marks:
        val, kind = m[0], m[1]
        b.append(C(X(val), y, 5, '#fff' if kind == 'open' else NAVY, NAVY, 2))
    if q is not None:
        b.append(qbox(min(max(X(q), 16), W - 16), y - 18, '?', 12))
    return svg(W, H, ''.join(b), label)

# ------------------------------------------------------------------ table
def table(rows, label, colw=None, first_w=None, rowh=26, size=12.5, head_rows=1, horizontal=True, hl_cols=()):
    """rows: list of lists of str ('?' -> gold box). First column (horizontal) is a header column."""
    ncol = max(len(r) for r in rows)
    first_w = first_w or 52
    colw = colw or 40
    W = int(first_w + colw * (ncol - 1) + 4); H = int(rowh * len(rows) + 4)
    b = []
    for ri, r in enumerate(rows):
        y = 2 + ri * rowh
        for ci in range(ncol):
            x = 2 + (0 if ci == 0 else first_w + (ci - 1) * colw)
            w = first_w if ci == 0 else colw
            txt = r[ci] if ci < len(r) else ''
            head = (ci == 0)
            fill = NAVY if head else ('#fffaf0' if ci in hl_cols else '#fff')
            b.append(R(x, y, w, rowh, fill, '#b9c1cf', 1))
            if txt == '?':
                b.append(qbox(x + w / 2, y + rowh / 2, '?', 12, 20))
            elif txt != '':
                b.append(T(x + w / 2, y + rowh / 2 + size * 0.36, txt, size, '#fff' if head else NAVY, 'middle', 'bold' if head else 'normal'))
    return svg(W, H, ''.join(b), label)

# ------------------------------------------------------------------ tape / bar model
def tape(segs, total, label, W=270, unit=None, top_label=None):
    """segs: list of (units, text, kind) kind in {'g','q','n'}; total text under a brace."""
    tot_units = sum(s[0] for s in segs)
    u = unit or (W - 20) / float(tot_units)
    x = 10; y = 26 if top_label else 12; h = 34
    b = []
    if top_label: b.append(T(W / 2, 14, top_label, 11.5, MUTED, 'middle', 'normal', True))
    for units, txt, kind in segs:
        w = units * u
        fill = GOLDF if kind == 'q' else (FILLN if kind == 'g' else '#fff')
        st = GOLD if kind == 'q' else NAVY
        b.append(R(x, y, w, h, fill, st, 2 if kind == 'q' else 1.6, 0, '5 3' if kind == 'n' else None))
        b.append(T(x + w / 2, y + h / 2 + 5, txt, 13 if w > 34 else 11, NAVY, 'middle', 'bold'))
        x += w
    # brace
    yb = y + h + 6
    b.append('<path d="M10 %.1f q0 8 8 8 H%.1f q8 0 8 8 q0 -8 8 -8 H%.1f q8 0 8 -8" fill="none" stroke="%s" stroke-width="1.6"/>'
             % (yb, 10 + (x - 10) / 2 - 8, x - 8, MUTED))
    b.append(T(10 + (x - 10) / 2, yb + 30, total, 13, NAVY, 'middle', 'bold'))
    return svg(int(W), int(yb + 36), ''.join(b), label)

# ------------------------------------------------------------------ balance scale
def balance(left, right, label, W=270):
    H = 128; cx = W / 2
    b = [PG([(cx - 26, H - 6), (cx + 26, H - 6), (cx, H - 40)], FILLN, NAVY, 2),
         L(cx, H - 40, cx, 30, NAVY, 3), L(26, 34, W - 26, 34, NAVY, 3.2, None, 'round'), C(cx, 30, 5)]
    for side, txt in ((-1, left), (1, right)):
        px = cx + side * (W / 2 - 62)
        b.append(L(px - 34, 34, px - 44, 74, MUTED, 1.2)); b.append(L(px + 34, 34, px + 44, 74, MUTED, 1.2))
        b.append('<path d="M%.1f 74 H%.1f q-6 18 -%.1f 18 H%.1f q-%.1f 0 -%.1f -18 Z" fill="%s" stroke="%s" stroke-width="1.6"/>'
                 % (px - 54, px + 54, 14, px - 40, 14, 14, FILLN, NAVY))
        size = 14 if visible_len(txt) <= 9 else (12.5 if visible_len(txt) <= 12 else 11)
        b.append(T(px, 66, txt, size, NAVY, 'middle', 'bold'))
    return svg(W, H, ''.join(b), label)

# ------------------------------------------------------------------ function machine / flow
def machine(inp, rule, out, label, W=280):
    H = 70; b = []
    bw = max(96, visible_len(rule) * 9 + 20)
    bx = (W - bw) / 2
    b.append(R(bx, 14, bw, 42, FILLN, NAVY, 2, 8))
    b.append(T(W / 2, 41, rule, 14, NAVY, 'middle', 'bold'))
    b.append(T(W / 2, 10, 'rule', 9.5, MUTED, 'middle', 'normal', True))
    for side, val in ((-1, inp), (1, out)):
        cx = 26 if side < 0 else W - 26
        if val == '?': b.append(qbox(cx, 35, '?', 14))
        else:
            b.append(R(cx - 22, 23, 44, 24, '#fff', NAVY, 1.6, 4)); b.append(T(cx, 40, val, 13.5, NAVY, 'middle', 'bold'))
        b.append(T(cx, 66, 'input' if side < 0 else 'output', 9.5, MUTED, 'middle', 'normal', True))
    b.append(arrow(50, 35, bx - 4, 35, NAVY, 2)); b.append(arrow(bx + bw + 2, 35, W - 50, 35, NAVY, 2))
    return svg(W, H, ''.join(b), label)

def chain(boxes, ops, label, W=None, boxw=44, gap=34, size=13):
    """boxes: values or '?'; ops: labels on the arrows between boxes (len = len(boxes)-1)."""
    n = len(boxes)
    W = W or int(10 + n * boxw + (n - 1) * gap + 10)
    gap = (W - 20 - n * boxw) / float(max(1, n - 1))
    H = 70; b = []; y = 42
    for i, v in enumerate(boxes):
        x = 10 + i * (boxw + gap)
        if v == '?': b.append(qbox(x + boxw / 2, y, '?', 13, boxw))
        else:
            b.append(R(x, y - 13, boxw, 26, FILLN, NAVY, 1.6, 4)); b.append(T(x + boxw / 2, y + 5, v, size, NAVY, 'middle', 'bold'))
        if i < n - 1:
            x2 = x + boxw + gap
            b.append('<path d="M%.1f %.1f Q%.1f %.1f %.1f %.1f" fill="none" stroke="%s" stroke-width="1.6"/>'
                     % (x + boxw - 4, y - 14, x + boxw + gap / 2, y - 30, x2 + 4, y - 14, MUTED))
            b.append(PG([(x2 + 4, y - 13), (x2 - 3, y - 19), (x2 + 1, y - 21)], MUTED, MUTED, 1))
            op = ops[i]
            if op == '?': b.append(qbox(x + boxw + gap / 2, y - 28 + 6, '?', 10.5, 18))
            else: b.append(T(x + boxw + gap / 2, y - 26, op, 10.5, NAVY, 'middle', 'bold'))
        if len(boxes) > 1 and labels_needed(boxes):
            pass
    return svg(W, H, ''.join(b), label)

def labels_needed(_): return False

# ------------------------------------------------------------------ area model (generic grid of cells)
def area_model(cols, rows, cells, label, colw=None, rowh=None, size=13):
    """cols/rows: header texts (with relative sizes) [(text, size)], cells[r][c] text or '?'."""
    cw = colw or [max(40, s * 26) for _, s in cols]
    rh = rowh or [max(30, s * 22) for _, s in rows]
    x0, y0 = 50, 26
    W = int(x0 + sum(cw) + 10); H = int(y0 + sum(rh) + 8)
    b = []
    x = x0
    for (t, _), w in zip(cols, cw):
        b.append(qbox(x + w / 2, y0 - 12, '?', 11, 20) if t == '?' else T(x + w / 2, y0 - 8, t, 13, NAVY, 'middle', 'bold')); x += w
    y = y0
    for ri, ((t, _), h) in enumerate(zip(rows, rh)):
        b.append(qbox(x0 - 18, y + h / 2, '?', 11, 20) if t == '?' else T(x0 - 8, y + h / 2 + 5, t, 13, NAVY, 'end', 'bold'))
        x = x0
        for ci, w in enumerate(cw):
            txt = cells[ri][ci]
            if txt == '?':
                b.append(R(x, y, w, h, GOLDF, NAVY, 1.4)); b.append(qbox(x + w / 2, y + h / 2, '?', 12, 20))
            else:
                b.append(R(x, y, w, h, FILLN, NAVY, 1.4)); b.append(T(x + w / 2, y + h / 2 + 5, txt, size, NAVY, 'middle', 'bold'))
            x += w
        y += h
    return svg(W, H, ''.join(b), label)

# ------------------------------------------------------------------ bars for sequences
def seq_bars(vals, label, n_labels=None, W=250, H=150, q_last=True, ylab=None):
    """vals: numbers (positive); a final '?' slot is drawn with no height (the height would give the answer away)."""
    nums = [v for v in vals if v != '?']
    vmax = max(nums)
    n = len(vals)
    padL, padB, padT = 14, 22, 18
    bw = (W - padL - 10) / float(n) * 0.62
    sp = (W - padL - 10) / float(n)
    base = H - padB
    b = [L(padL - 4, base, W - 6, base, AXIS, 1.6)]
    for i, v in enumerate(vals):
        cx = padL + sp * (i + 0.5)
        if v == '?':
            b.append(qbox(cx, base - 16, '?', 12, 22))
        else:
            h = (base - padT - 14) * (v / float(vmax))
            b.append(R(cx - bw / 2, base - h, bw, h, FILLN, NAVY, 1.6))
            b.append(T(cx, base - h - 4, fmt(v), 11, NAVY, 'middle', 'bold'))
        lab = (n_labels[i] if n_labels else 'n = %d' % (i + 1)) if i == 0 else (n_labels[i] if n_labels else str(i + 1))
        b.append(T(cx, base + 15, lab, 10, MUTED))
    return svg(W, H, ''.join(b), label)

# ------------------------------------------------------------------ statistics
def dotplot(data, lo, hi, label, step=1, lab_every=None, W=270, title=None, extra_mark=None):
    lab_every = lab_every or step
    padL, padR = 14, 14
    u = (W - padL - padR) / float(hi - lo)
    from collections import Counter
    cnt = Counter(data)
    mx = max(cnt.values())
    r = min(6, max(4, u * 0.42))
    top = 20 if title else 8
    H = int(top + mx * (2 * r + 2) + 34)
    base = H - 26
    X = lambda v: padL + (v - lo) * u
    b = []
    if title: b.append(T(W / 2, 13, title, 11.5, NAVY, 'middle', 'bold'))
    b.append(L(padL - 6, base, W - padR + 6, base, AXIS, 1.6))
    v = lo
    while v <= hi + 1e-9:
        major = abs((v - lo) / lab_every - round((v - lo) / lab_every)) < 1e-9
        b.append(L(X(v), base, X(v), base + (5 if major else 3), AXIS, 1.2))
        if major: b.append(T(X(v), base + 17, fmt(v), 10, MUTED))
        v += step
    for val, k in cnt.items():
        for j in range(k):
            b.append(C(X(val), base - r - 1 - j * (2 * r + 2), r, NAVY))
    return svg(W, H, ''.join(b), label)

def histogram(bins, counts, label, W=260, H=170, xlab='', ylab='students', ymax=None, step=2):
    padL, padB, padT = 34, 36, 12
    n = len(bins)
    ymax = ymax or (max(counts) + 1)
    bw = (W - padL - 8) / float(n)
    Y = lambda c: H - padB - (H - padB - padT) * c / float(ymax)
    b = []
    for c in range(0, ymax + 1, step):
        b.append(L(padL, Y(c), W - 8, Y(c), GRID, 1)); b.append(T(padL - 5, Y(c) + 3.5, str(c), 9.5, MUTED, 'end'))
    for i, (bn, c) in enumerate(zip(bins, counts)):
        x = padL + i * bw
        b.append(R(x, Y(c), bw, Y(0) - Y(c), FILLN, NAVY, 1.6))
        b.append(T(x + bw / 2, H - padB + 14, bn, 9.5, MUTED))
    b.append(L(padL, Y(0), W - 8, Y(0), AXIS, 1.6)); b.append(L(padL, Y(0), padL, padT - 4, AXIS, 1.6))
    if xlab: b.append(T((padL + W) / 2, H - 5, xlab, 10.5, AXIS, 'middle', 'bold', True))
    b.append('<text x="11" y="%.1f" transform="rotate(-90 11 %.1f)" text-anchor="middle" font-family="%s" font-size="10.5" font-style="italic" font-weight="bold" fill="%s">%s</text>'
             % ((padT + H - padB) / 2, (padT + H - padB) / 2, FONT, AXIS, esc(ylab)))
    return svg(W, H, ''.join(b), label)

def boxplots(sets, lo, hi, label, step=5, lab_every=None, W=280, show_vals=False, names=None):
    """sets: list of five-number summaries."""
    lab_every = lab_every or step
    padL = 34 if names else 14; padR = 14
    u = (W - padL - padR) / float(hi - lo)
    X = lambda v: padL + (v - lo) * u
    rowh = 44
    H = int(10 + rowh * len(sets) + (14 if show_vals else 0) + 26)
    b = []
    for i, f in enumerate(sets):
        cy = 10 + (14 if show_vals else 0) + rowh * i + rowh / 2
        mn, q1, md, q3, mx = f
        b.append(L(X(mn), cy, X(q1), cy, NAVY, 2)); b.append(L(X(q3), cy, X(mx), cy, NAVY, 2))
        b.append(L(X(mn), cy - 8, X(mn), cy + 8, NAVY, 2)); b.append(L(X(mx), cy - 8, X(mx), cy + 8, NAVY, 2))
        b.append(R(X(q1), cy - 14, X(q3) - X(q1), 28, FILLN, NAVY, 2)); b.append(L(X(md), cy - 14, X(md), cy + 14, NAVY, 2.6))
        if names: b.append(T(padL - 8, cy + 4, names[i], 12, NAVY, 'end', 'bold'))
        if show_vals:
            for v in f: b.append(T(X(v), cy - 19, fmt(v), 10, NAVY, 'middle', 'bold'))
    base = H - 24
    b.append(L(padL - 4, base, W - padR + 4, base, AXIS, 1.6))
    v = lo
    while v <= hi + 1e-9:
        major = abs((v - lo) / lab_every - round((v - lo) / lab_every)) < 1e-9
        b.append(L(X(v), base, X(v), base + (5 if major else 3), AXIS, 1.2))
        if major: b.append(T(X(v), base + 16, fmt(v), 10, MUTED))
        v += step
    return svg(W, H, ''.join(b), label)

def scatter(points, xr, yr, label, line=None, xlab='x', ylab='y', xstep=1, ystep=1, xlab_every=None, ylab_every=None,
            W=260, H=200, hi=None, resid=None, vx=None, eq=None):
    p = Plane(xr[0], xr[1], yr[0], yr[1], W=W, H=H, square=False, step=xstep, ystep=ystep,
              lab=xlab_every or xstep, ylab_every=ylab_every or ystep, xlab=xlab, ylab=ylab,
              padL=40, padB=34, rot_ylab=True)
    if line:
        p.line(line[0], line[1], BLUE2, 2, None)
    for (x, y) in points:
        p.pt(x, y, NAVY, 3.6)
    if vx is not None:
        p.vline(vx, GOLD, 1.8, '5 4')
    if resid:
        x, y = resid
        yh = line[0] * x + line[1]
        p.seg(x, y, x, yh, GOLD, 2.4)
        p.pt(x, y, NAVY, 4.6)
    if hi:
        p.pt(hi[0], hi[1], NAVY, 5)
    if eq:
        p.label(xr[0] + (xr[1] - xr[0]) * 0.04, yr[1], eq, 0, 14, BLUE2, 11.5, 'start')
    return p.render(label)

# ------------------------------------------------------------------ algebra
def xpuzzle(top, bottom, label, W=170):
    H = 150; cx, cy = W / 2, 75
    b = [L(cx - 52, cy - 52, cx + 52, cy + 52, NAVY, 2.2), L(cx + 52, cy - 52, cx - 52, cy + 52, NAVY, 2.2)]
    b.append(T(cx, cy - 36, top, 15, NAVY, 'middle', 'bold')); b.append(T(cx, cy - 52, 'multiply to', 9.5, MUTED, 'middle', 'normal', True))
    b.append(T(cx, cy + 46, bottom, 15, NAVY, 'middle', 'bold')); b.append(T(cx, cy + 62, 'add to', 9.5, MUTED, 'middle', 'normal', True))
    b.append(qbox(cx - 44, cy + 2, '?', 13)); b.append(qbox(cx + 44, cy + 2, '?', 13))
    return svg(W, H, ''.join(b), label)

def tiles(groups, label, W=280):
    """groups: list of (kind, count) kind in x2, x, 1 ; negative count -> red tiles. Optional ('op', '+')."""
    x = 8; b = []; H = 74
    for g in groups:
        if g[0] == 'op':
            b.append(T(x + 8, 42, g[1], 18, NAVY, 'middle', 'bold')); x += 18; continue
        kind, n = g
        neg = n < 0; n = abs(n)
        fill, st = (FILLR, RED) if neg else (FILLN, NAVY)
        for i in range(n):
            if kind == 'x2':
                b.append(R(x, 10, 34, 34, fill, st, 1.6)); b.append(T(x + 17, 32, ('−' if neg else '') + 'x^2', 10.5, st, 'middle', 'bold')); x += 37
            elif kind == 'x':
                b.append(R(x, 10, 11, 34, fill, st, 1.6)); x += 13
            else:
                b.append(R(x, 33, 11, 11, fill, st, 1.6)); x += 13
        if kind == 'x' and n: b.append(T(x - 13 * n / 2.0 - 1, 60, ('−' if neg else '') + '%dx' % n, 11, st, 'middle', 'bold'))
        if kind == '1' and n: b.append(T(x - 13 * n / 2.0 - 1, 60, ('−' if neg else '') + '%d' % n, 11, st, 'middle', 'bold'))
        x += 6
    return svg(max(W, int(x + 6)), H, ''.join(b), label)

def square_area(area_txt, side_txt, label, s=86, unit_note=None):
    W = s + 130; H = s + 24
    b = [R(20, 12, s, s, FILLN, NAVY, 2), T(20 + s / 2, 12 + s / 2 + 5, area_txt, 13, NAVY, 'middle', 'bold')]
    b.append(qbox(20 + s + 46, 12 + s / 2, 'side = ' + side_txt, 12))
    if unit_note: b.append(T(20 + s + 34, 24, unit_note, 10.5, MUTED, 'start', 'normal', True))
    return svg(W, H, ''.join(b), label)

def cube(vol_txt, edge_txt, label):
    W, H = 200, 140; s = 70; o = 26; x, y = 30, 36
    b = [PG([(x, y), (x + s, y), (x + s, y + s), (x, y + s)], FILLN, NAVY, 2),
         PG([(x, y), (x + o, y - o), (x + s + o, y - o), (x + s, y)], '#dfe6f3', NAVY, 2),
         PG([(x + s, y), (x + s + o, y - o), (x + s + o, y + s - o), (x + s, y + s)], '#cfd9ec', NAVY, 2),
         T(x + s / 2, y + s / 2 + 5, vol_txt, 12.5, NAVY, 'middle', 'bold')]
    b.append(qbox(x + s / 2, y + s + 12, edge_txt, 12))
    b.append(T(x + s + o + 8, y + 18, 'volume', 10, MUTED, 'start', 'normal', True))
    b.append(T(x + s + o + 8, y + 31, 'of a cube', 10, MUTED, 'start', 'normal', True))
    return svg(W, H, ''.join(b), label)

def rect_fig(wtxt, htxt, inside, label, w=150, h=80, wq=False, hq=False):
    W, H = w + 110, h + 42; x, y = 64, 10
    b = [R(x, y, w, h, FILLN, NAVY, 2), T(x + w / 2, y + h / 2 + 5, inside, 13, NAVY, 'middle', 'bold')]
    b.append(qbox(x + w / 2, y + h + 15, wtxt, 12) if wq else T(x + w / 2, y + h + 20, wtxt, 13, NAVY, 'middle', 'bold'))
    b.append(qbox(x - 22, y + h / 2, htxt, 12) if hq else T(x - 8, y + h / 2 + 5, htxt, 13, NAVY, 'end', 'bold'))
    return svg(W, H, ''.join(b), label)

def term_cards(terms, label, qidx=(), W=None, notes=None):
    """terms: list of texts (each one term with its sign); qidx: indexes to mark with a '?' arrow."""
    widths = [max(40, visible_len(t) * 10 + 16) for t in terms]
    W = W or int(sum(widths) + 8 * (len(terms) - 1) + 20)
    H = 78 if (qidx or notes) else 50
    x = 10; b = []
    for i, (t, w) in enumerate(zip(terms, widths)):
        hl = i in qidx
        b.append(R(x, 10, w, 32, GOLDF if hl else FILLN, GOLD if hl else NAVY, 2 if hl else 1.4, 6))
        b.append(T(x + w / 2, 31, t, 14, NAVY, 'middle', 'bold'))
        if hl: b.append(T(x + w / 2, 62, notes[i] if notes and i in notes else 'look here', 10.5, GOLDT, 'middle', 'bold', True))
        x += w + 8
    return svg(W, H, ''.join(b), label)

def eq_stack(lines, label, op='+', result='?', notes=None, W=250):
    """Stacked equations for elimination: lines aligned, operation sign and a rule line."""
    n = len(lines); H = 30 * n + 46; b = []
    for i, ln in enumerate(lines):
        y = 24 + i * 30
        b.append(T(W / 2 + 10, y, ln, 15, NAVY, 'middle', 'bold'))
        if notes and notes[i]:
            nt = notes[i]
            if nt == '?': b.append(qbox(W - 24, y - 5, '× ?', 12.5))
            else: b.append(T(W - 8, y, nt, 13, GOLDT, 'end', 'bold'))
    yl = 24 + (n - 1) * 30 + 10
    if op: b.append(T(28, 24 + (n - 1) * 30, op, 18, NAVY, 'middle', 'bold'))
    b.append(L(40, yl, W - 40, yl, NAVY, 2))
    if result == '?': b.append(qbox(W / 2 + 10, yl + 20, '?', 13, 60))
    elif result: b.append(T(W / 2 + 10, yl + 26, result, 15, NAVY, 'middle', 'bold'))
    return svg(W, H, ''.join(b), label)

def mapping(dom, rng, pairs, label, W=220):
    n = max(len(dom), len(rng)); sp = 30
    ry = n * sp / 2.0 + 8; cy = 24 + ry; H = int(cy + ry + 8)
    ox, rx = 52, W - 52
    b = []
    for cx in (ox, rx):
        b.append('<ellipse cx="%d" cy="%.1f" rx="30" ry="%.1f" fill="%s" stroke="%s" stroke-width="1.6"/>' % (cx, cy, ry, FILLN, NAVY))
    b.append(T(ox, 14, 'input', 10.5, MUTED, 'middle', 'normal', True)); b.append(T(rx, 14, 'output', 10.5, MUTED, 'middle', 'normal', True))
    pos = lambda i, m: cy + (i - (m - 1) / 2.0) * sp
    pd = {v: pos(i, len(dom)) for i, v in enumerate(dom)}
    pr = {v: pos(i, len(rng)) for i, v in enumerate(rng)}
    for v, y in pd.items(): b.append(T(ox, y + 5, fmt(v), 14, NAVY, 'middle', 'bold'))
    for v, y in pr.items(): b.append(T(rx, y + 5, fmt(v), 14, NAVY, 'middle', 'bold'))
    for a, c in pairs: b.append(arrow(ox + 12, pd[a], rx - 14, pr[c], NAVY, 1.6, 7))
    return svg(W, H, ''.join(b), label)

def sketch_parabola(label, up=True, nroots=2, W=230, H=150, xlab='x', ylab='y', root_labels=('?', '?'), vertex_lbl=None):
    """Number-free sketch (no grid numbers): only the shape and where the zeros are, marked with '?' boxes."""
    oy = 92 if up else 58
    ax = 34
    b = [L(10, oy, W - 10, oy, AXIS, 1.6), T(W - 8, oy - 6, xlab, 11, AXIS, 'end', 'bold', True),
         L(ax, H - 6, ax, 8, AXIS, 1.6), T(ax + 6, 16, ylab, 11, AXIS, 'start', 'bold', True)]
    r1, r2 = 84, 176
    h = (r1 + r2) / 2.0
    depth = 46
    a = depth / float((h - r1) ** 2)
    pts = []
    for i in range(81):
        x = 52 + (W - 64) * i / 80.0
        if nroots == 0:   # vertex on the other side of the axis: no zeros
            y = (oy - 26 - a * 0.6 * (x - h) ** 2) if up else (oy + 26 + a * 0.6 * (x - h) ** 2)
        else:
            y = (oy + depth - a * (x - h) ** 2) if up else (oy - depth + a * (x - h) ** 2)
        if 6 <= y <= H - 6: pts.append((x, y))
    b.append(PL(pts, NAVY, 2.4))
    if nroots == 2 and root_labels:
        for rx, lab in zip((r1, r2), root_labels):
            b.append(C(rx, oy, 3.8))
            b.append(qbox(rx + (14 if rx < h else -14), oy + (15 if not up else -15), lab, 11))
    if vertex_lbl:
        vy = (oy + depth if up else oy - depth) if nroots else (oy - 26 if up else oy + 26)
        b.append(C(h, vy, 3.8))
        b.append(qbox(h, vy + 14, vertex_lbl, 11) if up else qbox(h + 56, vy + 6, vertex_lbl, 11))
    return svg(W, H, ''.join(b), label)

def arc_sketch(label, W=240, H=140, start_lbl=None, ylab='height', xlab='time', q_at='end'):
    """Thrown-object arc: starts at the y-axis, lands on the x-axis at '?'."""
    ox, oy = 26, H - 26
    b = [L(ox, oy, W - 10, oy, AXIS, 1.6), L(ox, oy, ox, 8, AXIS, 1.6),
         T(W - 6, oy - 6, xlab, 10.5, AXIS, 'end', 'bold', True),
         '<text x="12" y="%.1f" transform="rotate(-90 12 %.1f)" text-anchor="middle" font-family="%s" font-size="10.5" font-style="italic" font-weight="bold" fill="%s">%s</text>' % (oy / 2 + 8, oy / 2 + 8, FONT, AXIS, ylab)]
    x_end = W - 40
    y0 = oy - (18 if start_lbl else 0)
    # parabola through (ox,y0) and (x_end, oy) with vertex height ~ 22
    pts = []
    # y = a(x-h)^2 + k   choose h so curve fits
    k = 22
    # solve for h, a: a(ox-h)^2 + k = y0 ; a(x_end-h)^2 + k = oy
    r = math.sqrt((y0 - k) / float(oy - k))
    h = (ox + r * x_end) / (1 + r)
    a = (oy - k) / float((x_end - h) ** 2)
    for i in range(61):
        x = ox + (x_end - ox) * i / 60.0
        pts.append((x, a * (x - h) ** 2 + k))
    b.append(PL(pts, NAVY, 2.4))
    b.append(T(ox - 4, oy + 14, '0', 10, MUTED, 'end'))
    if start_lbl: b.append(C(ox, y0, 3.5)); b.append(T(ox + 6, y0 + 14, start_lbl, 10.5, NAVY, 'start', 'bold'))
    if q_at == 'end': b.append(qbox(x_end, oy + 12, 't = ?', 10.5))
    elif q_at == 'top': b.append(qbox(h, k - 2 if k > 18 else 18, 'max = ?', 10.5))
    return svg(W, H, ''.join(b), label)


def frac_text(x, y, num, den, size=14, col=NAVY):
    """Stacked fraction drawn in SVG, centred at x, bar at y."""
    w = max(visible_len(num), visible_len(den)) * size * 0.56 + 8
    return (T(x, y - 5, num, size, col, 'middle', 'bold') + L(x - w / 2, y, x + w / 2, y, col, 1.5)
            + T(x, y + size + 1, den, size, col, 'middle', 'bold'))

def card(lines, label, W=250, size=14):
    """Formula / given card. lines: list of items; each item is a str, or ('frac', lead, num, den, tail)."""
    H = 14; parts = []
    y = 10
    for ln in lines:
        if isinstance(ln, tuple) and ln[0] == 'frac':
            _, lead, num, den, tail = ln
            lw = visible_len(lead) * size * 0.56
            fw = max(visible_len(num), visible_len(den)) * size * 0.56 + 8
            tw = visible_len(tail) * size * 0.56
            tot = lw + fw + tw + 8
            x0 = W / 2 - tot / 2
            yb = y + size + 8
            parts.append(T(x0 + lw / 2, yb + 5, lead, size, NAVY, 'middle', 'bold'))
            parts.append(frac_text(x0 + lw + 4 + fw / 2, yb, num, den, size))
            if tail.strip() == '?': parts.append(qbox(x0 + lw + fw + 12 + 10, yb, '?', 12))
            elif tail: parts.append(T(x0 + lw + fw + 8 + tw / 2, yb + 5, tail, size, NAVY, 'middle', 'bold'))
            y += 2 * size + 18
        else:
            parts.append(T(W / 2, y + size, ln, size, NAVY, 'middle', 'bold')); y += size + 12
    H = int(y + 6)
    body = R(4, 3, W - 8, H - 6, '#f6f8fc', '#b9c1cf', 1.2, 8) + ''.join(parts)
    return svg(W, H, body, label)

def diff_squares(big, small, label):
    """x^2 square with a small square cut from the corner (difference of squares)."""
    W, H = 200, 150; x, y, s, t = 40, 16, 110, 38
    b = [R(x, y, s, s, FILLN, NAVY, 2),
         R(x + s - t, y, t, t, '#fff', RED, 2, 0, '5 3'),
         T(x + (s - t) / 2, y + s / 2 + 12, big, 15, NAVY, 'middle', 'bold'),
         T(x + s - t / 2, y + t / 2 + 5, small, 12.5, RED, 'middle', 'bold'),
         T(x + s / 2, y + s + 16, 'x', 13, NAVY, 'middle', 'bold', True),
         T(x - 8, y + s / 2 + 4, 'x', 13, NAVY, 'end', 'bold', True),
         T(x + s + 6, y + t / 2 + 4, '7', 12, RED, 'start', 'bold')]
    b[-1] = T(x + s + 6, y + t / 2 + 4, small.split('^')[0], 12, RED, 'start', 'bold')
    return svg(W, H, ''.join(b), label)

def complete_square(half, label, rhs=None):
    """x^2 + 2*half*x drawn as an x-square plus two strips; the missing corner is the '?'."""
    W, H = 220, 158; x, y, s, t = 40, 14, 86, 34
    b = [R(x, y, s, s, FILLN, NAVY, 2), T(x + s / 2, y + s / 2 + 5, 'x^2', 15, NAVY, 'middle', 'bold'),
         R(x + s, y, t, s, FILLN, NAVY, 2), T(x + s + t / 2, y + s / 2 + 5, '%dx' % half, 12.5, NAVY, 'middle', 'bold'),
         R(x, y + s, s, t, FILLN, NAVY, 2), T(x + s / 2, y + s + t / 2 + 5, '%dx' % half, 12.5, NAVY, 'middle', 'bold'),
         R(x + s, y + s, t, t, GOLDF, GOLD, 2, 0, '5 3'), qbox(x + s + t / 2, y + s + t / 2, '?', 12, 20),
         T(x + s / 2, y - 2 + 0, '', 1), T(x - 8, y + s / 2 + 4, 'x', 13, NAVY, 'end', 'bold', True),
         T(x - 8, y + s + t / 2 + 4, str(half), 13, NAVY, 'end', 'bold'),
         T(x + s + t + 8, y + 16, 'x', 13, NAVY, 'start', 'bold', True)]
    b = [e for e in b if 'font-size="1"' not in e]
    b.append(T(x + s / 2, H - 5, 'x', 13, NAVY, 'middle', 'bold', True)); b.append(T(x + s + t / 2, H - 5, str(half), 13, NAVY, 'middle', 'bold'))
    b = [e for e in b if not (e.startswith('<text') and 'x="%.1f" y="%.1f"' % (x + s + t + 8, y + 16) in e)]
    return svg(W, H, ''.join(b), label)
