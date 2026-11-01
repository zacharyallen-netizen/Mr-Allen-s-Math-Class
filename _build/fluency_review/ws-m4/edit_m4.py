import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from m4lib import *

S = os.path.dirname(os.path.abspath(__file__))
ORIG = os.path.join(S, 'orig')
OUT = os.path.join(S, 'work')
X = os.path.join(S, 'x')
os.makedirs(OUT, exist_ok=True)

TAIL = ('<w:p><w:pPr><w:spacing w:after="0" w:line="120" w:lineRule="exact"/></w:pPr></w:p>')


def ensure_tail(tc):
    kids = [k for k in tc if k.tag != W + 'tcPr']
    if kids and kids[-1].tag == W + 'tbl':
        tc.append(frag(TAIL)[0])


GAP = ('<w:p><w:pPr><w:spacing w:after="0" w:line="40" w:lineRule="exact"/></w:pPr></w:p>')


def swap_para_for_row(p, items):
    """Replace a one-line paragraph by a row of stacked fractions. Adjacent tables merge in Word/LO,
    so keep a tiny paragraph between tables."""
    tc = p.getparent()
    prev = p.getprevious()
    new = row(items)
    replace_with(p, [new])
    if prev is not None and prev.tag == W + 'tbl':
        new.addprevious(frag(GAP)[0])
    ensure_tail(tc)


def heading(tree, old, new):
    set_text(find_p(tree, old), new)


def common(tree):
    a = fix_minus(tree)
    b = blank_answers(tree)
    return a, b


def open_doc(name):
    return load(os.path.join(X, name, 'word', 'document.xml'))


def no_split_boxes(tree):
    for tbl in body(tree).findall(W + 'tbl'):
        for tr in tbl.findall(W + 'tr'):
            trpr = tr.find(W + 'trPr')
            if trpr is None:
                trpr = etree.Element(W + 'trPr'); tr.insert(0, trpr)
            if trpr.find(W + 'cantSplit') is None:
                etree.SubElement(trpr, W + 'cantSplit')


def finish(tree, name):
    no_split_boxes(tree)
    save_docx(tree, os.path.join(ORIG, name + '.docx'), os.path.join(OUT, name + '.docx'))
    print('saved', name)


# ---------------- AddSub Guided ----------------
def addsub_guided():
    n = 'FluencyLab_M4_AddSub_Guided'
    t = open_doc(n)
    print(common(t))
    heading(t, 'Refresher', 'Refresher')
    set_text(find_p(t, 'Same bottom?'), 'Different bottoms? Make them the same first.')
    set_text(find_p(t, 'Rewrite: 1/2'), 'Rewrite both fractions over 6.')
    set_text(find_p(t, 'Add the tops, keep'), 'Add the tops. Keep the bottom.')
    set_text(find_p(t, 'We never add'), 'Never add the bottoms.')
    heading(t, 'Guided practice', 'Guided practice')
    for p in find_ps(t, 'Common denominator of'):
        prob = p.getprevious()
        assert prob.tag == W + 'tbl'
        tr = prob.find(W + 'tr')
        for it in (('sp', 500), ('t', 'Common denominator: ______', 3800)):
            tr.append(frag(item_cell(it)[0])[0])
        refit(prob)
        remove(p)
    probs = {'1/4 = ': (('1', '4'), ('1', '6')), '5/6 = ': (('5', '6'), ('1', '4')), '2/3 = ': (('2', '3'), ('3', '5'))}
    for k, (f1, f2) in probs.items():
        swap_para_for_row(find_p(t, k), [('f',) + f1, ('op', '='), ('b',), ('sp', 700),
                                         ('f',) + f2, ('op', '='), ('b',)])
    for p in find_ps(t, 'Add the tops:  ') + find_ps(t, 'Subtract the tops:'):
        lead = txt(p).split('Answer')[0].rstrip()
        swap_para_for_row(p, [('t', lead, 5300), ('t', 'Answer:', 1150), ('b',)])
    finish(t, n)


# ---------------- AddSub Light ----------------
def addsub_light():
    n = 'FluencyLab_M4_AddSub_Light'
    t = open_doc(n)
    print(common(t))
    set_text(find_p(t, 'Different bottoms'), 'Common denominator first. Never add the bottoms.')
    heading(t, 'Copy the move', 'Copy the move')
    finish(t, n)


# ---------------- Foundations ----------------
def foundations():
    n = 'FluencyLab_M4_Foundations'
    t = open_doc(n)
    print(common(t))
    set_text(find_p(t, 'Equivalent fractions'), 'Equivalent', '  — top and bottom times the same number.')
    set_text(find_p(t, 'Simplify  —'), 'Simplify', '  — divide top and bottom until you can’t.')
    set_text(find_p(t, 'Compare  —'), 'Compare', '  — common denominator, then compare the tops.')
    heading(t, 'Build equivalents', 'Fill the missing number')
    for rt in row_tables(t):
        cs = cells(rt)
        d = describe(rt)
        kinds = [x[0] for x in d]
        # Equivalents: 2/3 = ?/12 = [blank]  ->  2/3 = [blank over 12]
        if len(d) >= 3 and d[2][0] == 'f' and d[2][1] == '?':
            bot = d[2][2]
            # blank numerator, same line height as printed fractions so bars stay aligned
            new = frag(item_cell(('fb', bot))[0])[0]
            replace_with(cs[2], [new])
            for c in cells(rt)[3:]:
                remove(c)
        # Simplify: drop the narrow 'Simplify' label cell
        elif d[0] == ('x', 'Simplify'):
            remove(cs[0])
        # Compare: a/b ___ c/d = [blank]  ->  drop '= blank'
        elif len(d) == 5 and d[1][0] == 'x' and set(d[1][1].strip()) == {'_'}:
            remove(cs[3]); remove(cs[4])
            set_cell_items(cs[1], ('t', '____', 620, INK, True, 22))
            # center the compare blank
            p = cells(rt)[1].find(W + 'p')
            jc = etree.SubElement(p.find(W + 'pPr'), W + 'jc'); jc.set(W + 'val', 'center')
        refit(rt)
    set_text(find_p(t, 'Same number, top'), 'Same number, top and bottom. ★')
    finish(t, n)


# ---------------- Mixed Review ----------------
def mixed():
    n = 'FluencyLab_M4_Mixed_Review'
    t = open_doc(n)
    print(common(t))
    set_text(find_p(t, 'Every operation'), 'Common denominator for + and − only.')
    heading(t, 'Find and fix', 'Find the mistake')
    remove(find_p(t, 'Adding 1/2 + 1/3'))
    p = find_p(t, '1/2 + 1/3')
    swap_para_for_row(p, [('f', '1', '2', RED), ('op', '+'), ('f', '1', '3', RED), ('op', '='),
                          ('f', '2', '5', RED), ('t', '  ✗ wrong', 1400, RED, True, 22)])
    set_text(find_p(t, 'What went wrong?'), 'What went wrong? ______________________________')
    swap_para_for_row(find_p(t, 'Correct answer:'), [('t', 'Correct answer:', 2100), ('b',)])
    set_text(find_p(t, 'You never add'), 'Never add the bottoms. ★')
    finish(t, n)


# ---------------- MulDiv Guided ----------------
def muldiv_guided():
    n = 'FluencyLab_M4_MulDiv_Guided'
    t = open_doc(n)
    print(common(t))
    heading(t, 'Refresher', 'Refresher')
    set_text(find_p(t, 'Multiply: straight'), 'Multiply: ', 'tops × tops, bottoms × bottoms.')
    pd = find_p(t, 'Divide: multiply')
    set_text(pd, 'Divide: ', 'flip the second fraction, then multiply.')
    heading(t, 'Guided practice', 'Guided practice')
    swap_para_for_row(find_p(t, 'Flip the second fraction:'),
                      [('t', 'Flip the second:', 2300), ('f', '3', '4'), ('op', '→'), ('b',)])
    swap_para_for_row(find_p(t, 'Multiply:  1/2'),
                      [('t', 'Multiply:', 2300), ('f', '1', '2'), ('op', '×'), ('b',), ('op', '='), ('b',)])
    for p in find_ps(t, 'Answer (then simplify)'):
        swap_para_for_row(p, [('t', 'Simplest answer:', 2300), ('b',)])
    set_text(find_p(t, 'Multiply across;'), 'Multiply across. Flip to divide. ★')
    finish(t, n)


# ---------------- MulDiv Light ----------------
def muldiv_light():
    n = 'FluencyLab_M4_MulDiv_Light'
    t = open_doc(n)
    print(common(t))
    set_text(find_p(t, 'Multiply: straight across. Divide'), 'Multiply straight across. Divide: flip, then multiply.')
    heading(t, 'Copy the move', 'Copy the move')
    # worked example 1/2 ÷ 1/4 = 2/1  ->  = 2
    for rt in row_tables(t):
        d = describe(rt)
        if d[-1] == ('f', '2', '1'):
            set_cell_items(cells(rt)[-1], ('num', '2', GREEN))
            refit(rt)
    finish(t, n)


if __name__ == '__main__':
    for f in (addsub_guided, addsub_light, foundations, mixed, muldiv_guided, muldiv_light):
        f()
