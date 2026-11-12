"""Redraw the Unit 5 "Is it a right triangle?" figures TO SCALE (review fix, Nov 12, 2026: the "No" triangles
were drawn as right triangles, which gives the answer away or misleads). Each triangle is built from its three
side lengths (law of cosines). No right-angle mark: students decide with a² + b² = c².
    python3 _build/u5_converse_figs_nov12.py"""
import math, os
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'grade8', 'practice', 'fig')
FIGS = {'Unit5_Practice1_C1.png': (9, 12, 15), 'Unit5_Practice1_C2.png': (5, 6, 8), 'Unit5_Practice1_C3.png': (8, 15, 17),
        'Unit5_Practice1_F2.png': (7, 24, 25), 'Unit5_Practice2_C1.png': (6, 8, 10), 'Unit5_Practice2_C2.png': (4, 5, 7),
        'Unit5_Practice2_C3.png': (9, 40, 41), 'Unit5_Practice2_F2.png': (8, 10, 13)}
for name, (a, b, c) in FIGS.items():
    # longest side c along the bottom; third vertex from the other two sides
    A, B = (0.0, 0.0), (float(c), 0.0)
    x = (b * b - a * a + c * c) / (2 * c); y = math.sqrt(max(b * b - x * x, 0))
    C = (x, y)
    fig, ax = plt.subplots(); fig.set_size_inches(2.6, 2.25); fig.subplots_adjust(0.02, 0.02, 0.98, 0.98)
    ax.fill([A[0], B[0], C[0]], [A[1], B[1], C[1]], color='#F3F3F3'); ax.plot([A[0], B[0], C[0], A[0]], [A[1], B[1], C[1], A[1]], color='#6B6B6B', lw=2.4)
    ax.set_aspect('equal'); ax.axis('off')
    pad = c * 0.16; ax.set_xlim(-pad, c + pad); ax.set_ylim(-pad, max(y, c * 0.25) + pad)
    cx, cy = (A[0] + B[0] + C[0]) / 3, (A[1] + B[1] + C[1]) / 3
    for (P, Q, R, L) in ((A, B, C, c), (A, C, B, b), (B, C, A, a)):
        mx, my = (P[0] + Q[0]) / 2, (P[1] + Q[1]) / 2; nx, ny = -(Q[1] - P[1]), Q[0] - P[0]; d = math.hypot(nx, ny)
        nx, ny = nx / d, ny / d
        if (R[0] - mx) * nx + (R[1] - my) * ny > 0: nx, ny = -nx, -ny   # point away from the opposite corner
        ax.text(mx + nx * c * 0.075, my + ny * c * 0.075, str(L), ha='center', va='center', fontsize=13, fontweight='bold', color='#1E2D4F')
    fig.savefig(os.path.join(OUT, name), dpi=100); plt.close(fig)
    print(name, a, b, c, 'right' if a * a + b * b == c * c else 'not right')
