"""Unit 4 Practice: redraw the exterior-angle triangles (D3, D4) and the complementary / supplementary pairs (A1, A4, E1)
TO SCALE with labels that don't sit on the lines (review fix, Nov 12, 2026). Same file names and pixel sizes.
    python3 _build/u4_more_figs_nov12.py"""
import math, os
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.patches import Arc

OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'grade8', 'practice', 'fig')
NAVY, BLUE, GOLD, RED, GREEN = '#1E2D4F', '#0055A5', '#B8860B', '#C62828', '#1E9E00'
# exterior: (left base angle label, top angle label, exterior label); numbers are the true angles
EXT = {'Unit4_Practice1_D3.png': (65, 52, None), 'Unit4_Practice1_D4.png': (None, 55, 130),
       'Unit4_Practice2_D3.png': (60, 48, None), 'Unit4_Practice2_D4.png': (None, 70, 125)}
TRUE = {'Unit4_Practice1_D3.png': (65, 52), 'Unit4_Practice1_D4.png': (75, 55), 'Unit4_Practice2_D3.png': (60, 48), 'Unit4_Practice2_D4.png': (55, 70)}
# pairs: (kind, given angle, size)
PAIR = {'Unit4_Practice1_A1.png': ('comp', 48), 'Unit4_Practice1_A4.png': ('comp', 63), 'Unit4_Practice1_E1.png': ('comp', 72),
        'Unit4_Practice2_A1.png': ('comp', 57), 'Unit4_Practice2_A4.png': ('comp', 36), 'Unit4_Practice2_E1.png': ('supp', 152),
        'Unit4_Practice1_A2.png': ('supp', 105, (348, 181)), 'Unit4_Practice1_A3.png': ('supp', 119, (348, 165)), 'Unit4_Practice2_A2.png': ('supp', 142, (348, 124)), 'Unit4_Practice2_A3.png': ('supp', 83, (348, 184))}


def new(w, h):
    fig, ax = plt.subplots(); fig.set_size_inches(w / 100, h / 100); fig.subplots_adjust(0, 0, 1, 1); ax.set_aspect('equal'); ax.axis('off'); return fig, ax


def lab(ax, c, a0, a1, r, t, col):
    m = math.radians((a0 + a1) / 2); ax.text(c[0] + r * math.cos(m), c[1] + r * math.sin(m), t, ha='center', va='center', color=col, fontsize=12, fontweight='bold')


for name, (Ll, Tl, El) in EXT.items():
    L, T = TRUE[name]; R = 180 - L - T; ext = 180 - R
    tl, tr = math.tan(math.radians(L)), math.tan(math.radians(R)); px = tr / (tl + tr); py = tl * px
    fig, ax = new(352, 231)
    ax.fill([0, 1, px], [0, 0, py], color='#E7ECF5'); ax.plot([0, 1, px, 0], [0, 0, py, 0], color=NAVY, lw=2.4); ax.plot([1, 1.55], [0, 0], color=NAVY, lw=2.4)
    ax.add_patch(Arc((0, 0), 0.26, 0.26, theta1=0, theta2=L, color=BLUE, lw=1.6)); lab(ax, (0, 0), 0, L, 0.24, '%d°' % L if Ll else 'x°', BLUE)
    a_top0 = math.degrees(math.atan2(-py, -px)); a_top1 = math.degrees(math.atan2(-py, 1 - px))
    ax.add_patch(Arc((px, py), 0.22, 0.22, theta1=a_top0 % 360, theta2=a_top1 % 360, color=GOLD, lw=1.6)); lab(ax, (px, py), a_top0 % 360, a_top1 % 360, 0.2, '%d°' % T, GOLD)
    ax.add_patch(Arc((1, 0), 0.3, 0.3, theta1=0, theta2=ext, color=RED, lw=1.8)); lab(ax, (1, 0), 0, ext, 0.3, '%d°' % ext if El else 'x°', RED)
    ax.set_xlim(-0.08, 1.6); ax.set_ylim(-0.08, max(py, 0.5) + 0.08); ax.set_aspect('equal', adjustable='datalim')
    fig.savefig(os.path.join(OUT, name), dpi=100); plt.close(fig)

for name, spec in PAIR.items():
    kind, g = spec[0], spec[1]; W, Hh = spec[2] if len(spec) > 2 else (348, 100)
    if kind == 'comp':
        fig, ax = new(189, 185); O = (0, 0)
        ax.plot([0, 2.2], [0, 0], color=NAVY, lw=2.4); ax.plot([0, 0], [0, 2.2], color=NAVY, lw=2.4); ax.plot([0.16, 0.16, 0], [0, 0.16, 0.16], color=NAVY, lw=1)
        t = math.radians(g); ax.plot([0, 2.1 * math.cos(t)], [0, 2.1 * math.sin(t)], color=NAVY, lw=2.4)
        ax.add_patch(Arc(O, 1.3, 1.3, theta1=0, theta2=g, color=BLUE, lw=1.8)); lab(ax, O, 0, g, 0.95 if g > 25 else 1.15, '%d°' % g, BLUE)
        ax.add_patch(Arc(O, 1.0, 1.0, theta1=g, theta2=90, color=GREEN, lw=1.8)); lab(ax, O, g, 90, 0.8 if 90 - g > 25 else 1.05, 'x°', GREEN)
        ax.set_xlim(-0.15, 2.3); ax.set_ylim(-0.15, 2.25)
    else:
        fig, ax = new(W, Hh); O = (0, 0); top = 5.4 * Hh / W - 0.15   # same scale across: x from -2.7 to 2.7
        ax.plot([-2.6, 2.6], [0, 0], color=NAVY, lw=2.4); t = math.radians(g); Lr = min(2.2, (top - 0.05) / max(math.sin(t), 0.2)); ax.plot([0, Lr * math.cos(t)], [0, Lr * math.sin(t)], color=NAVY, lw=2.4)
        r1, r2 = 0.6, 0.85
        ax.add_patch(Arc(O, 2 * r1, 2 * r1, theta1=0, theta2=g, color=BLUE, lw=1.8)); lab(ax, O, 0, g, r1 + 0.32 if g > 40 else r1 + 0.55, '%d°' % g, BLUE)
        ax.add_patch(Arc(O, 2 * r2, 2 * r2, theta1=g, theta2=180, color=GREEN, lw=1.8)); lab(ax, O, g, 180, r2 + 0.3 if 180 - g > 40 else r2 + 0.5, 'x°', GREEN)
        ax.set_xlim(-2.7, 2.7); ax.set_ylim(-0.15, top)
    fig.savefig(os.path.join(OUT, name), dpi=100); plt.close(fig)
print('ok')
