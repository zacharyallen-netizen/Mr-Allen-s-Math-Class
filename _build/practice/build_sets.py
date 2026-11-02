# Builds data for interactive practice sets (Units 1–6) from the existing PDFs.
import sys, json, re, os, subprocess
sys.path.insert(0, os.path.dirname(__file__))
import extract
from PIL import Image, ImageChops
G = '/home/claude/mr-allen-s-math-class/grade8/'
OUT = G + 'practice/'
os.makedirs(OUT + 'fig', exist_ok=True)
F = lambda a, b: f'<span class="fr"><span>{a}</span><span>{b}</span></span>'

sys.path.insert(0, '/tmp/claude-0/-home-claude/71df80c8-d29a-5b9a-96ce-5a924999e656/scratchpad/u1/prac')
src = open('/tmp/claude-0/-home-claude/71df80c8-d29a-5b9a-96ce-5a924999e656/scratchpad/u1/prac/build.py').read()
ns = {}; exec(src.split('CSS=')[0], ns)

def sec(title, std, probs, hint):
    return {'title': title, 'std': std, 'hint': hint, 'probs': probs}

# ---------------- hints (one per section) ----------------
H = {
 'conv': 'Fraction → decimal: divide the numerator by the denominator with long division. Decimal → fraction: read the place value, then simplify. For a repeating decimal, use the 9’s rule (0.6̅ = 6/9).',
 'class': 'Rational numbers can be written as a fraction: integers, terminating and repeating decimals, and square roots of perfect squares. Irrational: π and square roots of non-perfect squares.',
 'sq': 'n² means n × n. √n asks: what number times itself makes n?',
 'est': 'Find the perfect squares just below and just above the number. Then use the estimating algorithm: how far past the lower square is it, out of the gap between the two squares?',
 'order': 'Turn everything into a decimal (estimate square roots), then compare.',
 'exp1': 'Same base: multiply → add exponents, divide → subtract exponents. Multiply or divide the coefficients normally.',
 'exp2': 'Power of a power → multiply exponents. Anything (except 0) to the 0 power is 1. A negative exponent means 1 over the positive power.',
 'sci1': 'Scientific notation: a number from 1 up to (not including) 10, times a power of 10. Big numbers → positive exponent; small numbers → negative exponent.',
 'sci2': 'Multiply (or divide) the front numbers, then add (or subtract) the exponents. If the front number is 10 or more, move the decimal and adjust the exponent.',
 'sci3': 'Distance = rate × time. Multiply, then rewrite in scientific notation.',
 'eq1': 'Undo operations in reverse order: first undo + or −, then undo × or ÷.',
 'eq2': 'Distribute first. Then get the variable terms on one side and the numbers on the other.',
 'eq3': 'Distribute, combine like terms, move variables to one side, then solve.',
 'eq4': 'Simplify both sides. Same variable terms and same numbers → infinitely many solutions. Same variable terms but different numbers → no solution.',
 'ineq': 'Solve like an equation. If you multiply or divide by a negative number, flip the inequality sign.',
 'word': 'Write an equation: start-up amount + rate × (number) = total. Then solve.',
 'ang1': 'Complementary angles add to 90°. Supplementary angles and a linear pair add to 180°.',
 'ang2': 'Vertical angles (across from each other) are equal.',
 'ang3': 'Corresponding, alternate interior and alternate exterior angles are equal. Same-side interior angles add to 180°.',
 'ang4': 'The three angles of a triangle add to 180°. An exterior angle equals the sum of the two remote interior angles.',
 'ang5': 'Decide which relationship the picture shows first: complementary (90°), supplementary (180°), vertical (equal) or parallel lines.',
 'py1': 'a² + b² = c². Square both legs, add, then take the square root.',
 'py2': 'c² − b² = a². Square the hypotenuse, subtract the square of the known leg, then take the square root.',
 'py3': 'Check whether (short side)² + (middle side)² = (longest side)². If yes, it is a right triangle.',
 'py4': 'Draw the right triangle. Which side is the hypotenuse (across from the right angle)?',
 'py5': 'Make a right triangle: count the horizontal and vertical distances between the points, then use a² + b² = c².',
 'py6': 'Is the missing side a leg or the hypotenuse? Use a² + b² = c² either way.',
 'f1': 'A function gives each input (x) exactly one output (y). Look for an x-value that repeats with different y-values.',
 'f2': 'Slope = rise ÷ run = (change in y) ÷ (change in x).',
 'f3': 'Find the slope from how y changes when x goes up by 1. Find b, the y-value when x = 0.',
 'f4': 'The flat fee is b (the starting amount). The per-unit cost is m (the slope).',
 'f5': 'Rate of change = slope. The y-intercept is the value of y when x = 0.',
 'f6': 'Flat (horizontal) parts of a graph mean nothing is changing.',
 'f7': 'The solution is the point where the two lines cross. For two equations, set them equal and solve for x.',
}

def u1(d, n):
    keys = ['conv', 'class', 'sq', 'est', 'order']
    stds = ['NC.8.NS.1', 'NC.8.NS.1', 'NC.8.EE.2', 'NC.8.NS.2', 'NC.8.NS.2']
    secs = []
    for (t, ps), k, s in zip(d['secs'], keys, stds):
        secs.append(sec(t.replace('&amp;', '&'), s, [{'n': i, 'q': q, 'ans': a} for i, (q, a) in enumerate(ps, 1)], H[k]))
    return {'title': d['title'], 'sub': d['sub'], 'secs': secs}

SETS = {}
SETS['Unit1_Practice1'] = dict(unit='1', pdf='Unit1_Practice1_Blank.pdf', data=u1(ns['P1'], 1))
SETS['Unit1_Practice2'] = dict(unit='1', pdf='Unit1_Practice2_Blank.pdf', data=u1(ns['P2'], 2))

def P(lst): return [{'n': i, 'q': q, 'ans': a} for i, (q, a) in enumerate(lst, 1)]
SETS['Unit2_Exponent_Rules_Practice1'] = dict(unit='2', pdf='Unit2_Exponent_Rules_Practice1_Blank.pdf', data={
 'title': 'Unit 2 Classwork — Exponent Rules', 'sub': 'Exponent Rules · Power/Zero/Negative Exponents', 'secs': [
 sec('A. Exponent Rules — Product & Quotient', 'NC.8.EE.1', P([('Simplify: x⁴ · x³', 'x⁷'), ('Simplify: y⁸ ÷ y³', 'y⁵'), ('Simplify: (2x³)(3x²)', '6x⁵'), ('Simplify: 15a⁶ ÷ 3a²', '5a⁴'), ('Simplify: a² · a⁵ · a', 'a⁸')]), H['exp1']),
 sec('B. Power, Zero & Negative Exponents', 'NC.8.EE.1', P([('Simplify: (x³)⁴', 'x¹²'), ('Simplify: (2x²)³', '8x⁶'), ('Simplify: 7⁰', '1'), ('Simplify: (5x⁴)⁰', '1'), ('Simplify: 3⁻² (write as a fraction)', F(1, 9)), ('Simplify: x⁻⁴ (write as a fraction)', F(1, 'x⁴')), ('Evaluate: −4² vs (−4)² — what is (−4)²?', '16')]), H['exp2'])]})
SETS['Unit2_Exponent_Rules_Practice2'] = dict(unit='2', pdf='Unit2_Exponent_Rules_Practice2_Blank.pdf', data={
 'title': 'Unit 2 Homework — Exponent Rules', 'sub': 'Complete independently · Exponent Rules', 'secs': [
 sec('A. Exponent Rules — Product & Quotient', 'NC.8.EE.1', P([('Simplify: x⁵ · x⁶', 'x¹¹'), ('Simplify: b⁹ ÷ b⁴', 'b⁵'), ('Simplify: (4x²)(2x⁵)', '8x⁷'), ('Simplify: 24m⁸ ÷ 6m³', '4m⁵'), ('Simplify: c³ · c⁴ · c²', 'c⁹'), ('Simplify: (7y⁴)(2y)', '14y⁵')]), H['exp1']),
 sec('B. Power, Zero & Negative Exponents', 'NC.8.EE.1', P([('Simplify: (y⁵)²', 'y¹⁰'), ('Simplify: (3x²)²', '9x⁴'), ('Simplify: 12⁰', '1'), ('Simplify: (8m³n²)⁰', '1'), ('Simplify: 2⁻³ (write as a fraction)', F(1, 8)), ('Simplify: y⁻² (write as a fraction)', F(1, 'y²')), ('Evaluate −2⁴ (no parentheses).', '−16')]), H['exp2'])]})
SETS['Unit2_Scientific_Notation_Practice1'] = dict(unit='2', pdf='Unit2_Scientific_Notation_Practice1_Blank.pdf', data={
 'title': 'Unit 2 Classwork — Scientific Notation', 'sub': 'Scientific Notation', 'secs': [
 sec('A. Scientific Notation — Conversions', 'NC.8.EE.3', P([('Write 32,000 in scientific notation.', '3.2 × 10⁴'), ('Write 0.0091 in scientific notation.', '9.1 × 10⁻³'), ('Write 5.6 × 10⁶ in standard form.', '5,600,000'), ('Write 2.3 × 10⁻⁴ in standard form.', '0.00023'), ('Write 470,000,000 in scientific notation.', '4.7 × 10⁸')]), H['sci1']),
 sec('B. Scientific Notation — Operations', 'NC.8.EE.4', P([('Multiply: (2 × 10³) × (3 × 10⁵)', '6 × 10⁸'), ('Divide: (8 × 10⁷) ÷ (2 × 10³)', '4 × 10⁴'), ('Multiply: (6 × 10⁴) × (5 × 10²) — adjust if needed!', '3 × 10⁷')]), H['sci2'])]})
SETS['Unit2_Scientific_Notation_Practice2'] = dict(unit='2', pdf='Unit2_Scientific_Notation_Practice2_Blank.pdf', data={
 'title': 'Unit 2 Homework — Scientific Notation', 'sub': 'Complete independently · Scientific Notation', 'secs': [
 sec('A. Scientific Notation — Conversions', 'NC.8.EE.3', P([('Write 81,000 in scientific notation.', '8.1 × 10⁴'), ('Write 0.00056 in scientific notation.', '5.6 × 10⁻⁴'), ('Write 9.4 × 10⁵ in standard form.', '940,000'), ('Write 6.02 × 10⁻³ in standard form.', '0.00602'), ('Write 12,300,000 in scientific notation.', '1.23 × 10⁷')]), H['sci1']),
 sec('B. Scientific Notation — Operations', 'NC.8.EE.4', P([('Multiply: (4 × 10²) × (2 × 10⁶)', '8 × 10⁸'), ('Divide: (9 × 10⁸) ÷ (3 × 10²)', '3 × 10⁶'), ('Multiply: (5 × 10³) × (6 × 10⁴) — adjust if needed!', '3 × 10⁸')]), H['sci2']),
 sec('C. Word Problem', 'NC.8.EE.4', P([('Light travels 1.86 × 10⁵ miles per second. How far does it travel in 10 seconds? (scientific notation)', '1.86 × 10⁶')]), H['sci3'])]})

# ---------------- Units 3–6 from the PDFs ----------------
MAP = {
 'Unit3': (['eq1', 'eq2', 'eq3', 'eq4', 'ineq', 'word'], ['NC.8.EE.7'] * 6),
 'Unit4': (['ang1', 'ang2', 'ang3', 'ang4', 'ang5'], ['NC.8.G.5'] * 5),
 'Unit5': (['py1', 'py2', 'py3', 'py4', 'py5', 'py6'], ['NC.8.G.7', 'NC.8.G.7', 'NC.8.G.6', 'NC.8.G.7', 'NC.8.G.8', 'NC.8.G.7']),
 'Unit6': (['f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7'], ['NC.8.F.1', 'NC.8.F.4', 'NC.8.F.4', 'NC.8.F.4', 'NC.8.F.2', 'NC.8.F.5', 'NC.8.EE.8']),
}
FIX = {  # (set, section index, problem n) -> (question html, answer, keep figure?)
 ('Unit3_Practice1', 0, 4): (f'Solve: {F("x", 3)} − 2 = 4', '18', False),
 ('Unit3_Practice2', 0, 4): (f'Solve: {F("x", 4)} + 5 = 8', '12', False),
 ('Unit3_Practice1', 5, 2): ("A gym membership costs $25 to join plus $15/month. You can spend at most $100. What's the max number of months?", '5', False),
 ('Unit3_Practice2', 2, 2): (None, F(22, 3), False),
 ('Unit6_Practice', 1, 2): (None, F(1, 3), True),
 ('Unit6_Practice', 3, 2): ('A gym charges $30 to join plus $25/month. How much for 6 months total?', '180', False),
}

def crop(pdf, fig, name):
    png = OUT + 'fig/' + name
    tmp = '/tmp/claude-0/-home-claude/71df80c8-d29a-5b9a-96ce-5a924999e656/scratchpad/prac2/tmpcrop'
    s = 3.0
    subprocess.run(['pdftoppm', '-r', '216', '-png', '-f', str(fig['page'] + 1), '-l', str(fig['page'] + 1), '-singlefile',
                    '-x', str(int(fig['x0'] * s) + 4), '-y', str(int(fig['top'] * s)), '-W', str(int((fig['x1'] - fig['x0']) * s) - 8),
                    '-H', str(int((fig['bottom'] - fig['top']) * s)), G + pdf, tmp], check=True)
    im = Image.open(tmp + '.png').convert('RGB')
    bg = Image.new('RGB', im.size, (255, 255, 255))
    box = ImageChops.difference(im, bg).point(lambda v: 255 if v > 18 else 0).getbbox()
    if box:
        im = im.crop((max(box[0] - 10, 0), max(box[1] - 8, 0), min(box[2] + 10, im.width), min(box[3] + 8, im.height)))
    im.save(png, optimize=True)
    return 'practice/fig/' + name, im.size

for base in ['Unit3_Practice1', 'Unit3_Practice2', 'Unit4_Practice1', 'Unit4_Practice2', 'Unit5_Practice1', 'Unit5_Practice2', 'Unit6_Practice']:
    k = extract.extract(base + '_AnswerKey.pdf')
    keys, stds = MAP[base[:5]]
    secs = []
    for si, s in enumerate(k['secs']):
        probs = []
        for p in s['probs']:
            q, a, keepfig = p['q'], p['ans'], True
            fx = FIX.get((base, si, p['n']))
            if fx:
                q = fx[0] or q; a = fx[1]; keepfig = fx[2]
            item = {'n': p['n'], 'q': q, 'ans': a}
            if p['fig'] and keepfig:
                item['fig'], item['size'] = crop(base + '_Blank.pdf', p['fig'], f'{base}_{chr(65 + si)}{p["n"]}.png')
            probs.append(item)
        secs.append(sec(s['title'], stds[si], probs, H[keys[si]]))
    SETS[base] = dict(unit=base[4], pdf=base + '_Blank.pdf', data={'title': k['title'], 'sub': k['sub'], 'secs': secs})

json.dump(SETS, open('/tmp/claude-0/-home-claude/71df80c8-d29a-5b9a-96ce-5a924999e656/scratchpad/prac2/sets.json', 'w'), ensure_ascii=False, indent=1)
print({k: sum(len(s['probs']) for s in v['data']['secs']) for k, v in SETS.items()})
