"""Part 2 practice in the Interactive Notes (Nov 9, 2026, approved by Mr. Allen):
fewer problems, leveled Score 3 / Score 4 / Score 5. ONLY the Part 2 practice sections change; the notes do not.
Every removed problem is kept in the Nov 9 backup (Interactive_Notes_Backup_2026-11-09) and in git history.

    python3 _build/notes_part2.py          (run once; it refuses to run on a page that was already trimmed)
Then rebuild the twins: python3 _build/notes_twins/build.py   (they read SCORES below for the labels)
"""
import os, re, sys
from bs4 import BeautifulSoup, NavigableString

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
G = os.path.join(ROOT, 'grade8')
LBL = {3: 'Score 3', 4: 'Score 4', 5: 'Score 5'}
CLS = {3: 'l1', 4: 'l2', 5: 'l3'}
LV_CSS = ('<style>.np-lv{font:700 .74rem Inter,system-ui,sans-serif;letter-spacing:.03em;padding:2px 8px;border-radius:999px;white-space:nowrap;margin-right:4px;vertical-align:1px}'
          '.np-lv.l1{background:#E7F6EC;color:#15803D}.np-lv.l2{background:#E8F0FB;color:#0056B3}.np-lv.l3{background:#FDF0E1;color:#B45309}</style>')
INTRO = ('<p class="pt2-intro">Every problem has a level: <span class="np-lv l1">Score 3</span> <span class="np-lv l2">Score 4</span> '
         '<span class="np-lv l3">Score 5</span>. Start with Score 3, then move up.</p>')

# ---- the approved plan: (group heading or None, [(kind, ref, score)]) -------------------------------------------
# kind: chk = element id; np = notes-practice question id (np<box>-<n>); sa = (h3 text start, n-th .sa under it)
PLAN = {
 'unit2-notes-exponents': [('A. Exponent Rules with Monomials', [('chk', 'u2pA1', 3), ('chk', 'u2pA2', 3), ('chk', 'u2pA3', 3),
     ('chk', 'u2pA4', 4), ('chk', 'u2pA5', 4), ('chk', 'u2pA7', 4), ('chk', 'u2pA9', 4),
     ('chk', 'u2pA8', 5), ('chk', 'u2pA10', 5), ('chk', 'u2pA11', 5), ('chk', 'u2pA12', 5)])],
 'unit2-notes-sci-notation': [
     ('A. Scientific Notation Conversions', [('chk', 'u2pB1', 3), ('chk', 'u2pB2', 3), ('chk', 'u2pB3', 3), ('chk', 'u2pB4', 3)]),
     ('B. Operations', [('chk', 'u2pC1', 4), ('chk', 'u2pC3', 4), ('chk', 'u2pC4', 4)]),
     ('C. Word Problems', [('sa', ('C. Word Problems', 1), 5), ('sa', ('C. Word Problems', 2), 5), ('sa', ('C. Word Problems', 4), 5), ('sa', ('C. Word Problems', 6), 5)])],
 'unit3-notes': [
     ('A. Multi-Step Equations', [('chk', 'pA1', 3), ('chk', 'pA3', 4), ('chk', 'pA4', 4), ('chk', 'pA6', 5)]),
     ('B. Special Cases', [('chk', 'pB1', 3), ('chk', 'pB2', 3), ('chk', 'pB4', 4)]),
     ('C. Inequalities', [('chk', 'pC1', 3), ('chk', 'pC3', 4), ('chk', 'pC6', 4), ('chk', 'pC7', 5)]),
     ('D. Word Problems', [('sa', ('D. Word Problems', 1), 4), ('sa', ('D. Word Problems', 4), 4), ('sa', ('D. Word Problems', 2), 5)])],
 'unit4-notes': [
     ('Score 3', [('np', 'np5-1', 3), ('np', 'np5-3', 3), ('np', 'np5-6', 3), ('np', 'np5-7', 3), ('chk', 'u4pA2', 3), ('chk', 'u4pA3', 3), ('chk', 'u4pB2', 3)]),
     ('Score 4', [('np', 'np5-2', 4), ('np', 'np5-4', 4), ('np', 'np5-9', 4), ('chk', 'u4pD1', 4), ('chk', 'u4pD2', 4), ('chk', 'u4pD3', 4),
                  ('chk', 'u4pD4', 4), ('chk', 'u4pD5', 4), ('chk', 'u4pD6', 4)]),
     ('Score 5', [('np', 'np5-5', 5), ('np', 'np5-8', 5), ('np', 'np5-10', 5)])],
 'unit5-notes': [
     ('Score 3', [('np', 'np7-1', 3), ('np', 'np7-2', 3), ('np', 'np7-3', 3), ('chk', 'u5pB2', 3), ('chk', 'u5pD2', 3)]),
     ('Score 4', [('np', 'np7-4', 4), ('np', 'np7-5', 4), ('np', 'np7-6', 4), ('np', 'np7-7', 4), ('np', 'np7-8', 4),
                  ('chk', 'u5pA8', 4), ('chk', 'u5pB7', 4), ('chk', 'u5pD5', 4), ('sa', ('C. Word Problems', 1), 4)]),
     ('Score 5', [('np', 'np7-9', 5), ('np', 'np7-10', 5), ('np', 'np7-11', 5), ('chk', 'u5pE5', 5), ('chk', 'u5pE6', 5),
                  ('sa', ('C. Word Problems', 3), 5), ('sa', ('C. Word Problems', 4), 5)])],
}
UNIT1 = {'Classify Each Number': [(1, 3), (3, 3), (4, 3), (8, 4), (11, 4)],
         'Estimate Each Square Root': [(1, 3), (4, 4), (9, 4), (11, 5)],
         'Order from Least to Greatest': [(1, 3), (4, 4), (5, 5)]}
SCORES = {page: {ref: sc for _, items in groups for kind, ref, sc in items if kind != 'sa'} for page, groups in PLAN.items()}
SCORES['unit7-notes'] = {f'np5-{k}': sc for k, sc in zip(range(1, 11), [3, 3, 3, 4, 4, 5, 5, 4, 4, 5])}


def lv_span(soup, sc, extra=()):
    t = soup.new_tag('span', attrs={'class': ['np-lv', CLS[sc]] + list(extra)}); t.string = LBL[sc]; return t


def set_lv(soup, el, sc):
    """Replace (or add) the level pill in an item's question line."""
    q = el.select_one('.chk-q') or el
    old = q.select_one('.np-lv')
    extra = [c for c in (old.get('class') if old else []) if c not in ('np-lv', 'l1', 'l2', 'l3')]
    new = lv_span(soup, sc, extra)
    if old: old.replace_with(new)
    else:
        first = q.find(string=re.compile(r'\S'))
        if first is not None and re.match(r'\s*\d+[.)]\s*', str(first)):     # after "3) " / "3. "
            m = re.match(r'(\s*\d+[.)]\s*)(.*)', str(first), re.S)
            first.replace_with(NavigableString(m.group(1)))
            q.find(string=m.group(1)).insert_after(new); new.insert_after(NavigableString(' ' + m.group(2)))
        else: q.insert(0, new); new.insert_after(NavigableString(' '))
    return q


def renumber(q, n):
    """'7) text' / '<strong>7.</strong> text' → n."""
    for s in q.find_all(string=re.compile(r'^\s*\d+[.)]')):
        s.replace_with(NavigableString(re.sub(r'^(\s*)\d+([.)])', lambda m: f'{m.group(1)}{n}{m.group(2)}', str(s), count=1))); return
    st = q.find('strong')
    if st and re.match(r'^\d+\.$', st.get_text(strip=True)): st.string = f'{n}.'


def part2(page):
    path = os.path.join(G, page + '.html'); s = open(path, encoding='utf-8').read()
    a = s.index('<section class="topic" id="practice">'); b = s.index('</section>', a) + len('</section>')
    sec = s[a:b]
    if 'data-part2="trimmed"' in sec: print(page, 'already trimmed'); return
    # notes-practice ids: boxes are numbered over the whole page
    nbox_before = len(re.findall(r'<div class="np[" ]', s[:a]))
    soup = BeautifulSoup(sec, 'html.parser'); root = soup.section
    boxes = root.select('.np')
    for bi, box in enumerate(boxes):
        for k, q in enumerate(box.select('.np-q'), 1):
            if not q.get('id'): q['id'] = f'np{nbox_before + bi + 1}-{k}'
    head_end = root.find(['h3']) or (boxes[0] if boxes else None)
    keep_head = []
    for el in list(root.children):
        if el is head_end or (boxes and el is boxes[0]): break
        if getattr(el, 'name', None) == 'p' and 'pt2-intro' in (el.get('class') or []): continue
        keep_head.append(el)

    def find_sa(h3start, n):
        h = [x for x in root.find_all('h3') if x.get_text(' ', strip=True).startswith(h3start)][0]
        out = []
        for sib in h.find_next_siblings():
            if sib.name == 'h3': break
            if 'sa' in (sib.get('class') or []): out.append(sib)
            out += [x for x in sib.select('.sa')] if sib.name == 'div' and 'sa' not in (sib.get('class') or []) else []
        return out[n - 1]

    def h3_for(title):
        for x in root.find_all('h3'):
            if x.get_text(' ', strip=True).startswith(title): return x
        return None

    first_box = boxes[-1] if boxes else None
    parts = [str(x) for x in keep_head] + [INTRO]
    for title, items in PLAN[page]:
        h = h3_for(title)
        if h is not None:
            h = BeautifulSoup(str(h), 'html.parser').h3
        else:
            h = soup.new_tag('h3', attrs={'class': ['sub']}); h.string = title
        if title.startswith('Score'):
            sc = int(title[-1]); h.clear(); h.append(lv_span(soup, sc)); h.append(NavigableString(' ' + {3: 'Start here', 4: 'On grade level', 5: 'Challenge'}[sc]))
        blk = [str(h)]
        h0 = h3_for(title); tip = h0.find_next_sibling() if h0 is not None else None
        if tip is not None and tip.name == 'p' and 'blank-tip' in (tip.get('class') or []): blk.append(str(tip))
        nps = [r for k_, r, _ in items if k_ == 'np']
        if nps:
            box = soup.new_tag('div', attrs={'class': ['np', 'final'], 'data-score': '', 'data-title': first_box.get('data-title', ''), })
            if first_box.get('data-std'): box['data-std'] = first_box['data-std']
            hd = soup.new_tag('div', attrs={'class': ['np-h'], 'hidden': ''}); box.append(hd)
            for k_, r, sc in items:
                if k_ != 'np': continue
                q = root.find(id=r); q['data-level'] = str(sc - 2); box.append(BeautifulSoup(str(q), 'html.parser').div)
            blk.append(str(box))
        n = len(nps); col = []
        for k_, r, sc in items:
            if k_ == 'np': continue
            el = root.find(id=r) if k_ == 'chk' else find_sa(*r)
            el = BeautifulSoup(str(el), 'html.parser').div
            n += 1; q = set_lv(soup, el, sc); renumber(q, n)
            col.append((k_, str(el)))
        chks = [h_ for k_, h_ in col if k_ == 'chk']; sas = [h_ for k_, h_ in col if k_ == 'sa']
        if chks: blk.append('<div class="two-col">' + '\n'.join(chks) + '</div>')
        blk += sas
        parts.append('\n'.join(blk))
    css = '' if page in ('unit3-notes', 'unit4-notes', 'unit5-notes') else LV_CSS + '\n'
    if PLAN[page][0][0].startswith('Score'):
        # one section per score level, so no section is too long (ids: practice = first, practice-end = last, for Send my work)
        head, groups = parts[:len(keep_head) + 1], parts[len(keep_head) + 1:]
        h2 = root.find('h2')
        secs = []
        for gi, g in enumerate(groups):
            sc = 3 + gi
            hh = BeautifulSoup(str(h2), 'html.parser').h2
            for t in hh.find_all(string=True):
                if 'Part 2' in t: t.replace_with(NavigableString(re.sub(r'Part 2.*', f'Part 2 — Practice, Score {sc}', str(t))))
            body = ([str(hh)] + [str(x) for x in keep_head if getattr(x, 'name', None) != 'h2'] + [INTRO] if gi == 0 else [str(hh)]) + [g]
            sid = 'practice' if gi == 0 else ('practice-end' if gi == len(groups) - 1 else f'practice-{sc}')
            secs.append(f'<section class="topic" id="{sid}" data-part2="trimmed">\n' + css + '\n'.join(body) + '\n</section>')
        new = '\n\n'.join(secs)
        s = s.replace("mount:'#practice',", "mount:'#practice-end',", 1)
    else:
        new = f'<section class="topic" id="practice" data-part2="trimmed">\n' + css + '\n'.join(parts) + '\n</section>'
    s = s[:a] + new + s[b:]
    open(path, 'w', encoding='utf-8').write(s)
    print(page, 'kept', sum(len(i) for _, i in PLAN[page]))


def unit1():
    page = 'unit1-notes'; path = os.path.join(G, page + '.html'); s = open(path, encoding='utf-8').read()
    if 'data-part2="trimmed"' in s: print(page, 'already trimmed'); return
    for title, keep in UNIT1.items():
        i = s.index(title); a = s.rindex('<section class="topic"', 0, i); b = s.index('</section>', i) + len('</section>')
        soup = BeautifulSoup(s[a:b], 'html.parser'); sec = soup.section
        sec['data-part2'] = 'trimmed'
        tbl = sec.find('table')
        if tbl is not None:
            rows = tbl.find_all('tr')[1:]
            byn = {int(re.match(r'\s*(\d+)\.', r.td.get_text()).group(1)): r for r in rows}
            for r in rows: r.extract()
            for k, (num, sc) in enumerate(keep, 1):
                r = byn[num]; td = r.td
                first = td.find(string=re.compile(r'^\s*\d+\.'))
                first.replace_with(NavigableString(re.sub(r'^(\s*)\d+\.', lambda m: f'{m.group(1)}{k}.', str(first), count=1)))
                td.insert(0, lv_span(soup, sc)); td.contents[0].insert_after(NavigableString(' '))
                tbl.append(r)
        else:
            sas = sec.select('.sa'); byn = {}
            for x in sas:
                byn[int(re.match(r'\s*(\d+)\.', x.select_one('.chk-q').get_text()).group(1))] = x; x.extract()
            for k, (num, sc) in enumerate(keep, 1):
                x = byn[num]; q = x.select_one('.chk-q'); renumber(q, k)
                q.insert(0, lv_span(soup, sc)); q.contents[0].insert_after(NavigableString(' '))
                sec.append(x)
        note = sec.find(id='estB-note')
        if note is not None:
            note.clear(); note.append(BeautifulSoup('<strong>💡 TWO ANSWERS CAN BE RIGHT:</strong> Your answer may be 1 tenth off from a calculator. That is OK. '
                                                    'The algorithm and a calculator can round a little differently. Both answers are correct.', 'html.parser'))
        h2 = sec.find('h2'); h2.insert_after(BeautifulSoup(LV_CSS, 'html.parser'))
        s = s[:a] + str(soup) + s[b:]
    open(path, 'w', encoding='utf-8').write(s)
    print(page, 'kept', sum(len(v) for v in UNIT1.values()))


def unit7():
    """Labels only (Score 3/4/5), put in order 3 → 4 → 5 (ids kept, so Send my work and the twins still match)."""
    page = 'unit7-notes'; path = os.path.join(G, page + '.html'); s = open(path, encoding='utf-8').read()
    a = s.index('<section class="topic" id="practice">'); b = s.index('</section>', a) + len('</section>')
    if 'data-score' in s[a:b]: print(page, 'already labeled'); return
    nbox_before = len(re.findall(r'<div class="np[" ]', s[:a]))
    soup = BeautifulSoup(s[a:b], 'html.parser'); box = soup.select_one('.np.final'); box['data-score'] = ''
    qs = box.select('.np-q')
    for k, q in enumerate(qs, 1):
        q['id'] = f'np{nbox_before + 1}-{k}'; q.extract()
    for q in sorted(qs, key=lambda q: int(q['data-level'])): box.append(q)
    s = s[:a] + str(soup) + s[b:]
    open(path, 'w', encoding='utf-8').write(s); print(page, 'labels + order 3 → 4 → 5')


if __name__ == '__main__':
    unit1()
    for p in PLAN: part2(p)
    unit7()
