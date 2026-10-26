"""Timing check for the benchmark pages (server on 127.0.0.1:8765). Uses Playwright's fake clock."""
import json
from playwright.sync_api import sync_playwright
B = 'http://127.0.0.1:8765/grade8/'
fails = []
def check(c, m):
    print(('ok   ' if c else 'FAIL ') + m)
    if not c: fails.append(m)

def setup(br, page):
    ctx = br.new_context(viewport={'width': 1280, 'height': 900}); p = ctx.new_page()
    cap = []
    p.route('**/benchmark-config.js', lambda r: r.fulfill(status=200, content_type='application/javascript',
            body="window.BENCHMARK_CONFIG={ENDPOINT:'https://script.google.com/macros/s/TEST/exec',CODE:'allen-8th-benchmark'};"))
    def fake(route):
        cap.append(json.loads(route.request.post_data))
        route.fulfill(status=200, content_type='application/json', body=json.dumps({'ok': True, 'name': 'Test Student', 'attempt': 1}))
    p.route('**/script.google.com/**', fake)
    p.clock.install()
    p.goto(B + page); p.wait_for_timeout(200)
    return ctx, p, cap

def work(p, secs):            # a student who keeps doing something (moves the mouse every 5 s)
    for _ in range(secs // 5):
        p.mouse.move(300, 300); p.mouse.move(310, 305)
        p.clock.run_for(5000)

def idle(p, secs): p.clock.run_for(secs * 1000)

with sync_playwright() as pw:
    br = pw.chromium.launch()
    # ── Version 1
    ctx, p, cap = setup(br, 'checkin_benchmark_review.html')
    p.click('.step[data-tab="tNotes"]'); work(p, 60)                    # 60 s reading notes
    p.click('.step[data-tab="tPrac"]')
    QD = p.evaluate('window.__bench.QD')
    p.click(f'#q1 .chip[data-v="{QD[0]["correct"][0]}"]'); work(p, 40)
    for j in QD[0]['correct'][1:]: p.click(f'#q1 .chip[data-v="{j}"]')
    p.click('#q1 .chk')
    work(p, 30)                                                       # reading feedback: must NOT count for Q1
    p.click(f'#q3 .chip[data-v="{QD[2]["correct"][0]}"]'); work(p, 5); p.click('#q3 .chk')
    p.click('#q4 .chip >> nth=2'); idle(p, 300); p.click('#q4 .chk')  # walked away 5 minutes
    p.fill('#sname', 'Test Student'); p.click('.cls >> text=A1'); p.click('#sbtn'); p.click('#sbtn'); p.wait_for_timeout(300)
    pay = cap[0]; s = {it['id']: it['secs'] for it in pay['items']}
    print('  V1 study', pay['studySecs'], 'test', pay['testSecs'], 'Q1', s['1'], 'Q3', s['3'], 'Q4', s['4'])
    check(55 <= pay['studySecs'] <= 65, 'V1: notes time counted (~60 s)')
    check(38 <= s['1'] <= 46, 'V1: Q1 time ~40 s, feedback reading not added')
    check(s['3'] <= 8, 'V1: quick Q3 ~5 s')
    check(s['4'] <= 62, 'V1: walking away stops the clock after 60 s')
    check(s['2'] == 0, 'V1: untouched question 0 s')
    ctx.close()
    # ── Version 2
    ctx, p, cap = setup(br, 'checkin_benchmark_review_v2.html')
    p.click('.step[data-tab="tP"]')
    QD = p.evaluate('window.__bench.QD')
    for i, q in enumerate(QD):
        p.click(f'#qc{i} .ch[data-j="{q["ans"]}"]'); work(p, 20 if i < 5 else 0); p.click(f'#qc{i} .chk'); p.click(f'#qc{i} .nxt')
    p.fill('#sname', 'Test Student'); p.click('.cls >> text=A2'); p.click('#sbtn'); p.wait_for_timeout(300)
    pay = cap[0]; s = [it['secs'] for it in pay['items']]
    print('  V2 per question', s, 'test', pay['testSecs'])
    check(all(18 <= x <= 24 for x in s[:5]) and all(x <= 2 for x in s[5:]), 'V2: careful vs click-through questions timed')
    ctx.close()
    # ── Q1 review
    ctx, p, cap = setup(br, 'q1_benchmark_review.html')
    p.click('#q1 .chip[data-v="B"]'); work(p, 25); p.click('#q1 .chip[data-v="E"]')
    p.fill('#sname', 'Test Student'); p.click('.cls >> text=B5'); p.click('#sbtn'); p.click('#sbtn'); p.wait_for_timeout(300)
    pay = cap[0]; s = {it['id']: it['secs'] for it in pay['items']}
    print('  Q1 test', pay['testSecs'], 'Q1', s['1'])
    check(23 <= s['1'] <= 30 and 'testSecs' in pay, 'Q1 review: time sent')
    ctx.close(); br.close()
print('\n' + ('ALL PASSED' if not fails else f'{len(fails)} FAILED'))
