"""Unit 5 Practice distance pictures on a real coordinate grid: the axes cross at (0, 0), every point sits on the
grid, and the run (blue) and rise (green) are drawn as the legs (review fix, Nov 12, 2026). Same names and sizes.
    python3 _build/u5_distance_figs_nov12.py"""
import os
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'grade8', 'practice', 'fig')
F = {'Unit5_Practice1_E1.png': ((0, 0), (4, 3), (418, 380)), 'Unit5_Practice1_E2.png': ((-2, -1), (4, 7), (418, 380)),
     'Unit5_Practice2_E1.png': ((-3, -2), (9, 3), (463, 409)), 'Unit5_Practice2_E2.png': ((1, 1), (4, 5), (418, 380))}
for name, (p, q, (w, h)) in F.items():
    x0, x1 = min(0, p[0], q[0]) - 1, max(0, p[0], q[0]) + 1; y0, y1 = min(0, p[1], q[1]) - 1, max(0, p[1], q[1]) + 1
    fig, ax = plt.subplots(); fig.set_size_inches(w / 100, h / 100); fig.subplots_adjust(0.03, 0.03, 0.97, 0.97)
    ax.set_xlim(x0 - 0.3, x1 + 0.3); ax.set_ylim(y0 - 0.3, y1 + 0.3); ax.set_aspect('equal', adjustable='box')
    ax.set_xticks(range(x0, x1 + 1)); ax.set_yticks(range(y0, y1 + 1)); ax.grid(True, color='#DDE2EA', lw=0.8)
    for s in ax.spines.values(): s.set_visible(False)
    ax.tick_params(length=0, labelsize=7, colors='#6B7280'); ax.set_xticklabels(['' for _ in range(x0, x1 + 1)]); ax.set_yticklabels(['' for _ in range(y0, y1 + 1)])
    ax.axhline(0, color='#333', lw=1.3); ax.axvline(0, color='#333', lw=1.3)
    for t in range(x0, x1 + 1):
        if t: ax.text(t, -0.35, str(t), ha='center', va='top', fontsize=7, color='#6B7280')
    for t in range(y0, y1 + 1):
        if t: ax.text(-0.2, t, str(t), ha='right', va='center', fontsize=7, color='#6B7280')
    c = (q[0], p[1])
    ax.plot([p[0], c[0]], [p[1], c[1]], '--', color='#0055A5', lw=1.6); ax.plot([c[0], q[0]], [c[1], q[1]], '--', color='#1A7F1A', lw=1.6)
    ax.plot([p[0], q[0]], [p[1], q[1]], color='#B8860B', lw=2.2)
    for pt in (p, q):
        ax.plot(*pt, 'o', color='#1E2D4F', ms=6, zorder=4)
        ax.annotate('(%d, %d)' % pt, pt, xytext=(6, 6 if pt == q else -12), textcoords='offset points', fontsize=9, color='#1E2D4F', bbox=dict(fc='white', ec='none', pad=0.5, alpha=0.9))
    fig.savefig(os.path.join(OUT, name), dpi=100); plt.close(fig)
print('ok')
