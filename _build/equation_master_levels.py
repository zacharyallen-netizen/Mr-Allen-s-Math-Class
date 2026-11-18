"""Equation Master: two new levels (Nov 18, 2026, Zach: "Can you also add two more levels? One with inequalities and
another with more challenging linear equations?").

  Champion      harder linear equations: fractions + reciprocal, distributing on both sides, distributing a negative,
                decimals, clearing fractions, an infinitely-many-solutions case.
  Inequalities  solve, flip the sign when multiplying/dividing by a negative, then pick the right graph.

Every step is checked with exact fractions: each line must have the SAME solution set as the problem it came from.
Every wrong choice carries its own note (`why`) that names the mistake (shown when it is tapped).
Writes the two lists between the BUILT markers inside PROBLEMS in grade8/equation_master.html (safe to rerun).

    python3 _build/equation_master_levels.py
"""
import json, re, os
from fractions import Fraction as F

HTML = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'grade8', 'equation_master.html')

# ---------- exact checking ----------
REL = ['≤', '≥', '<', '>', '=']
def to_py(s, var):
    s = s.replace('−', '-').replace(var, 'x')
    s = re.sub(r'(\d+(?:\.\d+)?)', r"F('\1')", s)
    s = re.sub(r"(\)|x)\s*(\(|F|x)", r'\1*\2', s)
    s = re.sub(r"(\))\s*(\()", r'\1*\2', s)
    return s
def split(s):
    for r in REL:
        if r in s:
            a, b = s.split(r); return a, r, b
    raise ValueError(s)
def truth(s, x, var):
    a, r, b = split(s)
    L, R = eval(to_py(a, var), {'F': F, 'x': x}), eval(to_py(b, var), {'F': F, 'x': x})
    return {'=': L == R, '<': L < R, '>': L > R, '≤': L <= R, '≥': L >= R}[r]
PTS = [F(n, 4) for n in range(-80, 81)]
def same_set(s1, s2, var):
    return all(truth(s1, x, var) == truth(s2, x, var) for x in PTS)

# ---------- display ----------
def disp(s):
    s = re.sub(r'\((\d+)/(\d+)\)', r"<span class='fr'><span>\1</span><span>\2</span></span>", s)
    return s
def plain(s):          # for button text (textContent)
    return re.sub(r'\((\d+)/(\d+)\)', r'\1/\2', s)
C = lambda t: "<span class='cancelled'>" + t + "</span>"
O = lambda t: "<span class='op'>" + t + "</span>"
H = lambda t: "<span class='highlight'>" + t + "</span>"

def numline(at, closed, left, lo=None, hi=None):
    lo = lo if lo is not None else at - 5; hi = hi if hi is not None else at + 5
    W, pad = 300, 16; sx = lambda v: pad + (v - lo) * (W - 2 * pad) / (hi - lo)
    t = ''.join(f"<line x1='{sx(v):.1f}' y1='22' x2='{sx(v):.1f}' y2='30' stroke='#1E2D4F' stroke-width='1.5'/>"
                f"<text x='{sx(v):.1f}' y='44' font-size='11' text-anchor='middle' fill='#1E2D4F' font-family='Inter,sans-serif'>{str(v).replace('-', '−')}</text>"
                for v in range(lo, hi + 1))
    x0 = sx(at); x1 = pad - 4 if left else W - pad + 4
    shade = f"<line x1='{x0:.1f}' y1='26' x2='{x1:.1f}' y2='26' stroke='#E0A800' stroke-width='6'/>"
    arrow = f"<path d='M{x1:.1f},26 l{8 if not left else -8},-6 v12 z' fill='#E0A800' transform='translate({-8 if not left else 8},0)'/>"
    dot = f"<circle cx='{x0:.1f}' cy='26' r='6' fill='{'#1E2D4F' if closed else '#fff'}' stroke='#1E2D4F' stroke-width='2.5'/>"
    return (f"<svg viewBox='0 0 {W} 50' width='{W}' height='50' style='max-width:100%'><line x1='4' y1='26' x2='{W - 4}' y2='26' stroke='#1E2D4F' stroke-width='2'/>"
            + t + shade + arrow + dot + "</svg>")

# ---------- the problems ----------
# a step: (prompt, correct text, action, transform html, result (plain, checked), [(wrong text, why)], hint, extra)
def st(prompt, ok, action, tr, res, wrongs, hint, **kw):
    d = dict(prompt=prompt, ok=ok, action=action, tr=tr, res=res, wrongs=wrongs, hint=hint); d.update(kw); return d

CHAMPION = [
 dict(title="Fraction Fury: (3/4)x − 5 = 7", start="(3/4)x − 5 = 7", var='x', sol=F(16), steps=[
   st("Get the x-term alone first:", "Add 5 to both sides", "↓ Add 5 to both sides",
      "(3/4)x " + C("− 5") + " " + O("+ 5") + " = 7 " + O("+ 5"), "(3/4)x = 12",
      [("Subtract 5 from both sides", "The − 5 is undone by ADDING 5, not subtracting."),
       ("Multiply both sides by 4/3", "Not yet. First undo the − 5. Then use the reciprocal."),
       ("Divide both sides by 3", "Not yet. Undo the − 5 first, then deal with the fraction.")],
      "Undo the − 5 first. What is the opposite of subtracting 5?"),
   st("Now get x by itself:", "Multiply both sides by 4/3 (the reciprocal)", "↓ Multiply both sides by 4/3",
      "(4/3) · " + C("(3/4)") + "x = 12 · " + O("(4/3)"), "x = 16",
      [("Multiply both sides by 3/4", "Multiplying by 3/4 again makes it smaller. Use the reciprocal 4/3: (3/4)(4/3) = 1."),
       ("Subtract 3/4 from both sides", "The 3/4 is MULTIPLIED by x, not added. Undo multiplying with the reciprocal."),
       ("Divide both sides by 3", "That leaves (1/4)x, not x. Multiply by the reciprocal 4/3 to get 1x.")],
      "Flip the fraction: the reciprocal of 3/4 is 4/3.", final=True)]),
 dict(title="Double Trouble: 3(2x − 4) = 2(x + 6)", start="3(2x − 4) = 2(x + 6)", var='x', sol=F(6), steps=[
   st("Parentheses on BOTH sides:", "Distribute on both sides", "↓ Distribute 3 and 2",
      H("3") + "(2x) − " + H("3") + "(4) = " + H("2") + "(x) + " + H("2") + "(6)", "6x − 12 = 2x + 12",
      [("Distribute: 6x − 4 = 2x + 6", "Multiply the outside number by EVERY term inside: 3 · 4 = 12 and 2 · 6 = 12."),
       ("Divide both sides by 3", "That only undoes the 3 on the left. Distribute on both sides first."),
       ("Subtract 2x from both sides", "The x's are still inside parentheses. Distribute first.")],
      "Multiply each outside number by both terms inside its parentheses."),
   st("Get the x's on one side:", "Subtract 2x from both sides", "↓ Subtract 2x from both sides",
      "6x " + O("− 2x") + " − 12 = " + C("2x") + " " + O("− 2x") + " + 12", "4x − 12 = 12",
      [("Add 2x to both sides", "Adding 2x gives 4x on the right. Subtract 2x to cancel it."),
       ("Subtract 6x from both sides", "That leaves −4x. It works, but subtracting the smaller x-term (2x) keeps x positive."),
       ("Subtract 12 from both sides", "That doesn't cancel anything. Move the x's to one side first.")],
      "Cancel the smaller x-term so x stays positive."),
   st("Undo the − 12:", "Add 12 to both sides", "↓ Add 12 to both sides",
      "4x " + C("− 12") + " " + O("+ 12") + " = 12 " + O("+ 12"), "4x = 24",
      [("Subtract 12 from both sides", "−12 is undone by ADDING 12."),
       ("Divide both sides by 4", "Not yet. Undo the − 12 first."),
       ("Add 12 to the left side only", "Whatever you do to one side, do to the other side too.")],
      "What undoes subtracting 12?"),
   st("Last step:", "Divide both sides by 4", "↓ Divide both sides by 4",
      C("4") + "x " + O("÷ 4") + " = 24 " + O("÷ 4"), "x = 6",
      [("Subtract 4 from both sides", "4x means 4 TIMES x. Undo multiplying by dividing."),
       ("Divide both sides by 24", "Divide by the number in front of x, which is 4."),
       ("Multiply both sides by 4", "Multiplying makes 16x. Divide by 4 to get x alone.")],
      "4x means 4 times x.", final=True)]),
 dict(title="Negative Nightmare: −4(x − 3) + 2x = 20", start="−4(x − 3) + 2x = 20", var='x', sol=F(-4), steps=[
   st("Distribute the −4:", "−4x + 12 + 2x = 20", "↓ Distribute −4",
      H("−4") + "(x) " + H("−4") + "(−3) + 2x = 20", "−4x + 12 + 2x = 20",
      [("−4x − 12 + 2x = 20", "−4 times −3 is +12. A negative times a negative is positive."),
       ("−4x − 3 + 2x = 20", "Multiply −4 by BOTH terms in the parentheses."),
       ("4x − 12 + 2x = 20", "−4 times x is −4x. Keep the negative sign.")],
      "Multiply −4 by x AND by −3. Watch the signs."),
   st("Combine like terms:", "−2x + 12 = 20", "↓ Combine −4x + 2x",
      H("−4x") + " + 12 " + H("+ 2x") + " = 20", "−2x + 12 = 20",
      [("−6x + 12 = 20", "−4x + 2x is −2x. The signs are different, so subtract."),
       ("2x + 12 = 20", "−4 + 2 = −2, not +2."),
       ("−2x = 32", "Combine the x-terms first. Don't move the 12 yet.")],
      "−4x + 2x: different signs, so subtract and keep the sign of the bigger one."),
   st("Undo the + 12:", "Subtract 12 from both sides", "↓ Subtract 12 from both sides",
      "−2x " + C("+ 12") + " " + O("− 12") + " = 20 " + O("− 12"), "−2x = 8",
      [("Add 12 to both sides", "+12 is undone by SUBTRACTING 12."),
       ("Divide both sides by −2", "Not yet. Undo the + 12 first."),
       ("Subtract 12 from the left side only", "Do the same thing to BOTH sides.")],
      "What undoes adding 12?"),
   st("Last step:", "Divide both sides by −2", "↓ Divide both sides by −2",
      C("−2") + "x " + O("÷ (−2)") + " = 8 " + O("÷ (−2)"), "x = −4",
      [("Divide both sides by 2", "The number in front of x is −2. Divide by −2 so you get x, not −x."),
       ("Add 2 to both sides", "−2x means −2 TIMES x. Undo it by dividing."),
       ("Divide both sides by −8", "Divide by the number in front of x, which is −2.")],
      "Divide by the whole number in front of x, sign and all.", final=True)]),
 dict(title="Decimal Duel: 0.5x + 3.2 = 1.5x − 4.8", start="0.5x + 3.2 = 1.5x − 4.8", var='x', sol=F(8), steps=[
   st("Get the x's on one side:", "Subtract 0.5x from both sides", "↓ Subtract 0.5x from both sides",
      C("0.5x") + " " + O("− 0.5x") + " + 3.2 = 1.5x " + O("− 0.5x") + " − 4.8", "3.2 = x − 4.8",
      [("Subtract 1.5x from both sides", "That leaves −1x. It works, but cancelling the smaller x-term (0.5x) keeps x positive."),
       ("Add 0.5x to both sides", "Adding gives 1x on the left. SUBTRACT 0.5x to cancel it."),
       ("Subtract 3.2 from both sides and stop", "You still have x's on both sides. Move them to one side first.")],
      "Cancel the smaller x-term, 0.5x."),
   st("Get x by itself:", "Add 4.8 to both sides", "↓ Add 4.8 to both sides",
      "3.2 " + O("+ 4.8") + " = x " + C("− 4.8") + " " + O("+ 4.8"), "8 = x",
      [("Subtract 4.8 from both sides", "−4.8 is undone by ADDING 4.8."),
       ("Add 3.2 to both sides", "Undo the − 4.8 that is with the x."),
       ("Divide both sides by 4.8", "The 4.8 is subtracted, not multiplied. Add it.")],
      "What undoes − 4.8?", final=True, show="8 = x, so x = 8")]),
 dict(title="Fraction Fortress: (2/3)(x + 6) = 10", start="(2/3)(x + 6) = 10", var='x', sol=F(9), steps=[
   st("Deal with the parentheses:", "Distribute 2/3 to x and to 6", "↓ Distribute 2/3",
      H("(2/3)") + "(x) + " + H("(2/3)") + "(6) = 10", "(2/3)x + 4 = 10",
      [("(2/3)x + 6 = 10", "Multiply 2/3 by BOTH terms: (2/3)(6) = 4."),
       ("Subtract 6 from both sides", "The 6 is inside the parentheses. Distribute first."),
       ("Divide both sides by 2", "That doesn't undo 2/3. Distribute first.")],
      "Multiply 2/3 by x and by 6."),
   st("Undo the + 4:", "Subtract 4 from both sides", "↓ Subtract 4 from both sides",
      "(2/3)x " + C("+ 4") + " " + O("− 4") + " = 10 " + O("− 4"), "(2/3)x = 6",
      [("Add 4 to both sides", "+4 is undone by SUBTRACTING 4."),
       ("Multiply both sides by 3/2", "Not yet. Undo the + 4 first."),
       ("Subtract 10 from both sides", "Move the number that is WITH the x-term: the 4.")],
      "What undoes + 4?"),
   st("Last step:", "Multiply both sides by 3/2 (the reciprocal)", "↓ Multiply both sides by 3/2",
      O("(3/2)") + " · " + C("(2/3)") + "x = 6 · " + O("(3/2)"), "x = 9",
      [("Multiply both sides by 2/3", "Use the reciprocal (flip it): 3/2. Then (2/3)(3/2) = 1."),
       ("Subtract 2/3 from both sides", "2/3 is MULTIPLIED by x. Undo it with the reciprocal."),
       ("Divide both sides by 3", "Dividing by 3 leaves (2/9)x. Multiply by 3/2 instead.")],
      "The reciprocal of 2/3 is 3/2.", final=True)]),
 dict(title="Shape Shifter: 5x − 2(x + 4) = 3x − 8", start="5x − 2(x + 4) = 3x − 8", var='x', sol=None, special='infinite', steps=[
   st("Distribute the −2:", "5x − 2x − 8 = 3x − 8", "↓ Distribute −2",
      "5x " + H("− 2") + "(x) " + H("− 2") + "(4) = 3x − 8", "5x − 2x − 8 = 3x − 8",
      [("5x − 2x + 4 = 3x − 8", "Multiply −2 by BOTH terms: −2 · 4 = −8."),
       ("5x − 2x + 8 = 3x − 8", "−2 times +4 is −8, not +8."),
       ("3x + 4 = 3x − 8", "Distribute first: −2 times x AND −2 times 4.")],
      "Multiply −2 by x and by 4."),
   st("Combine like terms:", "3x − 8 = 3x − 8", "↓ Combine 5x − 2x",
      H("5x − 2x") + " − 8 = 3x − 8", "3x − 8 = 3x − 8",
      [("7x − 8 = 3x − 8", "5x − 2x = 3x. Subtract, don't add."),
       ("3x = 3x − 16", "Combine the x-terms first. Don't move the − 8 yet."),
       ("−3x − 8 = 3x − 8", "5 − 2 = 3, so the x-term is +3x.")],
      "5x − 2x = ?"),
   st("Get the x's on one side:", "Subtract 3x from both sides", "↓ Subtract 3x from both sides",
      C("3x") + " " + O("− 3x") + " − 8 = " + C("3x") + " " + O("− 3x") + " − 8", "−8 = −8",
      [("Divide both sides by 3", "Get the x's on one side first."),
       ("Add 8 to both sides", "That gives 3x = 3x. Keep going: subtract 3x."),
       ("Subtract 3x from the left side only", "Do the same thing to BOTH sides.")],
      "Subtract 3x from both sides. What happens to the x's?", final=True, special='infinite',
      show="−8 = −8 → TRUE → infinitely many solutions")]),
 dict(title="Chain Breaker: 7 − 2(3x − 1) = 4x − 1", start="7 − 2(3x − 1) = 4x − 1", var='x', sol=F(1), steps=[
   st("Distribute the −2:", "7 − 6x + 2 = 4x − 1", "↓ Distribute −2",
      "7 " + H("− 2") + "(3x) " + H("− 2") + "(−1) = 4x − 1", "7 − 6x + 2 = 4x − 1",
      [("7 − 6x − 2 = 4x − 1", "−2 times −1 is +2. Negative times negative is positive."),
       ("5(3x − 1) = 4x − 1", "Don't subtract 7 − 2 first. Multiply (distribute) before you subtract."),
       ("7 − 6x − 1 = 4x − 1", "Multiply −2 by BOTH terms in the parentheses.")],
      "Multiply −2 by 3x AND by −1. Order of operations: multiply before you subtract."),
   st("Combine like terms:", "9 − 6x = 4x − 1", "↓ Combine 7 + 2",
      H("7") + " − 6x " + H("+ 2") + " = 4x − 1", "9 − 6x = 4x − 1",
      [("5 − 6x = 4x − 1", "7 + 2 = 9, not 5."),
       ("3x = 4x − 1", "−6x and 9 are not like terms. Only combine 7 and 2."),
       ("9 − 6x = 4x + 1", "Leave the right side alone. It stays 4x − 1.")],
      "Add the plain numbers on the left: 7 + 2."),
   st("Get the x's on one side:", "Add 6x to both sides", "↓ Add 6x to both sides",
      "9 " + C("− 6x") + " " + O("+ 6x") + " = 4x " + O("+ 6x") + " − 1", "9 = 10x − 1",
      [("Subtract 6x from both sides", "−6x is undone by ADDING 6x."),
       ("Subtract 4x from both sides", "That gives −10x. Adding 6x keeps x positive."),
       ("Subtract 9 from both sides", "Get the x's together first.")],
      "Undo −6x by adding 6x to both sides."),
   st("Undo the − 1:", "Add 1 to both sides", "↓ Add 1 to both sides",
      "9 " + O("+ 1") + " = 10x " + C("− 1") + " " + O("+ 1"), "10 = 10x",
      [("Subtract 1 from both sides", "−1 is undone by ADDING 1."),
       ("Divide both sides by 10", "Not yet. Undo the − 1 first."),
       ("Add 9 to both sides", "Move the number that is WITH the x-term: the − 1.")],
      "What undoes − 1?"),
   st("Last step:", "Divide both sides by 10", "↓ Divide both sides by 10",
      "10 " + O("÷ 10") + " = " + C("10") + "x " + O("÷ 10"), "1 = x",
      [("Subtract 10 from both sides", "10x means 10 TIMES x. Divide."),
       ("Divide both sides by 9", "Divide by the number in front of x: 10."),
       ("Multiply both sides by 10", "Multiplying makes 100x. Divide by 10.")],
      "10x means 10 times x.", final=True, show="1 = x, so x = 1")]),
 dict(title="Fraction Phantom: (1/4)x + 2 = (1/2)x − 1", start="(1/4)x + 2 = (1/2)x − 1", var='x', sol=F(12), steps=[
   st("Clear the fractions:", "Multiply EVERY term by 4", "↓ Multiply every term by 4",
      O("4") + "·" + C("(1/4)") + "x + " + O("4") + "·2 = " + O("4") + "·(1/2)x − " + O("4") + "·1", "x + 8 = 2x − 4",
      [("Multiply only the fractions by 4", "Multiply EVERY term on both sides by 4, including 2 and −1."),
       ("Divide every term by 4", "Dividing makes the fractions smaller. Multiply by 4 to clear them."),
       ("Multiply every term by 2", "2 clears the 1/2 but not the 1/4. Use 4: both 2 and 4 go into 4.")],
      "What number do 2 and 4 both go into?"),
   st("Get the x's on one side:", "Subtract x from both sides", "↓ Subtract x from both sides",
      C("x") + " " + O("− x") + " + 8 = 2x " + O("− x") + " − 4", "8 = x − 4",
      [("Subtract 2x from both sides", "That gives −x. Subtracting the smaller x-term keeps x positive."),
       ("Add x to both sides", "SUBTRACT x to cancel it."),
       ("Subtract 8 from both sides", "Get the x's together first.")],
      "Cancel the smaller x-term."),
   st("Last step:", "Add 4 to both sides", "↓ Add 4 to both sides",
      "8 " + O("+ 4") + " = x " + C("− 4") + " " + O("+ 4"), "12 = x",
      [("Subtract 4 from both sides", "−4 is undone by ADDING 4."),
       ("Divide both sides by 4", "The 4 is subtracted, not multiplied. Add 4."),
       ("Add 8 to both sides", "Move the number with the x: the − 4.")],
      "What undoes − 4?", final=True, show="12 = x, so x = 12")]),
]

def graph_step(at, rel, var='x'):
    closed = rel in ('≤', '≥'); left = rel in ('<', '≤')
    d = lambda c, l: ('Closed' if c else 'Open') + f" circle at {str(at).replace('-', '−')}, shade {'left' if l else 'right'}"
    ok = d(closed, left)
    wr = [(d(not closed, left), ("≤ and ≥ include the number, so the circle is CLOSED." if closed else "< and > do not include the number, so the circle is OPEN.")),
          (d(closed, not left), (f"{var} {rel} {str(at).replace('-', '−')} means numbers {'LESS' if left else 'GREATER'} than {str(at).replace('-', '−')}: shade to the {'left' if left else 'right'}.")),
          (d(not closed, not left), "Check both: open or closed circle, AND which way to shade.")]
    return st("Which graph matches?", ok, "↓ Graph it", numline(at, closed, left), None, wr,
              "Closed circle for ≤ ≥, open for < >. Shade toward the numbers that work.", final=True, graph=(at, closed, left))

INEQ = [
 dict(title="Warm-up Siege: 3x + 4 > 19", start="3x + 4 > 19", var='x', ans=(5, '>'), steps=[
   st("Undo the + 4:", "Subtract 4 from both sides", "↓ Subtract 4 from both sides",
      "3x " + C("+ 4") + " " + O("− 4") + " > 19 " + O("− 4"), "3x > 15",
      [("Add 4 to both sides", "+4 is undone by SUBTRACTING 4."),
       ("Divide both sides by 3", "Not yet. Undo the + 4 first."),
       ("Subtract 4 and flip the sign", "Adding or subtracting NEVER flips the sign. Only × or ÷ by a negative does.")],
      "Solve it like an equation. What undoes + 4?"),
   st("Get x alone:", "Divide both sides by 3 (keep >)", "↓ Divide both sides by 3",
      C("3") + "x " + O("÷ 3") + " > 15 " + O("÷ 3"), "x > 5",
      [("Divide both sides by 3 and flip to <", "3 is POSITIVE. Only flip when you multiply or divide by a NEGATIVE."),
       ("Subtract 3 from both sides", "3x means 3 TIMES x. Divide."),
       ("Divide both sides by 15", "Divide by the number in front of x: 3.")],
      "Is 3 positive or negative?"),
   graph_step(5, '>')]),
 dict(title="Flip Trap: −2x + 5 ≤ 13", start="−2x + 5 ≤ 13", var='x', ans=(-4, '≥'), steps=[
   st("Undo the + 5:", "Subtract 5 from both sides", "↓ Subtract 5 from both sides",
      "−2x " + C("+ 5") + " " + O("− 5") + " ≤ 13 " + O("− 5"), "−2x ≤ 8",
      [("Add 5 to both sides", "+5 is undone by SUBTRACTING 5."),
       ("Divide both sides by −2", "Not yet. Undo the + 5 first."),
       ("Subtract 5 and flip the sign", "Subtracting never flips the sign.")],
      "What undoes + 5?"),
   st("Divide by the negative:", "Divide both sides by −2 and FLIP ≤ to ≥", "↓ Divide by −2 and flip the sign",
      C("−2") + "x " + O("÷ (−2)") + " " + O("≥") + " 8 " + O("÷ (−2)"), "x ≥ −4",
      [("Divide both sides by −2 and keep ≤", "Dividing by a NEGATIVE flips the sign: ≤ becomes ≥."),
       ("Divide both sides by 2 and keep ≤", "The number in front of x is −2, not 2. Dividing by −2 also flips the sign."),
       ("Add 2 to both sides", "−2x means −2 TIMES x. Divide by −2.")],
      "You are dividing by a negative. What happens to the sign?"),
   graph_step(-4, '≥')]),
 dict(title="Shadow Fraction: (1/3)x − 2 < 1", start="(1/3)x − 2 < 1", var='x', ans=(9, '<'), steps=[
   st("Undo the − 2:", "Add 2 to both sides", "↓ Add 2 to both sides",
      "(1/3)x " + C("− 2") + " " + O("+ 2") + " < 1 " + O("+ 2"), "(1/3)x < 3",
      [("Subtract 2 from both sides", "−2 is undone by ADDING 2."),
       ("Multiply both sides by 3", "Not yet. Undo the − 2 first."),
       ("Add 2 and flip the sign", "Adding never flips the sign.")],
      "What undoes − 2?"),
   st("Get x alone:", "Multiply both sides by 3 (keep <)", "↓ Multiply both sides by 3",
      O("3") + " · " + C("(1/3)") + "x < 3 · " + O("3"), "x < 9",
      [("Multiply both sides by 3 and flip to >", "3 is POSITIVE. No flip."),
       ("Divide both sides by 3", "Dividing gives (1/9)x. Multiply by 3, the reciprocal of 1/3."),
       ("Multiply both sides by 1/3", "Use the reciprocal of 1/3, which is 3.")],
      "The reciprocal of 1/3 is 3. Is 3 positive?"),
   graph_step(9, '<')]),
 dict(title="Cliff Drop: 5 − 3x ≥ 20", start="5 − 3x ≥ 20", var='x', ans=(-5, '≤'), steps=[
   st("Undo the 5:", "Subtract 5 from both sides", "↓ Subtract 5 from both sides",
      C("5") + " " + O("− 5") + " − 3x ≥ 20 " + O("− 5"), "−3x ≥ 15",
      [("Add 5 to both sides", "The 5 is positive. Undo it by SUBTRACTING 5."),
       ("Divide both sides by −3", "Not yet. Undo the 5 first."),
       ("Subtract 3 from both sides", "The −3 is multiplied by x. Move the 5 first.")],
      "What undoes + 5?"),
   st("Divide by the negative:", "Divide both sides by −3 and FLIP ≥ to ≤", "↓ Divide by −3 and flip the sign",
      C("−3") + "x " + O("÷ (−3)") + " " + O("≤") + " 15 " + O("÷ (−3)"), "x ≤ −5",
      [("Divide both sides by −3 and keep ≥", "Dividing by a NEGATIVE flips the sign: ≥ becomes ≤."),
       ("Divide both sides by 3 and keep ≥", "Divide by −3 (sign and all), and then flip the sign."),
       ("Divide both sides by −3 and get x ≥ 5", "15 ÷ (−3) = −5, and the sign flips to ≤.")],
      "Negative in front of x? Divide and FLIP."),
   graph_step(-5, '≤')]),
 dict(title="Iron Gate: 4(x − 2) < 2x + 6", start="4(x − 2) < 2x + 6", var='x', ans=(7, '<'), steps=[
   st("Parentheses first:", "Distribute the 4", "↓ Distribute 4",
      H("4") + "(x) − " + H("4") + "(2) < 2x + 6", "4x − 8 < 2x + 6",
      [("4x − 2 < 2x + 6", "Multiply 4 by BOTH terms: 4 · 2 = 8."),
       ("Divide both sides by 4", "Distribute first so you can gather the x's."),
       ("4x + 8 < 2x + 6", "4 times −2 is −8.")],
      "Multiply 4 by x and by −2."),
   st("Get the x's on one side:", "Subtract 2x from both sides", "↓ Subtract 2x from both sides",
      "4x " + O("− 2x") + " − 8 < " + C("2x") + " " + O("− 2x") + " + 6", "2x − 8 < 6",
      [("Add 2x to both sides", "SUBTRACT 2x to cancel it."),
       ("Subtract 4x from both sides", "That gives −2x and a sign flip later. Subtracting 2x keeps x positive."),
       ("Add 8 to both sides", "Gather the x's first.")],
      "Cancel the smaller x-term."),
   st("Undo the − 8:", "Add 8 to both sides", "↓ Add 8 to both sides",
      "2x " + C("− 8") + " " + O("+ 8") + " < 6 " + O("+ 8"), "2x < 14",
      [("Subtract 8 from both sides", "−8 is undone by ADDING 8."),
       ("Divide both sides by 2", "Not yet. Undo the − 8 first."),
       ("Add 8 and flip the sign", "Adding never flips the sign.")],
      "What undoes − 8?"),
   st("Get x alone:", "Divide both sides by 2 (keep <)", "↓ Divide both sides by 2",
      C("2") + "x " + O("÷ 2") + " < 14 " + O("÷ 2"), "x < 7",
      [("Divide both sides by 2 and flip to >", "2 is POSITIVE. No flip."),
       ("Subtract 2 from both sides", "2x means 2 TIMES x. Divide."),
       ("Divide both sides by 14", "Divide by the number in front of x: 2.")],
      "Is 2 positive or negative?"),
   graph_step(7, '<')]),
 dict(title="Mirror Maze: 2x + 9 > 5x − 3", start="2x + 9 > 5x − 3", var='x', ans=(4, '<'), steps=[
   st("Get the x's on one side:", "Subtract 5x from both sides", "↓ Subtract 5x from both sides",
      "2x " + O("− 5x") + " + 9 > " + C("5x") + " " + O("− 5x") + " − 3", "−3x + 9 > −3",
      [("Add 5x to both sides", "SUBTRACT 5x to cancel it."),
       ("Subtract 9 from both sides and stop", "You still have x's on both sides."),
       ("Subtract 2x from the left side only", "Do the same thing to BOTH sides.")],
      "Move the x's to the left side."),
   st("Undo the + 9:", "Subtract 9 from both sides", "↓ Subtract 9 from both sides",
      "−3x " + C("+ 9") + " " + O("− 9") + " > −3 " + O("− 9"), "−3x > −12",
      [("Add 9 to both sides", "+9 is undone by SUBTRACTING 9."),
       ("Divide both sides by −3", "Not yet. Undo the + 9 first."),
       ("Subtract 9 and flip the sign", "Subtracting never flips the sign.")],
      "What undoes + 9?"),
   st("Divide by the negative:", "Divide both sides by −3 and FLIP > to <", "↓ Divide by −3 and flip the sign",
      C("−3") + "x " + O("÷ (−3)") + " " + O("<") + " −12 " + O("÷ (−3)"), "x < 4",
      [("Divide both sides by −3 and keep >", "Dividing by a NEGATIVE flips the sign: > becomes <."),
       ("Divide both sides by −3 and get x > −4", "−12 ÷ (−3) = +4, and the sign flips to <."),
       ("Divide both sides by 3 and keep >", "Divide by −3 (sign and all), then flip.")],
      "Negative in front of x? Divide and FLIP."),
   graph_step(4, '<')]),
 dict(title="Reciprocal Reaper: −(1/2)x + 1 ≥ 4", start="−(1/2)x + 1 ≥ 4", var='x', ans=(-6, '≤'), steps=[
   st("Undo the + 1:", "Subtract 1 from both sides", "↓ Subtract 1 from both sides",
      "−(1/2)x " + C("+ 1") + " " + O("− 1") + " ≥ 4 " + O("− 1"), "−(1/2)x ≥ 3",
      [("Add 1 to both sides", "+1 is undone by SUBTRACTING 1."),
       ("Multiply both sides by −2", "Not yet. Undo the + 1 first."),
       ("Subtract 1 and flip the sign", "Subtracting never flips the sign.")],
      "What undoes + 1?"),
   st("Use the reciprocal:", "Multiply both sides by −2 and FLIP ≥ to ≤", "↓ Multiply by −2 and flip the sign",
      O("(−2)") + " · " + C("−(1/2)") + "x " + O("≤") + " 3 · " + O("(−2)"), "x ≤ −6",
      [("Multiply both sides by −2 and keep ≥", "Multiplying by a NEGATIVE flips the sign: ≥ becomes ≤."),
       ("Multiply both sides by 2 and keep ≥", "The reciprocal of −1/2 is −2 (keep the negative), and then the sign flips."),
       ("Multiply both sides by −1/2", "Use the reciprocal: −2. Then (−1/2)(−2) = 1.")],
      "The reciprocal of −1/2 is −2. It's negative, so..."),
   graph_step(-6, '≤')]),
 dict(title="Ticket Quest: 12 + 8t ≤ 60", start="12 + 8t ≤ 60", var='t', ans=(6, '≤'),
      story="Tickets cost $8 each plus a $12 fee. You have $60. How many tickets (t) can you buy?", steps=[
   st("Undo the 12:", "Subtract 12 from both sides", "↓ Subtract 12 from both sides",
      C("12") + " " + O("− 12") + " + 8t ≤ 60 " + O("− 12"), "8t ≤ 48",
      [("Add 12 to both sides", "The 12 is added. Undo it by SUBTRACTING 12."),
       ("Divide both sides by 8", "Not yet. Undo the 12 first."),
       ("Subtract 8 from both sides", "8 is multiplied by t. Move the 12 first.")],
      "What undoes + 12?"),
   st("Get t alone:", "Divide both sides by 8 (keep ≤)", "↓ Divide both sides by 8",
      C("8") + "t " + O("÷ 8") + " ≤ 48 " + O("÷ 8"), "t ≤ 6",
      [("Divide both sides by 8 and flip to ≥", "8 is POSITIVE. No flip."),
       ("Subtract 8 from both sides", "8t means 8 TIMES t. Divide."),
       ("Divide both sides by 48", "Divide by the number in front of t: 8.")],
      "Is 8 positive or negative?"),
   st("What does t ≤ 6 mean here?", "You can buy at most 6 tickets", "↓ Answer the question",
      "t ≤ 6", "t ≤ 6",
      [("You must buy at least 6 tickets", "≤ means 6 OR FEWER. That's 'at most', not 'at least'."),
       ("You can buy exactly 6.5 tickets", "You can't buy half a ticket, and ≤ allows 6 or fewer."),
       ("You can buy at most 48 tickets", "48 is dollars left after the fee. 48 ÷ 8 = 6 tickets.")],
      "≤ 6 means 6 or fewer.", final=True, show="t ≤ 6 → at most 6 tickets")]),
]

# ---------- check + emit ----------
def check(P, ineq):
    var = P['var']; cur = P['start']
    for i, s in enumerate(P['steps']):
        if s.get('graph'):
            at, closed, left = s['graph']; a, rel = P['ans']
            assert at == a and closed == (rel in '≤≥') and left == (rel in '<≤'), P['title']
            assert same_set(cur, f"{var} {rel} {at}".replace('-', '−'), var), P['title']
            continue
        if s['res'] is None: continue
        assert same_set(P['start'], s['res'], var), (P['title'], i, s['res'])
        cur = s['res']
        assert len({s['ok']} | {w[0] for w in s['wrongs']}) == 4, (P['title'], i)
    if not ineq:
        if P.get('special') == 'infinite': assert all(truth(P['start'], x, var) for x in PTS)
        else: assert truth(P['start'], P['sol'], var) and sum(truth(P['start'], x, var) for x in PTS) == 1, P['title']
    else:
        a, rel = P['ans']; assert same_set(P['start'], f"{var} {rel} {a}".replace('-', '−'), var), P['title']
    assert P['steps'][-1].get('final')

def emit(P):
    steps = []; cur = P['start']
    for s in P['steps']:
        ch = [{'text': plain(s['ok']), 'correct': True}] + [{'text': plain(t), 'correct': False, 'why': plain(w)} for t, w in s['wrongs']]
        res = s.get('show') or (s['res'] or cur)
        oc = {'action': plain(s['action']), 'transform': disp(s['tr']),
              'result': disp(res) if not s.get('graph') else disp(f"{P['var']} {P['ans'][1]} {str(P['ans'][0]).replace('-', '−')}") + " " + "<span style='font-weight:500'>✓ graphed</span>"}
        if s.get('final'): oc['isFinal'] = True
        if s.get('special'): oc['isSpecial'] = s['special']
        steps.append({'current': disp(cur), 'prompt': s['prompt'], 'choices': ch, 'onCorrect': oc, 'wrongHint': s['hint']})
        if s['res']: cur = s['res']
    d = {'title': plain(P['title']), 'startEq': disp(P['start']), 'steps': steps}
    if P.get('story'): d['story'] = P['story']
    return d

for P in CHAMPION: check(P, False)
for P in INEQ: check(P, True)
js = ('// BUILT by _build/equation_master_levels.py (Nov 18, 2026): do not edit by hand\n'
      'champion: ' + json.dumps([emit(P) for P in CHAMPION], ensure_ascii=False, indent=1) + ',\n'
      'inequalities: ' + json.dumps([emit(P) for P in INEQ], ensure_ascii=False, indent=1) + '\n// END BUILT\n')
h = open(HTML, encoding='utf-8').read()
if '// BUILT by _build/equation_master_levels.py' in h:
    h = re.sub(r'// BUILT by _build/equation_master_levels\.py.*?// END BUILT\n', lambda m: js, h, flags=re.S)
else:
    anchor = "\n]\n};\n\n// ═══════════════════════════════════════════════════════════\n// GAME ENGINE"
    assert h.count(anchor) == 1
    h = h.replace(anchor, "\n],\n\n" + js + "};\n\n// ═══════════════════════════════════════════════════════════\n// GAME ENGINE", 1)
open(HTML, 'w', encoding='utf-8').write(h)
print('ok', len(CHAMPION), 'champion,', len(INEQ), 'inequality problems;', sum(len(P['steps']) for P in CHAMPION + INEQ), 'steps checked')
