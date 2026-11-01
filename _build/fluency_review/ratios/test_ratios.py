import re, sys, json
from playwright.sync_api import sync_playwright

URL = "file:///home/claude/mr-allen-s-math-class/grade8/Fluency-Lab-Package/fluency-lab/fluency-lab-ratios.html"
OUT = "/home/claude/mr-allen-s-math-class/_build/fluency_review/ratios/"
IGN = re.compile(r"fonts\.googleapis|fonts\.gstatic|ERR_TUNNEL|Failed to load resource|net::ERR")
errors = []
fails = []

def ok(cond, msg):
    if not cond:
        fails.append(msg)

def words(t):
    return len([w for w in re.sub(r"<[^>]+>", " ", t).split() if w.strip()])

GEN_CHECK = r"""
(L)=>{
  const bad=[]; const spots={}; const kinds={};
  const g=(a,b)=>{while(b){[a,b]=[b,a%b];}return a;};
  for(let i=0;i<400;i++){
    const p=gen(L); kinds[p.kind]=(kinds[p.kind]||0)+1;
    const div=document.createElement('div'); div.innerHTML=probH(p,false); const txt=div.textContent;
    const wordsIn=(txt.match(/[A-Za-z]+/g)||[]).filter(w=>w!=='Simplify');
    if(wordsIn.length) bad.push('words '+txt);
    if(/[+\-−$]/.test(txt)) bad.push('op '+txt);
    if((txt.match(/=/g)||[]).length>1) bad.push('two = '+txt);
    if((txt.match(/[×÷]/g)||[]).length) bad.push('×÷ in problem '+txt);
    if(p.kind==='simp'){ const k=g(p.N,p.D); if(p.N/k!==p.bn||p.D/k!==p.bd||k!==p.k||k<2) bad.push('simp '+JSON.stringify(p)); }
    else if(p.kind==='equiv'){ const B=p.bd*p.k; if(p.bn*B!==p.ans*p.bd||!Number.isInteger(p.ans)) bad.push('equiv'); }
    else if(p.kind==='unit'){ if(p.total/p.time!==p.ans||!Number.isInteger(p.ans)||p.ans<1) bad.push('unit'); }
    else if(p.kind==='prop'){
      const nulls=[]; p.cols.forEach((c,ci)=>c.forEach((v,ri)=>{ if(v===null) nulls.push(ci+''+ri); }));
      if(nulls.length!==1) bad.push('nulls');
      spots[nulls[0]]=(spots[nulls[0]]||0)+1;
      const f=p.cols.map(c=>c.map(v=>v===null?p.ans:v));
      if(f[0][0]*f[1][1]!==f[0][1]*f[1][0]) bad.push('prop wrong '+JSON.stringify(p));
      if(![].concat(...f).every(v=>Number.isInteger(v)&&v>0)) bad.push('prop non-int');
      if(L===4 && nulls[0]!=='00') bad.push('L4 spot');
      // answer recomputed from cross multiplication
      const [a,b]=f[0],[c,d]=f[1]; let r;
      if(nulls[0]==='00') r=b*c/d; if(nulls[0]==='01') r=a*d/c; if(nulls[0]==='10') r=a*d/b; if(nulls[0]==='11') r=b*c/a;
      if(r!==p.ans) bad.push('prop recompute');
    } else bad.push('unknown kind '+p.kind);
    // moves: every instruction short, expect matches calc
    const mv=buildMoves(p);
    for(const m of mv){
      const s=m.say.replace(/<[^>]+>/g,''); if(s.split(/\s+/).filter(Boolean).length>8) bad.push('long say: '+s);
      const n=('Not quite. '+m.nudge).split(/\s+/).length; if(n>8) bad.push('long nudge: '+m.nudge);
      if(m.sub) bad.push('sub line');
      const c=m.calc; let v;
      if(c.startsWith('G(')){ const [x,y]=c.slice(2,-1).split(',').map(Number); v=g(x,y); } else v=Function('return '+c)();
      if(v!==m.expect) bad.push('calc '+c+' vs '+m.expect);
      if(!Number.isInteger(m.expect)||m.expect<1) bad.push('non-int expect');
    }
  }
  return {bad:bad.slice(0,10), nbad:bad.length, spots, kinds};
}
"""

with sync_playwright() as pw:
    br = pw.chromium.launch()
    for width in (390, 1280):
        ctx = br.new_context(viewport={"width": width, "height": 900}, reduced_motion="reduce")
        pg = ctx.new_page()
        pg.on("pageerror", lambda e: errors.append(str(e)))
        pg.on("console", lambda m: (m.type == "error" and not IGN.search(m.text)) and errors.append(m.text))
        pg.route("**/*", lambda r: r.abort() if r.request.url.startswith("http") else r.continue_())
        pg.goto(URL)
        pg.wait_for_timeout(300)
        sw = lambda: pg.evaluate("document.documentElement.scrollWidth>document.documentElement.clientWidth")
        ok(not sw(), f"hscroll start {width}")
        if width == 390:
            pg.screenshot(path=OUT + "shot_start.png", full_page=True)
        if width == 390:
            for L in range(1, 7):
                r = pg.evaluate(GEN_CHECK, L)
                print("gen L", L, r["kinds"], r["spots"], "bad", r["nbad"], r["bad"][:3])
                ok(r["nbad"] == 0, f"gen L{L}: {r['bad']}")
        pg.evaluate("startSet()")
        solved = {L: 0 for L in range(1, 7)}
        kinds = {L: {} for L in range(1, 7)}
        for L in range(1, 7):
            for i in range(16):
                js = f"level={L}; streak=0; recentMisses=0; index=0; nextProblem()" if i != 1 else f"level={L}; index=0; current=gen({L}); renderProblem()"
                pg.evaluate(js)
                k = pg.evaluate("current.kind")
                kinds[L][k] = kinds[L].get(k, 0) + 1
                first = True
                while True:
                    st = pg.evaluate("({i:M.i,n:M.mv.length,exp:M.mv[M.i]&&M.mv[M.i].expect})")
                    if st["i"] >= st["n"]:
                        break
                    if i == 0 and first:
                        # one wrong answer per level
                        pg.fill("#box", str(st["exp"] + 1))
                        pg.click("#go")
                        fb = pg.inner_text("#fb")
                        ok(fb.strip() != "" and words(fb) <= 8, f"L{L} nudge '{fb}'")
                        print(f"L{L} nudge:", fb)
                        pg.fill("#box", str(st["exp"] + 2))
                        pg.click("#go")
                        fb2 = pg.inner_text("#fb")
                        ok(fb2.strip() == f"Type {st['exp']}.", f"L{L} reveal '{fb2}'")
                        first = False
                    if width == 390 and i == 1 and st["i"] == st["n"] - 1:
                        pg.screenshot(path=OUT + f"shot_L{L}_mid.png", full_page=True)
                    pg.fill("#box", str(st["exp"]))
                    pg.click("#go")
                    pg.wait_for_function(f"M.i>{st['i']} && !M.busy", timeout=5000)
                    ok(not sw(), f"hscroll L{L} {width}")
                label = pg.inner_text("#prob")
                msg = pg.inner_text("#msg")
                ok("?" not in label, f"L{L} label has ? {label}")
                ok(msg.startswith("✓"), f"L{L} done msg {msg}")
                ok(pg.inner_text("#done").strip() == "", f"L{L} done note")
                if width == 390 and i == 1:
                    pg.screenshot(path=OUT + f"shot_L{L}_done.png", full_page=True)
                if i < 2 and width == 390:
                    print(f"L{L} [{k}] prob='{label}' msg='{msg}'")
                solved[L] += 1
        print(width, "solved", solved, "kinds", kinds)
        # summary
        pg.evaluate("index=9; advance()")
        ok(not sw(), f"hscroll summary {width}")
        if width == 390:
            pg.screenshot(path=OUT + "shot_summary.png", full_page=True)
            print("note:", pg.inner_text("#s-note"))
        ctx.close()
    br.close()

print("errors:", errors)
print("FAILS:", fails[:20], len(fails))
