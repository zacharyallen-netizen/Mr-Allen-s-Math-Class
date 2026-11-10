"""Finds every homework problem's card on the page images (grade8/homework/pages/HW_<id>-<p>.jpg) so the homework page
can show ONE problem at a time. Each problem card has a navy number badge; the card is the bordered box around it.
Writes grade8/homework/crops.js:  HW_CROPS["3.2"]["4"] = [page, x0, y0, x1, y1]  (fractions of the page image).
Run:  python3 _build/hw_crops.py   (prints any homework whose badge count does not match its problem list)."""
import os, re, json, sys
import numpy as np
from PIL import Image
from scipy import ndimage
G = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'grade8')

def badges(a):
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    m = (r < 80) & (g < 85) & (b < 120) & (b > r)                       # navy
    lab, n = ndimage.label(m)
    out = []
    for i, sl in enumerate(ndimage.find_objects(lab), 1):
        h, w = sl[0].stop - sl[0].start, sl[1].stop - sl[1].start
        if 19 <= h <= 30 and 19 <= w <= 30 and abs(h - w) <= 5:
            fill = (lab[sl] == i).mean()
            if fill > 0.55: out.append((sl[0].start, sl[1].start, sl[0].stop, sl[1].stop))
    return out

def card(a, y0, x0):
    """the card is the light-gray rounded box around the badge: find its 4 border lines"""
    H, W = a.shape[:2]
    mx, mn = a.max(axis=2), a.min(axis=2)
    g = (mx - mn < 14) & (mn >= 190) & (mx <= 240)                     # light neutral gray = border
    def vline(x, ya, yb): return g[ya:yb, max(0, x - 1):x + 2].any(axis=1).mean() > 0.85
    def hline(y, xa, xb): return g[max(0, y - 1):y + 2, xa:xb].any(axis=0).mean() > 0.85
    ya, yb = y0 + 5, y0 + 45
    left = x0
    while left > 2 and not vline(left, ya, yb): left -= 1
    right = x0 + 30
    while right < W - 2 and not vline(right, ya, yb): right += 1
    def on(y): return g[y, max(0, left - 1):left + 2].any() or g[y, right - 1:right + 2].any()
    def walk(y, d):                                                    # follow the side borders to the rounded corners
        gap = 0
        while 2 < y < H - 2 and gap < 4:
            gap = 0 if on(y) else gap + 1; y += d
        return y - d * 4 + d * 5                                       # + the corner radius
    top, bottom = max(0, walk(y0 + 20, -1)), min(H, walk(y0 + 20, 1))
    return left, top, right + 1, bottom + 1

def snug(a, l, t, r, b):
    """trim the empty writing space: drop the answer lines and blank space at the bottom of the card, and the blank
    right part of a wide card (so the words are bigger on a phone). Ignores the small target tag in the top-right corner."""
    W = a.shape[1]
    box = a[t + 4:b - 4, l + 5:r - 5]; dark = box.min(axis=2) < 170
    rule = dark.mean(axis=1) > 0.5                                       # writing lines
    dark[rule] = False
    rows = np.where(dark.any(axis=1))[0]
    if not len(rows): return l, t, r, b
    nb = t + 4 + rows[-1] + 16
    d2 = dark.copy(); d2[:34, -150:] = False                             # the tag corner
    cols = np.where(d2[:rows[-1] + 1].any(axis=0))[0]
    nr = l + 5 + cols[-1] + 22 if len(cols) else r
    if nr > r - 170: nr = r
    nr = max(nr, min(r, l + int(0.44 * W)))
    return l, t, nr, min(b, nb)

def main():
    s = open(os.path.join(G, 'homework_turn_in.html'), encoding='utf-8').read()
    HW = json.loads(re.search(r'var HW = (\[.*?\]);\n', s, re.S).group(1))
    crops, bad = {}, []
    for h in HW:
        crops[h['id']] = {}
        for pg in range(1, h['pages'] + 1):
            want = sorted(p[0] for p in h['p'] if p[1] == pg)
            if not want: continue
            f = os.path.join(G, 'homework', 'pages', 'HW_%s-%d.jpg' % (h['id'], pg))
            a = np.array(Image.open(f).convert('RGB')).astype(int); H, W = a.shape[:2]
            bs = badges(a)
            bs.sort(key=lambda b: (round(b[0] / 25), b[1]))                 # reading order: rows, then left to right
            if len(bs) != len(want): bad.append((h['id'], pg, len(bs), len(want))); continue
            for n, b in zip(want, bs):
                l, t, r, btm = snug(a, *card(a, b[0], b[1]))
                crops[h['id']][str(n)] = [pg, round(l / W, 4), round(t / H, 4), round(r / W, 4), round(btm / H, 4)]
    open(os.path.join(G, 'homework', 'crops.js'), 'w').write('window.HW_CROPS = ' + json.dumps(crops, separators=(',', ':')) + ';\n')
    print(len(HW), 'homeworks;', sum(len(v) for v in crops.values()), 'problems located;', 'mismatches:', bad or 'none')

if __name__ == '__main__': main()
