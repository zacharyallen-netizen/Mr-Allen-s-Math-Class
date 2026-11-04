"""Version 2 anchor charts (scaffolded, color-coded), one sheet front + back per unit.

Color code used on every chart (printed in the legend strip):
  blue  = KNOW IT (words + pictures)      green = STEPS (do these in order)
  gold  = EXAMPLE (watch it done)         red   = WATCH OUT (common mistakes)
Inside steps, each step number has its own color, and the worked example uses the same color for that step.

Run:  sh _build/materials/get_fonts.sh && OUT_DIR=/home/claude/outputs python3 _build/materials/anchor_v2.py [unit ...]
"""
import sys, os
sys.path.insert(0, os.path.dirname(__file__))
import kit
from kit import fr, sup, neg, grid, shape, combine, mapping, vtable, M
from fractions import Fraction as F

kit.CSS += """
.v2{font-size:11pt;line-height:1.38}
.hd{display:flex;border-radius:10px;overflow:hidden;margin:0 0 6px}
.hd .t{flex:1;background:var(--navy);color:#fff;padding:7px 14px 7px}
.hd .k{font:700 7.5pt var(--sans);letter-spacing:.13em;text-transform:uppercase;color:var(--gold)}
.hd h1{color:#fff;font-size:19pt;line-height:1.1;margin-top:1px}
.hd .s{font-size:8.5pt;color:#C9D1E3;margin-top:1px}
.hd .v{background:var(--gold);color:var(--navy);font:800 10pt/1.1 var(--sans);padding:0 12px;display:flex;align-items:center;text-align:center}
.legend{display:flex;gap:6px;margin:0 0 7px;font:600 7.6pt var(--sans);color:#3b4252}
.legend span{display:flex;align-items:center;gap:4px;border-radius:999px;padding:2px 8px 2px 3px;background:#F4F5F7}
.legend i{width:12px;height:12px;border-radius:50%;display:inline-block}
.sec{--c:#1D4ED8;--bg:#F3F7FF;border:1.6px solid var(--c);border-radius:10px;margin:0 0 7px;overflow:hidden;break-inside:avoid;background:var(--bg)}
.sec.steps{--c:#15803D;--bg:#F1FAF4}.sec.exm{--c:#9A6B00;--bg:#FFFAEB}.sec.warn{--c:#B42318;--bg:#FEF3F2}
.sec>.st{background:var(--c);color:#fff;padding:3px 10px;font:600 12pt var(--serif);display:flex;align-items:center;gap:8px}
.sec>.st .n{background:#fff;color:var(--c);width:20px;height:20px;border-radius:50%;font:800 10.5pt/20px var(--sans);text-align:center;flex:none}
.sec>.st .tag{margin-left:auto;font:800 7pt var(--sans);letter-spacing:.12em;background:rgba(255,255,255,.22);padding:2px 8px;border-radius:999px}
.sec>.sb{padding:6px 10px 7px}
.card{background:#fff;border:1px solid #DDE1E8;border-radius:8px;padding:5px 9px}
.row{display:flex;gap:8px;align-items:stretch}.row>*{flex:1;min-width:0}
.stp{display:flex;gap:7px;align-items:flex-start;margin:3px 0}
.pill{width:21px;height:21px;border-radius:50%;color:#fff;font:800 10.5pt/21px var(--sans);text-align:center;flex:none;display:inline-block}
.p1{background:#2563EB}.p2{background:#7C3AED}.p3{background:#EA580C}.p4{background:#0D9488}.p5{background:#DB2777}
.c1{color:#2563EB;font-weight:700}.c2{color:#7C3AED;font-weight:700}.c3{color:#EA580C;font-weight:700}.c4{color:#0D9488;font-weight:700}.c5{color:#DB2777;font-weight:700}
.hl1{background:#DBEAFE;border-radius:4px;padding:0 3px}.hl2{background:#EDE9FE;border-radius:4px;padding:0 3px}.hl3{background:#FFEDD5;border-radius:4px;padding:0 3px}.hl4{background:#CCFBF1;border-radius:4px;padding:0 3px}
.m{font-family:var(--serif);font-weight:600;color:var(--navy)}
.big{font-size:1.22em}
.badge{display:inline-block;border-radius:999px;color:#fff;font:800 8pt var(--sans);padding:2px 9px;letter-spacing:.04em}
.yes{background:#15803D}.no{background:#B42318}.pur{background:#7C3AED}.blu{background:#2563EB}
.say{background:#fff;border:1.5px dashed #9AA3B5;border-radius:8px;padding:4px 9px;font-size:9.6pt}
.say b{color:var(--navy)}
.ask{list-style:none;padding:0;margin:2px 0}
.ask li{padding-left:20px;position:relative;margin:2px 0}
.ask li:before{content:"";position:absolute;left:2px;top:3px;width:11px;height:11px;border:1.6px solid var(--navy);border-radius:3px}
table.sv{border-collapse:collapse;font:600 11pt var(--serif);color:var(--navy)}
table.sv td{padding:1px 4px;white-space:nowrap}
table.sv td.l{text-align:right}table.sv td.o{text-align:center;padding:1px 2px}table.sv td.r{text-align:left}
table.sv td.nt{font:500 8.6pt var(--sans);color:#4B5563;padding-left:10px;white-space:normal;min-width:120px}
table.sv tr.u td.l,table.sv tr.u td.o,table.sv tr.u td.r{border-bottom:1.5px solid var(--navy)}
table.d{border-collapse:collapse;width:100%;font-size:9.8pt;background:#fff}
table.d th{background:var(--navy);color:#fff;font:600 8.6pt var(--sans);text-align:left;padding:3px 6px}
table.d td{border-bottom:1px solid #E3E5EA;padding:3px 6px;vertical-align:middle}
.ld{font:600 11.5pt var(--mono);border-collapse:collapse;color:var(--navy)}
.ld td{width:12px;height:16px;text-align:center;padding:0}
.ld td.dt{width:5px}.ld .q{color:#15803D}.ld .top{border-top:1.6px solid var(--navy)}.ld .lft{border-left:1.6px solid var(--navy)}.ld .ul{border-bottom:1.3px solid #6B7280}
.ld .sub{color:#7C3AED}.ld .z{color:#B42318}
.x{color:#B42318;font-weight:800}.ok{color:#15803D;font-weight:800}
.tiny{font-size:8.4pt;color:#4B5563}
.ctr{text-align:center}
"""

LEG = ('<div class="legend"><span><i style="background:#1D4ED8"></i>Blue = KNOW IT</span><span><i style="background:#15803D"></i>Green = STEPS</span>'
       '<span><i style="background:#9A6B00"></i>Gold = EXAMPLE</span><span><i style="background:#B42318"></i>Red = WATCH OUT</span>'
       '<span style="background:none">Step colors: <b class="c1">1</b> <b class="c2">2</b> <b class="c3">3</b> <b class="c4">4</b></span></div>')
TAG = {"know": "KNOW IT", "steps": "STEPS", "ex": "EXAMPLE", "warn": "WATCH OUT"}

def head(unit, title, std, side):
    return (f'<div class="hd"><div class="t"><div class="k">{unit} • {side} • Anchor Chart</div><h1>{title}</h1><div class="s">{std}</div></div>'
            f'<div class="v">Version<br>2</div></div>' + LEG)

def sec(kind, n, title, body, style=""):
    return f'<div class="sec {"exm" if kind == "ex" else kind}" style="{style}"><div class="st"><span class="n">{n}</span>{title}<span class="tag">{TAG[kind]}</span></div><div class="sb">{body}</div></div>'

def stp(i, text): return f'<div class="stp"><span class="pill p{i}">{i}</span><div>{text}</div></div>'
def steps(*items): return "".join(stp(i + 1, t) for i, t in enumerate(items))
def c(i, t): return f'<span class="c{i}">{t}</span>'
def hl(i, t): return f'<span class="hl{i}">{t}</span>'
def ask(*qs): return '<ul class="ask">' + "".join(f"<li>{q}</li>" for q in qs) + "</ul>"
def rt(n): return f'√<span class="rad">{n}</span>'
def rep(d, whole="0"): return f'{whole}.<span class="bar">{d}</span>'

def solve(rows):
    """rows: (left, op, right, note, underline) — equation work lined up on the = sign."""
    out = ['<table class="sv">']
    for r in rows:
        l, o, rr = r[0], r[1], r[2]; nt = r[3] if len(r) > 3 else ""; u = len(r) > 4 and r[4]
        out.append(f'<tr class="{"u" if u else ""}"><td class="l">{l}</td><td class="o">{o}</td><td class="r">{rr}</td><td class="nt">{nt}</td></tr>')
    return "".join(out) + "</table>"

def longdiv(n, d, places):
    """Long division n ÷ d shown to `places` decimal places, computed (not typed). Digits line up by place value."""
    D = str(n) + "." + "0" * places
    dot = D.index("."); L = len(D)
    dc = [i for i in range(L) if i != dot]          # column of each digit (the point has its own column)
    q = [""] * L; q[dot] = "."
    rows = []; r = 0; started = False
    def put(num, k, cls):                           # number ending at digit k
        s = str(num); return {dc[k - len(s) + 1 + j]: (ch, cls) for j, ch in enumerate(s)}, dc[k - len(s) + 1]
    for k, i in enumerate(dc):
        cur = r * 10 + int(D[i]); qq = cur // d; q[i] = str(qq)
        if qq or started:
            if started: rows.append((put(cur, k, "")[0], False))
            row, first = put(qq * d, k, "sub"); row[first - 1] = ("−", "sub"); rows.append((row, True))
            started = True
        r = cur - qq * d
    rows.append(({dc[-1]: (str(r), "z")}, False))
    for i in range(dot - 1):                        # no leading zeros before the point (keep one)
        if q[i] == "0": q[i] = ""
        else: break
    pre = len(str(d)) + 1
    html = ['<table class="ld">', "<tr>" + "<td></td>" * (pre + 1) + "".join(f'<td class="q{" dt" if i == dot else ""}">{ch}</td>' for i, ch in enumerate(q)) + "</tr>",
            "<tr>" + "".join(f"<td>{ch}</td>" for ch in str(d)) + '<td></td><td class="lft top"></td>' + "".join(f'<td class="top{" dt" if i == dot else ""}">{ch}</td>' for i, ch in enumerate(D)) + "</tr>"]
    for row, ul in rows:
        cells = ["<td></td>"] * pre
        cols = [i for i, (ch, _) in row.items() if ch != "−"]
        for i in range(-1, L):
            ch, cl = row.get(i, ("", ""))
            cls = (cl + (" ul" if ul and min(cols) <= i <= max(cols) else "") + (" dt" if i == dot else "")).strip()
            cells.append(f'<td class="{cls}">{ch}</td>')
        html.append("<tr>" + "".join(cells) + "</tr>")
    html.append("</table>")
    return "".join(html), "".join(q).strip()

# ───────────────────────────── UNIT 1 ─────────────────────────────
def nested():
    def box(label, col, bg, inner, ex):
        return (f'<div style="border:2px solid {col};background:{bg};border-radius:8px;padding:3px 6px 5px">'
                f'<div style="font:800 8pt var(--sans);color:{col};letter-spacing:.06em">{label} <span class="m" style="font-weight:500;color:#334">{ex}</span></div>{inner}</div>')
    nat = box("NATURAL", "#0D9488", "#CCFBF1", "", "1, 2, 3 …")
    who = box("WHOLE", "#EA580C", "#FFEDD5", nat, "0")
    ints = box("INTEGERS", "#7C3AED", "#EDE9FE", who, f"{M}3, {M}2, {M}1")
    rat = box("RATIONAL", "#2563EB", "#DBEAFE", ints, f"{fr(1,2)} {M}0.5 {rep('3')}")
    irr = (f'<div style="border:2px solid #B42318;background:#FEE4E2;border-radius:8px;padding:3px 6px;width:30%">'
           f'<div style="font:800 8pt var(--sans);color:#B42318;letter-spacing:.06em">IRRATIONAL</div><div class="m">π<br>{rt(2)}<br>{rt(10)}<br>0.1010010001…</div></div>')
    return (f'<div style="border:2.4px solid var(--navy);border-radius:10px;padding:4px 6px 6px;background:#fff">'
            f'<div style="font:800 8.5pt var(--sans);color:var(--navy);letter-spacing:.08em">REAL NUMBERS</div>'
            f'<div style="display:flex;gap:6px"><div style="flex:1">{rat}</div>{irr}</div></div>')

def u1():
    ex34, q34 = longdiv(3, 4, 2); assert q34 == "0.75" and F(3, 4) == F(75, 100)
    ex58, q58 = longdiv(5, 8, 3); assert q58 == "0.625"
    front = head("Unit 1", "The Real Number System", "NC.8.NS.1 • NC.8.NS.2 • NC.8.EE.2", "Front")
    front += sec("know", 1, "Real Numbers: One Big Family", f'''
<div class="row"><div style="flex:1.25">{nested()}</div><div>
<table class="d"><tr><th>Word</th><th>Means</th></tr>
<tr><td><b>Natural</b></td><td>counting numbers 1, 2, 3 …</td></tr>
<tr><td><b>Whole</b></td><td>add 0</td></tr>
<tr><td><b>Integers</b></td><td>add the negatives</td></tr>
<tr><td><b>Rational</b></td><td>can be a <b>fraction</b>. Decimal <b>stops</b> or <b>repeats</b>.</td></tr>
<tr><td><b>Irrational</b></td><td><b>can't</b> be a fraction. Decimal <b>never stops</b> and <b>never repeats</b>.</td></tr></table>
</div></div>''')
    front += sec("steps", 2, "Rational or Irrational? Ask 3 Questions", f'''
<div class="row"><div>
{stp(1, f"Is it a {hl(1,'fraction')}, integer, or decimal that {hl(1,'stops')}? → <span class='badge yes'>RATIONAL</span>")}
{stp(2, f"Does the decimal {hl(2,'repeat')}? (0.333…) → <span class='badge yes'>RATIONAL</span>")}
{stp(3, f"Square root? Is the number a {hl(3,'perfect square')}? <br>Yes → <span class='badge yes'>RATIONAL</span> &nbsp;No → <span class='badge no'>IRRATIONAL</span>")}
<div class="tiny" style="margin-top:3px"><b>π</b> is always <span class="badge no">IRRATIONAL</span></div>
</div><div>
<table class="d"><tr><th>Number</th><th>Decimal</th><th>Type</th></tr>
<tr><td class="m">{fr(3,4)}</td><td class="m">0.75 <span class="tiny">stops</span></td><td><span class="badge yes">RATIONAL</span></td></tr>
<tr><td class="m">{fr(1,3)}</td><td class="m">0.333… <span class="tiny">repeats</span></td><td><span class="badge yes">RATIONAL</span></td></tr>
<tr><td class="m">{rt(49)}</td><td class="m">7 <span class="tiny">7 × 7 = 49</span></td><td><span class="badge yes">RATIONAL</span></td></tr>
<tr><td class="m">{rt(10)}</td><td class="m">3.1622… <span class="tiny">never stops</span></td><td><span class="badge no">IRRATIONAL</span></td></tr>
<tr><td class="m">π</td><td class="m">3.14159…</td><td><span class="badge no">IRRATIONAL</span></td></tr></table>
</div></div>''')
    front += sec("steps", 3, "Fraction → Decimal: Divide Top ÷ Bottom", f'''
<div class="row"><div style="flex:1.1">
{steps(f"The {c(1,'top')} number goes {c(1,'inside')} the house.", f"Add a {c(2,'decimal point')} and some {c(2,'zeros')}.", f"{c(3,'Divide.')} Bring the decimal point straight up.", f"Stop when the {c(4,'remainder is 0')}, or when the digits start to {c(4,'repeat')}.")}
</div><div class="card ctr"><div class="tiny"><b>Example:</b> <span class="m">{fr(3,4)}</span> → 3 ÷ 4</div><div style="display:flex;justify-content:center">{ex34}</div>
<div class="m">{fr(3,4)} = <span style="color:#15803D">0.75</span></div><div class="tiny">Remainder <span style="color:#B42318;font-weight:800">0</span> → stop.</div></div>
<div class="card ctr"><div class="tiny"><b>Repeats:</b> <span class="m">{fr(1,3)}</span> → 1 ÷ 3</div>
<div class="m big" style="margin:6px 0">0.3333…</div><div class="tiny">The 3 keeps coming back.<br>Draw a <b>bar</b> over the part that repeats:</div><div class="m big">{rep('3')}</div></div>
</div>''')
    front += sec("warn", 4, "Watch Out!", f'''
<div class="row"><div class="card"><b>Bar only over the repeating part.</b><br><span class="m">0.1666… = 0.1<span class="bar">6</span></span> <span class="ok">✓</span> &nbsp;<span class="m">0.<span class="bar">16</span></span> <span class="x">✗</span></div>
<div class="card"><b>A square root is not half.</b><br><span class="m">{rt(36)} = 6</span> <span class="ok">✓</span> &nbsp; <span class="m">{rt(36)} = 18</span> <span class="x">✗</span></div>
<div class="card"><b>Long decimal ≠ irrational.</b><br><span class="m">0.142857142857…</span> repeats, so it is <b>rational</b>.</div></div>''')

    back = head("Unit 1", "Square Roots and the 9's Rule", "NC.8.NS.1 • NC.8.NS.2 • NC.8.EE.2", "Back")
    ex = [("7", "7", "9", "7/9", "already simplest"), ("36", "36", "99", "4/11", "÷ 9"), ("123", "123", "999", "41/333", "÷ 3")]
    for d, top, bot, simp, how in ex:
        assert F(int(top), int(bot)) == F(simp)
    rows = "".join(f'<tr><td class="m big">{rep(d)}</td><td class="m big">{fr(c(1, top), c(2, bot))}</td><td class="m big">{c(3, fr(*simp.split("/")))}</td><td class="tiny">{how}</td></tr>' for d, top, bot, simp, how in ex)
    assert 2 + F(3, 9) == F(7, 3)
    back += sec("steps", 5, "Repeating Decimal → Fraction: The 9's Rule", f'''
<div class="row"><div>
{steps(f"{c(1,'Top:')} write the digits that {c(1,'repeat')}.", f"{c(2,'Bottom:')} write one {c(2,'9')} for each repeating digit.", f"{c(3,'Simplify.')} Divide top and bottom by the same number.", f"Whole number in front? {c(4,'Keep it')} in front.")}
<div class="say" style="margin-top:4px"><b>Count the digits under the bar.</b> 1 digit → 9. 2 digits → 99. 3 digits → 999.</div>
</div><div>
<table class="d"><tr><th>Decimal</th><th>{c(1,"Top")} / {c(2,"9s")}</th><th>{c(3,"Simplify")}</th><th></th></tr>{rows}
<tr><td class="m big">{rep("3", "2")}</td><td class="m big">{c(4,"2")} {fr(c(1,"3"), c(2,"9"))}</td><td class="m big">{c(4,"2")} {c(3, fr(1,3))}</td><td class="tiny">keep the 2</td></tr></table>
</div></div>''')
    sq = "".join(f'<td class="m" style="text-align:center"><span class="tiny">{n}²</span><br>{n*n}</td>' for n in range(1, 16))
    pic = ('<svg viewBox="0 0 92 92" width="92" height="92">' + "".join(f'<rect x="{4+i*12}" y="{4+j*12}" width="12" height="12" fill="#DBEAFE" stroke="#2563EB" stroke-width=".8"/>' for i in range(7) for j in range(7))
           + '</svg>')
    back += sec("know", 6, "Squares and Square Roots Undo Each Other", f'''
<div class="row" style="align-items:center"><div style="flex:.55" class="ctr">{pic}<div class="tiny">side = <b>7</b> &nbsp; area = <b>49</b></div></div>
<div><div><b>Square</b> a number: times itself. <span class="m">7² = 7 × 7 = 49</span></div>
<div><b>Square root</b> (√): what number was squared? <span class="m">{rt(49)} = 7</span></div>
<div class="say" style="margin-top:4px"><b>Think:</b> square = area. &nbsp;Square root = side.</div></div>
<div class="card"><b>Solve</b> <span class="m">x² = 81</span><br><span class="m">x = 9</span> or <span class="m">x = {M}9</span><br><span class="tiny">Both work: 9 × 9 = 81 and ({M}9)({M}9) = 81. Write <span class="m">x = ±9</span>.</span></div></div>
<table class="d" style="margin-top:5px"><tr><th colspan="15">Perfect squares — know these!</th></tr><tr>{sq}</tr></table>''')
    # number line 7..8 in tenths
    W = 330; X = lambda v: 40 + (v - 7) * (W - 80)
    nl = [f'<svg viewBox="0 0 {W} 46" width="{W}" height="46" font-family="Inter">', f'<line x1="8" y1="18" x2="{W-8}" y2="18" stroke="#1E2D4F" stroke-width="1.4"/>']
    for k in range(11):
        v = 7 + k / 10; big = k in (0, 10)
        nl.append(f'<line x1="{X(v)}" y1="{12 if big else 14}" x2="{X(v)}" y2="{24 if big else 22}" stroke="#1E2D4F" stroke-width="{1.6 if big else 1}"/>')
        if big: nl.append(f'<text x="{X(v)}" y="37" font-size="10" font-weight="700" text-anchor="middle" fill="#1E2D4F">{"√49 = 7" if k == 0 else "√64 = 8"}</text>')
    nl.append(f'<circle cx="{X(7.1)}" cy="18" r="5" fill="#EA580C"/><text x="{X(7.1)+2}" y="8" font-size="9.5" font-weight="800" fill="#EA580C">√50 ≈ 7.1</text></svg>')
    back += sec("steps", 7, "Estimate a Square Root", f'''
<div class="row"><div>
<div class="tiny"><b>Example:</b> estimate <span class="m">{rt(50)}</span></div>
{steps(f"Find the {c(1,'perfect squares')} just below and above: {c(1,'49 &lt; 50 &lt; 64')}", f"Take their {c(2,'square roots')}: {c(2,'7 and 8')}", f"Which is {c(3,'closer')}? 50 is very close to 49 → just past 7.", f"Mark it on the {c(4,'number line')}: {c(4,'√50 ≈ 7.1')}")}
</div><div class="card ctr" style="flex:1.05">{"".join(nl)}
<div class="say" style="text-align:left;margin-top:4px"><b>Check:</b> 7.1 × 7.1 = 50.41. That is close to 50 <span class="ok">✓</span><br><b>Pi:</b> π ≈ 3.14</div></div></div>''')
    assert round(7.1 * 7.1, 2) == 50.41
    back += sec("warn", 8, "Watch Out!", f'''
<div class="row"><div class="card"><b>The 9's rule needs a repeating decimal.</b> 0.36 (stops) = <span class="m">{fr(36,100)}</span>, not <span class="m">{fr(36,99)}</span>.</div>
<div class="card"><b>x² = 25 has 2 answers:</b> <span class="m">x = 5</span> and <span class="m">x = {M}5</span>.</div>
<div class="card"><b>{rt(20)} is not a whole number.</b> 16 &lt; 20 &lt; 25, so it is between 4 and 5.</div></div>''')
    return [front, back]

# ───────────────────────────── UNIT 2 ─────────────────────────────
def P(b, e): return f"{b}{sup(e)}"
def sn(a, e): return f"{a} × 10{sup(e)}"

def u2():
    assert 3**2 * 3**4 == 3**6 and 7**5 // 7**3 == 49 and (2**3)**2 == 64 and F(2, 3)**3 == F(8, 27) and F(4)**-2 == F(1, 16)
    assert (3**2)**4 * F(3)**-5 == 27
    front = head("Unit 2", "Exponent Rules", "NC.8.EE.1 • Properties of integer exponents", "Front")
    pat = "".join(f'<td class="m big ctr">{P(2, e)}<br><span style="color:#2563EB">{v}</span></td>' for e, v in
                  [(3, "8"), (2, "4"), (1, "2"), (0, "<b>1</b>"), (-1, fr(1, 2)), (-2, fr(1, 4))])
    front += sec("know", 1, "Base and Exponent", f'''
<div class="row" style="align-items:center"><div class="card ctr" style="flex:.8">
<div class="m" style="font-size:26pt;line-height:1">{c(1,"5")}<sup style="font-size:15pt;top:-.9em">{c(3,"3")}</sup> = 5 × 5 × 5 = 125</div>
<div class="tiny"><span class="c1">5 = base</span>: the number you multiply. &nbsp;<span class="c3">3 = exponent</span>: how many times.</div>
<div class="tiny">Say it: “5 to the 3rd power” or “5 cubed.”</div></div>
<div><div class="tiny" style="margin-bottom:2px"><b>See the pattern.</b> Each step to the right, <b>divide by 2</b>:</div>
<table class="d"><tr>{pat}</tr></table>
<div class="say" style="margin-top:4px">Anything to the <b>0</b> power = <b>1</b>. &nbsp;A <b>negative</b> exponent means <b>flip it</b> into a fraction.</div></div></div>''')
    R = [("Product", f"{P('a','m')} · {P('a','n')}", f"Multiply same base → {hl(1,'ADD')} exponents", f"{P(3,2)} · {P(3,4)} = {P(3,6)}", f"{P('x',2)} · {P('x',5)} = {P('x',7)}"),
         ("Quotient", fr(P('a','m'), P('a','n')), f"Divide same base → {hl(2,'SUBTRACT')} exponents", f"{fr(P(7,5), P(7,3))} = {P(7,2)} = 49", f"{fr(P('y',8), P('y',3))} = {P('y',5)}"),
         ("Power of a power", f"({P('a','m')}){sup('n')}", f"{hl(3,'MULTIPLY')} exponents", f"({P(2,3)}){sup(2)} = {P(2,6)} = 64", f"({P('m',4)}){sup(3)} = {P('m',12)}"),
         ("Power of a product", f"(ab){sup('n')}", f"Give the exponent to {hl(4,'EACH')} factor", f"(2 · 5){sup(3)} = {P(2,3)} · {P(5,3)}", f"(2{P('x',3)}){sup(2)} = 4{P('x',6)}"),
         ("Power of a quotient", f"({fr('a','b')}){sup('n')}", f"Exponent to {hl(4,'top AND bottom')}", f"({fr(2,3)}){sup(3)} = {fr(8,27)}", f"({fr('x',3)}){sup(2)} = {fr(P('x',2),9)}"),
         ("Zero exponent", P('a', 0), f"Always {hl(1,'1')}", f"{P(9,0)} = 1", f"5{P('x',0)} = 5 · 1 = 5"),
         ("Negative exponent", P('a', '-n'), f"{hl(2,'FLIP')} it. The exponent turns positive.", f"{P(4,-2)} = {fr(1, P(4,2))} = {fr(1,16)}", f"{P('x',-3)} = {fr(1, P('x',3))}")]
    rows = "".join(f'<tr><td><b>{a}</b></td><td class="m">{b}</td><td>{cc}</td><td class="m">{d}</td><td class="m">{e}</td></tr>' for a, b, cc, d, e in R)
    front += sec("know", 2, "The 7 Exponent Rules", f'''<table class="d"><tr><th>Rule</th><th>Pattern</th><th>What to do</th><th>Numbers</th><th>Variables</th></tr>{rows}</table>
<div class="tiny" style="margin-top:3px"><b>Numbers in front (coefficients):</b> work them like normal. Use the rules only on the exponents.</div>''')
    front += sec("ex", 3, "Put It Together", f'''
<div class="row"><div class="card">{solve([(f"({P(3,2)}){sup(4)} · {P(3,-5)}", "", "", ""),
    ("", "=", f"{c(1, P(3,8))} · {P(3,-5)}", f"{c(1,'1')} Power of a power: 2 × 4 = 8"),
    ("", "=", c(2, P(3,3)), f"{c(2,'2')} Same base: add 8 + ({M}5) = 3"),
    ("", "=", c(3, "27"), f"{c(3,'3')} Evaluate: 3 × 3 × 3")])}</div>
<div class="card">{solve([(f"(2{P('x',3)}){sup(2)} · {P('x',-4)}", "", "", ""),
    ("", "=", f"{c(1, '4' + P('x',6))} · {P('x',-4)}", f"{c(1,'1')} Power of a product"),
    ("", "=", c(2, '4' + P('x',2)), f"{c(2,'2')} Same base: add 6 + ({M}4) = 2"),
    ("", "", "", f"{c(3,'3')} No negative exponents left. Done!")])}</div></div>''')
    front += sec("warn", 4, "Watch Out!", f'''<div class="row">
<div class="card"><span class="m">{P(2,3)} · {P(2,4)} = {P(2,7)}</span> <span class="ok">✓</span><br><span class="m">{P(4,7)}</span> <span class="x">✗</span> Keep the base.</div>
<div class="card"><span class="m">{P(5,2)} = 25</span> <span class="ok">✓</span><br><span class="m">10</span> <span class="x">✗</span> It is 5 × 5, not 5 × 2.</div>
<div class="card"><span class="m">{P(4,-2)} = {fr(1,16)}</span> <span class="ok">✓</span><br><span class="m">{M}16</span> <span class="x">✗</span> Flip, don't make it negative.</div>
<div class="card"><span class="m">({M}2){sup(4)} = 16</span><br><span class="m">{M}{P(2,4)} = {M}16</span><br><span class="tiny">No ( )? The minus is not in the base.</span></div></div>''')

    assert F(45_000_000) == F(45, 10) * 10**7 and F(62, 100000) == F(62, 10) * F(10)**-4
    assert F(308, 100) * 10**5 == 308000 and F(71, 10) * F(10)**-3 == F(71, 10000)
    assert F(25, 10) * 3 == F(75, 10) and F(84, 10) / 2 == F(42, 10) and F(2 * 10**5) / F(2, 100) == 10**7
    back = head("Unit 2", "Scientific Notation", "NC.8.EE.3 • NC.8.EE.4", "Back")
    pv = "".join(f'<td class="m ctr">10{sup(e)}<br><span class="tiny">{v}</span></td>' for e, v in [(3, "1,000"), (2, "100"), (1, "10"), (0, "1"), (-1, "0.1"), (-2, "0.01"), (-3, "0.001")])
    back += sec("know", 5, "What Is Scientific Notation?", f'''
<div class="row" style="align-items:center"><div class="card ctr" style="flex:.85"><div class="m" style="font-size:20pt">{c(1,"a")} × 10{sup(c(3,"n"))}</div>
<div class="tiny"><span class="c1">a</span> is <b>at least 1</b> and <b>less than 10</b>. &nbsp;<span class="c3">n</span> is an integer.</div>
<div class="tiny">Calculator: <b>3.2E5</b> means 3.2 × 10{sup(5)}</div></div>
<div><div><span class="badge yes">YES</span> <span class="m">{sn("3.2",5)}</span> &nbsp; <span class="m">{sn("7",-3)}</span></div>
<div style="margin-top:3px"><span class="badge no">NO</span> <span class="m">{sn("32",4)}</span> <span class="tiny">32 is too big</span></div>
<div style="margin-top:3px"><span class="badge no">NO</span> <span class="m">{sn("0.32",6)}</span> <span class="tiny">0.32 is too small</span></div>
<table class="d" style="margin-top:4px"><tr>{pv}</tr></table></div></div>''')
    back += sec("steps", 6, "Change the Form", f'''
<div class="row"><div><b>Standard → Scientific</b>
{steps(f"Put the decimal point {c(1,'after the first digit')} that is not 0.", f"{c(2,'Count')} how many places it moved.", f"Big number (10 or more)? Exponent is {c(3,'positive')}. Less than 1? Exponent is {c(4,'negative')}.")}
<div class="card m" style="margin-top:3px">45,000,000 → 4.5 × 10{sup(c(3,7))} <span class="tiny">moved {c(2,"7")} places</span><br>0.00062 → 6.2 × 10{sup(c(4,"-4"))} <span class="tiny">moved {c(2,"4")} places</span></div></div>
<div><b>Scientific → Standard</b>
{stp(1, f"{c(1,'Positive')} exponent → move the decimal {c(1,'right')}. The number gets bigger.")}
{stp(2, f"{c(2,'Negative')} exponent → move the decimal {c(2,'left')}. The number gets smaller.")}
{stp(3, f"Fill empty places with {c(3,'zeros')}.")}
<div class="card m" style="margin-top:3px">3.08 × 10{sup(5)} → right 5 → {c(1,"308,000")}<br>7.1 × 10{sup(-3)} → left 3 → {c(2,"0.0071")}</div></div></div>''')
    back += sec("steps", 7, "Multiply and Divide", f'''
<div class="row"><div class="card"><b>Multiply</b> <span class="m">(2.5 × 10{sup(3)})(3 × 10{sup(4)})</span>
{steps(f"{c(1,'Multiply')} the front numbers: 2.5 × 3 = {c(1,'7.5')}", f"{c(2,'ADD')} the exponents: 3 + 4 = {c(2,'7')}", f"Is the front number from 1 to 10? {c(3,'Yes')} ✓")}
<div class="m ctr big">= {c(1,"7.5")} × 10{sup(c(2,7))}</div></div>
<div class="card"><b>Divide</b> <span class="m">{fr(f"8.4 × 10{sup(6)}", f"2 × 10{sup(2)}")}</span>
{steps(f"{c(1,'Divide')} the front numbers: 8.4 ÷ 2 = {c(1,'4.2')}", f"{c(2,'SUBTRACT')} the exponents: 6 {M} 2 = {c(2,'4')}", f"Is the front number from 1 to 10? {c(3,'Yes')} ✓")}
<div class="m ctr big">= {c(1,"4.2")} × 10{sup(c(2,4))}</div></div></div>
<div class="say" style="margin-top:5px"><b>Fix it:</b> <span class="m">12 × 10{sup(7)}</span> → 12 is too big. Move the decimal left 1, exponent goes up 1 → <span class="m">1.2 × 10{sup(8)}</span></div>''')
    back += sec("ex", 8, "Compare: How Many Times as Much?", f'''
<div class="row"><div>
{steps(f"Bigger {c(1,'exponent')} → bigger number. &nbsp;<span class='m'>2 × 10{sup(8)} &gt; 9 × 10{sup(7)}</span>", f"Same exponent? Compare the {c(2,'front numbers')}. &nbsp;<span class='m'>6 × 10{sup(-3)} &gt; 2 × 10{sup(-3)}</span>")}
<div class="say" style="margin-top:3px"><b>Clue words:</b> “how many times as much” → <b>divide</b>. &nbsp;“total,” “in all” → <b>multiply</b>.</div></div>
<div class="card">A whale weighs <span class="m">2 × 10{sup(5)}</span> kg. A mouse weighs <span class="m">2 × 10{sup(-2)}</span> kg. How many times as heavy is the whale?
<div class="m" style="margin-top:3px">{fr(f"2 × 10{sup(5)}", f"2 × 10{sup(-2)}")} = 1 × 10{sup(f"5 {M} ({M}2)")} = 10{sup(7)}</div>
<div class="tiny">The whale is <b>10,000,000 times</b> as heavy.</div></div></div>''')
    return [front, back]

# ───────────────────────────── UNIT 3 ─────────────────────────────
def u3():
    x = -3; assert -2*x + 1 == 8*(x + 2) - 5*x == 7
    front = head("Unit 3", "Solving Equations", "NC.8.EE.7 • Equations in one variable", "Front")
    inv = [("Adding?", "Subtract", "x + 5 = 12", [("x + 5", "=", "12"), (f"{c(1,M+'5')}", "", c(1, M + "5"), "", True), ("x", "=", "7")]),
           ("Subtracting?", "Add", f"x {M} 3 = 8", [(f"x {M} 3", "=", "8"), (c(1, "+3"), "", c(1, "+3"), "", True), ("x", "=", "11")]),
           ("Multiplying?", "Divide", "3x = 15", [("3x", "=", "15"), (c(1, "÷3"), "", c(1, "÷3"), "", True), ("x", "=", "5")]),
           ("Dividing?", "Multiply", f"{fr('x',4)} = 2", [(fr('x', 4), "=", "2"), (c(1, "×4"), "", c(1, "×4"), "", True), ("x", "=", "8")]),
           ("A fraction?", "× the flip", f"{fr(2,3)}x = 6", [(f"{fr(2,3)}x", "=", "6"), (c(1, "×" + fr(3, 2)), "", c(1, "×" + fr(3, 2)), "", True), ("x", "=", "9")])]
    assert F(2, 3) * 9 == 6
    cards = "".join(f'<div class="card ctr"><b>{a}</b><br><span class="c1">{b}</span><div style="display:flex;justify-content:center">{solve(r)}</div></div>' for a, b, _, r in inv)
    front += sec("know", 1, "Do the Opposite to BOTH Sides", f'<div class="row">{cards}</div>')
    work = solve([
        (f"{M}2x + 1", "=", f"{c(1,'8(x + 2)')} {M} 5x", "Start"),
        (f"{M}2x + 1", "=", f"{c(1,'8x + 16')} {M} 5x", f"{c(1,'1 Distribute')} the 8"),
        (f"{M}2x + 1", "=", f"{c(2,'3x')} + 16", f"{c(2,'2 Combine')} 8x {M} 5x = 3x"),
        (c(3, "+2x"), "", c(3, "+2x"), f"{c(3,'3 x on both sides?')} Add 2x", True),
        ("1", "=", "5x + 16", ""),
        (c(4, M + "16"), "", c(4, M + "16"), f"{c(4,'4 Undo + 16')}", True),
        (f"{M}15", "=", "5x", ""),
        (c(5, "÷5"), "", c(5, "÷5"), f"{c(5,'5 Undo × 5')}", True),
        (f"{c(5, M + '3')}", "=", "x", "")])
    front += sec("steps", 2, "5 Steps to Solve Any Equation", f'''
<div class="row"><div style="flex:.95">
{steps(f"{c(1,'Parentheses?')} Distribute. Multiply into <b>every</b> term.", f"{c(2,'Like terms')} on the same side? Combine them.", f"{c(3,'x on both sides?')} Move the smaller x-term.", f"{c(4,'Undo + or −')} to both sides.", f"{c(5,'Undo × or ÷')} to both sides.")}
<div class="say" style="margin-top:4px"><b>Check:</b> put your answer back in. Both sides match? Done!<br>
<span class="m">x = {M}3:</span> left <span class="m">{M}2({M}3) + 1 = 7</span>, right <span class="m">8({M}1) + 15 = 7</span> <span class="ok">✓</span></div>
<div class="tiny" style="margin-top:2px">Skip any step that does not fit your problem.</div></div>
<div class="card" style="flex:1.05"><div class="tiny"><b>Watch it done:</b></div>{work}</div></div>''')
    front += sec("warn", 3, "Watch Out!", f'''<div class="row">
<div class="card"><b>Distribute to EVERY term.</b><br><span class="m">3(x {M} 4) = 3x {M} 12</span> <span class="ok">✓</span><br><span class="m">3x {M} 4</span> <span class="x">✗</span></div>
<div class="card"><b>A negative goes in too.</b><br><span class="m">{M}2(x + 5) = {M}2x {M} 10</span> <span class="ok">✓</span><br><span class="m">{M}2x + 10</span> <span class="x">✗</span></div>
<div class="card"><b>The sign stays with its term.</b><br><span class="m">4 {M} 3x</span> means <span class="m">+4</span> and <span class="m">{M}3x</span></div></div>''')
    W = [("+", "sum, more than, plus, increased by", f"7 more than n → n + 7"),
         (M, "difference, less than, minus", f"5 less than x → x {M} 5 <b>(order flips!)</b>"),
         ("×", "product, times, of, twice", "twice a number → 2n"),
         ("÷", "quotient, divided by, split equally", f"n split by 4 → {fr('n',4)}"),
         ("=", "is, equals, the same as", "3 times a number is 18 → 3n = 18")]
    front += sec("know", 4, "Words → Math", '<table class="d"><tr><th></th><th>Clue words</th><th>Example</th></tr>' + "".join(f'<tr><td class="m big ctr">{a}</td><td>{b}</td><td class="m">{cc}</td></tr>' for a, b, cc in W) + "</table>")

    back = head("Unit 3", "Solutions and Inequalities", "NC.8.EE.7 • Equations and inequalities in one variable", "Back")
    one = solve([(f"5x {M} 4", "=", "2x + 8"), (c(1, M + "2x"), "", c(1, M + "2x"), "", True), (f"3x {M} 4", "=", "8"), ("+4", "", "+4", "", True), ("3x", "=", "12"), ("x", "=", c(1, "4"))])
    none = solve([("2(3x + 1)", "=", "6x + 5"), ("6x + 2", "=", "6x + 5"), (c(2, M + "6x"), "", c(2, M + "6x"), "", True), ("2", "=", c(2, "5"))])
    inf = solve([("3(2x + 1)", "=", "6x + 3"), ("6x + 3", "=", "6x + 3"), (c(3, M + "6x"), "", c(3, M + "6x"), "", True), ("3", "=", c(3, "3"))])
    back += sec("know", 5, "How Many Solutions?", f'''<div class="row">
<div class="card ctr"><span class="badge blu">ONE solution</span><div style="display:flex;justify-content:center">{one}</div><div class="tiny">x equals <b>one number</b>.</div></div>
<div class="card ctr"><span class="badge no">NO solution</span><div style="display:flex;justify-content:center">{none}</div><div class="tiny">x's cancel. <b>2 = 5 is FALSE.</b></div></div>
<div class="card ctr"><span class="badge pur">INFINITELY many</span><div style="display:flex;justify-content:center">{inf}</div><div class="tiny">x's cancel. <b>3 = 3 is TRUE.</b></div></div></div>
<div class="say" style="margin-top:4px"><b>Shortcut:</b> simplify each side. Different x-terms → one. Same x-terms, different numbers → none. Both sides the same → infinitely many.</div>''')
    for v in (-4, 0, 5): assert (6 - 2*v <= 14) == (v >= -4)
    nl = kit.numline(-6, 2, -4, True, False, w=250)
    signs = [("&lt;", "less than, fewer than, below", "open ○"), ("&gt;", "more than, greater than, above", "open ○"),
             ("≤", "at most, no more than", "closed ●"), ("≥", "at least, no less than", "closed ●")]
    back += sec("steps", 6, "Inequalities: Solve, Then Graph", f'''
<div class="row"><div>
{steps(f"{c(1,'Solve')} it like an equation.", f"Did you {c(2,'× or ÷ by a NEGATIVE')}? {c(2,'FLIP')} the sign.", f"{c(3,'Graph')} it: open or closed circle, then shade.", f"{c(4,'Check')} a number from the shaded part.")}
<table class="d" style="margin-top:4px"><tr><th>Sign</th><th>Clue words</th><th>Circle</th></tr>{"".join(f'<tr><td class="m big ctr">{a}</td><td>{b}</td><td>{cc}</td></tr>' for a, b, cc in signs)}</table></div>
<div class="card">{solve([(f"6 {M} 2x", "≤", "14", f"{c(1,'1')} Undo 6: subtract 6"), (M + "6", "", M + "6", "", True), (f"{M}2x", "≤", "8", ""),
    (c(2, "÷" + M + "2"), "", c(2, "÷" + M + "2"), f"{c(2,'2 Negative! FLIP ≤ to ≥')}", True), ("x", c(2, "≥"), M + "4", "")])}
<div class="ctr" style="margin-top:3px">{nl}</div><div class="tiny">{c(3,"3")} Closed circle at {M}4 (≥), shade right. &nbsp;{c(4,"4")} Try x = 0: 6 {M} 0 = 6, and 6 ≤ 14 <span class="ok">✓</span></div></div></div>''')
    m = 6; assert 30 + 15*m <= 120 and 30 + 15*(m+1) > 120
    back += sec("ex", 7, "Word Problems in 5 Steps", f'''
<div class="row"><div>
{steps(f"{c(1,'Name')} the variable.", f"{c(2,'Equation or inequality?')} Look for clue words.", f"{c(3,'Write')} it.", f"{c(4,'Solve')} with the 5 steps.")}
{stp(5, f"{c(5,'Answer')} in a sentence. Does it make sense?")}</div>
<div class="card">A gym costs $30 to join plus $15 per month. You can spend <b>at most</b> $120. How many months?
<div class="tiny" style="margin:2px 0">{c(1,"1")} m = number of months &nbsp; {c(2,"2")} “at most” → ≤</div>
{solve([(c(3, "30 + 15m"), c(3, "≤"), c(3, "120"), f"{c(3,'3')} Write it"), (M + "30", "", M + "30", f"{c(4,'4')} Solve", True), ("15m", "≤", "90", ""), ("÷15", "", "÷15", "15 is positive: no flip", True), ("m", "≤", "6", "")])}
<div style="margin-top:2px">{c(5,"5")} <b>You can go for at most 6 months.</b></div></div></div>''')
    return [front, back]
# ───────────────────────────── UNITS 4–5 ─────────────────────────────
import math
BL, OR, PU, TE, NV = "#2563EB", "#EA580C", "#7C3AED", "#0D9488", "#1E2D4F"
def _pt(cx, cy, r, a): return cx + r * math.cos(math.radians(a)), cy - r * math.sin(math.radians(a))
def sector(cx, cy, r, a1, a2, col, op=0.35):
    x1, y1 = _pt(cx, cy, r, a1); x2, y2 = _pt(cx, cy, r, a2); big = 1 if (a2 - a1) % 360 > 180 else 0
    return f'<path d="M{cx},{cy} L{x1:.1f},{y1:.1f} A{r},{r} 0 {big} 0 {x2:.1f},{y2:.1f} Z" fill="{col}" fill-opacity="{op}" stroke="{col}" stroke-width="1.2"/>'
def ray(cx, cy, r, a, w=2): x, y = _pt(cx, cy, r, a); return f'<line x1="{cx}" y1="{cy}" x2="{x:.1f}" y2="{y:.1f}" stroke="{NV}" stroke-width="{w}" stroke-linecap="round"/>'
def lab(cx, cy, r, a, t, col, fs=11): x, y = _pt(cx, cy, r, a); return f'<text x="{x:.1f}" y="{y + 4:.1f}" font-size="{fs}" font-weight="800" text-anchor="middle" fill="{col}" font-family="Inter">{t}</text>'
def svg(w, h, body): return f'<svg viewBox="0 0 {w} {h}" width="{w}" height="{h}" xmlns="http://www.w3.org/2000/svg">{body}</svg>'

def angle_pairs():
    v = svg(120, 70, sector(60, 35, 20, 35, 145, BL) + sector(60, 35, 20, 215, 325, BL) + "".join(ray(60, 35, 46, a) for a in (35, 145, 215, 325)) + lab(60, 35, 13, 90, "a", BL) + lab(60, 35, 13, 270, "b", BL))
    lp = svg(120, 70, sector(60, 55, 20, 0, 60, OR) + sector(60, 55, 22, 60, 180, BL) + ray(60, 55, 55, 0) + ray(60, 55, 55, 180) + ray(60, 55, 50, 60) + lab(60, 55, 30, 28, "b", OR) + lab(60, 55, 30, 120, "a", BL))
    cp = svg(120, 70, sector(30, 60, 26, 0, 35, OR) + sector(30, 60, 28, 35, 90, BL) + f'<rect x="30" y="50" width="10" height="10" fill="none" stroke="{NV}"/>' + ray(30, 60, 80, 0) + ray(30, 60, 55, 90) + ray(30, 60, 70, 35) + lab(30, 60, 38, 15, "b", OR) + lab(30, 60, 38, 62, "a", BL))
    sp = svg(120, 70, sector(25, 58, 18, 0, 120, BL) + ray(25, 58, 30, 0) + ray(25, 58, 30, 120) + lab(25, 58, 26, 60, "a", BL) + sector(80, 58, 18, 0, 60, OR) + ray(80, 58, 34, 0) + ray(80, 58, 34, 60) + lab(80, 58, 26, 30, "b", OR))
    items = [(v, "Vertical", "across the X", "a = b", "EQUAL"), (lp, "Linear pair", "on a straight line", "a + b = 180°", "180"), (cp, "Complementary", "make a right angle", "a + b = 90°", "90"), (sp, "Supplementary", "any two that add to 180", "a + b = 180°", "180")]
    return '<div class="row">' + "".join(f'<div class="card ctr"><div style="display:flex;justify-content:center">{g}</div><b>{n}</b><div class="tiny">{w}</div><div class="m">{r}</div></div>' for g, n, w, r, _ in items) + "</div>"

def transversal():
    W, H = 250, 150; t = 60
    p1 = (135, 45); dy = 60; p2 = (p1[0] - dy / math.tan(math.radians(t)), p1[1] + dy)   # t rises to the right at 60°
    b = [f'<line x1="10" y1="{p1[1]}" x2="{W-10}" y2="{p1[1]}" stroke="{NV}" stroke-width="2"/>', f'<line x1="10" y1="{p2[1]}" x2="{W-10}" y2="{p2[1]}" stroke="{NV}" stroke-width="2"/>']
    x0, y0 = _pt(*p1, 50, t); x1, y1 = _pt(*p2, 50, 240)
    b.append(f'<line x1="{x0:.1f}" y1="{y0:.1f}" x2="{x1:.1f}" y2="{y1:.1f}" stroke="{NV}" stroke-width="2"/>')
    for (cx, cy), base in ((p1, 0), (p2, 4)):
        for k, (a1, a2, col) in enumerate([(60, 180, OR), (0, 60, BL), (180, 240, BL), (240, 360, OR)]):
            b.append(sector(cx, cy, 15, a1, a2, col, .3)); b.append(lab(cx, cy, 25, (a1 + a2) / 2, str(base + k + 1), col, 10.5))
    for y in (p1[1], p2[1]): b.append(f'<path d="M{W-40},{y-5} L{W-32},{y} L{W-40},{y+5}" fill="none" stroke="{NV}" stroke-width="1.6"/>')
    b.append(f'<text x="{W-14}" y="{p1[1]-5}" font-size="11" font-style="italic" fill="{NV}">p</text><text x="{W-14}" y="{p2[1]-5}" font-size="11" font-style="italic" fill="{NV}">q</text><text x="{x0+4:.0f}" y="{y0+8:.0f}" font-size="11" font-style="italic" fill="{NV}">t</text>')
    return svg(W, H, "".join(b))

def u45():
    x = 25; assert 3*x + 10 == 4*x - 15 == 85
    front = head("Units 4–5", "Angles and Triangles", "NC.8.G.5 • Angle pairs, parallel lines, triangles, similarity", "Front")
    front += sec("know", 1, "Angle Pairs", angle_pairs())
    pairs = [("Corresponding", "same corner, other line", "∠1 &amp; ∠5", "<span class='badge blu'>EQUAL</span>"),
             ("Alternate interior", "inside, opposite sides of t", "∠3 &amp; ∠6", "<span class='badge blu'>EQUAL</span>"),
             ("Alternate exterior", "outside, opposite sides of t", "∠1 &amp; ∠8", "<span class='badge blu'>EQUAL</span>"),
             ("Same-side interior", "inside, same side of t", "∠3 &amp; ∠5", "<span class='badge' style='background:#EA580C'>ADD TO 180°</span>")]
    front += sec("know", 2, "Parallel Lines Cut by a Transversal", f'''
<div class="row" style="align-items:center"><div class="ctr" style="flex:.85">{transversal()}
<div class="say" style="text-align:left"><b>Only 2 sizes!</b> <span style="color:#2563EB;font-weight:800">Blue</span> angles are equal. <span style="color:#EA580C;font-weight:800">Orange</span> angles are equal. <b>Blue + orange = 180°.</b></div></div>
<div><table class="d"><tr><th>Pair</th><th>Where</th><th>Example</th><th>Rule</th></tr>{"".join(f"<tr><td><b>{a}</b></td><td>{b}</td><td class='m'>{cc}</td><td>{d}</td></tr>" for a, b, cc, d in pairs)}</table>
<div class="card" style="margin-top:4px"><b>Solve:</b> ∠3 = <span class="m">3x + 10</span>, ∠6 = <span class="m">4x {M} 15</span> (alternate interior → equal)
{solve([(c(1, "3x + 10"), c(1, "="), c(1, f"4x {M} 15"), f"{c(1,'1')} Equal angles: set them equal"), (M + "3x", "", M + "3x", f"{c(2,'2')} Solve", True), ("10", "=", f"x {M} 15", ""), ("+15", "", "+15", "", True), ("25", "=", "x", "")])}
<div>{c(3,"3")} Find the angle: <span class="m">3(25) + 10 = <b>85°</b></span></div></div></div></div>''')
    A, B = (15, 100), (125, 100); t1, t2 = math.radians(50), math.radians(65)
    xa = (B[0] - A[0]) * math.tan(t2) / (math.tan(t1) + math.tan(t2)); C = (A[0] + xa, A[1] - xa * math.tan(t1))
    dirCA = math.degrees(math.atan2(-(A[1] - C[1]), A[0] - C[0])) % 360; dirCB = math.degrees(math.atan2(-(B[1] - C[1]), B[0] - C[0])) % 360
    assert abs((dirCB - dirCA) % 360 - 65) < 0.01
    tri = svg(170, 110, f'<polygon points="{A[0]},{A[1]} {B[0]},{B[1]} {C[0]:.1f},{C[1]:.1f}" fill="#EEF2FF" stroke="{NV}" stroke-width="2"/><line x1="{B[0]}" y1="{B[1]}" x2="165" y2="{B[1]}" stroke="{NV}" stroke-width="2"/>'
              + sector(*A, 20, 0, 50, BL) + sector(*B, 20, 115, 180, OR) + sector(C[0], C[1], 15, dirCA, dirCB, PU) + sector(*B, 13, 0, 115, TE)
              + f'<text x="{A[0]+22}" y="{A[1]-5}" font-size="10" font-weight="800" fill="{BL}" font-family="Inter">50°</text><text x="{B[0]-40}" y="{B[1]-5}" font-size="10" font-weight="800" fill="{OR}" font-family="Inter">65°</text>'
              + f'<text x="{C[0]-4:.0f}" y="{C[1]+28:.0f}" font-size="10" font-weight="800" fill="{PU}" font-family="Inter">x</text><text x="{B[0]+14}" y="{B[1]-14}" font-size="10" font-weight="800" fill="{TE}" font-family="Inter">115°</text>')
    assert 50 + 65 + 65 == 180 and 50 + 65 == 115 == 180 - 65
    front += sec("know", 3, "Triangle Angles", f'''
<div class="row" style="align-items:center"><div class="ctr" style="flex:.7">{tri}</div>
<div>{stp(1, f"The 3 angles inside {c(1,'add to 180°')}. &nbsp;<span class='m'>50 + 65 + x = 180 → x = 65°</span>")}
{stp(2, f"{c(4,'Exterior angle')} = the 2 far inside angles added. &nbsp;<span class='m'>50 + 65 = 115°</span>")}
{stp(3, f"{c(3,'AA similar:')} 2 angles match → the 3rd matches too → the triangles are <b>similar</b> (same shape).")}</div></div>''')

    assert 6**2 + 8**2 == 10**2 and 13**2 - 5**2 == 12**2 and 9**2 + 12**2 == 15**2 and 5**2 + 7**2 != 9**2 and 10**2 - 6**2 == 8**2 and 3**2 + 4**2 == 5**2
    back = head("Unit 5", "The Pythagorean Theorem", "NC.8.G.6 • NC.8.G.7 • NC.8.G.8", "Back")
    rt_ = svg(160, 110, f'<polygon points="20,95 140,95 20,15" fill="#F8FAFF" stroke="none"/><line x1="20" y1="95" x2="140" y2="95" stroke="{BL}" stroke-width="4"/><line x1="20" y1="95" x2="20" y2="15" stroke="{BL}" stroke-width="4"/><line x1="20" y1="15" x2="140" y2="95" stroke="{OR}" stroke-width="4"/>'
              f'<rect x="20" y="83" width="12" height="12" fill="none" stroke="{NV}" stroke-width="1.5"/><text x="80" y="108" font-size="13" font-weight="800" fill="{BL}" text-anchor="middle" font-family="Inter">b (leg)</text>'
              f'<text x="10" y="58" font-size="13" font-weight="800" fill="{BL}" text-anchor="middle" font-family="Inter">a</text><text x="92" y="48" font-size="13" font-weight="800" fill="{OR}" font-family="Inter">c</text>')
    back += sec("know", 5, "Only for RIGHT Triangles", f'''
<div class="row" style="align-items:center"><div class="ctr" style="flex:.7">{rt_}</div>
<div><div class="m" style="font-size:22pt">{c(1,"a")}² + {c(1,"b")}² = {c(3,"c")}²</div>
<div><span class="c1">a and b = legs</span>. They make the square corner.</div><div><span class="c3">c = hypotenuse</span>. It is across from the square corner. It is <b>always the longest side.</b></div>
<div class="tiny" style="margin-top:3px"><b>Common triples:</b> 3, 4, 5 &nbsp;•&nbsp; 6, 8, 10 &nbsp;•&nbsp; 5, 12, 13 &nbsp;•&nbsp; 8, 15, 17</div></div></div>''')
    back += sec("steps", 6, "Find the Missing Side", f'''
<div class="row"><div class="card"><span class="badge blu">Missing c? ADD</span> &nbsp;Legs 6 and 8
{solve([(f"{c(1,'6²')} + {c(1,'8²')}", "=", "c²", f"{c(1,'1')} Fill in a² + b² = c²"), ("36 + 64", "=", "c²", f"{c(2,'2')} Square"), ("100", "=", "c²", f"{c(3,'3')} Add"), (c(4, "10"), "=", "c", f"{c(4,'4')} Square root: √100")])}</div>
<div class="card"><span class="badge" style="background:#EA580C">Missing a leg? SUBTRACT</span> &nbsp;Leg 5, c = 13
{solve([(f"{c(1,'5²')} + b²", "=", c(1, "13²"), f"{c(1,'1')} Fill in"), ("25 + b²", "=", "169", f"{c(2,'2')} Square"), ("b²", "=", "144", f"{c(3,'3')} Subtract: 169 {M} 25"), ("b", "=", c(4, "12"), f"{c(4,'4')} Square root: √144")])}</div></div>
<div class="say" style="margin-top:4px"><b>Not a perfect square?</b> Estimate. Legs 2 and 5: <span class="m">c² = 4 + 25 = 29</span>, so <span class="m">c = √29 ≈ 5.4</span> (25 &lt; 29 &lt; 36).</div>''')
    back += sec("steps", 7, "Is It a Right Triangle? (Converse)", f'''
<div class="row"><div>{steps(f"The {c(1,'longest side')} is c.", f"Plug into {c(2,'a² + b² = c²')}.", f"{c(3,'Equal?')} YES, right triangle. Not equal? NO.")}</div>
<div class="card ctr">Sides 9, 12, 15<div class="m">9² + 12² <b>?</b> 15²<br>81 + 144 <b>?</b> 225<br>225 = 225</div><span class="badge yes">YES, right</span></div>
<div class="card ctr">Sides 5, 7, 9<div class="m">5² + 7² <b>?</b> 9²<br>25 + 49 <b>?</b> 81<br>74 ≠ 81</div><span class="badge no">NO, not right</span></div></div>''')
    ladder = svg(110, 100, f'<line x1="90" y1="5" x2="90" y2="92" stroke="#9CA3AF" stroke-width="6"/><line x1="5" y1="92" x2="105" y2="92" stroke="#9CA3AF" stroke-width="3"/>'
                 f'<line x1="30" y1="92" x2="88" y2="14" stroke="{OR}" stroke-width="4"/><text x="40" y="46" font-size="11" font-weight="800" fill="{OR}" font-family="Inter">10</text>'
                 f'<text x="55" y="88" font-size="11" font-weight="800" fill="{BL}" font-family="Inter">6</text><text x="70" y="60" font-size="11" font-weight="800" fill="{BL}" font-family="Inter">h</text>')
    dist = grid(0, 5, 0, 6, u=15, body=lambda X, Y, u: f'<line x1="{X(1)}" y1="{Y(1)}" x2="{X(4)}" y2="{Y(1)}" stroke="{BL}" stroke-width="3"/><line x1="{X(4)}" y1="{Y(1)}" x2="{X(4)}" y2="{Y(5)}" stroke="{BL}" stroke-width="3"/><line x1="{X(1)}" y1="{Y(1)}" x2="{X(4)}" y2="{Y(5)}" stroke="{OR}" stroke-width="3"/><circle cx="{X(1)}" cy="{Y(1)}" r="3.5" fill="{NV}"/><circle cx="{X(4)}" cy="{Y(5)}" r="3.5" fill="{NV}"/>', font=7)
    back += sec("ex", 8, "Use It in the Real World", f'''
<div class="row"><div class="card"><div class="row" style="align-items:center"><div style="flex:.6">{ladder}</div><div><b>Ladder:</b> 10 ft long. The bottom is 6 ft from the wall. How high does it reach?
<div class="m">6² + h² = 10²<br>36 + h² = 100<br>h² = 64 → <b>h = 8 ft</b></div></div></div></div>
<div class="card"><div class="row" style="align-items:center"><div style="flex:.6">{dist}</div><div><b>Distance</b> from (1, 1) to (4, 5):
{steps(f"Draw a {c(1,'right triangle')}.", f"{c(2,'Count')} the legs: 3 and 4.", f"<span class='m'>9 + 16 = 25 → {c(3,'d = 5')}</span>")}</div></div></div></div>''')
    return [front, back]

# ───────────────────────────── UNIT 6 ─────────────────────────────
import functions as fx
def mini(body, u=9): return grid(-5, 5, -5, 5, u=u, body=body, labels=False)
def line_fn(f, col=OR, lo=-5, hi=5):
    def g(X, Y, u):
        pts = [(x / 10, f(x / 10)) for x in range(lo * 10, hi * 10 + 1)]
        pts = [(a, b) for a, b in pts if -5.05 <= b <= 5.05]
        return f'<polyline points="{" ".join(f"{X(a):.1f},{Y(b):.1f}" for a, b in pts)}" fill="none" stroke="{col}" stroke-width="2.4"/>'
    return g
def dot(x, y, col=NV, r=3.4): return lambda X, Y, u: f'<circle cx="{X(x)}" cy="{Y(y)}" r="{r}" fill="{col}"/>'

def u6():
    assert F(11 - 3, 6 - 2) == 2
    front = head("Unit 6", "Functions", "NC.8.F.1 • NC.8.F.3 • NC.8.F.4", "Front")
    yes_g = mini(combine(line_fn(lambda x: 0.15 * x * x - 3), lambda X, Y, u: f'<line x1="{X(2)}" y1="{Y(-5)}" x2="{X(2)}" y2="{Y(5)}" stroke="{BL}" stroke-width="1.6" stroke-dasharray="4 3"/>', dot(2, 0.15 * 4 - 3, BL)))
    no_g = mini(combine(fx.circle(3.2), lambda X, Y, u: f'<line x1="{X(1)}" y1="{Y(-5)}" x2="{X(1)}" y2="{Y(5)}" stroke="#B42318" stroke-width="1.6" stroke-dasharray="4 3"/>', dot(1, (3.2**2 - 1) ** .5, "#B42318"), dot(1, -(3.2**2 - 1) ** .5, "#B42318")))
    front += sec("know", 1, "What Is a Function?", f'''
<div class="say" style="margin-bottom:5px"><b>Function:</b> each input (x) has <b>exactly one</b> output (y). &nbsp;An x can't repeat with a different y.</div>
<table class="d"><tr><th></th><th><span class="badge yes">FUNCTION ✓</span></th><th><span class="badge no">NOT a function ✗</span></th></tr>
<tr><td><b>Ordered pairs</b></td><td class="m">(1, 4), (2, 6), (3, 6)<br><span class="tiny">y can repeat. That's OK.</span></td><td class="m">(<span class="x">1</span>, 4), (<span class="x">1</span>, 7), (3, 6)<br><span class="tiny">x = 1 has two outputs.</span></td></tr>
<tr><td><b>Mapping</b></td><td><div style="display:flex">{mapping([1,2,3],[4,6,9],[(0,0),(1,1),(2,2)], w=140)}</div><span class="tiny">One arrow leaves each input.</span></td><td><div style="display:flex">{mapping([1,2,3],[4,6,9],[(0,0),(0,1),(1,1),(2,2)], w=140)}</div><span class="tiny">Input 1 has two arrows.</span></td></tr>
<tr><td><b>Graph</b><br><span class="tiny">Vertical line test</span></td><td><div style="display:flex">{yes_g}</div><span class="tiny">A vertical line hits it <b>once</b>.</span></td><td><div style="display:flex">{no_g}</div><span class="tiny">Hits <b>twice</b>: one x, two y's.</span></td></tr></table>''')
    kinds = [(line_fn(lambda x: x), "Positive", "goes up"), (line_fn(lambda x: -x), "Negative", "goes down"), (line_fn(lambda x: 1), "Zero", "flat"),
             (lambda X, Y, u: f'<line x1="{X(1)}" y1="{Y(-5)}" x2="{X(1)}" y2="{Y(5)}" stroke="{OR}" stroke-width="2.4"/>', "Undefined", "straight up")]
    kc = "".join(f'<div class="ctr"><div style="display:flex;justify-content:center">{mini(g, 5.5)}</div><b class="tiny">{n}</b><div class="tiny">{d}</div></div>' for g, n, d in kinds)
    front += sec("steps", 2, "Slope = Rate of Change", f'''
<div class="row"><div><div class="m ctr big">m = {fr("change in y", "change in x")} = {fr("rise", "run")}</div>
<div class="tiny" style="margin:2px 0"><b>Example:</b> points (2, 3) and (6, 11)</div>
{steps(f"Subtract the {c(1,'y’s')}: 11 {M} 3 = {c(1,'8')}", f"Subtract the {c(2,'x’s')} in the same order: 6 {M} 2 = {c(2,'4')}", f"Divide: {fr(c(1,'8'), c(2,'4'))} = {c(3,'2')}. &nbsp;The slope is {c(3,'2')}.")}</div>
<div><div class="tiny"><b>4 kinds of slope</b></div><div class="row">{kc}</div></div></div>''')
    g3 = grid(-5, 5, -5, 5, u=15, body=combine(line_fn(lambda x: F(2, 3) * x - 2 if True else 0, OR),
              lambda X, Y, u: f'<line x1="{X(0)}" y1="{Y(-2)}" x2="{X(0)}" y2="{Y(0)}" stroke="{PU}" stroke-width="3"/><line x1="{X(0)}" y1="{Y(0)}" x2="{X(3)}" y2="{Y(0)}" stroke="{TE}" stroke-width="3"/>'
              f'<text x="{X(0)-12}" y="{Y(-1)+3}" font-size="9" font-weight="800" fill="{PU}">↑2</text><text x="{X(1.5)}" y="{Y(0)-4}" font-size="9" font-weight="800" fill="{TE}" text-anchor="middle">→3</text>',
              dot(0, -2, BL, 4.5), dot(3, 0, NV)), font=7)
    assert F(2, 3) * 3 - 2 == 0
    front += sec("steps", 3, "Graph y = mx + b", f'''
<div class="row" style="align-items:center"><div>
<div><span class="m big">y = <span class="c2">m</span>x + <span class="c1">b</span></span> &nbsp; <span class="c2">m = slope</span> (rate) &nbsp; <span class="c1">b = y-intercept</span> (start, where x = 0)</div>
<div class="tiny" style="margin:3px 0"><b>Example:</b> <span class="m">y = {fr(2,3)}x {M} 2</span></div>
{steps(f"Start at {c(1,'b')}. Plot {c(1,'(0, −2)')} on the y-axis.", f"Use the slope {fr(c(2,'2'), c(4,'3'))}: go {c(2,'up 2')}, then {c(4,'right 3')}. Plot.", f"{c(3,'Draw the line')} through the points.")}
<div class="say" style="margin-top:4px"><b>Story:</b> A taxi costs $3 to start plus $2 per mile. &nbsp;start → <span class="c1">b = 3</span>, per mile → <span class="c2">m = 2</span> → <span class="m">y = 2x + 3</span></div>
<div class="tiny" style="margin-top:3px"><b>Linear</b> = straight line, same rate (y = 4x {M} 1). &nbsp;<b>Nonlinear</b> = curve (y = x², y = {fr(4,'x')}).</div></div>
<div class="ctr" style="flex:.6">{g3}</div></div>''')

    assert all(5 + 3*x == y for x, y in [(0, 5), (1, 8), (2, 11)]) and F(11 - 7, 4 - 2) == 2 and 7 - 2*2 == 3 and 15*6 + 40 == 130
    back = head("Unit 6", "Using Functions", "NC.8.F.2 • NC.8.F.5 • NC.8.EE.8", "Back")
    back += sec("ex", 4, "Compare Two Functions", f'''
<div class="row" style="align-items:center"><div class="card ctr"><b>Function A</b>{vtable([0,1,2],[5,8,11])}<div class="tiny">y goes up <b class="c2">3</b> each time → <span class="c2">m = 3</span>. When x = 0, y = 5 → <span class="c1">b = 5</span></div></div>
<div class="card ctr"><b>Function B</b><div class="m big" style="margin:6px 0">y = <span class="c2">4</span>x + <span class="c1">2</span></div><div class="tiny"><span class="c2">m = 4</span>, <span class="c1">b = 2</span></div></div>
<div>{steps(f"Find {c(2,'m')} and {c(1,'b')} for each one.", f"{c(3,'Compare.')} Faster rate: <b>B</b> (4 &gt; 3). Higher start: <b>A</b> (5 &gt; 2).")}</div></div>''')
    W, H = 220, 110
    seg = [(0, 0, 40, 40, BL, "A"), (40, 40, 70, 40, PU, "B"), (70, 40, 120, 95, OR, "C"), (120, 95, 180, 0, TE, "D")]
    q = [f'<line x1="20" y1="100" x2="210" y2="100" stroke="{NV}" stroke-width="1.5"/><line x1="20" y1="100" x2="20" y2="5" stroke="{NV}" stroke-width="1.5"/>',
         f'<text x="115" y="110" font-size="8" fill="#555" text-anchor="middle" font-family="Inter">time →</text><text x="14" y="55" font-size="8" fill="#555" text-anchor="middle" font-family="Inter" transform="rotate(-90 14 55)">distance from home</text>']
    for x1, y1, x2, y2, col, L in seg:
        if L == "C": q.append(f'<path d="M{20+x1},{100-y1} Q{20+100},{100-45} {20+x2},{100-y2}" fill="none" stroke="{col}" stroke-width="3"/>')
        else: q.append(f'<line x1="{20+x1}" y1="{100-y1}" x2="{20+x2}" y2="{100-y2}" stroke="{col}" stroke-width="3"/>')
        q.append(f'<text x="{20+(x1+x2)/2-6}" y="{100-(y1+y2)/2-6}" font-size="11" font-weight="800" fill="{col}" font-family="Inter">{L}</text>')
    back += sec("know", 5, "Graphs That Tell a Story", f'''
<div class="row" style="align-items:center"><div class="ctr" style="flex:.8">{svg(W, H, "".join(q))}</div>
<div><table class="d"><tr><th></th><th>Shape</th><th>Story</th></tr>
<tr><td class="c1">A</td><td>going up, straight</td><td>walks away at a steady speed</td></tr><tr><td class="c2">B</td><td>flat (constant)</td><td>stops</td></tr>
<tr><td class="c3">C</td><td>going up, curved</td><td>speeds up</td></tr><tr><td class="c4">D</td><td>going down, straight</td><td>goes back home</td></tr></table>
<div class="tiny" style="margin-top:2px">Read <b>left to right</b>. Up = increasing. Down = decreasing. Flat = constant.</div></div></div>''')
    gs = grid(-1, 5, -1, 6, u=13, body=combine(line_fn(lambda x: x + 1, BL, -1, 5), line_fn(lambda x: -x + 5, OR, -1, 5), dot(2, 3, "#15803D", 4.5),
              lambda X, Y, u: f'<text x="{X(2)+6}" y="{Y(3)+4}" font-size="9" font-weight="800" fill="#15803D">(2, 3)</text>'), font=7)
    back += sec("steps", 6, "Systems: Where the Lines Cross", f'''
<div class="row" style="align-items:center"><div class="ctr" style="flex:.55">{gs}<div class="tiny"><span class="c1">y = x + 1</span> &nbsp; <span class="c3">y = {M}x + 5</span></div></div>
<div class="card">{solve([(c(1, "x + 1"), "=", c(3, f"{M}x + 5"), f"{c(1,'1')} Set them equal"), ("+x", "", "+x", f"{c(2,'2')} Solve for x", True), ("2x + 1", "=", "5", ""), (M + "1", "", M + "1", "", True), ("2x", "=", "4", ""), ("x", "=", "2", "")])}
<div class="tiny">{c(3,"3")} Put x = 2 back in: y = 2 + 1 = 3 → <b>(2, 3)</b></div><div class="tiny">{c(4,"4")} Check in both: 3 = 2 + 1 ✓ &nbsp;3 = {M}2 + 5 ✓</div></div>
<div><table class="d"><tr><th>Look at m and b</th><th>Solutions</th></tr><tr><td>Different m</td><td><b>one</b> (lines cross)</td></tr><tr><td>Same m, different b</td><td><b>none</b> (parallel)</td></tr><tr><td>Same m, same b</td><td><b>infinitely many</b> (same line)</td></tr></table></div></div>''')
    back += sec("steps", 7, "Write the Equation and Explain It", f'''
<div class="row"><div class="card"><b>From two points:</b> (2, 7) and (4, 11)
{steps(f"{c(1,'Slope:')} <span class='m'>{fr(f'11 {M} 7', f'4 {M} 2')} = {fr(4,2)} = 2</span>", f"{c(2,'Find b:')} put in one point. <span class='m'>7 = 2(2) + b → b = 3</span>", f"{c(3,'Write it:')} <span class='m big'>y = 2x + 3</span>")}</div>
<div class="card"><b>Explain it:</b> Savings <span class="m">y = 15x + 40</span> &nbsp;<span class="tiny">x = weeks, y = dollars</span>
<div><span class="c2">m = 15</span>: saves <b>$15 per week</b> (rate)</div><div><span class="c1">b = 40</span>: had <b>$40 at the start</b></div>
<div class="say" style="margin-top:3px"><b>Clue words:</b> per, each, every → <span class="c2">slope</span>. &nbsp;start, fee, at first → <span class="c1">y-intercept</span>.</div></div></div>''')
    return [front, back]
# ───────────────────────────── UNIT 7 ─────────────────────────────
import random
def scat(pts, w=96, h=72, extra="", xr=(0, 10), yr=(0, 10), col=NV, r=2.6):
    X = lambda x: 8 + (x - xr[0]) / (xr[1] - xr[0]) * (w - 14); Y = lambda y: h - 8 - (y - yr[0]) / (yr[1] - yr[0]) * (h - 14)
    s = f'<line x1="8" y1="{h-8}" x2="{w-4}" y2="{h-8}" stroke="{NV}" stroke-width="1.3"/><line x1="8" y1="{h-8}" x2="8" y2="4" stroke="{NV}" stroke-width="1.3"/>'
    s += "".join(f'<circle cx="{X(a):.1f}" cy="{Y(b):.1f}" r="{r}" fill="{col}"/>' for a, b in pts)
    return svg(w, h, s + (extra(X, Y) if extra else ""))

def u7():
    R = random.Random(8)
    pos = [(x, 1 + 0.8 * x + R.uniform(-1.2, 1.2)) for x in [0.5 + i * 0.75 for i in range(12)]]
    neg_ = [(x, 9 - 0.8 * x + R.uniform(-1.2, 1.2)) for x in [0.5 + i * 0.75 for i in range(12)]]
    non = [(R.uniform(0.5, 9.5), R.uniform(0.5, 9.5)) for _ in range(12)]
    cur = [(x, 0.11 * (x - 5) ** 2 * 3 + 1 + R.uniform(-.5, .5)) for x in [0.5 + i * 0.75 for i in range(12)]]
    kinds = [(pos, "Positive", "x up, y up", "yes"), (neg_, "Negative", "x up, y down", "no"), (non, "No association", "no pattern", "pur"), (cur, "Nonlinear", "a curve", "blu")]
    kc = "".join(f'<div class="card ctr"><div style="display:flex;justify-content:center">{scat(p)}</div><span class="badge {b}">{n}</span><div class="tiny">{d}</div></div>' for p, n, d, b in kinds)
    clus = [(1 + R.uniform(0, 1.6), 1.5 + R.uniform(0, 1.8)) for _ in range(7)] + [(6.2 + R.uniform(0, 1.8), 6 + R.uniform(0, 1.8)) for _ in range(7)]
    cgo = scat(clus + [(9.2, 1.2)], w=150, h=95, extra=lambda X, Y: f'<circle cx="{X(9.2)}" cy="{Y(1.2)}" r="7" fill="none" stroke="#B42318" stroke-width="1.6"/><text x="{X(9.2)-3}" y="{Y(1.2)-10}" font-size="8.5" font-weight="800" fill="#B42318" text-anchor="end" font-family="Inter">outlier</text>'
               f'<ellipse cx="{X(1.8)}" cy="{Y(2.4)}" rx="18" ry="14" fill="none" stroke="#2563EB" stroke-width="1.4" stroke-dasharray="3 2"/><text x="{X(1.8)}" y="{Y(4.4)}" font-size="8.5" font-weight="800" fill="#2563EB" text-anchor="middle" font-family="Inter">cluster</text>'
               f'<text x="{X(4.6)}" y="{Y(4.6)}" font-size="8.5" font-weight="800" fill="#7C3AED" text-anchor="middle" font-family="Inter">gap</text>')
    front = head("Unit 7", "Scatter Plots", "NC.8.SP.1 • NC.8.SP.2 • NC.8.SP.3", "Front")
    front += sec("know", 1, "Is There a Pattern? (Association)", f'''<div class="row">{kc}</div>
<div class="row" style="margin-top:5px;align-items:center"><div class="ctr" style="flex:.7">{cgo}</div><div>
<div><b class="c1">Cluster:</b> points bunched together.</div><div><b class="c2">Gap:</b> a big empty space.</div><div><b style="color:#B42318">Outlier:</b> a point far from the rest.</div>
<div class="say" style="margin-top:4px"><b>Say it:</b> “As x increases, y tends to <u>increase / decrease</u>. The association is <u>positive / negative / none</u> and <u>linear / nonlinear</u>.”</div></div></div>''')
    good = scat(pos, w=130, h=88, extra=lambda X, Y: f'<line x1="{X(0)}" y1="{Y(1)}" x2="{X(9.8)}" y2="{Y(1 + 0.8*9.8)}" stroke="#15803D" stroke-width="2.4"/>')
    bad1 = scat(pos, w=130, h=88, extra=lambda X, Y: f'<line x1="{X(0)}" y1="{Y(5)}" x2="{X(9.8)}" y2="{Y(5)}" stroke="#B42318" stroke-width="2.4"/>')
    bad2 = scat(pos, w=130, h=88, extra=lambda X, Y: f'<line x1="{X(pos[0][0])}" y1="{Y(pos[0][1])}" x2="{X(pos[-1][0])}" y2="{Y(pos[-1][1])}" stroke="#B42318" stroke-width="2.4" stroke-dasharray="5 3"/>')
    front += sec("steps", 2, "Draw a Line of Best Fit", f'''
<div class="row"><div>{steps(f"Use a {c(1,'ruler')}. It is a straight line.", f"Follow the {c(2,'direction')} of the points.", f"About {c(3,'half above, half below')} the line.", f"It does {c(4,'not')} have to touch any point.")}
<div class="tiny" style="margin-top:3px">Points close to the line → <b>strong</b>. Spread out → <b>weak</b>.</div></div>
<div class="card ctr"><div style="display:flex;justify-content:center">{good}</div><span class="badge yes">GOOD ✓</span><div class="tiny">follows the trend</div></div>
<div class="card ctr"><div style="display:flex;justify-content:center">{bad1}</div><span class="badge no">BAD ✗</span><div class="tiny">flat: wrong direction</div></div>
<div class="card ctr"><div style="display:flex;justify-content:center">{bad2}</div><span class="badge no">BAD ✗</span><div class="tiny">just connects the ends</div></div></div>''')
    assert F(85 - 60, 5 - 0) == 5 and 5 * 3 + 60 == 75
    data = [(0.5, 63), (1, 64), (1.5, 69), (2, 71), (2.5, 70), (3, 76), (3.5, 77), (4, 79), (4.5, 84), (5, 84), (6, 89), (6.5, 94)]
    W, H = 220, 150; X = lambda x: 30 + x / 7 * (W - 40); Y = lambda y: H - 22 - (y - 50) / 50 * (H - 32)
    g = [f'<line x1="30" y1="{Y(50)}" x2="{W-6}" y2="{Y(50)}" stroke="{NV}" stroke-width="1.3"/><line x1="30" y1="{Y(50)}" x2="30" y2="{Y(100)}" stroke="{NV}" stroke-width="1.3"/>']
    for v in range(50, 101, 10): g.append(f'<text x="26" y="{Y(v)+3}" font-size="7.5" text-anchor="end" fill="#555" font-family="Inter">{v}</text><line x1="30" y1="{Y(v)}" x2="{W-6}" y2="{Y(v)}" stroke="#E5E7EB" stroke-width=".8"/>')
    for v in range(0, 8): g.append(f'<text x="{X(v)}" y="{H-11}" font-size="7.5" text-anchor="middle" fill="#555" font-family="Inter">{v}</text>')
    g.append(f'<text x="{(W+30)/2}" y="{H-1}" font-size="8" text-anchor="middle" fill="#333" font-family="Inter">hours studied</text><text x="9" y="{H/2}" font-size="8" text-anchor="middle" fill="#333" font-family="Inter" transform="rotate(-90 9 {H/2})">test score</text>')
    g += [f'<circle cx="{X(a):.1f}" cy="{Y(b):.1f}" r="2.6" fill="{NV}"/>' for a, b in data]
    g.append(f'<line x1="{X(0)}" y1="{Y(60)}" x2="{X(7)}" y2="{Y(95)}" stroke="#15803D" stroke-width="2.2"/>')
    for (a, b, col) in [(0, 60, BL), (5, 85, BL)]: g.append(f'<rect x="{X(a)-4}" y="{Y(b)-4}" width="8" height="8" fill="{col}"/><text x="{X(a)+6}" y="{Y(b) + (-7 if a else 13)}" font-size="8.5" font-weight="800" fill="{col}" font-family="Inter">({a}, {b})</text>')
    front += sec("ex", 3, "Use the Line: Write It, Explain It, Predict", f'''
<div class="row" style="align-items:center"><div class="ctr" style="flex:.85">{svg(W, H, "".join(g))}<div class="tiny">Pick 2 points <b>on the line</b> (not data dots).</div></div>
<div>{steps(f"{c(1,'Slope:')} <span class='m'>{fr(f'85 {M} 60', f'5 {M} 0')} = {fr(25,5)} = 5</span>", f"{c(2,'y-intercept:')} where x = 0 → <span class='m'>b = 60</span>", f"{c(3,'Write it:')} <span class='m big'>y = 5x + 60</span>", f"{c(4,'Predict')} 3 hours: <span class='m'>5(3) + 60 = 75</span>")}
<div class="say" style="margin-top:3px"><b>Explain it:</b> The score goes up about <b>5 points per hour</b> studied. With <b>0 hours</b>, the score is about <b>60</b>.</div></div></div>''')

    t = {"8": (36, 24), "7": (16, 24)}
    assert sum(t["8"]) == 60 and sum(t["7"]) == 40 and 36 + 16 == 52 and 24 + 24 == 48 and F(36, 60) == F(3, 5) and F(16, 40) == F(2, 5) and round(36 / 52 * 100) == 69
    back = head("Unit 7", "Two-Way Tables", "NC.8.SP.4 • Patterns in categorical data", "Back")
    tb = f'''<table class="d" style="font-size:11pt"><tr><th></th><th>Sport</th><th>No sport</th><th>Total</th></tr>
<tr><td><b>8th grade</b></td><td><span class="hl1"><b>36</b></span></td><td>24</td><td class="c3">60</td></tr>
<tr><td><b>7th grade</b></td><td>16</td><td>24</td><td class="c3">40</td></tr>
<tr><td><b>Total</b></td><td class="c2">52</td><td class="c2">48</td><td class="c4"><b>100</b></td></tr></table>'''
    back += sec("know", 4, "Read a Two-Way Table", f'''
<div class="row" style="align-items:center"><div><div class="tiny" style="margin-bottom:2px"><b>Survey:</b> Do you play a sport? (100 students)</div>{tb}</div>
<div><div>A two-way table sorts the <b>same people</b> two ways: grade <b>and</b> sport.</div>
<div style="margin-top:3px"><span class="hl1"><b>Inside box:</b></span> how many fit <b>both</b>. 36 students are 8th graders <b>and</b> play a sport.</div>
<div style="margin-top:3px"><b class="c3">Row total:</b> add across. 36 + 24 = 60</div><div><b class="c2">Column total:</b> add down. 36 + 16 = 52</div><div><b class="c4">Grand total:</b> everyone = 100</div></div></div>''')
    rows = [("Row", "the row total", "Of the 8th graders, what percent play a sport?", fr(36, 60), "60%"),
            ("Column", "the column total", "Of the sport players, what percent are 8th graders?", fr(36, 52), "≈ 69%"),
            ("Total", "the grand total", "Of ALL students, what percent are 8th graders who play?", fr(36, 100), "36%")]
    back += sec("steps", 5, "Relative Frequency = Part ÷ Total", f'''
{steps(f"Read the question. Find the {c(1,'group')} it talks about.", f"{c(2,'Divide')} the part by that group's total.", f"Change the decimal to a {c(3,'percent')}: 0.6 = 60%.")}
<table class="d" style="margin-top:4px"><tr><th>Type</th><th>Divide by</th><th>Question it answers</th><th>Math</th><th>Answer</th></tr>
{"".join(f"<tr><td><b>{a}</b></td><td>{b}</td><td>{cc}</td><td class='m'>{d}</td><td class='m'><b>{e}</b></td></tr>" for a, b, cc, d, e in rows)}</table>
<div class="say" style="margin-top:4px"><b>Row percents:</b> 8th grade: <span class="m">36 ÷ 60 = 60%</span> play, 40% don't. &nbsp;7th grade: <span class="m">16 ÷ 40 = 40%</span> play, 60% don't. Each row adds to 100%.</div>''')
    bh = 100
    bar = lambda x, p, lab: (f'<rect x="{x}" y="{10}" width="44" height="{bh*(1-p)}" fill="#E5E7EB" stroke="{NV}"/><rect x="{x}" y="{10+bh*(1-p)}" width="44" height="{bh*p}" fill="#93C5FD" stroke="{NV}"/>'
                             f'<text x="{x+22}" y="{10+bh*(1-p)+bh*p/2+4}" font-size="10" font-weight="800" text-anchor="middle" fill="{NV}" font-family="Inter">{round(p*100)}%</text>'
                             f'<text x="{x+22}" y="{10+bh*(1-p)/2+4}" font-size="9" text-anchor="middle" fill="#444" font-family="Inter">{round((1-p)*100)}%</text><text x="{x+22}" y="{bh+24}" font-size="10" font-weight="700" text-anchor="middle" fill="{NV}" font-family="Inter">{lab}</text>')
    sb = svg(170, 130, bar(20, .6, "8th") + bar(80, .4, "7th") + f'<rect x="132" y="20" width="9" height="9" fill="#93C5FD" stroke="{NV}"/><text x="144" y="28" font-size="8" fill="#333" font-family="Inter">sport</text><rect x="132" y="34" width="9" height="9" fill="#E5E7EB" stroke="{NV}"/><text x="144" y="42" font-size="8" fill="#333" font-family="Inter">no</text>')
    back += sec("ex", 6, "Is There an Association?", f'''
<div class="row" style="align-items:center"><div>
{steps(f"Find the {c(1,'row percents')} for each group.", f"{c(2,'Compare')} them.", f"Very different → {c(3,'association')}. About the same → {c(4,'no association')}.")}
<div class="card" style="margin-top:4px">8th graders who play: <b>60%</b>. 7th graders who play: <b>40%</b>.<br>60% and 40% are very different. <b>Yes, there is an association.</b> 8th graders are more likely to play a sport.</div></div>
<div class="ctr" style="flex:.6">{sb}<div class="tiny">Bars look different → association.</div></div></div>''')
    back += sec("warn", 7, "Watch Out!", f'''<div class="row">
<div class="card"><b>Pick the right total.</b> “Of the 8th graders” → divide by the <b>8th grade</b> total (60), not 100.</div>
<div class="card"><b>Compare percents, not counts.</b> The groups are different sizes (60 and 40).</div>
<div class="card"><b>Association is not cause.</b> A pattern does not prove one thing causes the other.</div></div>''')
    return [front, back]

# ───────────────────────────── UNIT 8 ─────────────────────────────
import transform as T
def figs(rng, u, *items):
    """items: (pts, color, labels, dash, fill_op)"""
    body = [shape([(float(a), float(b)) for a, b in p], col, op, lab, dash=d, offs=[(3, -3)] * len(p)) for p, col, lab, d, op in items]
    return grid(*rng, u=u, body=combine(*body), font=6.5)

def u8():
    tri = [(1, 1), (4, 1), (1, 3)]
    P0 = (2, 3)
    rules = [("Translation", "(x, y) → (x + a, y + b)", T.tr(2, -4), "right 2, down 4", "right / up: <b>add</b>. left / down: <b>subtract</b>."),
             ("Reflect over x-axis", "(x, y) → (x, −y)", T.RX, "", "<b>y</b> changes sign"),
             ("Reflect over y-axis", "(x, y) → (−x, y)", T.RY, "", "<b>x</b> changes sign"),
             ("Rotate 90° counterclockwise", "(x, y) → (−y, x)", T.R90, "", "swap, then change the <b>first</b> sign"),
             ("Rotate 180°", "(x, y) → (−x, −y)", T.R180, "", "<b>both</b> signs change"),
             ("Rotate 270° counterclockwise", "(x, y) → (y, −x)", T.R270, "", "swap, then change the <b>second</b> sign")]
    rr = "".join(f"<tr><td><b>{n}</b></td><td class='m'>{r.replace('−', M)}</td><td class='m'>{T.P(f(P0))} <span class='tiny'>{e}</span></td><td>{tip}</td></tr>" for n, r, f, e, tip in rules)
    assert T.R90(P0) == (-3, 2) and T.R270(P0) == (3, -2) and T.tr(2, -4)(P0) == (4, -1)
    pics = [("Translation", "slide", T.tr(-5, -4)), ("Reflection", "flip", T.RY), ("Rotation", "turn", T.R180)]
    pc = "".join(f'<div class="card ctr"><div style="display:flex;justify-content:center">{figs((-5, 5, -5, 5), 10, (tri, NV, None, False, .25), ([f(p) for p in tri], OR, None, True, .25))}</div><b>{n}</b> = <span class="c3">{w}</span></div>' for n, w, f in pics)
    front = head("Unit 8", "Transformations", "NC.8.G.1 • NC.8.G.2 • NC.8.G.3", "Front")
    front += sec("know", 1, "Slide, Flip, Turn: Same Size, Same Shape", f'''
<div class="row">{pc}<div><div>These moves keep the <b>same side lengths</b> and <b>same angles</b>.</div><div style="margin-top:3px">So the figures are <b>congruent</b> (≅).</div>
<div class="say" style="margin-top:4px"><b>Prime mark:</b> the new point is A′ (“A prime”).</div><div class="tiny" style="margin-top:3px"><b style="color:{NV}">Solid</b> = original &nbsp; <b style="color:{OR}">dashed</b> = image</div></div></div>''')
    front += sec("know", 2, "Coordinate Rules", f'''<table class="d"><tr><th>Move</th><th>Rule</th><th>Example: P(2, 3) →</th><th>Memory tip</th></tr>{rr}</table>
<div class="tiny" style="margin-top:3px">Rotations turn around the origin (0, 0). <b>Counterclockwise</b> is the usual way. 270° counterclockwise = 90° clockwise.</div>''')
    img = [T.RY(p) for p in tri]; assert img == [(-1, 1), (-4, 1), (-1, 3)]
    front += sec("steps", 3, "Do a Transformation", f'''
<div class="row" style="align-items:center"><div>
<div class="tiny"><b>Example:</b> reflect triangle ABC over the y-axis.</div>
{steps(f"{c(1,'List')} the points: A(1, 1), B(4, 1), C(1, 3)", f"{c(2,'Use the rule')} on each point: (x, y) → ({M}x, y)", f"{c(3,'Write')} the new points: A′({M}1, 1), B′({M}4, 1), C′({M}1, 3)", f"{c(4,'Plot')} and connect. Label with primes.")}</div>
<div class="ctr" style="flex:.5">{figs((-5, 5, -1, 4), 17, (tri, NV, ["A", "B", "C"], False, .25), (img, OR, ["A′", "B′", "C′"], True, .25))}</div></div>''')
    front += sec("warn", 4, "Watch Out!", f'''<div class="row">
<div class="card"><b>Over the x-axis, y changes.</b> (2, 3) → (2, {M}3). The x stays.</div>
<div class="card"><b>Rotate around (0, 0)</b>, not around the shape.</div>
<div class="card"><b>Do the steps in order.</b> A″ (two primes) means two moves.</div></div>''')

    d = [(2, 2), (4, 2), (2, 4)]; dd = [T.dil(2)(p) for p in d]; assert dd == [(4, 4), (8, 4), (4, 8)]
    assert F(9, 6) == F(3, 2) and F(10, 4) * 6 == 15
    back = head("Unit 8", "Dilations and Similarity", "NC.8.G.3 • NC.8.G.4", "Back")
    back += sec("know", 5, "Dilations: Same Shape, New Size", f'''
<div class="row" style="align-items:center"><div>
<div class="m big">(x, y) → ({c(3,"k")}x, {c(3,"k")}y)</div><div><span class="c3">k = scale factor.</span> Multiply <b>both</b> numbers by k.</div>
<table class="d" style="margin-top:4px"><tr><th>k</th><th>What happens</th></tr><tr><td class="m">k &gt; 1</td><td><b>bigger</b> (enlargement)</td></tr><tr><td class="m">0 &lt; k &lt; 1</td><td><b>smaller</b> (reduction)</td></tr><tr><td class="m">k = 1</td><td>same size</td></tr></table>
<div class="say" style="margin-top:4px"><b>Same:</b> angles. &nbsp;<b>Changes:</b> side lengths (all times k).</div></div>
<div class="card ctr"><div class="tiny"><b>Example:</b> dilate by <span class="c3">k = 2</span></div>
<div style="display:flex;justify-content:center">{figs((0, 8, 0, 8), 13, (d, NV, ["A", "B", "C"], False, .25), (dd, OR, ["A′", "B′", "C′"], True, .2))}</div>
<div class="m tiny">A(2, 2) → A′(4, 4) &nbsp; B(4, 2) → B′(8, 4) &nbsp; C(2, 4) → C′(4, 8)</div></div></div>''')
    back += sec("steps", 6, "Find the Scale Factor", f'''
<div class="row"><div><div class="m big ctr">k = {fr("new (image) length", "old (original) length")}</div>
<div class="card" style="margin-top:4px">A side of 6 becomes 9. <span class="m">k = {fr(9,6)} = {fr(3,2)}</span> → bigger<br>A(6, 3) → A′(2, 1). <span class="m">k = {fr(2,6)} = {fr(1,3)}</span> → smaller</div></div>
<div class="card"><b>Find a missing side.</b> Sides 4 and 6 become 10 and x.
{steps(f"{c(1,'Find k:')} <span class='m'>{fr(10,4)} = 2.5</span>", f"{c(2,'Multiply:')} <span class='m'>x = 6 × 2.5 = 15</span>", f"{c(3,'Check:')} <span class='m'>{fr(15,6)} = 2.5</span> ✓")}</div></div>''')
    s1 = [T.dil(2)(p) for p in [(1, 1), (2, 1), (1, 2)]]; s2 = [T.RY(p) for p in s1]
    back += sec("ex", 7, "Prove It with a Sequence of Moves", f'''
<div class="row" style="align-items:center"><div>
<div class="tiny"><b>Goal:</b> move the small triangle onto the big dashed one.</div>
{steps(f"{c(1,'Dilate')} by k = 2: (x, y) → (2x, 2y)", f"{c(2,'Reflect')} over the y-axis: (x, y) → ({M}x, y)", f"A dilation was used → the triangles are {c(3,'similar')} (~).")}
<div class="tiny" style="margin-top:3px">Only slides, flips, and turns → <b>congruent</b>. Add a dilation → <b>similar</b>.</div></div>
<div class="ctr" style="flex:.6">{figs((-5, 5, -1, 5), 15, ([(1, 1), (2, 1), (1, 2)], NV, None, False, .3), (s1, BL, None, True, .12), (s2, OR, None, True, .25))}<div class="tiny"><b style="color:{NV}">start</b> → <b class="c1">after step 1</b> → <b style="color:{OR}">after step 2</b></div></div></div>''')
    back += sec("know", 8, "Congruent or Similar?", f'''<table class="d"><tr><th></th><th>Moves used</th><th>What stays the same</th><th>Symbol</th></tr>
<tr><td><b>Congruent</b></td><td>slides, flips, turns only</td><td>same size <b>and</b> same shape</td><td class="m big">≅</td></tr>
<tr><td><b>Similar</b></td><td>those, plus a dilation</td><td>same shape, size can change</td><td class="m big">~</td></tr></table>''')
    return [front, back]

UNITS = {"1": ("Unit1_Real_Number_System_Anchor_Chart_Version2.pdf", u1)}
UNITS["2"] = ("Unit2_Exponents_Scientific_Notation_Anchor_Chart_Version2.pdf", u2)
UNITS["3"] = ("Unit3_Equations_Inequalities_Anchor_Chart_Version2.pdf", u3)
UNITS["4-5"] = ("Units4-5_Angles_Pythagorean_Anchor_Chart_Version2.pdf", u45)
UNITS["6"] = ("Unit6_Functions_Anchor_Chart_Version2.pdf", u6)
UNITS["7"] = ("Unit7_Statistics_Anchor_Chart_Version2.pdf", u7)
UNITS["8"] = ("Unit8_Transformations_Anchor_Chart_Version2.pdf", u8)

def build(keys):
    out = []
    for k in keys:
        name, fn = UNITS[k]
        raw = fn(); used = [kd for kd in ("know", "steps", "ex", "warn") if any(f'class="sec {"exm" if kd == "ex" else kd}"' in p for p in raw)]
        cols = {"know": ("#1D4ED8", "Blue = KNOW IT"), "steps": ("#15803D", "Green = STEPS"), "ex": ("#9A6B00", "Gold = EXAMPLE"), "warn": ("#B42318", "Red = WATCH OUT")}
        leg = '<div class="legend">' + "".join(f'<span><i style="background:{cols[kd][0]}"></i>{cols[kd][1]}</span>' for kd in used) + '<span style="background:none">Step colors: <b class="c1">1</b> <b class="c2">2</b> <b class="c3">3</b> <b class="c4">4</b> <b class="c5">5</b></span></div>'
        pages = [f'<div class="v2" data-fit>{p.replace(LEG, leg)}</div>' for p in raw]
        path = os.path.join(kit.OUT, name)
        kit.render(pages, path, footer=f"Unit {k} Anchor Chart • Version 2", fit=True)
        out.append(path); print(path)
    return out

if __name__ == "__main__":
    build(sys.argv[1:] or list(UNITS))
