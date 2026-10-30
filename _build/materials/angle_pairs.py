"""Angle Relationships handout (NC.8.G.5): vertical angles, linear pair, complementary, supplementary.
Two-sided: FRONT = notes box + 6 blank sample problems (worked in green on the key),
BACK = leveled Check-In style practice (Approaching (3) / Proficient (4) / Mastery (5)).

    sh _build/materials/get_fonts.sh
    OUT_DIR=/path/to/out python3 _build/materials/angle_pairs.py

Every figure is drawn from its own numbers (angles to scale). Labels are placed by a small search
that keeps each label inside its own angle and off every line.
"""
import sys, os, math
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from kit import *
import kit
from handouts import item, mc, sa, entry, work, front_head, back_head

# kit.render writes to one shared /tmp/_mat.html; use a private temp file so parallel builds can't collide.
import inspect, tempfile
_src = inspect.getsource(kit.render).replace('"/tmp/_mat.html"', '_TMP').replace("0.85 * 96 - 14", "0.85 * 96 - 20")
_src = _src.replace('pg.evaluate("""(avail) =>', 'render.zooms = pg.evaluate("""(avail) =>').replace(
    "f.style.zoom = z; } } }\"\"\", avail)",
    "f.style.zoom = z; } } return [...document.querySelectorAll('[data-fit]')].map(f => parseFloat(f.style.zoom)); }\"\"\", avail)")
_src = _src.replace("        n = pg.evaluate(", "        render.work = pg.evaluate(\"[...document.querySelectorAll('.wa')].map(w => w.getBoundingClientRect().height / 96)\")\n        n = pg.evaluate(")
assert "_TMP" in _src and "- 20" in _src and "render.zooms" in _src and "map(f => parseFloat" in _src and "render.work" in _src
_ns = dict(vars(kit)); _ns["_TMP"] = os.path.join(tempfile.mkdtemp(prefix="angles_"), "mat.html")
exec(_src, _ns); render = _ns["render"]

TOPIC, STD = "Angle Relationships", "NC.8.G.5"
NAVYC, GOLDC, BLUE = "#1E2D4F", "#B07D00", "#1D4ED8"

kit.CSS += """
.lvl{display:flex;align-items:center;gap:8px;margin:5px 0 4px;font:700 8pt Inter;color:#5B6475;letter-spacing:.04em}
.lvl::after{content:"";flex:1;border-top:1px solid #E3E5EA}
.pill{display:inline-block;border-radius:999px;padding:1px 9px;font:700 8pt Inter;letter-spacing:.03em}
.pill.a{color:#8A6100;background:#FFF4D1}.pill.p{color:#1D4ED8;background:#E6EEFF}.pill.m{color:#6D28D9;background:#EFE7FD}
.rel{border:1px solid #E3E5EA;border-radius:7px;padding:4px 6px;background:#fff;text-align:center}
.rel b.n{display:block;font:600 10.5pt 'Source Serif 4';color:#1E2D4F}
.rel .r{font:700 9pt Inter;color:#1E2D4F;margin-top:1px}
.rel .d{font-size:8pt;color:#5B6475;line-height:1.25}
.smp{border:1px solid #E3E5EA;border-radius:8px;padding:5px 8px;break-inside:avoid}
.smp .tt{font:600 9.5pt Inter;color:#1E2D4F}
.smp .pp{font-size:9.4pt;margin:1px 0 2px}
.smp .st{color:#15803D;font:600 9.3pt/1.45 'Source Serif 4'}
.fig{flex:none}
"""

# ───────────────────────── angle figure engine ─────────────────────────
def tw(s, fs):   # rough text width in px
    w = 0
    for ch in s:
        w += 0.30 if ch in " ()" else 0.62 if ch in "−+" else 0.42 if ch == "°" else 0.56
    return w * fs * 1.12

def P(deg, r): a = math.radians(deg); return r * math.cos(a), -r * math.sin(a)   # math angle → svg

def seg_hits_box(x1, y1, x2, y2, bx):
    for i in range(41):
        t = i / 40; x = x1 + (x2 - x1) * t; y = y1 + (y2 - y1) * t
        if bx[0] <= x <= bx[2] and bx[1] <= y <= bx[3]: return True
    return False

FIG = {"L": 62}
def fig(lines=(), rays=(), arcs=(), squares=(), L=None, fs=10.5, pad=4):
    """lines: directions (deg) of full lines through O. rays: one-way rays.
    arcs: (from, to, label, color). squares: (from_dir) right-angle mark between d and d+90.
    Returns an SVG string sized to its content."""
    L = L or FIG["L"]; segs = []
    for d in lines:
        x1, y1 = P(d, L); x2, y2 = P(d + 180, L); segs.append((x1, y1, x2, y2))
    for d in rays:
        x2, y2 = P(d, L); segs.append((0, 0, x2, y2))
    out, boxes = [], []
    for (x1, y1, x2, y2) in segs:
        out.append(f'<line x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}" stroke="{NAVYC}" stroke-width="1.7" stroke-linecap="round"/>')
    for d in squares:
        s = 8; ax, ay = P(d, s); bx_, by_ = P(d + 90, s); cx, cy = ax + bx_, ay + by_
        out.append(f'<path d="M{ax:.1f},{ay:.1f} L{cx:.1f},{cy:.1f} L{bx_:.1f},{by_:.1f}" fill="none" stroke="{NAVYC}" stroke-width="1.2"/>')
    for k, (a0, a1, lab, col) in enumerate(arcs):
        span = (a1 - a0) % 360
        r = 13 if span < 100 else 11
        if (lab or col != NAVYC) and not (span == 90 and any((d % 360) == (a0 % 360) for d in squares)):
            x0, y0 = P(a0, r); x1, y1 = P(a1, r)
            out.append(f'<path d="M{x0:.1f},{y0:.1f} A{r},{r} 0 {1 if span > 180 else 0} 0 {x1:.1f},{y1:.1f}" fill="none" stroke="{col}" stroke-width="1.5"/>')
        if not lab: continue
        b = a0 + span / 2; w = tw(lab, fs); h = fs * 0.95; best = None
        for R in [x * 2 for x in range(9, 70)]:
            px, py = P(b, R)
            for anc in ("middle", "start", "end"):
                x0 = px - w / 2 if anc == "middle" else px if anc == "start" else px - w
                bx = (x0 - 2.5, py - h / 2 - 2, x0 + w + 2.5, py + h / 2 + 2)
                if any(seg_hits_box(*sg, bx) for sg in segs): continue
                nx = min(max(0, bx[0]), bx[2]); ny = min(max(0, bx[1]), bx[3])   # keep clear of the arcs
                if math.hypot(nx, ny) < r + 3: continue
                if any(not (bx[2] < o[0] or bx[0] > o[2] or bx[3] < o[1] or bx[1] > o[3]) for o in boxes): continue
                # centre of the box must stay inside this angle's wedge
                cxb, cyb = (bx[0] + bx[2]) / 2, (bx[1] + bx[3]) / 2
                ang = math.degrees(math.atan2(-cyb, cxb)) % 360
                if (ang - a0) % 360 > span: continue
                if bx[0] < -L - 40 or bx[2] > L + 40: continue
                best = (bx, x0, py); break
            if best: break
        assert best, ("no room for label", lab)
        bx, x0, py = best; boxes.append(bx)
        out.append(f'<text x="{x0:.1f}" y="{py + fs * 0.35:.1f}" font-size="{fs}" font-weight="600" fill="{col}" font-family="Source Serif 4, Georgia, serif">{lab}</text>')
    out.append(f'<circle cx="0" cy="0" r="2.2" fill="{NAVYC}"/>')
    xs = [v for s in segs for v in (s[0], s[2])] + [b[0] for b in boxes] + [b[2] for b in boxes]
    ys = [v for s in segs for v in (s[1], s[3])] + [b[1] for b in boxes] + [b[3] for b in boxes] + [0]
    X0, X1, Y0, Y1 = min(xs) - pad, max(xs) + pad, min(ys) - pad, max(ys) + pad
    W, H = X1 - X0, Y1 - Y0
    return (f'<svg viewBox="{X0:.1f} {Y0:.1f} {W:.1f} {H:.1f}" width="{W:.0f}" height="{H:.0f}" xmlns="http://www.w3.org/2000/svg">'
            + "".join(out) + "</svg>")

# Figure shapes (all to scale)
def cross(a, right, top, left, bottom, L=None, cols=None):
    """Two lines cross; the acute/obtuse angle `a` opens to the right and left (symmetric X)."""
    c = cols or (NAVYC, NAVYC, NAVYC, NAVYC)
    h = a / 2
    return fig(lines=[h, -h], L=L, arcs=[(-h, h, right, c[0]), (h, 180 - h, top, c[1]),
                                          (180 - h, 180 + h, left, c[2]), (180 + h, 360 - h, bottom, c[3])])
def straight(t, right, left, L=None, cols=(NAVYC, NAVYC)):
    """A straight line with a ray at t degrees: angles t (right) and 180 − t (left)."""
    return fig(lines=[0], rays=[t], L=L, arcs=[(0, t, right, cols[0]), (t, 180, left, cols[1])])
def right_split(t, low, high, L=None, cols=(NAVYC, NAVYC)):
    """A right angle (square mark) split by a ray at t: angles t (low) and 90 − t (high)."""
    return fig(rays=[0, 90, t], squares=[0], L=L, arcs=[(0, t, low, cols[0]), (t, 90, high, cols[1])])

def two(a, b): return f'<div style="display:flex;gap:10px;align-items:center;justify-content:center">{a}{b}</div>'

# ───────────────────────── math (verified) ─────────────────────────
def solve(a, b, c, d):            # ax + b = cx + d  → whole-number x
    x = (d - b) / (a - c); assert x == int(x); return int(x)
D = "°"
# FRONT samples
S1 = ("vertical angles", "linear pair")
S2 = 90 - 34;                    assert S2 == 56
S3 = (180 - 47, 47, 180 - 47);   assert S3 == (133, 47, 133) and sum(S3) + 47 == 360
S4 = solve(3, 10, 0, 70);        assert S4 == 20 and 3 * S4 + 10 == 70
S5 = solve(3, 15, 0, 90);        assert S5 == 25 and (2 * S5, S5 + 15) == (50, 40) and 2 * S5 + S5 + 15 == 90
S6 = solve(6, 0, 0, 180);        assert S6 == 30 and (4 * S6 - 5, 2 * S6 + 5) == (115, 65) and 115 + 65 == 180
# BACK (10 problems: 1–3 Approaching, 4–7 Proficient, 8–10 Mastery)
B1 = 90 - 27;                    assert B1 == 63                                   # complementary
B2 = 180 - 139;                  assert B2 == 41                                   # linear pair
ang = {1: 55, 2: 125, 3: 55, 4: 125}                                               # #4: lines cross, ∠1 = 55
B4 = [ang[3] == 55, ang[2] == 125, ang[1] + ang[2] == 90, True, ang[1] + ang[4] == 90]
assert [i for i, ok in enumerate(B4) if ok] == [0, 1, 3] and ang[1] + ang[2] == 180
B5 = solve(5, -8, 3, 12);        assert B5 == 10 and 5 * B5 - 8 == 3 * B5 + 12 == 42
B6x = solve(4, 10, 0, 90);       assert B6x == 20 and (B6x + 10, 3 * B6x) == (30, 60); B6 = 60
B7 = solve(4, 40, 0, 180);       assert B7 == 35 and (3 * B7, B7 + 40) == (105, 75)
B8wrong = solve(3, 45, 0, 180);  assert B8wrong == 45                              # Ty's (wrong) answer
B8 = solve(2, 10, 1, 35);        assert B8 == 25 and 2 * B8 + 10 == B8 + 35 == 60
B9 = solve(2, 11, 0, 90 - 35);   assert B9 == 22 and 35 + (2 * B9 + 11) == 90 and 2 * B9 + 11 == 270 - 215
B10s = solve(3, 30, 0, 180);     B10 = (B10s, 2 * B10s + 30); assert B10 == (50, 130) and sum(B10) == 180
assert all(isinstance(v, int) for v in [S2, *S3, S4, S5, S6, B1, B2, B5, B6, B7, B8, B9, *B10])

# ───────────────────────── FRONT ─────────────────────────
def notes():
    G = GOLDC
    rel = [
        ("Vertical angles", cross(56, "", "", "", "", L=40, cols=(BLUE, NAVYC, BLUE, NAVYC)), "EQUAL",
         "Across from each other where two lines cross."),
        ("Linear pair", straight(60, "", "", L=40, cols=(BLUE, G)), "add to 180°",
         "Side by side. Together they make a <b>straight line</b>."),
        ("Supplementary", two(fig(rays=[0, 130], L=24, arcs=[(0, 130, "", BLUE)]), fig(rays=[0, 50], L=34, arcs=[(0, 50, "", G)])), "add to 180°",
         "Any two angles that add to 180°. They do not have to touch."),
        ("Complementary", right_split(35, "", "", L=40, cols=(BLUE, G)), "add to 90°",
         "Two angles that add to 90°. Together they make a <b>right angle</b> (□)."),
    ]
    cells = "".join(f'<div class="rel"><b class="n">{n}</b><div style="display:flex;justify-content:center;height:58px;align-items:center">{f}</div>'
                    f'<div class="r">{r}</div><div class="d">{d}</div></div>' for n, f, r, d in rel)
    return (f'<div class="box gold" style="padding:6px 8px 7px"><h3>Four angle relationships</h3>'
            f'<div class="grid2" style="grid-template-columns:repeat(4,1fr);gap:6px">{cells}</div>'
            f'<div style="font-size:8.8pt;margin-top:5px">A <b>linear pair</b> is always <b>supplementary</b>. '
            f'<b>Vertical angles</b> are always <b>equal</b>. To solve for x: name the pair → write the equation → solve → plug x back in.</div></div>')

def smp(n, title, prompt, figure, steps, key, h=78):
    body = f'<div class="st">{"<br>".join(steps)}</div>' if key else f'<div style="height:{h}px"></div>'
    return (f'<div class="smp"><div class="tt">{n} · {title}</div><div class="pp">{prompt}</div>'
            f'<div style="display:flex;gap:10px;align-items:flex-start"><div class="fig">{figure}</div><div style="flex:1">{body}</div></div></div>')

def front(key):
    h = front_head(f"{STD} · Notes", TOPIC, "Vertical angles · Linear pair · Supplementary · Complementary", key)
    s = [
        smp(1, "Name the pair", "Two lines cross. Name each pair.<br>a) ∠1 and ∠3 &nbsp;&nbsp; b) ∠1 and ∠2",
            cross(60, "1", "2", "3", "4"),
            ["a) across the X → <b>vertical angles</b>", "b) side by side on a line →<br><b>linear pair</b>"], key),
        smp(2, "Find the missing angle", "Find x.", right_split(34, "34°", "x°", cols=(NAVYC, GOLDC)),
            ["Right angle → <b>complementary</b>", "x + 34 = 90", "x = 90 − 34", "<b>x = 56</b>"], key),
        smp(3, "Find the missing angles", "Two lines cross. Find a, b and c.", cross(47, "47°", "a°", "b°", "c°", cols=(NAVYC, GOLDC, GOLDC, GOLDC)),
            ["b is vertical to 47° → <b>b = 47</b>", "a + 47 = 180 (linear pair)", "<b>a = 133</b>", "c is vertical to a → <b>c = 133</b>"], key),
        smp(4, "Vertical angles", "Find x.", cross(70, "(3x + 10)°", "", "70°", "", cols=(GOLDC, NAVYC, NAVYC, NAVYC)),
            ["Vertical angles are equal.", "3x + 10 = 70", "3x = 60", "<b>x = 20</b>", "Check: 3(20) + 10 = 70 ✓"], key),
        smp(5, "Complementary", "Find x. Then find each angle.", right_split(50, "(2x)°", "(x + 15)°", cols=(GOLDC, GOLDC)),
            ["2x + x + 15 = 90", "3x + 15 = 90", "3x = 75 → <b>x = 25</b>", "2(25) = <b>50°</b>, 25 + 15 = <b>40°</b>", "Check: 50 + 40 = 90 ✓"], key),
        smp(6, "Linear pair", "Find x. Then find each angle.", straight(65, "(2x + 5)°", "(4x − 5)°", cols=(GOLDC, GOLDC)),
            ["4x − 5 + 2x + 5 = 180", "6x = 180 → <b>x = 30</b>", "4(30) − 5 = <b>115°</b>", "2(30) + 5 = <b>65°</b>", "Check: 115 + 65 = 180 ✓"], key),
    ]
    return h + f'<div data-fit>{notes()}<div class="grid2">{"".join(s)}</div></div>'

# ───────────────────────── BACK ─────────────────────────
kit.CSS += """
.c{border:1px solid #E3E5EA;border-radius:8px;padding:5px 8px 6px;break-inside:avoid;display:flex;flex-direction:column}
.c.ca{border-left:4px solid #E0A800}.c.cp{border-left:4px solid #1D4ED8}.c.cm{border-left:4px solid #15803D}
.pill.m{color:#15803D;background:#E3F5E8}
.c .hd{display:flex;align-items:flex-start;gap:5px;font-size:9.8pt;line-height:1.3}
.c .hd .qn{flex:none;margin:0}
.c .tags{display:flex;gap:4px;align-items:center;flex-wrap:wrap}
.c .tags .lab{margin:0;font-size:6.6pt;padding:0 5px}.c .tags .pill{font-size:6.6pt;padding:0 6px}
.rw{display:flex;gap:9px;margin-top:4px;flex:1}
.lc{flex:none;display:flex;flex-direction:column;align-items:flex-start;gap:3px}
.rc{flex:1;min-width:0;display:flex;flex-direction:column}
.wa{flex:1;border:1.2px dashed #C9CED8;border-radius:6px;position:relative;padding:3px 6px}
.wa .wl{position:absolute;top:2px;left:6px;font:600 6.5pt Inter;color:#A7AEBB;letter-spacing:.1em;text-transform:uppercase}
.wa .st{color:#15803D;font:600 9.3pt/1.42 'Source Serif 4'}
.c .ops{grid-template-columns:1fr;gap:0}
.c .op{margin:1px 0}
"""
WORK = {"h": 146}                       # min blank work height, CSS px (render checks the printed size ≥ 1.3 in)
LV = {"a": "Approaching (3)", "p": "Proficient (4)", "m": "Mastery (5)"}

def wa(key, steps, h=None):
    inner = f'<div class="st">{"<br>".join(steps)}</div>' if key else '<span class="wl">Work</span>'
    return f'<div class="wa" data-min="{h or WORK["h"]}" style="min-height:{h or WORK["h"]}px">{inner}</div>'

def card(n, lv, typ, stem, left, right):
    tags = f'<div class="tags"><span class="lab">{typ}</span><span class="pill {lv}">{LV[lv]}</span></div>'
    return (f'<div class="c c{lv}"><div class="hd"><span class="qn">{n}</span><div>{stem}</div></div>'
            f'<div class="rw"><div class="lc">{tags}{left}</div><div class="rc">{right}</div></div></div>')

def ans(key, a, label="Answer:", w=64): return entry(key, a, label, w).replace('margin-top:6px', 'margin-top:1px')
def keynote(key, t): return f'<div class="ans" style="font-size:8.6pt;margin-top:3px">{t}</div>' if key else ""

def back(key, L=None):
    old = FIG["L"]; FIG["L"] = L or FIG["BACK"]
    try: return _back(key)
    finally: FIG["L"] = old
FIG["BACK"] = 78

def _back(key):
    h = back_head(f"{STD} · Practice", TOPIC, "Show your work in the box. Check every answer.", key)
    G = GOLDC
    C = [
        card(1, "a", "Numeric entry", "Find x.", right_split(27, "27°", "x°", cols=(NAVYC, G)) + ans(key, "x = 63"),
             wa(key, ["Right angle → complementary", "x + 27 = 90", "x = 90 − 27", "<b>x = 63</b>"])),
        card(2, "a", "Numeric entry", "Find x.", straight(41, "x°", "139°", cols=(G, NAVYC)) + ans(key, "x = 41"),
             wa(key, ["Straight line → linear pair", "x + 139 = 180", "x = 180 − 139", "<b>x = 41</b>"])),
        card(3, "a", "Multiple choice", "Two lines cross. What kind of pair are ∠2 and ∠4?", cross(50, "1", "2", "3", "4"),
             mc(["a linear pair", "vertical angles", "complementary angles", "right angles"], 1, key, 1)
             + keynote(key, "B. They are across the X from each other.")),
        card(4, "p", "Select all", "Two lines cross. ∠1 = 55°. Select <b>ALL</b> true statements.", cross(55, "1", "2", "3", "4"),
             sa(["∠3 = 55°", "∠2 = 125°", "∠1 and ∠2 are complementary", "∠2 and ∠4 are vertical angles", "∠1 + ∠4 = 90°"], [0, 1, 3], key)
             + keynote(key, "A, B, D. ∠1 + ∠2 = 180 (linear pair), not 90.")),
        card(5, "p", "Numeric entry", "Two lines cross. Find x.",
             cross(42, "(5x − 8)°", "", "(3x + 12)°", "", cols=(G, NAVYC, G, NAVYC)) + ans(key, "x = 10"),
             wa(key, ["Vertical angles are equal.", "5x − 8 = 3x + 12", "2x − 8 = 12 → 2x = 20", "<b>x = 10</b>", "Check: 42 = 42 ✓"])),
        card(6, "p", "Numeric entry", "Find the measure of the <b>larger</b> angle.",
             right_split(30, "(x + 10)°", "(3x)°", cols=(G, G)) + ans(key, "60°"),
             wa(key, ["x + 10 + 3x = 90", "4x + 10 = 90 → 4x = 80", "x = 20", "x + 10 = 30 and 3x = 60", "Larger: <b>60°</b>"])),
        card(7, "p", "Multiple choice", "What is the value of x?",
             straight(75, "(x + 40)°", "(3x)°", cols=(G, G)) + mc(["20", "35", "75", "105"], 1, key, 2),
             wa(key, ["Linear pair:", "3x + x + 40 = 180", "4x + 40 = 180", "4x = 140", "<b>x = 35</b> → B"])),
        card(8, "m", "Find the error", "Two lines cross. Ty made a mistake. Find it. Then find the correct x.",
             cross(60, "(2x + 10)°", "", "(x + 35)°", "", cols=(G, NAVYC, G, NAVYC))
             + "<div class='m' style='font-size:9.4pt;line-height:1.3'>Ty: 2x + 10 + x + 35 = 180<br>3x = 135, so x = 45</div>" + ans(key, "x = 25"),
             wa(key, ["These are <b>vertical angles</b>.", "They are EQUAL. They do not add to 180°.", "2x + 10 = x + 35", "<b>x = 25</b> (each angle is 60°)"])),
        card(9, "m", "Two-step", "The square shows a right angle. Find x.",
             fig(lines=[0, 35], rays=[270], squares=[180], arcs=[(0, 35, "35°", NAVYC), (215, 270, "(2x + 11)°", G)]) + ans(key, "x = 22"),
             wa(key, ["Vertical angles: the angle across from 35° is also 35°.", "Complementary: 35 + 2x + 11 = 90", "2x + 46 = 90 → 2x = 44", "<b>x = 22</b>"])),
        card(10, "m", "Word problem", "Two angles are <b>supplementary</b>. Find the size of each angle.",
             "<div style='font-size:9.6pt;width:150px;line-height:1.35'>The larger angle is 30° more than 2 times the smaller angle.</div>"
             + ans(key, "50°", "Smaller:", 56) + ans(key, "130°", "Larger:", 56),
             wa(key, ["smaller = x, larger = 2x + 30", "x + 2x + 30 = 180", "3x = 150 → <b>x = 50</b>", "2(50) + 30 = <b>130</b>"])),
    ]
    return h + f'<div data-fit><div class="grid2">{"".join(C)}</div></div>'

if __name__ == "__main__":
    _ns["CSS"] = kit.CSS          # pick up the styles added above
    name = "Angle_Relationships"
    for key in (False, True):
        render([front(key), back(key)], f"{OUT}/{name}{'_AnswerKey' if key else ''}.pdf",
               footer=TOPIC + (" — Answer Key" if key else ""), fit=True)
        zf, zb = render.zooms
        wk = render.work
        print(f"{'key' if key else 'student'}: front zoom {zf:.2f}, back zoom {zb:.2f}, back figure size vs front "
              f"{zb * FIG['BACK'] / (zf * 62):.2f}, work boxes (in) {[round(w, 2) for w in wk]}")
        assert len(wk) == 8 and min(wk) >= 1.3, "work space under 1.3 in"
    print("built in", OUT)
