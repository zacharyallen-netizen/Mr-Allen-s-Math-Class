"""Parallel Lines & Transversals (NC.8.G.5, Set 2) — two-sided handout + separate answer key.
FRONT: notes column (labeled 1–8 diagram, pair table, words to know) + 6 blank sample boxes (worked in green on the key).
BACK: 10 leveled Check-In style items (Approaching (3) ×3 / Proficient (4) ×4 / Mastery (5) ×3).

    sh _build/materials/get_fonts.sh
    OUT_DIR=/path/to/out python3 _build/materials/transversals.py

Every figure is drawn from its own numbers: the transversal is tilted so the drawn angles ARE the answers.
Every pair name, every congruent/supplementary call and every answer is asserted before rendering.
Vocabulary follows grade8/angles_pythagorean_tutorial.html Part 2 ("same-side interior").
"""
import sys, os, math, tempfile
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from kit import *
import kit
from handouts import mc, sa, front_head, back_head

TOPIC, STD = "Parallel Lines &amp; Transversals", "NC.8.G.5"
NAVYC, GOLDC, BLUE, GREENC = "#1E2D4F", "#B07D00", "#1D4ED8", "#15803D"
D = "°"

# ───────────────────────── pair rules (checked) ─────────────────────────
# Numbering (same as the tutorial): at line m: 1 upper-left, 2 upper-right, 3 lower-left, 4 lower-right; 5–8 the same at line n.
# With the transversal at angle th (measured from the right along m): ∠2 = ∠3 = ∠6 = ∠7 = th; ∠1 = ∠4 = ∠5 = ∠8 = 180 − th.
PAIRS = {
    "corresponding": [(1, 5), (2, 6), (3, 7), (4, 8)],
    "alternate interior": [(3, 6), (4, 5)],
    "alternate exterior": [(1, 8), (2, 7)],
    "same-side interior": [(3, 5), (4, 6)],
    "vertical angles": [(1, 4), (2, 3), (5, 8), (6, 7)],
    "linear pair": [(1, 2), (1, 3), (2, 4), (3, 4), (5, 6), (5, 7), (6, 8), (7, 8)],
}
RULE = {"corresponding": "C", "alternate interior": "C", "alternate exterior": "C", "vertical angles": "C",
        "same-side interior": "S", "linear pair": "S"}
def meas(k, th): return th if k in (2, 3, 6, 7) else 180 - th
def pair(i, j):
    for name, ps in PAIRS.items():
        if (min(i, j), max(i, j)) in ps: return name
    return None
# the rule (congruent / supplementary) agrees with the actual measures for a generic tilt
for name, ps in PAIRS.items():
    for i, j in ps:
        for th in (37, 62, 118):
            if RULE[name] == "C": assert meas(i, th) == meas(j, th), (name, i, j)
            else: assert meas(i, th) + meas(j, th) == 180, (name, i, j)
# position check of the names: interior = 3,4,5,6; alternate = opposite sides of t (left = 1,3,5,7)
INT, LEFT = {3, 4, 5, 6}, {1, 3, 5, 7}
for i, j in PAIRS["alternate interior"]: assert i in INT and j in INT and ((i in LEFT) != (j in LEFT)) and (i <= 4) != (j <= 4)
for i, j in PAIRS["alternate exterior"]: assert i not in INT and j not in INT and ((i in LEFT) != (j in LEFT)) and (i <= 4) != (j <= 4)
for i, j in PAIRS["same-side interior"]: assert i in INT and j in INT and ((i in LEFT) == (j in LEFT)) and (i <= 4) != (j <= 4)
for i, j in PAIRS["corresponding"]: assert j == i + 4

def solve(a, b, c, d, rel):
    """rel C: ax + b = cx + d.  rel S: ax + b + cx + d = 180.  Whole-number x only."""
    x = (d - b) / (a - c) if rel == "C" else (180 - b - d) / (a + c)
    assert x == int(x), (a, b, c, d, rel, x); return int(x)

# ───────────────────────── figure engine ─────────────────────────
def tw(s, fs):   # rough text width in px (same idea as angle_pairs.py)
    w = 0
    for ch in s:
        w += 0.30 if ch in " ()" else 0.62 if ch in "−+" else 0.42 if ch == "°" else 0.56
    return w * fs * 1.12
def U(deg): a = math.radians(deg); return math.cos(a), -math.sin(a)          # math angle → svg unit vector
def seg_hits_box(s, bx):
    x1, y1, x2, y2 = s
    for i in range(61):
        t = i / 60; x = x1 + (x2 - x1) * t; y = y1 + (y2 - y1) * t
        if bx[0] <= x <= bx[2] and bx[1] <= y <= bx[3]: return True
    return False
def box_dist(px, py, bx):
    nx = min(max(px, bx[0]), bx[2]); ny = min(max(py, bx[1]), bx[3]); return math.hypot(nx - px, ny - py)
def overlap(a, b): return not (a[2] < b[0] or a[0] > b[2] or a[3] < b[1] or a[1] > b[3])
def side(px, py, X, phi):          # which side of the line through X with direction phi
    ux, uy = U(phi); return (px - X[0]) * uy - (py - X[1]) * ux

def pfig(th, labels=None, arcs=None, phi=0, gap=46, ext=34, text=30, fs=10.5, names=("m", "n", "t"),
         rays_only=False, numfs=10, extra_boxes=(), sc=1.0):
    """Two parallel lines (direction phi) cut by a transversal at direction phi + th.
    labels: {k: (text, color)} for angle numbers k = 1..8 at their regions (standard numbering).
    arcs:   {k: color} draws an angle arc for region k.
    rays_only: parallel lines start at the transversal and go 'up' (parking-lot picture)."""
    labels = labels or {}; arcs = arcs or {}
    tau = phi + th; assert 0 < th < 180
    s = gap / (2 * math.sin(math.radians(th)))
    ut, up = U(tau), U(phi)
    X1 = (ut[0] * s, ut[1] * s); X2 = (-ut[0] * s, -ut[1] * s)
    p1 = X1[0] * up[0] + X1[1] * up[1]; p2 = X2[0] * up[0] + X2[1] * up[1]
    lo, hi = min(p1, p2) - ext, max(p1, p2) + ext
    segs, out, boxes, blk = [], [], list(extra_boxes), []
    par = []
    for X, p in ((X1, p1), (X2, p2)):
        a = (lo - p) if not rays_only else 0
        b = (hi - p) if not rays_only else ext + 40
        A = (X[0] + up[0] * a, X[1] + up[1] * a); B = (X[0] + up[0] * b, X[1] + up[1] * b)
        segs.append((*A, *B)); par.append((A, B))
    TA = (X1[0] + ut[0] * text, X1[1] + ut[1] * text); TB = (X2[0] - ut[0] * text, X2[1] - ut[1] * text)
    segs.append((*TB, *TA))
    def arrowhead(P_, d):
        ux, uy = U(d); nx, ny = -uy, ux; L = 6; W = 3.2
        blk.append((P_[0] - 5, P_[1] - 5, P_[0] + 5, P_[1] + 5))
        return (f'<path d="M{P_[0]:.1f},{P_[1]:.1f} L{P_[0] - ux * L + nx * W:.1f},{P_[1] - uy * L + ny * W:.1f} '
                f'L{P_[0] - ux * L - nx * W:.1f},{P_[1] - uy * L - ny * W:.1f}z" fill="{NAVYC}"/>')
    for (x1, y1, x2, y2) in segs:
        out.append(f'<line x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}" stroke="{NAVYC}" stroke-width="1.6" stroke-linecap="round"/>')
    for A, B in par:
        out.append(arrowhead(B, phi))
        if not rays_only: out.append(arrowhead(A, phi + 180))
    out.append(arrowhead(TA, tau)); out.append(arrowhead(TB, tau + 180))
    # parallel marks (">" chevrons pointing along the lines) — same spot on each line
    for A, B in par:
        f = 0.22 if not rays_only else 0.62
        c = (A[0] + (B[0] - A[0]) * f, A[1] + (B[1] - A[1]) * f)
        nx, ny = -up[1], up[0]
        pts = [(c[0] - up[0] * 4 + nx * 4.5, c[1] - up[1] * 4 + ny * 4.5), (c[0] + up[0] * 3, c[1] + up[1] * 3),
               (c[0] - up[0] * 4 - nx * 4.5, c[1] - up[1] * 4 - ny * 4.5)]
        out.append(f'<path d="M{pts[0][0]:.1f},{pts[0][1]:.1f} L{pts[1][0]:.1f},{pts[1][1]:.1f} L{pts[2][0]:.1f},{pts[2][1]:.1f}" fill="none" stroke="{NAVYC}" stroke-width="2"/>')
        boxes.append((min(p[0] for p in pts) - 2, min(p[1] for p in pts) - 2, max(p[0] for p in pts) + 2, max(p[1] for p in pts) + 2))
    # line names
    texts = []
    away = -1 if (ut[0] * up[0] + ut[1] * up[1]) > 0 else 1        # +1 → the B end, −1 → the A end
    for (A, B), nm in zip(par, names[:2]):
        if not nm: continue
        nx, ny = U(phi + 90); E = B if away > 0 else A; sg = 1 if away > 0 else -1
        x, y = E[0] + sg * up[0] * 9, E[1] + sg * up[1] * 9 + 1
        w = tw(nm, 11); x0 = x if sg > 0 else x - w; texts.append((x0, y + 4, nm, 11, NAVYC, "italic"))
        boxes.append((x0 - 1, y - 6, x0 + w + 1, y + 6))
    if names[2]:
        nx, ny = U(tau - 90)
        x, y = TA[0] - ut[0] * 6 + nx * 10, TA[1] - ut[1] * 6 + ny * 10
        w = tw(names[2], 11); texts.append((x - w / 2, y + 4, names[2], 11, NAVYC, "italic"))
        boxes.append((x - w / 2 - 1, y - 6, x + w / 2 + 1, y + 6))
    reg = {2: (phi, tau), 1: (tau, phi + 180), 3: (phi + 180, tau + 180), 4: (tau + 180, phi + 360)}
    def vert(k): return X1 if k <= 4 else X2
    def other(k): return X2 if k <= 4 else X1
    R0 = 11
    for k, col in arcs.items():
        X = vert(k); a0, a1 = reg[k if k <= 4 else k - 4]; r = R0 + (2 if (a1 - a0) < 70 else 0)
        x0, y0 = X[0] + U(a0)[0] * r, X[1] + U(a0)[1] * r; x1, y1 = X[0] + U(a1)[0] * r, X[1] + U(a1)[1] * r
        out.append(f'<path d="M{x0:.1f},{y0:.1f} A{r},{r} 0 0 0 {x1:.1f},{y1:.1f}" fill="none" stroke="{col}" stroke-width="1.6"/>')
    for k, (lab, col) in labels.items():
        X = vert(k); O = other(k); a0, a1 = reg[k if k <= 4 else k - 4]; span = a1 - a0
        b = a0 + span / 2; f = numfs if lab.isdigit() else fs
        w = tw(lab, f); h = f * 0.95; best = None
        rr = R0 + 3 if k in arcs else 4
        for R in [x * 1.5 for x in range(4, 80)]:
            for dd in (0, -0.18, 0.18, -0.32, 0.32):
                bb = b + dd * span
                px, py = X[0] + U(bb)[0] * R, X[1] + U(bb)[1] * R
                for anc in ("middle", "start", "end"):
                    x0 = px - w / 2 if anc == "middle" else px if anc == "start" else px - w
                    bx = (x0 - 2, py - h / 2 - 1.5, x0 + w + 2, py + h / 2 + 1.5)
                    if any(seg_hits_box(sg, bx) for sg in segs): continue
                    if box_dist(X[0], X[1], bx) < rr or box_dist(O[0], O[1], bx) < 8: continue
                    if any(overlap(bx, o) for o in boxes + blk): continue
                    cx, cy = (bx[0] + bx[2]) / 2, (bx[1] + bx[3]) / 2
                    ang = math.degrees(math.atan2(-(cy - X[1]), cx - X[0]))
                    if (ang - a0) % 360 > span: continue
                    # stay on the vertex's side of the OTHER parallel line (interior labels stay between the lines)
                    if side(cx, cy, O, phi) * side(X[0], X[1], O, phi) <= 0: continue
                    best = (bx, x0, py); break
                if best: break
            if best: break
        assert best, ("no room for label", lab)
        bx, x0, py = best; boxes.append(bx)
        texts.append((x0, py + f * 0.35, lab, f, col, "normal"))
    for X in (X1, X2): out.append(f'<circle cx="{X[0]:.1f}" cy="{X[1]:.1f}" r="1.8" fill="{NAVYC}"/>')
    for x, y, t_, f, col, st in texts:
        out.append(f'<text x="{x:.1f}" y="{y:.1f}" font-size="{f}" font-weight="{600 if st == "normal" else 700}" font-style="{st}" fill="{col}" '
                   f'font-family="Source Serif 4, Georgia, serif">{t_}</text>')
    xs = [v for sg in segs for v in (sg[0], sg[2])] + [b_[0] for b_ in boxes] + [b_[2] for b_ in boxes]
    ys = [v for sg in segs for v in (sg[1], sg[3])] + [b_[1] for b_ in boxes] + [b_[3] for b_ in boxes]
    pad = 5; X0, X1_, Y0, Y1 = min(xs) - pad, max(xs) + pad, min(ys) - pad, max(ys) + pad
    W, H = X1_ - X0, Y1 - Y0
    return (f'<svg viewBox="{X0:.1f} {Y0:.1f} {W:.1f} {H:.1f}" width="{W * sc:.0f}" height="{H * sc:.0f}" xmlns="http://www.w3.org/2000/svg">'
            + "".join(out) + "</svg>")

import re as _re
def scale(h, k):   # enlarge every <svg> in h by k (viewBox unchanged, so labels scale with the lines)
    return _re.sub(r'<svg (viewBox="[^"]+") width="([\d.]+)" height="([\d.]+)"',
                   lambda m: f'<svg {m.group(1)} width="{float(m.group(2)) * k:.0f}" height="{float(m.group(3)) * k:.0f}"', h)
NUMS = {k: (str(k), NAVYC) for k in range(1, 9)}
def nums(th, **kw): return pfig(th, labels=NUMS, **kw)
FS, BS = 1.1, 1.0      # figure scale on the front samples / back items (back page prints smaller)

# ───────────────────────── math (verified) ─────────────────────────
def lin(a, b): return f"{a}x {'+' if b >= 0 else '−'} {abs(b)}" if a != 1 else f"x {'+' if b >= 0 else '−'} {abs(b)}"
def ex(a, b): return f"({lin(a, b)})°"

# FRONT samples
S1 = [(4, 5), (1, 5), (1, 8)]
assert [pair(*p) for p in S1] == ["alternate interior", "corresponding", "alternate exterior"]
S2 = [(4, 6), (2, 6), (5, 6)]
assert [pair(*p) for p in S2] == ["same-side interior", "corresponding", "linear pair"]
assert [RULE[pair(*p)] for p in S2] == ["S", "C", "S"]
S3_TH = 65                                                  # ∠1 = 115° given
assert meas(1, S3_TH) == 115 and [meas(k, S3_TH) for k in range(1, 9)] == [115, 65, 65, 115, 115, 65, 65, 115]
# 4 · corresponding: ∠2 = (3x + 14)°, ∠6 = 71°
assert pair(2, 6) == "corresponding"; S4 = solve(3, 14, 0, 71, "C"); S4_TH = 71
assert S4 == 19 and 3 * S4 + 14 == 71 == meas(2, S4_TH) == meas(6, S4_TH)
# 5 · same-side interior: ∠3 = (2x + 10)°, ∠5 = (3x − 5)°
assert pair(3, 5) == "same-side interior"; S5 = solve(2, 10, 3, -5, "S")
S5_TH = 2 * S5 + 10
assert S5 == 35 and (2 * S5 + 10, 3 * S5 - 5) == (80, 100) == (meas(3, S5_TH), meas(5, S5_TH))
# 6 · alternate interior, variables on both sides: ∠4 = (5x − 20)°, ∠5 = (3x + 40)°
assert pair(4, 5) == "alternate interior"; S6 = solve(5, -20, 3, 40, "C")
S6_TH = 180 - (5 * S6 - 20)
assert S6 == 30 and 5 * S6 - 20 == 3 * S6 + 40 == 130 == meas(4, S6_TH) == meas(5, S6_TH)

# BACK
B1 = (3, 5); assert pair(*B1) == "same-side interior"; B1_OPTS = ["corresponding", "alternate interior", "alternate exterior", "same-side interior"]
assert B1_OPTS.index(pair(*B1)) == 3
B1_TH = 58
B2_TH = 56; assert meas(4, B2_TH) == 124 and pair(4, 6) == "same-side interior"; B2 = 180 - 124
assert B2 == 56 == meas(6, B2_TH)
B3 = [(2, 6), (3, 5), (4, 5), (7, 8)]
B3_ANS = [RULE[pair(*p)] for p in B3]; assert B3_ANS == ["C", "S", "C", "S"]
assert [pair(*p) for p in B3] == ["corresponding", "same-side interior", "alternate interior", "linear pair"]
B4 = [(1, 5), (3, 6), (4, 6), (2, 7), (5, 6)]
B4_OK = [i for i, p in enumerate(B4) if RULE[pair(*p)] == "C"]; assert B4_OK == [0, 1, 3]
B4_TH = 60
# 5 · corresponding, obtuse tilt: ∠2 = (6x − 15)°, ∠6 = (4x + 25)°
assert pair(2, 6) == "corresponding"; B5 = solve(6, -15, 4, 25, "C"); B5_TH = 6 * B5 - 15
assert B5 == 20 and 6 * B5 - 15 == 4 * B5 + 25 == 105 == meas(2, B5_TH) == meas(6, B5_TH)
# 6 · same-side interior: ∠4 = (3x + 20)°, ∠6 = (2x + 10)°
assert pair(4, 6) == "same-side interior"; B6 = solve(3, 20, 2, 10, "S"); B6_TH = 2 * B6 + 10
assert B6 == 30 and (3 * B6 + 20, 2 * B6 + 10) == (110, 70) == (meas(4, B6_TH), meas(6, B6_TH))
# 7 · MC, alternate interior: ∠3 = (7x − 18)°, ∠6 = (4x + 24)°
assert pair(3, 6) == "alternate interior"; B7 = solve(7, -18, 4, 24, "C"); B7_TH = 7 * B7 - 18
assert B7 == 14 and 7 * B7 - 18 == 4 * B7 + 24 == 80 == meas(3, B7_TH) == meas(6, B7_TH)
B7_OPTS = [2, 14, 42, 80]                       # 2: 3x = 24 − 18 (sign slip); 42: forgot ÷3; 80: the angle, not x
assert (24 - 18) / 3 == 2 and 24 + 18 == 42 and B7_OPTS.index(B7) == 1
# 8 · find the error: alternate interior ∠3 = (3x + 10)°, ∠6 = (x + 50)°; Jordan added them to 180
assert pair(3, 6) == "alternate interior"; B8 = solve(3, 10, 1, 50, "C"); B8_TH = 3 * B8 + 10
B8_WRONG = solve(3, 10, 1, 50, "S")
assert B8 == 20 and B8_WRONG == 30 and 3 * B8 + 10 == B8 + 50 == 70 == meas(3, B8_TH) == meas(6, B8_TH)
assert 4 * 30 + 60 == 180 and 3 * 30 + 10 != 30 + 50          # Jordan's work is right arithmetic, wrong rule
# 9 · two relationships: ∠2 = (2x + 15)°, ∠5 = (5x + 25)°.  ∠2 = ∠6 (corresponding); ∠5 + ∠6 = 180 (linear pair)
assert pair(2, 5) is None and pair(2, 6) == "corresponding" and pair(5, 6) == "linear pair"
assert pair(2, 3) == "vertical angles" and pair(3, 5) == "same-side interior"      # the other route works too
B9 = solve(2, 15, 5, 25, "S"); B9_TH = 2 * B9 + 15
assert B9 == 20 and (2 * B9 + 15, 5 * B9 + 25) == (55, 125) == (meas(2, B9_TH), meas(5, B9_TH))
# 10 · parking lot: painted lines parallel, curb = transversal. Corresponding angles (5x − 15)° and (3x + 15)°.
B10 = solve(5, -15, 3, 15, "C"); assert B10 == 15 and 5 * B10 - 15 == 3 * B10 + 15 == 60
assert pair(4, 8) == "corresponding" and meas(4, 120) == meas(8, 120) == 60
B10_TH = 180 - 60            # drawn with the curb as the "parallel direction" engine: lines at 60° to the curb

ALL = [S4, S5, S6, B2, B5, B6, B7, B8, B9, B10, S5_TH, S6_TH]
assert all(isinstance(v, int) for v in ALL)

# ───────────────────────── styles ─────────────────────────
kit.CSS += """
.tb{width:100%;border-collapse:collapse;font-size:8.3pt;margin-top:3px}
.tb th{background:#1E2D4F;color:#fff;font:600 7.8pt Inter;text-align:left;padding:3px 5px}
.tb td{border-bottom:1px solid #E3E5EA;padding:2.5px 5px;vertical-align:top;line-height:1.25}
.tb td:first-child{font-weight:700;color:#1E2D4F}
.tb .ex{font:inherit;background:none;border:none;padding:0;color:#5B6475;font-size:7.6pt}
.tag{display:inline-block;border-radius:4px;padding:0 5px;font:700 7.6pt/1.5 Inter;white-space:nowrap}
.tag.c{color:#1D4ED8;background:#E6EEFF}.tag.s{color:#8A6100;background:#FFF4D1}
.voc{font-size:8.5pt;line-height:1.38}
.smp{border:1px solid #E3E5EA;border-radius:8px;padding:5px 8px;display:flex;flex-direction:column;overflow:hidden}
.smp .tt{font:600 9.4pt Inter;color:#1E2D4F}
.smp .pp{font-size:9.2pt;line-height:1.3;margin-top:1px}
.smp .fg{float:right;margin:3px 0 2px 6px}
.st{color:#15803D;font:600 9pt/1.38 'Source Serif 4',Georgia,serif}
.pq{border:1px solid #E3E5EA;border-radius:8px;padding:5px 9px 6px;position:relative;break-inside:avoid;display:flex;flex-direction:column}
.pq .hd{display:flex;align-items:center;gap:5px;font-size:9.6pt}
.pq .stem{font-size:9.4pt;line-height:1.32;margin-top:2px}
.stars{font:700 7.6pt Inter;border-radius:4px;padding:1px 5px;white-space:nowrap}
.pq .rw{display:flex;gap:8px;flex:1;margin-top:3px}
.pq .fgc{flex:none}
.ws{flex:1 0 auto;position:relative}
.corner{position:absolute;right:8px;bottom:6px;font-size:9.5pt}
.cs{display:grid;grid-template-columns:auto auto auto;gap:3px 8px;align-items:center;font-size:9.3pt;margin-top:2px}
.cs .o{border:1.3px solid #1E2D4F;border-radius:999px;padding:0 7px;font:700 7.8pt/16px Inter;color:#1E2D4F;text-align:center}
.cs .o.on{background:#15803D;border-color:#15803D;color:#fff}
.pq .op{font-size:9.3pt;margin:1px 0}
"""
LV = {1: ("Approaching (3)", "#8A6100", "#FFF4D1"), 2: ("Proficient (4)", "#1D4ED8", "#E6EEFF"), 3: ("Mastery (5)", "#15803D", "#E3F5E8")}
CC, SS = '<span class="tag c">Congruent</span>', '<span class="tag s">Supplementary</span>'

def steps(lines, check=None):
    out = "<br>".join(lines)
    if check: out += f"<br>Check: {check} ✓"
    return f'<div class="st">{out}</div>'

# ───────────────────────── FRONT ─────────────────────────
def notes():
    cols = {k: (BLUE if k in (1, 4, 5, 8) else GOLDC) for k in range(1, 9)}
    figure = pfig(62, labels={k: (str(k), cols[k]) for k in range(1, 9)}, arcs=cols, gap=62, ext=58, text=40, numfs=11)
    rows = [("Corresponding", "Same corner at each crossing", "∠1 &amp; ∠5, ∠2 &amp; ∠6, ∠3 &amp; ∠7, ∠4 &amp; ∠8", CC),
            ("Alternate interior", "Between the lines, opposite sides of <i>t</i>", "∠3 &amp; ∠6, ∠4 &amp; ∠5", CC),
            ("Alternate exterior", "Outside the lines, opposite sides of <i>t</i>", "∠1 &amp; ∠8, ∠2 &amp; ∠7", CC),
            ("Same-side interior", "Between the lines, same side of <i>t</i>", "∠3 &amp; ∠5, ∠4 &amp; ∠6", SS),
            ("Vertical angles", "Across the X at one crossing", "∠1 &amp; ∠4, ∠2 &amp; ∠3", CC),
            ("Linear pair", "Side by side on a line", "∠1 &amp; ∠2, ∠5 &amp; ∠7", SS)]
    for nm, *_ in rows[:4]: assert nm.lower() in PAIRS
    tb = "".join(f'<tr><td>{a}</td><td>{b}<div class="ex">{c}</div></td><td>{d}</td></tr>' for a, b, c, d in rows)
    return f'''<div class="box gold" style="padding:6px 8px"><h3>Parallel lines cut by a transversal</h3>
<div style="display:flex;justify-content:center;margin:1px 0 2px">{figure}</div>
<div style="font-size:8.4pt;line-height:1.3">Lines <i>m</i> ∥ <i>n</i>. The 8 angles come in only <b>two sizes</b>:
<b style="color:#1D4ED8">∠1, ∠4, ∠5, ∠8</b> are one size. <b style="color:#8A6100">∠2, ∠3, ∠6, ∠7</b> are the other. One big + one small = 180°.</div></div>
<div class="box" style="padding:5px 7px"><b style="font:600 10.5pt 'Source Serif 4';color:#1E2D4F">Name the pair → use the rule</b>
<table class="tb"><tr><th>Pair</th><th>Where they sit</th><th>Rule</th></tr>{tb}</table></div>
<div class="box voc"><b>Parallel lines</b>: lines that never meet. The arrows (&gt;) show they are parallel.<br>
<b>Transversal</b>: a line that crosses two or more lines. We call it <i>t</i>.<br>
<b>Interior</b> = between the lines. <b>Exterior</b> = outside the lines.<br>
<b>Alternate</b> = on opposite sides of <i>t</i>.<br>
<b>Congruent</b> = the same size (equal). <b>Supplementary</b> = add to 180°.</div>'''

def parts(qs, ans, key):
    return "".join(f'<br>{"abc"[i]}) {q}' + (f' <span class="st">→ {a}</span>' if key else "") for i, (q, a) in enumerate(zip(qs, ans)))
def smp(n, title, prompt, figure, key, st):
    figure = scale(figure, FS)
    body = ('<div style="clear:both;padding-top:2px">' + st + '</div>') if key and st else ""
    return (f'<div class="smp"><div class="tt">{n} · {title}</div><div class="pp">{prompt}</div><div><div class="fg">{figure}</div>'
            f'{body}</div><div class="ws" style="flex:1"></div></div>')

def front(key):
    h = front_head(f"{STD} · Notes", TOPIC, "Corresponding · Alternate interior · Alternate exterior · Same-side interior", key)
    G = GOLDC
    s = [
        smp(1, "Name the pair", "<i>m</i> ∥ <i>n</i>. Name each pair." + parts(["∠4 and ∠5", "∠1 and ∠5", "∠1 and ∠8"],
            ["alternate interior", "corresponding", "alternate exterior"], key), nums(64), key, ""),
        smp(2, "Congruent or supplementary?", "<i>m</i> ∥ <i>n</i>. Name each pair. Write <b>C</b> (congruent) or <b>S</b> (supplementary)."
            + parts(["∠4 and ∠6", "∠2 and ∠6", "∠5 and ∠6"], ["same-side interior → S", "corresponding → C", "linear pair → S"], key), nums(116), key, ""),
        smp(3, "Find all 8 angles", "<i>m</i> ∥ <i>n</i>. ∠1 = 115°. Find the other seven angles.",
            pfig(S3_TH, labels={**NUMS, 1: ("115°", G)}, arcs={1: G}), key,
            steps(["Vertical: <b>∠4 = 115°</b>", "Linear pair: ∠2 = 180 − 115 = <b>65°</b>; <b>∠3 = 65°</b>",
                   "Corresponding: <b>∠5 = ∠8 = 115°</b>, <b>∠6 = ∠7 = 65°</b>"], "115 + 65 = 180")),
        smp(4, "Write and solve", "<i>m</i> ∥ <i>n</i>. Find x.",
            pfig(S4_TH, labels={2: (ex(3, 14), G), 6: ("71°", NAVYC)}, arcs={2: G, 6: NAVYC}), key,
            steps(["Same corner → <b>corresponding</b> → congruent.", "3x + 14 = 71 → 3x = 57 → <b>x = 19</b>"], "3(19) + 14 = 71")),
        smp(5, "Write and solve", "<i>m</i> ∥ <i>n</i>. Find x. Then find each angle.",
            pfig(S5_TH, labels={3: (ex(2, 10), G), 5: (ex(3, -5), G)}, arcs={3: G, 5: G}), key,
            steps(["<b>Same-side interior</b> → add to 180.", "2x + 10 + 3x − 5 = 180", "5x + 5 = 180 → 5x = 175 → <b>x = 35</b>",
                   "Angles: <b>80°</b> and <b>100°</b>"], "80 + 100 = 180")),
        smp(6, "Variables on both sides", "<i>m</i> ∥ <i>n</i>. Find x. Then find the angle.",
            pfig(S6_TH, labels={4: (ex(5, -20), G), 5: (ex(3, 40), G)}, arcs={4: G, 5: G}), key,
            steps(["<b>Alternate interior</b> → congruent.", "5x − 20 = 3x + 40 → 2x − 20 = 40",
                   "2x = 60 → <b>x = 30</b>; angle = <b>130°</b>"], "3(30) + 40 = 130")),
    ]
    return h + f'''<div data-fit><div class="cols" style="gap:9px;align-items:stretch" data-stretch>
<div style="flex:0 0 300px">{notes()}</div>
<div style="display:flex;flex-direction:column"><div class="grid2" style="gap:6px;flex:1;grid-template-rows:repeat(3,1fr);margin-bottom:7px">{"".join(s)}</div></div></div></div>'''

# ───────────────────────── BACK ─────────────────────────
def pq(n, lv, typ, stem, fig_, right, key, ws=0, ans=None, ans_label="<i>x</i> =", corner_extra=""):
    fig_ = scale(fig_, BS)
    blank = f'<div class="ws" data-ws style="min-height:{ws}px">{right if key else ""}</div>' if ws else f'<div style="flex:1">{right}</div>'
    corner = (f'<div class="corner">{ans_label} <span class="ent" style="min-width:58px">{ans if key else ""}</span>{corner_extra}</div>'
              if ans is not None else "")
    return (f'<div class="pq"><div class="hd"><span class="qn">{n}</span><span class="stars" style="color:{LV[lv][1]};background:{LV[lv][2]}">{LV[lv][0]}</span>'
            f'<span class="lab">{typ}</span></div><div class="stem">{stem}</div>'
            f'<div class="rw"><div class="fgc">{fig_}</div>{blank if ws else f"<div style=flex:1>{right}</div>"}</div>{corner}</div>')

def cs_rows(pairs, ans, key):
    out = ""
    for (i, j), a in zip(pairs, ans):
        out += (f'<span>∠{i} and ∠{j}</span><span class="o{" on" if key and a == "C" else ""}">Congruent</span>'
                f'<span class="o{" on" if key and a == "S" else ""}">Supplementary</span>')
    return f'<div class="cs">{out}</div>'

WS = 160     # px of blank work space at zoom 1 (render reports the printed size)

def back(key):
    h = back_head(f"{STD} · Practice", TOPIC, "<i>m</i> ∥ <i>n</i> in every picture. Name the pair. Write the equation. Show your work.", key)
    G = GOLDC
    items = [
        pq(1, 1, "Multiple choice", "What kind of pair are ∠3 and ∠5?", nums(B1_TH),
           mc(B1_OPTS, 3, key, 1) + ('<div class="ans" style="font-size:8.4pt;margin-top:2px">D. Between the lines, same side of <i>t</i>.</div>' if key else ""), key),
        pq(2, 1, "Numeric entry", "Find x.", pfig(B2_TH, labels={4: ("124°", NAVYC), 6: ("x°", G)}, arcs={4: NAVYC, 6: G}),
           steps(["Same-side interior → add to 180.", "x + 124 = 180", "<b>x = 56</b>"]) if key else "", key, ans="56" if key else "", ans_label="<i>x</i> ="),
        pq(3, 1, "Congruent or supplementary?", "Circle one for each pair.", nums(B4_TH + 4), cs_rows(B3, B3_ANS, key)
           + ('<div class="ans" style="font-size:8.2pt;margin-top:3px">corresponding · same-side interior · alternate interior · linear pair</div>' if key else ""), key),
        pq(4, 2, "Select all", "Select <b>ALL</b> pairs that are <b>congruent</b>.", nums(B4_TH),
           sa([f"∠{i} and ∠{j}" for i, j in B4], B4_OK, key, 1)
           + ('<div class="ans" style="font-size:8.2pt;margin-top:2px">A, B, D. ∠4 &amp; ∠6 and ∠5 &amp; ∠6 add to 180°.</div>' if key else ""), key),
        pq(5, 2, "Solve for x", "Find x. Then find the angle.", pfig(B5_TH, labels={2: (ex(6, -15), G), 6: (ex(4, 25), G)}, arcs={2: G, 6: G}),
           steps(["Corresponding → congruent.", "6x − 15 = 4x + 25", "2x − 15 = 25 → 2x = 40", "<b>x = 20</b>; angle = <b>105°</b>"]), key, WS, "20"),
        pq(6, 2, "Solve for x", "Find x. Then find both angles.", pfig(B6_TH, labels={4: (ex(3, 20), G), 6: (ex(2, 10), G)}, arcs={4: G, 6: G}),
           steps(["Same-side interior → add to 180.", "3x + 20 + 2x + 10 = 180", "5x + 30 = 180 → 5x = 150",
                  "<b>x = 30</b>; <b>110°</b> and <b>70°</b>"]), key, WS, "30"),
        pq(7, 2, "Multiple choice", "What is the value of x?", pfig(B7_TH, labels={3: (ex(7, -18), G), 6: (ex(4, 24), G)}, arcs={3: G, 6: G}),
           (steps(["Alternate interior → congruent.", "7x − 18 = 4x + 24", "3x = 42 → <b>x = 14</b> (B)"]) if key else "")
           + f'<div style="flex:1;min-height:{WS - 38}px"></div>' * (not key) + mc([str(o) for o in B7_OPTS], 1, key, 4), key),
        pq(8, 3, "Find the error", "Jordan made a mistake. Find it. Then find the correct x."
           '<div class="m" style="font-size:9pt;margin-top:1px">Jordan: 3x + 10 + x + 50 = 180 → 4x = 120 → x = 30</div>',
           pfig(B8_TH, labels={3: (ex(3, 10), G), 6: (ex(1, 50), G)}, arcs={3: G, 6: G}),
           steps(["These are <b>alternate interior</b> angles.", "They are <b>congruent</b>. They do not add to 180°.",
                  "3x + 10 = x + 50 → 2x = 40", "<b>x = 20</b> (each angle is 70°)"]), key, WS, "20"),
        pq(9, 3, "Two steps", "∠2 and ∠5 are not a pair from the table. Use two rules. Find x and ∠5.",
           pfig(B9_TH, labels={2: (ex(2, 15), G), 5: (ex(5, 25), G), 6: ("6", NAVYC)}, arcs={2: G, 5: G}),
           steps(["∠6 = ∠2 (corresponding)", "∠5 + ∠6 = 180 (linear pair)", "5x + 25 + 2x + 15 = 180",
                  "7x + 40 = 180 → 7x = 140", "<b>x = 20</b>; ∠5 = <b>125°</b>"]), key, WS, "20"),
        pq(10, 3, "Word problem", "Parking-lot lines are parallel. The curb is a transversal. "
           "The marked angles are corresponding. Find x and the angle.",
           pfig(B10_TH, phi=60, labels={4: (ex(5, -15), G), 8: (ex(3, 15), G)}, arcs={4: G, 8: G}, rays_only=True,
                names=("", "", "curb"), gap=78, ext=30, text=26),
           steps(["Corresponding → congruent.", "5x − 15 = 3x + 15", "2x = 30 → <b>x = 15</b>", "5(15) − 15 = <b>60°</b>"],
                 "3(15) + 15 = 60"), key, WS, "15"),
    ]
    return h + f'<div data-fit><div class="grid2" data-stretch style="gap:6px;grid-template-rows:auto auto 1fr 1fr 1fr">{"".join(items)}</div></div>'

# ── render with a private temp file; never zoom above 100%; stretch the front rows to the bottom margin
def render_tv(pages, path, footer):
    from playwright.sync_api import sync_playwright
    body = "".join(f'<section style="break-after:page">{p}</section>' for p in pages[:-1]) + f"<section>{pages[-1]}</section>"
    html_ = f"<!doctype html><html><head><meta charset='utf-8'><style>@page{{size:letter;margin:0.4in 0.45in 0.45in}}{kit.CSS}</style></head><body>{body}</body></html>"
    d = tempfile.mkdtemp(prefix="transversals_"); tmp = os.path.join(d, "mat.html"); open(tmp, "w").write(html_)
    with sync_playwright() as p:
        b = p.chromium.launch(); pg = b.new_page(viewport={"width": 730, "height": 900}); pg.goto("file://" + tmp); pg.wait_for_timeout(400)
        pg.emulate_media(media="print")
        avail = 11 * 96 - 0.85 * 96 - 18
        zooms = pg.evaluate("""(avail) => { const zs = []; for (const sec of document.querySelectorAll('section')) {
            const f = sec.querySelector('[data-fit]'); let z = 1.0; f.style.zoom = z;
            while (z > 0.8 && sec.getBoundingClientRect().height > avail) { z -= 0.01; f.style.zoom = z; }
            const s = f.querySelector('[data-stretch]'); const extra = avail - sec.getBoundingClientRect().height;
            if (s && extra > 0) s.style.minHeight = (s.getBoundingClientRect().height / z + extra / z - 1) + 'px';
            zs.push(z); } return zs; }""", avail)
        info = pg.evaluate("""() => { const secs = [...document.querySelectorAll('section')];
            const zf = s => parseFloat(s.querySelector('[data-fit]').style.zoom);
            return { heights: secs.map(s => s.getBoundingClientRect().height),
              front: [...secs[0].querySelectorAll('.smp')].map(q => { const z = zf(secs[0]);
                  const r = q.getBoundingClientRect(), w = q.querySelector('.ws').getBoundingClientRect(), fg = q.querySelector('.fg').getBoundingClientRect();
                  const pp = q.querySelector('.pp').getBoundingClientRect(); return [r.height, w.height, r.bottom - Math.max(fg.bottom, pp.bottom), r.height - (pp.top - r.top)]; }),
              back: [...secs[1].querySelectorAll('.pq')].map(q => { const w = q.querySelector('[data-ws]'); const z = zf(secs[1]);
                  return w ? [w.getBoundingClientRect().height, w.getBoundingClientRect().width] : null; }) }; }""")
        # getBoundingClientRect already reports zoomed (printed) px in this Chromium.
        pg.pdf(path=path, print_background=True, format="Letter", prefer_css_page_size=True, display_header_footer=True, header_template="<div></div>",
               footer_template=f'<div style="width:100%;font-family:Inter;font-size:7px;color:#8a93a8;padding:0 0.45in;display:flex;justify-content:space-between"><span>Mr. Allen&#39;s 8th Grade Math • {footer}</span><span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span></div>')
        b.close()
    os.unlink(tmp); os.rmdir(d)
    return zooms, info

if __name__ == "__main__":
    name = "Parallel_Lines_Transversals"
    for key in (False, True):
        z, info = render_tv([front(key), back(key)], f"{OUT}/{name}{'_AnswerKey' if key else ''}.pdf",
                            "Parallel Lines & Transversals" + (" — Answer Key" if key else ""))
        print("KEY" if key else "STUDENT", "zooms", [round(v, 2) for v in z], "page heights", [round(h) for h in info["heights"]])
        if not key:
            print("  front boxes (in): height / blank below text / below figure:",
                  [tuple(round(v / 96, 2) for v in f) for f in info["front"]])
            ws = [round(w[0] / 96, 2) if w else None for w in info["back"]]
            print("  back blank work (in):", ws)
            assert all(v >= 1.3 for v in ws if v is not None), ws
    print("built in", OUT)
