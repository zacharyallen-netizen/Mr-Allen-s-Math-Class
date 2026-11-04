"""Stations activities: 6 stations x 4 problems. Station cards (regular + Version 2), a recording sheet, and an answer key.

  A  "checkin"  NC Check-In review (Grade 8 Form A missed skills, no functions/transformations): NS.1, EE.1, EE.7
  B  "eqang"    Solving equations + angle relationships

Version 2 = same problems and same answers (one key), plus a hint box, a started first step, and fewer answer choices.
Run: OUT_DIR=/home/claude/outputs python3 _build/materials/stations.py
"""
import sys, os
sys.path.insert(0, os.path.dirname(__file__))
import kit
from kit import fr, sup, neg, M
import anchor_v2 as A          # shared Version 2 look (CSS) + svg helpers
from anchor_v2 import rt, rep, svg, sector, ray, lab, _pt, NV, BL, OR, PU, TE
from fractions import Fraction as F
import math

kit.CSS += """
.sc-hd{display:flex;align-items:stretch;border-radius:12px;overflow:hidden;margin:0 0 8px}
.sc-hd .num{background:var(--gold);color:var(--navy);font:800 13pt/1 var(--sans);padding:8px 14px;display:flex;flex-direction:column;align-items:center;justify-content:center}
.sc-hd .num b{font:800 34pt/1 var(--serif)}
.sc-hd .t{flex:1;background:var(--navy);color:#fff;padding:8px 14px}
.sc-hd .t .k{font:700 7.5pt var(--sans);letter-spacing:.13em;text-transform:uppercase;color:var(--gold)}
.sc-hd .t h1{color:#fff;font-size:20pt;line-height:1.1;margin:2px 0}
.sc-hd .t .s{font-size:9pt;color:#C9D1E3}
.sc-hd .v{background:#7C3AED;color:#fff;font:800 10pt/1.1 var(--sans);padding:0 12px;display:flex;align-items:center;text-align:center}
.dir{background:#F4F5F7;border-radius:8px;padding:5px 10px;margin:0 0 8px;font-size:10pt}
.hint{background:#EEF4FF;border:2px solid #2563EB;border-radius:10px;padding:6px 10px;margin:0 0 8px}
.hint .h{font:800 8pt var(--sans);letter-spacing:.12em;color:#2563EB}
.pb{border:1.6px solid #CBD2DD;border-radius:10px;padding:8px 11px;margin:0 0 8px;background:#fff;break-inside:avoid}
.pb .top{display:flex;align-items:center;gap:8px;margin-bottom:4px}
.pb .qn{width:26px;height:26px;border-radius:7px;background:var(--navy);color:var(--gold);font:800 13pt/26px var(--serif);text-align:center;margin:0}
.pb .ty{font:800 7.5pt var(--sans);letter-spacing:.1em;color:#fff;border-radius:999px;padding:2px 9px}
.ty.mc{background:#2563EB}.ty.sa{background:#7C3AED}.ty.ne{background:#0D9488}.ty.fe{background:#B42318}.ty.mt{background:#EA580C}
.opts{display:grid;gap:4px 14px;margin-top:4px}
.opt{display:flex;gap:7px;align-items:center}
.opt .l{width:21px;height:21px;border:1.6px solid var(--navy);border-radius:50%;font:700 9.5pt/18px var(--sans);text-align:center;flex:none;color:var(--navy)}
.opt.sq .l{border-radius:5px}
.start{margin-top:5px;background:#F1FAF4;border:1.5px dashed #15803D;border-radius:8px;padding:4px 9px;font-size:9.6pt}
.start b{color:#15803D}
.stem{font-size:11pt}
.rs-box{border:1.6px solid var(--navy);border-radius:10px;margin:0 0 8px;overflow:hidden;break-inside:avoid}
.rs-box .h{background:var(--navy);color:#fff;padding:3px 10px;font:600 11pt var(--serif);display:flex;gap:8px;align-items:center}
.rs-box .h span{color:var(--gold);font:800 8pt var(--sans);letter-spacing:.1em}
.rs-grid{display:grid;grid-template-columns:1fr 1fr}
.rs-cell{border-top:1px solid #D5D9E0;padding:3px 8px;height:118px;position:relative}
.rs-cell:nth-child(odd){border-right:1px solid #D5D9E0}
.rs-cell .n{font:800 10pt var(--serif);color:var(--navy)}
.rs-cell .a{position:absolute;left:8px;right:8px;bottom:5px;font:600 8.5pt var(--sans);color:#5B6475;border-top:1.2px solid var(--navy);padding-top:1px}
.rate{font-size:8.5pt;color:#5B6475;padding:2px 10px 4px}
.key td{vertical-align:top}
"""

# ── problem builders ──────────────────────────────────────────────
def MC(stem, opts, correct, drop, start=None, fig=None, cols=2):
    return dict(t="mc", stem=stem, opts=opts, correct=correct, drop=drop, start=start, fig=fig, cols=cols)
def SA(stem, opts, correct, drop, start=None, fig=None, cols=2):
    return dict(t="sa", stem=stem, opts=opts, correct=correct, drop=drop, start=start, fig=fig, cols=cols)
def NE(stem, ans, start=None, fig=None):
    return dict(t="ne", stem=stem, ans=ans, start=start, fig=fig)
def FE(stem, ans, start=None, fig=None):
    return dict(t="fe", stem=stem, ans=ans, start=start, fig=fig)
TYN = {"mc": "MULTIPLE CHOICE", "sa": "SELECT ALL THAT APPLY", "ne": "NUMERIC ENTRY", "fe": "FIND THE ERROR"}
LET = "ABCDEF"

def key_of(p):
    if p["t"] == "mc": return p["correct"]
    if p["t"] == "sa": return ", ".join(p["correct"])
    return p["ans"]

def prob(i, p, v2):
    o = [f'<div class="pb"><div class="top"><span class="qn">{i}</span><span class="ty {p["t"]}">{TYN[p["t"]]}</span></div>']
    o.append(f'<div class="row" style="align-items:center"><div class="stem">{p["stem"]}')
    if p["t"] in ("mc", "sa"):
        keep = [k for k in range(len(p["opts"])) if not (v2 and LET[k] in p["drop"])]
        assert all(LET.index(cc) in keep for cc in (p["correct"] if p["t"] == "sa" else [p["correct"]])), "Version 2 dropped a correct choice"
        sq = " sq" if p["t"] == "sa" else ""
        o.append(f'<div class="opts" style="grid-template-columns:repeat({p["cols"]},1fr)">' + "".join(f'<div class="opt{sq}"><span class="l">{LET[k]}</span><span class="{"" if p["cols"] == 1 else "m"}">{p["opts"][k]}</span></div>' for k in keep) + "</div>")
        if v2 and p["t"] == "sa": o.append(f'<div class="tiny" style="margin-top:3px"><b>Choose {len(p["correct"])}.</b></div>')
    o.append("</div>")
    if p.get("fig"): o.append(f'<div style="flex:0 0 auto;display:flex;justify-content:center">{p["fig"]}</div>')
    o.append("</div>")
    if v2 and p.get("start"): o.append(f'<div class="start"><b>Start here:</b> {p["start"]}</div>')
    o.append("</div>")
    return "".join(o)

def card(act, n, st, v2):
    h = (f'<div class="sc-hd"><div class="num">STATION<b>{n}</b></div><div class="t"><div class="k">{act["name"]}</div><h1>{st["title"]}</h1><div class="s">{st["std"]} • about 8 minutes</div></div>'
         + ('<div class="v">Version<br>2</div>' if v2 else "") + "</div>")
    h += '<div class="dir"><b>Directions:</b> Work with your group. Show your work and write each answer in the <b>Station ' + str(n) + '</b> box on your recording sheet.</div>'
    if v2: h += f'<div class="hint"><div class="h">REMEMBER</div>{st["hint"]}</div>'
    if st.get("fig"): h += f'<div class="card ctr" style="margin:0 0 8px"><div style="display:flex;justify-content:center">{st["fig"](v2)}</div><div class="tiny">{st["figcap"]}</div></div>'
    h += "".join(prob(i + 1, p, v2) for i, p in enumerate(st["probs"]))
    return f'<div class="v2" data-fit>{h}</div>'

def recording(act):
    def box(n, st):
        cells = "".join(f'<div class="rs-cell"><span class="n">{i}</span><div class="a">Answer:</div></div>' for i in range(1, 5))
        return (f'<div class="rs-box"><div class="h"><span>STATION {n}</span>{st["title"]}</div><div class="rs-grid">{cells}</div>'
                '<div class="rate">How did it go? &nbsp;☐ I got it &nbsp; ☐ Almost &nbsp; ☐ I need help</div></div>')
    pages = []
    for half in (0, 1):
        hd = kit.page_head(act["name"] + " • Recording Sheet", act["title"], f'Side {half + 1} • Stations {half*3 + 1}–{half*3 + 3}', name=(half == 0))
        pages.append(f'<div data-fit>{hd}{"".join(box(half*3 + k + 1, act["stations"][half*3 + k]) for k in range(3))}</div>')
    return pages

def answer_key(act):
    rows = []
    for n, st in enumerate(act["stations"], 1):
        for i, p in enumerate(st["probs"], 1):
            rows.append(f'<tr><td><b>{n}.{i}</b></td><td class="ans">{key_of(p)}</td><td class="tiny">{p.get("why", "")}</td></tr>')
    hd = kit.page_head(act["name"], act["title"], "Answer key — for Mr. Allen only. Version 2 has the same answers.", key=True)
    return [f'<div data-fit>{hd}<table class="t key"><tr><th>#</th><th>Answer</th><th>Work / note</th></tr>{"".join(rows)}</table></div>']

# ═════════════════════ A. CHECK-IN REVIEW (NS.1, EE.1, EE.7) ═════════════════════
def P(b, e): return f"{b}{sup(e)}"
def lin_solve(a, b, c, d):            # ax + b = cx + d
    return F(d - b, a - c)

def checkin():
    S = []
    # Station 1 — rational or irrational
    s1 = [SA("Select <b>all</b> the irrational numbers.", [rt(25), rt(12), rep("4"), "π", f"{M}{fr(7,3)}", "0.1010010001…"], ["B", "D", "F"], "E",
             start=f"{rt(25)} = 5, so A is rational. Check each square root: is the number a perfect square?", cols=3),
          MC("Which number is <b>rational</b>?", [rt(8), f"{fr('π', 2)}", rt(fr(4, 9)), rt(50)], "C", "D", start=f"Try {rt(fr(4,9))}: what number times itself is {fr(4,9)}?"),
          NE("Write <b>R</b> (rational) or <b>I</b> (irrational) for each number, in order:<div class='m big' style='margin-top:9px;word-spacing:6px'>" + f"{rt(81)} &nbsp;&nbsp; 3.14 &nbsp;&nbsp; {rt(3)} &nbsp;&nbsp; 0.1{rep('2','')[1:]}" + "</div>", "R, R, I, R",
             start=f"{rt(81)} = 9 → R. Now do the other three."),
          FE(f"Jordan says, “{rt(36)} is irrational because it has a square root sign.” Explain Jordan's mistake.", f"{rt(36)} = 6 = 6/1, so it is rational",
             start=f"What is {rt(36)}? Can that number be written as a fraction?")]
    s1[0]["why"] = f"{rt(12)}, π, 0.1010010001… never stop or repeat; {rt(25)} = 5"
    s1[1]["why"] = f"{rt(fr(4,9))} = 2/3"; s1[2]["why"] = f"{rt(81)} = 9; 3.14 stops; {rt(3)} not a perfect square; 0.1{rep('2','')[1:]} repeats"
    s1[3]["why"] = "A square root of a perfect square is rational"
    assert F(2, 3)**2 == F(4, 9) and 9**2 == 81 and int(math.isqrt(12))**2 != 12 and int(math.isqrt(8))**2 != 8 and int(math.isqrt(50))**2 != 50
    S.append(dict(title="Rational or Irrational?", std="NC.8.NS.1", probs=s1,
                  hint=f"<b>Rational:</b> can be a fraction. The decimal <b>stops</b> or <b>repeats</b>. <b>Irrational:</b> decimal never stops and never repeats (π, {rt(2)}). "
                       f"A square root is rational only if the number is a <b>perfect square</b> (1, 4, 9, 16, 25, 36, 49, 64, 81, 100)."))
    # Station 2 — 9's rule
    assert F(7, 9) == F(7, 9) and F(45, 99) == F(5, 11) and F(27, 99) == F(3, 11) and 2 + F(6, 9) == F(8, 3)
    s2 = [NE(f"Write {rep('7')} as a fraction.", "7/9", start="7 repeats. One repeating digit → one 9 on the bottom."),
          NE(f"Write {rep('45')} as a fraction in simplest form.", "5/11", start=f"Top: 45. Bottom: 99. Now divide top and bottom by 9."),
          MC(f"Which fraction is equal to {rep('27')}?", [fr(27, 100), fr(27, 90), fr(3, 11), fr(2, 7)], "C", "B", start=f"{rep('27')} = {fr(27,99)}. Simplify: divide by 9."),
          NE(f"Write {rep('6', '2')} as a mixed number in simplest form.", "2 2/3", start=f"Keep the 2. Then {rep('6')} = {fr(6,9)}. Simplify {fr(6,9)}.")]
    s2[0]["why"] = "one repeating digit → 9"; s2[1]["why"] = "45/99 ÷ 9 = 5/11"; s2[2]["why"] = "27/99 = 3/11 (27/100 is the stop-decimal mistake)"; s2[3]["why"] = "2 + 6/9 = 2 2/3"
    S.append(dict(title="Repeating Decimals → Fractions", std="NC.8.NS.1 • the 9's rule", probs=s2,
                  hint="<b>The 9's rule:</b> 1) Top = the digits that repeat. 2) Bottom = one 9 for each repeating digit. 3) Simplify. A whole number in front stays in front.<br>"
                       f"<span class='m'>{rep('36')} → {fr(36,99)} = {fr(4,11)}</span>"))
    # Station 3 — decimal expansions & true statements
    assert F(3, 8) == F(375, 1000) and F(5, 6) == F(8, 10) + F(1, 30)
    s3 = [NE(f"Write {fr(3,8)} as a decimal. Does it <b>stop</b> or <b>repeat</b>?", "0.375, it stops", start="Divide 3 ÷ 8. Put 3 inside the house and add zeros: 3.000"),
          NE(f"Write {fr(5,6)} as a decimal. Use a bar if it repeats.", f"0.8{rep('3','')[1:]}", start="Divide 5 ÷ 6. Watch for a remainder that keeps coming back."),
          SA("Select <b>all</b> the true statements.", ["Every integer is a rational number.", "Every rational number is an integer.", f"{rt(2)} is irrational.",
                                                      "0.333… is irrational because it never ends.", "A decimal that stops is rational."], ["A", "C", "E"], "B", cols=1,
             start="Test each one. Example for A: is 5 = 5/1 a fraction?"),
          FE("Marcus says 0.36 = 36/99. (There is <b>no</b> bar. The decimal stops.) Find his mistake and fix it.", "0.36 stops, so it is 36/100 = 9/25. The 9's rule is only for repeating decimals.",
             start="Read 0.36 out loud: “36 hundredths.” What fraction is that?")]
    s3[0]["why"] = "3 ÷ 8 = 0.375, remainder 0"; s3[1]["why"] = "5 ÷ 6 = 0.8333…"; s3[2]["why"] = "B false (1/2); D false (repeats → rational)"; s3[3]["why"] = "36/100 = 9/25"
    assert F(36, 100) == F(9, 25)
    S.append(dict(title="Decimals and Number Facts", std="NC.8.NS.1", probs=s3,
                  hint="<b>Fraction → decimal:</b> divide top ÷ bottom. Remainder 0 → the decimal <b>stops</b>. A remainder that comes back → it <b>repeats</b>.<br>"
                       "Every integer is rational (7 = 7/1). Repeating decimals are rational."))
    # Station 4 — exponents
    assert F(2)**-3 * F(2)**5 == 4 and F(4)**-2 == F(2)**-4 == F(1, 2)**4 == F(16)**-1 == F(1, 16) and -(2**4) == -16 and F(8)**-2 == F(1, 64)
    s4 = [NE(f"What is the value of {P(2,-3)} · {P(2,5)}?", "4", start=f"Same base → add the exponents: {M}3 + 5 = ?"),
          SA(f"Select <b>all</b> the expressions equal to {fr(1,16)}.", [P(4, -2), P(2, -4), f"{M}{P(2,4)}", f"({fr(1,2)}){sup(4)}", P(16, -1), P(8, -2)], ["A", "B", "D", "E"], "F",
             start=f"A negative exponent means flip: {P(4,-2)} = {fr(1, P(4,2))} = {fr(1,16)}. Check the rest.", cols=3),
          NE(f"Simplify. Use positive exponents. &nbsp;<span class='m big'>{fr(f'(3{P(chr(120),4)}){sup(2)}', P('x', 3))}</span>", f"9{P('x',5)}", start=f"Power of a product first: (3{P('x',4)}){sup(2)} = 9{P('x',8)}"),
          FE(f"Ana says {P(6,0)} · {P(6,-2)} = {P(6,-2)} = {M}36. Find her mistake.", f"{P(6,-2)} = {fr(1,36)}, not {M}36. Answer: {fr(1,36)}", start=f"{P(6,0)} = 1. What does a negative exponent mean?")]
    s4[0]["why"] = f"{P(2,2)} = 4"; s4[1]["why"] = f"{M}{P(2,4)} = {M}16; {P(8,-2)} = 1/64"; s4[2]["why"] = f"9{P('x',8)} ÷ {P('x',3)} = 9{P('x',5)}"; s4[3]["why"] = "negative exponent → flip, not negative"
    S.append(dict(title="Exponent Rules", std="NC.8.EE.1", probs=s4,
                  hint=f"Multiply same base → <b>add</b> exponents. Divide → <b>subtract</b>. Power of a power → <b>multiply</b>. "
                       f"<b>{P('a',0)} = 1.</b> Negative exponent → <b>flip</b>: {P(2,-3)} = {fr(1, P(2,3))} = {fr(1,8)}"))
    # Station 5 — equations: watch the signs
    assert lin_solve(-3, 7, 0, 10) == -1 and lin_solve(5, -5, -3, -21) == -2 and lin_solve(1, -6, 0, -9) == -3 and lin_solve(-2, 7, 0, 15) == -4
    s5 = [NE(f"Solve. &nbsp;<span class='m big'>{M}3x + 7 = 10</span>", f"x = {M}1", start=f"Subtract 7 from both sides: {M}3x = 3. Now divide by {M}3."),
          NE(f"Solve. &nbsp;<span class='m big'>5(x {M} 1) = {M}3(x + 7)</span>", f"x = {M}2", start=f"Distribute both sides: 5x {M} 5 = {M}3x {M} 21"),
          NE(f"Solve. &nbsp;<span class='m big'>{M}2(3 {M} x) {M} x = {M}9</span>", f"x = {M}3", start=f"Distribute the {M}2: {M}6 + 2x {M} x = {M}9"),
          FE(f"Find the error. Then solve correctly.<br><span class='m'>7 {M} 2x = 15<br>{M}2x = 22<br>x = {M}11</span>", f"Should subtract 7: {M}2x = 8, so x = {M}4",
             start="To undo +7, do you add 7 or subtract 7?")]
    s5[0]["why"] = f"{M}3x = 3 → x = {M}1 (sign error gives 1)"; s5[1]["why"] = f"5x {M} 5 = {M}3x {M} 21 → 8x = {M}16"; s5[2]["why"] = f"x {M} 6 = {M}9"; s5[3]["why"] = f"{M}2x = 8 → x = {M}4"
    S.append(dict(title="Equations: Watch the Signs", std="NC.8.EE.7", probs=s5,
                  hint=f"Do the <b>opposite</b> to both sides. A negative times a negative is <b>positive</b>: {M}2 · {M}3 = 6. "
                       f"Distribute to <b>every</b> term: {M}2(x + 5) = {M}2x {M} 10. <b>Check</b> your answer by putting it back in."))
    # Station 6 — decimals, fractions, how many solutions
    assert F(132, 100) - F(12, 10) == F(12, 100) and F(12, 100) / F(4, 10) == F(3, 10) and (6 + 4) * F(3, 2) == 15 and lin_solve(F(1, 10), 25, F(25, 100), 10) == 100
    s6 = [NE(f"Solve. &nbsp;<span class='m big'>0.4x + 1.2 = 1.32</span>", "x = 0.3", start="Subtract 1.2: 0.4x = 0.12. Now divide 0.12 ÷ 0.4. Line up the decimals!"),
          NE(f"Solve. &nbsp;<span class='m big'>{fr(2,3)}x {M} 4 = 6</span>", "x = 15", start=f"Add 4: {fr(2,3)}x = 10. Then multiply both sides by the flip, {fr(3,2)}."),
          NE("How many solutions? Write <b>one</b>, <b>none</b>, or <b>infinitely many</b> for each.<br>"
             f"<span class='m'>a) 2(x + 5) = 2x + 10 &nbsp;&nbsp; b) 3x + 4 = 3x {M} 1 &nbsp;&nbsp; c) 5x {M} 2 = 3x + 8</span>", "a) infinitely many  b) none  c) one (x = 5)",
             start="Simplify each side. Same x-terms and same numbers → infinitely many. Same x-terms, different numbers → none."),
          NE("Plan A costs $25 plus $0.10 per text. Plan B costs $10 plus $0.25 per text. For how many texts do the plans cost the same?", "100 texts",
             start="Write: 25 + 0.10t = 10 + 0.25t. Get the t's on one side.")]
    assert 5*5 - 2 == 3*5 + 8
    s6[0]["why"] = "0.12 ÷ 0.4 = 0.3 (3 is the place-value mistake)"; s6[1]["why"] = f"{fr(2,3)}x = 10 → x = 15"; s6[2]["why"] = "a) both sides 2x + 10; b) 4 ≠ −1; c) 2x = 10"; s6[3]["why"] = "15 = 0.15t → t = 100; both cost $35"
    assert 25 + F(1, 10) * 100 == 35 == 10 + F(25, 100) * 100
    S.append(dict(title="Decimals, Fractions, and How Many Solutions", std="NC.8.EE.7", probs=s6,
                  hint=f"<b>Fractions:</b> multiply by the flip ({fr(2,3)} → {fr(3,2)}). <b>Decimals:</b> line up the decimal points. 0.12 ÷ 0.4 = 1.2 ÷ 4.<br>"
                       "<b>x's cancel?</b> True (3 = 3) → infinitely many. False (2 = 5) → none."))
    return dict(slug="Checkin_Review_Stations", name="NC Check-In Review Stations", title="NC Check-In Review: Real Numbers, Exponents, Equations", stations=S)

# ═════════════════════ B. EQUATIONS + ANGLE RELATIONSHIPS ═════════════════════
def tx(x, y, t, col=NV, fs=10.5, anchor="middle"):
    return f'<text x="{x:.1f}" y="{y:.1f}" font-size="{fs}" font-weight="800" fill="{col}" text-anchor="{anchor}" font-family="Inter">{t}</text>'

def fig_vertical(a, b):
    cx, cy = 85, 45
    return svg(170, 90, sector(cx, cy, 20, 30, 150, BL) + sector(cx, cy, 20, 210, 330, OR) + "".join(ray(cx, cy, 70, ang) for ang in (30, 150, 210, 330))
               + tx(cx, cy - 26, a, BL) + tx(cx, cy + 34, b, OR))
def fig_linear(a, b, split=55):
    cx, cy = 85, 70
    return svg(175, 85, sector(cx, cy, 22, 0, split, OR) + sector(cx, cy, 26, split, 180, BL) + ray(cx, cy, 80, 0) + ray(cx, cy, 80, 180) + ray(cx, cy, 68, split)
               + tx(cx + 52, cy - 10, b, OR) + tx(cx - 40, cy - 30, a, BL))
def fig_comp(a, b, split=40):
    cx, cy = 30, 85
    return svg(165, 95, sector(cx, cy, 34, 0, split, OR) + sector(cx, cy, 38, split, 90, BL) + f'<rect x="{cx}" y="{cy-11}" width="11" height="11" fill="none" stroke="{NV}" stroke-width="1.4"/>'
               + ray(cx, cy, 120, 0) + ray(cx, cy, 80, 90) + ray(cx, cy, 105, split) + tx(cx + 92, cy - 22, b, OR) + tx(cx + 40, cy - 58, a, BL, anchor="start"))
def fig_triangle(A_, B_, labels, ext=None):
    """angles at left A_, right B_ (degrees); labels: (left, right, top, exterior)"""
    t1, t2 = math.radians(A_), math.radians(B_)
    base = min(170, 92 * (math.tan(t1) + math.tan(t2)) / (math.tan(t1) * math.tan(t2)))
    Lp, Rp = (95, 112), (95 + base, 112)
    xa = (Rp[0] - Lp[0]) * math.tan(t2) / (math.tan(t1) + math.tan(t2)); C = (Lp[0] + xa, Lp[1] - xa * math.tan(t1))
    s = f'<polygon points="{Lp[0]},{Lp[1]} {Rp[0]},{Rp[1]} {C[0]:.1f},{C[1]:.1f}" fill="#EEF2FF" stroke="{NV}" stroke-width="2"/>'
    s += sector(*Lp, 22, 0, A_, BL) + sector(*Rp, 22, 180 - B_, 180, OR)
    dCA = math.degrees(math.atan2(-(Lp[1] - C[1]), Lp[0] - C[0])) % 360; dCB = math.degrees(math.atan2(-(Rp[1] - C[1]), Rp[0] - C[0])) % 360
    s += sector(C[0], C[1], 16, dCA, dCB, PU)
    s += tx(Lp[0] + 4, Lp[1] + 16, labels[0], BL, anchor="start") + tx(Rp[0] - 4, Rp[1] + 16, labels[1], OR, anchor="end") + tx(C[0] - 12, C[1] + 12, labels[2], PU, anchor="end")
    w = Rp[0] + 25
    if ext:
        s += f'<line x1="{Rp[0]}" y1="{Rp[1]}" x2="{Rp[0]+40}" y2="{Rp[1]}" stroke="{NV}" stroke-width="2"/>' + sector(*Rp, 15, 0, 180 - B_, TE) + tx(Rp[0] + 14, Rp[1] - 22, ext, TE, anchor="start"); w = Rp[0] + 85
    return svg(w, 132, s)

def fig_trans(marks, color=True):
    """parallel lines cut by a transversal (same layout as the Units 4–5 anchor chart); marks: {angle#: text}"""
    W, H, t = 270, 160, 60
    p1 = (150, 48); dy = 66; p2 = (p1[0] - dy / math.tan(math.radians(t)), p1[1] + dy)
    b = [f'<line x1="10" y1="{p1[1]}" x2="{W-10}" y2="{p1[1]}" stroke="{NV}" stroke-width="2"/>', f'<line x1="10" y1="{p2[1]}" x2="{W-10}" y2="{p2[1]}" stroke="{NV}" stroke-width="2"/>']
    x0, y0 = _pt(*p1, 52, t); x1, y1 = _pt(*p2, 52, 240)
    b.append(f'<line x1="{x0:.1f}" y1="{y0:.1f}" x2="{x1:.1f}" y2="{y1:.1f}" stroke="{NV}" stroke-width="2"/>')
    for (cx, cy), base in ((p1, 0), (p2, 4)):
        for k, (a1, a2) in enumerate([(60, 180), (0, 60), (180, 240), (240, 360)]):
            n = base + k + 1; col = (OR if k in (0, 3) else BL) if color else NV
            if n in marks: b.append(sector(cx, cy, 15, a1, a2, col, .35))
            b.append(lab(cx, cy, 25, (a1 + a2) / 2, str(n), col, 10.5))
    for y in (p1[1], p2[1]): b.append(f'<path d="M{W-42},{y-5} L{W-34},{y} L{W-42},{y+5}" fill="none" stroke="{NV}" stroke-width="1.6"/>')
    b.append(tx(W - 16, p1[1] - 5, "p", NV, 12) + tx(W - 16, p2[1] - 5, "q", NV, 12) + tx(x0 + 8, y0 + 10, "t", NV, 12))
    return svg(W, H, "".join(b))

def eqang():
    S = []
    chk = lambda f, x: f(x)
    # Station 1 — multi-step equations
    assert lin_solve(3, 12, 0, 27) == 5 and lin_solve(6, 5, 0, 41) == 6 and lin_solve(-8, 4, 0, 28) == -3 and lin_solve(5, -15, 0, 20) == 7
    s1 = [NE("Solve. &nbsp;<span class='m big'>3(x + 4) = 27</span>", "x = 5", start="Distribute: 3x + 12 = 27"),
          NE("Solve. &nbsp;<span class='m big'>2x + 5 + 4x = 41</span>", "x = 6", start="Combine like terms: 2x + 4x = 6x"),
          NE(f"Solve. &nbsp;<span class='m big'>{M}4(2x {M} 1) = 28</span>", f"x = {M}3", start=f"Distribute the {M}4 to both terms: {M}8x + 4 = 28"),
          FE(f"Find the error. Then solve correctly.<br><span class='m'>5(x {M} 3) = 20<br>5x {M} 3 = 20<br>5x = 23</span>", f"Distribute to every term: 5x {M} 15 = 20, so x = 7",
             start="Multiply the 5 by <b>both</b> terms inside the ( ).")]
    for p, w in zip(s1, ["3x = 15", "6x = 36", f"{M}8x = 24", "5x = 35"]): p["why"] = w
    S.append(dict(title="Multi-Step Equations", std="NC.8.EE.7", probs=s1,
                  hint="<b>Steps:</b> 1) Distribute. 2) Combine like terms. 3) Undo + or −. 4) Undo × or ÷. <b>Check</b> by putting your answer back in."))
    # Station 2 — variables on both sides
    assert lin_solve(7, -3, 4, 12) == 5 and lin_solve(6, 2, 4, -8) == -5
    s2 = [NE("Solve. &nbsp;<span class='m big'>7x − 3 = 4x + 12</span>".replace("−", M), "x = 5", start="Subtract 4x from both sides: 3x − 3 = 12".replace("−", M)),
          NE(f"Solve. &nbsp;<span class='m big'>2(3x + 1) = 4x {M} 8</span>", f"x = {M}5", start=f"Distribute: 6x + 2 = 4x {M} 8. Then subtract 4x."),
          MC("How many solutions does this equation have? &nbsp;<span class='m big'>6x + 9 = 3(2x + 3)</span>", ["one solution", "no solution", "infinitely many solutions", "two solutions"], "C", "D", cols=1,
             start="Distribute the right side: 3(2x + 3) = 6x + 9. Compare the two sides."),
          NE("What value of <b>c</b> makes this equation have <b>infinitely many</b> solutions? &nbsp;<span class='m big'>4x + c = 2(2x + 3)</span>", "c = 6",
             start="Distribute: 2(2x + 3) = 4x + 6. Both sides must match exactly.")]
    for p, w in zip(s2, ["3x = 15", f"2x = {M}10", "both sides 6x + 9", "4x + 6 = 4x + 6"]): p["why"] = w
    S.append(dict(title="Variables on Both Sides", std="NC.8.EE.7", probs=s2,
                  hint="Move the <b>smaller</b> x-term so x is on one side. <b>x's cancel?</b> A true statement (9 = 9) → infinitely many. A false one (2 = 5) → no solution."))
    # Station 3 — word problems
    assert lin_solve(3, 8, 0, 20) == 4 and lin_solve(4, 0, 0, 48) == 12 and lin_solve(10, 40, 15, 20) == 4 and lin_solve(4, 6, 0, 34) == 7
    s3 = [NE("A movie ticket costs $8. Snacks cost $3 each. Kai spent $20 in all. How many snacks did Kai buy?", "4 snacks", start="Let s = snacks. 8 + 3s = 20"),
          NE("A number plus 3 times the number is 48. What is the number?", "12", start="Let n = the number. n + 3n = 48"),
          NE("Gym A costs $40 to join plus $10 per month. Gym B costs $20 to join plus $15 per month. After how many months do they cost the same?", "4 months",
             start="40 + 10m = 20 + 15m"),
          NE("A rectangle's length is 3 cm more than its width. The perimeter is 34 cm. Find the width and the length.", "width 7 cm, length 10 cm",
             start="Width = w. Length = w + 3. Perimeter: w + w + 3 + w + w + 3 = 34")]
    for p, w in zip(s3, ["3s = 12", "4n = 48", "20 = 5m; both $80", "4w + 6 = 34 → w = 7"]): p["why"] = w
    assert 40 + 10*4 == 80 == 20 + 15*4
    S.append(dict(title="Equation Word Problems", std="NC.8.EE.7", probs=s3,
                  hint="1) Name the variable. 2) <b>Per / each</b> → the number times the variable. <b>Start / join fee</b> → the number added. 3) Write the equation. 4) Solve. 5) Answer in a sentence."))
    # Station 4 — angle pairs
    assert lin_solve(3, 10, 0, 55) == 15 and lin_solve(2, 100, 0, 180) == 40 and lin_solve(3, -6, 0, 90) == 32 and 90 - 35 == 55
    s4 = [NE("These are vertical angles. Find x.", "x = 15", start="Vertical angles are equal: 3x + 10 = 55", fig=fig_vertical("(3x + 10)°", "55°")),
          NE("These angles form a linear pair. Find x.", "x = 40", start="A linear pair adds to 180°: (2x + 30) + 70 = 180", fig=fig_linear("(2x + 30)°", "70°", 70)),
          NE("These angles are complementary. Find x. Then find both angles.", "x = 32; angles 32° and 58°", start="Complementary angles add to 90°: x + (2x − 6) = 90".replace("−", M),
             fig=fig_comp("x°", f"(2x {M} 6)°", 58)),
          FE("Two angles are complementary. One angle is 35°. Jo says the other angle is 145°. What did Jo do wrong? Find the right angle.", "Jo used 180 (supplementary). Complementary = 90: the angle is 55°",
             start="Complementary angles add to ___°.")]
    for p, w in zip(s4, ["3x = 45", "2x = 80", f"3x {M} 6 = 90 → 3x = 96", "90 − 35 = 55".replace("−", M)]): p["why"] = w
    assert 2*32 - 6 == 58
    S.append(dict(title="Angle Pairs", std="NC.8.G.5", probs=s4,
                  hint="<b>Vertical</b> angles are <b>equal</b>. <b>Linear pair</b> → add to <b>180°</b>. <b>Complementary</b> → add to <b>90°</b>. <b>Supplementary</b> → add to <b>180°</b>.<br>Write the equation, then solve for x."))
    # Station 5 — parallel lines + transversal (angles 2,3,6,7 acute; 1,4,5,8 obtuse in this picture)
    assert lin_solve(4, 5, 5, -10) == 15 and 4*15 + 5 == 65 and lin_solve(5, 30, 0, 180) == 30 and 2*30 + 15 == 75 and 3*30 + 15 == 105
    s5 = [NE("Lines p and q are parallel. ∠1 = 115°. Find ∠8.", "115°", start="∠1 and ∠8 are alternate exterior angles. Are they equal or do they add to 180°?"),
          NE("∠1 = 115°. Find ∠6.", "65°", start="∠6 is a different size from ∠1 (orange vs blue). Blue + orange = 180°."),
          NE("∠3 = (4x + 5)° and ∠6 = (5x − 10)°. Find x. Then find ∠3.".replace("−", M), "x = 15; ∠3 = 65°", start="Alternate interior angles are equal: 4x + 5 = 5x − 10".replace("−", M)),
          NE("∠3 = (2x + 15)° and ∠5 = (3x + 15)°. Find x. Then find both angles.", "x = 30; ∠3 = 75°, ∠5 = 105°",
             start="Same-side interior angles add to 180°: (2x + 15) + (3x + 15) = 180")]
    for p, w in zip(s5, ["alternate exterior → equal", "180 − 115 = 65".replace("−", M), "x = 15 → 4(15) + 5", "5x + 30 = 180"]): p["why"] = w
    S.append(dict(title="Parallel Lines and a Transversal", std="NC.8.G.5", probs=s5, fig=lambda v2: fig_trans({}, v2),
                  figcap="Lines p and q are parallel. Line t is a transversal. Use this picture for every problem.",
                  hint="<b>Only 2 sizes!</b> Same color = <b>equal</b>. Different colors <b>add to 180°</b>.<br>Corresponding, alternate interior, alternate exterior → <b>equal</b>. Same-side interior → <b>add to 180°</b>."))
    # Station 6 — triangles
    assert 180 - 48 - 67 == 65 and lin_solve(6, 0, 0, 180) == 30 and 38 + 71 == 109 and lin_solve(5, 2, 2, 62) == 20 and 2*20 + 10 + 52 == 5*20 + 2 == 102
    s6 = [NE("Find x.", "x = 65", start="The 3 angles add to 180°: 48 + 67 + x = 180", fig=fig_triangle(48, 67, ("48°", "67°", "x°"))),
          NE("The angles of a triangle are x°, 2x°, and 3x°. Find x. What is the largest angle?", "x = 30; largest = 90°", start="x + 2x + 3x = 180"),
          NE("Find the exterior angle y.", "y = 109°", start="Exterior angle = the 2 far inside angles added: 38 + 71", fig=fig_triangle(38, 71, ("38°", "71°", ""), "y°")),
          NE("Find x. Then find the exterior angle.", "x = 20; exterior angle = 102°", start="Exterior = the 2 far inside angles: 5x + 2 = (2x + 10) + 52",
             fig=fig_triangle(52, 78, ("52°", "", "(2x + 10)°"), "(5x + 2)°"))]
    for p, w in zip(s6, ["115 + x = 180", "6x = 180; 3(30) = 90", "38 + 71", "3x = 60; 5(20) + 2"]): p["why"] = w
    assert 180 - 52 - 50 == 78   # picture: top angle 2x + 10 = 50, so right angle = 78
    S.append(dict(title="Triangle Angles", std="NC.8.G.5", probs=s6,
                  hint="The 3 angles inside a triangle <b>add to 180°</b>. An <b>exterior angle</b> = the 2 far inside angles added together."))
    return dict(slug="Equations_Angles_Stations", name="Equations and Angles Stations", title="Solving Equations and Angle Relationships", stations=S)

# ── build ──────────────────────────────────────────────
def build(act):
    out = {}
    base = os.path.join(kit.OUT, act["slug"])
    out["cards"] = kit.render([card(act, n, st, False) for n, st in enumerate(act["stations"], 1)], base + "_Cards.pdf", footer=act["name"], fit=True)
    out["cards2"] = kit.render([card(act, n, st, True) for n, st in enumerate(act["stations"], 1)], base + "_Cards_Version2.pdf", footer=act["name"] + " • Version 2", fit=True)
    out["rec"] = kit.render(recording(act), base + "_Recording_Sheet.pdf", footer=act["name"] + " • Recording Sheet", fit=True)
    out["key"] = kit.render(answer_key(act), base + "_AnswerKey.pdf", footer=act["name"] + " • ANSWER KEY", fit=True)
    return out

if __name__ == "__main__":
    which = sys.argv[1:] or ["checkin", "eqang"]
    for w in which:
        r = build({"checkin": checkin, "eqang": eqang}[w]())
        for k, v in r.items(): print(k, v)
