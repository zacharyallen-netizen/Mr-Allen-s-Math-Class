"""Shared helpers for the Units 3-4 printables (handout sets, quizzes, pre-test/test PDFs).
Each document is built twice from the same HTML: student copy and key (body.key shows the green answers).
    sh _build/materials/get_fonts.sh
    OUT_DIR=/path python3 _build/materials/u34_sets.py
"""
import os, re, subprocess
from fractions import Fraction as F

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.environ.get("OUT_DIR", "/home/claude/outputs/u34")
os.makedirs(OUT, exist_ok=True)
CSS = open(os.path.join(HERE, "u34.css")).read()
M = "−"
X = '<i>x</i>'

def mx(s):
    """Plain-text math → display: spaced + and −, true minus, italic x. A leading minus stays attached."""
    import re
    s = re.sub(r'(?<=[\w)])\s*([+-])\s*', r' \1 ', s)
    s = s.replace("-", M)
    out = []
    for i, ch in enumerate(s):
        prev = s[i-1] if i else ' '
        nxt = s[i+1] if i + 1 < len(s) else ' '
        if ch == 'x' and not prev.isalpha() and not nxt.isalpha():
            out.append(X)
        else:
            out.append(ch)
    return ''.join(out).replace('<=', '≤').replace('>=', '≥')

def head(kicker, title, sub, key=False):
    return (f'<div class="head"><div class="t"><div class="kk">{kicker}</div><h1>{title}</h1>'
            f'<div class="s">{sub}</div></div><div class="g"></div></div>')

NAME = '<div class="nm">Name <span></span> Date <span class="s"></span> Period <span class="s"></span></div>'

def footer(l, r=''): return f'<div class="footer"><span>{l}</span><span>{r}</span></div>'

def fill(ans='', cls=''):
    if not ans: return f'<span class="fill {cls}"></span>'
    plain = re.sub(r'<[^>]+>', '', ans)
    st = ' style="font-size:7.6pt"' if len(plain) > 20 else ''
    return f'<span class="fill {cls}"><span class="k"{st}>{ans}</span></span>'

def ln(label, ans='', cls=''):
    return f'<div class="ln"><span>{label}</span>{fill(ans, cls)}</div>'

def work(lines=()):
    body = '<br>'.join(lines)
    return f'<div class="workbox"><div class="kw">{body}</div></div>'

def cls_boxes(which, short=False):
    lab = ['One', 'None', 'Infinitely many'] if short else ['One solution', 'No solution', 'Infinitely many']
    keyn = {'one': 0, 'none': 1, 'inf': 2}[which]
    return '<div class="cls">' + ''.join(
        f'<span class="bx{" kon" if i == keyn else ""}"></span>{t}' for i, t in enumerate(lab)) + '</div>'

def doc(pages, title):
    return (f'<!doctype html><html><head><meta charset="utf-8"><title>{title}</title><style>{CSS}'
            '.bx.kon{} body.key .bx.kon{background:#15803D;border-color:#15803D}</style></head><body class="__B__">'
            + ''.join(f'<div class="page">{p}</div>' for p in pages) + '</body></html>')

def render(html, name, expect_pages=None):
    """Writes name.pdf (student) and name_AnswerKey.pdf (key). Returns the two paths."""
    outs = []
    for suffix, bcls in (('', ''), ('_AnswerKey', 'key')):
        h = html.replace('__B__', bcls)
        if bcls == 'key':
            h = h.replace('</h1>', '<span class="keytag">ANSWER KEY</span></h1>')
        hp = os.path.join(OUT, f'{name}{suffix}.html')
        pp = os.path.join(OUT, f'{name}{suffix}.pdf')
        open(hp, 'w').write(h)
        subprocess.run(['google-chrome', '--headless=new', '--no-sandbox', '--disable-gpu', '--no-pdf-header-footer',
                        f'--print-to-pdf={pp}', hp], stderr=subprocess.DEVNULL, stdout=subprocess.DEVNULL, check=True)
        n = int([l for l in subprocess.run(['pdfinfo', pp], capture_output=True, text=True).stdout.splitlines()
                 if l.startswith('Pages')][0].split()[-1])
        if expect_pages: assert n == expect_pages, f'{pp}: {n} pages, expected {expect_pages}'
        outs.append(pp)
    return outs

# ---------- checked solvers ----------
def lin(a, b):
    """a, b = (coef, const) for each side. Returns ('one', x) / ('none',) / ('inf',)."""
    (p, q), (r, s) = a, b
    if p == r: return ('inf',) if q == s else ('none',)
    return ('one', F(s - q, p - r))

def ineq_solve(a, b, op):
    """a op b with a=(coef,const), b=(coef,const). Returns (op', value) for x op' value, checked on test points."""
    (p, q), (r, s) = a, b
    c, d = p - r, s - q            # c x  op  d
    assert c != 0
    v = F(d, c)
    flip = {'<': '>', '>': '<', '<=': '>=', '>=': '<='}
    o = op if c > 0 else flip[op]
    ops = {'<': lambda u, w: u < w, '>': lambda u, w: u > w, '<=': lambda u, w: u <= w, '>=': lambda u, w: u >= w}
    for t in [v + F(k, 2) for k in range(-20, 21)]:
        assert ops[op](p * t + q, r * t + s) == ops[o](t, v), (a, b, op, t)
    return o, v

def fmt(v):
    v = F(v)
    return (M if v < 0 else '') + (str(abs(v.numerator)) if v.denominator == 1 else f'{abs(v.numerator)}/{v.denominator}')

SYM = {'<': '&lt;', '>': '&gt;', '<=': '≤', '>=': '≥'}
