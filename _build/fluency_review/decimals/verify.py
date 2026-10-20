import re, json, sys, os
from playwright.sync_api import sync_playwright

URL = 'file:///home/claude/mr-allen-s-math-class/grade8/Fluency-Lab-Package/fluency-lab/fluency-lab-decimals.html'
OUT = '/home/claude/mr-allen-s-math-class/_build/fluency_review/decimals/shots'
os.makedirs(OUT, exist_ok=True)
IGN = re.compile(r'fonts\.googleapis|fonts\.gstatic|ERR_TUNNEL|Failed to load resource|net::ERR')
errors = []
fails = []
def fail(msg):
    fails.append(msg); print('FAIL', msg)

LEVEL_KINDS = {1: {'add'}, 2: {'sub'}, 3: {'mul', 'divw', 'divd'}, 4: {'d2p', 'p2d'}, 5: {'f2d', 'f2r'}, 6: {'pof'}}
words = lambda t: len([w for w in re.split(r'\s+', t.strip()) if w])

def open_page(p, w):
    b = p.chromium.launch()
    pg = b.new_page(viewport={'width': w, 'height': 900})
    pg.on('pageerror', lambda e: errors.append('pageerror: ' + str(e)))
    pg.on('console', lambda m: (m.type == 'error' and not IGN.search(m.text)) and errors.append('console: ' + m.text))
    pg.goto(URL); pg.wait_for_timeout(300)
    pg.evaluate("try{localStorage.clear()}catch(e){}")
    return b, pg

def no_hscroll(pg, tag):
    sw = pg.evaluate("[document.documentElement.scrollWidth, document.documentElement.clientWidth]")
    if sw[0] > sw[1]: fail(f'sideways scroll {tag}: {sw}')

def state(pg):
    return pg.evaluate("""()=>{const m=M.mv[M.i]; return {i:M.i,n:M.mv.length,busy:M.busy,kind:m?m.kind||'type':null,expect:m?m.expect:null,
      msg:document.getElementById('msg').textContent, sub:document.getElementById('sub').textContent,
      small:document.querySelectorAll('#fwork .wl.small').length, wl:document.querySelectorAll('#fwork .wl').length,
      prob:document.getElementById('prob').textContent.replace(/\\s+/g,' ').trim(), pkind:current.kind}}""")

def fmt(x):
    return str(float(f'{x:.6f}')).rstrip('0').rstrip('.') if '.' in str(float(f'{x:.6f}')) else str(x)

def step_until_done(pg, wrong_test=False, check_screen=True):
    """answer every move correctly; returns number of moves. wrong_test: first typed move gets two wrong answers first."""
    did_wrong = False
    start_prob = pg.evaluate("document.getElementById('prob').textContent")
    while True:
        st = state(pg)
        if st['i'] >= st['n']: break
        if check_screen:
            if words(st['msg']) > 8: fail(f"long msg ({st['pkind']}): {st['msg']}")
            if st['sub'] and words(st['sub']) > 6: fail(f"long sub ({st['pkind']}): {st['sub']}")
            if st['small'] > 1: fail(f"{st['small']} helper lines on screen ({st['pkind']})")
            if pg.evaluate("document.getElementById('prob').textContent") != start_prob: fail('prob changed mid-problem')
        if st['kind'] == 'tap':
            pg.click('#go')
        else:
            exp = pg.evaluate("String(+(+M.mv[M.i].expect).toFixed(6))")
            if wrong_test and not did_wrong:
                did_wrong = True
                bad = str(float(exp) + 1).rstrip('0').rstrip('.') if '.' in exp else str(int(exp) + 1)
                pg.fill('#box', bad); pg.click('#go')
                fb1 = pg.text_content('#fb')
                pg.fill('#box', bad); pg.click('#go')
                fb2 = pg.text_content('#fb')
                print(f"   wrong-answer nudge [{st['pkind']}]: '{fb1}' / '{fb2}'")
                if not fb1 or words(fb1) > 8: fail(f'nudge too long/empty: {fb1}')
                if fb2 != f'Type {exp}.': fail(f'second nudge: {fb2}')
            pg.fill('#box', exp); pg.click('#go')
        pg.wait_for_function(f"M.i>{st['i']} && !M.busy", timeout=20000)
    return st['n'] if 'n' in st else 0

def check_done(pg, tag):
    d = pg.evaluate("""()=>({msg:document.getElementById('msg').textContent, sub:document.getElementById('sub').textContent,
       where:document.getElementById('where').textContent, small:document.querySelectorAll('#fwork .wl.small').length,
       prob:document.getElementById('prob').textContent.replace(/\\s+/g,' ').trim(), go:document.getElementById('go').textContent})""")
    if not d['msg'].startswith('✓ '): fail(f'done line {tag}: {d}')
    if d['sub'] or d['where']: fail(f'extra lines at done {tag}: {d}')
    if d['small'] > 1: fail(f'helper lines at done {tag}: {d}')
    if 'Next' not in d['go'] and 'See' not in d['go']: fail(f'button {tag}: {d}')
    return d

with sync_playwright() as p:
    # ───────── 1. play 15+ problems on every level through the UI ─────────
    b, pg = open_page(p, 390)
    pg.evaluate("FAST=true")
    pg.click('#start button.btn')
    totals = {}
    for L in range(1, 7):
        seen = 0; kinds = {}
        first = True
        while seen < 15 or any(kinds.get(k, 0) < 2 for k in LEVEL_KINDS[L]):
            pg.evaluate(f"level={L}; index=0; nextProblem()")
            k = pg.evaluate("current.kind")
            own = k in LEVEL_KINDS[L]
            step_until_done(pg, wrong_test=(first and own))
            if own: first = False
            d = check_done(pg, f'L{L} {k}')
            if own:
                seen += 1; kinds[k] = kinds.get(k, 0) + 1
            if seen > 60: break
        totals[L] = (seen, kinds)
        print(f'L{L}: solved {seen} own-level problems {kinds}; sample done line: {d["msg"]}  label: {d["prob"]}')
    b.close()

    # ───────── 2. 300+ generated problems per level, checked in JS ─────────
    b, pg = open_page(p, 1280)
    res = pg.evaluate("""async()=>{
      FAST=true; const out={}; const bad=[];
      const allowed=/^(as a percent|as a decimal|of)$/;
      const sayWords=t=>t.replace(/<[^>]+>/g,'').trim().split(/\\s+/).filter(w=>/[A-Za-z0-9]/.test(w)).length;
      for(let L=1;L<=6;L++){ const kinds={};
        for(let n=0;n<320;n++){
          const p=(L===4||L===6)?gen(L):(Math.random()<0.5?gen(L):genVariant(L)); current=p; kinds[p.kind]=(kinds[p.kind]||0)+1;
          const div=document.createElement('div'); div.innerHTML=p.display; const txt=div.textContent.replace(/\\s*([+−×÷])\\s*/g,' $1 ').replace(/\\s+/g,' ').trim();
          // words other than the allowed labels
          const letters=txt.replace(/[0-9.,%/+−×÷\\s]/g,' ').replace(/\\s+/g,' ').trim();
          if(letters && !allowed.test(letters)) bad.push('words: '+txt);
          const ops=(txt.match(/[+−×÷]/g)||[]).length + (/\\bof\\b/.test(txt)?1:0) + (/as a (percent|decimal)/.test(txt)?1:0);
          if(ops!==1) bad.push('ops '+ops+': '+txt);
          // independent answer from the TEXT shown
          let m, want;
          if(m=txt.match(/^([\\d.]+) \\+ ([\\d.]+)$/)) want=+m[1]+ +m[2];
          else if(m=txt.match(/^([\\d.]+) − ([\\d.]+)$/)) want=+m[1]- +m[2];
          else if(m=txt.match(/^([\\d.]+) × ([\\d.]+)$/)) want=+m[1]* +m[2];
          else if(m=txt.match(/^([\\d.]+) ÷ ([\\d.]+)$/)) want=+m[1]/ +m[2];
          else if(m=txt.match(/^([\\d.]+) as a percent$/)) want=+m[1]*100;
          else if(m=txt.match(/^(\\d+)% as a decimal$/)) want=+m[1]/100;
          else if(m=txt.match(/^(\\d+)\\/(\\d+) as a decimal$/)) want=+m[1]/ +m[2];
          else if(m=txt.match(/^(\\d+)% of (\\d+)$/)) want=+m[1]* +m[2]/100;
          else { bad.push('unparsed: '+txt); continue; }
          // the steps' own result
          const mv=buildMoves(p); M={mv,i:0,tries:0,busy:false,err:false}; G={steps:mv,si:0}; O=null;
          for(const s of mv){ if(sayWords(s.say)>8) bad.push('say>8: '+s.say);
            if(s.sub && sayWords(s.sub)>6) bad.push('sub>6: '+s.sub);
            if(s.hint && sayWords(s.hint)>8) bad.push('hint>8: '+s.hint);
            if(s.kind==='tap') await s.run(()=>{}); else await runAfter(s); }
          let got;
          if(B){ const row=B.kind==='divw'?B.q:B.ans, pt=B.kind==='divw'?B.pt.q:B.pt.ans;
            let s=''; row.forEach((d,i)=>{ s+=(d==null?'':d); if(i===pt) s+='.'; }); got=+s; }
          else { const last=mv[mv.length-1]; got=p.kind==='f2r'||p.kind==='f2d'?p.ans:(last.key==='rep'?p.ans:last.expect);
            if(p.kind==='f2d'||p.kind==='f2r'){ const t=p._t; got=+('0.'+t.lead+t.rep.repeat(p.kind==='f2r'?8:1)); } }
          const tol=p.kind==='f2r'?1e-6:1e-9;
          if(!(Math.abs(got-want)<tol)) bad.push(`answer ${txt}: steps ${got} vs ${want}`);
          if(Math.abs((p.ans??p.q)-want)>tol) bad.push(`p.ans ${txt}: ${p.ans} vs ${want}`);
          // exprText (done line) shows the right answer
          const e=document.createElement('div'); e.innerHTML=exprText(p); if(!e.textContent.includes(p.kind==='d2p'?want.toFixed(0)+'%':p.kind==='f2r'?'0.'+p._t.lead+p._t.rep:String(+want.toFixed(6)))) bad.push('done line '+e.textContent+' want '+want);
        }
        out[L]=kinds; }
      B=null; current=null; return {out,bad:bad.slice(0,40),nbad:bad.length}; }""")
    print('JS generation per level:', json.dumps(res['out']))
    if res['nbad']: fail(f"{res['nbad']} JS problems: {res['bad']}")
    else: print('JS checks: all answers right, one operation each, only allowed labels, all instructions within word limits')
    b.close()

    # ───────── 3. screenshots at 390 + no sideways scroll at 390 / 1280 ─────────
    for W in (390, 1280):
        b, pg = open_page(p, W)
        no_hscroll(pg, f'start {W}')
        if W == 390: pg.screenshot(path=f'{OUT}/00-start.png', full_page=True)
        pg.click('#start button.btn')
        plan = [('add', 1, 'short', 2), ('add', 1, None, 3), ('sub', 2, None, 2), ('mul', 3, None, 1), ('mul', 3, 'pb', 3),
                ('divw', 3, None, 2), ('divd', 3, None, 1), ('d2p', 4, None, 0), ('p2d', 4, 'small', 0),
                ('f2d', 5, None, 3), ('f2r', 5, None, 4), ('f2r', 5, None, 99), ('pof', 6, None, 1)]
        for n, (kind, L, var, moves) in enumerate(plan):
            pg.evaluate(f"""()=>{{ let p,g=0; do{{ p=Math.random()<.5?gen({L}):genVariant({L}); g++; }}
              while(g<5000 && !(p.kind==='{kind}' && ({'true' if var is None else ("!!p.short" if var=='short' else ("!!p.pb" if var=='pb' else "p.p<10"))}) && ({'true' if var or kind!='sub' else 'Math.round(p.a*100)%10<Math.round(p.b*100)%10'})));
              level={L}; index=0; current=p; renderProblem(); }}""")
            pg.evaluate("FAST=true")
            if moves == 99: step_until_done(pg); moves = 0
            for _ in range(moves):
                st = state(pg)
                if st['i'] >= st['n'] - 1: break
                if st['kind'] == 'tap': pg.click('#go')
                else:
                    pg.fill('#box', pg.evaluate("String(+(+M.mv[M.i].expect).toFixed(6))")); pg.click('#go')
                pg.wait_for_function(f"M.i>{st['i']} && !M.busy")
            pg.wait_for_timeout(150)
            no_hscroll(pg, f'{kind} {W}')
            if W == 390:
                tag = 'done' if moves == 99 else 'mid'
                pg.screenshot(path=f'{OUT}/{n+1:02d}-{kind}{"-"+var if var else ""}-{tag}.png', full_page=True)
                print(f'   shot {kind}: msg="{state(pg)["msg"]}"')
        # a finished column problem, and the summary
        pg.evaluate("level=2; index=0; nextProblem()"); pg.evaluate("FAST=true")
        step_until_done(pg)
        pg.wait_for_timeout(150); no_hscroll(pg, f'done {W}')
        if W == 390: pg.screenshot(path=f'{OUT}/20-finished-column.png', full_page=True)
        pg.evaluate("index=9; correctCount=8; advance()")
        no_hscroll(pg, f'summary {W}')
        if W == 390: pg.screenshot(path=f'{OUT}/21-summary.png', full_page=True)
        b.close()

print('page errors:', errors or 'none')
if errors: fails.append('errors')
print('RESULT:', 'PASS' if not fails else f'{len(fails)} FAIL')
