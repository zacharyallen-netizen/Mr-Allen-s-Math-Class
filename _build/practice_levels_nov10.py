"""Units 1-5 practice pages: Score 3/4/5 on every problem; Units 1 and 3 trimmed (repeats only, the
harder problem of a repeated pair stays). Approved by Mr. Allen, Nov 10, 2026. Run once:
    python3 _build/practice_levels_nov10.py
Each section keeps its listed problems, ordered Score 3 -> 4 -> 5 and renumbered (except the 5.1-5.4 set,
which keeps its printed numbers). Removed problems are in git history and Practice_Backup_Units1-5_2026-11-10.zip.
Then rebuild the PDFs: node _build/practice_pdf.js <page> <Blank.pdf> <AnswerKey.pdf>"""
import os, re, json
G = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'grade8')

# page -> per section (in order): {problem n: score}; a problem missing from the dict is cut
U3 = [{2: 3, 3: 3, 4: 3, 5: 4}, {2: 3, 4: 4}, {1: 4, 3: 4, 2: 5}, {2: 4, 3: 5}, {2: 3, 4: 3, 3: 4, 5: 5}, {1: 4, 2: 5}]
U4 = [{1: 3, 2: 3, 3: 3, 4: 4}, {1: 3, 2: 4}, {1: 3, 2: 4, 3: 4, 4: 4}, {1: 3, 2: 4, 3: 4, 4: 5, 5: 5}, {1: 4, 2: 4, 3: 4}]
U5 = [{1: 3, 2: 3, 3: 4, 4: 4}, {1: 3, 2: 4, 3: 4}, {1: 3, 2: 4, 3: 4}, {1: 4, 2: 5}, {1: 4, 2: 5}, {1: 4, 2: 4, 3: 5}]
EXP = lambda a: [{k: v for k, v in zip(range(1, a + 1), [3, 3, 4, 4, 4, 4][:a])}, {1: 3, 2: 4, 3: 3, 4: 4, 5: 4, 6: 4, 7: 5}]
PLAN = {
 'unit1-practice-1.html': [{1: 3, 3: 3, 2: 4, 5: 4}, {1: 3, 2: 3, 4: 3, 3: 4, 5: 4}, {2: 3, 4: 3}, {1: 3, 2: 4}, {2: 4, 1: 5, 3: 5}],
 'unit1-practice-2.html': [{4: 3, 5: 3, 6: 4}, {1: 3, 2: 3, 3: 4, 4: 4, 5: 4}, {2: 3, 4: 3}, {1: 3, 2: 4}, {3: 4, 1: 5, 4: 5}],
 'unit2-practice-exponents-1.html': EXP(5),
 'unit2-practice-exponents-2.html': EXP(6),
 'unit2-practice-sci-notation-1.html': [{1: 3, 2: 3, 3: 3, 4: 4, 5: 4}, {1: 4, 2: 4, 3: 5}],
 'unit2-practice-sci-notation-2.html': [{1: 3, 2: 3, 3: 3, 4: 4, 5: 4}, {1: 4, 2: 4, 3: 5}, {1: 5}],
 'unit3-practice-1.html': U3, 'unit3-practice-2.html': U3,
 'unit4-practice-1.html': U4, 'unit4-practice-2.html': U4,
 'unit5-practice-1.html': U5, 'unit5-practice-2.html': U5,
 'unit5-practice-problems.html': [dict.fromkeys(range(1, 5), 3), dict.fromkeys(range(5, 9), 4), {9: 5, 10: 5},
                                  dict.fromkeys(range(1, 5), 3), dict.fromkeys(range(5, 9), 4), {9: 5, 10: 5},
                                  dict.fromkeys(range(1, 5), 4), dict.fromkeys(range(5, 9), 5),
                                  dict.fromkeys(range(1, 5), 4), {5: 4, 6: 4}, dict.fromkeys(range(7, 11), 5)],
}
KEEP_NUMBERS = {'unit5-practice-problems.html'}

if __name__ == '__main__':
    for fn, plan in PLAN.items():
        path = os.path.join(G, fn); s = open(path, encoding='utf-8').read()
        m = re.search(r'<script>window.PRACTICE = (\{.*?\});</script>', s); d = json.loads(m.group(1))
        secs = d['data']['secs']; assert len(secs) == len(plan), fn
        assert not any('lv' in p for sec in secs for p in sec['probs']), fn + ' already done'
        cut = []
        for sec, lv in zip(secs, plan):
            ns = [p['n'] for p in sec['probs']]
            assert set(lv) <= set(ns), (fn, sec['title'], lv, ns)
            keep = [p for p in sec['probs'] if p['n'] in lv]
            cut += [f"{sec['title'][:2]}{p['n']}" for p in sec['probs'] if p['n'] not in lv]
            keep.sort(key=lambda p: (lv[p['n']], ns.index(p['n'])))
            for k, p in enumerate(keep, 1):
                p['lv'] = lv[p['n']]
                if fn not in KEEP_NUMBERS: p['n'] = k
            sec['probs'] = keep
        s = s[:m.start(1)] + json.dumps(d, ensure_ascii=False) + s[m.end(1):]
        open(path, 'w', encoding='utf-8').write(s)
        print(fn, sum(len(x['probs']) for x in secs), 'problems; cut', cut or '-')
