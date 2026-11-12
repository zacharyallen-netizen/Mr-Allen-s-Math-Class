"""Redraw Unit 4 Practice figures TO SCALE (review fix, Nov 12, 2026): the vertical-angle X was one picture
reused for 110°, 75°, 58° … (an obtuse angle drawn acute), and the triangles were all the same shape
(a 90° or 100° angle drawn acute). Same file names and pixel sizes.
    python3 _build/u4_practice_figs_nov12.py"""
import math, os
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.patches import Arc

OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'grade8', 'practice', 'fig')
NAVY, BLUE, GOLD, GREEN, RED = '#1E2D4F', '#0055A5', '#B8860B', '#1E9E00', '#C62828'
X = {'Unit4_Practice1_B1.png': 110, 'Unit4_Practice1_B2.png': 75, 'Unit4_Practice1_E3.png': 58,
     'Unit4_Practice2_B1.png': 95, 'Unit4_Practice2_B2.png': 47, 'Unit4_Practice2_E3.png': 133}
TRI = {'Unit4_Practice1_D1.png': (64, 45), 'Unit4_Practice1_D2.png': (82, 60), 'Unit4_Practice1_D5.png': (47, 43),
       'Unit4_Practice2_D1.png': (75, 47), 'Unit4_Practice2_D2.png': (90, 65), 'Unit4_Practice2_D5.png': (38, 42)}


def new(w, h):
    fig, ax = plt.subplots(); fig.set_size_inches(w / 100, h / 100); fig.subplots_adjust(0, 0, 1, 1); ax.set_aspect('equal'); ax.axis('off'); return fig, ax


for name, g in X.items():
    fig, ax = new(334, 176); a1, a2 = math.radians(90 - g / 2), math.radians(90 + g / 2); L = 3
    for a, col in ((a1, BLUE), (a2, NAVY)):
        ax.plot([-L * math.cos(a), L * math.cos(a)], [-L * math.sin(a), L * math.sin(a)], color=col, lw=2.6)
    ax.plot([0], [0], 'o', color=NAVY, ms=4)
    r = 0.55
    ax.add_patch(Arc((0, 0), 2 * r, 2 * r, theta1=90 - g / 2, theta2=90 + g / 2, color=GOLD, lw=2))
    ax.add_patch(Arc((0, 0), 2 * r, 2 * r, theta1=270 - g / 2, theta2=270 + g / 2, color=RED, lw=2))
    ax.text(0, r + 0.35, '%d°' % g, ha='center', va='center', color=GOLD, fontsize=14, fontweight='bold')
    ax.text(0, -r - 0.35, 'x°', ha='center', va='center', color=RED, fontsize=14, fontweight='bold')
    ax.set_xlim(-2.9, 2.9); ax.set_ylim(-1.53, 1.53)
    fig.savefig(os.path.join(OUT, name), dpi=100); plt.close(fig)

for name, (A, B) in TRI.items():
    C = 180 - A - B; assert C > 0
    # the biggest angle goes on top so the triangle is wide, not tall; the other two sit on the base
    ang = sorted([(A, '%d°' % A, BLUE), (B, '%d°' % B, GREEN), (C, 'x°', GOLD)], key=lambda t: t[0])
    (a1, t1, c1), (a2, t2, c2), (a3, t3, c3) = ang[0], ang[1], ang[2]
    ta, tb = math.tan(math.radians(a1)), math.tan(math.radians(a2))
    px = tb / (ta + tb); py = ta * px
    P = {1: (0, 0), 2: (1, 0), 3: (px, py)}
    fig, ax = new(306, 230)
    ax.fill([0, 1, px], [0, 0, py], color='#E7ECF5'); ax.plot([0, 1, px, 0], [0, 0, py, 0], color=NAVY, lw=2.6)
    def lab(Pt, Q, R, t, col, dist):
        ux, uy = Q[0] - Pt[0], Q[1] - Pt[1]; d = math.hypot(ux, uy); ux, uy = ux / d, uy / d
        vx, vy = R[0] - Pt[0], R[1] - Pt[1]; d = math.hypot(vx, vy); vx, vy = vx / d, vy / d
        bx, by = ux + vx, uy + vy; d = math.hypot(bx, by); ax.text(Pt[0] + bx / d * dist, Pt[1] + by / d * dist, t, ha='center', va='center', color=col, fontsize=12, fontweight='bold')
    lab(P[1], P[2], P[3], t1, c1, 0.16 / math.sin(math.radians(a1 / 2)) * 0.45)
    lab(P[2], P[1], P[3], t2, c2, 0.16 / math.sin(math.radians(a2 / 2)) * 0.45)
    lab(P[3], P[1], P[2], t3, c3, 0.13 if a3 < 100 else 0.08)
    if a3 == 90 and t3 != 'x°':   # right-angle mark at the top corner (never on the unknown: that would give the answer)
        s1 = 0.05; u = ((0 - px), (0 - py)); v = ((1 - px), (0 - py)); nu = math.hypot(*u); nv = math.hypot(*v)
        u = (u[0] / nu * s1, u[1] / nu * s1); v = (v[0] / nv * s1, v[1] / nv * s1)
        ax.plot([px + u[0], px + u[0] + v[0], px + v[0]], [py + u[1], py + u[1] + v[1], py + v[1]], color=NAVY, lw=1.2)
    ax.set_xlim(-0.08, 1.08); ax.set_ylim(-0.08, py + 0.08); ax.set_aspect('equal', adjustable='datalim')
    fig.savefig(os.path.join(OUT, name), dpi=100); plt.close(fig)
print('ok')
