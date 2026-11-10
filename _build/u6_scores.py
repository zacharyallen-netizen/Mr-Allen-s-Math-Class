"""Unit 6 practice: Score 3 / Score 4 / Score 5 labels + the approved cuts (Mr. Allen, Nov 9, 2026).

Notes pages (unit6-notes, -slope, -slope-intercept, -tables-systems):
  * every practice box gets data-score, so notes-practice.js shows Score 3/4/5 instead of the stars
    (data-level 1 → Score 3, 2 → Score 4, 3 → Score 5);
  * the "All sections" box: each question gets its approved level and the questions are ordered 3 → 4 → 5;
    question ids are written into the page first so ScoreSend ids and the twins never change;
  * cut: unit6-notes-slope p4 only.  The notes sections themselves are not touched.
The practice pages are handled by their own data (see HOW_TO_UPDATE.txt).  Run once:  python3 _build/u6_scores.py
Then rebuild the twins: python3 _build/notes_twins/build.py u6 u6s u6si u6t
"""
import os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
G = os.path.join(ROOT, 'grade8')

# final box: level for each question in its CURRENT order (1 = Score 3, 2 = Score 4, 3 = Score 5, None = cut)
FINAL = {
    'unit6-notes':                 [1, 1, 2, 1, 2, 3, 2, 3, 1, 2, 3],
    'unit6-notes-slope':           [1, 1, 2, 1, 2, 3, None, 2, 1, 2, 3],
    'unit6-notes-slope-intercept': [1, 1, 3, 1, 2, 2, 2, 2, 1],
    'unit6-notes-tables-systems':  [1, 2, 1, 1, 2, 3, 2, 2, 3, 3],
}
TEXT = {   # wording that named the stars
    'unit6-notes-slope-intercept': [('(★ Try it, ★★ On level, ★★★ Challenge)', '(Score 3, Score 4, Score 5)')],
    'unit6-notes': [('Start with the ★ ones if you want a warm-up.', 'Start with the Score 3 ones if you want a warm-up.')],
    'unit6-notes-tables-systems': [('★ Try it</span>', 'Score 3</span>'), ('★★ On level</span>', 'Score 4</span>'),
                                   ('★★★ Challenge</span>', 'Score 5</span>')],
}


def block_end(s, i):
    """index just past the </div> that closes the <div ...> starting at i"""
    depth = 0
    for m in re.compile(r'<div\b|</div>').finditer(s, i):
        depth += 1 if m.group() == '<div' else -1
        if depth == 0: return m.end()
    raise ValueError('unclosed div')


def do(page):
    path = os.path.join(G, page + '.html'); s = open(path, encoding='utf-8').read()
    assert 'data-u6-scores' not in s, page + ' already done'
    boxes = [m.start() for m in re.finditer(r'<div class="np[ "]', s)]
    # 1) the final box: ids, levels, order
    fi = [b for b in boxes if s.startswith('<div class="np final"', b)]
    assert len(fi) == 1; bi = boxes.index(fi[0]) + 1
    start = fi[0]; end = block_end(s, start); box = s[start:end]
    open_end = box.index('>') + 1
    qs, pos = [], open_end
    for m in re.finditer(r'<div class="np-q"', box):
        if m.start() < pos: continue
        e = block_end(box, m.start()); qs.append((m.start(), e)); pos = e
    lv = FINAL[page]; assert len(qs) == len(lv), (page, len(qs))
    items = []
    for k, ((a, e), L) in enumerate(zip(qs, lv), 1):
        q = box[a:e]
        tag = q[:q.index('>')]
        if ' id="' not in tag: q = q.replace('<div class="np-q"', f'<div class="np-q" id="np{bi}-{k}"', 1)
        if L is None: print('  cut', re.search(r'id="([^"]+)"', q).group(1)); continue
        q = re.sub(r'data-level="\d"', f'data-level="{L}"', q, 1) if 'data-level="' in q[:q.index('>')] else q.replace('<div class="np-q"', f'<div class="np-q" data-level="{L}"', 1)
        items.append((L, k, q))
    items.sort(key=lambda t: (t[0], t[1]))
    head, tail = box[:qs[0][0]], box[qs[-1][1]:]
    gaps = box[qs[0][1]:qs[1][0]] if len(qs) > 1 else '\n'
    gap = gaps if not gaps.strip() else '\n'
    box = head + gap.join(q for _, _, q in items) + tail
    s = s[:start] + box + s[end:]
    # 2) every practice box shows Score labels
    s = re.sub(r'<div class="np( final)?"(?![^>]*data-score)', lambda m: f'<div class="np{m.group(1) or ""}" data-score=""', s)
    s = s.replace('<div class="np final" data-score=""', '<div class="np final" data-score="" data-u6-scores=""', 1)
    for a, b in TEXT.get(page, []):
        assert a in s, (page, a); s = s.replace(a, b)
    open(path, 'w', encoding='utf-8').write(s)
    print(page, 'final box np%d:' % bi, ' '.join(f'S{L+2}' for L, _, _ in items))


if __name__ == '__main__':
    for p in FINAL: do(p)
