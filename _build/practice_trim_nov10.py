"""Units 7, 8, 9 practice: Score 3/4/5 labels + the cuts Mr. Allen approved (Nov 10, 2026). Run once:
    python3 _build/practice_trim_nov10.py
Each tab (Unit 9: each section) keeps only the listed problems, in Score 3 -> 4 -> 5 order, renumbered.
Cut problems are in Practice_Backup_Units7-9_2026-11-10.zip (sent to Mr. Allen) and in git history.
Then rebuild the PDFs:  node _build/notes_pdf.js unitN-practice-2.html unitN_worksheet.pdf unitN_answer_key.pdf - "label"
and  node _build/u9_pdfs.js"""
import os, re
G = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'grade8')
LV = '<span class="pr-lv l{0}">Score {0}</span>'
CSS = ('<style id="lv-css">.pr-lv{font:700 12px Inter,system-ui,sans-serif;padding:2px 8px;border-radius:999px;margin-left:8px;'
       'white-space:nowrap;vertical-align:1px;letter-spacing:.02em}.pr-lv.l3{background:#E7F6EC;color:#15803D}'
       '.pr-lv.l4{background:#E8F0FB;color:#0056B3}.pr-lv.l5{background:#FDF0E1;color:#B45309}</style>')
# page -> {id prefix: [(original question number, score), ...] in the new order}
PLAN = {
 'unit7-practice-1.html': {
   'u7c1_': [(1, 3), (2, 3), (4, 4), (6, 4), (9, 4), (5, 5), (8, 5)],
   'u7c2_': [(1, 3), (2, 3), (3, 4), (4, 4), (7, 5), (8, 5)],
   'u7c3_': [(1, 3), (2, 3), (3, 4), (4, 4), (6, 4), (5, 5), (8, 5)]},
 'unit7-practice-2.html': {
   'u7h1_': [(1, 3), (3, 3), (2, 4), (5, 4), (8, 4), (6, 5)],
   'u7h2_': [(1, 3), (2, 3), (3, 4), (4, 4), (6, 4), (7, 5)],
   'u7h3_': [(1, 3), (2, 3), (3, 4), (4, 4), (6, 4), (5, 5), (8, 5)],
   'u7h4_': [(1, 4), (5, 4), (2, 5), (3, 5)]},
 'unit8-practice-1.html': {
   'u8c1_': [(1, 3), (2, 3), (4, 4), (6, 4), (5, 5)],
   'u8c2_': [(1, 3), (2, 3), (3, 3), (6, 4), (8, 5)],
   'u8c3_': [(1, 3), (2, 3), (3, 4), (5, 4), (7, 5)],
   'u8c4_': [(1, 3), (2, 3), (7, 4), (4, 5), (5, 5)],
   'u8c5_': [(1, 4), (3, 4), (4, 4), (2, 5), (7, 5)]},
 'unit8-practice-2.html': {
   'u8h1_': [(1, 3), (2, 3), (3, 5), (5, 5)],
   'u8h2_': [(1, 3), (2, 3), (5, 4), (4, 5)],
   'u8h3_': [(2, 3), (1, 4), (4, 4), (5, 5)],
   'u8h4_': [(1, 3), (4, 4), (3, 5), (5, 5)],
   'u8h5_': [(1, 3), (3, 4), (8, 4), (2, 5), (6, 5)]},
}
# Unit 9: section order stays; [(card id, score)] per section in the new order
U9 = [[('v1', 3), ('v4', 3), ('v10', 4)], [('v2', 3), ('v5', 4)], [('v3', 3), ('v6', 4)], [('v9', 5), ('v11', 5), ('v12', 5)]]
U9_CUT = ['v7', 'v8']


def block_end(s, i):
    depth = 0
    for m in re.compile(r'<div\b|</div>').finditer(s, i):
        depth += 1 if m.group() == '<div' else -1
        if depth == 0: return m.end()
    raise ValueError


def trim_qc(fn, plan):
    path = os.path.join(G, fn); s = open(path, encoding='utf-8').read()
    assert 'class="pr-lv' not in s, fn + ' already done'
    for pre, keep in plan.items():
        spans = [(m.start(), block_end(s, m.start()), int(m.group(1))) for m in re.finditer(r'<div class="qc" id="%s(\d+)">' % re.escape(pre), s)]
        assert spans, pre
        a, b = spans[0][0], spans[-1][1]
        blocks = {n: s[x:y] for x, y, n in spans}
        gaps = [s[spans[i][1]:spans[i + 1][0]] for i in range(len(spans) - 1)]
        assert all(not g.strip() for g in gaps), (fn, pre, [g[:80] for g in gaps if g.strip()])
        old2new = {n: k for k, (n, _) in enumerate(keep, 1)}
        out = []
        for k, (n, sc) in enumerate(keep, 1):
            q = blocks[n]
            q = re.sub(r'(<div class="qnum">)Question \d+', lambda m: f'{m.group(1)}Question {k}', q, count=1)
            q = re.sub(r'(<div class="qnum">.*?)(</div>)', lambda m: m.group(1) + LV.format(sc) + m.group(2), q, count=1, flags=re.S)
            out.append(q)
        print(fn, pre, len(spans), '->', len(keep), 'cut', sorted(set(blocks) - set(old2new)))
        s = s[:a] + '\n\n'.join(out) + s[b:]
    s = s.replace('</head>', CSS + '\n</head>', 1)
    open(path, 'w', encoding='utf-8').write(s)


def fix_refs(fn, plan):
    """renumber 'Q6' / 'Questions 3 and 4' inside question text after the cards were renumbered"""
    path = os.path.join(G, fn); s = open(path, encoding='utf-8').read()
    for pre, keep in plan.items():
        old2new = {n: k for k, (n, _) in enumerate(keep, 1)}
        def card(m):
            q = m.group(0)
            def ref(r):
                nums = [int(x) for x in re.findall(r'\d+', r.group(0))]
                assert all(x in old2new for x in nums), (fn, pre, r.group(0))
                return re.sub(r'\d+', lambda d: str(old2new[int(d.group())]), r.group(0))
            parts = re.split(r'(<div class="qt">.*?</div>)', q, flags=re.S)
            return ''.join(re.sub(r'\bQ\d+\b|\bQuestions? \d+(?: and \d+)?', ref, p) if p.startswith('<div class="qt">') else p for p in parts)
        s = re.sub(r'<div class="qc" id="%s\d+">.*?<div class="fb"' % re.escape(pre), card, s, flags=re.S)
    open(path, 'w', encoding='utf-8').write(s)


def unit9():
    fn = 'unit9-practice.html'; path = os.path.join(G, fn); s = open(path, encoding='utf-8').read()
    assert 'class="pr-lv' not in s
    cards = {m.group(1): (m.start(), block_end(s, m.start())) for m in re.finditer(r'<div class="q-card" id="(v\d+)">', s)}
    secs = [m.start() for m in re.finditer(r'<div class="sec-header">', s)]
    assert len(secs) == 4 and len(cards) == 12
    order = sorted(cards.items(), key=lambda kv: kv[1][0])
    a, b = order[0][1][0], order[-1][1][1]
    out, k = [], 0
    for si, sec in enumerate(U9):
        hdr = re.search(r'<div class="sec-header">.*?</div>\n', s[secs[si]:]).group(0)
        if si: out.append('\n' + hdr)
        for cid, sc in sec:
            k += 1; x, y = cards[cid]; q = s[x:y]
            q = re.sub(r'<div class="q-num">Problem V\d+</div>', f'<div class="q-num">Problem {k}{LV.format(sc)}</div>', q, count=1)
            out.append(q + '\n')
    first_hdr = re.search(r'<div class="sec-header">.*?</div>\n', s[secs[0]:]).group(0)
    assert s[secs[0]:a].strip() == first_hdr.strip(), s[secs[0]:a][:200]
    s = s[:a] + ''.join(out).rstrip('\n') + s[b:]
    s = s.replace('</head>', CSS + '\n</head>', 1)
    open(path, 'w', encoding='utf-8').write(s)
    print(fn, 12, '->', k, 'cut', U9_CUT)


if __name__ == '__main__':
    for fn, plan in PLAN.items():
        trim_qc(fn, plan); fix_refs(fn, plan)
    unit9()
