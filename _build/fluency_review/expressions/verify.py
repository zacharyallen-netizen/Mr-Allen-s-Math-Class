import json, re, sys
from playwright.sync_api import sync_playwright

URL = 'file:///home/claude/mr-allen-s-math-class/grade8/Fluency-Lab-Package/fluency-lab/fluency-lab-expressions.html'
OUT = '/home/claude/mr-allen-s-math-class/_build/fluency_review/expressions/'
IGN = re.compile(r'fonts\.googleapis|fonts\.gstatic|ERR_TUNNEL|Failed to load resource|net::ERR')
errors = []

def wc(html):
    t = re.sub(r'<[^>]+>', '', html or '').strip()
    return len(t.split()) if t else 0

def attach(page):
    page.on('pageerror', lambda e: errors.append('pageerror: ' + str(e)))
    page.on('console', lambda m: (m.type == 'error' and not IGN.search(m.text)) and errors.append('console: ' + m.text))

# small helper on the page: snapshot of what is visible
SNAP = """() => ({
  lines: [...document.querySelectorAll('#lines > *')].map(e=>e.textContent),
  work: document.getElementById('work').textContent,
  msg: document.getElementById('msg').innerHTML, sub: document.getElementById('sub').innerHTML,
  done: document.getElementById('done').innerHTML, fb: document.getElementById('fb').innerHTML,
  prob: document.getElementById('prob').textContent, go: document.getElementById('go').textContent,
  si: G.si, n: G.steps.length, kind: M.mv[M.i] && M.mv[M.i].kind, expect: M.mv[M.i] && M.mv[M.i].expect,
  neg: M.mv[M.i] && M.mv[M.i].neg, cur: JSON.parse(JSON.stringify(current)) })"""

def solve_problem(page, wrong=False, shots=None):
    """answer every move of the current problem correctly; returns list of observations"""
    obs = []
    first = True
    while True:
        s = page.evaluate(SNAP)
        if s['si'] >= s['n']:
            break
        assert len(s['lines']) == 1, ('more than one expression line', s['lines'])
        assert wc(s['msg']) <= 8, ('msg too long', s['msg'])
        assert wc(s['sub']) <= 6, ('sub too long', s['sub'])
        assert s['done'] == '', s['done']
        if shots and s['kind'] == 'type' and s['si'] == min(1, s['n'] - 1):
            page.screenshot(path=shots, full_page=True); shots = None
        if s['kind'] == 'tap':
            page.click('#go')
        else:
            if wrong and first:
                page.fill('#box', '99' if s['expect'] not in (99, -99) else '98')
                page.click('#go')
                fb = page.inner_html('#fb')
                assert 'fb no' in page.get_attribute('#fb', 'class')
                assert 0 < wc(fb) <= 8, ('nudge', fb)
                obs.append(('nudge', fb))
            val = str(-s['expect']) if s['neg'] else str(s['expect'])
            page.fill('#box', val)
            page.click('#go')
            first = False
        page.wait_for_function('() => !M.busy && (G.si>=G.steps.length || document.getElementById("go").disabled===false)')
    s = page.evaluate(SNAP)
    assert len(s['lines']) == 1
    return s, obs

with sync_playwright() as pw:
    b = pw.chromium.launch()
    # --- reduced motion so animations are instant
    ctx = b.new_context(viewport={'width': 390, 'height': 900}, reduced_motion='reduce')
    page = ctx.new_page(); attach(page)
    page.goto(URL); page.wait_for_timeout(300)
    page.screenshot(path=OUT + 'shot_start_390.png', full_page=True)
    sw = page.evaluate('document.documentElement.scrollWidth')
    assert sw <= 390, sw
    page.evaluate('startSet()')
    nudges = {}
    for L in range(1, 7):
        for k in range(16):
            page.evaluate(f'level={L}; index=0; current=gen({L}); renderProblem()')
            shot = OUT + f'shot_L{L}_mid_390.png' if k == 0 else None
            s, obs = solve_problem(page, wrong=(k == 0), shots=shot)
            if obs: nudges[L] = obs
            c = s['cur']
            assert s['prob'].startswith(page.evaluate('lineT(startTokens(current))')), s['prob']
            assert '=' in s['prob'] and str(abs(c['ans'])) in s['prob'], s['prob']
            assert s['msg'].count('✓') == 1 and wc(s['msg']) <= 14, s['msg']
            assert page.evaluate('document.documentElement.scrollWidth') <= 390
            if L == 6 and k == 0:
                page.screenshot(path=OUT + 'shot_finished_390.png', full_page=True)
    print('nudges', json.dumps(nudges, ensure_ascii=False))
    # one wrong twice -> "Type N."
    page.evaluate('level=2; current={kind:"md",a:3,o:"−",b:4,c:5,ans:3-20}; renderProblem()')
    page.fill('#box', '1'); page.click('#go'); page.fill('#box', '2'); page.click('#go')
    print('reveal1', page.inner_html('#fb'))
    page.fill('#box', '20'); page.click('#go'); page.wait_for_function('() => !M.busy')
    page.screenshot(path=OUT + 'shot_negative_390.png', full_page=True)
    print('neg step', page.inner_html('#msg'), '|', page.inner_html('#sub'), '|', page.text_content('#work'))
    page.fill('#box', '5'); page.click('#go'); print('neg nudge', page.inner_html('#fb'))
    page.fill('#box', '4'); page.click('#go'); print('neg reveal', page.inner_html('#fb'))
    page.fill('#box', '17'); page.click('#go'); page.wait_for_function('() => G.si>=G.steps.length')
    print('neg done', page.inner_html('#msg'), '| prob:', page.text_content('#prob'))

    # --- 300+ generated problems per level, checked independently
    res = page.evaluate("""() => {
      const out={}; const bad=[];
      const ev=s=>Function('return ('+s.replace(/−/g,'-').replace(/×/g,'*').replace(/÷/g,'/').replace(/²/g,'**2').replace(/³/g,'**3')+')')();
      const ALLOWED=/^(Put|in|for|x\\.|a|b|and|Multiply|first\\.|Multiply\\.|Add\\.|Subtract\\.|Answer|is|negative\\.|Parentheses|Power|Go|left|to|right\\.|Work|out|means|Not|quite\\.|Try|again\\.)$/;
      for(let L=1;L<=6;L++){ const kinds={};
        for(let n=0;n<400;n++){ const p=gen(L); kinds[p.kind]=(kinds[p.kind]||0)+1;
          let e=lineT(startTokens(p));
          if(p.kind==='sub1') e=e.replace(/(\\d)x/,'$1*'+p.x);
          if(p.kind==='sub2') e=e.replace(/(\\d)a/,'$1*'+p.a).replace(/(\\d)b/,'$1*'+p.b);
          if(p.kind==='pow') e=p.b+'**'+p.e;
          if(p.kind==='powadd') e=p.a+'+'+p.b+'**2';
          const v=ev(e.replace(/\\(/g,'(').replace(/\\)/g,')'));
          if(v!==p.ans) bad.push([L,e,v,p.ans]);
          // moves: each step's expect consistent, last step equals answer, words allowed
          const mv=buildMoves(p); const last=mv[mv.length-1];
          if(last.expect!==p.ans) bad.push(['last',L,e]);
          mv.forEach(m=>{ if(m.kind==='type'){ const c=ev(m.calc); if(c!==m.expect) bad.push(['calc',m.calc,c,m.expect]); }
            const words=(m.say+' '+(m.sub||'')+' '+(m.nudge||'')).replace(/<[^>]+>/g,'').split(/\\s+/).filter(w=>/[A-Za-z]/.test(w)&&!/^[abx][.=]?$/.test(w));
            words.forEach(w=>{ if(!ALLOWED.test(w)) bad.push(['word',w,m.say]); });
            if(m.say.replace(/<[^>]+>/g,'').split(/\\s+/).length>8) bad.push(['long',m.say]);
          });
          if(!/^[0-9 +−×÷()²³xab]+$/.test(lineT(startTokens(p)))) bad.push(['chars',lineT(startTokens(p))]);
        }
        out[L]=kinds; }
      return {out,bad:bad.slice(0,20),nbad:bad.length};
    }""")
    print('gen', json.dumps(res, ensure_ascii=False))
    assert res['nbad'] == 0

    # summary screen
    page.evaluate('index=9; correctCount=8; endSet()')
    page.screenshot(path=OUT + 'shot_summary_390.png', full_page=True)
    print('summary note', page.text_content('#s-note'), '|', page.text_content('#pb'))
    ctx.close()

    # --- 1280 wide, with animations on: play a full level-6 and level-1 cube problem
    ctx = b.new_context(viewport={'width': 1280, 'height': 900})
    page = ctx.new_page(); attach(page)
    page.goto(URL); page.wait_for_timeout(300)
    assert page.evaluate('document.documentElement.scrollWidth') <= 1280
    page.evaluate('startSet()')
    for setup in ['level=6; current=gen(6)', 'level=1; current={kind:"pow",b:4,e:3,ans:64}', 'level=3; current={kind:"paren",a:2,o:"−",b:9,c:3,inner:-7,ans:-21}']:
        page.evaluate(setup + '; renderProblem()')
        s, _ = solve_problem(page)
        print('1280 done', s['msg'], '| prob', s['prob'])
        assert page.evaluate('document.documentElement.scrollWidth') <= 1280
    ctx.close()
    # 390 with animations: cube mid-problem screenshot
    ctx = b.new_context(viewport={'width': 390, 'height': 900})
    page = ctx.new_page(); attach(page)
    page.goto(URL); page.evaluate('startSet(); level=1; current={kind:"pow",b:4,e:3,ans:64}; renderProblem()')
    page.wait_for_timeout(200)
    page.screenshot(path=OUT + 'shot_cube_390.png', full_page=True)
    print('cube lines', page.evaluate("[...document.querySelectorAll('#lines > *')].map(e=>e.textContent)"))
    page.fill('#box', '16'); page.click('#go'); page.wait_for_timeout(2500)
    print('cube after', page.evaluate("[...document.querySelectorAll('#lines > *')].map(e=>e.textContent)"), page.inner_html('#msg'))
    page.screenshot(path=OUT + 'shot_cube2_390.png', full_page=True)
    assert page.evaluate('document.documentElement.scrollWidth') <= 390
    b.close()

print('errors', errors)
assert not errors
print('OK')
