"""Redraw three Unit 6 Practice figures to scale (review fix, Nov 12, 2026: points were off the grid,
(0, 0) was not at the origin, and the system graph had no grid and said "1x").
    python3 _build/u6_practice_figs_nov12.py
Writes grade8/practice/fig/Unit6_Practice_B1.png, _B2.png, _G1.png (same pixel sizes as before)."""
import os
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'grade8', 'practice', 'fig')
NAVY, GOLD, BLUE, RED = '#1E2D4F', '#B8860B', '#0055A5', '#C62828'


def grid(ax, lo, hi):
    ax.set_xlim(lo - 0.4, hi + 0.4); ax.set_ylim(lo - 0.4, hi + 0.4); ax.set_aspect('equal')
    ax.set_xticks(range(lo, hi + 1)); ax.set_yticks(range(lo, hi + 1))
    ax.grid(True, color='#D5DAE3', lw=0.8); ax.tick_params(labelsize=8, colors='#55607a', length=0)
    for s in ax.spines.values(): s.set_visible(False)
    ax.axhline(0, color='#333', lw=1.2); ax.axvline(0, color='#333', lw=1.2)
    ax.set_xticklabels([str(i) if i else '' for i in range(lo, hi + 1)]); ax.set_yticklabels([str(i) if i else '' for i in range(lo, hi + 1)])
    ax.text(hi + 0.35, 0.15, 'x', fontsize=10, style='italic', color='#333'); ax.text(0.15, hi + 0.2, 'y', fontsize=10, style='italic', color='#333')


def save(fig, name, size):
    fig.set_size_inches(size[0] / 100, size[1] / 100); fig.savefig(os.path.join(OUT, name), dpi=100); plt.close(fig)


def two_points(name, p, q, lo, hi):
    fig, ax = plt.subplots(); fig.subplots_adjust(0.06, 0.06, 0.97, 0.97); grid(ax, lo, hi)
    m = (q[1] - p[1]) / (q[0] - p[0]); xs = [lo - 1, hi + 1]
    ax.plot(xs, [p[1] + m * (x - p[0]) for x in xs], color='#9FB3CF', lw=1.5)
    for (x, y) in (p, q):
        ax.plot([x], [y], 'o', color=NAVY, ms=7, zorder=3)
        ax.annotate('(%d, %d)' % (x, y), (x, y), xytext=(7, -12 if (x, y) == p else 6), textcoords='offset points', fontsize=10, color=NAVY,
                    bbox=dict(boxstyle='round,pad=0.15', fc='white', ec='none', alpha=0.85))
    save(fig, name, (367, 350))


two_points('Unit6_Practice_B1.png', (0, 1), (2, 5), -1, 6)
two_points('Unit6_Practice_B2.png', (0, 0), (3, 1), -1, 5)

fig, ax = plt.subplots(); fig.subplots_adjust(0.06, 0.06, 0.97, 0.97); grid(ax, -1, 8)
xs = [-2, 10]
ax.plot(xs, [x + 2 for x in xs], color=BLUE, lw=2.2); ax.plot(xs, [-x + 6 for x in xs], color=RED, lw=2.2)
ax.text(4.6, 7.4, 'y = x + 2', color=BLUE, fontsize=10, fontweight='bold', bbox=dict(fc='white', ec='none', pad=1))
ax.text(5.2, 0.4, 'y = −x + 6', color=RED, fontsize=10, fontweight='bold', bbox=dict(fc='white', ec='none', pad=1))
save(fig, 'Unit6_Practice_G1.png', (401, 363))
print('wrote B1, B2, G1')
