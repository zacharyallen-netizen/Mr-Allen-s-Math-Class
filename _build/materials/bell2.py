"""Two consolidated, two-sided bell ringers: Rational & Irrational Numbers (NC.8.NS.1) and Exponent Rules (NC.8.EE.1)."""
import sys, os, random
sys.path.insert(0, os.path.dirname(__file__))
from kit import *
import kit
from fractions import Fraction as F
from bell import cell, rep, nines, frs, x, pw, R, I, CSS_BR, RULES
kit.CSS += CSS_BR

def v(base, e): return f"{base}{sup(e)}"          # base with exponent
def same2(f1, f2):                                   # compare two-variable expressions exactly at many sample points
    vals = [F(2), F(3), F(-2), F(1, 2), F(-3, 4), F(5)]
    return all(f1(a, b) == f2(a, b) for a in vals for b in vals)

# ═════════ Bell Ringer A · Rational & Irrational Numbers ═════════
for d, a in [("5", F(5, 9)), ("3", F(1, 3)), ("6", F(2, 3)), ("18", F(2, 11)), ("45", F(5, 11)), ("63", F(7, 11)), ("123", F(41, 333)), ("09", F(1, 11))]:
    assert nines(d) == a, d
assert F(25, 100) == F(1, 4) and F(4, 10) == F(2, 5) and F(12, 100) == F(3, 25) and nines("8") == F(8, 9)
NS_FRONT = [
 ("Circle <b>Rational</b> or <b>Irrational</b>. Then tell why.", "RI", 4, [
   ("√<span class='rad'>36</span>", R, "√36 = 6"), ("√<span class='rad'>15</span>", I, "15 is not a perfect square"), ("0.75", R, "it stops: 75/100"), ("π", I, "never stops, never repeats"),
   (fr(2, 3), R, "it is a fraction"), ("√<span class='rad'>81</span>", R, "√81 = 9"), ("3.14", R, "it stops"), ("√<span class='rad'>50</span>", I, "50 is not a perfect square")]),
 ("Circle <b>True</b> or <b>False</b>.", "tf", 3, [
   ("Every integer is rational.", "True", "−5 = −5/1"), ("π = 3.14", "False", "3.14 is only close to π"), ("0.333… is irrational because it never ends.", "False", "it repeats, so it is rational"),
   ("√64 is irrational.", "False", "√64 = 8"), ("A decimal that never stops and never repeats is irrational.", "True", ""), ("−9 is rational.", "True", "−9 = −9/1")]),
]
NS_BACK = [
 ("Use the 9's rule. Write each as a fraction in simplest form.", "ans", 4, [
   (rep("5"), frs(nines("5")), "5/9"), (rep("3"), frs(nines("3")), "3/9 → simplify"), (rep("6"), frs(nines("6")), "6/9 → simplify"), (rep("18"), frs(nines("18")), "18/99"),
   (rep("45"), frs(nines("45")), "45/99"), (rep("63"), frs(nines("63")), "63/99"), (rep("123"), frs(nines("123")), "123/999 ÷ 3"), (rep("09"), frs(nines("09")), "9/99 ÷ 9")]),
 ("Convert, or find the mistake and fix it. Watch out: some decimals stop!", "ans", 3, [
   ("0.25 <span class='small'>(stops)</span> = ?", frs(F(25, 100)), "25/100"), ("0.4 <span class='small'>(stops)</span> = ?", frs(F(4, 10)), "4/10"),
   ("Ana: " + rep("45") + " = " + fr(45, 100), "It repeats: " + fr(45, 99) + " = " + fr(5, 11), ""), ("Ben: " + rep("8") + " = " + fr(8, 10), "Use 9's: " + fr(8, 9), ""),
   ("Cal: √20 is rational because 20 is a whole number.", "No: 20 is not a perfect square, so √20 is irrational.", ""), ("Dee: 0.12 (it stops) = " + fr(12, 99), "It stops: " + fr(12, 100) + " = " + fr(3, 25), "")]),
]
NS_REM_F = ("<b>Rational</b>: can be written as a fraction. The decimal <b>stops</b> or <b>repeats</b>. &nbsp; <b>Irrational</b>: the decimal <b>never stops and never repeats</b> (like π or √2). "
            "Perfect squares: 1, 4, 9, 16, 25, 36, 49, 64, 81, 100. The square root of a perfect square is rational.")
NS_REM_B = ("<b>The 9's Rule:</b> the repeating digits go on <b>top</b>. The bottom gets one <b>9</b> for each repeating digit (2 digits → 99, 3 digits → 999). Then simplify. &nbsp; "
            "Example: " + rep("27") + " = " + fr(27, 99) + " = " + fr(3, 11) + ". &nbsp; A decimal that <b>stops</b> uses place value: 0.4 = " + fr(4, 10) + " = " + fr(2, 5) + ".")

# ═════════ Bell Ringer B · Exponent Rules ═════════
assert F(3)**4 * F(3)**2 == F(3)**6 and F(2)**3 * F(2)**-5 == F(1, 4) and F(7)**9 / F(7)**4 == F(7)**5 and F(5)**2 / F(5)**6 == F(1, 625)
assert (F(2)**3)**2 == 64 and (F(5)**2)**-1 == F(1, 25) and F(8)**0 == 1 and F(2)**-3 == F(1, 8)
EX_FRONT = [
 ("Simplify. Write as one power, or find the value.", "ans", 4, [
   (pw(3, 4) + " · " + pw(3, 2), pw(3, 6), "4 + 2"), (pw(2, 3) + " · " + pw(2, -5), pw(2, -2) + " = " + fr(1, 4), "3 + (−5)"), (pw(7, 9) + " ÷ " + pw(7, 4), pw(7, 5), "9 − 4"),
   (pw(5, 2) + " ÷ " + pw(5, 6), fr(1, pw(5, 4)), "2 − 6 = −4"), ("(" + pw(2, 3) + ")" + sup(2), pw(2, 6) + " = 64", "3 × 2"), ("(" + pw(5, 2) + ")" + sup(-1), fr(1, 25), "5⁻²"),
   (pw(8, 0), "1", "anything⁰ = 1"), (pw(2, -3), fr(1, 8), "flip: 1/2³")]),
 ("Simplify. Use positive exponents.", "ans", 3, [
   (x(5) + " · " + x(3), x(8), "5 + 3"), (fr(x(10, "y"), x(3, "y")), x(7, "y"), "10 − 3"), ("(" + x(4) + ")" + sup(3), x(12), "4 × 3"),
   ("3" + x(-2, "y"), fr(3, x(2, "y")), "only y flips"), (fr(1, x(-3, "a")), x(3, "a"), "flip back up"), ("5" + x(0), "5", "5 · 1")]),
]
# harder monomials — every answer checked exactly at 36 sample points
M = [
 ("(3" + x(4) + x(2, "y") + ")(−5" + x(3) + "y)", "−15" + x(7) + x(3, "y"), "3·(−5); 4+3; 2+1",
  lambda a, b: (3 * a**4 * b**2) * (-5 * a**3 * b), lambda a, b: -15 * a**7 * b**3),
 ("(−2" + x(3, "a") + x(-2, "b") + ")" + sup(3), fr("−8" + x(9, "a"), x(6, "b")), "(−2)³; 3·3; −2·3",
  lambda a, b: (-2 * a**3 * b**-2)**3, lambda a, b: -8 * a**9 / b**6),
 (fr("24" + x(8, "m") + x(3, "n"), "6" + x(2, "m") + x(5, "n")), fr("4" + x(6, "m"), x(2, "n")), "24÷6; 8−2; 3−5",
  lambda a, b: 24 * a**8 * b**3 / (6 * a**2 * b**5), lambda a, b: 4 * a**6 / b**2),
 ("(4" + x(2) + "y)" + sup(2) + "(3x" + x(3, "y") + ")", "48" + x(5) + x(5, "y"), "16x⁴y² · 3xy³",
  lambda a, b: (4 * a**2 * b)**2 * (3 * a * b**3), lambda a, b: 48 * a**5 * b**5),
 (fr("(2" + x(3) + ")" + sup(4), "8" + x(7)), "2" + x(5), "16x¹² ÷ 8x⁷",
  lambda a, b: (2 * a**3)**4 / (8 * a**7), lambda a, b: 2 * a**5),
 ("(5" + x(-3, "p") + x(4, "q") + ")(−2" + x(5, "p") + x(-6, "q") + ")", fr("−10" + x(2, "p"), x(2, "q")), "−10p²q⁻²",
  lambda a, b: (5 * a**-3 * b**4) * (-2 * a**5 * b**-6), lambda a, b: -10 * a**2 / b**2),
 ("(3" + x(2, "a") + x(-1, "b") + ")" + sup(-2), fr(x(2, "b"), "9" + x(4, "a")), "3⁻²a⁻⁴b²",
  lambda a, b: (3 * a**2 * b**-1)**-2, lambda a, b: b**2 / (9 * a**4)),
 (fr("−6" + x(5) + x(0, "y"), "−2" + x(-2)), "3" + x(7), "y⁰ = 1; 5 − (−2)",
  lambda a, b: (-6 * a**5 * b**0) / (-2 * a**-2), lambda a, b: 3 * a**7),
]
for q, ans, why, f1, f2 in M: assert same2(f1, f2), q
ERR = [("Ray: " + pw(3, 2) + " · " + pw(3, 4) + " = " + pw(9, 6), "Keep the base: " + pw(3, 6)), ("Mia: " + pw(5, -2) + " = −25", "Flip it: " + fr(1, 25)),
       ("Lou: (" + x(3) + ")" + sup(4) + " = " + x(7), "Multiply: " + x(12)), ("Kim: 2" + x(0) + " = 1", "2 · 1 = 2"),
       ("Jo: (2x)" + sup(3) + " = 2" + x(3), "Cube the 2 too: 8" + x(3)), ("Max: (" + x(2) + "y)" + sup(3) + " = " + x(6) + "y", "Cube y too: " + x(6) + x(3, "y"))]
assert same2(lambda a, b: (2 * a)**3, lambda a, b: 8 * a**3) and same2(lambda a, b: (a**2 * b)**3, lambda a, b: a**6 * b**3)
EX_BACK = [
 ("Simplify each monomial. Use positive exponents only.", "ans", 4, [(q, a, w) for q, a, w, *_ in M]),
 ("Find the mistake and fix it.", "ans", 3, [(q, a, "") for q, a in ERR]),
]

def side(n, ttl, std, rem, parts, key, sidelabel, start=1):
    h = page_head(f"Bell Ringer {n} · {std}", ttl, sidelabel, key)
    h += f'<div data-fit><div class="rem"><b>Remember:</b> {rem}</div>'
    k = start
    for j, (dirn, kind, cols, items) in enumerate(parts):
        h += f'<div class="part">{"ABCD"[j + (0 if start == 1 else 2)]}. {dirn}</div><div class="{"g4" if cols == 4 else "g3"}">'
        for it in items:
            h += cell(k, *it, kind, key); k += 1
        h += "</div>"
    return h + "</div>", k

def build(key):
    pages = []
    p, k = side("A", "Rational &amp; Irrational Numbers", "NC.8.NS.1", NS_REM_F, NS_FRONT, key, "Front · Rational or irrational?"); pages.append(p)
    p, _ = side("A", "Rational &amp; Irrational Numbers", "NC.8.NS.1", NS_REM_B, NS_BACK, key, "Back · Repeating decimals and the 9's rule", k); pages.append(p)
    p, k = side("B", "Exponent Rules", "NC.8.EE.1", RULES, EX_FRONT, key, "Front · The rules, zero and negative exponents"); pages.append(p)
    p, _ = side("B", "Exponent Rules", "NC.8.EE.1", RULES + " &nbsp; <b>Monomials:</b> numbers with numbers, letters with letters.", EX_BACK, key, "Back · More complicated monomials", k); pages.append(p)
    return pages

if __name__ == "__main__":
    for key in (False, True):
        render(build(key), f"{OUT}/parts/BellRingers_2{'_KEY' if key else ''}.pdf", landscape=True,
               footer="Bell Ringers A & B" + (" — Answer Key" if key else ""), fit=True)
    print("ok")
