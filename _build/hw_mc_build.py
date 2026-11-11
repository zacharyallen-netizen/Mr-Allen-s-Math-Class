#!/usr/bin/env python3
"""NUMBER OR MULTIPLE CHOICE ONLY (Nov 11, 2026, Mr. Allen: "The answer should be a number or a multiple choice answer").

Turns every homework problem into a tap-a-choice problem or a type-a-number problem, WITHOUT putting answers on the site.

    python3 _build/hw_mc_build.py PRIVATE_DIR

PRIVATE_DIR is a folder OUTSIDE this repo. It holds
  review.json   made by hw_check_build.py (what the key says for each problem; readable answers, never commit)
  raw.json      the key's text per problem (used only to count the printed choices A, B, C, D)
  mc_*.py       the choices written for each unit: U = {'1.1': {4: mc(...), 6: pick(...), 8: num(...)}, ...}
                multi([RIGHT, RIGHT], [choices in the order to show], q=None)  -> select all that apply (tap several, then Check)
                mc(question, RIGHT, wrong, wrong, wrong)  -> shuffled the same way every time
                pick(RIGHT, [choices in the order to show], q=None)
                num(ANSWER, q=None)                        -> a number box
                (question may be None: the printed problem already asks it)

It writes two public files:
  grade8/homework/choices.js   HW_MC[hw][num] = 4 | ["text", ...] | {q, c:[...]} | {q, n:1}   (choices only; nothing marks the right one)
  grade8/homework/check.js     HW_CHECK[hw][num] = ["l", code] for a choice, ["n", code] for a number (scrambled codes)
and one private file, PRIVATE_DIR/expect.json (the right letter / number, for the test).

A homework listed in an mc_*.py file must have EVERY problem covered (the script stops if one is left as typed words).
Homework not listed yet keeps its old codes. The right answer can always be re-found from the codes by testing each choice
with HWCheck.check, so losing PRIVATE_DIR does not break the site.
"""
import sys, os, re, json, glob, random
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import hw_check_build as K

LET = 'ABCDEF'
def mc(q, right, *wrong):
    assert 1 <= len(wrong) <= 4, 'need 1 to 4 wrong choices'
    return {'q': q, 'c': [right] + list(wrong), 'a': 0, 'shuffle': True}
def pick(right, options, q=None):
    assert right in options, (right, options)
    return {'q': q, 'c': list(options), 'a': list(options).index(right)}
def multi(rights, options, q=None):
    assert rights and all(r in options for r in rights) and len(rights) < len(options), (rights, options)
    return {'q': q, 'c': list(options), 'm': sorted(list(options).index(r) for r in rights)}
def num(ans, q=None):
    assert K.num(str(ans)) is not None, ans
    return {'q': q, 'n': str(ans)}

AUTO = {'true': ['True', 'False'], 'false': ['True', 'False'], 'yes': ['Yes', 'No'], 'no': ['Yes', 'No'],
        'rational': ['Rational', 'Irrational'], 'irrational': ['Rational', 'Irrational'], '<': ['<', '>', '='], '>': ['<', '>', '='],
        'infinitely many': ['One solution', 'No solution', 'Infinitely many'], 'no solution': ['One solution', 'No solution', 'Infinitely many']}

def main():
    priv = os.path.abspath(sys.argv[1])
    assert not priv.startswith(ROOT), 'keep the private folder outside the repo'
    rev = json.load(open(os.path.join(priv, 'review.json'))); raw = json.load(open(os.path.join(priv, 'raw.json')))
    page = open(os.path.join(ROOT, 'grade8', 'homework_turn_in.html'), encoding='utf-8').read()
    HW = json.loads(re.search(r'var HW = (\[.*?\]);\n', page, re.S).group(1))
    old = open(os.path.join(ROOT, 'grade8', 'homework', 'check.js'), encoding='utf-8').read()
    check = json.loads(re.search(r'window\.HW_CHECK = (\{.*\});', old, re.S).group(1))
    U = {}
    for f in sorted(glob.glob(os.path.join(priv, 'mc_*.py'))):
        ns = {'mc': mc, 'pick': pick, 'num': num, 'multi': multi}; exec(open(f, encoding='utf-8').read(), ns)
        for hw, d in ns['U'].items():
            assert hw not in U, hw + ' twice'; U[hw] = {str(k): v for k, v in d.items()}
    warn = []
    choices = {}; expect = {}; stats = {'tap printed letter': 0, 'tap a choice': 0, 'number': 0}
    try: choices = json.loads(re.search(r'window\.HW_MC = (\{.*\});', open(os.path.join(ROOT, 'grade8', 'homework', 'choices.js'), encoding='utf-8').read(), re.S).group(1))
    except Exception: choices = {}
    for h in HW:
        hw = h['id']
        if hw not in U: continue
        cho = {}; chk = {}; exp = {}
        for p in h['p']:
            n = str(p[0]); key = 'hw|' + hw + '|' + n + '|'; r = rev.get(hw, {}).get(n, ['-', '']); a = U[hw].get(n)
            if a is None:                                              # not written by hand: only the clear-cut kinds
                if r[0] == 'n': a = {'q': None, 'n': r[1], 'canon': True}
                elif r[0] == 'l' and len(r[1]) == 1:
                    q = raw.get(hw, {}).get(n); L = set(r[1].upper())
                    assert q, 'count the choices for %s #%s by hand: pick(...)' % (hw, n)
                    for x in q['q']: L.update(re.findall(r'(?<![A-Za-z0-9])([A-E])(?=\s|$)', x['t']))
                    k = LET.index(max(L)) + 1; assert 3 <= k <= 4, (hw, n, sorted(L))
                    cho[n] = k; chk[n] = ['l', K.h53(key + r[1])]; exp[n] = r[1].upper(); stats['tap printed letter'] += 1; continue
                elif r[0] == 'w' and r[1] in AUTO: a = pick([o for o in AUTO[r[1]] if o.lower() == r[1]][0], AUTO[r[1]])
                else: raise SystemExit('%s #%s (%s %s) has no choices yet' % (hw, n, r[0], r[1]))
            if isinstance(a, int):                                     # printed letters, counted by hand
                assert r[0] == 'l' and len(r[1]) == 1, (hw, n); cho[n] = a; chk[n] = ['l', K.h53(key + r[1])]; exp[n] = r[1].upper(); stats['tap printed letter'] += 1; continue
            if 'n' in a:
                canon = a['n'] if a.get('canon') else K.num(a['n'])
                if a.get('q'): cho[n] = {'q': a['q'], 'n': 1}
                chk[n] = ['n', K.h53(key + canon)]; exp[n] = a['n']; stats['number'] += 1; continue
            if 'm' in a:
                c = list(a['c']); L = ''.join(LET[i].lower() for i in a['m']); assert len(set(c)) == len(c) and len(c) <= 6, (hw, n)
                cho[n] = {'q': a.get('q') or 'Tap ALL that are true. Then tap Check.', 'c': c, 'm': 1}
                chk[n] = ['l', K.h53(key + L)]; exp[n] = L.upper(); stats['tap a choice'] += 1; continue
            c = list(a['c']); right = c[a['a']]
            if r[0] == 'p':                                            # the key had a written form: the right choice should say the same thing
                f = lambda t: (K.form(re.sub(r'\s*(m|days?|sheets?|g|kg|cm|in|ft|units?)\b\.?$', '', t)) or '').replace('(', '').replace(')', '')
                if f(right) != r[1].replace('(', '').replace(')', ''): warn.append('%s #%s key says %s, right choice is %s' % (hw, n, r[1], right))
            if r[0] == 'w' and K.words(right) != r[1] and r[1] not in (K.words(right) or ''): warn.append('%s #%s key says %s, right choice is %s' % (hw, n, r[1], right))
            assert len(set(x.strip().lower() for x in c)) == len(c), 'two choices are the same: %s #%s' % (hw, n)
            assert 2 <= len(c) <= 5
            if a.get('shuffle'): random.Random(int(K.h53(key), 16)).shuffle(c)
            L = LET[c.index(right)].lower()
            cho[n] = {'q': a['q'], 'c': c} if a.get('q') else c
            chk[n] = ['l', K.h53(key + L)]; exp[n] = L.upper() + ' = ' + right; stats['tap a choice'] += 1
        extra = set(U[hw]) - set(str(p[0]) for p in h['p']); assert not extra, (hw, extra)
        choices[hw] = cho; check[hw] = chk; expect[hw] = exp
    order = [h['id'] for h in HW]
    choices = {k: choices[k] for k in order if k in choices}; check = {k: check[k] for k in order if k in check}
    open(os.path.join(ROOT, 'grade8', 'homework', 'choices.js'), 'w', encoding='utf-8').write(
        '/* How each homework problem is answered: tap a choice or type a number (see homework_turn_in.html). Choices only: nothing here marks the right one. Made by _build/hw_mc_build.py. */\nwindow.HW_MC = ' + json.dumps(choices, separators=(',', ':'), ensure_ascii=False) + ';\n')
    open(os.path.join(ROOT, 'grade8', 'homework', 'check.js'), 'w', encoding='utf-8').write(
        '/* Scrambled codes for checking homework answers (no answers here). Made from the private key; see homework-check.js. */\nwindow.HW_CHECK = ' + json.dumps(check, separators=(',', ':')) + ';\n')
    prev = {}
    try: prev = json.load(open(os.path.join(priv, 'expect.json')))
    except Exception: pass
    prev.update(expect); json.dump(prev, open(os.path.join(priv, 'expect.json'), 'w'), ensure_ascii=False, indent=0)
    for w in warn: print('LOOK:', w)
    left = sum(1 for h in HW if h['id'] not in choices)
    print(stats, '| homework switched over:', len(choices), 'of', len(HW), '| left:', left)

if __name__ == '__main__': main()
