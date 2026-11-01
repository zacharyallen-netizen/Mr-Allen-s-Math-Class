"""Shared look for Mr. Allen's printable materials (site style: Source Serif 4 / Inter / JetBrains Mono, navy + gold)."""
import os
from playwright.sync_api import sync_playwright

FONTS = os.environ.get("FONT_DIR", "/tmp/fonts/gf/ofl")
OUT = os.environ.get("OUT_DIR", "/home/claude/outputs")
os.makedirs(OUT, exist_ok=True)
NAVY, GOLD, GREEN, RED = "#1E2D4F", "#FFC107", "#15803D", "#B42318"
M = "−"

CSS = f"""
@font-face {{ font-family:'Source Serif 4'; src:url('file://{FONTS}/sourceserif4/SourceSerif4[opsz,wght].ttf'); font-weight:200 900; }}
@font-face {{ font-family:'JetBrains Mono'; src:url('file://{FONTS}/jetbrainsmono/JetBrainsMono[wght].ttf'); font-weight:100 800; }}
:root{{--navy:#1E2D4F;--ink:#1B2333;--muted:#5B6475;--gold:#FFC107;--gold-line:#E0A800;--gold-text:#8A6100;--gold-soft:#FFF6D6;
--line:#E3E5EA;--line-2:#D5D9E0;--ok:#15803D;--no:#B42318;--serif:"Source Serif 4",Georgia,serif;--sans:"Inter",system-ui,sans-serif;--mono:"JetBrains Mono",monospace}}
*{{box-sizing:border-box}}
body{{margin:0;font:10.5pt/1.4 var(--sans);color:var(--ink)}}
h1,h2,h3{{font-family:var(--serif);color:var(--navy);margin:0;font-weight:600}}
sup{{font-size:.68em;line-height:0;position:relative;vertical-align:baseline;top:-.55em}}
.bar{{display:inline-block;line-height:1.05;border-top:1.6px solid currentColor;padding-top:1px}}
.rad{{border-top:1.6px solid currentColor;padding:1px 2px 0;margin-left:1px}}
.fr{{display:inline-flex;flex-direction:column;align-items:center;vertical-align:middle;margin:0 2px;line-height:1.15;font-size:.95em}}
.fr>span:first-child{{border-bottom:1.5px solid currentColor;padding:0 3px}}
.fr>span:last-child{{padding:0 3px}}
.m{{font-family:var(--serif);font-weight:600;color:var(--navy)}}
.head{{display:flex;align-items:stretch;border-radius:10px;overflow:hidden;margin:0 0 8px}}
.head .t{{flex:1;background:var(--navy);color:#fff;padding:9px 14px 8px}}
.head .t .k{{font:700 7.5pt var(--sans);letter-spacing:.13em;text-transform:uppercase;color:var(--gold)}}
.head .t h1{{color:#fff;font-size:17pt;line-height:1.15;margin-top:2px}}
.head .t .s{{font-size:8.5pt;color:#C9D1E3;margin-top:2px}}
.head .g{{width:12px;background:var(--gold)}}
.keytag{{display:inline-block;background:var(--ok);color:#fff;font:800 8pt var(--sans);letter-spacing:.08em;border-radius:4px;padding:2px 7px;margin-left:8px;vertical-align:middle}}
.nm{{display:flex;gap:14px;margin:0 0 8px;font:600 8.5pt var(--sans);color:var(--muted)}}
.nm span{{flex:1;border-bottom:1.3px solid var(--navy)}} .nm span.s{{flex:.35}}
.box{{border:1px solid var(--line);border-radius:8px;padding:7px 10px;margin:0 0 7px;break-inside:avoid}}
.box h3{{font-size:11pt;margin:0 0 3px}}
.gold{{background:var(--gold-soft);border-color:#F1D98A}}
.navyb{{background:var(--navy);color:#fff;border-color:var(--navy)}} .navyb h3{{color:var(--gold)}}
.tip{{background:var(--gold-soft);border-left:4px solid var(--gold);border-radius:6px;padding:5px 9px;margin:0 0 7px;font-size:9.5pt}}
.cols{{display:flex;gap:8px}} .cols>*{{flex:1;min-width:0}}
.small{{font-size:8.5pt;color:var(--muted)}}
table.t{{border-collapse:collapse;width:100%;font-size:9pt}}
table.t th{{background:var(--navy);color:#fff;font:600 8.5pt var(--sans);text-align:left;padding:4px 6px}}
table.t td{{border-bottom:1px solid var(--line);padding:4px 6px;vertical-align:middle}}
table.vt{{border-collapse:collapse;font:600 10pt var(--serif);margin:3px auto}}
table.vt th,table.vt td{{border:1.4px solid var(--navy);padding:2px 9px;text-align:center}}
table.vt th{{background:var(--navy);color:#fff;font-style:italic}}
.ex{{font:500 10pt/1.55 var(--serif);color:var(--navy);background:#FAFAF8;border:1px dashed var(--line-2);border-radius:6px;padding:4px 8px}}
.q{{border:1px solid var(--line);border-radius:8px;padding:6px 9px;break-inside:avoid;position:relative}}
.qn{{display:inline-block;width:19px;height:19px;border-radius:5px;background:var(--navy);color:var(--gold);font:700 9.5pt/19px var(--serif);text-align:center;margin-right:5px}}
.grid2{{display:grid;grid-template-columns:1fr 1fr;gap:6px}}
.grid3{{display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px}}
.ans{{color:var(--ok);font:700 9.5pt var(--sans)}}
.ansm{{color:var(--ok);font:700 10.5pt var(--serif)}}
.work{{color:var(--ok);font-size:8.5pt;margin-top:2px}}
.line{{display:inline-block;border-bottom:1.2px solid var(--navy);min-width:90px;height:15px;vertical-align:bottom}}
.yn{{display:inline-flex;gap:6px;margin-left:4px}}
.yn span{{border:1.3px solid var(--navy);border-radius:999px;padding:0 8px;font:700 8.5pt/16px var(--sans);color:var(--navy)}}
.yn span.on{{background:var(--ok);border-color:var(--ok);color:#fff}}
.stem{{font-size:9.8pt}}
.center{{text-align:center}}
svg{{display:block}}
.foot{{position:fixed;bottom:0;left:0;right:0;font-size:7pt;color:#8a93a8;display:flex;justify-content:space-between}}
"""

def page_head(kicker, title, sub, key=False, name=True):
    h = f'<div class="head"><div class="t"><div class="k">{kicker}</div><h1>{title}{"<span class=keytag>ANSWER KEY</span>" if key else ""}</h1><div class="s">{sub}</div></div><div class="g"></div></div>'
    if name and not key:
        h += '<div class="nm">Name <span></span> Date <span class="s"></span> Block <span class="s"></span></div>'
    return h

def fr(a, b): return f'<span class="fr"><span>{a}</span><span>{b}</span></span>'
def sup(e): return f"<sup>{str(e).replace('-', M)}</sup>"
def neg(n): return str(n).replace('-', M)
def pt(x, y): return f"({neg(x)}, {neg(y)})"

def render(pages, path, landscape=False, footer="", fit=False):
    """pages: list of HTML strings, one per printed page."""
    size = "letter landscape" if landscape else "letter"
    body = "".join(f'<section style="break-after:page">{p}</section>' for p in pages[:-1]) + f"<section>{pages[-1]}</section>"
    html = f"<!doctype html><html><head><meta charset='utf-8'><style>@page{{size:{size};margin:0.4in 0.45in 0.45in}}{CSS}</style></head><body>{body}</body></html>"
    tmp = "/tmp/_mat.html"; open(tmp, "w").write(html)
    with sync_playwright() as p:
        b = p.chromium.launch(); pg = b.new_page(viewport={"width": 970 if landscape else 730, "height": 900}); pg.goto("file://" + tmp); pg.wait_for_timeout(300)
        if fit:   # scale each page's [data-fit] block so the page is as full as possible without spilling
            avail = (8.5 if landscape else 11) * 96 - 0.85 * 96 - 14
            pg.emulate_media(media="print")
            pg.evaluate("""(avail) => { for (const sec of document.querySelectorAll('section')) {
                const f = sec.querySelector('[data-fit]'); if (!f) continue;
                let z = 2.0; f.style.zoom = z;
                while (z > 0.8 && sec.getBoundingClientRect().height > avail) { z -= 0.02; f.style.zoom = z; } } }""", avail)
        pg.pdf(path=path, print_background=True, landscape=landscape, format="Letter", prefer_css_page_size=True,
               display_header_footer=bool(footer), header_template="<div></div>",
               footer_template=f'<div style="width:100%;font-family:Inter;font-size:7px;color:#8a93a8;padding:0 0.45in;display:flex;justify-content:space-between"><span>Mr. Allen\'s 8th Grade Math • {footer}</span><span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span></div>')
        n = pg.evaluate("document.querySelectorAll('section').length")
        b.close()
    return path

# ── coordinate grid SVG (explicit lines, drawn from each problem's own numbers)
def grid(xmin, xmax, ymin, ymax, u=14, body=None, labels=True, every=1, font=7.5):
    W = (xmax - xmin) * u; H = (ymax - ymin) * u; pad = 12
    X = lambda x: pad + (x - xmin) * u
    Y = lambda y: pad + (ymax - y) * u
    s = [f'<svg viewBox="0 0 {W + 2*pad} {H + 2*pad}" width="{W + 2*pad}" height="{H + 2*pad}" xmlns="http://www.w3.org/2000/svg" font-family="Inter, sans-serif">']
    for x in range(xmin, xmax + 1):
        s.append(f'<line x1="{X(x)}" y1="{Y(ymin)}" x2="{X(x)}" y2="{Y(ymax)}" stroke="#D9DEE7" stroke-width="0.8"/>')
    for y in range(ymin, ymax + 1):
        s.append(f'<line x1="{X(xmin)}" y1="{Y(y)}" x2="{X(xmax)}" y2="{Y(y)}" stroke="#D9DEE7" stroke-width="0.8"/>')
    if ymin <= 0 <= ymax: s.append(f'<line x1="{X(xmin)}" y1="{Y(0)}" x2="{X(xmax)}" y2="{Y(0)}" stroke="#1E2D4F" stroke-width="1.4"/>')
    if xmin <= 0 <= xmax: s.append(f'<line x1="{X(0)}" y1="{Y(ymin)}" x2="{X(0)}" y2="{Y(ymax)}" stroke="#1E2D4F" stroke-width="1.4"/>')
    if labels:
        for x in range(xmin, xmax + 1):
            if x and x % every == 0 and ymin <= 0 <= ymax:
                s.append(f'<text x="{X(x)}" y="{Y(0) + 9}" font-size="{font}" text-anchor="middle" fill="#5B6475">{neg(x)}</text>')
        for y in range(ymin, ymax + 1):
            if y and y % every == 0 and xmin <= 0 <= xmax:
                s.append(f'<text x="{X(0) - 3}" y="{Y(y) + 2.6}" font-size="{font}" text-anchor="end" fill="#5B6475">{neg(y)}</text>')
    if xmin <= 0 <= xmax and ymin <= 0 <= ymax:
        s.append(f'<text x="{X(xmax) - 2}" y="{Y(0) - 3}" font-size="9" font-style="italic" text-anchor="end" fill="#1E2D4F">x</text>')
        s.append(f'<text x="{X(0) + 4}" y="{Y(ymax) + 8}" font-size="9" font-style="italic" fill="#1E2D4F">y</text>')
    if body: s.append(body(X, Y, u))
    s.append("</svg>")
    return "".join(s)

def shape(pts, col="#1E2D4F", fill_op=0.25, labels=None, dash=False, offs=None, dots=True, closed=True):
    def f(X, Y, u):
        p = " ".join(f"{X(a)},{Y(b)}" for a, b in pts)
        d = ' stroke-dasharray="4 3"' if dash else ''
        tag = "polygon" if closed else "polyline"
        o = [f'<{tag} points="{p}" fill="{col if closed else "none"}" fill-opacity="{fill_op}" stroke="{col}" stroke-width="1.8"{d}/>']
        for i, (a, b) in enumerate(pts):
            if dots: o.append(f'<circle cx="{X(a)}" cy="{Y(b)}" r="2.4" fill="{col}"/>')
            if labels:
                dx, dy = offs[i] if offs else (4, -4)
                o.append(f'<text x="{X(a) + dx}" y="{Y(b) + dy}" font-size="9" font-weight="700" fill="{col}">{labels[i]}</text>')
        return "".join(o)
    return f

def combine(*fs): return lambda X, Y, u: "".join(f(X, Y, u) for f in fs)

def mapping(inputs, outputs, arrows, w=150):
    n = max(len(inputs), len(outputs)); h = 26 + 22 * n
    cx1, cx2 = 34, w - 34
    s = [f'<svg viewBox="0 0 {w} {h}" width="{w}" height="{h}" xmlns="http://www.w3.org/2000/svg" font-family="Source Serif 4, Georgia, serif">']
    s.append(f'<ellipse cx="{cx1}" cy="{h/2 - 4}" rx="22" ry="{h/2 - 10}" fill="#EEF1F7" stroke="#1E2D4F" stroke-width="1.2"/>')
    s.append(f'<ellipse cx="{cx2}" cy="{h/2 - 4}" rx="22" ry="{h/2 - 10}" fill="#FFF6D6" stroke="#C98F00" stroke-width="1.2"/>')
    yi = lambda i, k: h/2 - 4 + (i - (k - 1)/2) * 22
    for i, v in enumerate(inputs): s.append(f'<text x="{cx1}" y="{yi(i, len(inputs)) + 4}" font-size="11" font-weight="600" text-anchor="middle" fill="#1E2D4F">{neg(v)}</text>')
    for i, v in enumerate(outputs): s.append(f'<text x="{cx2}" y="{yi(i, len(outputs)) + 4}" font-size="11" font-weight="600" text-anchor="middle" fill="#1E2D4F">{neg(v)}</text>')
    s.append('<defs><marker id="ma" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6z" fill="#1E2D4F"/></marker></defs>')
    for a, b in arrows:
        s.append(f'<line x1="{cx1 + 12}" y1="{yi(a, len(inputs))}" x2="{cx2 - 14}" y2="{yi(b, len(outputs))}" stroke="#1E2D4F" stroke-width="1.2" marker-end="url(#ma)"/>')
    s.append(f'<text x="{cx1}" y="{h - 2}" font-size="7" text-anchor="middle" fill="#5B6475" font-family="Inter">INPUT</text><text x="{cx2}" y="{h - 2}" font-size="7" text-anchor="middle" fill="#5B6475" font-family="Inter">OUTPUT</text>')
    s.append("</svg>")
    return "".join(s)

def vtable(xs, ys, horizontal=True):
    if horizontal:
        return '<table class="vt"><tr><th>x</th>' + "".join(f"<td>{neg(v)}</td>" for v in xs) + '</tr><tr><th>y</th>' + "".join(f"<td>{neg(v)}</td>" for v in ys) + "</tr></table>"
    return '<table class="vt"><tr><th>x</th><th>y</th></tr>' + "".join(f"<tr><td>{neg(a)}</td><td>{neg(b)}</td></tr>" for a, b in zip(xs, ys)) + "</table>"

def numline(lo, hi, at, closed, left, w=230):
    n = hi - lo; u = (w - 20) / n; X = lambda v: 10 + (v - lo) * u
    s = [f'<svg viewBox="0 0 {w} 34" width="{w}" height="34" xmlns="http://www.w3.org/2000/svg" font-family="Inter, sans-serif">',
         f'<line x1="4" y1="12" x2="{w - 4}" y2="12" stroke="#1E2D4F" stroke-width="1.3"/>']
    for v in range(lo, hi + 1):
        s.append(f'<line x1="{X(v)}" y1="8" x2="{X(v)}" y2="16" stroke="#1E2D4F" stroke-width="1"/><text x="{X(v)}" y="28" font-size="8" text-anchor="middle" fill="#1E2D4F">{neg(v)}</text>')
    if at is not None:
        end = 10 if left else w - 10
        s.append(f'<line x1="{X(at)}" y1="12" x2="{end}" y2="12" stroke="#15803D" stroke-width="4"/>')
        tip = 2 if left else w - 2
        s.append(f'<path d="M{tip},12 L{tip + (9 if left else -9)},6 L{tip + (9 if left else -9)},18z" fill="#15803D"/>')
        s.append(f'<circle cx="{X(at)}" cy="12" r="4.2" fill="{"#15803D" if closed else "#fff"}" stroke="#15803D" stroke-width="2"/>')
    s.append("</svg>")
    return "".join(s)
