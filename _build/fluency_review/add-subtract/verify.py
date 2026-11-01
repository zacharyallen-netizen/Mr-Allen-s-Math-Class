import re, sys, json
from playwright.sync_api import sync_playwright

URL = 'file:///home/claude/mr-allen-s-math-class/grade8/Fluency-Lab-Package/fluency-lab/fluency-lab-add-subtract.html'
OUT = '/home/claude/mr-allen-s-math-class/_build/fluency_review/add-subtract/'
IGN = re.compile(r'fonts\.googleapis|fonts\.gstatic|ERR_TUNNEL|Failed to load resource|net::ERR')
errors = []
fails = []
def ok(c, msg):
    if not c: fails.append(msg)

def words(t): return len(t.split())

def solve_move(page, wrong=False):
    """do the current move; returns info about nudges"""
    m = page.evaluate("()=>{const m=M.mv[M.i];return {kind:m.kind,expect:m.expect,i:M.i}}")
    info = {}
    if m['kind'] == 'tap':
        ok(page.inner_text('#go') == 'Borrow', 'tap button not Borrow')
        page.click('#go')
    else:
        if wrong:
            bad = (m['expect'] + 1) % 10 if m['expect'] < 10 else m['expect'] + 1
            page.fill('#box', str(bad)); page.keyboard.press('Enter')
            info['nudge1'] = page.inner_text('#fb')
            page.fill('#box', str(bad)); page.keyboard.press('Enter')
            info['nudge2'] = page.inner_text('#fb')
        page.fill('#box', str(m['expect'])); page.keyboard.press('Enter')
    page.wait_for_function(f"()=>M.i>{m['i']} && !M.busy", timeout=10000)
    return info

def check_screen(page):
    # only msg + (fb) + button inside the panel; msg short
    msg = page.inner_text('#msg')
    ok(words(msg) <= 8, f'long msg: {msg}')
    say = page.inner_text('.say').strip()
    allowed = {msg.strip(), page.inner_text('#fb').strip(), page.inner_text('#go').strip(), ''}
    for line in say.split('\n'):
        ok(line.strip() in allowed, f'extra line on screen: {line!r}')
    ok(page.locator('.fly').count() == 0, 'leftover flying digit')
    return msg

with sync_playwright() as pw:
    br = pw.chromium.launch()
    ctx = br.new_context(viewport={'width': 390, 'height': 844}, reduced_motion='reduce')
    page = ctx.new_page()
    page.on('pageerror', lambda e: errors.append(str(e)))
    page.on('console', lambda m: m.type == 'error' and not IGN.search(m.text) and errors.append(m.text))
    page.goto(URL); page.wait_for_load_state('load')
    page.screenshot(path=OUT + 'shot-start-390.png', full_page=True)
    start_text = page.inner_text('#start')

    # ---- bulk generation in JS: 400 per level
    bulk = page.evaluate(r"""()=>{
      const bad=[]; const msgs=new Set(); let n=0;
      const RX=/^(Ones|Tens|Hundreds|Thousands) column: (\d+( \+ \d+)*|\d+ − \d+|\d+ is less than \d+\. Borrow\.|bring down \d+)$/;
      for(let L=1;L<=6;L++) for(let r=0;r<400;r++){
        const p=GEN[L](); n++;
        const a=p.a,b=p.b, ans=p.op==='+'?a+b:a-b;
        if(!(p.op==='+'||p.op==='-')) bad.push('op '+p.op);
        if(!Number.isInteger(a)||!Number.isInteger(b)||a<=0||b<=0) bad.push('ints '+a+' '+b);
        if(p.answer!==ans) bad.push('answer '+JSON.stringify(p));
        if(ans<0) bad.push('negative '+JSON.stringify(p));
        const ones=x=>x%10, tens=x=>Math.floor(x/10)%10;
        if(L===1 && (p.op!=='+'||a<10||a>99||b<10||b>99||ones(a)+ones(b)>9||tens(a)+tens(b)>9)) bad.push('L1 '+a+'+'+b);
        if(L===2 && (p.op!=='+'||a<10||a>99||b<10||b>99||ones(a)+ones(b)<10)) bad.push('L2 '+a+'+'+b);
        if(L===3 && (p.op!=='+'||a<100||a>999||b<100||b>999)) bad.push('L3 '+a+'+'+b);
        if(L===4 && (p.op!=='-'||a<10||a>99||b<10||ones(b)>ones(a)||b>=a)) bad.push('L4 '+a+'-'+b);
        if(L===5 && (p.op!=='-'||b>=a||!forcesBorrow(a,b))) bad.push('L5 '+a+'-'+b);
        if(L===6 && (p.op!=='-'||a%100!==0||a<200||b>=a||b%10===0)) bad.push('L6 '+a+'-'+b);
        // moves: rebuild answer from typed values only
        const built=p.op==='+'?movesAdd(p):movesSub(p); const types=built.mv.filter(m=>m.kind==='type');
        let got;
        if(p.op==='+'){ got=0; types.forEach((m,c)=>{ got+= (m.last?m.expect:m.expect%10)*10**c; }); }
        else { got=0; types.forEach((m,c)=>{ if(m.expect<0||m.expect>9) bad.push('digit '+m.expect); got+=m.expect*10**c; }); }
        if(got!==ans) bad.push('moves give '+got+' for '+JSON.stringify(p));
        for(const m of built.mv){ const t=m.say.replace(/<[^>]+>/g,''); msgs.add(t.replace(/\d+/g,'#'));
          if(!RX.test(t)) bad.push('msg '+t); if(t.split(/\s+/).length>8) bad.push('long '+t); }
      }
      return {n, bad:bad.slice(0,20), nbad:bad.length, shapes:[...msgs]};
    }""")
    print('bulk generated', bulk['n'], 'bad', bulk['nbad'], bulk['bad'])
    print('instruction shapes:', bulk['shapes'])
    ok(bulk['nbad'] == 0, 'bulk failures')

    # ---- play 15+ problems on every level
    page.click('#start button.btn')
    nudges = {}
    solved = 0
    for L in range(1, 7):
        for k in range(16):
            page.evaluate(f"()=>{{level={L}; index=0; nextProblem();}}")
            p = page.evaluate("()=>({a:current.a,b:current.b,op:current.op})")
            # board shows only digits and the sign
            ok(re.fullmatch(r'[0-9+−\s]*', page.inner_text('#algo')) is not None, 'non-number on board')
            first = True
            while page.evaluate("()=>M.i<M.mv.length"):
                check_screen(page)
                if k == 0 and L <= 6 and first and page.evaluate("()=>M.mv[M.i].kind==='type'"):
                    info = solve_move(page, wrong=True); nudges[L] = info
                    ok(words(info['nudge1']) <= 8 and words(info['nudge2']) <= 8, f'long nudge {info}')
                    ok(re.fullmatch(r'Type \d+\.', info['nudge2']) is not None, f'2nd nudge {info}')
                    first = False
                else:
                    if k == 1 and page.evaluate("()=>M.i===1"):
                        page.screenshot(path=OUT + f'shot-L{L}-mid-390.png', full_page=True)
                    solve_move(page)
            exp = p['a'] + p['b'] if p['op'] == '+' else p['a'] - p['b']
            sign = '+' if p['op'] == '+' else '−'
            done = f"✓ {p['a']:,} {sign} {p['b']:,} = {exp:,}"
            msg = page.inner_text('#msg').strip()
            ok(msg == done, f'done line {msg!r} vs {done!r}')
            ok(page.text_content('#prob') == done[2:], 'prob label')
            # answer digits on the board (non-faded)
            ansd = page.evaluate("()=>[...document.querySelectorAll('#algo .cell[data-row=ans]')].filter(c=>!c.classList.contains('fade')).map(c=>c.textContent).join('')")
            ok(int(ansd) == exp, f'board answer {ansd} vs {exp}')
            ok(page.inner_text('#go') in ('Next problem →', 'See results'), 'next button')
            check_screen(page)
            if L == 6 and k == 2: page.screenshot(path=OUT + 'shot-finished-390.png', full_page=True)
            solved += 1
    print('solved in browser:', solved)
    print('nudges:', json.dumps(nudges, ensure_ascii=False))

    # ---- empty box message, partial (one digit) nudge on a carry
    page.evaluate("()=>{level=2;index=0;current=mk(47,38,'+');renderProblem();}")
    page.keyboard.press('Enter'); empty = page.inner_text('#fb')
    page.fill('#box', '5'); page.keyboard.press('Enter'); partial = page.inner_text('#fb')
    print('empty:', empty, '| partial:', partial)
    # mid-borrow screenshot across zeros (level 6), before Borrow is pressed, and after
    page.evaluate("()=>{level=6;index=0;current=mk(400,163,'-');renderProblem();}")
    page.screenshot(path=OUT + 'shot-L6-borrow-390.png', full_page=True)
    solve_move(page)
    page.screenshot(path=OUT + 'shot-L6-afterborrow-390.png', full_page=True)
    # leading zero: 52 - 47
    page.evaluate("()=>{level=5;index=0;current=mk(52,47,'-');renderProblem();}")
    while page.evaluate("()=>M.i<M.mv.length"): solve_move(page)
    page.screenshot(path=OUT + 'shot-leadzero-390.png', full_page=True)
    ok(page.inner_text('#msg').strip() == '✓ 52 − 47 = 5', 'lead zero done')

    # ---- sideways scroll
    def overflow():
        return page.evaluate("()=>document.documentElement.scrollWidth>document.documentElement.clientWidth")
    for w in (390, 1280):
        page.set_viewport_size({'width': w, 'height': 844})
        page.evaluate("()=>{level=3;index=0;current=mk(987,876,'+');renderProblem();}")
        ok(not overflow(), f'overflow play {w}')
        page.evaluate("()=>{level=6;index=0;current=mk(900,123,'-');renderProblem();}")
        ok(not overflow(), f'overflow play6 {w}')
    page.set_viewport_size({'width': 390, 'height': 844})

    # ---- full set of 10 through the real buttons, then summary
    page.evaluate("()=>{level=1;startSet();}")
    for q in range(10):
        while page.evaluate("()=>M.i<M.mv.length"): solve_move(page)
        page.click('#go')
    ok(page.is_visible('#summary'), 'summary not shown')
    page.screenshot(path=OUT + 'shot-summary-390.png', full_page=True)
    summary_text = page.inner_text('#summary')
    ok(not overflow(), 'overflow summary 390')
    page.set_viewport_size({'width': 1280, 'height': 844}); ok(not overflow(), 'overflow summary 1280')
    page.goto(URL); ok(not overflow(), 'overflow start 1280')
    page.set_viewport_size({'width': 390, 'height': 844}); ok(not overflow(), 'overflow start 390')
    print('START TEXT:\n' + start_text)
    print('SUMMARY TEXT:\n' + summary_text)
    br.close()

print('page errors:', errors)
print('FAILS:', len(fails), fails[:20])
