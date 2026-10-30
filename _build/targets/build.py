#!/usr/bin/env python3
"""Build the I Can Targets pages from data/targets.json + data/q_*.json.

  python3 build.py                 -> writes the hub + 4 domain pages into the site
  python3 build.py --preview CODES OUT.html   -> a standalone page with just those cards
  python3 build.py --check         -> validate every question file, print problems
"""
import json, glob, html, re, sys, os, math

WORK = "/home/claude/work"
SITE = "/home/claude/mr-allen-s-math-class/grade8/targets"
BASE_URL = "https://zacharyallen-netizen.github.io/Mr-Allen-s-Math-Class/grade8/targets/"

DOMAINS = [
    dict(key="Number System", slug="number-system-equations", name="Number System & Expressions/Equations",
         short="Number System & Equations", eog="24–28% of the EOG",
         blurb="Real numbers, roots, exponents, scientific notation, equations, and systems.",
         order=["NC.8.NS.1", "NC.8.EE.2", "NC.8.NS.2", "NC.8.EE.1", "NC.8.EE.3", "NC.8.EE.4", "NC.8.EE.7", "NC.8.EE.8"]),
    dict(key="Functions", slug="functions", name="Functions", short="Functions", eog="28–32% of the EOG",
         blurb="What a function is, slope, slope-intercept form, comparing and modeling linear functions, and qualitative graphs.",
         order=["NC.8.F.1", "NC.8.F.3", "NC.8.F.4", "NC.8.F.2", "NC.8.F.5"]),
    dict(key="Geometry", slug="geometry", name="Geometry", short="Geometry", eog="24–28% of the EOG",
         blurb="Angle relationships, the Pythagorean Theorem, transformations, congruence, similarity, and volume.",
         order=["NC.8.G.5", "NC.8.G.6", "NC.8.G.7", "NC.8.G.8", "NC.8.G.3", "NC.8.G.2", "NC.8.G.4", "NC.8.G.9"]),
    dict(key="Stats", slug="statistics-probability", name="Statistics & Probability", short="Statistics & Probability",
         eog="16–20% of the EOG",
         blurb="Scatter plots, lines of best fit, using a linear model, and two-way tables.",
         order=["NC.8.SP.1", "NC.8.SP.2", "NC.8.SP.3", "NC.8.SP.4"]),
]

EXPLORE = {
    "NC.8.NS.2": ("roots", "Zoom in on a square root", "Slide n and watch where √n lands between two whole numbers."),
    "NC.8.EE.3": ("sci", "Powers of ten", "Slide the exponent and watch the decimal point move."),
    "NC.8.EE.8": ("systems", "Two lines, one solution", "Change the slopes and intercepts and watch the intersection move."),
    "NC.8.F.3": ("slope", "Slope-intercept sliders", "Change m and b and watch the line move."),
    "NC.8.G.5": ("transversal", "Parallel lines and a transversal", "Turn the transversal and watch all eight angles change together."),
    "NC.8.G.6": ("pyth", "Squares on the sides", "Change the legs and compare the areas of the three squares."),
    "NC.8.G.8": ("distance", "Distance between two points", "Drag the two points; the right triangle and distance update."),
    "NC.8.G.3": ("transform", "Coordinate rules", "Pick a transformation and see the image and its coordinates."),
    "NC.8.G.4": ("dilate", "Dilation slider", "Change the scale factor and compare side lengths and angles."),
    "NC.8.G.9": ("volume", "Cylinder, cone, sphere", "Change the radius and height and compare the three volumes."),
    "NC.8.SP.2": ("bestfit", "Fit a line", "Drag the two handles to fit a line to the data and watch how far off the points are."),
    "NC.8.SP.4": ("twoway", "Build a two-way table", "Change the counts and watch the totals and relative frequencies update."),
}

LEVEL_CLASS = {"Approaching": "a", "Proficient": "p", "Mastery": "m"}
COLORS = {"blue", "red", "gold", "ink", "green", "muted"}
ALLOWED_TAGS = {"b", "i", "em", "strong", "sup", "sub", "br", "u", "span", "p", "ul", "ol", "li", "small"}


def esc(s):
    return html.escape(str(s), quote=True)


# ---------------------------------------------------------------- markup
def markup(s):
    """Author text -> HTML. Supports {{num|den}} stacked fractions, √{x} radical with bar."""
    if s is None:
        return ""
    s = str(s)
    # nested fractions: innermost first
    for _ in range(4):
        s = re.sub(r"\{\{([^{}|]*)\|([^{}]*)\}\}", r'<span class="fr"><span>\1</span><span>\2</span></span>', s)
    s = re.sub(r"√\{([^{}]*)\}", r'<span class="rad">√<span>\1</span></span>', s)
    return s


def check_markup(s, where, probs):
    if s is None:
        return
    s = str(s)
    if "{{" in s and not re.search(r"\{\{[^{}|]*\|[^{}]*\}\}", s):
        probs.append(f"{where}: unbalanced {{{{a|b}}}} fraction")
    h = markup(s)
    for m in re.finditer(r"<\s*/?\s*([a-zA-Z0-9]+)", h):
        if m.group(1).lower() not in ALLOWED_TAGS:
            probs.append(f"{where}: tag <{m.group(1)}> not allowed (escape < as &lt;)")
    stripped = re.sub(r"<[^>]*>", "", h)
    if "<" in stripped or ">" in stripped.replace("&gt;", ""):
        probs.append(f"{where}: raw < or > in text; write &lt; / &gt; or ≤ ≥")
    if re.search(r"(?<![A-Za-z0-9])-(?=\d)", stripped) and "−" not in stripped:
        probs.append(f"{where}: uses hyphen '-' as a minus sign; use '−' (U+2212)")


# ---------------------------------------------------------------- coordinate graphs
def _fmt(v):
    v = round(v, 6)
    if abs(v - round(v)) < 1e-9:
        v = int(round(v))
    s = str(v)
    return s.replace("-", "−")


def _clip(x1, y1, x2, y2, xmin, xmax, ymin, ymax):
    dx, dy = x2 - x1, y2 - y1
    p = [-dx, dx, -dy, dy]
    q = [x1 - xmin, xmax - x1, y1 - ymin, ymax - y1]
    u1, u2 = 0.0, 1.0
    for pi, qi in zip(p, q):
        if abs(pi) < 1e-12:
            if qi < 0:
                return None
        else:
            t = qi / pi
            if pi < 0:
                u1 = max(u1, t)
            else:
                u2 = min(u2, t)
    if u1 > u2:
        return None
    return (x1 + u1 * dx, y1 + u1 * dy, x1 + u2 * dx, y1 + u2 * dy)


def coord_svg(sp, small=False):
    xmin, xmax = sp.get("x", [-6, 6])
    ymin, ymax = sp.get("y", [-6, 6])
    xstep = sp.get("xstep", sp.get("step", 1))
    ystep = sp.get("ystep", sp.get("step", 1))
    xl = sp.get("xlabels", 1)
    yl = sp.get("ylabels", 1)
    axes = sp.get("axes", "cross")
    W = sp.get("size", 180 if small else 320)
    ux = W / (xmax - xmin)
    if "height" in sp:
        H = sp["height"]
        uy = H / (ymax - ymin)
    else:
        uy = ux
        H = uy * (ymax - ymin)
    frame = axes == "frame"
    ml = (44 if sp.get("ytitle") else 30) if frame else 14
    mb = (40 if sp.get("xtitle") else 24) if frame else 14
    mt, mr = 12, 14
    if not frame and (sp.get("ytitle") or sp.get("xtitle")):
        mr = 30; mt = 18
    fs = 10.5 if small else 12
    VW, VH = ml + W + mr, mt + H + mb

    def X(x): return ml + (x - xmin) * ux
    def Y(y): return mt + (ymax - y) * uy

    o = []
    # grid
    if sp.get("grid", True):
        k = 0
        x = xmin
        while x <= xmax + 1e-9:
            o.append(f'<line class="s-grid" x1="{X(x):.1f}" y1="{Y(ymin):.1f}" x2="{X(x):.1f}" y2="{Y(ymax):.1f}"/>')
            k += 1; x = xmin + k * xstep
        k = 0; y = ymin
        while y <= ymax + 1e-9:
            o.append(f'<line class="s-grid" x1="{X(xmin):.1f}" y1="{Y(y):.1f}" x2="{X(xmax):.1f}" y2="{Y(y):.1f}"/>')
            k += 1; y = ymin + k * ystep
    # axes
    if frame:
        ax_y, ax_x = ymin, xmin
    else:
        ax_y = 0 if ymin <= 0 <= ymax else ymin
        ax_x = 0 if xmin <= 0 <= xmax else xmin
    o.append(f'<line class="s-ink" stroke-width="1.6" x1="{X(xmin):.1f}" y1="{Y(ax_y):.1f}" x2="{X(xmax):.1f}" y2="{Y(ax_y):.1f}"/>')
    o.append(f'<line class="s-ink" stroke-width="1.6" x1="{X(ax_x):.1f}" y1="{Y(ymin):.1f}" x2="{X(ax_x):.1f}" y2="{Y(ymax):.1f}"/>')
    if not frame and not small and sp.get("arrows", True):
        # arrowheads on axes ends
        for (a, b, c, d) in [(X(xmax), Y(ax_y), 1, 0), (X(xmin), Y(ax_y), -1, 0), (X(ax_x), Y(ymax), 0, -1), (X(ax_x), Y(ymin), 0, 1)]:
            if c:
                o.append(f'<path class="f-ink" d="M{a+6*c:.1f},{b:.1f} L{a:.1f},{b-3.5:.1f} L{a:.1f},{b+3.5:.1f} Z"/>')
            else:
                o.append(f'<path class="f-ink" d="M{a:.1f},{b+6*d:.1f} L{a-3.5:.1f},{b:.1f} L{a+3.5:.1f},{b:.1f} Z"/>')
    # tick labels
    if sp.get("ticks", True):
        k = 0; x = xmin
        while x <= xmax + 1e-9:
            if k % xl == 0 and not (not frame and abs(x - ax_x) < 1e-9 and ax_x == 0):
                ty = Y(ax_y) + (fs + 4)
                o.append(f'<line class="s-ink" x1="{X(x):.1f}" y1="{Y(ax_y)-3:.1f}" x2="{X(x):.1f}" y2="{Y(ax_y)+3:.1f}"/>')
                o.append(f'<text x="{X(x):.1f}" y="{ty:.1f}" font-size="{fs}" text-anchor="middle" class="t-muted">{_fmt(x)}</text>')
            k += 1; x = xmin + k * xstep
        k = 0; y = ymin
        while y <= ymax + 1e-9:
            if k % yl == 0 and not (not frame and abs(y - ax_y) < 1e-9 and ax_y == 0):
                o.append(f'<line class="s-ink" x1="{X(ax_x)-3:.1f}" y1="{Y(y):.1f}" x2="{X(ax_x)+3:.1f}" y2="{Y(y):.1f}"/>')
                o.append(f'<text x="{X(ax_x)-6:.1f}" y="{Y(y)+fs*0.35:.1f}" font-size="{fs}" text-anchor="end" class="t-muted">{_fmt(y)}</text>')
            k += 1; y = ymin + k * ystep
        if not frame and ax_x == 0 and ax_y == 0:
            o.append(f'<text x="{X(0)-5:.1f}" y="{Y(0)+fs+3:.1f}" font-size="{fs}" text-anchor="end" class="t-muted">0</text>')
    if sp.get("xtitle"):
        if frame:
            o.append(f'<text x="{ml+W/2:.1f}" y="{VH-6:.1f}" font-size="{fs+1}" text-anchor="middle" font-weight="600">{esc(sp["xtitle"])}</text>')
        else:
            o.append(f'<text x="{X(xmax)+4:.1f}" y="{Y(ax_y)-6:.1f}" font-size="{fs+1}" text-anchor="end" font-style="italic" font-weight="600">{esc(sp["xtitle"])}</text>')
    if sp.get("ytitle"):
        if frame:
            cx, cy = 12, mt + H / 2
            o.append(f'<text x="{cx}" y="{cy:.1f}" font-size="{fs+1}" text-anchor="middle" font-weight="600" transform="rotate(-90 {cx} {cy:.1f})">{esc(sp["ytitle"])}</text>')
        else:
            o.append(f'<text x="{X(ax_x)+7:.1f}" y="{Y(ymax)+4:.1f}" font-size="{fs+1}" font-style="italic" font-weight="600">{esc(sp["ytitle"])}</text>')

    def col(c, default="blue"):
        c = c or default
        return c if c in COLORS else default

    # polygons
    for pg in sp.get("polygons", []):
        c = col(pg.get("color"))
        pts = " ".join(f"{X(a):.1f},{Y(b):.1f}" for a, b in pg["pts"])
        fill = {"blue": "f-soft", "red": "f-redsoft", "gold": "f-goldsoft", "green": "f-greensoft"}.get(c, "f-soft") if pg.get("fill", True) else "f-none"
        dash = ' stroke-dasharray="5 4"' if pg.get("dashed") else ""
        o.append(f'<polygon class="s-{c} {fill}" stroke-width="2" fill-opacity=".75" points="{pts}"{dash}/>')
        labs = pg.get("labels") or []
        if labs:
            cxp = sum(a for a, b in pg["pts"]) / len(pg["pts"])
            cyp = sum(b for a, b in pg["pts"]) / len(pg["pts"])
            for (a, b), lab in zip(pg["pts"], labs):
                if not lab:
                    continue
                dx, dy = a - cxp, b - cyp
                n = math.hypot(dx * ux, dy * uy) or 1
                tx = X(a) + 11 * dx * ux / n
                ty = Y(b) - 11 * dy * uy / n + fs * 0.35
                o.append(f'<text x="{tx:.1f}" y="{ty:.1f}" font-size="{fs}" text-anchor="middle" font-weight="700" class="t-{c if c!="ink" else "muted"}">{esc(lab)}</text>')
    # lines
    for ln in sp.get("lines", []):
        c = col(ln.get("color"))
        dash = ' stroke-dasharray="6 4"' if ln.get("dashed") else ""
        if "segment" in ln:
            (x1, y1), (x2, y2) = ln["segment"]
            seg = (x1, y1, x2, y2)
        else:
            if "x" in ln:
                x1 = x2 = ln["x"]; y1, y2 = ymin - 1, ymax + 1
            elif "through" in ln:
                (a1, b1), (a2, b2) = ln["through"]
                if abs(a2 - a1) < 1e-12:
                    x1 = x2 = a1; y1, y2 = ymin - 1, ymax + 1
                else:
                    m = (b2 - b1) / (a2 - a1)
                    x1, x2 = xmin - 1, xmax + 1
                    y1, y2 = b1 + m * (x1 - a1), b1 + m * (x2 - a1)
            else:
                m, b = ln["m"], ln["b"]
                x1, x2 = xmin - 1, xmax + 1
                y1, y2 = m * x1 + b, m * x2 + b
            seg = _clip(x1, y1, x2, y2, xmin, xmax, ymin, ymax)
        if not seg:
            continue
        a1, b1, a2, b2 = seg
        o.append(f'<line class="s-{c}" stroke-width="2.4" stroke-linecap="round" x1="{X(a1):.1f}" y1="{Y(b1):.1f}" x2="{X(a2):.1f}" y2="{Y(b2):.1f}"{dash}/>')
        if ln.get("label"):
            if ln.get("labelAt"):
                lx, ly = ln["labelAt"]
                tx, ty = X(lx), Y(ly)
            else:
                # near the end that is further right/up, nudged inside
                ex, ey = (a2, b2) if a2 >= a1 else (a1, b1)
                tx, ty = X(ex) - 6, Y(ey) - 8
                if ty < mt + 10:
                    ty = mt + 12
            anchor = ln.get("anchor", "end")
            o.append(f'<text x="{tx:.1f}" y="{ty:.1f}" font-size="{fs}" text-anchor="{anchor}" font-weight="700" class="t-{c}" paint-order="stroke" stroke="#fff" stroke-width="3">{esc(ln["label"])}</text>')
    # curves
    for cv in sp.get("curves", []):
        c = col(cv.get("color"))
        d = " ".join(("M" if i == 0 else "L") + f"{X(a):.1f},{Y(b):.1f}" for i, (a, b) in enumerate(cv["pts"]))
        dash = ' stroke-dasharray="6 4"' if cv.get("dashed") else ""
        o.append(f'<path class="s-{c} f-none" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round" d="{d}"{dash}/>')
    # points
    for p in sp.get("points", []):
        c = col(p.get("color"), "ink" if sp.get("scatter") else "blue")
        r = p.get("r", 3.2 if sp.get("scatter") else 4)
        fill = "f-white" if p.get("open") else f"f-{c}"
        o.append(f'<circle cx="{X(p["x"]):.1f}" cy="{Y(p["y"]):.1f}" r="{r}" class="{fill} s-{c}" stroke-width="1.6"/>')
        if p.get("label"):
            pos = p.get("pos", "ne")
            dx = {"e": 7, "w": -7, "n": 0, "s": 0}.get(pos[-1], 0) if len(pos) == 1 else (7 if "e" in pos else -7)
            dy = -8 if "n" in pos else (fs + 4 if "s" in pos else fs * 0.35)
            anchor = "start" if dx > 0 else ("end" if dx < 0 else "middle")
            o.append(f'<text x="{X(p["x"])+dx:.1f}" y="{Y(p["y"])+dy:.1f}" font-size="{fs}" text-anchor="{anchor}" font-weight="700" class="t-{c if c!="ink" else "muted"}" paint-order="stroke" stroke="#fff" stroke-width="3">{esc(p["label"])}</text>')
    for t in sp.get("texts", []):
        c = col(t.get("color"), "ink")
        o.append(f'<text x="{X(t["x"]):.1f}" y="{Y(t["y"]):.1f}" font-size="{t.get("size", fs)}" text-anchor="{t.get("anchor","middle")}" font-weight="{t.get("weight",600)}" class="t-{c}" paint-order="stroke" stroke="#fff" stroke-width="3">{esc(t["t"])}</text>')

    data = (f'data-x0="{xmin}" data-y0="{ymin}" data-ox="{ml}" data-oy="{mt+H:.2f}" data-ux="{ux:.4f}" data-uy="{uy:.4f}" '
            f'data-sx="{xstep}" data-sy="{ystep}" data-xmin="{xmin}" data-xmax="{xmax}" data-ymin="{ymin}" data-ymax="{ymax}"')
    alt = esc(sp.get("alt", "Coordinate graph"))
    return (f'<svg class="coordsvg" viewBox="0 0 {VW:.0f} {VH:.0f}" width="{VW:.0f}" role="img" aria-label="{alt}" {data} '
            f'xmlns="http://www.w3.org/2000/svg">{"".join(o)}</svg>')


def table_html(sp):
    out = ['<div class="tw"><table class="dtab">']
    if sp.get("caption"):
        out.append(f"<caption>{markup(sp['caption'])}</caption>")
    if sp.get("header"):
        out.append("<tr>" + "".join(f"<th>{markup(h)}</th>" for h in sp["header"]) + "</tr>")
    for row in sp.get("rows", []):
        cells = []
        for j, c in enumerate(row):
            tag = "th" if (j == 0 and sp.get("rowheads")) else "td"
            cells.append(f"<{tag}>{markup(c)}</{tag}>")
        out.append("<tr>" + "".join(cells) + "</tr>")
    out.append("</table></div>")
    return "".join(out)


def visual_html(v, small=False):
    if not v:
        return ""
    if isinstance(v, list):
        return '<div style="display:flex;gap:14px;flex-wrap:wrap;justify-content:center;align-items:flex-end">' + "".join(visual_html(x, small) for x in v) + "</div>"
    t = v.get("type")
    cap = f'<figcaption>{markup(v["caption"])}</figcaption>' if v.get("caption") else ""
    if t == "coord":
        ro = '<div class="readout">Tap or hover on the graph to read a point.</div>' if (v.get("readout") and not small) else ""
        return f'<figure class="vz coord">{coord_svg(v, small)}{cap}{ro}</figure>'
    if t == "svg":
        svg = v["svg"]
        if 'role="img"' not in svg:
            svg = svg.replace("<svg", f'<svg role="img" aria-label="{esc(v.get("alt","Diagram"))}"', 1)
        if "xmlns" not in svg:
            svg = svg.replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg"', 1)
        return f'<figure class="vz{" wide" if v.get("wide") else ""}">{svg}{cap}</figure>'
    if t == "table":
        return f'<figure class="vz">{table_html(v)}</figure>'
    raise ValueError("unknown visual type " + str(t))


# ---------------------------------------------------------------- load
def load_targets():
    return json.load(open(f"{WORK}/data/targets.json"))


def load_questions(paths=None):
    qs = {}
    for p in sorted(paths or glob.glob(f"{WORK}/data/q_*.json")):
        try:
            arr = json.load(open(p))
        except Exception as e:
            print(f"!! {p}: {e}")
            continue
        for q in arr:
            q["_file"] = os.path.basename(p)
            qs[q["code"]] = q
    return qs


def validate(q, t, probs):
    w = q["code"]
    for k in ["stem", "choices", "explain"]:
        if not q.get(k):
            probs.append(f"{w}: missing {k}")
    ch = q.get("choices", [])
    if len(ch) != 4:
        probs.append(f"{w}: needs exactly 4 choices (has {len(ch)})")
    seen = set()
    for i, c in enumerate(ch):
        if not isinstance(c, dict) or "t" not in c or "why" not in c:
            probs.append(f"{w}: choice {i} must be {{\"t\":..., \"why\":...}}")
            continue
        key = json.dumps(c["t"], sort_keys=True) if not isinstance(c["t"], str) else re.sub(r"\s+", "", c["t"]).lower()
        if key in seen:
            probs.append(f"{w}: duplicate choice {i}")
        seen.add(key)
        if isinstance(c["t"], str):
            check_markup(c["t"], f"{w} choice {i}", probs)
        else:
            try:
                visual_html(c["t"], small=True)
            except Exception as e:
                probs.append(f"{w}: choice {i} visual error {e}")
        check_markup(c["why"], f"{w} why {i}", probs)
        if not str(c["why"]).strip():
            probs.append(f"{w}: choice {i} has empty why")
    check_markup(q.get("stem"), f"{w} stem", probs)
    check_markup(q.get("hint"), f"{w} hint", probs)
    for i, s in enumerate(q.get("explain", [])):
        check_markup(s, f"{w} explain {i}", probs)
    try:
        visual_html(q.get("visual"))
    except Exception as e:
        probs.append(f"{w}: visual error {e}")
    v = q.get("visual")
    vs = v if isinstance(v, list) else ([v] if v else [])
    for x in vs:
        if x.get("type") == "svg":
            s = x["svg"]
            if not s.strip().startswith("<svg") or "viewBox" not in s:
                probs.append(f"{w}: svg must start with <svg and have a viewBox")
            if re.search(r"<(script|foreignObject|image|style)\b", s):
                probs.append(f"{w}: svg must not contain script/foreignObject/image/style")
            if re.search(r'(fill|stroke)="#?[0-9a-fA-F]{3,6}"', s) and False:
                pass


# ---------------------------------------------------------------- cards / pages
def card_html(t, q):
    lv = LEVEL_CLASS[t["level"]]
    code = t["code"]
    parts = [f'<article class="tg" id="{esc(code)}" data-level="{lv}">',
             f'<div class="tg-top"><span class="tg-code">{esc(code)}</span>'
             f'<span class="pill {lv}">{esc(t["level"])} ({t["score"]})</span>'
             f'<span class="tg-done">✓ Solved</span></div>',
             f'<p class="ican">{esc(t["ican"])}</p>']
    if q is None:
        parts.append('<p class="stem"><i>Question coming soon.</i></p></article>')
        return "".join(parts)
    parts.append(f'<div class="stem">{markup(q["stem"])}</div>')
    parts.append(visual_html(q.get("visual")))
    has_vis = any(not isinstance(c["t"], str) for c in q["choices"])
    short = all(isinstance(c["t"], str) and len(re.sub(r"<[^>]*>", "", markup(c["t"]))) <= 28 for c in q["choices"])
    parts.append(f'<div class="choices{" two" if (has_vis or short) else ""}" role="group" aria-label="Answer choices">')
    for i, c in enumerate(q["choices"]):
        body = markup(c["t"]) if isinstance(c["t"], str) else visual_html(c["t"], small=True)
        parts.append(f'<button type="button" class="ch" data-ok="{1 if i == 0 else 0}"><span class="lt">{"ABCD"[i]}</span>'
                     f'<span class="cht">{body}</span><span class="why" hidden>{markup(c["why"])}</span></button>')
    parts.append('</div><div class="fb" aria-live="polite"></div>')
    if q.get("hint"):
        parts.append(f'<div class="hintbox" hidden><b>Hint:</b> {markup(q["hint"])}</div>')
    parts.append('<div class="explain" hidden><b>How to solve it</b><ol>' +
                 "".join(f"<li>{markup(s)}</li>" for s in q["explain"]) + "</ol></div>")
    parts.append('<div class="tg-actions">')
    if q.get("hint"):
        parts.append('<button type="button" class="btn-hint">Hint</button>')
    parts.append('<button type="button" class="btn-show" hidden>Show answer</button>'
                 '<button type="button" class="btn-again" hidden>Try again</button>')
    if t.get("lesson_url"):
        parts.append(f'<a class="lesson-link" href="{esc(t["lesson_url"])}">Review: {esc(t["lesson"])} →</a>')
    parts.append("</div></article>")
    return "".join(parts)


HEAD = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{title}</title>
<meta name="description" content="{desc}">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Source+Serif+4:opsz,wght@8..60,600&family=JetBrains+Mono:wght@500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="{root}site.css">
<link rel="stylesheet" href="targets.css">
</head>
<body>
<script src="{root}site-bar.js"></script>
"""


def domain_page(d, targets, qs):
    by_std = {}
    for t in targets:
        by_std.setdefault(t["standard"], []).append(t)
    all_codes = [t["code"] for s in d["order"] for t in by_std[s]]
    o = [HEAD.format(title=f"{d['name']} — I Can Targets | Mr. Allen's Math Class",
                     desc=f"Practice question for every 8th grade I can target in {d['name']}.", root="../../")]
    o.append('<main class="tg-wrap">')
    o.append('<nav class="crumbs" aria-label="Breadcrumb"><a href="../index.html">8th Grade</a><span>›</span>'
             '<a href="index.html">I Can Targets</a><span>›</span><span>' + esc(d["short"]) + "</span></nav>")
    o.append('<header class="dom-hdr"><span class="eyebrow">I Can Targets · ' + esc(d["eog"]) + "</span>"
             f'<h1>{esc(d["name"])}</h1><p>{esc(d["blurb"])} Each target has one practice question. '
             "Pick an answer to check it; a wrong pick tells you what went wrong so you can try again.</p>"
             f'<div class="prog" data-count="{",".join(all_codes)}"><span>Solved</span><div class="bar"><i></i></div><b>0 / {len(all_codes)}</b></div></header>')
    o.append('<div class="toolbar"><div class="chips">' +
             "".join(f'<a href="#{s}">{s.replace("NC.8.","")}</a>' for s in d["order"]) + "</div>"
             '<div class="filters" role="group" aria-label="Show">'
             '<button type="button" data-f="all" aria-pressed="true">All</button>'
             '<button type="button" data-f="a">Approaching</button>'
             '<button type="button" data-f="p">Proficient</button>'
             '<button type="button" data-f="m">Mastery</button>'
             '<button type="button" data-f="todo">Not solved yet</button></div></div>')
    for s in d["order"]:
        ts = by_std[s]
        t0 = ts[0]
        codes = ",".join(t["code"] for t in ts)
        o.append(f'<section class="std" id="{s}"><div class="std-hdr"><span class="code">{s}</span><h2>{esc(t0["title"])}</h2></div>')
        o.append(f'<p class="std-meta"><span class="tag{" pri" if t0["type"]=="Priority" else ""}">{t0["type"]}</span> · Unit {t0["unit"][1:]} · '
                 f'<span class="std-count" data-count="{codes}"><b>0 / {len(ts)}</b> solved</span></p>')
        if s in EXPLORE:
            ex, title, sub = EXPLORE[s]
            o.append(f'<details class="explore"><summary>Explore it: {esc(title)} <span>— {esc(sub)}</span></summary>'
                     f'<div class="exb" data-ex="{ex}"></div></details>')
        last = None
        for t in ts:
            if t["level"] != last:
                lv = LEVEL_CLASS[t["level"]]
                o.append(f'<h3 class="lvl-h {lv}">{t["level"]} · score {t["score"]}</h3>')
                last = t["level"]
            o.append(card_html(t, qs.get(t["code"])))
        o.append("</section>")
    o.append("</main>")
    o.append('<div class="site-footer">© 2026–27 · Mr. Allen\'s Math Class</div>')
    o.append('<script src="targets.js"></script><script src="explore.js"></script>\n</body>\n</html>\n')
    return "\n".join(o)


def hub_page(targets):
    by_std = {}
    for t in targets:
        by_std.setdefault(t["standard"], []).append(t)
    o = [HEAD.format(title="I Can Targets — Mr. Allen's Math Class",
                     desc="Every 8th grade I can target with a practice question, organized by EOG domain.", root="../../")]
    o.append('<main class="tg-wrap">')
    o.append('<nav class="crumbs" aria-label="Breadcrumb"><a href="../index.html">8th Grade</a><span>›</span><span>I Can Targets</span></nav>')
    allc = ",".join(t["code"] for t in targets)
    o.append('<header class="dom-hdr"><span class="eyebrow">Scope &amp; sequence · 25 standards · 218 targets</span>'
             "<h1>I Can Targets</h1><p>Every 8th grade standard is broken into small I can targets — the steps from "
             "<b>Approaching</b> to <b>Proficient</b> to <b>Mastery</b>. Each target has one practice question you can check right here. "
             "Your I Can Tracker links straight to each one.</p>"
             f'<div class="prog" data-count="{allc}"><span>Solved on this device</span><div class="bar"><i></i></div><b>0 / {len(targets)}</b></div></header>')
    o.append('<div class="hub-grid">')
    for d in DOMAINS:
        codes = [t["code"] for s in d["order"] for t in by_std[s]]
        o.append(f'<a class="dom-card" href="{d["slug"]}.html"><span class="k">{esc(d["eog"])}</span><h2>{esc(d["name"])}</h2>'
                 f'<p>{esc(d["blurb"])}</p><p>{len(d["order"])} standards · {len(codes)} targets</p>'
                 f'<div class="prog" data-count="{",".join(codes)}"><div class="bar"><i></i></div><b>0 / {len(codes)}</b></div></a>')
    o.append("</div>")
    o.append('<section class="how"><h2>How to use the targets</h2><ol>'
             "<li>Find the standard we are working on (or click <b>Try it</b> in your I Can Tracker).</li>"
             "<li>Work the problem on paper first, then pick an answer.</li>"
             "<li>If it's wrong, read the note — it tells you what mistake that answer comes from — and try again. Use <b>Hint</b> if you're stuck.</li>"
             "<li>When you get it, read <b>How to solve it</b>, then set that statement to <b>Got it ✓</b> in your tracker.</li>"
             '</ol><div class="levels"><span class="pill a">Approaching (3)</span><span class="pill p">Proficient (4)</span><span class="pill m">Mastery (5)</span></div></section>')
    # scope & sequence table
    o.append('<div class="section-label">Scope &amp; sequence — in the order we learn them</div>')
    o.append('<div class="tw"><table class="std-list"><tr><th>Unit</th><th>Standard</th><th>What it is</th><th>Targets</th></tr>')
    seq = ["NC.8.NS.1", "NC.8.EE.2", "NC.8.NS.2", "NC.8.EE.1", "NC.8.EE.3", "NC.8.EE.4", "NC.8.EE.7", "NC.8.G.5",
           "NC.8.G.6", "NC.8.G.7", "NC.8.G.8", "NC.8.F.1", "NC.8.F.3", "NC.8.F.4", "NC.8.F.2", "NC.8.F.5", "NC.8.EE.8",
           "NC.8.SP.1", "NC.8.SP.2", "NC.8.SP.3", "NC.8.SP.4", "NC.8.G.3", "NC.8.G.2", "NC.8.G.4", "NC.8.G.9"]
    slug = {s: d["slug"] for d in DOMAINS for s in d["order"]}
    for s in seq:
        ts = by_std[s]
        codes = ",".join(t["code"] for t in ts)
        o.append(f'<tr><td>{ts[0]["unit"][1:]}</td><td class="c"><a href="{slug[s]}.html#{s}">{s}</a></td>'
                 f'<td>{esc(ts[0]["title"])} <small style="color:var(--muted)">· {ts[0]["type"]}</small></td>'
                 f'<td class="n" data-count="{codes}"><b>0 / {len(ts)}</b></td></tr>')
    o.append("</table></div>")
    o.append('<p class="reset">Check marks are saved in this browser only. <button type="button" id="reset-all">Clear my check marks</button></p>')
    o.append("</main>")
    o.append('<div class="site-footer">© 2026–27 · Mr. Allen\'s Math Class</div>')
    o.append('<script src="targets.js"></script>\n</body>\n</html>\n')
    return "\n".join(o)


def preview(codes, out):
    targets = {t["code"]: t for t in load_targets()}
    qs = load_questions()
    cards = []
    for c in codes:
        if c not in targets:
            print("unknown code", c); continue
        cards.append(card_html(targets[c], qs.get(c)))
    page = HEAD.format(title="preview", desc="", root=SITE + "/../../").replace('<script src="' + SITE + '/../../site-bar.js"></script>', "")
    page = page.replace('href="targets.css"', f'href="file://{SITE}/targets.css"').replace(f'href="{SITE}/../../site.css"', f'href="file:///home/claude/mr-allen-s-math-class/site.css"')
    page += '<main class="tg-wrap">' + "\n".join(cards) + f'</main><script src="file://{SITE}/targets.js"></script></body></html>'
    open(out, "w").write(page)


def main():
    if "--preview" in sys.argv:
        i = sys.argv.index("--preview")
        preview(sys.argv[i + 1].split(","), sys.argv[i + 2])
        return
    targets = load_targets()
    qs = load_questions()
    probs = []
    tmap = {t["code"]: t for t in targets}
    for c, q in qs.items():
        if c not in tmap:
            probs.append(f"{c}: not a target code ({q['_file']})")
            continue
        validate(q, tmap[c], probs)
    missing = [t["code"] for t in targets if t["code"] not in qs]
    if "--check" in sys.argv:
        for p in probs:
            print(p)
        print(f"{len(qs)} questions, {len(missing)} missing, {len(probs)} problems")
        if missing and "--missing" in sys.argv:
            print("missing:", ",".join(missing))
        return
    os.makedirs(SITE, exist_ok=True)
    for d in DOMAINS:
        open(f"{SITE}/{d['slug']}.html", "w").write(domain_page(d, targets, qs))
    open(f"{SITE}/index.html", "w").write(hub_page(targets))
    print(f"built: {len(qs)} questions, {len(missing)} missing, {len(probs)} problems")


if __name__ == "__main__":
    main()
