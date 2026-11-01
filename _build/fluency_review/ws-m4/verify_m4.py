import sys, os, re, zipfile
from fractions import Fraction as F
from lxml import etree
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from m4lib import W, txt, is_frac
import docx

d = sys.argv[1]
WORDY = re.compile(r'\b(miles?|pens?|recipe|cups?|pizza|cake|students?|people|dollars?|cost|each|bought|has|have|gets?|shares?|feet|inches|hours?|minutes?)\b|\$', re.I)
OPS = {'+': lambda a, b: a + b, '−': lambda a, b: a - b, '-': lambda a, b: a - b, '×': lambda a, b: a * b, '÷': lambda a, b: a / b}
bad = 0
for f in sorted(os.listdir(d)):
    if not f.endswith('.docx'): continue
    p = os.path.join(d, f)
    docx.Document(p)  # opens?
    z = zipfile.ZipFile(p)
    root = etree.fromstring(z.read('word/document.xml'))
    foot = etree.fromstring(z.read('word/footer1.xml'))
    print('=====', f)
    # 1. slash pattern + word-problem words in all visible text
    for e in (root, foot):
        for para in e.iter(W + 'p'):
            s = ''.join(t.text or '' for t in para.iter(W + 't'))
            if re.search(r'[0-9A-Za-z?_]\s*/\s*[0-9A-Za-z?_]', s):
                print('  SLASH:', s); bad += 1
            if WORDY.search(s):
                print('  WORDY?:', s)
    # 2. every problem row: fractions/ops/answers
    for rt in root.iter(W + 'tbl'):
        rs = rt.findall(W + 'tr')
        if len(rs) != 1: continue
        items = []
        for tc in rs[0].findall(W + 'tc'):
            t = tc.find(W + 'tbl')
            if t is not None and is_frac(t):
                a, b = (txt(r).strip() for r in t.findall(W + 'tr'))
                items.append(('F', a, b))
            elif t is None:
                s = txt(tc).strip()
                if s: items.append(('T', s))
        if not any(i[0] == 'F' for i in items): continue
        def show(i):
            if i[0] == 'F':
                return '[%s/%s]' % (i[1] or '□', i[2] or '□')
            return i[1]
        line = ' '.join(show(i) for i in items)
        # evaluate printed chain a op b (= c ...)
        note = ''
        fr = [i for i in items if i[0] == 'F']
        if len(items) >= 3 and items[0][0] == 'F' and items[1][0] == 'T' and items[1][1] in OPS and items[2][0] == 'F' \
                and items[0][1].isdigit() and items[2][1].isdigit():
            val = OPS[items[1][1]](F(int(items[0][1]), int(items[0][2])), F(int(items[2][1]), int(items[2][2])))
            note = 'answer = %s' % val
            # check printed results after '='
            rest = items[3:]
            for k in range(len(rest) - 1):
                if rest[k] == ('T', '=') :
                    nx = rest[k + 1]
                    if nx[0] == 'F' and nx[1].isdigit():
                        if k + 2 < len(rest) and rest[k + 2][0] == 'T' and rest[k + 2][1] in OPS:
                            v2 = OPS[rest[k + 2][1]](F(int(nx[1]), int(nx[2])), F(int(rest[k + 3][1]), int(rest[k + 3][2])))
                            ok = v2 == val
                        else:
                            ok = F(int(nx[1]), int(nx[2])) == val
                        note += ' | printed %s/%s %s' % (nx[1], nx[2], 'OK' if ok else 'WRONG')
                        if not ok and 'wrong' not in line: bad += 1
                    elif nx[0] == 'T' and nx[1].isdigit():
                        ok = F(int(nx[1])) == val
                        note += ' | printed %s %s' % (nx[1], 'OK' if ok else 'WRONG')
                        if not ok: bad += 1
        elif len(items) >= 3 and items[1] == ('T', '=') and items[2][0] == 'F' and not items[2][1] and items[2][2] and items[0][1].isdigit():
            a = F(int(items[0][1]), int(items[0][2]))
            note = 'missing top = %s' % (a * int(items[2][2]))
            assert (a * int(items[2][2])).denominator == 1
        elif len(items) == 3 and items[1] == ('T', '=') and items[2][0] == 'F' and items[2][1] == '':
            pass
        elif len(fr) == 2 and len(items) == 3 and set(items[1][1]) == {'_'}:
            a = F(int(fr[0][1]), int(fr[0][2])); b = F(int(fr[1][1]), int(fr[1][2]))
            note = 'compare: %s' % ('>' if a > b else '<' if a < b else '=')
        elif len(items) == 3 and items[1] == ('T', '=') and items[0][1].isdigit() and items[2][1] == '':
            note = 'simplest = %s' % F(int(items[0][1]), int(items[0][2]))
        print('  ', line, ' ->', note)
print('PROBLEMS FLAGGED:', bad)
