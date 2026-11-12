"""Unit 5 Practice 1–2: redraw the "find the hypotenuse / missing leg" right triangles TO SCALE, with the labels
outside the sides (review fix, Nov 12, 2026: every triangle was the same shape and "b = 8" sat on the line).
Same file names and pixel sizes.   python3 _build/u5_right_figs_nov12.py"""
import math, os
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'grade8', 'practice', 'fig')
NAVY, BLUE, GREEN, GOLD = '#1E2D4F', '#0055A5', '#1A7F1A', '#B8860B'
F = {}   # name: (a, b, c, unknown)
for pg, rows in (('1', {'A1': (6, 8, 'c'), 'A2': (5, 12, 'c'), 'A3': (8, 15, 'c'), 'A4': (7, 24, 'c'), 'B1': (6, 8, 'a'), 'B2': (9, 12, 'a'), 'B3': (16, 12, 'a'), 'F1': (9, 12, 'c'), 'F3': (12, 5, 'a')}),
                 ('2', {'A1': (5, 12, 'c'), 'A2': (9, 12, 'c'), 'A3': (12, 16, 'c'), 'A4': (10, 24, 'c'), 'B1': (8, 15, 'a'), 'B2': (7, 24, 'a'), 'B3': (15, 8, 'a'), 'F1': (9, 40, 'c'), 'F3': (20, 15, 'a')})):
    for k, (a, b, u) in rows.items():
        F['Unit5_Practice%s_%s.png' % (pg, k)] = (a, b, u)
for name, (a, b, u) in F.items():
    c = math.hypot(a, b); assert abs(c - round(c)) < 1e-9
    fig, ax = plt.subplots(); fig.set_size_inches(2.83, 2.43); fig.subplots_adjust(0, 0, 1, 1); ax.set_aspect('equal'); ax.axis('off')
    s = 1.0 / max(a, b)   # longest leg = 1 unit
    A, B = a * s, b * s
    ax.fill([0, A, 0], [0, 0, B], color='#E7ECF5'); ax.plot([0, A, 0, 0], [0, 0, B, 0], color=NAVY, lw=2.6)
    q = 0.07; ax.plot([q, q, 0], [0, q, q], color=NAVY, lw=1.2)
    lab = lambda v, t: (('%s = ?' % t) if u == t else ('%s = %d' % (t, v)))
    ax.text(A / 2, -0.08, lab(a, 'a'), ha='center', va='top', color=GREEN, fontsize=13, fontweight='bold')
    ax.text(-0.05, B / 2, lab(b, 'b'), ha='right', va='center', color=BLUE, fontsize=13, fontweight='bold')
    nx, ny = B, A; d = math.hypot(nx, ny)
    ax.text(A / 2 + nx / d * 0.1, B / 2 + ny / d * 0.1, lab(round(c), 'c'), ha='left', va='bottom', color=GOLD, fontsize=13, fontweight='bold')
    ax.set_xlim(-0.55, 1.45); ax.set_ylim(-0.3, max(B, 0.55) + 0.25)
    fig.savefig(os.path.join(OUT, name), dpi=100); plt.close(fig)
print(len(F), 'drawn')
