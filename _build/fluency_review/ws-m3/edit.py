import re, sys, os, shutil, subprocess

BASE = os.path.dirname(os.path.abspath(__file__))
DEST = "/home/claude/mr-allen-s-math-class/grade8/Fluency-Lab-Package/module-materials/Module-3-Divide"


def rep(x, old, new, n=1):
    c = x.count(old)
    assert c == n, (old, c)
    return x.replace(old, new)


def paras(x):
    return list(re.finditer(r'<w:p[ >].*?</w:p>', x))


def ptext(p):
    return ''.join(re.findall(r'<w:t[^>]*>([^<]*)</w:t>', p))


def delpara(x, text):
    hits = [m for m in paras(x) if ptext(m.group(0)) == text]
    assert len(hits) == 1, (text, len(hits))
    m = hits[0]
    return x[:m.start()] + x[m.end():]


def find_para(x, text):
    hits = [m for m in paras(x) if ptext(m.group(0)) == text]
    assert len(hits) == 1, (text, len(hits))
    return hits[0]


def set_para(x, old, new, run_idx=-1):
    m = find_para(x, old)
    p = m.group(0)
    ppr = re.search(r'<w:pPr>.*?</w:pPr>', p)
    rprs = re.findall(r'<w:rPr>.*?</w:rPr>', re.sub(r'<w:pPr>.*?</w:pPr>', '', p))
    newp = '<w:p>' + (ppr.group(0) if ppr else '') + '<w:r>' + rprs[run_idx] + T(new) + '</w:r></w:p>'
    return x[:m.start()] + newp + x[m.end():]


def T(s):
    return f'<w:t xml:space="preserve">{s}</w:t>'


NB = ' '

# ---------------- Facts ----------------
def facts(x):
    x = rep(x, T('The one idea'), T('Worked example'))
    x = rep(x, T('Every division fact is a multiplication fact in reverse.'),
            T('Division is multiplication backwards.'))
    # make the "stuck" line pure numbers, same Consolas look as the line above
    old = ('<w:r><w:rPr><w:sz w:val="21"/><w:szCs w:val="21"/></w:rPr>'
           + T('Stuck on  63 ÷ 9 ?  Ask: 9 times what is 63?  →  7.') + '</w:r>')
    new = ('<w:r><w:rPr><w:rFonts w:ascii="Consolas" w:cs="Consolas" w:eastAsia="Consolas" w:hAnsi="Consolas"/>'
           '<w:sz w:val="24"/><w:szCs w:val="24"/></w:rPr>'
           + T('63 ÷ 9 = ?   Think: 9 × ? = 63  →  7') + '</w:r>')
    x = rep(x, old, new)
    x = rep(x, T('56 ÷ 7 = 8   because   7 × 8 = 56.'), T('56 ÷ 7 = 8   because   7 × 8 = 56'))
    x = rep(x, T('Each trio of numbers makes four facts. Fill them in.'), T('Fill in all four facts.'))
    x = rep(x, T('On your own — mixed facts'), T('On your own'))
    x = rep(x, T('When a division fact won’t come, reach for its multiplication twin. ★'),
            T('Think multiplication backwards. ★'))
    return x


# ---------------- Guided ----------------
def guided(x):
    x = rep(x, T('Refresher — divide, multiply, subtract, bring down'), T('Worked example'))
    x = set_para(x, 'Example: 256 ÷ 4.  The quotient is written on top.',
                 'Divide, multiply, subtract, bring down.')
    x = rep(x, T('Divide: 4 into 25 goes 6.'), T('Divide:  4 into 25 = 6'))
    x = rep(x, T('Multiply: 6 × 4 = 24, write it under 25. Subtract: 25 − 24 = 1.'),
            T('Multiply:  6 × 4 = 24.   Subtract:  25 − 24 = 1'))
    x = rep(x, T('Bring down the 6 → 16. Divide: 4 into 16 = 4. Multiply/subtract: 16 − 16 = 0.'),
            T('Bring down 6 → 16.   4 into 16 = 4.   16 − 16 = 0'))
    x = rep(x, T('Answer: 64.  Check: 4 × 64 = 256. '), T('Answer: 64.   Check: 4 × 64 = 256'))
    x = rep(x, T('Guided practice — fill in each step'), T('Your turn'))
    x = rep(x, T('A)  Solve  '), T('A)  '))
    x = rep(x, T('B)  Solve  '), T('B)  '))
    x = rep(x, T('C)  Solve  '), T('C)  '))
    x = rep(x, T('   (this one has a remainder)'), T('   (remainder)'))
    x = rep(x, T('Multiply/subtract:  ____ × 6 = ____ ;  8 − ____ = ____'),
            T('Multiply:  ____ × 6 = ____     Subtract:  8 − ____ = ____'))
    # B and C: same one-step-per-label layout as A
    div = find_para(x, 'Divide:    6 into 8 = ____').group(0)
    def line(txt):
        return div.replace(T('Divide:    6 into 8 = ____'), T(txt))
    for d, top, lead in [(7, 25, 2), (4, 13, 1)]:
        m = find_para(x, f'{d} into {top} = ____ .  ____ × {d} = ____ ;  {top} − ____ = ____')
        x = x[:m.start()] + line(f'Divide:    {d} into {top} = ____') + line(
            f'Multiply:  ____ × {d} = ____     Subtract:  {top} − ____ = ____') + x[m.end():]
    x = rep(x, T('Bring down 4 → ____ .  6 into ____ = ____'), T('Bring down 4 → ____     6 into ____ = ____'))
    x = rep(x, T('Bring down 2 → ____ .  7 into ____ = ____'), T('Bring down 2 → ____     7 into ____ = ____'))
    x = rep(x, T('Bring down 9 → ____ .  4 into ____ = ____ ;  leftover = ____'),
            T('Bring down 9 → ____     4 into ____ = ____     leftover = ____'))
    # keep each A)/B)/C) label on the same page as its box
    for L in 'ABC':
        x = rep(x, '<w:p><w:pPr><w:spacing w:after="110" w:line="274"/></w:pPr><w:r><w:rPr><w:color w:val="222222"/>'
                   '<w:sz w:val="22"/><w:szCs w:val="22"/></w:rPr>' + T(L + ')  '),
                '<w:p><w:pPr><w:keepNext/><w:spacing w:after="110" w:line="274"/></w:pPr><w:r><w:rPr><w:color w:val="222222"/>'
                   '<w:sz w:val="22"/><w:szCs w:val="22"/></w:rPr>' + T(L + ')  '))
    x = rep(x, T('On your own — set up the bracket and solve'), T('On your own'))
    x = rep(x, T('Check every answer by multiplying back. It catches almost every mistake. ★'),
            T('Check by multiplying back. ★'))
    return x


# ---------------- Light ----------------
def light(x):
    x = rep(x, T('Divide, multiply, subtract, bring down — repeat. Then check by multiplying back: 4 × 64 = 256. '
                 'If there’s a leftover, that’s the remainder.'),
            T('Divide, multiply, subtract, bring down. Check: 4 × 64 = 256'))
    x = rep(x, T('Copy the move — worked example, then your turn'), T('Worked example, then your turn'))
    x = rep(x, T('Now you try — just like it'), T('Your turn'), n=3)
    x = rep(x, T('6 into 7 = 1 (6, leaves 1). Bring down 2 → 12. 6 into 12 = 2.'),
            T('6 into 7 = 1.  7 − 6 = 1.  Bring down 2 → 12.  6 into 12 = 2.'))
    x = rep(x, T('4 into 25 = 6 (24, leaves 1). Bring down 6 → 16. 4 into 16 = 4.'),
            T('4 into 25 = 6.  25 − 24 = 1.  Bring down 6 → 16.  4 into 16 = 4.'))
    x = rep(x, T('4 into 13 = 3 (12, leaves 1). Bring down 9 → 19. 4 into 19 = 4, leaves 3 → remainder.'),
            T('4 into 13 = 3.  13 − 12 = 1.  Bring down 9 → 19.  4 into 19 = 4.  19 − 16 = 3 → r 3'))
    return x


# ---------------- Mixed review ----------------
CONS = '<w:rFonts w:ascii="Consolas" w:cs="Consolas" w:eastAsia="Consolas" w:hAnsi="Consolas"/>'


def bracket_line(text, sz, color='1A1A1A', bold=False):
    b = '<w:b/><w:bCs/>' if bold else '<w:b w:val="false"/><w:bCs w:val="false"/>'
    return ('<w:p><w:pPr><w:spacing w:after="0" w:line="248"/></w:pPr><w:r><w:rPr>' + CONS + b
            + f'<w:color w:val="{color}"/><w:sz w:val="{sz}"/><w:szCs w:val="{sz}"/></w:rPr>'
            + T(text) + '</w:r></w:p>')


def mixed(x):
    x = delpara(x, 'Division facts, long division, and multiplication to keep it warm. Ask first: '
                   'what operation, and what’s the next step?')
    x = rep(x, T('Long division — set up and solve'), T('Long division'))
    x = rep(x, T('Find and fix the mistake'), T('Find the mistake'))
    x = delpara(x, 'Dividing 824 ÷ 4, this student wrote 26. They forgot that 4 goes into the 2 zero times '
                   '— a 0 belongs in the quotient. Find the error and give the correct answer.')
    # wrong work: the student's bracket, quotient 2 _ 6 with the 0 missing
    m = find_para(x, '824 ÷ 4  →  26    (wrong)')
    work = (bracket_line(NB * 4 + '2' + NB * 3 + '6' + NB * 4 + '✗', 26, 'B03A2E', True)
            + bracket_line(NB * 4 + '─────', 24)
            + bracket_line('4' + NB + ')' + NB + '8' + NB + '2' + NB + '4', 26))
    x = x[:m.start()] + work + x[m.end():]
    x = rep(x, T('Correct answer: ______      Check: 4 × ______ = 824'), T('Correct answer: ______'))
    x = rep(x, T('When a divisor won’t go, write a 0 and keep going. ★'), T('Can’t divide? Write 0. ★'))
    return x


JOBS = {'Facts': facts, 'LongDivision_Guided': guided, 'LongDivision_Light': light, 'Mixed_Review': mixed}

out = os.path.join(BASE, 'new')
os.makedirs(out, exist_ok=True)
for name, fn in JOBS.items():
    src = os.path.join(BASE, 'orig', f'FluencyLab_M3_{name}.docx')
    work = os.path.join(BASE, f'w_{name}')
    shutil.rmtree(work, ignore_errors=True)
    subprocess.run(['unzip', '-q', src, '-d', work], check=True)
    subprocess.run(['find', work, '-type', 'l', '-delete'], check=True)
    dp = os.path.join(work, 'word', 'document.xml')
    x = open(dp, encoding='utf-8').read()
    x = fn(x)
    # never split a problem cell across a page break
    assert '<w:trPr>' not in x
    x = x.replace('<w:tr>', '<w:tr><w:trPr><w:cantSplit/></w:trPr>')
    open(dp, 'w', encoding='utf-8').write(x)
    dst = os.path.join(out, f'FluencyLab_M3_{name}.docx')
    if os.path.exists(dst):
        os.remove(dst)
    subprocess.run(['zip', '-qXr', dst, '.'], cwd=work, check=True)
    print('built', dst)
