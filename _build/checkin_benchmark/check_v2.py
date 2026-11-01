"""End-to-end check of grade8/checkin_benchmark_review_v2.html (server on 127.0.0.1:8765)."""
import json, pathlib
from playwright.sync_api import sync_playwright
URL = 'http://127.0.0.1:8765/grade8/checkin_benchmark_review_v2.html'
HERE = pathlib.Path(__file__).parent; SHOTS = HERE / 'shots'; SHOTS.mkdir(exist_ok=True)
IGN = ('fonts.googleapis', 'fonts.gstatic', 'ERR_TUNNEL', 'Failed to load resource', 'net::ERR')
fails = []
def check(c, m):
    print(('ok   ' if c else 'FAIL ') + m)
    if not c: fails.append(m)
with sync_playwright() as pw:
    br = pw.chromium.launch()
    for width in (390, 1280):
        ctx = br.new_context(viewport={'width': width, 'height': 900}); p = ctx.new_page()
        errs = []; p.on('pageerror', lambda e: errs.append(str(e)))
        p.on('console', lambda m: m.type == 'error' and not any(s in m.text for s in IGN) and errs.append(m.text))
        cap = []
        p.route('**/benchmark-config.js', lambda r: r.fulfill(status=200, content_type='application/javascript',
                body="window.BENCHMARK_CONFIG={ENDPOINT:'https://script.google.com/macros/s/TEST/exec',CODE:'allen-8th-benchmark'};"))
        def fake(route):
            cap.append(route.request.post_data)
            route.fulfill(status=200, content_type='application/json', body=json.dumps({'ok': True, 'name': 'Test Student', 'attempt': len(cap)}))
        p.route('**/script.google.com/**', fake)
        p.goto(URL); p.wait_for_timeout(300)
        check('Version 2' in p.inner_text('header'), 'labelled Version 2')
        body = p.inner_text('body').lower()
        check(not any(w in body for w in [' ec ', 'exceptional', ' iep', 'modified', 'accommodat', 'simplified']), 'no EC/other labels in visible text')
        for tab in ['tS', 'tN', 'tP']:
            p.click(f'.step[data-tab="{tab}"]'); p.wait_for_timeout(120)
            sw = p.evaluate('document.documentElement.scrollWidth')
            check(sw <= width, f'{width}px {tab}: no sideways scroll ({sw})')
            p.screenshot(path=str(SHOTS / f'v2_{tab}_{width}.png'), full_page=True)
        QD = p.evaluate('window.__bench.QD'); check(len(QD) == 10, '10 questions')
        check(p.locator('.qc:not([hidden])').count() == 1, 'one question shown at a time')
        p.click('#qc0 .chk'); check('Tap an answer' in p.inner_text('#qc0 .nudge'), 'nudge when blank')
        wrong = {0, 4} if width == 390 else set()
        for i, q in enumerate(QD):
            j = q['ans'] if i not in wrong else (q['ans'] + 1) % len(p.query_selector_all(f'#qc{i} .ch'))
            p.click(f'#qc{i} .ch[data-j="{j}"]'); p.click(f'#qc{i} .chk')
            res = p.inner_text(f'#qc{i} .res')
            check(('Correct' in res) == (i not in wrong), f'{width}: Q{i+1} feedback {res.splitlines()[0]}')
            if i in wrong: check(len(res.splitlines()) >= 3, f'{width}: Q{i+1} specific wrong message')
            sw = p.evaluate('document.documentElement.scrollWidth'); check(sw <= width, f'{width}: Q{i+1} no sideways scroll ({sw})')
            if i == 7: p.screenshot(path=str(SHOTS / f'v2_q8_{width}.png'), full_page=False)
            p.click(f'#qc{i} .nxt'); p.wait_for_timeout(60)
        p.fill('#sname', 'Test Student'); p.click('.cls >> text=A2'); p.click('#sbtn'); p.wait_for_timeout(400)
        pay = json.loads(cap[0])
        check(pay['benchmark'] == 'NC Check-In Benchmark Review — Version 2' and pay['total'] == 10 and pay['score'] == 10 - len(wrong), f'{width}: payload {pay["score"]}/10')
        check(all(it['std'].startswith('NC.8.') for it in pay['items']), 'standards labelled')
        check('Sent ✓' in p.inner_text('#sendmsg'), 'sent message')
        (HERE / f'payload_v2_{width}.json').write_text(json.dumps(pay))
        p.click('#again'); check(p.is_visible('#qc0') and not p.is_disabled('#qc0 .ch'), 'try again resets')
        check(not errs, f'{width}: no page errors {errs}')
        ctx.close()
    br.close()
print('\n' + ('ALL PASSED' if not fails else f'{len(fails)} FAILED'))
