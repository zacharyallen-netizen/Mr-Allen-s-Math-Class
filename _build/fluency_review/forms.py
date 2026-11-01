"""Make each Google Form builder match the online Skill Check: same questions (no word problems, one
operation except Order of Operations), short wording. Forms are plain text, so a fraction is written
with a raised top and lowered bottom (⁶⁄₈), the closest Forms can get to stacked."""
import json, re, pathlib, html
D = pathlib.Path('/home/claude/mr-allen-s-math-class/grade8/Fluency-Lab-Package')
SUP = str.maketrans('0123456789x', '⁰¹²³⁴⁵⁶⁷⁸⁹ˣ')
SUB = str.maketrans('0123456789x', '₀₁₂₃₄₅₆₇₈₉ₓ')
MOD = {'add-subtract': 1, 'multiply': 2, 'divide': 3, 'fractions': 4, 'decimals': 5, 'integers': 6, 'ratios': 7, 'expressions': 8}
DESC = {1: 'One column at a time. Pick an answer for each.', 2: 'Pick an answer for each.', 3: 'Pick an answer for each.',
        4: 'Simplest form. Pick an answer for each.', 5: 'Pick an answer for each.', 6: 'Pick an answer for each.',
        7: 'Pick an answer for each.', 8: 'Order: ( ), powers, × ÷, + −. Pick an answer for each.'}

def plain(t):
    t = re.sub(r'<span class="fr"><span>([^<]*)</span><span>([^<]*)</span></span>',
               lambda m: m.group(1).translate(SUP) + '⁄' + m.group(2).translate(SUB), t)
    t = re.sub(r'<span style="text-decoration:overline">([^<]*)</span>', lambda m: ''.join(c + '̅' for c in m.group(1)), t)
    t = re.sub(r'<[^>]+>', '', t)
    return html.unescape(t).replace('  ', ' ').strip()

for name, n in MOD.items():
    q = (D / 'fluency-lab' / f'quiz-{name}.html').read_text()
    Q = json.loads(re.search(r'const Q=(\[.*?\]);\n', q, re.S).group(1))
    rows = [[plain(x[0]).rstrip(' ='), [plain(c) for c in x[1]], x[2], plain(x[3])] for x in Q]
    folder = next((D / 'module-materials').glob(f'Module-{n}-*'))
    gs = folder / f'FluencyLab_M{n}_Form_Builder.gs'
    s = gs.read_text()
    body = ',\n'.join('    ' + json.dumps(r, ensure_ascii=False) for r in rows)
    s, k = re.subn(r'var Q = \[\n.*?\n  \];', lambda m: 'var Q = [\n' + body + '\n  ];', s, count=1, flags=re.S)
    assert k == 1, gs
    s, k = re.subn(r"form\.setDescription\((.*?)\);\n", lambda m: f"form.setDescription('{DESC[n]}');\n", s, count=1, flags=re.S)
    assert k == 1, gs
    s = re.sub(r"var RIGHT = '.*?';", "var RIGHT = 'Correct.';", s, count=1)
    gs.write_text(s)
    print(gs.name, len(rows), '|', rows[0][0], '|', [r[0] for r in rows if '⁄' in r[0]][:2])
