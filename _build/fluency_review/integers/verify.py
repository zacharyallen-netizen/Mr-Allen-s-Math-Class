import re, sys, json
from playwright.sync_api import sync_playwright

URL = "file:///home/claude/mr-allen-s-math-class/grade8/Fluency-Lab-Package/fluency-lab/fluency-lab-integers.html"
OUT = "/home/claude/mr-allen-s-math-class/_build/fluency_review/integers/"
IGN = re.compile(r"fonts\.googleapis|fonts\.gstatic|ERR_TUNNEL|Failed to load resource|net::ERR")
errors, fails = [], []

def chk(cond, msg):
    if not cond:
        fails.append(msg)

def words(t):
    return len([w for w in re.sub(r"<[^>]+>", " ", t).split() if w])

def wait_idle(page):
    page.wait_for_function("M && !M.busy", timeout=15000)

def stage_lines(page):
    # visible problem lines + visible working lines inside the stage
    return page.evaluate("""()=>[...document.querySelectorAll('.stage .eline, .stage .work')]
        .filter(e=>e.offsetParent!==null && e.textContent.trim()!=='').map(e=>e.id+':'+e.textContent.replace(/\\s+/g,' ').trim())""")

def solve(page, L, wrong=False, shots=None):
    page.evaluate(f"level={L}; index=0; nextProblem()")
    wait_idle(page)
    cur = page.evaluate("current")
    orig = page.evaluate("probTxt(current)")
    did_wrong = False
    step = 0
    while True:
        st = page.evaluate("({i:M.i,n:M.mv.length,kind:M.mv[M.i]&&M.mv[M.i].kind,exp:M.mv[M.i]&&M.mv[M.i].expect,vals:M.mv[M.i]&&M.mv[M.i].options?M.mv[M.i].options.map(o=>o.value):null})")
        if st["i"] >= st["n"]:
            break
        lines = stage_lines(page)
        probs = [l for l in lines if l.startswith("prob:")]
        works = [l for l in lines if l.startswith("work:")]
        chk(len(probs) == 1 and len(works) <= 1, f"L{L} {orig} step{step}: lines {lines}")
        chk(page.evaluate("document.querySelectorAll('.stage .eline').length") == 1, "more than one .eline element")
        if cur["op"] == "−" and step > 0:
            chk(" + " in probs[0] and " − " not in probs[0], f"L{L} sub not rewritten: {probs}")
        if cur["op"] == "−" and step == 0:
            chk(probs[0] == "prob:" + orig, f"L{L} sub step0 {probs}")
        if shots is not None and step == shots.get("step", -1):
            page.screenshot(path=shots["path"], full_page=True)
        msg = page.inner_text("#msg"); sub = page.inner_text("#sub")
        chk(words(msg) <= 8, f"say too long: {msg}")
        chk(words(sub) <= 6, f"sub too long: {sub}")
        if st["kind"] == "type":
            box = page.locator("#box")
            if wrong and not did_wrong:
                box.fill(str(st["exp"] + 1)); page.click("#go")
                fb = page.inner_text("#fb")
                chk(0 < words(fb) <= 8, f"L{L} nudge words: {fb!r}")
                box.fill(str(st["exp"] + 2)); page.click("#go")
                fb2 = page.inner_text("#fb")
                chk(fb2.strip() == f"Type {st['exp']}.", f"L{L} 2nd wrong: {fb2!r}")
                did_wrong = True
            box.fill(str(st["exp"])); page.click("#go")
        else:
            k = st["vals"].index(st["exp"])
            if wrong and not did_wrong:
                page.locator("#picks .pick").nth(1 - k).click()
                fb = page.inner_text("#fb")
                chk(0 < words(fb) <= 8, f"L{L} pick nudge: {fb!r}")
                did_wrong = True
            page.locator("#picks .pick").nth(k).click()
        wait_idle(page)
        step += 1
    page.wait_for_function("document.querySelector('#go').textContent.includes('Next')||document.querySelector('#go').textContent.includes('See')")
    ptxt = page.evaluate("document.getElementById('prob').textContent.replace(/\\s+/g,' ').trim()")
    a, b, op = cur["a"], cur["b"], cur["op"]
    exp = {"+": a + b, "−": a - b, "×": a * b, "÷": a / b}[op]
    S = lambda n: ("−" if n < 0 else "") + str(abs(int(n)))
    chk(ptxt == f"{orig} = {S(exp)}", f"L{L} final prob {ptxt!r} vs {orig} = {S(exp)}")
    chk(page.inner_text("#msg").strip() == f"✓ {orig} = {S(exp)}", f"done line: {page.inner_text('#msg')!r}")
    lines = stage_lines(page)
    chk(len(lines) == 1, f"L{L} done lines {lines}")
    chk("Check:" not in page.inner_text(".stage"), "Check: line present")
    chk(page.evaluate("G.si>=G.steps.length"), "G.si not complete")
    return cur

with sync_playwright() as p:
    br = p.chromium.launch()
    for motion in ("reduce", "no-preference"):
        ctx = br.new_context(viewport={"width": 390, "height": 900}, reduced_motion=motion)
        page = ctx.new_page()
        page.on("pageerror", lambda e: errors.append("pageerror " + str(e)))
        page.on("console", lambda m: m.type == "error" and not IGN.search(m.text) and errors.append(m.text))
        page.goto(URL); page.wait_for_load_state("load")
        if motion == "no-preference":
            page.screenshot(path=OUT + "shot_start_390.png", full_page=True)
        page.evaluate("startSet()")
        n = 15 if motion == "reduce" else 2
        for L in range(1, 7):
            for k in range(n):
                shots = None
                if motion == "no-preference" and k == 0:
                    shots = {"step": 1 if L == 3 else 0, "path": OUT + f"shot_L{L}_mid_390.png"}
                solve(page, L, wrong=(k == 0), shots=shots)
                if motion == "no-preference" and k == 0 and L in (2, 3):
                    page.wait_for_timeout(600)
                    page.screenshot(path=OUT + f"shot_L{L}_done_390.png", full_page=True)
        # forced subtraction screenshots with the swap mid-way and after
        if motion == "no-preference":
            page.evaluate("level=3; index=0; current=mk(-4,'−',6); renderProblem()")
            wait_idle(page)
            page.screenshot(path=OUT + "shot_sub_step1_390.png", full_page=True)
            page.locator("#picks .pick").nth(1).click()
            page.wait_for_timeout(1300)
            page.screenshot(path=OUT + "shot_sub_step2_390.png", full_page=True)
            page.fill("#box", "10"); page.click("#go"); wait_idle(page)
            page.screenshot(path=OUT + "shot_sub_step3_390.png", full_page=True)
            page.locator("#picks .pick").nth(1).click(); wait_idle(page)
            page.wait_for_timeout(700)
            page.screenshot(path=OUT + "shot_sub_done_390.png", full_page=True)
            chk(page.evaluate("document.getElementById('prob').textContent.replace(/\\s+/g,' ').trim()") == "−4 − 6 = −10", "−4 − 6 label")
        # widths
        for wdt in (390, 1280):
            page.set_viewport_size({"width": wdt, "height": 900})
            sw = page.evaluate("[document.documentElement.scrollWidth, document.documentElement.clientWidth]")
            chk(sw[0] <= sw[1], f"sideways scroll at {wdt} motion={motion}: {sw}")
        page.set_viewport_size({"width": 390, "height": 900})
        # finish set -> summary
        page.evaluate("index=9; advance()")
        page.wait_for_timeout(200)
        sw = page.evaluate("[document.documentElement.scrollWidth, document.documentElement.clientWidth]")
        chk(sw[0] <= sw[1], f"summary scroll {sw}")
        if motion == "no-preference":
            page.screenshot(path=OUT + "shot_summary_390.png", full_page=True)
        # bulk generation
        res = page.evaluate(r"""()=>{
          const out={bad:[],count:{}, strings:new Set()};
          const wc=t=>t.replace(/<[^>]+>/g,' ').split(/\s+/).filter(Boolean).length;
          for(let L=1;L<=6;L++){ out.count[L]=0;
            for(let k=0;k<400;k++){ const q=gen(L); out.count[L]++;
              const t=probTxt(q);
              if(!/^[0-9−() +×÷]+$/.test(t)) out.bad.push('chars '+t);
              const ops=(t.replace(/\(−\d+\)/g,'N').replace(/^−/,'').match(/[+−×÷]/g)||[]).length;
              if(ops!==1) out.bad.push('ops '+t);
              const r={'+':q.a+q.b,'−':q.a-q.b,'×':q.a*q.b,'÷':q.a/q.b}[q.op];
              if(r!==q.ans||!Number.isInteger(r)) out.bad.push('ans '+t+' '+q.ans);
              const lv={1:['+'],2:['+'],3:['−'],4:['×'],5:['÷'],6:['+','−','×','÷']}[L];
              if(!lv.includes(q.op)) out.bad.push('level op '+L+' '+t);
              if(L===1&&(q.a<0)!==(q.b<0)) out.bad.push('L1 signs '+t);
              if(L===2&&(q.a<0)===(q.b<0)) out.bad.push('L2 signs '+t);
              if(q.a===0||q.b===0) out.bad.push('zero '+t);
              // the moves reach the right answer
              current=q; const mv=buildMoves(q); let mag=null, sign=null, opp=null;
              for(const m of mv){
                for(const f of ['say','sub','nudge']) if(m[f]){ out.strings.add(f+': '+m[f].replace(/<[^>]+>/g,'').replace(/[−\d]+/g,'#'));
                  if(wc(m[f])>(f==='sub'?6:8)) out.bad.push('long '+f+' '+m[f]); }
                if(m.kind==='type') mag=m.expect;
                else if(m.hl==='sub') opp=m.expect;
                else sign=Math.sign(m.expect);
              }
              if(q.op==='−' && opp!==-q.b) out.bad.push('opp '+t);
              const got=sign===null?mag:sign*mag;
              if(got!==q.ans && !(q.ans===0&&mag===0)) out.bad.push('moves '+t+' got '+got);
              if(answerText()!==t+' = '+S(q.ans)) out.bad.push('answerText '+answerText());
            }}
          out.strings=[...out.strings]; return out; }""")
        chk(not res["bad"], "bulk: " + "; ".join(res["bad"][:10]))
        if motion == "reduce":
            print("bulk counts", res["count"])
            print("move strings:\n  " + "\n  ".join(sorted(res["strings"])))
        ctx.close()
    br.close()

print("errors:", errors)
print("fails:", len(fails))
for f in fails[:40]:
    print(" -", f)
