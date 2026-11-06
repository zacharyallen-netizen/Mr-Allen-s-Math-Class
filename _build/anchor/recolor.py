"""Recolor Zach's black-and-white anchor charts (LaTeX/TikZ PDFs) to the site palette.
black -> navy #1E2D4F, grays -> navy-tinted grays, white stays white, and a gold #FFC107 stripe
is added along the bottom edge of each page's title bar (found from a render of the page).
    python3 _build/anchor/recolor.py IN.pdf OUT.pdf
"""
import sys, subprocess, tempfile, os
import pikepdf
from PIL import Image

NAVY = (30 / 255, 45 / 255, 79 / 255)
GOLD = (1.0, 193 / 255, 7 / 255)

def tint(v):
    v = float(v)
    return tuple(round(n * (1 - v) + v, 4) for n in NAVY)   # 0 -> navy, 1 -> white

def title_bar(pdf_path, page_no, w_pt, h_pt):
    """bbox (x0, y0, x1, y1) in PDF points of the top dark bar, from a 72-dpi render."""
    with tempfile.TemporaryDirectory() as d:
        subprocess.run(['pdftoppm', '-r', '72', '-png', '-f', str(page_no), '-l', str(page_no), pdf_path, d + '/p'], check=True)
        im = Image.open([os.path.join(d, f) for f in os.listdir(d)][0]).convert('L')
    W, H = im.size
    px = im.load()
    # a column just inside the bar's left edge, before the title text starts
    probe = int(W * 0.055)
    rows = [y for y in range(min(H, 160)) if px[probe, y] < 60 and sum(1 for x in range(W) if px[x, y] < 60) > 0.3 * W]
    if not rows: return None
    y_top, y_bot = rows[0], rows[0]
    while y_bot + 1 in rows: y_bot += 1
    mid = y_top + 2
    cols = [x for x in range(W) if px[x, mid] < 60]
    sx, sy = w_pt / W, h_pt / H
    return (cols[0] * sx, h_pt - (y_bot + 1) * sy, (cols[-1] + 1) * sx, h_pt - y_top * sy)

def recolor(src, dst):
    pdf = pikepdf.open(src)
    for n, page in enumerate(pdf.pages, 1):
        out = []
        for operands, op in pikepdf.parse_content_stream(page):
            o = str(op)
            if o in ('g', 'G') and len(operands) == 1:
                c = tint(operands[0])
                out.append(([*c], pikepdf.Operator('rg' if o == 'g' else 'RG')))
            elif o in ('scn', 'SCN') and len(operands) == 3 and all(float(x) == 0 for x in operands):
                out.append(([*NAVY], op))
            elif o in ('rg', 'RG') and len(operands) == 3 and all(float(x) == 0 for x in operands):
                out.append(([*NAVY], op))
            else:
                out.append((operands, op))
        page.Contents = pdf.make_stream(b'q\n' + pikepdf.unparse_content_stream(out) + b'\nQ')   # isolate, so the stripe draws in page space
    tmp = dst + '.tmp.pdf'
    pdf.save(tmp)
    # gold stripe on each title bar
    pdf = pikepdf.open(tmp)
    for n, page in enumerate(pdf.pages, 1):
        mb = [float(v) for v in page.MediaBox]
        bb = title_bar(tmp, n, mb[2] - mb[0], mb[3] - mb[1])
        if not bb: continue
        x0, y0, x1, y1 = bb
        stripe = f'q {GOLD[0]:.4f} {GOLD[1]:.4f} {GOLD[2]:.4f} rg {x0:.2f} {y0:.2f} {x1 - x0:.2f} 3.2 re f Q'.encode()
        page.contents_add(pdf.make_stream(stripe), prepend=False)
    pdf.save(dst)
    os.remove(tmp)

if __name__ == '__main__':
    recolor(sys.argv[1], sys.argv[2])
