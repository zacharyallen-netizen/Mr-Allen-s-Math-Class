import os, html
from playwright.sync_api import sync_playwright

D = os.path.dirname(os.path.abspath(__file__))
FONTS = os.environ.get("FONT_DIR", "/tmp/fonts/gf/ofl")
REPO = os.path.abspath(os.path.join(D, "..", ".."))
OUT_STUDENT = os.path.join(REPO, "grade8")
OUT_KEY = os.environ.get("KEY_DIR", "/home/claude")  # answer key stays OFF the public site

NAVY = "#1E2D4F"; GOLD = "#FFC107"

# ---------------------------------------------------------------- SVG helpers
def grid(xmin, xmax, ymin, ymax, u=22, body="", labels_every=1, axis_labels=True):
    W = (xmax - xmin) * u; H = (ymax - ymin) * u; pad = 14
    def X(x): return pad + (x - xmin) * u
    def Y(y): return pad + (ymax - y) * u
    s = [f'<svg viewBox="0 0 {W+2*pad} {H+2*pad}" width="{W+2*pad}" height="{H+2*pad}" xmlns="http://www.w3.org/2000/svg" font-family="Inter" >']
    for x in range(xmin, xmax + 1):
        s.append(f'<line x1="{X(x)}" y1="{Y(ymin)}" x2="{X(x)}" y2="{Y(ymax)}" stroke="#d5dae4" stroke-width="1"/>')
    for y in range(ymin, ymax + 1):
        s.append(f'<line x1="{X(xmin)}" y1="{Y(y)}" x2="{X(xmax)}" y2="{Y(y)}" stroke="#d5dae4" stroke-width="1"/>')
    s.append(f'<line x1="{X(xmin)}" y1="{Y(0)}" x2="{X(xmax)}" y2="{Y(0)}" stroke="#1E2D4F" stroke-width="1.6"/>')
    s.append(f'<line x1="{X(0)}" y1="{Y(ymin)}" x2="{X(0)}" y2="{Y(ymax)}" stroke="#1E2D4F" stroke-width="1.6"/>')
    if axis_labels:
        for x in range(xmin, xmax + 1):
            if x != 0 and x % labels_every == 0:
                s.append(f'<text x="{X(x)}" y="{Y(0)+11}" font-size="8.5" text-anchor="middle" fill="#55607a">{x}</text>')
        for y in range(ymin, ymax + 1):
            if y != 0 and y % labels_every == 0:
                s.append(f'<text x="{X(0)-4}" y="{Y(y)+3}" font-size="8.5" text-anchor="end" fill="#55607a">{y}</text>')
        s.append(f'<text x="{X(xmax)-3}" y="{Y(0)-4}" font-size="10" font-style="italic" text-anchor="end" fill="#1E2D4F">x</text>')
        s.append(f'<text x="{X(0)+5}" y="{Y(ymax)+10}" font-size="10" font-style="italic" fill="#1E2D4F">y</text>')
    s.append(body(X, Y, u) if callable(body) else body)
    s.append('</svg>')
    return "".join(s)

def poly(pts, fill, stroke, labels=None, dash=False, lab_off=None):
    def f(X, Y, u):
        p = " ".join(f"{X(a)},{Y(b)}" for a, b in pts)
        d = ' stroke-dasharray="4 3"' if dash else ''
        out = [f'<polygon points="{p}" fill="{fill}" fill-opacity="0.35" stroke="{stroke}" stroke-width="2"{d}/>']
        for i, (a, b) in enumerate(pts):
            out.append(f'<circle cx="{X(a)}" cy="{Y(b)}" r="2.8" fill="{stroke}"/>')
            if labels:
                dx, dy = (lab_off[i] if lab_off else (6, -5))
                out.append(f'<text x="{X(a)+dx}" y="{Y(b)+dy}" font-size="10.5" font-weight="700" fill="{stroke}">{labels[i]}</text>')
        return "".join(out)
    return f

def combine(*fs):
    return lambda X, Y, u: "".join(f(X, Y, u) for f in fs)

# ---------------------------------------------------------------- page chrome
FONT_CSS = f"""
@font-face {{ font-family:'Source Serif 4'; src:url('file://{FONTS}/sourceserif4/SourceSerif4[opsz,wght].ttf'); font-weight:200 900; }}
@font-face {{ font-family:'JetBrains Mono'; src:url('file://{FONTS}/jetbrainsmono/JetBrainsMono[wght].ttf'); font-weight:100 800; }}
"""

CSS = FONT_CSS + """
@page { size: letter; margin: 0.55in 0.6in 0.65in 0.6in; }
* { box-sizing: border-box; }
body { font-family: 'Inter', sans-serif; color:#1f2638; font-size:10.6pt; line-height:1.45; margin:0; }
h1,h2,h3,h4 { font-family:'Source Serif 4', Georgia, serif; color:#1E2D4F; margin:0; }
.math { font-family:'Source Serif 4', Georgia, serif; }
.hero { background:#1E2D4F; color:#fff; border-radius:14px; padding:26px 28px 22px; position:relative; overflow:hidden; }
.hero:after { content:""; position:absolute; right:-40px; top:-40px; width:170px; height:170px; border-radius:50%; background:#FFC107; opacity:.95; }
.hero .school { font-size:9pt; letter-spacing:.14em; text-transform:uppercase; color:#FFC107; font-weight:700; }
.hero h1 { color:#fff; font-size:27pt; line-height:1.1; margin:6px 0 6px; max-width:78%; }
.hero p { margin:0; color:#d7deec; max-width:75%; }
.hero .tags { margin-top:14px; position:relative; z-index:1; }
.chip { display:inline-block; background:#FFC107; color:#1E2D4F; font-weight:800; font-size:8.6pt; padding:3px 10px; border-radius:999px; margin-right:6px; }
.chip.new { background:#fff; }
.namebar { display:flex; gap:14px; margin:16px 0 14px; }
.namebar div { flex:1; border-bottom:1.5px solid #1E2D4F; padding-bottom:2px; font-size:9pt; color:#55607a; font-weight:600; }
.namebar div.s { flex:.45; }
.secthead { break-after:avoid; display:flex; align-items:center; gap:12px; border-bottom:3px solid #FFC107; padding-bottom:6px; margin:4px 0 12px; }
.secthead .tab { background:#1E2D4F; color:#FFC107; font-family:'Source Serif 4'; font-weight:700; font-size:10pt; padding:5px 12px; border-radius:8px 8px 0 0; }
.secthead h2 { font-size:17pt; }
.secthead .lvl { margin-left:auto; font-size:8.5pt; font-weight:700; color:#1E2D4F; background:#FFF3CD; border:1px solid #FFC107; padding:2px 9px; border-radius:999px; }
.secthead .lvl.full { background:#1E2D4F; color:#FFC107; border-color:#1E2D4F; }
.ican { background:#F3F5FA; border-left:5px solid #1E2D4F; border-radius:0 8px 8px 0; padding:8px 12px; margin-bottom:10px; font-size:10pt; }
.ican b { font-family:'Source Serif 4'; color:#1E2D4F; }
.card { border:1.5px solid #dfe3ec; border-radius:10px; padding:10px 13px; margin-bottom:10px; break-inside:avoid; }
.card h3 { font-size:11.5pt; margin-bottom:5px; }
.card.gold { border-color:#FFC107; background:#FFFBEF; }
.card.navy { background:#1E2D4F; color:#fff; border-color:#1E2D4F; }
.card.navy h3 { color:#FFC107; }
.cols { display:flex; gap:12px; }
.cols > * { flex:1; min-width:0; }
table.t { border-collapse:collapse; width:100%; font-size:9.8pt; }
table.t th { background:#1E2D4F; color:#fff; font-family:'Source Serif 4'; font-weight:700; text-align:left; padding:5px 8px; font-size:9.4pt; }
table.t td { border-bottom:1px solid #e3e7ef; padding:4px 8px; vertical-align:top; }
table.t tr:nth-child(even) td { background:#F7F8FB; }
.warn { background:#FFF3CD; border:1px solid #FFC107; border-radius:8px; padding:7px 11px; font-size:9.6pt; margin:6px 0 10px; break-inside:avoid; }
.warn b:first-child { color:#8a5a00; }
.ex { font-family:'Source Serif 4'; background:#fff; border:1px dashed #b8c0d2; border-radius:8px; padding:7px 10px; font-size:10pt; line-height:1.6; }
ul.tight { margin:4px 0 0; padding-left:18px; } ul.tight li { margin-bottom:2px; }
.vtable { border-collapse:collapse; font-family:'Source Serif 4'; font-size:9.6pt; margin:auto; }
.vtable td, .vtable th { border:1.4px solid #1E2D4F; padding:3px 10px; text-align:center; }
.vtable th { background:#1E2D4F; color:#FFC107; }
.pb { break-before:page; }
.center { text-align:center; }
.small { font-size:9pt; color:#55607a; }
.bar { text-decoration: overline; }
.frac { display:inline-flex; flex-direction:column; vertical-align:middle; text-align:center; font-size:.9em; line-height:1.05; margin:0 2px; }
.frac span:first-child { border-bottom:1.2px solid currentColor; padding:0 2px; }

/* questions */
.q { border:1.5px solid #dfe3ec; border-radius:10px; padding:10px 13px 11px; margin-bottom:11px; break-inside:avoid; }
.qtop { display:flex; align-items:center; gap:8px; margin-bottom:6px; }
.qnum { background:#1E2D4F; color:#FFC107; font-family:'Source Serif 4'; font-weight:700; width:26px; height:26px; border-radius:7px; display:flex; align-items:center; justify-content:center; font-size:11pt; }
.qstd { font-size:8.2pt; font-weight:700; color:#1E2D4F; background:#EEF1F7; padding:2px 8px; border-radius:999px; }
.qtype { font-size:8.2pt; font-weight:700; color:#8a5a00; background:#FFF3CD; padding:2px 8px; border-radius:999px; }
.stem { margin-bottom:6px; }
.opts { display:grid; grid-template-columns:1fr 1fr; gap:5px 18px; }
.opts.one { grid-template-columns:1fr; }
.opts.three { grid-template-columns:1fr 1fr 1fr; }
.opt { display:flex; gap:8px; align-items:center; }
.bub { flex:none; width:19px; height:19px; border:1.6px solid #1E2D4F; border-radius:50%; font-size:8.5pt; font-weight:800; display:flex; align-items:center; justify-content:center; color:#1E2D4F; }
.box { flex:none; width:17px; height:17px; border:1.6px solid #1E2D4F; border-radius:3px; font-size:8.5pt; font-weight:800; display:flex; align-items:center; justify-content:center; color:#1E2D4F; }
.entry { display:flex; align-items:center; gap:10px; margin-top:6px; }
.entry .eb { width:150px; height:30px; border:2px solid #1E2D4F; border-radius:6px; }
.work { height:52px; border-top:1px dashed #c6ccd9; margin-top:8px; font-size:8pt; color:#9aa3b5; padding-top:2px; }
.ansline { margin-top:7px; padding:6px 10px; background:#F3F5FA; border-left:4px solid #FFC107; border-radius:0 6px 6px 0; font-size:9.8pt; }
.ansline b.a { font-family:'Source Serif 4'; color:#1E2D4F; }
.correct .bub, .correct .box { background:#FFC107; }
.figrow { display:flex; gap:14px; align-items:flex-start; }
.strat { display:grid; grid-template-columns:1fr 1fr; gap:9px; }
.strat .card { margin:0; padding:6px 10px; font-size:9.3pt; line-height:1.3; }
.strat { gap:7px; }
.strat .n { font-family:'Source Serif 4'; font-weight:700; color:#FFC107; background:#1E2D4F; border-radius:6px; padding:0 7px; margin-right:6px; }
"""

def page(title, body):
    return f"<!doctype html><html><head><meta charset='utf-8'><title>{title}</title><style>{CSS}</style></head><body>{body}</body></html>"

def fr(a, b):
    return f'<span class="frac"><span>{a}</span><span>{b}</span></span>'

def sec(tab, title, level, full=False):
    return f'<div class="secthead"><span class="tab">{tab}</span><h2>{title}</h2><span class="lvl {"full" if full else ""}">{level}</span></div>'

# ---------------------------------------------------------------- diagrams
def mapping(inputs, outputs, arrows, title):
    h = 30 + 26 * max(len(inputs), len(outputs))
    s = [f'<svg viewBox="0 0 200 {h+18}" width="200" height="{h+18}" xmlns="http://www.w3.org/2000/svg" font-family="Source Serif 4">']
    s.append(f'<text x="100" y="12" text-anchor="middle" font-size="10" font-weight="700" fill="#1E2D4F">{title}</text>')
    s.append(f'<ellipse cx="45" cy="{18+h/2}" rx="28" ry="{h/2-4}" fill="#EEF1F7" stroke="#1E2D4F" stroke-width="1.5"/>')
    s.append(f'<ellipse cx="155" cy="{18+h/2}" rx="28" ry="{h/2-4}" fill="#FFF3CD" stroke="#c98f00" stroke-width="1.5"/>')
    def yi(i, n): return 18 + h/2 + (i - (n-1)/2) * 26
    for i, v in enumerate(inputs):
        s.append(f'<text x="45" y="{yi(i,len(inputs))+4}" text-anchor="middle" font-size="11" fill="#1E2D4F">{v}</text>')
    for i, v in enumerate(outputs):
        s.append(f'<text x="155" y="{yi(i,len(outputs))+4}" text-anchor="middle" font-size="11" fill="#1E2D4F">{v}</text>')
    for a, b, bad in arrows:
        y1 = yi(a, len(inputs)); y2 = yi(b, len(outputs)); col = "#c0392b" if bad else "#1E2D4F"
        s.append(f'<line x1="58" y1="{y1}" x2="138" y2="{y2}" stroke="{col}" stroke-width="1.6" marker-end="url(#ah{1 if bad else 0})"/>')
    s.append('<defs><marker id="ah0" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7z" fill="#1E2D4F"/></marker><marker id="ah1" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7z" fill="#c0392b"/></marker></defs>')
    s.append(f'<text x="45" y="{h+16}" text-anchor="middle" font-size="8" fill="#55607a">INPUT (x)</text><text x="155" y="{h+16}" text-anchor="middle" font-size="8" fill="#55607a">OUTPUT (y)</text>')
    s.append('</svg>')
    return "".join(s)

def curve_graph(kind, label=None, u=13, vline=None):
    def body(X, Y, uu):
        out = []
        if kind == "circle":
            out.append(f'<circle cx="{X(0)}" cy="{Y(0)}" r="{3*uu}" fill="none" stroke="#c98f00" stroke-width="2.4"/>')
        elif kind == "sideparab":
            pts = " ".join(f"{X(y*y/2 - 3)},{Y(y)}" for y in [i/10 for i in range(-38, 39)])
            out.append(f'<polyline points="{pts}" fill="none" stroke="#c98f00" stroke-width="2.4"/>')
        elif kind == "vee":
            out.append(f'<polyline points="{X(-4)},{Y(3)} {X(-1)},{Y(-3+3-3)} {X(0)},{Y(-2)}" fill="none"/>')
            pts = " ".join(f"{X(x)},{Y(abs(x)*1.2-3)}" for x in [-4.6, 0, 4.6])
            out.append(f'<polyline points="{pts}" fill="none" stroke="#c98f00" stroke-width="2.4"/>')
        elif kind == "vertical":
            out.append(f'<line x1="{X(2)}" y1="{Y(-4.6)}" x2="{X(2)}" y2="{Y(4.6)}" stroke="#c98f00" stroke-width="2.4"/>')
        elif kind == "line":
            out.append(f'<line x1="{X(-4.6)}" y1="{Y(-2.3-1)}" x2="{X(4.6)}" y2="{Y(2.3-1)}" stroke="#c98f00" stroke-width="2.4"/>')
        if vline is not None:
            out.append(f'<line x1="{X(vline)}" y1="{Y(-5)}" x2="{X(vline)}" y2="{Y(5)}" stroke="#c0392b" stroke-width="1.6" stroke-dasharray="4 3"/>')
        return "".join(out)
    return grid(-5, 5, -5, 5, u=u, body=body, axis_labels=False)


def numsys():
    return """<svg viewBox="0 0 330 150" width="330" height="150" xmlns="http://www.w3.org/2000/svg" font-family="Source Serif 4">
<rect x="2" y="2" width="326" height="146" rx="10" fill="#F3F5FA" stroke="#1E2D4F" stroke-width="1.5"/>
<text x="12" y="17" font-size="10" font-weight="700" fill="#1E2D4F">REAL NUMBERS</text>
<rect x="10" y="24" width="208" height="118" rx="8" fill="#fff" stroke="#1E2D4F" stroke-width="1.3"/>
<text x="18" y="38" font-size="9.5" font-weight="700" fill="#1E2D4F">Rational</text><text x="70" y="38" font-size="8" fill="#55607a">3/8, 0.25, 0.333…</text>
<rect x="18" y="44" width="192" height="90" rx="7" fill="#EEF1F7" stroke="#1E2D4F"/>
<text x="25" y="58" font-size="9.5" font-weight="700" fill="#1E2D4F">Integers</text><text x="80" y="58" font-size="8" fill="#55607a">−7, −1</text>
<rect x="26" y="64" width="176" height="62" rx="6" fill="#dfe5f0" stroke="#1E2D4F"/>
<text x="33" y="78" font-size="9.5" font-weight="700" fill="#1E2D4F">Whole</text><text x="72" y="78" font-size="8" fill="#55607a">0</text>
<rect x="34" y="84" width="160" height="34" rx="5" fill="#1E2D4F"/>
<text x="42" y="105" font-size="9.5" font-weight="700" fill="#FFC107">Natural</text><text x="92" y="105" font-size="8.5" fill="#fff">1, 2, 3, √49</text>
<rect x="226" y="24" width="94" height="118" rx="8" fill="#FFF3CD" stroke="#c98f00" stroke-width="1.3"/>
<text x="234" y="38" font-size="9.5" font-weight="700" fill="#8a5a00">Irrational</text>
<text x="234" y="62" font-size="11" fill="#1E2D4F">π</text><text x="234" y="82" font-size="11" fill="#1E2D4F">√2, √20</text>
<text x="234" y="102" font-size="9" fill="#1E2D4F">0.1010010…</text><text x="234" y="126" font-size="7.5" fill="#8a5a00">never ends,</text><text x="234" y="136" font-size="7.5" fill="#8a5a00">never repeats</text>
</svg>"""

def numline_lt(v=-4):
    W=300; xs=list(range(-8,3)); X=lambda t: 20+(t+8)*26
    s=[f'<svg viewBox="0 0 {W} 50" width="{W}" height="50" xmlns="http://www.w3.org/2000/svg" font-family="Source Serif 4">']
    s.append(f'<line x1="8" y1="22" x2="{W-8}" y2="22" stroke="#1E2D4F" stroke-width="1.6"/>')
    for t in xs:
        s.append(f'<line x1="{X(t)}" y1="17" x2="{X(t)}" y2="27" stroke="#1E2D4F"/><text x="{X(t)}" y="42" font-size="9" text-anchor="middle" fill="#1E2D4F">{t}</text>')
    s.append(f'<line x1="{X(v)}" y1="22" x2="10" y2="22" stroke="#c98f00" stroke-width="5"/><path d="M4,22 L14,16 L14,28z" fill="#c98f00"/>')
    s.append(f'<circle cx="{X(v)}" cy="22" r="5.5" fill="#fff" stroke="#c98f00" stroke-width="2.4"/></svg>')
    return "".join(s)

def expo_pic():
    c=lambda x,col: f'<circle cx="{x}" cy="22" r="11" fill="{col}"/><text x="{x}" y="26" font-size="11" text-anchor="middle" fill="#fff" font-weight="700">2</text>'
    s='<svg viewBox="0 0 330 46" width="330" height="46" xmlns="http://www.w3.org/2000/svg" font-family="Source Serif 4">'
    s+=''.join(c(16+i*26,"#1E2D4F") for i in range(3))+'<text x="92" y="27" font-size="13" fill="#1E2D4F">·</text>'+''.join(c(110+i*26,"#c98f00") for i in range(2))
    s+='<text x="160" y="27" font-size="12" fill="#1E2D4F">=</text>'+''.join(c(184+i*26,"#1E2D4F" if i<3 else "#c98f00") for i in range(5))
    s+='<text x="20" y="44" font-size="8" fill="#55607a">2³ (3 twos) · 2² (2 twos) = 2⁵ — count the twos: 3 + 2 = 5</text></svg>'
    return s

def rot_pic():
    def body(X,Y,u):
        o=[]
        for (a,b),lab,col in [((3,2),"(3, 2)","#1E2D4F"),((-2,3),"90°: (−2, 3)","#c98f00"),((-3,-2),"180°: (−3, −2)","#2e7d32"),((2,-3),"270°: (2, −3)","#8e44ad")]:
            o.append(f'<line x1="{X(0)}" y1="{Y(0)}" x2="{X(a)}" y2="{Y(b)}" stroke="{col}" stroke-width="1.3" stroke-dasharray="3 2"/><circle cx="{X(a)}" cy="{Y(b)}" r="4" fill="{col}"/><text x="{X(a)+(5 if a>0 else -5)}" y="{Y(b)-6}" font-size="8.5" font-weight="700" text-anchor="{"start" if a>0 else "end"}" fill="{col}">{lab}</text>')
        o.append(f'<path d="M{X(2)},{Y(0.6)} A {1.9*u} {1.9*u} 0 0 0 {X(-0.6)},{Y(2)}" fill="none" stroke="#c98f00" stroke-width="1.6" marker-end="url(#rr)"/><defs><marker id="rr" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7z" fill="#c98f00"/></marker></defs>')
        for q,(a,b) in zip(["I","II","III","IV"],[(4,4),(-4,4),(-4,-4),(4,-4)]):
            o.append(f'<text x="{X(a)}" y="{Y(b)}" font-size="11" text-anchor="middle" fill="#b8c0d2" font-family="Source Serif 4" font-weight="700">{q}</text>')
        return "".join(o)
    return grid(-5,5,-5,5,u=16,body=body,axis_labels=False)

# ---------------------------------------------------------------- NOTES
def cover(key=False):
    sub = "Teacher Answer Key — Worked Explanations" if key else "Notes • Benchmark-Style Practice • Test Strategies"
    rows = [
        ("NS.1", "Rational &amp; Irrational Numbers", "I can tell rational from irrational numbers and write a repeating decimal as a fraction.", "Review"),
        ("EE.1", "Integer Exponents", "I can use exponent rules (including zero and negative exponents) to write equivalent expressions.", "Review"),
        ("EE.7", "Solving Linear Equations &amp; Inequalities", "I can solve multi-step equations and inequalities and tell if an equation has one, none, or infinitely many solutions.", "Review"),
        ("F.1", "What Is a Function?", "I can decide if a table, graph, mapping diagram, or set of ordered pairs is a function.", "New"),
        ("G.3", "Transformations with Coordinates", "I can describe and find the coordinates after a translation, reflection, rotation, or dilation.", "New"),
    ]
    tr = "".join(f'<tr><td><b class="math">NC.8.{a}</b></td><td><b>{b}</b><br><span class="small">{c}</span></td><td>{"<span class=chip>Review</span>" if d=="Review" else "<span class=\"chip new\" style=\"border:1.5px solid #1E2D4F\">New • Full Notes</span>"}</td></tr>' for a, b, c, d in rows)
    namebar = '' if key else '<div class="namebar"><div>Name</div><div class="s">Date</div><div class="s">Block</div></div>'
    plan = "" if key else """
    <div class="cols" style="margin-top:12px">
      <div class="card gold"><h3>How to use this packet</h3><ul class="tight">
        <li><b>Page 2</b> — Test strategies (read these first, every time).</li>
        <li><b>Notes</b> — Quick refreshers for NS.1, EE.1, EE.7; full notes for F.1 and G.3.</li>
        <li><b>Practice</b> — 20 Check-In style questions, 4 per standard, then a self-check.</li></ul></div>
      <div class="card"><h3>Question types you'll see</h3>
        <div class="opt" style="margin-bottom:4px"><span class="bub">A</span> <b>Multiple Choice</b> — pick ONE.</div>
        <div class="opt" style="margin-bottom:4px"><span class="box">A</span> <b>Select All That Apply</b> — could be 2, 3, or more.</div>
        <div class="opt"><span class="box" style="width:30px;border-radius:4px"></span> <b>Numeric Entry</b> — type your own answer.</div></div>
    </div>"""
    return f"""
    <div class="hero"><div class="school">Mr. Allen's 8th Grade Math</div>
      <h1>NC Check-In Benchmark Review</h1><p>{sub}</p>
      <div class="tags"><span class="chip">NS.1</span><span class="chip">EE.1</span><span class="chip">EE.7</span><span class="chip">F.1</span><span class="chip">G.3</span></div></div>
    {namebar}
    <h3 style="margin:{'16px' if key else '4px'} 0 8px">What's on this Check-In</h3>
    <table class="t"><tr><th style="width:15%">Standard</th><th>Topic &amp; "I can" goal</th><th style="width:22%">In this packet</th></tr>{tr}</table>
    {plan}
    """

def strategies():
    items = [
        ("Box the question.", "Before any math, draw a box around what they are actually asking for. Is it <i>x</i>? The <b>image</b> of point B? The number of solutions?"),
        ("Hunt for trap words.", "Circle <b>NOT</b>, <b>EXCEPT</b>, <b>greatest</b>, <b>least</b>, <b>all</b>. One missed \"NOT\" flips the whole answer."),
        ("Plug it back in.", "Got <i>x</i> = 5? Put 5 into the ORIGINAL equation. Both sides match → you're right. Works on Multiple Choice too: test each choice."),
        ("Eliminate first.", "Cross out choices that can't be right (wrong sign, wrong quadrant, too big). Two left is a 50/50 — much better than 25%."),
        ("Select All = True/False.", "Judge every option on its own: <b>T</b> or <b>F</b>. Don't stop after one. Expect 2 or more correct."),
        ("Numeric Entry has no safety net.", "No choices to compare, so check it twice. Watch negative signs, simplify fractions, and give the form asked for (fraction vs. decimal)."),
        ("Draw it.", "Sketch a quick grid, mapping diagram, or number line on scratch paper. Seeing it beats picturing it — especially for G.3 and F.1."),
        ("Estimate, then check.", "Make a quick guess before solving. If your final answer is way off from your estimate, go back and look."),
        ("Wrong answers are built from mistakes.", "Test writers put common errors in the choices (added exponents instead of multiplying, rotated the wrong way). If your answer is there, still double-check it."),
        ("Never leave one blank.", "There is no penalty for guessing. Eliminate what you can, then make your best pick and move on."),
    ]
    cards = "".join(f'<div class="card"><span class="n">{i+1}</span><b>{a}</b><div style="margin-top:3px;font-size:9.8pt">{b}</div></div>' for i, (a, b) in enumerate(items))
    return f"""
    <div class="pb"></div>{sec("Strategies", "Math Test-Taking Strategies", "Review every time", True)}
    <div class="strat">{cards}</div>
    <div class="card navy" style="margin-top:10px"><h3>C.U.B.E.S. for Word Problems</h3>
      <div style="display:flex;gap:10px;font-size:9.8pt">
      <div><b style="color:#FFC107">C</b>ircle key numbers</div><div><b style="color:#FFC107">U</b>nderline the question</div><div><b style="color:#FFC107">B</b>ox math words</div><div><b style="color:#FFC107">E</b>valuate &amp; eliminate</div><div><b style="color:#FFC107">S</b>olve &amp; check</div></div></div>
    <h3 style="margin:8px 0 5px">Watch-Out List — the mistakes that cost points</h3>
    <table class="t" style="font-size:9pt"><tr><th style="width:11%">Standard</th><th>Common mistake</th><th>Fix</th></tr>
      <tr><td class="math">NS.1</td><td>Thinking 0.272727… is irrational because it "never ends."</td><td>Repeating = rational. Irrational means it never ends <b>and</b> never repeats.</td></tr>
      <tr><td class="math">EE.1</td><td>Multiplying the bases: 3<sup>2</sup> · 3<sup>4</sup> = 9<sup>6</sup>. Or thinking a negative exponent makes a negative number.</td><td>Same base stays the same base. Negative exponent = flip to the other side of the fraction.</td></tr>
      <tr><td class="math">EE.7</td><td>Distributing to only the first term; forgetting to flip the sign.</td><td>Draw the arrows to EVERY term. Multiply/divide by a negative → flip the inequality.</td></tr>
      <tr><td class="math">F.1</td><td>Saying "not a function" because a <b>y</b>-value repeats.</td><td>Only a repeated <b>x</b> (input) with different outputs breaks a function.</td></tr>
      <tr><td class="math">G.3</td><td>Mixing up the x-axis and y-axis reflections; rotating clockwise when it says counterclockwise.</td><td>Use the rule chart. Reflect over x-axis → <b>y</b> changes sign.</td></tr>
    </table>
    """

def notes():
    ns1 = f"""
    <div class="pb"></div>{sec("NS.1", "Rational &amp; Irrational Numbers", "Quick Refresher")}
    <div class="ican"><b>I can</b> tell rational from irrational numbers and write a repeating decimal as a fraction.</div>
    <div class="cols">
      <div class="card"><h3>Rational</h3>Can be written as a fraction {fr('a','b')} of integers (b ≠ 0).<br>Its decimal <b>ends</b> or <b>repeats</b>.
        <div class="ex" style="margin-top:5px">−7 &nbsp; {fr(3,8)} &nbsp; 0.25 &nbsp; 0.<span class="bar">3</span> &nbsp; √49 = 7 &nbsp; √<span style="text-decoration:overline">0.25</span> = 0.5</div></div>
      <div class="card gold"><h3>Irrational</h3>CANNOT be written as a fraction.<br>Its decimal <b>never ends AND never repeats</b>.
        <div class="ex" style="margin-top:5px">π &nbsp; √2 &nbsp; √20 &nbsp; 0.1010010001…</div>
        <div class="small" style="margin-top:4px">√ of a whole number that is NOT a perfect square → irrational.</div></div>
    </div>
    <div class="card"><div class="figrow"><div style="flex:1"><h3>Where numbers live</h3>Every real number is <b>either</b> rational <b>or</b> irrational — never both. Integers, whole numbers, and natural numbers are all <b>inside</b> the rational box.<div class="small" style="margin-top:6px">√49 = 7, so it's a natural number — even with a square root sign!</div></div>{numsys()}</div></div>
    <div class="card"><h3>Repeating decimal → fraction: the 9's Rule</h3>
      <div class="cols">
        <div><ol style="margin:2px 0 0;padding-left:20px">
          <li><b>Count</b> the repeating digits.</li>
          <li><b>Denominator</b> = that many 9's (one 9 for each repeating digit).</li>
          <li><b>Numerator</b> = the repeating digits.</li>
          <li><b>Simplify.</b></li></ol></div>
        <div class="ex">0.<span class="bar">27</span> = 0.272727…<br>2 digits repeat → 99<br>{fr(27,99)} = <b>{fr(3,11)}</b> &nbsp;<span class="small">(÷ 9)</span></div>
      </div>
      <table class="t" style="margin-top:8px"><tr><th>Repeating digits</th><th>Denominator</th><th>Example</th></tr>
        <tr><td>1 digit</td><td class="math">9</td><td class="math">0.<span class="bar">3</span> = {fr(3,9)} = {fr(1,3)}</td></tr>
        <tr><td>2 digits</td><td class="math">99</td><td class="math">0.<span class="bar">45</span> = {fr(45,99)} = {fr(5,11)}</td></tr>
        <tr><td>3 digits</td><td class="math">999</td><td class="math">0.<span class="bar">125</span> = {fr(125,999)}</td></tr></table>
      <div class="small" style="margin-top:6px"><b>Remember:</b> the 9's rule works when the decimal starts repeating right after the decimal point. Always simplify your fraction.</div>
    </div>"""
    ee1 = f"""
    <div class="pb"></div>{sec("EE.1", "Integer Exponents", "Quick Refresher")}
    <div class="ican"><b>I can</b> use the properties of integer exponents to write equivalent expressions.</div>
    <table class="t"><tr><th>Rule</th><th>In words</th><th>Example</th></tr>
      <tr><td><b>Product</b> &nbsp;a<sup>m</sup> · a<sup>n</sup> = a<sup>m+n</sup></td><td>Same base, multiplying → <b>add</b> exponents</td><td class="math">2<sup>3</sup> · 2<sup>5</sup> = 2<sup>8</sup></td></tr>
      <tr><td><b>Quotient</b> &nbsp;a<sup>m</sup> ÷ a<sup>n</sup> = a<sup>m−n</sup></td><td>Same base, dividing → <b>subtract</b> (top − bottom)</td><td class="math">5<sup>7</sup> ÷ 5<sup>9</sup> = 5<sup>−2</sup></td></tr>
      <tr><td><b>Power of a power</b> &nbsp;(a<sup>m</sup>)<sup>n</sup> = a<sup>mn</sup></td><td>Exponent outside parentheses → <b>multiply</b></td><td class="math">(x<sup>4</sup>)<sup>3</sup> = x<sup>12</sup></td></tr>
      <tr><td><b>Power of a product</b> &nbsp;(ab)<sup>n</sup> = a<sup>n</sup>b<sup>n</sup></td><td>Give the exponent to <b>every</b> factor inside</td><td class="math">(2y<sup>3</sup>)<sup>2</sup> = 4y<sup>6</sup></td></tr>
      <tr><td><b>Zero</b> &nbsp;a<sup>0</sup> = 1</td><td>Anything (not 0) to the zero power is 1</td><td class="math">(−8)<sup>0</sup> = 1</td></tr>
      <tr><td><b>Negative</b> &nbsp;a<sup>−n</sup> = {fr('1','a<sup>n</sup>')}</td><td>Negative exponent → <b>flip</b> it across the fraction bar. It does NOT make the number negative.</td><td class="math">4<sup>−2</sup> = {fr(1,16)}</td></tr>
    </table>
    <div class="card" style="margin-top:8px"><div class="figrow"><div style="flex:1"><h3>Why do we ADD exponents?</h3>An exponent counts how many times the base is multiplied. Put the groups together and count.</div>{expo_pic()}</div></div>
    <div class="warn"><b>Careful:</b> (−4)<sup>2</sup> = 16 but −4<sup>2</sup> = −16. The negative is only inside the power if it's inside the parentheses. Final answers usually have <b>positive exponents only</b>.</div>
    """
    ee7 = f"""
    <div class="pb"></div>{sec("EE.7", "Solving Linear Equations &amp; Inequalities", "Quick Refresher")}
    <div class="ican"><b>I can</b> solve multi-step equations and inequalities (variables on both sides) and decide how many solutions an equation has.</div>
    <div class="cols">
      <div class="card"><h3>The 4-step game plan</h3><ol style="margin:2px 0 0;padding-left:18px">
        <li><b>Distribute</b> to clear parentheses.</li><li><b>Combine like terms</b> on each side.</li>
        <li><b>Collect</b> variables on one side (inverse operations).</li><li><b>Isolate</b> the variable. Then <b>check</b>.</li></ol>
        <div class="small" style="margin-top:4px"><b>Fractions?</b> Multiply EVERY term by the LCD to clear them first.</div></div>
      <div class="ex">3(x − 4) + 5 = x + 9<br>3x − 12 + 5 = x + 9<br>3x − 7 = x + 9<br>2x − 7 = 9<br>2x = 16 → <b>x = 8</b><br><span class="small">Check: 3(4)+5 = 17 &nbsp;and&nbsp; 8+9 = 17 ✓</span></div>
    </div>
    <div class="card"><h3>How many solutions? — look at what's left when the variables cancel</h3>
    <table class="t"><tr><th>One solution</th><th>No solution</th><th>Infinitely many solutions</th></tr>
      <tr><td>You end with <b>x = a number</b>.</td><td>Variables cancel, you get a <b>false</b> statement.</td><td>Variables cancel, you get a <b>true</b> statement.</td></tr>
      <tr><td class="math">4x + 1 = 2x + 7<br>x = 3</td><td class="math">2(x + 3) = 2x + 5<br>6 = 5 ✗</td><td class="math">3(x + 2) = 3x + 6<br>6 = 6 ✓</td></tr>
      <tr><td class="small">Different slopes (x-coefficients)</td><td class="small">Same x-coefficients, different constants</td><td class="small">Both sides are exactly the same</td></tr></table></div>
    <div class="cols">
      <div class="card gold"><h3>Inequalities: same steps + ONE rule</h3>Multiply or divide both sides by a <b>negative</b> → <b>flip the sign</b>.
        <div class="ex" style="margin-top:5px">−3x + 7 &gt; 19<br>−3x &gt; 12<br>x <b>&lt;</b> −4 &nbsp;<span class="small">(÷ −3 → flip)</span></div>{numline_lt()}<div class="small">Open circle: −4 is NOT included (&lt;). Closed circle for ≤ or ≥.</div></div>
      <div class="card"><h3>Word problems → read the context</h3>
        "At most" → ≤ &nbsp;&nbsp; "at least" → ≥<br>If the answer must be a whole number (people, tickets, shirts), <b>round to what makes sense</b> — usually down for "can afford."</div>
    </div>"""

    # F.1 full notes
    f1a = mapping([1, 2, 3], [4, 5], [(0, 0, False), (1, 1, False), (2, 1, False)], "FUNCTION ✓")
    f1b = mapping([1, 2, 3], [4, 5, 6], [(0, 0, False), (1, 1, True), (1, 2, True)], "NOT a function ✗")
    g_ok = curve_graph("vee", vline=2.3)
    g_no = curve_graph("circle", vline=1.4)
    f1 = f"""
    <div class="pb"></div>{sec("F.1", "What Is a Function?", "Full Notes — New", True)}
    <div class="ican"><b>I can</b> explain that a function gives each input exactly one output, and decide if a table, graph, mapping diagram, or list of ordered pairs is a function.</div>
    <div class="card navy"><h3>Definition</h3>A <b style="color:#FFC107">function</b> is a rule that assigns to each <b>input</b> (x) <b>exactly one output</b> (y). The graph of a function is the set of ordered pairs (input, output).
      <div style="margin-top:5px;font-size:9.8pt">Think of a vending machine: press B4 → you always get the same snack. If B4 sometimes gave chips and sometimes gave cookies, the machine would be broken — <b>not a function</b>.</div></div>
    <div class="cols">
      <div class="card"><h3>Vocabulary</h3><table class="t">
        <tr><td><b>Relation</b></td><td>Any set of ordered pairs.</td></tr>
        <tr><td><b>Input / Domain</b></td><td>The x-values (what goes in).</td></tr>
        <tr><td><b>Output / Range</b></td><td>The y-values (what comes out).</td></tr>
        <tr><td><b>Function</b></td><td>A relation where no input has two different outputs.</td></tr></table></div>
      <div class="card gold"><h3>The ONE question to ask</h3><div style="font-size:11pt">"Does any <b>x</b> repeat with a <b>different y</b>?"</div>
        <ul class="tight"><li><b>Yes</b> → NOT a function.</li><li><b>No</b> → function.</li>
        <li>Repeated <b>y</b>-values are fine! Two kids can share a birthday.</li></ul></div>
    </div>
    <h3 style="margin:2px 0 6px">Four ways to see it</h3>
    <div class="cols">
      <div class="card"><h3>1. Table</h3>
        <div class="cols"><div><table class="vtable"><tr><th>x</th><th>y</th></tr><tr><td>1</td><td>3</td></tr><tr><td>2</td><td>3</td></tr><tr><td>3</td><td>5</td></tr></table><div class="center small" style="margin-top:3px"><b>Function ✓</b><br>y repeats — OK</div></div>
        <div><table class="vtable"><tr><th>x</th><th>y</th></tr><tr><td style="background:#FFE0DC">2</td><td>1</td></tr><tr><td>4</td><td>6</td></tr><tr><td style="background:#FFE0DC">2</td><td>8</td></tr></table><div class="center small" style="margin-top:3px"><b>NOT ✗</b><br>x = 2 → 1 and 8</div></div></div></div>
      <div class="card"><h3>2. Ordered pairs</h3>
        <div class="ex">{{(0, 2), (1, 4), (2, 6)}}<br><span class="small">Function ✓ — every x is different</span></div>
        <div class="ex" style="margin-top:5px">{{(5, 1), (<b style="color:#c0392b">3</b>, 2), (<b style="color:#c0392b">3</b>, 7)}}<br><span class="small">NOT ✗ — x = 3 has two outputs</span></div></div>
    </div>
    <div class="cols">
      <div class="card"><h3>3. Mapping diagram</h3><div class="figrow" style="justify-content:space-around">{f1a}{f1b}</div>
        <div class="small center">Count arrows leaving each input: more than one arrow from the same input → NOT a function.</div></div>
      <div class="card"><h3>4. Graph — Vertical Line Test</h3><div class="figrow" style="justify-content:space-around"><div class="center">{g_ok}<div class="small"><b>Function ✓</b> — hits once</div></div><div class="center">{g_no}<div class="small"><b>NOT ✗</b> — hits twice</div></div></div>
        <div class="small center">Slide a vertical line across. If it ever touches the graph in 2+ points → NOT a function.</div></div>
    </div>
    <div class="cols">
      <div class="card"><h3>Functions in real life</h3><ul class="tight">
        <li><b>Function:</b> input = number of $8 tickets, output = total cost. Each number of tickets has one cost.</li>
        <li><b>Function:</b> input = a student, output = their birthday.</li>
        <li><b>NOT:</b> input = an age, output = a student with that age. Age 13 could match many students.</li></ul></div>
      <div class="warn" style="flex:1;margin:0"><b>Benchmark trick:</b> "Which value of <i>k</i> makes the relation NOT a function?" Look for the choice that <b>matches an x-value already used</b> with a different y. A vertical line (x = 2) is never a function; a horizontal line (y = 2) always is.</div>
    </div>
    """

    # G.3 full notes
    tri = [(1, 1), (4, 1), (1, 3)]
    gex = grid(-5, 5, -4, 4, u=16, body=combine(
        poly(tri, "#1E2D4F", "#1E2D4F", ["A", "B", "C"], lab_off=[(-11, 12), (4, 12), (-11, -3)]),
        poly([(x - 5, y - 4 + 0) for x, y in tri], "#FFC107", "#c98f00", ["A'", "B'", "C'"], dash=True, lab_off=[(-13, 12), (4, 12), (-14, -3)]) if False else
        poly([(-x, y) for x, y in tri], "#FFC107", "#c98f00", ["A'", "B'", "C'"], dash=True, lab_off=[(3, 12), (-15, 12), (3, -3)])))
    g3 = f"""
    <div class="pb"></div>{sec("G.3", "Transformations with Coordinates", "Full Notes — New", True)}
    <div class="ican"><b>I can</b> describe the effect of translations, reflections (over the x- or y-axis), rotations (90°, 180°, 270° about the origin), and dilations (about the origin) using coordinates.</div>
    <div class="cols">
      <div class="card"><h3>Vocabulary</h3><table class="t">
        <tr><td><b>Pre-image</b></td><td>The original figure: A, B, C</td></tr>
        <tr><td><b>Image</b></td><td>The new figure, named with <b>primes</b>: A′, B′, C′</td></tr>
        <tr><td><b>Rigid motion</b></td><td>Moves a figure but keeps its size &amp; shape → <b>congruent</b> (≅)</td></tr>
        <tr><td><b>Dilation</b></td><td>Stretches or shrinks → <b>similar</b> (~), not congruent</td></tr>
        <tr><td><b>Scale factor (k)</b></td><td>k &gt; 1 enlarges; 0 &lt; k &lt; 1 shrinks</td></tr></table></div>
      <div class="card center"><h3 style="text-align:left">Example: reflect △ABC over the y-axis</h3>{gex}
        <div class="small">A(1, 1) → A′(−1, 1) &nbsp; B(4, 1) → B′(−4, 1) &nbsp; C(1, 3) → C′(−1, 3)<br>x changes sign, y stays the same.</div></div>
    </div>
    <h3 style="margin:2px 0 6px">The Rule Chart — know these cold</h3>
    <table class="t">
      <tr><th style="width:30%">Transformation</th><th style="width:22%">Coordinate rule</th><th style="width:20%">Example: (3, −2)</th><th>How to remember</th></tr>
      <tr><td><b>Translation</b> a units right/left, b units up/down</td><td class="math">(x, y) → (x + a, y + b)</td><td class="math">4 left, 1 up:<br>(−1, −1)</td><td>Right/left changes x. Up/down changes y. Left &amp; down are negative.</td></tr>
      <tr><td><b>Reflection over the x-axis</b></td><td class="math">(x, y) → (x, −y)</td><td class="math">(3, 2)</td><td>Flip over the x-axis → <b>y</b> flips sign.</td></tr>
      <tr><td><b>Reflection over the y-axis</b></td><td class="math">(x, y) → (−x, y)</td><td class="math">(−3, −2)</td><td>Flip over the y-axis → <b>x</b> flips sign.</td></tr>
      <tr><td><b>Rotation 90° counterclockwise</b><br><span class="small">(same as 270° clockwise)</span></td><td class="math">(x, y) → (−y, x)</td><td class="math">(2, 3)</td><td>Swap, then make the <b>new first</b> number opposite.</td></tr>
      <tr><td><b>Rotation 180°</b> <span class="small">(either direction)</span></td><td class="math">(x, y) → (−x, −y)</td><td class="math">(−3, 2)</td><td>Both signs flip. No swap.</td></tr>
      <tr><td><b>Rotation 270° counterclockwise</b><br><span class="small">(same as 90° clockwise)</span></td><td class="math">(x, y) → (y, −x)</td><td class="math">(−2, −3)</td><td>Swap, then make the <b>new second</b> number opposite.</td></tr>
      <tr><td><b>Dilation</b> by scale factor k, centered at origin</td><td class="math">(x, y) → (kx, ky)</td><td class="math">k = 2:<br>(6, −4)</td><td>Multiply <b>both</b> coordinates by k. Side lengths × k, angles stay the same.</td></tr>
    </table>
    <div class="cols" style="margin-top:10px">
      <div class="card gold"><h3>What stays the same?</h3><table class="t">
        <tr><th></th><th>Size</th><th>Shape &amp; angles</th><th>Congruent?</th></tr>
        <tr><td>Translate / Reflect / Rotate</td><td>✓</td><td>✓</td><td><b>Yes</b></td></tr>
        <tr><td>Dilate</td><td>✗</td><td>✓</td><td>No — <b>similar</b></td></tr></table></div>
      <div class="card"><div class="figrow"><div style="flex:1"><h3>Quick-check tricks</h3><ul class="tight">
        <li><b>Quadrant check:</b> a 90° rotation moves a point one quadrant over; 180° moves it to the opposite quadrant.</li>
        <li><b>Counterclockwise</b> = the direction of the quadrant numbers I → II → III → IV.</li>
        <li>Turn your paper! Rotate your scratch sketch to see a rotation.</li></ul></div>{rot_pic()}</div></div>
    </div>
    """
    return ns1 + ee1 + ee7 + f1 + g3

# ---------------------------------------------------------------- QUESTIONS
Q = []
def add(std, typ, stem, opts=None, cols=2, entry=None, fig=None, ans=None, correct=None, why=""):
    Q.append(dict(std=std, typ=typ, stem=stem, opts=opts, cols=cols, entry=entry, fig=fig, ans=ans, correct=correct or [], why=why))

# NS.1
add("NS.1", "Select All That Apply", "Select <b>ALL</b> of the numbers that are <b>irrational</b>.",
    ["√49", "√20", "0.<span class='bar'>37</span>", "π", f"−{fr(5,8)}", "0.1010010001… <span class='small'>(pattern: one more 0 each time)</span>"], cols=2,
    ans="B, D, F", correct=[1, 3, 5],
    why="√20 is irrational because 20 is not a perfect square. π never ends and never repeats. 0.1010010001… never ends and has no block that repeats. <b>Not irrational:</b> √49 = 7; 0.<span class='bar'>37</span> repeats (= 37/99); −5/8 is already a fraction.")
add("NS.1", "Numeric Entry", "Use the 9's rule. Write the repeating decimal 0.<span class='bar'>36</span> = 0.363636… as a fraction in simplest form.", entry=True,
    ans=f"{fr(4,11)}",
    why=f"Two digits repeat (36), so the denominator is two 9's: {fr(36,99)}. Simplify by dividing the top and bottom by 9: {fr(4,11)}.")
add("NS.1", "Multiple Choice", "Which fraction is equal to 0.<span class='bar'>27</span> = 0.272727… ?",
    [fr(27,100), fr(3,11), fr(2,7), fr(27,90)], cols=2, ans="B", correct=[1],
    why=f"9's rule: 2 digits repeat (27), so use two 9's: {fr(27,99)}. Simplify (÷ 9): {fr(3,11)}. <b>Traps:</b> A is 0.27 (it stops); C = 0.285714…; D uses 90 instead of 99.")
add("NS.1", "Multiple Choice", "Which statement is true?",
    ["Every fraction has a decimal that terminates (ends).", "0.161616… is irrational because it never ends.", "√50 is irrational because 50 is not a perfect square.", "π is rational because π = 22/7."], cols=1, ans="C", correct=[2],
    why="7² = 49 and 8² = 64, so √50 is between 7 and 8 and is not a whole number — it is irrational. A is false (1/3 = 0.333… repeats). B is false: it repeats, so it's rational (16/99). D is false: 22/7 is only an <i>approximation</i> of π.")
# EE.1
add("EE.1", "Multiple Choice", "Which value is equal to the expression?<div class='center math' style='font-size:13pt;margin:4px 0'>" + fr("3<sup>4</sup> · 3<sup>−6</sup>", "3<sup>2</sup>") + "</div>",
    ["−81", fr(1,81), fr(1,9), "81"], cols=2, ans="B", correct=[1],
    why=f"Top: 3<sup>4 + (−6)</sup> = 3<sup>−2</sup>. Divide: 3<sup>−2 − 2</sup> = 3<sup>−4</sup> = {fr(1,'3<sup>4</sup>')} = {fr(1,81)}. <b>Traps:</b> −81 treats the negative exponent as a negative number; 1/9 forgets to subtract the 2 in the denominator.")
add("EE.1", "Numeric Entry", "What is the value of the expression?<div class='center math' style='font-size:13pt;margin:4px 0'>(2<sup>3</sup>)<sup>2</sup> · 2<sup>−4</sup> · 7<sup>0</sup></div>", entry=True,
    ans="4", why="(2³)² = 2⁶ (multiply exponents). 2⁶ · 2⁻⁴ = 2² (add exponents). 7⁰ = 1. So 2² · 1 = <b>4</b>.")
add("EE.1", "Select All That Apply", f"Select <b>ALL</b> expressions that are equal to {fr(1,16)}.",
    ["4<sup>−2</sup>", "2<sup>−4</sup>", "−16", "(−4)<sup>−2</sup>", "−4<sup>−2</sup>", fr("2<sup>8</sup>", "2<sup>4</sup>")], cols=3,
    ans="A, B, D", correct=[0, 1, 3],
    why=f"4⁻² = 1/4² = 1/16 ✓. 2⁻⁴ = 1/2⁴ = 1/16 ✓. (−4)⁻² = 1/(−4)² = 1/16 ✓ (the negative is inside the parentheses, so it gets squared). <b>Not equal:</b> −16; −4⁻² = −(1/16); 2⁸/2⁴ = 2⁴ = 16.")
add("EE.1", "Multiple Choice", "Which expression is equivalent to the expression below?<div class='center math' style='font-size:13pt;margin:4px 0'>" + fr("(x<sup>5</sup>y<sup>−2</sup>)<sup>3</sup>", "x<sup>2</sup>y<sup>−4</sup>") + "</div>",
    [fr("x<sup>13</sup>", "y<sup>2</sup>"), "x<sup>13</sup>y<sup>2</sup>", fr("x<sup>6</sup>", "y<sup>8</sup>"), fr("x<sup>17</sup>", "y<sup>10</sup>")], cols=2, ans="A", correct=[0],
    why=f"Power of a power: (x⁵y⁻²)³ = x¹⁵y⁻⁶. Divide: x<sup>15−2</sup> = x¹³ and y<sup>−6−(−4)</sup> = y⁻². So x¹³y⁻² = {fr('x<sup>13</sup>','y<sup>2</sup>')}. <b>Traps:</b> B forgets the negative exponent means flip; C adds 5 + 3 instead of multiplying; D multiplies instead of dividing.")
# EE.7
add("EE.7", "Numeric Entry", "Solve for <i>x</i>.<div class='center math' style='font-size:13pt;margin:4px 0'>4(x − 3) + 2x = 2x + 8</div>", entry=True,
    ans="x = 5", why="Distribute: 4x − 12 + 2x = 2x + 8. Combine: 6x − 12 = 2x + 8. Subtract 2x: 4x − 12 = 8. Add 12: 4x = 20. Divide: x = 5. <b>Check:</b> 4(2) + 10 = 18 and 10 + 8 = 18 ✓")
add("EE.7", "Multiple Choice", "How many solutions does this equation have?<div class='center math' style='font-size:13pt;margin:4px 0'>2(3x − 5) + 4 = 6x − 6</div>",
    ["No solution", "Exactly one solution, x = 0", "Exactly one solution, x = −6", "Infinitely many solutions"], cols=2, ans="D", correct=[3],
    why="Left side: 6x − 10 + 4 = 6x − 6. Now 6x − 6 = 6x − 6. Subtract 6x: −6 = −6, which is always <b>true</b>. Both sides are identical → infinitely many solutions.")
add("EE.7", "Numeric Entry", "Solve for <i>x</i>.<div class='center math' style='font-size:13pt;margin:4px 0'>" + fr(2,3) + "x − 4 = " + fr(1,6) + "x + 5</div>", entry=True,
    ans="x = 18", why=f"Multiply every term by the LCD, 6: 4x − 24 = x + 30. Subtract x: 3x − 24 = 30. Add 24: 3x = 54. x = 18. <b>Check:</b> {fr(2,3)}(18) − 4 = 8 and {fr(1,6)}(18) + 5 = 8 ✓")
add("EE.7", "Multiple Choice", "Jordan has $85. He buys a jacket for $34 and wants to spend the rest on T-shirts that cost $12 each. What is the <b>greatest</b> number of T-shirts Jordan can buy?",
    ["4", "4.25", "5", "7"], cols=2, ans="A", correct=[0],
    why="Inequality: 34 + 12s ≤ 85. Subtract 34: 12s ≤ 51. Divide: s ≤ 4.25. He can't buy part of a shirt, so the greatest whole number is <b>4</b>. <b>Traps:</b> 4.25 ignores the context; 5 rounds up and costs $94; 7 ignores the jacket (85 ÷ 12).")
# F.1
tbl = lambda xs, ys: "<table class='vtable'><tr><th>x</th>" + "".join(f"<td>{v}</td>" for v in xs) + "</tr><tr><th>y</th>" + "".join(f"<td>{v}</td>" for v in ys) + "</tr></table>"
add("F.1", "Multiple Choice", "Which table represents <i>y</i> as a function of <i>x</i>?",
    [tbl([1, 2, 1, 3], [4, 5, 6, 7]), tbl([2, 4, 6, 8], [5, 5, 5, 5]), tbl([-1, 0, -1, 2], [3, 3, 4, 5]), tbl([5, 5, 5, 5], [1, 2, 3, 4])], cols=2, ans="B", correct=[1],
    why="In B every input (2, 4, 6, 8) is different, so each has exactly one output. All outputs being 5 is fine. A: x = 1 → 4 and 6. C: x = −1 → 3 and 4. D: x = 5 has four outputs.")
add("F.1", "Multiple Choice", "Which graph represents a function?",
    [curve_graph("circle", u=10), curve_graph("sideparab", u=10), curve_graph("vee", u=10), curve_graph("vertical", u=10)], cols=4, ans="C", correct=[2],
    why="Use the vertical line test. Graph C (the V shape) is crossed only once by any vertical line. A vertical line hits the circle (A) and the sideways U (B) twice, and graph D is itself a vertical line — x = 2 has infinitely many outputs.")
add("F.1", "Select All That Apply", "Select <b>ALL</b> of the relations that are functions.",
    ["{(1, 2), (2, 3), (3, 4)}", "{(2, 1), (2, 3), (4, 5)}", "{(−3, 5), (0, 5), (3, 5)}", "{(0, 0), (1, 1), (1, −1)}", "{(7, 2), (8, 2), (9, 3)}"], cols=1,
    ans="A, C, E", correct=[0, 2, 4],
    why="A, C, E: no x-value repeats (repeated y-values in C and E are OK). B: x = 2 → 1 and 3. D: x = 1 → 1 and −1.")
add("F.1", "Multiple Choice", "The relation below is shown as a set of ordered pairs.<div class='center math' style='font-size:12pt;margin:4px 0'>{(2, 5), (4, 7), (<i>k</i>, 9), (6, 11)}</div>Which value of <i>k</i> would make the relation <b>NOT</b> a function?",
    ["1", "3", "4", "8"], cols=2, ans="C", correct=[2],
    why="If k = 4, the input 4 would have two outputs, 7 and 9 — not a function. Any value of k that is not already an input (1, 3, 8) keeps it a function.")
# G.3
TRI = [(2, 1), (5, 1), (2, 4)]
g17 = grid(-5, 6, -4, 5, u=17, body=poly(TRI, "#1E2D4F", "#1E2D4F", ["A", "B", "C"], lab_off=[(-11, 12), (3, 12), (-12, -2)]))
add("G.3", "Multiple Choice", "Triangle ABC is translated <b>4 units left</b> and <b>3 units down</b> to form triangle A′B′C′. What are the coordinates of <b>B′</b>?",
    ["(1, −2)", "(9, −2)", "(1, 4)", "(−2, −2)"], cols=2, fig=g17, ans="A", correct=[0],
    why="B is at (5, 1). Left 4 → x: 5 − 4 = 1. Down 3 → y: 1 − 3 = −2. B′(1, −2). <b>Traps:</b> (9, −2) moved right; (1, 4) moved up; (−2, −2) is where A goes.")
PQR = [(1, 3), (4, 3), (4, 1)]
g18 = grid(-5, 5, -4, 4, u=17, body=poly(PQR, "#1E2D4F", "#1E2D4F", ["P", "Q", "R"], lab_off=[(-11, -3), (4, -3), (4, 12)]))
add("G.3", "Multiple Choice", "Triangle PQR is reflected across the <b>y-axis</b>. Which set of points are the vertices of P′Q′R′?",
    ["P′(1, −3), Q′(4, −3), R′(4, −1)", "P′(−1, 3), Q′(−4, 3), R′(−4, 1)", "P′(−1, −3), Q′(−4, −3), R′(−4, −1)", "P′(3, 1), Q′(3, 4), R′(1, 4)"], cols=1, fig=g18, ans="B", correct=[1],
    why="Reflection across the y-axis: (x, y) → (−x, y). Only the x-coordinates change sign. A is a reflection across the x-axis; C is a 180° rotation; D swaps x and y.")
add("G.3", "Multiple Choice", "Point M(3, −2) is rotated <b>90° counterclockwise</b> about the origin. What are the coordinates of M′?",
    ["(2, 3)", "(−2, −3)", "(−3, 2)", "(3, 2)"], cols=2, fig=grid(-5,5,-4,4,u=17,body=lambda X,Y,u: f'<circle cx="{X(3)}" cy="{Y(-2)}" r="4" fill="#1E2D4F"/><text x="{X(3)+6}" y="{Y(-2)+4}" font-size="10.5" font-weight="700" fill="#1E2D4F">M</text>'), ans="A", correct=[0],
    why="90° counterclockwise: (x, y) → (−y, x) = (−(−2), 3) = (2, 3). Quadrant check: M is in IV; 90° counterclockwise moves it to I ✓. <b>Traps:</b> (−2, −3) is 90° clockwise; (−3, 2) is 180°; (3, 2) is a reflection over the x-axis.")
REC = [(2, 1), (6, 1), (6, 4), (2, 4)]
g20 = grid(-1, 7, -1, 5, u=17, body=poly(REC, "#1E2D4F", "#1E2D4F", ["W", "X", "Y", "Z"], lab_off=[(-12, 12), (3, 12), (3, -3), (-12, -3)]))
add("G.3", "Select All That Apply", "Rectangle WXYZ is dilated by a scale factor of " + fr(1, 2) + " centered at the origin. Select <b>ALL</b> true statements.",
    ["W′ is at (1, 0.5).", "Z′ is at (4, 8).", "The image has side lengths 2 and 1.5.", "The image is congruent to WXYZ.", "Every angle of the image still measures 90°."], cols=1, fig=g20,
    ans="A, C, E", correct=[0, 2, 4],
    why="Multiply each coordinate by ½: W(2, 1) → W′(1, 0.5) ✓; Z(2, 4) → Z′(1, 2), not (4, 8) (that is scale factor 2). Original sides are 4 and 3, so the image sides are 2 and 1.5 ✓. A dilation changes size, so the image is <b>similar, not congruent</b>. Angles never change in a dilation ✓.")

def question_html(i, q, key):
    L = "ABCDEF"
    top = f'<div class="qtop"><span class="qnum">{i+1}</span><span class="qstd">NC.8.{q["std"]}</span><span class="qtype">{q["typ"]}</span></div>'
    body = f'<div class="stem">{q["stem"]}</div>'
    opts = ""
    if q["opts"]:
        multi = q["typ"].startswith("Select")
        cls = {1: "one", 2: "", 3: "three", 4: "three"}[q["cols"]]
        style = ' style="grid-template-columns:repeat(4,1fr)"' if q["cols"] == 4 else ""
        items = []
        for j, o in enumerate(q["opts"]):
            c = " correct" if key and j in q["correct"] else ""
            items.append(f'<div class="opt{c}"><span class="{"box" if multi else "bub"}">{L[j]}</span><div>{o}</div></div>')
        opts = f'<div class="opts {cls}"{style}>{"".join(items)}</div>'
    if q["entry"]:
        opts = '<div class="entry"><b class="small">Answer:</b><div class="eb"></div></div>'
        if key:
            opts = f'<div class="entry"><b class="small">Answer:</b><div class="eb" style="display:flex;align-items:center;padding-left:10px;font-family:Source Serif 4,Georgia,serif;font-weight:700;background:#FFF3CD">{q["ans"]}</div></div>'
    inner = body + opts
    if q["fig"]:
        inner = f'<div class="figrow"><div style="flex:1">{inner}</div><div>{q["fig"]}</div></div>'
    extra = f'<div class="ansline"><b class="a">Answer: {q["ans"]}</b> — {q["why"]}</div>' if key else ('' if q["opts"] and q["typ"]=="Select All That Apply" and False else '<div class="work">Show your work</div>')
    return f'<div class="q">{top}{inner}{extra}</div>'

def questions(key):
    out = []
    order = ["NS.1", "EE.1", "EE.7", "F.1", "G.3"]
    names = {"NS.1": "Rational &amp; Irrational Numbers", "EE.1": "Integer Exponents", "EE.7": "Equations &amp; Inequalities", "F.1": "Functions", "G.3": "Transformations"}
    for s in order:
        idx = [i for i, q in enumerate(Q) if q["std"] == s]
        out.append(f'{"<div class=pb></div>" if s=="NS.1" else "<div style=height:6px></div>"}{sec(s, ("Answer Key — " if key else "Practice — ") + names[s], "4 questions")}')
        out.append("".join(question_html(i, Q[i], key) for i in idx))
    return "".join(out)

def score_table():
    return """<div class="card" style="margin-top:6px"><h3>Self-check: how did I do?</h3>
      <table class="t"><tr><th>Standard</th><th>Questions</th><th>My score</th><th>Next step</th></tr>
      <tr><td class="math">NS.1</td><td>1–4</td><td>____ / 4</td><td rowspan="5" class="small">4/4 — Ready! &nbsp; 3/4 — Re-read the notes page. &nbsp; 0–2/4 — See your teacher for a re-teach.</td></tr>
      <tr><td class="math">EE.1</td><td>5–8</td><td>____ / 4</td></tr><tr><td class="math">EE.7</td><td>9–12</td><td>____ / 4</td></tr>
      <tr><td class="math">F.1</td><td>13–16</td><td>____ / 4</td></tr><tr><td class="math">G.3</td><td>17–20</td><td>____ / 4</td></tr></table></div>"""

student = page("NC Check-In Review", cover() + strategies() + notes() + questions(False) + score_table())

key_summary = "<h3 style='margin:14px 0 6px'>Answer Summary</h3><table class='t'><tr>" + "".join(f"<th class='center'>{i+1}</th>" for i in range(10)) + "</tr><tr>" + "".join(f"<td class='center math'><b>{Q[i]['ans'].split('&nbsp;')[0]}</b></td>" for i in range(10)) + "</tr><tr>" + "".join(f"<th class='center'>{i+1}</th>" for i in range(10, 20)) + "</tr><tr>" + "".join(f"<td class='center math'><b>{Q[i]['ans']}</b></td>" for i in range(10, 20)) + "</tr></table>"
key = page("NC Check-In Review — Answer Key", cover(True) + key_summary + questions(True))

footer = lambda label: f'<div style="width:100%;font-family:Inter;font-size:8px;color:#55607a;padding:0 0.6in;display:flex;justify-content:space-between"><span>Mr. Allen\'s 8th Grade Math • {label}</span><span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span></div>'

with sync_playwright() as p:
    b = p.chromium.launch()
    for name, htmlsrc, label in [("NC_CheckIn_Review_Student.pdf", student, "NC Check-In Review"), ("NC_CheckIn_Review_Answer_Key.pdf", key, "NC Check-In Review — Answer Key")]:
        hp = os.path.join("/tmp", name.replace(".pdf", ".html"))
        open(hp, "w").write(htmlsrc)
        pg = b.new_page()
        pg.goto("file://" + hp); pg.wait_for_timeout(400)
        pg.pdf(path=os.path.join(OUT_STUDENT if "Student" in name else OUT_KEY, name.replace("NC_CheckIn_Review_Student","NC_CheckIn_Benchmark_Review")), format="Letter", print_background=True, display_header_footer=True,
               header_template="<div></div>", footer_template=footer(label), prefer_css_page_size=True)
    b.close()
print("done")
