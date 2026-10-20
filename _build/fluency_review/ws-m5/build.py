"""Module 5 (Decimals) worksheet clean-up. Edits XML of the originals in ws-m5/orig/ and writes
results into the module folder. Stacked fractions copy Module 4's 2-row nested-table pattern."""
import os, shutil, subprocess, zipfile

HERE = os.path.dirname(os.path.abspath(__file__))
ORIG = os.path.join(HERE, 'orig')
OUT = '/home/claude/mr-allen-s-math-class/grade8/Fluency-Lab-Package/module-materials/Module-5-Decimals'

# ---------------- Module 4 stacked-fraction XML pattern (copied verbatim) ----------------
NONE4 = ('<w:top w:val="none" w:color="FFFFFF" w:sz="0"/><w:left w:val="none" w:color="FFFFFF" w:sz="0"/>'
         '<w:bottom w:val="none" w:color="FFFFFF" w:sz="0"/><w:right w:val="none" w:color="FFFFFF" w:sz="0"/>')
TBLB_FRAC = ('<w:tblBorders><w:top w:val="single" w:color="auto" w:sz="4"/><w:left w:val="single" w:color="auto" w:sz="4"/>'
             '<w:bottom w:val="single" w:color="auto" w:sz="4"/><w:right w:val="single" w:color="auto" w:sz="4"/>'
             '<w:insideH w:val="none" w:color="FFFFFF" w:sz="0"/><w:insideV w:val="single" w:color="auto" w:sz="4"/></w:tblBorders>')
TBLB_STD = ('<w:tblBorders><w:top w:val="single" w:color="auto" w:sz="4"/><w:left w:val="single" w:color="auto" w:sz="4"/>'
            '<w:bottom w:val="single" w:color="auto" w:sz="4"/><w:right w:val="single" w:color="auto" w:sz="4"/>'
            '<w:insideH w:val="single" w:color="auto" w:sz="4"/><w:insideV w:val="single" w:color="auto" w:sz="4"/></w:tblBorders>')
CONS = '<w:rFonts w:ascii="Consolas" w:cs="Consolas" w:eastAsia="Consolas" w:hAnsi="Consolas"/>'


def frac_row_cell(text, bar, line='230'):
    bottom = ('<w:bottom w:val="single" w:color="1A1A1A" w:sz="8"/>' if bar
              else '<w:bottom w:val="none" w:color="FFFFFF" w:sz="0"/>')
    return ('<w:tr><w:tc><w:tcPr><w:tcW w:type="dxa" w:w="520"/><w:tcBorders>'
            '<w:top w:val="none" w:color="FFFFFF" w:sz="0"/><w:left w:val="none" w:color="FFFFFF" w:sz="0"/>'
            + bottom +
            '<w:right w:val="none" w:color="FFFFFF" w:sz="0"/></w:tcBorders><w:tcMar><w:top w:type="dxa" w:w="0"/>'
            '<w:left w:type="dxa" w:w="30"/><w:bottom w:type="dxa" w:w="0"/><w:right w:type="dxa" w:w="30"/></w:tcMar></w:tcPr>'
            f'<w:p><w:pPr><w:spacing w:after="0" w:line="{line}"/><w:jc w:val="center"/></w:pPr><w:r><w:rPr>{CONS}<w:b/><w:bCs/>'
            f'<w:color w:val="1A1A1A"/><w:sz w:val="26"/><w:szCs w:val="26"/></w:rPr><w:t xml:space="preserve">{text}</w:t></w:r></w:p></w:tc></w:tr>')


def frac_cell(num, den, w=700, line='230', tw=600):
    """Outer equation cell holding Module 4's 2-row fraction table (top row has the bar as bottom border)."""
    return ('<w:tc><w:tcPr><w:tcW w:type="dxa" w:w="%d"/><w:tcBorders>' % w + NONE4 +
            '</w:tcBorders><w:tcMar><w:top w:type="dxa" w:w="30"/><w:left w:type="dxa" w:w="20"/><w:bottom w:type="dxa" w:w="30"/>'
            '<w:right w:type="dxa" w:w="20"/></w:tcMar><w:vAlign w:val="center"/></w:tcPr>'
            '<w:tbl><w:tblPr><w:tblW w:type="dxa" w:w="%d"/><w:jc w:val="center"/>' % tw + TBLB_FRAC +
            '</w:tblPr><w:tblGrid><w:gridCol w:w="%d"/></w:tblGrid>' % tw
            + frac_row_cell(num, True, line) + frac_row_cell(den, False, line) +
            '</w:tbl><w:p/></w:tc>')


def blank_frac_cell():
    """Stacked answer space: empty over empty with the fraction bar between (taller rows for handwriting)."""
    # same as the Module 4 builder's blank_xml(): 3 nbsp over 3 nbsp, table 640, line 330, cell 740
    return frac_cell('\u00a0' * 3, '\u00a0' * 3, w=740, line='330', tw=640)


def sym_cell(sym, w=520, color='7A86A8', sz='26', cons=True):
    return ('<w:tc><w:tcPr><w:tcW w:type="dxa" w:w="%d"/><w:tcBorders>' % w + NONE4 +
            '</w:tcBorders><w:tcMar><w:top w:type="dxa" w:w="30"/><w:left w:type="dxa" w:w="10"/><w:bottom w:type="dxa" w:w="30"/>'
            '<w:right w:type="dxa" w:w="10"/></w:tcMar><w:vAlign w:val="center"/></w:tcPr><w:p><w:pPr><w:jc w:val="center"/></w:pPr>'
            f'<w:r><w:rPr>{CONS if cons else ""}<w:b/><w:bCs/><w:color w:val="{color}"/><w:sz w:val="{sz}"/><w:szCs w:val="{sz}"/></w:rPr>'
            f'<w:t xml:space="preserve">{sym}</w:t></w:r></w:p></w:tc>')


def label_cell(label, w=420):
    # problem number in the worksheet's label style (bold, 2E5A87), vertically centred with the fraction
    return ('<w:tc><w:tcPr><w:tcW w:type="dxa" w:w="%d"/><w:tcBorders>' % w + NONE4 +
            '</w:tcBorders><w:tcMar><w:top w:type="dxa" w:w="30"/><w:left w:type="dxa" w:w="0"/><w:bottom w:type="dxa" w:w="30"/>'
            '<w:right w:type="dxa" w:w="10"/></w:tcMar><w:vAlign w:val="center"/></w:tcPr><w:p><w:pPr><w:spacing w:after="0"/></w:pPr>'
            '<w:r><w:rPr><w:b/><w:bCs/><w:color w:val="2E5A87"/><w:sz w:val="20"/><w:szCs w:val="20"/></w:rPr>'
            f'<w:t xml:space="preserve">{label}</w:t></w:r></w:p></w:tc>')


def text_cell(runs_xml, w):
    return ('<w:tc><w:tcPr><w:tcW w:type="dxa" w:w="%d"/><w:tcBorders>' % w + NONE4 +
            '</w:tcBorders><w:tcMar><w:top w:type="dxa" w:w="30"/><w:left w:type="dxa" w:w="10"/><w:bottom w:type="dxa" w:w="30"/>'
            '<w:right w:type="dxa" w:w="10"/></w:tcMar><w:vAlign w:val="center"/></w:tcPr><w:p><w:pPr><w:spacing w:after="0"/></w:pPr>'
            + runs_xml + '</w:p></w:tc>')


def eq_table(cells_and_widths):
    total = sum(w for _, w in cells_and_widths)
    grid = ''.join('<w:gridCol w:w="%d"/>' % w for _, w in cells_and_widths)
    return ('<w:tbl><w:tblPr><w:tblW w:type="dxa" w:w="%d"/><w:jc w:val="left"/>' % total + TBLB_STD +
            '</w:tblPr><w:tblGrid>' + grid + '</w:tblGrid><w:tr>' + ''.join(c for c, _ in cells_and_widths) + '</w:tr></w:tbl>')


def frac_problem(n1, d1, op, n2, d2):
    return eq_table([(frac_cell(n1, d1), 700), (sym_cell(op), 520), (frac_cell(n2, d2), 700),
                     (sym_cell('='), 520), (blank_frac_cell(), 740)])


# ---------------- helpers ----------------
def rep(x, old, new, count=1):
    n = x.count(old)
    assert n == count, (n, old[:120])
    return x.replace(old, new)


def t(s):
    return '<w:t xml:space="preserve">%s</w:t>' % s


def process(name, fn):
    src = os.path.join(ORIG, name)
    with zipfile.ZipFile(src) as z:
        items = [(i, z.read(i.filename)) for i in z.infolist()]
    out = os.path.join(OUT, name)
    with zipfile.ZipFile(out, 'w', zipfile.ZIP_DEFLATED) as zo:
        for info, data in items:
            if info.filename == 'word/document.xml':
                data = fn(data.decode('utf-8')).encode('utf-8')
            zo.writestr(info, data)
    print('wrote', out)


# ---------------- Mixed Review ----------------
def mixed(x):
    # intro paragraph -> short refresher (<= 8 words)
    x = rep(x, t('Operations and conversions together. Ask: do the places line up, and is this a percent, a decimal, or a fraction?'),
            t('Line up the decimal points.'))
    x = rep(x, t('Write 0.75 as a %  =  ______'), t('0.75  =  ______ %'))

    # problem 5: fraction to decimal, fraction stacked (Module 4 technique), label inline in the equation row
    old5_start = x.index('<w:p><w:pPr><w:spacing w:line="320"/></w:pPr><w:r><w:rPr><w:b/><w:bCs/><w:color w:val="2E5A87"/><w:sz w:val="20"/><w:szCs w:val="20"/></w:rPr><w:t xml:space="preserve">5)  </w:t>')
    old5_end = x.index('</w:p>', x.index('Write 3/4 as a decimal')) + len('</w:p>')
    ans_runs = ('<w:r><w:rPr>' + CONS + '<w:color w:val="1A1A1A"/><w:sz w:val="22"/><w:szCs w:val="22"/></w:rPr>' + t('______') + '</w:r>'
                '<w:r><w:rPr><w:color w:val="7A86A8"/><w:sz w:val="18"/><w:szCs w:val="18"/></w:rPr>' + t('  (decimal)') + '</w:r>')
    p5 = eq_table([(label_cell('5)'), 420), (frac_cell('3', '4'), 700), (sym_cell('='), 520), (text_cell(ans_runs, 1900), 1900)]) + '<w:p><w:pPr><w:spacing w:after="0" w:line="120" w:lineRule="exact"/></w:pPr></w:p>'
    x = x[:old5_start] + p5 + x[old5_end:]
    # centre problem 6 vertically next to the taller stacked problem 5
    i6 = x.index(t('6)  '))
    tcpr_start = x.rindex('<w:tcPr>', 0, i6)
    tcpr_end = x.index('</w:tcPr>', tcpr_start)
    x = x[:tcpr_end] + '<w:vAlign w:val="center"/>' + x[tcpr_end:]

    # Keep Module 4 warm: stacked fractions, 2 x 2 grid
    ws = x.index('<w:p><w:pPr><w:spacing w:after="50" w:line="300"/></w:pPr>')
    we = x.index('</w:p>', x.index('3/4\xa0÷\xa01/2')) + len('</w:p>')
    probs = [('1', '2', '+', '1', '3'), ('2', '3', '×', '3', '4'), ('5', '6', '−', '1', '4'), ('3', '4', '÷', '1', '2')]

    def gcell(p):
        return ('<w:tc><w:tcPr><w:tcW w:type="dxa" w:w="4510"/><w:tcBorders>' + NONE4 +
                '</w:tcBorders><w:tcMar><w:top w:type="dxa" w:w="30"/><w:left w:type="dxa" w:w="0"/><w:bottom w:type="dxa" w:w="60"/>'
                '<w:right w:type="dxa" w:w="0"/></w:tcMar></w:tcPr>' + frac_problem(*p) + '<w:p><w:pPr><w:spacing w:after="0" w:line="120" w:lineRule="exact"/></w:pPr></w:p></w:tc>')
    grid = ('<w:tbl><w:tblPr><w:tblW w:type="dxa" w:w="9020"/><w:jc w:val="left"/>' + TBLB_STD +
            '</w:tblPr><w:tblGrid><w:gridCol w:w="4510"/><w:gridCol w:w="4510"/></w:tblGrid>'
            '<w:tr>' + gcell(probs[0]) + gcell(probs[1]) + '</w:tr><w:tr>' + gcell(probs[2]) + gcell(probs[3]) + '</w:tr></w:tbl>'
            '<w:p><w:pPr><w:spacing w:after="0" w:line="120" w:lineRule="exact"/></w:pPr></w:p>')
    x = x[:ws] + grid + x[we:]

    # Find the mistake: drop the paragraph, keep wrong work + two blanks
    i = x.index(t('Adding 3.5 + 12, this student lined up the right-hand digits instead of the points and got 4.7. Find the error and give the correct answer.'))
    ps = x.rindex('<w:p>', 0, i)
    pe = x.index('</w:p>', i) + len('</w:p>')
    x = x[:ps] + x[pe:]
    x = rep(x, t('Correct answer: ______   (line up the points: 3.5 + 12.0)'), t('Correct answer: ______'))
    x = rep(x, t('A digit in the wrong place is still wrong. Line up the points.  ★'), t('Line up the points.  ★'))
    return x


# ---------------- Guided / Light shared ----------------
OLD_FOR = (t('For ') + '</w:r><w:r><w:rPr>' + CONS + '<w:b/><w:bCs/><w:color w:val="222222"/><w:sz w:val="22"/><w:szCs w:val="22"/></w:rPr>'
           + t('0.6 × 7') + '</w:r><w:r><w:rPr><w:color w:val="222222"/><w:sz w:val="22"/><w:szCs w:val="22"/></w:rPr>'
           + t(': 6×7 = 42, and 0.6 has one decimal place, so the answer has one → 4.2.'))
NEW_FOR = (t('') + '</w:r><w:r><w:rPr>' + CONS + '<w:b/><w:bCs/><w:color w:val="222222"/><w:sz w:val="22"/><w:szCs w:val="22"/></w:rPr>'
           + t('0.6 × 7') + '</w:r><w:r><w:rPr><w:color w:val="222222"/><w:sz w:val="22"/><w:szCs w:val="22"/></w:rPr>'
           + t(':  6 × 7 = 42  →  one decimal place  →  4.2'))


def guided(x):
    x = rep(x, t('Line up the decimal points — not the right-hand digits. Fill gaps with zeros.'), t('Line up the points. Fill gaps with zeros.'))
    x = rep(x, t('Add or subtract as usual; bring the point straight down.'), t('Add or subtract. Bring the point down.'))
    x = rep(x, t('To multiply, ignore the point, multiply, then count the decimal places in the factors.'), t('Multiply: count the decimal places.'))
    x = rep(x, OLD_FOR, NEW_FOR)
    x = rep(x, t('Guided practice — fill in each step'), t('Your turn — fill in each step'))
    return x


def light(x):
    x = rep(x, OLD_FOR, NEW_FOR)
    x = rep(x, t('Copy the move — worked, then your turn'), t('Worked example, then your turn'))
    return x


if __name__ == '__main__':
    process('FluencyLab_M5_Mixed_Review.docx', mixed)
    process('FluencyLab_M5_Operations_Guided.docx', guided)
    process('FluencyLab_M5_Operations_Light.docx', light)
