import sys, os
sys.path.insert(0, os.path.dirname(__file__))
from kit import *
from fractions import Fraction as F

R, I = "Rational", "Irrational"
def rep(d, whole="0"): return f'{whole}.<span class="bar">{d}</span>'
def nines(d):            # 9's rule: repeating block d right after the point
    return F(int(d), int("9" * len(d)))
def frs(f):              # fraction display
    f = F(f); return neg(f.numerator) if f.denominator == 1 else fr(neg(f.numerator), f.denominator)
def x(e, b="x"): return f"{b}{sup(e)}"
def pw(b, e): return f"{b}{sup(e)}"

# verification helpers for exponent answers: evaluate both forms at sample values
def same(f1, f2):
    for v in (F(2), F(3), F(-2), F(1, 2)):
        if f1(v) != f2(v): return False
    return True

BR = []   # each: dict(title, remember, A: [(q, ans)], A_dir, B: [(q, ans)], B_dir)

# ── 1 rational vs irrational
BR.append(dict(title="Rational or Irrational?", rem="<b>Rational</b>: can be written as a fraction. The decimal <b>stops</b> or <b>repeats</b>. &nbsp; <b>Irrational</b>: the decimal <b>never stops and never repeats</b> (like π or √2). The square root of a perfect square (1, 4, 9, 16, 25, 36, 49, 64, 81, 100…) is rational.",
  A_dir="Circle <b>Rational</b> or <b>Irrational</b>. Then tell why.", A_kind="RI",
  A=[("√<span class='rad'>36</span>", R, "√36 = 6, a whole number"), ("√<span class='rad'>15</span>", I, "15 is not a perfect square"), ("0.75", R, "it stops: 75/100"), ("π", I, "never stops, never repeats")],
  B_dir="Circle <b>R</b> (rational) or <b>I</b> (irrational).", B_kind="ri",
  B=[(fr(2, 3), R, ""), ("√<span class='rad'>2</span>", I, ""), (rep("16"), R, ""), ("3.14", R, "(it stops)"), ("√<span class='rad'>81</span>", R, "(= 9)"), ("√<span class='rad'>50</span>", I, "")]))
# ── 2 true/false about the number system
BR.append(dict(title="Rational or Irrational? Part 2", rem="Perfect squares: 1, 4, 9, 16, 25, 36, 49, 64, 81, 100. If the number under √ is a perfect square, the root is <b>rational</b>. If not, it is <b>irrational</b>. A repeating decimal is <b>rational</b>, even though it goes on forever.",
  A_dir="Is the square root rational? Circle <b>Rational</b> or <b>Irrational</b>. Then tell why.", A_kind="RI",
  A=[("√<span class='rad'>49</span>", R, "√49 = 7"), ("√<span class='rad'>48</span>", I, "48 is not a perfect square"), ("√<span class='rad'>100</span>", R, "√100 = 10"), ("√<span class='rad'>12</span>", I, "12 is not a perfect square")],
  B_dir="Circle <b>True</b> or <b>False</b>.", B_kind="tf",
  B=[("Every integer is rational.", "True", "−5 = −5/1"), ("π = 3.14", "False", "3.14 is only close to π"), ("0.333… is irrational because it never ends.", "False", "it repeats, so it is rational (1/3)"),
     ("√64 is irrational.", "False", "√64 = 8"), ("A decimal that never stops and never repeats is irrational.", "True", ""), ("−9 is rational.", "True", "−9 = −9/1")]))
# ── 3 nine's rule, one digit
assert nines("5") == F(5, 9) and nines("3") == F(1, 3) and nines("6") == F(2, 3)
BR.append(dict(title="Repeating Decimals: The 9's Rule (1 digit)", rem="<b>The 9's Rule:</b> the repeating digits go on <b>top</b>. The bottom gets one <b>9</b> for each repeating digit. Then simplify. &nbsp; Example: " + rep("4") + " = " + fr(4, 9) + ". &nbsp; A decimal that <b>stops</b> uses place value instead: 0.4 = " + fr(4, 10) + " = " + fr(2, 5) + ".",
  A_dir="Use the 9's rule. Write each as a fraction in simplest form.", A_kind="ans",
  A=[(rep("5"), frs(nines("5")), ""), (rep("7"), frs(nines("7")), ""), (rep("3"), frs(nines("3")), "3/9 → simplify"), (rep("6"), frs(nines("6")), "6/9 → simplify")],
  B_dir="Write each as a fraction (simplest form) or as a decimal. Watch out: some decimals stop!", B_kind="ans",
  B=[(rep("2"), frs(nines("2")), ""), (rep("8"), frs(nines("8")), ""), (fr(4, 9) + " as a decimal", rep("4"), ""), (fr(1, 3) + " as a decimal", rep("3"), ""),
     ("0.25 <span class='small'>(stops)</span>", frs(F(25, 100)), "25/100"), ("0.4 <span class='small'>(stops)</span>", frs(F(4, 10)), "4/10")]))
# ── 4 nine's rule, two and three digits
for d, a in [("18", F(2, 11)), ("45", F(5, 11)), ("72", F(8, 11)), ("63", F(7, 11)), ("123", F(41, 333)), ("054", F(2, 37)), ("31", F(31, 99)), ("09", F(1, 11)), ("54", F(6, 11))]:
    assert nines(d) == a, d
BR.append(dict(title="Repeating Decimals: The 9's Rule (2 and 3 digits)", rem="Count the repeating digits. <b>2 digits → 99</b>. <b>3 digits → 999</b>. The repeating block goes on top. Then simplify. &nbsp; Example: " + rep("27") + " = " + fr(27, 99) + " = " + fr(3, 11) + " (÷ 9).",
  A_dir="Use the 9's rule. Write each as a fraction in simplest form.", A_kind="ans",
  A=[(rep(d), frs(nines(d)), f"{d}/99") for d in ("18", "45", "72", "63")],
  B_dir="Write each as a fraction in simplest form.", B_kind="ans",
  B=[(rep("123"), frs(nines("123")), "123/999 ÷ 3"), (rep("054"), frs(nines("054")), "54/999 ÷ 27"), (rep("31"), frs(nines("31")), "already simplest"),
     (rep("09"), frs(nines("09")), "9/99 ÷ 9"), ("0.444… <span class='small'>(only the 4 repeats)</span>", frs(nines("4")), "1 digit → 9"), (rep("54"), frs(nines("54")), "54/99 ÷ 9")]))
# ── 5 NS.1 mixed review + error analysis
assert nines("24") == F(8, 33) and nines("45") == F(5, 11) and F(12, 100) == F(3, 25)
BR.append(dict(title="Rational Numbers: Mixed Review", rem="Rational: stops or repeats (can be a fraction). Irrational: never stops, never repeats. 9's rule for repeating decimals; place value for decimals that stop.",
  A_dir="Circle <b>Rational</b> or <b>Irrational</b>. Then tell why.", A_kind="RI",
  A=[("√<span class='rad'>25</span>", R, "= 5"), (rep("6"), R, "it repeats (= 2/3)"), ("√<span class='rad'>3</span>", I, "3 is not a perfect square"), (fr(22, 7), R, "it is a fraction (only close to π)")],
  B_dir="Convert, or find the mistake and fix it.", B_kind="ans",
  B=[(rep("24") + " = ?", frs(nines("24")), "24/99 ÷ 3"), (rep("7") + " = ?", frs(nines("7")), ""),
     ("Ana: " + rep("45") + " = " + fr(45, 100), "It repeats: " + fr(45, 99) + " = " + fr(5, 11), ""), ("Ben: " + rep("8") + " = " + fr(8, 10), "Use 9's: " + fr(8, 9), ""),
     ("Cal: √20 is rational because 20 is a whole number.", "No: 20 is not a perfect square, so √20 is irrational.", ""), ("Dee: 0.12 (it stops) = " + fr(12, 99), "It stops: " + fr(12, 100) + " = " + fr(3, 25), "")]))

# ── 6 product and quotient rules
chk = [(lambda v: v**4 * v**2, lambda v: v**6), (lambda v: v**5 * v**3, lambda v: v**8), (lambda v: v**3 * v**-5, lambda v: 1 / v**2), (lambda v: v * v**4, lambda v: v**5),
       (lambda v: v**10 / v**3, lambda v: v**7), (lambda v: 12 * v**7 / (3 * v**2), lambda v: 4 * v**5), (lambda v: (4 * v**3) * (2 * v**6), lambda v: 8 * v**9), (lambda v: v**5 / v**5, lambda v: 1)]
assert all(same(a, b) for a, b in chk) and F(5)**2 / F(5)**6 == F(1, 625) and F(2)**-2 == F(1, 4) and F(7)**9 / F(7)**4 == F(7)**5
RULES = "<b>Multiply</b> same base → <b>add</b> exponents: a<sup>m</sup>·a<sup>n</sup> = a<sup>m+n</sup>. &nbsp; <b>Divide</b> → <b>subtract</b>: a<sup>m</sup> ÷ a<sup>n</sup> = a<sup>m−n</sup>. &nbsp; <b>Power to a power</b> → <b>multiply</b>: (a<sup>m</sup>)<sup>n</sup> = a<sup>mn</sup>. &nbsp; a<sup>0</sup> = 1. &nbsp; a<sup>−n</sup> = " + fr(1, "a<sup>n</sup>") + "."
BR.append(dict(title="Exponent Rules: Multiply and Divide", rem=RULES,
  A_dir="Simplify. Write your answer as one power (use positive exponents).", A_kind="ans",
  A=[(pw(3, 4) + " · " + pw(3, 2), pw(3, 6), "4 + 2"), (x(5) + " · " + x(3), x(8), "5 + 3"), (pw(2, 3) + " · " + pw(2, -5), pw(2, -2) + " = " + fr(1, 4), "3 + (−5) = −2"), ("a · " + x(4, "a"), x(5, "a"), "a = a<sup>1</sup>")],
  B_dir="Simplify. Use positive exponents.", B_kind="ans",
  B=[(pw(7, 9) + " ÷ " + pw(7, 4), pw(7, 5), "9 − 4"), (fr(x(10, "y"), x(3, "y")), x(7, "y"), "10 − 3"), (pw(5, 2) + " ÷ " + pw(5, 6), fr(1, pw(5, 4)), "2 − 6 = −4 → flip"),
     (fr("12" + x(7), "3" + x(2)), "4" + x(5), "12 ÷ 3, 7 − 2"), ("(4" + x(3, "m") + ")(2" + x(6, "m") + ")", "8" + x(9, "m"), "4 · 2, 3 + 6"), (fr(pw(6, 5), pw(6, 5)), "1", "6<sup>0</sup> = 1")]))
# ── 7 power rules
chk = [(lambda v: (v**4)**3, lambda v: v**12), (lambda v: (v**-2)**3, lambda v: 1 / v**6), (lambda v: (3 * v)**2, lambda v: 9 * v**2), (lambda v: (2 * v**3)**4, lambda v: 16 * v**12),
       (lambda v: (-2 * v)**3, lambda v: -8 * v**3), (lambda v: (-3 * v**4)**2, lambda v: 9 * v**8)]
assert all(same(a, b) for a, b in chk) and (F(2)**3)**2 == 64 and (F(5)**2)**-1 == F(1, 25)
BR.append(dict(title="Exponent Rules: Power to a Power", rem="<b>Power to a power</b> → <b>multiply</b> the exponents: (a<sup>m</sup>)<sup>n</sup> = a<sup>mn</sup>. &nbsp; <b>Power of a product</b> → give the power to <b>every</b> factor: (ab)<sup>n</sup> = a<sup>n</sup>b<sup>n</sup>. &nbsp; Don't forget the number in front: (2x)<sup>3</sup> = 8x<sup>3</sup>.",
  A_dir="Simplify. Use positive exponents.", A_kind="ans",
  A=[("(" + pw(2, 3) + ")" + sup(2), pw(2, 6) + " = 64", "3 × 2"), ("(" + x(4) + ")" + sup(3), x(12), "4 × 3"), ("(" + pw(5, 2) + ")" + sup(-1), pw(5, -2) + " = " + fr(1, 25), "2 × (−1)"), ("(" + x(-2, "y") + ")" + sup(3), fr(1, x(6, "y")), "−2 × 3 = −6 → flip")],
  B_dir="Simplify. Give the power to EVERY factor.", B_kind="ans",
  B=[("(3x)" + sup(2), "9" + x(2), "3² = 9"), ("(2" + x(3, "a") + ")" + sup(4), "16" + x(12, "a"), "2⁴ = 16"), ("(−2y)" + sup(3), "−8" + x(3, "y"), "(−2)³ = −8"),
     ("(x" + x(2, "y") + ")" + sup(5), x(5) + x(10, "y"), ""), ("(4" + x(2, "m") + "n)" + sup(2), "16" + x(4, "m") + x(2, "n"), ""), ("(−3" + x(4) + ")" + sup(2), "9" + x(8), "(−3)² = 9")]))
# ── 8 zero and negative exponents
assert F(8)**0 == 1 and F(-5)**0 == 1 and F(2)**-3 == F(1, 8) and F(10)**-2 == F(1, 100) and F(4)**-1 == F(1, 4) and F(7)**-2 * F(7)**2 == 1
assert same(lambda v: 3 * v**-2, lambda v: 3 / v**2) and same(lambda v: 1 / v**-3, lambda v: v**3) and same(lambda v: 5 * v**0, lambda v: 5)
BR.append(dict(title="Zero and Negative Exponents", rem="<b>Zero:</b> anything (not 0) to the 0 power is <b>1</b>: 9<sup>0</sup> = 1. &nbsp; <b>Negative:</b> flip it to the other side of the fraction bar: 3<sup>−2</sup> = " + fr(1, "3<sup>2</sup>") + " = " + fr(1, 9) + ". A negative exponent does <b>NOT</b> make a negative number.",
  A_dir="Find the value.", A_kind="ans",
  A=[(pw(8, 0), "1", ""), ("(−5)" + sup(0), "1", ""), (pw(2, -3), fr(1, 8), "1/2³"), (pw(10, -2), fr(1, 100), "1/10²")],
  B_dir="Rewrite with positive exponents, or find the value.", B_kind="ans",
  B=[(x(-4), fr(1, x(4)), ""), ("3" + x(-2, "y"), fr(3, x(2, "y")), "only y flips"), (fr(1, x(-3, "a")), x(3, "a"), "flip back up"),
     (pw(4, -1), fr(1, 4), ""), ("5" + x(0), "5", "5 · 1"), (pw(7, -2) + " · " + pw(7, 2), "1", "7<sup>0</sup> = 1")]))
# ── 9 equivalent expressions
eq26 = [("2" + sup(3) + " · 2" + sup(3), 3 + 3), ("(2" + sup(2) + ")" + sup(3), 2 * 3), ("2" + sup(9) + " ÷ 2" + sup(3), 9 - 3), ("2" + sup(2) + " · 2" + sup(3), 2 + 3), ("2" + sup(12) + " ÷ 2" + sup(2), 12 - 2), ("(2" + sup(3) + ")" + sup(3), 3 * 3)]
chk = [(lambda v: v**3 * v**-5, lambda v: 1 / v**2), (lambda v: (v**2)**3 * v**-4, lambda v: v**2), (lambda v: v**6 / v**9, lambda v: 1 / v**3), (lambda v: (3 * v**2)**2 * v**-1, lambda v: 9 * v**3),
       (lambda v: 10 * v**4 / (2 * v**6), lambda v: 5 / v**2), (lambda v: (v**0)**5, lambda v: 1)]
assert all(same(a, b) for a, b in chk)
BR.append(dict(title="Equivalent Expressions", rem=RULES,
  A_dir="Is it equal to 2<sup>6</sup>? Circle <b>Yes</b> or <b>No</b>.", A_kind="yn",
  A=[(q, "Yes" if e == 6 else "No", f"= 2{sup(e)}") for q, e in eq26],
  B_dir="Simplify. Use positive exponents.", B_kind="ans",
  B=[(x(3) + " · " + x(-5), fr(1, x(2)), "3 + (−5) = −2"), ("(" + x(2, "a") + ")" + sup(3) + " · " + x(-4, "a"), x(2, "a"), "6 + (−4)"), (fr(x(6, "m"), x(9, "m")), fr(1, x(3, "m")), "6 − 9 = −3"),
     ("(3" + x(2) + ")" + sup(2) + " · " + x(-1), "9" + x(3), "9x⁴ · x⁻¹"), (fr("10" + x(4), "2" + x(6)), fr(5, x(2)), "4 − 6 = −2"), ("(" + x(0, "y") + ")" + sup(5), "1", "y⁰ = 1")]))
# ── 10 mixed review + error analysis
assert F(3)**2 * F(3)**-4 == F(1, 9) and (F(5)**-1)**2 == F(1, 25) and F(4)**5 / F(4)**3 == 16 and F(6)**0 + F(6)**1 == 7
assert same(lambda v: (2 * v**-3)**2, lambda v: 4 / v**6) and F(-4)**0 - F(4)**0 == 0
BR.append(dict(title="Exponent Rules: Mixed Review", rem=RULES,
  A_dir="Find the value.", A_kind="ans",
  A=[(pw(3, 2) + " · " + pw(3, -4), fr(1, 9), "3⁻² = 1/9"), ("(" + pw(5, -1) + ")" + sup(2), fr(1, 25), "5⁻²"), (pw(4, 5) + " ÷ " + pw(4, 3), "16", "4²"), (pw(6, 0) + " + " + pw(6, 1), "7", "1 + 6")],
  B_dir="Find the mistake and fix it, or simplify.", B_kind="ans",
  B=[("Ray: " + pw(3, 2) + " · " + pw(3, 4) + " = " + pw(9, 6), "Keep the base: " + pw(3, 6), ""), ("Mia: " + pw(5, -2) + " = −25", "Flip it: " + fr(1, 25), ""),
     ("Lou: (" + x(3) + ")" + sup(4) + " = " + x(7), "Multiply: " + x(12), ""), ("Kim: 2" + x(0) + " = 1", "2 · 1 = 2", "only x is raised to 0"),
     ("(2" + x(-3) + ")" + sup(2), fr(4, x(6)), "4x⁻⁶"), ("(−4)" + sup(0) + " − " + pw(4, 0), "0", "1 − 1")]))

CSS_BR = """
.rem{background:#FFF6D6;border-left:5px solid #FFC107;border-radius:8px;padding:7px 12px;font-size:11pt;line-height:1.5;margin:0 0 9px}
.part{font:700 11.5pt Inter;color:#1E2D4F;margin:6px 0 5px}
.g4{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}
.g3{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
.c{border:1px solid #E3E5EA;border-radius:9px;padding:8px 10px;min-height:86px}
.cq{font:600 14pt/1.5 'Source Serif 4',Georgia,serif;color:#1E2D4F}
.cq.txt{font:500 11pt/1.4 Inter;color:#1B2333}
.n{display:inline-block;width:20px;height:20px;border-radius:5px;background:#1E2D4F;color:#FFC107;font:700 10pt/20px 'Source Serif 4';text-align:center;margin-right:6px;vertical-align:middle}
.o{display:inline-block;border:1.4px solid #1E2D4F;border-radius:999px;padding:0 9px;font:700 9.5pt/18px Inter;color:#1E2D4F;margin-right:5px}
.o.on{background:#15803D;border-color:#15803D;color:#fff}
.a{color:#15803D;font:700 13pt 'Source Serif 4',Georgia,serif}
.why{color:#15803D;font:600 9pt Inter}
.ln{display:inline-block;border-bottom:1.3px solid #1E2D4F;min-width:120px;height:16px;vertical-align:bottom}
"""

def cell(i, q, a, why, kind, key):
    txt = "txt" if (len(q) > 60 and "<span class='bar'>" not in q[:30]) or q[:4] in ("Ana:", "Ben:", "Cal:", "Dee:", "Ray:", "Mia:", "Lou:", "Kim:") or "." in q[-2:] else ""
    h = f'<div class="c"><div class="cq {txt}"><span class="n">{i}</span>{q}</div>'
    if kind in ("RI", "ri", "tf", "yn"):
        opts = {"RI": [R, I], "ri": ["R", "I"], "tf": ["True", "False"], "yn": ["Yes", "No"]}[kind]
        h += '<div style="margin-top:5px">' + "".join(f'<span class="o{" on" if key and (o == a or (kind == "ri" and o == a[0])) else ""}">{o}</span>' for o in opts) + '</div>'
        if kind == "RI": h += f'<div style="margin-top:6px">Why? {f"<span class=why>{why}</span>" if key else "<span class=ln style=min-width:140px></span>"}</div>'
        elif key and why: h += f'<div class="why" style="margin-top:4px">{why}</div>'
    else:
        h += (f'<div style="margin-top:5px"><span class="a">{a}</span>{f" <span class=why>({why})</span>" if why else ""}</div>' if key
              else '<div style="margin-top:14px"><span class="ln"></span></div>')
    return h + "</div>"

def page(n, b, key):
    h = page_head(f"Bell Ringer #{n} · {'NC.8.NS.1' if n <= 5 else 'NC.8.EE.1'}", b["title"], "Show your thinking. Do Part A, then Part B.", key)
    h += f'<div data-fit><div class="rem"><b>Remember:</b> {b["rem"]}</div>'
    h += f'<div class="part">A. {b["A_dir"]}</div><div class="g4">' + "".join(cell(i + 1, *it, b["A_kind"], key) for i, it in enumerate(b["A"][:4])) + '</div>'
    if len(b["A"]) > 4:   # yes/no list of 6
        h = h.replace('<div class="g4">', '<div class="g3">', 1)
        h = h.replace("".join(cell(i + 1, *it, b["A_kind"], key) for i, it in enumerate(b["A"][:4])) + '</div>', "".join(cell(i + 1, *it, b["A_kind"], key) for i, it in enumerate(b["A"])) + '</div>')
    st = len(b["A"]) + 1
    h += f'<div class="part">B. {b["B_dir"]}</div><div class="g3">' + "".join(cell(st + i, *it, b["B_kind"], key) for i, it in enumerate(b["B"])) + '</div></div>'
    return h

if __name__ == "__main__":
    import kit
    ZB=float(os.environ.get('ZB','1.3'))
    kit.CSS += CSS_BR
    for key in (False, True):
        pages = [page(i + 1, b, key) for i, b in enumerate(BR)]
        render(pages, f"{OUT}/Bell_Ringers_1-10{'_AnswerKey' if key else ''}.pdf", landscape=True, footer="Bell Ringers" + (" — Answer Key" if key else ""), fit=True)
    print("ok", len(BR))

