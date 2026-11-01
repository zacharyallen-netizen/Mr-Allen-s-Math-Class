"""
Unit 6 — coordinate planes for the Tables & Systems notes.
Matches the page's existing grid exactly: 360x360 viewBox, 30px per unit,
origin at (180,180), same palette and fonts.
"""
NAVY = '#1B2A4A'
GOLD = '#C8A951'
RED  = '#C62828'
GREY = '#5D6673'
LINE = '#E5E9F0'
MONO = 'JetBrains Mono'

S = 30.0      # px per unit
O = 180.0     # origin
LIM = 6       # axis range -6..6


def px(x):  return O + S * x
def py(y):  return O - S * y


def _clip(m, b):
    """Return the two endpoints of y=mx+b clipped to the -6..6 box."""
    pts = []
    for x in (-LIM, LIM):                 # left / right edges
        y = m * x + b
        if -LIM - 1e-9 <= y <= LIM + 1e-9:
            pts.append((x, y))
    if m != 0:
        for y in (-LIM, LIM):             # bottom / top edges
            x = (y - b) / m
            if -LIM - 1e-9 <= x <= LIM + 1e-9:
                pts.append((x, y))
    # de-duplicate
    out = []
    for p in pts:
        if not any(abs(p[0] - q[0]) < 1e-6 and abs(p[1] - q[1]) < 1e-6 for q in out):
            out.append(p)
    return out[:2]


def grid(uid, rule=None):
    """Grid drawn as explicit lines.

    A <pattern> fill looks right on screen but Chromium drops it when the
    page is exported to PDF, so the squares vanish on paper. Explicit
    lines survive both.
    """
    rule = rule or LINE
    t = []
    for i in range(-LIM, LIM + 1):
        t.append('<line x1="%.1f" y1="0" x2="%.1f" y2="360" stroke="%s" stroke-width="1"/>'
                 % (px(i), px(i), rule))
        t.append('<line x1="0" y1="%.1f" x2="360" y2="%.1f" stroke="%s" stroke-width="1"/>'
                 % (py(i), py(i), rule))
    t.append('<line x1="0" y1="180" x2="360" y2="180" stroke="%s" stroke-width="1.5"/>' % NAVY)
    t.append('<line x1="180" y1="0" x2="180" y2="360" stroke="%s" stroke-width="1.5"/>' % NAVY)
    t.append('<text x="350" y="174" font-family="%s" font-size="11" fill="%s">x</text>' % (MONO, NAVY))
    t.append('<text x="185" y="12" font-family="%s" font-size="11" fill="%s">y</text>' % (MONO, NAVY))
    for v in (2, 4):
        t.append('<text x="%.0f" y="195" font-family="%s" font-size="9" fill="%s">%d</text>'
                 % (px(v) - 2, MONO, GREY, v))
        t.append('<text x="%.0f" y="195" font-family="%s" font-size="9" fill="%s">&#8722;%d</text>'
                 % (px(-v) - 9, MONO, GREY, v))
        t.append('<text x="185" y="%.0f" font-family="%s" font-size="9" fill="%s">%d</text>'
                 % (py(v) + 4, MONO, GREY, v))
        t.append('<text x="185" y="%.0f" font-family="%s" font-size="9" fill="%s">&#8722;%d</text>'
                 % (py(-v) + 4, MONO, GREY, v))
    return ''.join(t)


def line(m, b, col=NAVY, label=None, lx=None, dash=False, width=2.5):
    p = _clip(m, b)
    if len(p) < 2:
        return ''
    (x1, y1), (x2, y2) = p
    d = ' stroke-dasharray="7 5"' if dash else ''
    s = ('<line x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f" stroke="%s" stroke-width="%s" '
         'stroke-linecap="round"%s/>'
         % (px(x1), py(y1), px(x2), py(y2), col, width, d))
    if label:
        ux = lx if lx is not None else 3.2
        uy = m * ux + b
        s += ('<text x="%.1f" y="%.1f" font-family="%s" font-size="10" fill="%s" '
              'font-weight="700">%s</text>' % (px(ux) + 6, py(uy) - 7, MONO, col, label))
    return s


def dot(x, y, label=None, col=RED, r=6):
    s = ('<circle cx="%.1f" cy="%.1f" r="%d" fill="%s" stroke="#fff" stroke-width="2"/>'
         % (px(x), py(y), r, col))
    if label:
        s += ('<text x="%.1f" y="%.1f" font-family="%s" font-size="11" font-weight="700" '
              'fill="%s">%s</text>' % (px(x) + 10, py(y) - 5, MONO, col, label))
    return s


def svg(body, cls='coord'):
    return ('<svg class="%s" viewBox="0 0 360 360" xmlns="http://www.w3.org/2000/svg">%s</svg>'
            % (cls, body))


def legend(rows, x=6, y=6):
    """rows: list of (colour, text, dashed). Drawn as a boxed key, top-left."""
    if not rows:
        return ''
    w = 8 + 26 + max(len(t) for _, t, _ in rows) * 6.6 + 8
    h = 8 + 15 * len(rows) + 4
    o = ['<rect x="%.0f" y="%.0f" width="%.0f" height="%.0f" rx="5" fill="#ffffff" '
         'fill-opacity="0.92" stroke="%s" stroke-width="1"/>' % (x, y, w, h, LINE)]
    for i, (col, txt, dash) in enumerate(rows):
        cy = y + 14 + 15 * i
        d = ' stroke-dasharray="6 4"' if dash else ''
        o.append('<line x1="%.0f" y1="%.1f" x2="%.0f" y2="%.1f" stroke="%s" stroke-width="3" '
                 'stroke-linecap="round"%s/>' % (x + 7, cy, x + 27, cy, col, d))
        o.append('<text x="%.0f" y="%.1f" font-family="%s" font-size="10.5" font-weight="700" '
                 'fill="%s">%s</text>' % (x + 33, cy + 3.6, MONO, col, txt))
    return ''.join(o)


def plane(uid, lines=(), dots=(), note=None, key=True, rule=None):
    """lines: list of (m, b, colour, label[, dashed]) ; dots: list of (x, y, label)"""
    b = [grid(uid, rule)]
    rows = []
    # when one line is dashed it sits ON TOP of a coincident partner,
    # so draw the solid one thicker and let the dashes show through
    any_dashed = any(len(it) > 4 and it[4] for it in lines)
    for item in lines:
        m, c, col, lab, dash = (list(item) + [None, None, False])[:5]
        col = col or NAVY
        b.append(line(m, c, col, None, dash=bool(dash),
                      width=(4.5 if (any_dashed and not dash) else 2.5)))
        if lab:
            rows.append((col, lab, bool(dash)))
    for d in dots:
        x, y, lab = (list(d) + [None])[:3]
        b.append(dot(x, y, lab))
    if key:
        b.append(legend(rows))
    if note:
        w = len(note) * 6.9 + 18
        b.append('<rect x="%.1f" y="336" width="%.1f" height="20" rx="6" fill="#ffffff" '
                 'fill-opacity="0.93" stroke="%s" stroke-width="1"/>' % (180 - w / 2, w, LINE))
        b.append('<text x="180" y="350" text-anchor="middle" font-family="%s" font-size="11" '
                 'font-weight="700" fill="%s">%s</text>' % (MONO, NAVY, note))
    return svg(''.join(b))


def blank(uid, rows=(), rule=None):
    """An empty grid for students to draw on; rows is an optional legend key."""
    b = [grid(uid, rule)]
    if rows:
        b.append(legend(list(rows)))
    return svg(''.join(b))
