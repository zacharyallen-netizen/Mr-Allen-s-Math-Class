"""
Unit 5 — Converse of the Pythagorean Theorem.
Triangles drawn to TRUE scale by SSS construction.

The middle-length side is used as the base, so a genuine right triangle
stands upright with the right angle at the left vertex, and a near-miss
leans by a degree or two. That is the whole pedagogical point: the eye
cannot settle it, only the arithmetic can.
"""
import math

NAVY  = '#1E2D4F'
GOLD  = '#b08800'
GOLDF = '#FFC107'
BLUE  = '#0056B3'
GREEN = '#22AC00'
RED   = '#cc2222'
FILL  = '#e8edf5'
GREY  = '#8a93a6'


def _pts(a, b, c):
    """a<=b<=c. Base = b along x-axis. Returns A,B,C in math coords."""
    x = (a * a + b * b - c * c) / (2.0 * b)
    y2 = a * a - x * x
    if y2 <= 0:
        raise ValueError('degenerate triangle %r' % ((a, b, c),))
    return (0.0, 0.0), (float(b), 0.0), (x, math.sqrt(y2))


def tri(a, b, c, verdict=None, w=210, h=196, show_sq=False, cap=None):
    """
    verdict: None -> neutral (unknown, for practice)
             True -> right triangle (green)
             False-> not right (red)
    show_sq: draw the right-angle square (answer-reveal only)
    cap:     small caption under the figure
    """
    a, b, c = sorted([a, b, c])
    A, B, C = _pts(a, b, c)

    col = GREY if verdict is None else (GREEN if verdict else RED)
    fill = FILL if verdict is None else ('#eaf6e6' if verdict else '#fdeaea')

    top_pad = 26
    bot_pad = 50 if cap else 34
    maxW, maxH = w - 76, h - top_pad - bot_pad   # room for outside labels

    xs = [A[0], B[0], C[0]]
    ys = [A[1], B[1], C[1]]
    bw, bh = max(xs) - min(xs), max(ys) - min(ys)
    s = min(maxW / bw, maxH / bh)
    ox = (w - bw * s) / 2.0 - min(xs) * s
    oy = top_pad + (maxH - bh * s) / 2.0 + bh * s   # baseline y (flip)

    def P(p):
        return (ox + p[0] * s, oy - p[1] * s)

    pA, pB, pC = P(A), P(B), P(C)
    o = []
    o.append('<svg role="img" aria-label="Triangle with sides %g, %g and %g" '
             'width="%d" height="%d" viewBox="0 0 %d %d" '
             'xmlns="http://www.w3.org/2000/svg">' % (a, b, c, w, h, w, h))
    o.append('<polygon points="%.1f,%.1f %.1f,%.1f %.1f,%.1f" fill="%s" '
             'stroke="%s" stroke-width="2.5" stroke-linejoin="round"/>'
             % (pA[0], pA[1], pB[0], pB[1], pC[0], pC[1], fill, col))

    if show_sq:
        # right angle sits at A; mark it along AB and AC
        d = 13.0
        ux = (pB[0] - pA[0]), (pB[1] - pA[1])
        vx = (pC[0] - pA[0]), (pC[1] - pA[1])
        lu = math.hypot(*ux) or 1
        lv = math.hypot(*vx) or 1
        u = (ux[0] / lu * d, ux[1] / lu * d)
        v = (vx[0] / lv * d, vx[1] / lv * d)
        o.append('<polyline points="%.1f,%.1f %.1f,%.1f %.1f,%.1f" fill="none" '
                 'stroke="%s" stroke-width="2"/>'
                 % (pA[0] + u[0], pA[1] + u[1],
                    pA[0] + u[0] + v[0], pA[1] + u[1] + v[1],
                    pA[0] + v[0], pA[1] + v[1], col))

    # labels sit on the OUTSIDE of each edge: push along the normal that
    # points away from the centroid, so nothing lands inside the figure
    gx = (pA[0] + pB[0] + pC[0]) / 3.0
    gy = (pA[1] + pB[1] + pC[1]) / 3.0

    def lab(p, q, txt, d=19.0):
        mx, my = (p[0] + q[0]) / 2.0, (p[1] + q[1]) / 2.0
        vx, vy = mx - gx, my - gy
        n = math.hypot(vx, vy) or 1.0
        x, y = mx + vx / n * d, my + vy / n * d
        o.append('<text x="%.1f" y="%.1f" text-anchor="middle" '
                 'dominant-baseline="central" '
                 'font-family="Arvo,serif" font-size="12.5" font-weight="bold" '
                 'fill="%s">%g</text>' % (x, y, NAVY, txt))

    lab(pA, pB, b)          # base  = middle side
    lab(pA, pC, a)          # left  = shortest
    lab(pB, pC, c)          # right = longest

    if cap:
        o.append('<text x="%d" y="%d" text-anchor="middle" font-family="Arvo,serif" '
                 'font-size="11" font-weight="bold" fill="%s">%s</text>'
                 % (w // 2, h - 8, col, cap))
    o.append('<text x="%d" y="15" text-anchor="middle" font-family="Arvo,serif" '
             'font-size="11" font-weight="bold" fill="%s">%g, %g, %g</text>'
             % (w // 2, NAVY, a, b, c))
    o.append('</svg>')
    return ''.join(o)


def check(a, b, c):
    a, b, c = sorted([a, b, c])
    return a * a + b * b == c * c, a * a + b * b, c * c
