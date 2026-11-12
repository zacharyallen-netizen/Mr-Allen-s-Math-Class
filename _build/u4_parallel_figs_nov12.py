"""Redraw the Unit 4 Practice parallel-lines figures TO SCALE (review fix, Nov 12, 2026: the transversal was always
drawn at 60°/120°, so a 115° label sat in a 60° angle). The transversal's slant is set from the given angle, and the
given angle and x sit in the right positions for each pair. Same file names and sizes.
    python3 _build/u4_parallel_figs_nov12.py"""
import math, os
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.patches import Arc

OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'grade8', 'practice', 'fig')
NAVY, BLUE, RED, GRAY = '#1E2D4F', '#0055A5', '#C62828', '#8A8F99'
# name: (pair, given angle). Positions: m angle, n angle (ur, ul, ll, lr), and phi = the angle ur.
FIGS = {'Unit4_Practice1_C1.png': ('corr', 72), 'Unit4_Practice1_C2.png': ('alt-int', 115), 'Unit4_Practice1_C3.png': ('same-side', 132),
        'Unit4_Practice1_C4.png': ('alt-ext', 96), 'Unit4_Practice1_E2.png': ('corr', 105),
        'Unit4_Practice2_C1.png': ('corr', 85), 'Unit4_Practice2_C2.png': ('alt-int', 98), 'Unit4_Practice2_C3.png': ('same-side', 115),
        'Unit4_Practice2_C4.png': ('alt-ext', 124), 'Unit4_Practice2_E2.png': ('corr', 63)}
POS = {'corr': ('ur', 'ur'), 'alt-int': ('lr', 'ul'), 'same-side': ('lr', 'ur'), 'alt-ext': ('ul', 'lr')}


def size(pos, phi):
    return phi if pos in ('ur', 'll') else 180 - phi


def span(pos, phi):   # start/end directions of the angle (degrees)
    return {'ur': (0, phi), 'ul': (phi, 180), 'll': (180, 180 + phi), 'lr': (180 + phi, 360)}[pos]


for name, (pair, g) in FIGS.items():
    pm, pn = POS[pair]
    phi = g if pm in ('ur', 'll') else 180 - g
    x = size(pn, phi)
    assert (x == g) if pair != 'same-side' else (x + g == 180)
    fig, ax = plt.subplots(); fig.set_size_inches(4.6, 3.47); fig.subplots_adjust(0, 0, 1, 1); ax.set_aspect('equal'); ax.axis('off')
    ym, yn, L = 1.4, -1.4, 4.2
    for y, lab in ((ym, 'm'), (yn, 'n')):
        ax.plot([-L, L], [y, y], color=NAVY, lw=2.2); ax.text(L + 0.15, y, lab, va='center', fontsize=12, style='italic', color=NAVY)
    t = math.radians(phi); dx, dy = math.cos(t), math.sin(t)
    k = 4.3 / dy; ax.plot([-dx * k, dx * k], [-dy * k, dy * k], color=GRAY, lw=2)
    for (y, pos, txt, col) in ((ym, pm, '%d°' % g, BLUE), (yn, pn, 'x°', RED)):
        cx = y * dx / dy; a0, a1 = span(pos, phi); r = 0.55
        ax.add_patch(Arc((cx, y), 2 * r, 2 * r, theta1=a0, theta2=a1, color=col, lw=2))
        mid = math.radians((a0 + a1) / 2); rr = 0.95 if (a1 - a0) > 70 else 1.25
        ax.text(cx + rr * math.cos(mid), y + rr * math.sin(mid), txt, ha='center', va='center', color=col, fontsize=13, fontweight='bold')
    ax.set_xlim(-4.7, 4.9); ax.set_ylim(-3.6, 3.6)
    fig.savefig(os.path.join(OUT, name), dpi=100); plt.close(fig)
print('ok')
