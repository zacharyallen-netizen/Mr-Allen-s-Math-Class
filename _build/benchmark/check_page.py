"""End-to-end check of grade8/q1_benchmark_review.html.
Needs a local server: python3 -m http.server 8765 --bind 127.0.0.1 (from the repo root)."""
import json, sys, pathlib
from playwright.sync_api import sync_playwright

URL = 'http://127.0.0.1:8765/grade8/q1_benchmark_review.html'
HERE = pathlib.Path(__file__).parent
SHOTS = HERE / 'shots'; SHOTS.mkdir(exist_ok=True)
IGN = ('fonts.googleapis', 'fonts.gstatic', 'ERR_TUNNEL', 'Failed to load resource', 'net::ERR')
fails = []
def check(c, m):
    print(('ok   ' if c else 'FAIL ') + m)
    if not c: fails.append(m)

def fill_correct(p, variant=0):
    p.fill('#sname', 'Test Student')
    p.click('.cls >> text=B5')
    for v in 'BE': p.click(f'#q1 .chip[data-v="{v}"]')
    for i, v in enumerate('IRIR'): p.check(f'input[name="r{i}"][value="{v}"]')
    p.fill('#q3a', '7'); p.fill('#q3b', '8'); p.fill('#q3c', '7.4')
    for label in ['π + 1', '4.38', '4.4', '√20', '92']:
        p.locator('#q4pool .chip', has_text=label).first.click()
    p.fill('#q5in', ['-15x^7y^3', '−15x⁷y³', '-15 y^3 x^7'][variant])
    p.fill('#q6in', ['4a^6', '4a⁶', '4 a^6'][variant])
    p.click('#q7 .chip[data-v="C"]')
    p.fill('#q8in', ['12m^10', '12m¹⁰', '12*m^(10)'][variant])
    sn = {'q9a': ('3.04', '9'), 'q9b': ('6.2', '-5'), 'q10a': ('4.85', '7'), 'q10b': ('7.3', '−4'),
          'q11': ('2.4', '9'), 'q12': ('4', '5'), 'q13': ('1', '5'), 'q14': ('3', '5')}
    for k, (c, e) in sn.items():
        p.fill(f'#{k}c', c); p.fill(f'#{k}e', e)
    p.click('#q15 .chip[data-v="C"]')

with sync_playwright() as pw:
    br = pw.chromium.launch()
    for width in (390, 1280):
        ctx = br.new_context(viewport={'width': width, 'height': 900})
        p = ctx.new_page()
        errs = []
        p.on('pageerror', lambda e: errs.append(str(e)))
        p.on('console', lambda m: m.type == 'error' and not any(s in m.text for s in IGN) and errs.append(m.text))
        captured = []
        # switch sending on for the test and capture what would be sent
        p.route('**/benchmark-config.js', lambda r: r.fulfill(status=200, content_type='application/javascript',
                body="window.BENCHMARK_CONFIG={ENDPOINT:'https://script.google.com/macros/s/TEST/exec',CODE:'allen-8th-benchmark'};"))
        def fake(route):
            captured.append(route.request.post_data)
            route.fulfill(status=200, content_type='application/json', body=json.dumps({'ok': True, 'name': 'Test Student', 'score': 15, 'total': 15, 'attempt': 1}))
        p.route('**/script.google.com/**', fake)
        p.goto(URL); p.wait_for_timeout(400)
        sw = p.evaluate('document.documentElement.scrollWidth')
        check(sw <= width, f'{width}px: no sideways scroll (scrollWidth {sw})')
        p.screenshot(path=str(SHOTS / f'blank_{width}.png'), full_page=True)

        # name required
        p.fill('#sname', '')
        p.click('#sbtn'); check('first AND last' in p.inner_text('#smsg'), f'{width}: name required')
        p.fill('#sname', 'Test Student'); p.click('#sbtn')
        check('class' in p.inner_text('#smsg'), f'{width}: class required')

        fill_correct(p, 0 if width == 1280 else 1)
        p.wait_for_timeout(100)
        p.screenshot(path=str(SHOTS / f'filled_{width}.png'), full_page=True)
        p.click('#sbtn'); p.wait_for_timeout(600)
        big = p.inner_text('#bigscore')
        check(big.startswith('15'), f'{width}: all correct scores 15 ({big})')
        check('Sent' in p.inner_text('#sendmsg'), f'{width}: send message shows Sent')
        check(len(captured) == 1, f'{width}: one payload sent')
        if captured:
            (HERE / f'payload_{width}.json').write_text(captured[0])
            d = json.loads(captured[0])
            check(d.get('period') == 'B5', f"{width}: class sent ({d.get('period')})")
            check(d['kind'] == 'benchmark' and d['total'] == 15 and d['score'] == 15 and len(d['items']) == 15, f'{width}: payload shape')
        check(p.locator('#q5in').is_disabled(), f'{width}: inputs locked after submit')
        p.screenshot(path=str(SHOTS / f'done_{width}.png'), full_page=True)

        # new attempt, typed variant 2, then wrong answers with specific feedback
        p.click('#again'); p.wait_for_timeout(200)
        check(not p.locator('#q5in').is_disabled() and p.input_value('#q5in') == '', f'{width}: new attempt clears and unlocks')
        if width == 1280:
            fill_correct(p, 2)
            p.click('#sbtn'); p.wait_for_timeout(500)
            check(p.inner_text('#bigscore').startswith('15'), 'variant typing (spaces, *, parentheses) still 15')
            p.click('#again'); p.wait_for_timeout(200)
            p.fill('#sname', 'Test Student')
            p.click('#q1 .chip[data-v="D"]'); p.click('#q1 .chip[data-v="B"]')
            p.fill('#q3a', '7'); p.fill('#q3b', '8'); p.fill('#q3c', '7.5')
            p.fill('#q5in', '-15x^12y^3'); p.fill('#q6in', '4a^6b^0'); p.fill('#q8in', '6m^10')
            p.click('#q7 .chip[data-v="B"]')
            p.fill('#q11c', '24'); p.fill('#q11e', '8')
            p.fill('#q12c', '4'); p.fill('#q12e', '2')
            p.fill('#q14c', '3'); p.fill('#q14e', '1')
            p.click('#sbtn'); p.wait_for_timeout(100)
            check('Submit anyway' in p.inner_text('#sbtn'), 'blank questions warned first')
            p.click('#sbtn'); p.wait_for_timeout(500)
            fb = {i: p.inner_text(f'#q{i} .res') for i in (1, 3, 4, 5, 6, 7, 8, 11, 12, 14)}
            check('3.14159 stops' in fb[1], 'Q1 feedback names 3.14159')
            check('54.76' in fb[3], 'Q3 feedback on 7.5')
            check('Not yet' in fb[4], 'Q4 blank marked not yet')
            check('ADD' in fb[5], 'Q5 multiplied-exponents feedback')
            check('leave it out' in fb[6], 'Q6 b^0 feedback')
            check('even power' in fb[7], 'Q7 choice B feedback')
            check('Square the 2' in fb[8], 'Q8 coefficient feedback')
            check('value is right' in fb[11], 'Q11 24 × 10^8 feedback')
            check('4 + 2' in fb[12], 'Q12 subtracting a negative feedback')
            check('3 + 2' in fb[14], 'Q14 subtracting a negative feedback')
            print(p.inner_text('#bigscore'))
            p.screenshot(path=str(SHOTS / 'wrong_1280.png'), full_page=True)
            d = json.loads(captured[-1]); (HERE / 'payload_wrong.json').write_text(captured[-1])
            check(d['score'] == 0 and d['items'][2]['answer'].endswith('7.5'), f"wrong-attempt payload score {d['score']}, answers kept")
        check(not errs, f'{width}: no page errors {errs[:3]}')
        ctx.close()
    br.close()
print('FAILURES:', len(fails))
sys.exit(1 if fails else 0)
