"""Verify fluency-lab-fractions.html (run: python3 test_fractions.py)."""
import re, json, os
from fractions import Fraction as Fr
from playwright.sync_api import sync_playwright

URL = 'file:///home/claude/mr-allen-s-math-class/grade8/Fluency-Lab-Package/fluency-lab/fluency-lab-fractions.html'
OUT = os.path.dirname(os.path.abspath(__file__))
IGN = re.compile(r'fonts\.googleapis|fonts\.gstatic|ERR_TUNNEL|Failed to load resource|net::ERR')
TYPES = {1: {'simplify', 'm2i', 'i2m'}, 2: {'equiv'}, 3: {'addlike'}, 4: {'addunlike'}, 5: {'mul'}, 6: {'div'}}
ALLOWED_PROB_WORDS = {'Simplify', 'Improper', 'Mixed'}
errors = []
fails = []


def ok(cond, msg):
    if not cond:
        fails.append(msg)


def words(t):
    """real words only (numbers and symbols don't count)"""
    return re.findall(r"[A-Za-z][A-Za-z']*", t)


def wl_count(page):
    return page.evaluate("document.querySelectorAll('#fwork .wl').length")


def no_hscroll(page, tag):
    sw = page.evaluate("[document.documentElement.scrollWidth, document.documentElement.clientWidth]")
    ok(sw[0] <= sw[1], f'sideways scroll {tag}: {sw}')


def solve(page, shots=None, wrong_once=False):
    """solve the current problem with the page's own move data; returns info"""
    info = {'msgs': [], 'fbs': [], 'maxwl': 0}
    wrong_done = False
    step = 0
    while True:
        st = page.evaluate("({i:M.i, n:M.mv.length, busy:M.busy, done:DONE})")
        if st['done']:
            break
        m = page.evaluate("(()=>{const m=M.mv[M.i];return {kind:m.kind||'type',expect:m.expect,key:m.key}})()")
        msg = page.inner_text('#msg')
        info['msgs'].append(msg)
        n = wl_count(page)
        info['maxwl'] = max(info['maxwl'], n)
        ok(n == 1, f'{page.evaluate("current.type")}: {n} work lines at step {step} ({page.inner_text("#fwork")!r})')
        if shots and step == shots[1]:
            page.screenshot(path=shots[0], full_page=True)
        if m['kind'] == 'tap':
            page.click('#go')
        elif m['kind'] == 'pick':
            page.click(f'#fwork .mult[data-m="{m["expect"]}"]')
        else:
            if wrong_once and not wrong_done:
                page.fill('#box', str(m['expect'] + 1))
                page.click('#go')
                fb1 = page.inner_text('#fb'); cls = page.get_attribute('#fb', 'class')
                page.fill('#box', str(m['expect'] + 1))
                page.click('#go')
                fb2 = page.inner_text('#fb')
                info['fbs'] += [fb1, fb2]
                ok(fb1 and len(words(fb1)) <= 8 and 'no' in cls, f'bad nudge {fb1!r} {cls}')
                ok(fb2.strip() == f'Type {m["expect"]}.', f'bad 2nd wrong {fb2!r}')
                wrong_done = True
            page.fill('#box', str(m['expect']))
            page.click('#go')
        page.wait_for_function(f"DONE || (M.i>{st['i']} && !M.busy)")
        step += 1
    return info


def main():
    with sync_playwright() as p:
        b = p.chromium.launch()
        page = b.new_page(viewport={'width': 390, 'height': 844})
        page.on('pageerror', lambda e: errors.append(str(e)))
        page.on('console', lambda m: m.type == 'error' and not IGN.search(m.text) and errors.append(m.text))
        page.goto(URL)
        page.evaluate("localStorage.clear()")
        page.goto(URL)
        page.wait_for_timeout(300)
        no_hscroll(page, 'start 390')
        page.screenshot(path=f'{OUT}/s390_start.png', full_page=True)
        start_txt = page.inner_text('#start')

        # ---- bulk: 400 problems per level, answers recomputed in Python ----
        bulk = page.evaluate("""(()=>{const out={};
          const tmp=document.createElement('div');
          for(let L=1;L<=6;L++){ out[L]=[];
            for(let i=0;i<400;i++){ const p=GEN[L](); const b=build(p);
              tmp.innerHTML=p.display;
              const s=Object.assign({},b.S0); b.mv.forEach(m=>{ if(m.key) s[m.key]=m.expect; Object.assign(s,m.set||{}); });
              out[L].push({p:JSON.parse(JSON.stringify(p,(k,v)=>k==='display'||k==='_u'?undefined:v)), label:tmp.textContent,
                say:b.mv.map(m=>{tmp.innerHTML=m.say;return tmp.textContent;}),
                hints:b.mv.map(m=>m.hint||''), S:s, u:p._u||null});
            } }
          return out;})()""")
        vocab = set()
        for L, arr in bulk.items():
            L = int(L)
            for r in arr:
                q, S, lab = r['p'], r['S'], r['label']
                t = q['type']
                ok(t in TYPES[L], f'L{L} wrong type {t}')
                ans = Fr(q['ansN'], q['ansD'])
                ops = re.findall(r'[+−×÷]', lab)
                ok(len(ops) <= 1, f'two operations: {lab}')
                ok(set(words(lab)) <= ALLOWED_PROB_WORDS, f'words in problem: {lab}')
                for s in r['say'] + r['hints']:
                    vocab |= set(words(s))
                    ok(len(words(s)) <= 8, f'long instruction: {s}')
                if t == 'simplify':
                    ok(Fr(q['N'], q['D']) == ans and ans.denominator == q['ansD'] and q['N'] != q['ansN'], f'simplify {q}')
                    ok(S['n'] == q['ansN'] and S['d'] == q['ansD'], f'simplify steps {q}')
                    ok(lab == f"Simplify {q['N']}/{q['D']}", f'label {lab}')
                elif t == 'equiv':
                    ok(Fr(q['n'], q['d']) == Fr(q['ansN'], q['D']) and S['t'] == q['ansN'] and S['k'] * q['d'] == q['D'], f'equiv {q}')
                    ok(lab == f"{q['n']}/{q['d']} = ?/{q['D']}", f'label {lab}')
                elif t == 'm2i':
                    ok(q['N'] == q['W'] * q['d'] + q['n'] and 0 < q['n'] < q['d'] and S['N'] == q['N'], f'm2i {q}')
                    ok(lab == f"Improper {q['W']} {q['n']}/{q['d']}", f'label {lab}')
                elif t == 'i2m':
                    ok(divmod(q['N'], q['d']) == (q['W'], q['n']) and q['n'] > 0 and S['W2'] == q['W'] and S['r2'] == q['n'], f'i2m {q}')
                    ok(lab == f"Mixed {q['N']}/{q['d']}", f'label {lab}')
                else:
                    if t == 'addlike':
                        x, y = Fr(q['a'], q['d']), Fr(q['b'], q['d'])
                    else:
                        x, y = Fr(q['a1'], q['b1']), Fr(q['a2'], q['b2'])
                    o = q.get('op')
                    exp = {'addlike': None, 'addunlike': None, 'mul': x * y, 'div': x / y}[t]
                    if exp is None:
                        exp = x + y if o == '+' else x - y
                    ok(exp == ans and exp > 0 and ans.denominator == q['ansD'], f'{t} answer {q}')
                    ok(x.numerator < x.denominator and y.numerator < y.denominator, f'{t} not proper {q}')
                    # what the student writes in the work ends at the answer
                    raw = Fr(S['raw'], r['u']['L'] if t == 'addunlike' else q['d']) if t in ('addlike', 'addunlike') else Fr(S['tn'], S['td'])
                    ok(raw == exp, f'{t} raw {q} {S}')
                    fin = Fr(S['Ln'], S['Ld']) if 'Ln' in S else raw
                    ok(fin == exp, f'{t} simplify step {q}')
                    if 'Mw' in S:
                        ok(S['Mw'] + Fr(S['Mr'], q['ansD']) == exp and 0 < S['Mr'] < q['ansD'], f'{t} mixed {q}')
                    if t == 'addunlike':
                        u = r['u']
                        ok(u['L'] % q['b1'] == 0 and u['L'] % q['b2'] == 0 and all(m % u['small'] for m in u['mults'] if m < u['L']), f'LCD {q}')
                        ok(Fr(S['t1'], u['L']) == x and Fr(S['t2'], u['L']) == y, f'scaled {q}')
                    sym = {'+': '+', '-': '−'}.get(o, '×' if t == 'mul' else '÷')
                    if t == 'addlike':
                        ok(lab == f"{q['a']}/{q['d']} {sym} {q['b']}/{q['d']}", f'label {lab}')
                    else:
                        ok(lab == f"{q['a1']}/{q['b1']} {sym} {q['a2']}/{q['b2']}", f'label {lab}')
        print('bulk problems:', {k: len(v) for k, v in bulk.items()})
        print('instruction vocabulary:', sorted(vocab))

        # ---- play: 16+ problems of each level's own type ----
        page.evaluate("FAST=true")
        page.click('#start button.btn')
        played = {}
        allmsgs = set(); allfbs = set(); donemsgs = []
        for L in range(1, 7):
            want = TYPES[L]; got = 0; tries = 0; shot_done = False
            while got < 16 or (L == 1 and not {'simplify', 'm2i', 'i2m'} <= played.get('types1', set())):
                tries += 1
                page.evaluate(f"level={L}; index=0; nextProblem()")
                t = page.evaluate("current.type")
                if t not in want:
                    continue
                if L == 1:
                    played.setdefault('types1', set()).add(t)
                label0 = page.evaluate("document.getElementById('prob').textContent")
                shots = None
                key = f'{L}_{t}'
                if key not in played:
                    played[key] = 1
                    nsteps = page.evaluate("M.mv.length")
                    shots = (f'{OUT}/s390_L{L}_{t}_mid.png', max(0, nsteps // 2 if nsteps > 1 else 0))
                info = solve(page, shots=shots, wrong_once=(got == 0))
                allmsgs |= set(info['msgs']); allfbs |= set(info['fbs'])
                label1 = page.evaluate("document.getElementById('prob').textContent")
                ok(label0 == label1, f'prob changed {label0} -> {label1}')
                dm = page.inner_text('#msg'); donemsgs.append(dm)
                ok(dm.startswith('✓') and len(words(dm)) == 0, f'done line {dm!r}')
                ok(wl_count(page) == 1, f'done work lines {wl_count(page)} {t}')
                no_hscroll(page, f'L{L} {t}')
                if not shot_done and got >= 1:
                    page.screenshot(path=f'{OUT}/s390_L{L}_done.png', full_page=True); shot_done = True
                got += 1
            played[L] = got
        print('played per level:', {L: played[L] for L in range(1, 7)}, 'L1 types', played['types1'])
        print('max instruction words:', max(len(words(m)) for m in allmsgs))
        print('sample nudges:', sorted(allfbs)[:12])
        print('sample done lines:', donemsgs[:6])

        # specific screenshots: count-by strip, flip, mixed tail
        def until(cond_js, L):
            for _ in range(400):
                page.evaluate(f"level={L}; index=0; nextProblem()")
                if page.evaluate(cond_js):
                    return True
            return False
        if until("current.type==='addunlike' && M.mv.some(m=>m.key==='Mw') && M.mv.some(m=>m.key==='Lg')", 4):
            page.screenshot(path=f'{OUT}/s390_L4_pick.png', full_page=True)
            # walk to the raw step, then to the simplify step, then the mixed step
            for target, name in (('raw', 'raw'), ('Lg', 'simplify'), ('Mw', 'mixed')):
                while page.evaluate("M.mv[M.i].key") != target:
                    m = page.evaluate("(()=>{const m=M.mv[M.i];return {kind:m.kind||'type',expect:m.expect}})()")
                    i0 = page.evaluate("M.i")
                    if m['kind'] == 'pick':
                        page.click(f'#fwork .mult[data-m="{m["expect"]}"]')
                    else:
                        page.fill('#box', str(m['expect'])); page.click('#go')
                    page.wait_for_function(f"DONE || (M.i>{i0} && !M.busy)")
                page.screenshot(path=f'{OUT}/s390_L4_{name}.png', full_page=True)
            solve(page)
            page.screenshot(path=f'{OUT}/s390_L4_mixed_done.png', full_page=True)
        if until("current.type==='div'", 6):
            page.screenshot(path=f'{OUT}/s390_L6_flip.png', full_page=True)

        # summary screen
        page.evaluate("level=1; index=9; nextProblem()")
        solve(page)
        page.click('#go')
        page.wait_for_selector('#summary:not(.hide)')
        no_hscroll(page, 'summary 390')
        page.screenshot(path=f'{OUT}/s390_summary.png', full_page=True)
        note = page.inner_text('#s-note')
        ok(len(words(note)) <= 6, f'end note {note}')

        # 1280 wide
        page.set_viewport_size({'width': 1280, 'height': 900})
        no_hscroll(page, 'summary 1280')
        for L in range(1, 7):
            page.evaluate(f"document.getElementById('summary').classList.add('hide');document.getElementById('play').classList.remove('hide');level={L}; index=0; nextProblem()")
            no_hscroll(page, f'1280 L{L}')
        page.screenshot(path=f'{OUT}/s1280_L6.png', full_page=True)
        b.close()

    print('start screen text:', repr(start_txt))
    print('page errors:', errors)
    print('FAILS:', len(fails))
    for f in fails[:40]:
        print('  ', f)


main()
