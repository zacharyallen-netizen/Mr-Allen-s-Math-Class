#!/usr/bin/env python3
"""Clean up Module 8 worksheets per WORKSHEET_BRIEF.md. Works on x/<name>/word/document.xml (unpacked from orig/)."""
import re, sys, os, shutil, subprocess

BASE = os.path.dirname(os.path.abspath(__file__))
NB = '\xa0'


def esc(s):
    return s.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;').replace("'", '&apos;')


def rt(d, old, new, count=1):
    """Replace the exact text of a <w:t> element."""
    o = '>' + esc(old) + '</w:t>'
    n = '>' + esc(new) + '</w:t>'
    c = d.count(o)
    if c != count:
        sys.exit(f'expected {count} of {old!r}, found {c}')
    return d.replace(o, n)


def para_bounds(d, text):
    i = d.find('>' + esc(text) + '</w:t>')
    if i < 0:
        sys.exit(f'not found {text!r}')
    s = d.rfind('<w:p>', 0, i)
    e = d.find('</w:p>', i) + len('</w:p>')
    return s, e


def del_para(d, text):
    s, e = para_bounds(d, text)
    return d[:s] + d[e:]


def dup_para(d, text, new_texts):
    """Replace a single-run paragraph with one copy per entry of new_texts."""
    s, e = para_bounds(d, text)
    p = d[s:e]
    out = ''.join(p.replace('>' + esc(text) + '</w:t>', '>' + esc(t) + '</w:t>') for t in new_texts)
    return d[:s] + out + d[e:]


# ---------- superscripts: turn "5^2" into 5 + superscript 2 ----------
RUN = re.compile(r'<w:r>(<w:rPr>((?:(?!</w:rPr>).)*)</w:rPr>)<w:t xml:space="preserve">([^<]*\^[^<]*)</w:t></w:r>')


def sup_runs(d):
    def fix(m):
        rpr = m.group(2) or ''
        text = m.group(3)
        parts = re.split(r'\^(\d+)', text)
        out = ''
        for k, part in enumerate(parts):
            if part == '':
                continue
            if k % 2 == 0:
                out += f'<w:r><w:rPr>{rpr}</w:rPr><w:t xml:space="preserve">{part}</w:t></w:r>'
            else:
                srpr = re.sub(r'(<w:szC?s? w:val=")(\d+)(")', lambda q: q.group(1) + str(round(int(q.group(2)) * 1.35)) + q.group(3), rpr)
                out += (f'<w:r><w:rPr>{srpr}<w:vertAlign w:val="superscript"/></w:rPr>'
                        f'<w:t xml:space="preserve">{part}</w:t></w:r>')
        return out
    return RUN.sub(fix, d)


# ---------- Module 4 stacked-fraction pattern ----------
NOB = ('<w:top w:val="none" w:color="FFFFFF" w:sz="0"/><w:left w:val="none" w:color="FFFFFF" w:sz="0"/>'
       '<w:bottom w:val="none" w:color="FFFFFF" w:sz="0"/><w:right w:val="none" w:color="FFFFFF" w:sz="0"/>')
CONS = '<w:rFonts w:ascii="Consolas" w:cs="Consolas" w:eastAsia="Consolas" w:hAnsi="Consolas"/>'
TBLB = ('<w:tblBorders><w:top w:val="single" w:color="auto" w:sz="4"/><w:left w:val="single" w:color="auto" w:sz="4"/>'
        '<w:bottom w:val="single" w:color="auto" w:sz="4"/><w:right w:val="single" w:color="auto" w:sz="4"/>'
        '<w:insideH w:val="single" w:color="auto" w:sz="4"/><w:insideV w:val="single" w:color="auto" w:sz="4"/></w:tblBorders>')
TAIL_P = '<w:p><w:pPr><w:spacing w:after="0" w:line="20" w:lineRule="exact"/></w:pPr></w:p>'


def frac_cell_p(txt):
    return (f'<w:p><w:pPr><w:spacing w:after="0" w:line="230"/><w:jc w:val="center"/></w:pPr><w:r><w:rPr>{CONS}<w:b/><w:bCs/>'
            f'<w:color w:val="1A1A1A"/><w:sz w:val="26"/><w:szCs w:val="26"/></w:rPr><w:t xml:space="preserve">{esc(txt)}</w:t></w:r></w:p>')


def frac(top, bot):
    """Nested 1-col, 2-row table: top cell has the fraction bar as its bottom border (copied from Module 4)."""
    def cell(txt, bar):
        bb = '<w:bottom w:val="single" w:color="1A1A1A" w:sz="8"/>' if bar else '<w:bottom w:val="none" w:color="FFFFFF" w:sz="0"/>'
        return ('<w:tr><w:tc><w:tcPr><w:tcW w:type="dxa" w:w="520"/><w:tcBorders><w:top w:val="none" w:color="FFFFFF" w:sz="0"/>'
                f'<w:left w:val="none" w:color="FFFFFF" w:sz="0"/>{bb}<w:right w:val="none" w:color="FFFFFF" w:sz="0"/></w:tcBorders>'
                '<w:tcMar><w:top w:type="dxa" w:w="0"/><w:left w:type="dxa" w:w="30"/><w:bottom w:type="dxa" w:w="0"/>'
                f'<w:right w:type="dxa" w:w="30"/></w:tcMar></w:tcPr>{frac_cell_p(txt)}</w:tc></w:tr>')
    return ('<w:tbl><w:tblPr><w:tblW w:type="dxa" w:w="600"/><w:jc w:val="center"/><w:tblBorders>'
            '<w:top w:val="single" w:color="auto" w:sz="4"/><w:left w:val="single" w:color="auto" w:sz="4"/>'
            '<w:bottom w:val="single" w:color="auto" w:sz="4"/><w:right w:val="single" w:color="auto" w:sz="4"/>'
            '<w:insideH w:val="none" w:color="FFFFFF" w:sz="0"/><w:insideV w:val="single" w:color="auto" w:sz="4"/>'
            '</w:tblBorders></w:tblPr><w:tblGrid><w:gridCol w:w="600"/></w:tblGrid>'
            + cell(top, True) + cell(bot, False) + '</w:tbl>' + TAIL_P)


def row_cell(width, inner, lr=20):
    return (f'<w:tc><w:tcPr><w:tcW w:type="dxa" w:w="{width}"/><w:tcBorders>{NOB}</w:tcBorders>'
            f'<w:tcMar><w:top w:type="dxa" w:w="30"/><w:left w:type="dxa" w:w="{lr}"/><w:bottom w:type="dxa" w:w="30"/>'
            f'<w:right w:type="dxa" w:w="{lr}"/></w:tcMar><w:vAlign w:val="center"/></w:tcPr>{inner}</w:tc>')


def text_p(txt, jc=None, color='1A1A1A'):
    j = f'<w:jc w:val="{jc}"/>' if jc else ''
    return (f'<w:p><w:pPr><w:spacing w:after="0" w:line="300"/>{j}</w:pPr><w:r><w:rPr>{CONS}<w:b/><w:bCs/>'
            f'<w:color w:val="{color}"/><w:sz w:val="24"/><w:szCs w:val="24"/></w:rPr>'
            f'<w:t xml:space="preserve">{esc(txt)}</w:t></w:r></w:p>')


def row_table(cells):
    """cells: list of (width, inner_xml, lr_margin)."""
    tw = sum(c[0] for c in cells)
    grid = ''.join(f'<w:gridCol w:w="{c[0]}"/>' for c in cells)
    return (f'<w:tbl><w:tblPr><w:tblW w:type="dxa" w:w="{tw}"/><w:jc w:val="left"/>{TBLB}'
            '<w:tblLayout w:type="fixed"/><w:tblCellMar><w:left w:w="0" w:type="dxa"/><w:right w:w="0" w:type="dxa"/></w:tblCellMar>'
            f'</w:tblPr><w:tblGrid>{grid}</w:tblGrid><w:tr>'
            + ''.join(row_cell(*c) for c in cells) + '</w:tr></w:tbl>')


def nb(s):
    return s.replace(' ', NB)


# ---------- per-file edits ----------
def common_onyourown(d):
    d = rt(d, '4x − 1 ,  x = 3  =  ______', 'If x = 3:  4x − 1 = ______')
    d = rt(d, '2a + b ,  a=5, b=2  =  ______', 'If a=5, b=2:  2a + b = ______')
    return d


def refresher(d):
    return rt(d, nb('2x + 1 ,  x = 3  →  2×3 + 1 = 7'), nb('If x = 3:  2x + 1  =  2×3 + 1  =  7'))


def guided(d):
    d = refresher(d)
    d = rt(d, 'Exponents next  (3^2 means 3×3).', 'Exponents next  (3^2 means 3 × 3).')
    d = rt(d, 'Add and Subtract, left to right.   —  that&apos;s GEMS.'.replace('&apos;', "'"), 'Add and Subtract, left to right.')
    d = rt(d, 'Guided practice — fill in each step', 'Guided practice')
    d = rt(d, 'Then × 3 = ______', 'Then:  ______ × 3 = ______')
    d = rt(d, '2x + 5 ,  x = 4', 'If x = 4:  2x + 5')
    d = common_onyourown(d)
    d = rt(d, 'GEMS — groups, exponents, ×÷, then +−.  ★', 'GEMS: groups, exponents, ×÷, +−.  ★')
    return d


def light(d):
    d = refresher(d)
    d = rt(d, 'Copy the move — worked, then your turn', 'Worked example, then your turn')
    d = rt(d, nb('3 + 4 × 2 = 11'), nb('3 + 4 × 2 = 3 + 8 = 11'))
    d = rt(d, nb('(2 + 3)^2 ... (2+3)=5, 5^2 = 25'), nb('(2 + 3)^2 = 5^2 = 25'))
    d = dup_para(d, nb('3x − 2 , x=4 → 10'), [nb('If x = 4:  3x − 2'), nb('= 3×4 − 2 = 10')])
    d = rt(d, nb('2x + 7 , x = 5  =  ____'), nb('If x = 5:  2x + 7  =  ____'))
    d = common_onyourown(d)
    return d


def mixed(d):
    d = del_para(d, "Powers, order of operations, and variables. Name the GEMS step you're doing.")
    d = rt(d, '5x + 1 , x = 2  =  ______', 'If x = 2:  5x + 1 = ______')
    d = rt(d, '3a − b , a=4,b=5  =  ______', 'If a=4, b=5:  3a − b = ______')
    # Module 7 spiral: no units; proportion as stacked fractions
    s, e = para_bounds(d, nb('180 mi ÷ 3 h = ______ mph       Solve x/4 = 6/8 → ______'))
    tbl = row_table([
        (4224, text_p(nb('180 : 3 = ? : 1  → ______')), 0),
        (680, frac('x', '4'), 20),
        (440, text_p('=', jc='center'), 10),
        (680, frac('6', '8'), 20),
        (2600, text_p(nb('  →  x = ______')), 0),
    ])
    d = d[:s] + tbl + TAIL_P + d[e:]
    # Find the mistake: short, show the wrong work
    d = del_para(d, 'This student did 3 + 4 × 2 from left to right and got 14. Order of operations says multiply first. Find the error and give the correct answer.')
    d = rt(d, '3 + 4 × 2  =  14   (wrong)', '3 + 4 × 2  =  7 × 2  =  14   (wrong)')
    d = rt(d, 'Correct answer: ______   (multiply before adding: 4×2 first)', 'Correct answer: ______')
    d = rt(d, 'Multiply before you add. GEMS, every time.  ★', 'GEMS, every time.  ★')
    return d


JOBS = {'FluencyLab_M8_Core_Guided': guided, 'FluencyLab_M8_Core_Light': light, 'FluencyLab_M8_Mixed_Review': mixed}
DEST = '/home/claude/mr-allen-s-math-class/grade8/Fluency-Lab-Package/module-materials/Module-8-Expressions'

if __name__ == '__main__':
    os.makedirs(f'{BASE}/work', exist_ok=True)
    for name, fn in JOBS.items():
        src = f'{BASE}/work/{name}'
        shutil.rmtree(src, ignore_errors=True)
        subprocess.run(['unzip', '-q', f'{BASE}/orig/{name}.docx', '-d', src], check=True)
        p = f'{src}/word/document.xml'
        d = open(p, encoding='utf-8').read()
        d = fn(d)
        d = sup_runs(d)
        assert '^' not in d
        open(p, 'w', encoding='utf-8').write(d)
        out = f'{BASE}/out/{name}.docx'
        os.makedirs(f'{BASE}/out', exist_ok=True)
        if os.path.exists(out):
            os.remove(out)
        # keep original zip member order: [Content_Types].xml first
        subprocess.run(['zip', '-X', '-q', out, '[Content_Types].xml'], cwd=src, check=True)
        subprocess.run(['zip', '-X', '-q', '-r', out, '.', '-x', '[Content_Types].xml'], cwd=src, check=True)
        print('built', out)
