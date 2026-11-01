"""Module 7 (Ratios) worksheet clean-up: no word problems, stacked-fraction proportions
(Module 4's 2-row table technique), short labels. Reads originals from ws-m7/orig, writes to module folder."""
import re, shutil, zipfile, pathlib
from xml.sax.saxutils import escape

S = pathlib.Path('/home/claude/mr-allen-s-math-class/_build/fluency_review/ws-m7')
M = pathlib.Path('/home/claude/mr-allen-s-math-class/grade8/Fluency-Lab-Package/module-materials/Module-7-Ratios')

# ---------- Module 4 stacked-fraction XML pattern (copied verbatim, values parameterised) ----------
NONE4 = ('<w:top w:val="none" w:color="FFFFFF" w:sz="0"/><w:left w:val="none" w:color="FFFFFF" w:sz="0"/>'
         '<w:bottom w:val="none" w:color="FFFFFF" w:sz="0"/><w:right w:val="none" w:color="FFFFFF" w:sz="0"/>')
TBLB = ('<w:tblBorders><w:top w:val="single" w:color="auto" w:sz="4"/><w:left w:val="single" w:color="auto" w:sz="4"/>'
        '<w:bottom w:val="single" w:color="auto" w:sz="4"/><w:right w:val="single" w:color="auto" w:sz="4"/>'
        '<w:insideH w:val="single" w:color="auto" w:sz="4"/><w:insideV w:val="single" w:color="auto" w:sz="4"/></w:tblBorders>')
TBLB_FRAC = ('<w:tblBorders><w:top w:val="single" w:color="auto" w:sz="4"/><w:left w:val="single" w:color="auto" w:sz="4"/>'
             '<w:bottom w:val="single" w:color="auto" w:sz="4"/><w:right w:val="single" w:color="auto" w:sz="4"/>'
             '<w:insideH w:val="none" w:color="FFFFFF" w:sz="0"/><w:insideV w:val="single" w:color="auto" w:sz="4"/></w:tblBorders>')
CONS = '<w:rFonts w:ascii="Consolas" w:cs="Consolas" w:eastAsia="Consolas" w:hAnsi="Consolas"/>'


def rpr(color, sz, bold=True, mono=True):
    return ('<w:rPr>' + (CONS if mono else '') + ('<w:b/><w:bCs/>' if bold else '') +
            f'<w:color w:val="{color}"/><w:sz w:val="{sz}"/><w:szCs w:val="{sz}"/></w:rPr>')


def run(text, color, sz, bold=True, mono=True):
    return f'<w:r>{rpr(color, sz, bold, mono)}<w:t xml:space="preserve">{escape(text)}</w:t></w:r>'


def frac_half(text, bar, color, sz):
    bottom = '<w:bottom w:val="single" w:color="1A1A1A" w:sz="8"/>' if bar else '<w:bottom w:val="none" w:color="FFFFFF" w:sz="0"/>'
    return ('<w:tr><w:tc><w:tcPr><w:tcW w:type="dxa" w:w="520"/><w:tcBorders>'
            '<w:top w:val="none" w:color="FFFFFF" w:sz="0"/><w:left w:val="none" w:color="FFFFFF" w:sz="0"/>'
            + bottom + '<w:right w:val="none" w:color="FFFFFF" w:sz="0"/></w:tcBorders>'
            '<w:tcMar><w:top w:type="dxa" w:w="0"/><w:left w:type="dxa" w:w="30"/><w:bottom w:type="dxa" w:w="0"/>'
            '<w:right w:type="dxa" w:w="30"/></w:tcMar></w:tcPr>'
            '<w:p><w:pPr><w:spacing w:after="0" w:line="230"/><w:jc w:val="center"/></w:pPr>'
            + run(text, color, sz) + '</w:p></w:tc></w:tr>')


def frac_cell(top, bot, color='1A1A1A', sz=26, w=700):
    return (f'<w:tc><w:tcPr><w:tcW w:type="dxa" w:w="{w}"/><w:tcBorders>{NONE4}</w:tcBorders>'
            '<w:tcMar><w:top w:type="dxa" w:w="30"/><w:left w:type="dxa" w:w="20"/><w:bottom w:type="dxa" w:w="30"/>'
            '<w:right w:type="dxa" w:w="20"/></w:tcMar><w:vAlign w:val="center"/></w:tcPr>'
            f'<w:tbl><w:tblPr><w:tblW w:type="dxa" w:w="600"/><w:jc w:val="center"/>{TBLB_FRAC}</w:tblPr>'
            '<w:tblGrid><w:gridCol w:w="600"/></w:tblGrid>'
            + frac_half(top, True, color, sz) + frac_half(bot, False, color, sz) +
            '</w:tbl><w:p/></w:tc>')


def text_cell(text, w, color='7A86A8', sz=26, bold=True, mono=True, jc='center'):
    return (f'<w:tc><w:tcPr><w:tcW w:type="dxa" w:w="{w}"/><w:tcBorders>{NONE4}</w:tcBorders>'
            '<w:tcMar><w:top w:type="dxa" w:w="30"/><w:left w:type="dxa" w:w="10"/><w:bottom w:type="dxa" w:w="30"/>'
            '<w:right w:type="dxa" w:w="10"/></w:tcMar><w:vAlign w:val="center"/></w:tcPr>'
            f'<w:p><w:pPr><w:jc w:val="{jc}"/></w:pPr>' + (run(text, color, sz, bold, mono) if text else '') +
            '</w:p></w:tc>')


def expr_table(cells):
    """cells: list of (xml, width)."""
    total = sum(w for _, w in cells)
    grid = ''.join(f'<w:gridCol w:w="{w}"/>' for _, w in cells)
    return (f'<w:tbl><w:tblPr><w:tblW w:type="dxa" w:w="{total}"/><w:jc w:val="left"/>{TBLB}</w:tblPr>'
            f'<w:tblGrid>{grid}</w:tblGrid><w:tr>' + ''.join(x for x, _ in cells) + '</w:tr></w:tbl>')


NB = '\u00a0'
TINY_P = '<w:p><w:pPr><w:spacing w:after="0" w:line="120" w:lineRule="exact"/></w:pPr></w:p>'


def F(t, b, w=700, **k):
    return (frac_cell(str(t), str(b), w=w, **k), w)


def OP(s, **k):
    return (text_cell(s, 520, **k), 520)


LBL_W, PROB_W, ANS_W = 360, 2300, 1700   # every problem row: label | problem | answer (answers line up)


def label_cell(label):
    return (text_cell(label, LBL_W, color='2E5A87', sz=20, mono=False, jc='left'), LBL_W)


def answer_cell(text):
    return (text_cell(text, ANS_W, color='1A1A1A', sz=22, bold=False, jc='left'), ANS_W)


def proportion_problem(label, a, b, c, d):
    """'N)' label + a/b = c/d (one of them '?') + '? = ______' answer, all in one row."""
    cells = [label_cell(label), F(a, b), OP('='), F(c, d),
             (text_cell('', PROB_W - 1920), PROB_W - 1920), answer_cell('? = ______')]
    return expr_table(cells) + TINY_P


def colon_problem(label, prob, ans='? = ______'):
    cells = [label_cell(label), (text_cell(prob, PROB_W, color='1A1A1A', sz=22, bold=False, jc='left'), PROB_W),
             answer_cell(ans)]
    return expr_table(cells) + TINY_P


SIMP_ANS = '= ___ : ___'


# ---------- helpers on the document XML ----------
def sub_text(x, old, new, count=1):
    o, n = '>' + escape(old, {"'": '&apos;'}) + '</w:t>', '>' + escape(new) + '</w:t>'
    if x.count(o) == 0:  # some cells use non-breaking spaces; keep that convention
        o, n = o.replace(' ', NB), n.replace(' ', NB)
    assert x.count(o) == count, (old, x.count(o))
    return x.replace(o, n)


def para_with(x, text):
    t = '>' + escape(text, {"'": '&apos;'}) + '</w:t>'
    if t not in x:
        t = t.replace(' ', NB)
    i = x.index(t)
    s = x.rindex('<w:p>', 0, i)
    e = x.index('</w:p>', i) + len('</w:p>')
    return s, e


def replace_para(x, text, new_xml):
    s, e = para_with(x, text)
    return x[:s] + new_xml + x[e:]


def drop_para(x, text):
    return replace_para(x, text, '')


NB = ' '


def refresher(x):
    x = sub_text(x, '12 : 8  =  3 : 2        (÷ 4)', '12 : 8   =  3 : 2    (÷ 4)')
    x = sub_text(x, '2 : 3  =  ? : 12  →  8   (× 4)', '2 : 3    =  8 : 12   (× 4)')
    x = sub_text(x, '180 miles ÷ 3 hours = 60 mph', '180 : 3  =  60 : 1   (÷ 3)')
    # stacked-fraction proportion line, Module 4 style
    s, e = para_with(x, '180 : 3  =  60 : 1   (÷ 3)')
    tbl = expr_table([F(3, 4, w=1000), (text_cell('=', 600, color='1A1A1A', sz=24), 600), F(6, 8),
                      (text_cell('', 720), 720),
                      (text_cell('(× 2)', 1100, color='1A1A1A', sz=24, jc='left'), 1100)])
    para = x[s:e].replace('<w:spacing w:after="0" w:line="300"/>', '<w:spacing w:after="110" w:line="300"/>', 1)
    return x[:s] + para + tbl + TINY_P + x[e:]


def core_common(x):
    x = refresher(x)
    x = replace_para(x, 'Simplify 10 : 4  =  ______', colon_problem('1)', 'Simplify 10 : 4', SIMP_ANS))
    x = replace_para(x, 'Simplify 6 : 9  =  ______', colon_problem('2)', 'Simplify 6 : 9', SIMP_ANS))
    x = replace_para(x, '2 : 5 = ? : 20  =  ______', colon_problem('3)', '2 : 5 = ? : 20'))
    x = replace_para(x, '150 miles ÷ 5 hours  =  ______', colon_problem('4)', '150 : 5 = ? : 1'))
    x = replace_para(x, 'Solve  x/3 = 8/12  =  ______', proportion_problem('5)', '?', 3, 8, 12))
    x = replace_para(x, '$20 for 4 → $ per 1  =  ______', proportion_problem('6)', 6, 8, 3, '?'))
    return x


def light(x):
    x = core_common(x)
    x = sub_text(x, 'Copy the move — worked, then your turn', 'Copy the move')
    x = sub_text(x, '18 : 12 = 3 : 2', '18 : 12 = 3 : 2   (÷ 6)')
    x = sub_text(x, 'Simplify 20 : 8  =  ____', 'Simplify 20 : 8  =  ____ : ____')
    x = sub_text(x, '2 : 3 = ? : 15 → 10', '2 : 3 = 10 : 15   (× 5)')
    x = sub_text(x, '4 : 5 = ? : 20  =  ____', '4 : 5 = ? : 20    ?  =  ____')
    x = sub_text(x, '$18 ÷ 6 = $3 each', '18 : 6 = 3 : 1   (÷ 6)')
    x = sub_text(x, '$24 for 4 → each  =  ____', '24 : 4 = ? : 1    ?  =  ____')
    return x


def guided(x):
    x = core_common(x)
    x = sub_text(x, 'Simplify by dividing both numbers by their greatest common factor.',
                 'Simplify: divide both by greatest common factor.')
    x = sub_text(x, 'Scale up or down by multiplying (or dividing) both numbers by the same amount.',
                 'Equivalent: multiply both by the same number.')
    x = sub_text(x, "Unit rate: divide to find the amount 'per one'.", 'Unit rate: divide to get ? : 1.')
    x = sub_text(x, 'Proportion: find the scale factor or unit rate first.', 'Proportion: find the scale factor first.')
    x = sub_text(x, 'Guided practice — fill in each step', 'Guided practice')
    x = sub_text(x, '240 miles in 4 hours', '240 : 4  =  ? : 1')
    x = sub_text(x, "Divide for 'per one':  240 ÷ 4 = ______ miles per hour", '240 ÷ 4 = ______ ,  so  ? = ______')
    x = sub_text(x, "Find 'per one' or the scale factor — then it's easy.  ★", 'Find the scale factor first.  ★')
    return x


def mixed(x):
    x = drop_para(x, "Simplify, scale, and reason about rates. Always find 'per one' or the scale factor.")
    x = replace_para(x, 'Simplify 24 : 16  =  ______', colon_problem('1)', 'Simplify 24 : 16', SIMP_ANS))
    x = replace_para(x, '3 : 4 = ? : 16  =  ______', colon_problem('2)', '3 : 4 = ? : 16'))
    x = replace_para(x, '300 miles ÷ 6 hours  =  ______', colon_problem('3)', '300 : 6 = ? : 1'))
    x = replace_para(x, 'Solve  x/5 = 6/10  =  ______', proportion_problem('4)', '?', 5, 6, 10))
    x = replace_para(x, 'Split 20 as 2:3 (smaller part)  =  ______', proportion_problem('5)', 4, '?', 12, 15))
    x = replace_para(x, '5 pens for $10 → 3 pens  =  ______', proportion_problem('6)', 2, 5, '?', 15))
    x = sub_text(x, 'Find and fix the mistake', 'Find the mistake')
    x = drop_para(x, 'For 2 : 3 = ? : 12, this student added 4 to the top (because 3 + 9 = 12) and wrote 6 — '
                     'but you reach 12 by multiplying by 4, not adding 9. Find the error and give the correct answer.')
    x = sub_text(x, 'Correct answer: ______ : 12   (3 × 4 = 12, so 2 × 4)', 'Correct answer:  2 : 3 = ______ : 12')
    x = sub_text(x, 'Ratios scale by multiplying, never by adding.  ★', 'Ratios scale by multiplying.  ★')
    return x


JOBS = {'FluencyLab_M7_Core_Light.docx': light,
        'FluencyLab_M7_Core_Guided.docx': guided,
        'FluencyLab_M7_Mixed_Review.docx': mixed}

for name, fn in JOBS.items():
    src = S / 'orig' / name
    out = S / 'work' / name
    out.parent.mkdir(exist_ok=True)
    with zipfile.ZipFile(src) as zin, zipfile.ZipFile(out, 'w', zipfile.ZIP_DEFLATED) as zout:
        for item in zin.infolist():
            data = zin.read(item.filename)
            if item.filename == 'word/document.xml':
                data = fn(data.decode('utf-8')).encode('utf-8')
            zout.writestr(item, data)
    shutil.copy(out, M / name)
    print('wrote', M / name)
