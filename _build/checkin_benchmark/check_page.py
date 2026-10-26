"""End-to-end check of grade8/checkin_benchmark_review.html.
Needs a local server: python3 -m http.server 8765 --bind 127.0.0.1 (from the repo root).
Then: node _build/benchmark/check_payload.js _build/checkin_benchmark/payload_*.json"""
import json, pathlib
from playwright.sync_api import sync_playwright

URL = 'http://127.0.0.1:8765/grade8/checkin_benchmark_review.html'
HERE = pathlib.Path(__file__).parent
SHOTS = HERE / 'shots'; SHOTS.mkdir(exist_ok=True)
IGN = ('fonts.googleapis', 'fonts.gstatic', 'ERR_TUNNEL', 'Failed to load resource', 'net::ERR')
fails = []
def check(c, m):
    print(('ok   ' if c else 'FAIL ') + m)
    if not c: fails.append(m)

NUM_RIGHT = {1: ['5/3', '1 2/3', '−5/3'.replace('−', '')], 5: ['4', '4.0', '8/2'], 8: ['5', 'x = 5', 'x=5'], 10: ['18', 'x = 18', '36/2']}

def answer(p, QD, i, right=True, variant=0):
    q = QD[i]
    if q['kind'] == 'num':
        p.fill(f'#in{i}', NUM_RIGHT[i][variant % len(NUM_RIGHT[i])] if right else 'x = 1000')
    else:
        want = q['correct'] if right else [j for j in range(len(q['opts'])) if j not in q['correct']][:1]
        for j in want: p.click(f'#q{i+1} .chip[data-v="{j}"]')

with sync_playwright() as pw:
    br = pw.chromium.launch()
    for width in (390, 1280):
        ctx = br.new_context(viewport={'width': width, 'height': 900})
        p = ctx.new_page()
        errs = []
        p.on('pageerror', lambda e: errs.append(str(e)))
        p.on('console', lambda m: m.type == 'error' and not any(s in m.text for s in IGN) and errs.append(m.text))
        captured = []
        p.route('**/benchmark-config.js', lambda r: r.fulfill(status=200, content_type='application/javascript',
                body="window.BENCHMARK_CONFIG={ENDPOINT:'https://script.google.com/macros/s/TEST/exec',CODE:'allen-8th-benchmark'};"))
        def fake(route):
            captured.append(route.request.post_data)
            route.fulfill(status=200, content_type='application/json', body=json.dumps({'ok': True, 'name': 'Test Student', 'score': 0, 'total': 20, 'attempt': len(captured)}))
        p.route('**/script.google.com/**', fake)
        p.goto(URL); p.wait_for_timeout(400)

        # every tab and notes page: no sideways scroll
        for tab in ['tStrat', 'tNotes', 'tPrac']:
            p.click(f'.step[data-tab="{tab}"]'); p.wait_for_timeout(100)
            if tab == 'tNotes':
                for n in ['nNS1', 'nEE1', 'nEE7', 'nF1', 'nG3']:
                    p.click(f'.ntab[data-n="{n}"]'); p.wait_for_timeout(80)
                    sw = p.evaluate('document.documentElement.scrollWidth')
                    check(sw <= width, f'{width}px notes {n}: no sideways scroll ({sw})')
                    check(p.is_visible(f'#{n}'), f'{width}px notes {n} visible')
                    p.screenshot(path=str(SHOTS / f'notes_{n}_{width}.png'), full_page=True)
            sw = p.evaluate('document.documentElement.scrollWidth')
            check(sw <= width, f'{width}px {tab}: no sideways scroll ({sw})')
            p.screenshot(path=str(SHOTS / f'{tab}_{width}.png'), full_page=True)

        QD = p.evaluate('window.__bench.QD')
        check(len(QD) == 20, '20 questions')

        # instant feedback: blank check nudges
        p.click('#q1 .chk'); check('Tap' in p.inner_text('#q1 .nudge'), f'{width}: blank check nudges')
        # parse variants
        pv = p.evaluate("['5/3','1 2/3','−4','x = 18','1.5','abc'].map(s=>{var r=window.__bench.parseNum(s);return r?[r.n,r.d]:null})")
        check(pv == [[5, 3], [5, 3], [-4, 1], [18, 1], [15, 10], None], f'parseNum variants {pv}')

        # pass 1 (1280): all right with typed variants; pass 2 (390): Q1–Q5 wrong to test specific feedback
        for i in range(20):
            right = width == 1280 or i >= 5
            answer(p, QD, i, right, variant=1 if width == 390 else 0)
            p.click(f'#q{i+1} .chk')
            res = p.inner_text(f'#q{i+1} .res')
            check(('Correct!' in res) == right, f'{width}: Q{i+1} {"right" if right else "wrong"} → {res.splitlines()[0]}')
            check('How to solve it' in res, f'{width}: Q{i+1} shows explanation')
            if not right and QD[i]['kind'] != 'num':
                check(len(res.splitlines()) >= 3, f'{width}: Q{i+1} specific wrong-answer message')
        # first check counts: can't change after check
        check(p.is_disabled('#q3 .chip[data-v="0"]') if QD[2]['kind'] != 'num' else True, 'checked question locks')
        # simplest-form message
        check(p.inner_text('#progtxt').startswith('20 of 20'), f'{width}: progress 20 of 20')

        # submit gates
        p.fill('#sname', ''); p.click('#sbtn'); check('first AND last' in p.inner_text('#smsg'), f'{width}: name required')
        p.fill('#sname', 'Test Student')
        p.evaluate("document.querySelectorAll('.cls').forEach(b=>b.setAttribute('aria-pressed','false'))")
        p.click('#sbtn'); check('class' in p.inner_text('#smsg'), f'{width}: class required')
        p.click('.cls >> text=B5'); p.click('#sbtn'); p.wait_for_timeout(500)
        check(len(captured) == 1, f'{width}: one payload sent')
        pay = json.loads(captured[0])
        exp = 20 if width == 1280 else 15
        check(pay['score'] == exp and pay['total'] == 20, f'{width}: score {pay["score"]}/20 (expect {exp})')
        check(pay['code'] == 'allen-8th-benchmark' and pay['kind'] == 'benchmark' and pay['period'] == 'B5', f'{width}: payload code/kind/class')
        check(all(it['std'] in ('NC.8.NS.1', 'NC.8.EE.1', 'NC.8.EE.7', 'NC.8.F.1', 'NC.8.G.3') for it in pay['items']), f'{width}: standards labelled')
        check('Sent ✓' in p.inner_text('#sendmsg'), f'{width}: sent message shown')
        (HERE / f'payload_{width}.json').write_text(json.dumps(pay))
        p.screenshot(path=str(SHOTS / f'score_{width}.png'), full_page=False)

        # retake: new session, unchecked questions graded at submit
        p.click('#again'); p.wait_for_timeout(200)
        check(not p.is_disabled('#q1 .chip[data-v="0"]'), f'{width}: retake unlocks')
        answer(p, QD, 0, True)          # answered but never checked
        p.click('#sbtn'); check('not answered' in p.inner_text('#smsg'), f'{width}: warns about blanks')
        p.click('#sbtn'); p.wait_for_timeout(500)
        pay2 = json.loads(captured[1])
        check(pay2['session'] != pay['session'] and pay2['score'] == 1, f'{width}: retake new session, unchecked graded ({pay2["score"]})')
        (HERE / f'payload_{width}_retake.json').write_text(json.dumps(pay2))

        # sending off → friendly message
        check(not errs, f'{width}: no page errors {errs}')
        ctx.close()
    br.close()
print('\n' + ('ALL PASSED' if not fails else f'{len(fails)} FAILED'))
