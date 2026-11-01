"""Helpers for editing Module 4 Fluency Lab worksheets in place (lxml on word/document.xml).
Stacked fractions reuse the exact 2-row table pattern already used in these files."""
import copy, zipfile, shutil, os
from lxml import etree

WNS = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'
W = '{%s}' % WNS
NONE4 = ('<w:top w:val="none" w:color="FFFFFF" w:sz="0"/><w:left w:val="none" w:color="FFFFFF" w:sz="0"/>'
         '<w:bottom w:val="none" w:color="FFFFFF" w:sz="0"/><w:right w:val="none" w:color="FFFFFF" w:sz="0"/>')
TBLB = ('<w:tblBorders><w:top w:val="single" w:color="auto" w:sz="4"/><w:left w:val="single" w:color="auto" w:sz="4"/>'
        '<w:bottom w:val="single" w:color="auto" w:sz="4"/><w:right w:val="single" w:color="auto" w:sz="4"/>'
        '<w:insideH w:val="{ih}" w:color="{ihc}" w:sz="{ihs}"/><w:insideV w:val="single" w:color="auto" w:sz="4"/></w:tblBorders>')
CONS = '<w:rFonts w:ascii="Consolas" w:cs="Consolas" w:eastAsia="Consolas" w:hAnsi="Consolas"/>'

GREEN = '127A4F'; INK = '1A1A1A'; OPC = '7A86A8'; RED = 'B03A2E'
NBSP = ' '


def esc(s):
    return s.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')


def frag(xml):
    root = etree.fromstring('<root xmlns:w="%s">%s</root>' % (WNS, xml))
    return list(root)


BOXC = '9AA3B5'


def _fcell(text, color, bar, line, sz, box=False):
    """box=True: dashed grey write-in slot (the bar stays the dark bottom border of the top cell)."""
    no = lambda side: '<w:%s w:val="none" w:color="FFFFFF" w:sz="0"/>' % side
    gb = lambda side: '<w:%s w:val="dashed" w:color="%s" w:sz="6"/>' % (side, BOXC)
    bb = ('<w:bottom w:val="single" w:color="1A1A1A" w:sz="8"/>' if bar
          else (gb('bottom') if box else no('bottom')))
    top = no('top') if (not box or not bar) else gb('top')
    lr = (gb('left') + '%s' + gb('right')) if box else (no('left') + '%s' + no('right'))
    return ('<w:tc><w:tcPr><w:tcW w:type="dxa" w:w="520"/><w:tcBorders>'
            + top + (lr % bb) + '</w:tcBorders>'
            '<w:tcMar><w:top w:type="dxa" w:w="0"/><w:left w:type="dxa" w:w="30"/><w:bottom w:type="dxa" w:w="0"/>'
            '<w:right w:type="dxa" w:w="30"/></w:tcMar></w:tcPr>'
            '<w:p><w:pPr><w:spacing w:after="0" w:line="%d"/><w:jc w:val="center"/></w:pPr>'
            '<w:r><w:rPr>%s<w:b/><w:bCs/><w:color w:val="%s"/><w:sz w:val="%d"/><w:szCs w:val="%d"/></w:rPr>'
            '<w:t xml:space="preserve">%s</w:t></w:r></w:p></w:tc>') % (line, CONS, color, sz, sz, esc(text))


def frac_xml(top, bot, color=INK, tw=600, line=230, sz=26, box_top=False, box_bot=False):
    """Exact Module 4 stacked-fraction table: 2 rows, bar = bottom border of the top cell."""
    return ('<w:tbl><w:tblPr><w:tblW w:type="dxa" w:w="%d"/><w:jc w:val="center"/>' % tw
            + TBLB.format(ih='none', ihc='FFFFFF', ihs='0') +
            '</w:tblPr><w:tblGrid><w:gridCol w:w="%d"/></w:tblGrid>' % tw
            + '<w:tr>' + _fcell(top, color, True, line, sz, box_top) + '</w:tr>'
            + '<w:tr>' + _fcell(bot, color, False, line, sz, box_bot) + '</w:tr></w:tbl>')


def blank_xml():
    """Answer space for a fraction: a blank over a blank (bar between), symmetric so bars line up."""
    return frac_xml(NBSP * 3, NBSP * 3, INK, tw=640, line=250, box_top=True, box_bot=True)


def _ocell(inner, w, mar_lr=20, is_tbl=True, valign=True):
    return ('<w:tc><w:tcPr><w:tcW w:type="dxa" w:w="%d"/><w:tcBorders>%s</w:tcBorders>'
            '<w:tcMar><w:top w:type="dxa" w:w="30"/><w:left w:type="dxa" w:w="%d"/><w:bottom w:type="dxa" w:w="30"/>'
            '<w:right w:type="dxa" w:w="%d"/></w:tcMar>%s</w:tcPr>%s%s</w:tc>') % (
        w, NONE4, mar_lr, mar_lr, '<w:vAlign w:val="center"/>' if valign else '', inner, '<w:p/>' if is_tbl else '')


def run(text, color=INK, sz=22, bold=False, mono=False, italic=False):
    return ('<w:r><w:rPr>%s%s%s<w:color w:val="%s"/><w:sz w:val="%d"/><w:szCs w:val="%d"/></w:rPr>'
            '<w:t xml:space="preserve">%s</w:t></w:r>') % (
        CONS if mono else '', '<w:b/><w:bCs/>' if bold else '', '<w:i/><w:iCs/>' if italic else '',
        color, sz, sz, esc(text))


def item_cell(it):
    k = it[0]
    if k == 'f':      # ('f', top, bot[, color])
        col = it[3] if len(it) > 3 else INK
        return _ocell(frac_xml(it[1], it[2], col), 700), 700
    if k == 'fb':     # ('fb', bot): missing numerator -> write-in slot over a printed bottom
        return _ocell(frac_xml(NBSP * 3, it[1], INK, tw=640, box_top=True), 740), 740
    if k == 'b':      # stacked answer blank
        return _ocell(blank_xml(), 740), 740
    if k == 'op':     # ('op', sym[, color])
        col = it[2] if len(it) > 2 else OPC
        p = '<w:p><w:pPr><w:jc w:val="center"/></w:pPr>%s</w:p>' % run(it[1], col, 26, bold=True, mono=True)
        return _ocell(p, 520, 10, False), 520
    if k == 'num':    # ('num', text, color) whole-number answer, same style as fraction digits
        p = '<w:p><w:pPr><w:jc w:val="center"/></w:pPr>%s</w:p>' % run(it[1], it[2], 26, bold=True, mono=True)
        return _ocell(p, 700, 20, False), 700
    if k == 't':      # ('t', text, width[, color, bold, sz])
        col = it[3] if len(it) > 3 else INK
        bold = it[4] if len(it) > 4 else False
        sz = it[5] if len(it) > 5 else 22
        p = '<w:p><w:pPr><w:spacing w:after="0"/></w:pPr>%s</w:p>' % run(it[1], col, sz, bold=bold, mono=True)
        return _ocell(p, it[2], 20, False), it[2]
    if k == 'sp':     # ('sp', width)
        return _ocell('<w:p/>', it[1], 20, False), it[1]
    raise ValueError(it)


def row_xml(items):
    cells = [item_cell(i) for i in items]
    tw = sum(w for _, w in cells)
    return ('<w:tbl><w:tblPr><w:tblW w:type="dxa" w:w="%d"/><w:jc w:val="left"/>' % tw
            + TBLB.format(ih='single', ihc='auto', ihs='4') + '</w:tblPr><w:tblGrid>'
            + ''.join('<w:gridCol w:w="%d"/>' % w for _, w in cells) + '</w:tblGrid><w:tr>'
            + ''.join(c for c, _ in cells) + '</w:tr></w:tbl>')


def row(items):
    return frag(row_xml(items))[0]


# ---------- tree helpers ----------
def txt(e):
    return ''.join(e.itertext())


def body(tree):
    return tree.getroot().find(W + 'body')


def paras(tree):
    return list(body(tree).iter(W + 'p'))


def find_p(tree, startswith):
    hits = [p for p in paras(tree) if txt(p).startswith(startswith)]
    assert len(hits) == 1, (startswith, len(hits))
    return hits[0]


def find_ps(tree, startswith):
    return [p for p in paras(tree) if txt(p).startswith(startswith)]


def set_text(p, *texts):
    """Keep the first len(texts) runs (their formatting), give them new text, drop the rest."""
    rs = p.findall(W + 'r')
    assert len(rs) >= len(texts), (txt(p), len(rs))
    for r, t in zip(rs, texts):
        ts = r.findall(W + 't')
        ts[0].text = t
        ts[0].set('{http://www.w3.org/XML/1998/namespace}space', 'preserve')
        for x in ts[1:]:
            r.remove(x)
    for r in rs[len(texts):]:
        p.remove(r)


def replace_with(old, new_elems):
    parent = old.getparent()
    i = parent.index(old)
    parent.remove(old)
    for k, e in enumerate(new_elems):
        parent.insert(i + k, e)


def remove(e):
    e.getparent().remove(e)


def is_frac(tbl):
    rows = tbl.findall(W + 'tr')
    return (len(rows) == 2 and all(len(r.findall(W + 'tc')) == 1 for r in rows)
            and tbl.find('.//' + W + 'tbl') is None)


def row_tables(tree):
    """Horizontal problem rows: single-row tables whose cells hold fractions/operators."""
    out = []
    for t in body(tree).iter(W + 'tbl'):
        rs = t.findall(W + 'tr')
        if len(rs) == 1 and any(c.find(W + 'tbl') is not None and is_frac(c.find(W + 'tbl'))
                                for c in rs[0].findall(W + 'tc')):
            out.append(t)
    return out


def cells(rt):
    return rt.find(W + 'tr').findall(W + 'tc')


def cell_kind(tc):
    t = tc.find(W + 'tbl')
    if t is not None and is_frac(t):
        rs = t.findall(W + 'tr')
        return ('f', txt(rs[0]), txt(rs[1]))
    return ('x', txt(tc))


def describe(rt):
    return [cell_kind(c) for c in cells(rt)]


def refit(rt):
    """Recompute tblW / tblGrid from cell widths."""
    ws = [int(c.find(W + 'tcPr/' + W + 'tcW').get(W + 'w')) for c in cells(rt)]
    rt.find(W + 'tblPr/' + W + 'tblW').set(W + 'w', str(sum(ws)))
    g = rt.find(W + 'tblGrid')
    for x in list(g):
        g.remove(x)
    for w in ws:
        e = etree.SubElement(g, W + 'gridCol')
        e.set(W + 'w', str(w))


def set_cell_items(tc, item):
    """Replace a row cell with a freshly built cell for item."""
    new = frag(item_cell(item)[0])[0]
    replace_with(tc, [new])
    return new


def fix_minus(tree):
    n = 0
    for t in body(tree).iter(W + 't'):
        if t.text == '-':
            t.text = '−'; n += 1
    return n


def blank_answers(tree):
    """Every '=' followed by a '___' cell in a problem row -> stacked blank."""
    n = 0
    for rt in row_tables(tree):
        cs = cells(rt)
        for i, c in enumerate(cs):
            s = txt(c).strip()
            if s and set(s) == {'_'} and i > 0 and txt(cs[i - 1]).strip() == '=':
                set_cell_items(c, ('b',)); n += 1
        refit(rt)
    return n


# ---------- io ----------
def load(path):
    return etree.parse(path)


def save_docx(tree, src_docx, out_docx):
    data = etree.tostring(tree, xml_declaration=True, encoding='UTF-8', standalone=True)
    zin = zipfile.ZipFile(src_docx)
    tmp = out_docx + '.tmp'
    with zipfile.ZipFile(tmp, 'w', zipfile.ZIP_DEFLATED) as zout:
        for info in zin.infolist():
            buf = data if info.filename == 'word/document.xml' else zin.read(info.filename)
            zout.writestr(info, buf)
    os.replace(tmp, out_docx)
