import re, json, sys
from playwright.sync_api import sync_playwright

URL = "file:///home/claude/mr-allen-s-math-class/grade8/Fluency-Lab-Package/fluency-lab/fluency-lab-multiply.html"
OUT = "/home/claude/mr-allen-s-math-class/_build/fluency_review/multiply/"
IGN = re.compile(r"fonts\.googleapis|fonts\.gstatic|ERR_TUNNEL|Failed to load resource|net::ERR")
errors, strings = [], set()
fails = []

def ok(cond, msg):
    if not cond:
        fails.append(msg)

def words(s):
    return [w for w in re.sub(r"<[^>]+>", " ", s).replace("✓", " ").split() if w]

def collect(page):
    for sel in ["#where", "#msg", "#fb"]:
        t = page.inner_text(sel).strip()
        if t:
            strings.add(re.sub(r"\d+", "N", t))

def wait_idle(page, i0):
    page.wait_for_function(f"!M.busy && (M.i>{i0} || M.i>=M.mv.length)", timeout=15000)

def solve(page, wrong_once=False, shot=None):
    n = page.evaluate("M.mv.length")
    wrong_done = False
    for step in range(n):
        i = page.evaluate("M.i")
        mv = page.evaluate("({k:M.mv[M.i].kind, e:M.mv[M.i].expect})")
        collect(page)
        if shot and step == n // 2:
            page.screenshot(path=shot, full_page=True)
        if mv["k"] == "tap":
            page.click("#go")
        else:
            if wrong_once and not wrong_done:
                bad = (mv["e"] + 1) % 1000
                page.fill("#box", str(bad)); page.click("#go")
                fb = page.inner_text("#fb").strip()
                ok(fb != "", "no nudge shown")
                ok(len(words(fb)) <= 8, f"nudge too long: {fb}")
                strings.add("NUDGE: " + re.sub(r"\d+", "N", fb))
                page.fill("#box", str(bad)); page.click("#go")
                fb2 = page.inner_text("#fb").strip()
                ok(fb2 == f"Type {mv['e']}.", f"second wrong: {fb2}")
                strings.add("NUDGE2: " + re.sub(r"\d+", "N", fb2))
                wrong_done = True
            page.fill("#box", str(mv["e"])); page.click("#go")
        wait_idle(page, i)
    collect(page)
    a, b = page.evaluate("[current.a, current.b]")
    prob = page.evaluate("document.getElementById('prob').textContent")
    ok(prob == f"{a} × {b} = {a*b:,}", f"prob label wrong: {prob}")
    msg = page.inner_text("#msg").strip()
    ok(msg == f"✓ {a} × {b} = {a*b:,}", f"done line: {msg}")
    ok(page.inner_text("#go").strip() in ("Next problem →", "See results"), "go not Next")

with sync_playwright() as pw:
    br = pw.chromium.launch()
    ctx = br.new_context(viewport={"width": 390, "height": 844}, reduced_motion="reduce")
    page = ctx.new_page()
    page.on("pageerror", lambda e: errors.append(str(e)))
    page.on("console", lambda m: m.type == "error" and not IGN.search(m.text) and errors.append(m.text))
    page.goto(URL)
    page.screenshot(path=OUT + "start-390.png", full_page=True)
    start_text = page.inner_text("#start")
    ok(page.evaluate("document.documentElement.scrollWidth<=innerWidth"), "start sideways scroll 390")

    # ---- 300+ problems per level, simulated in JS ----
    res = page.evaluate(r"""async () => {
      const out = {bad:[], says:new Set(), helps:new Set(), helpLong:[]};
      for (let L=1; L<=6; L++) for (let k=0; k<400; k++) {
        const p = GEN[L]();
        const range = {1:[2,12],2:[2,12],3:[2,12]};
        if (p.answer !== p.a*p.b) out.bad.push(['ans',L,p]);
        // one operation only: a × b, numbers only
        if (!Number.isInteger(p.a) || !Number.isInteger(p.b)) out.bad.push(['int',L,p]);
        if (L===4 && !(p.a>=13&&p.a<=99&&p.b>=3&&p.b<=9)) out.bad.push(['range',L,p]);
        if (L===5 && !(p.a>=105&&p.a<=899&&p.b>=3&&p.b<=9)) out.bad.push(['range',L,p]);
        if (L===6 && !(p.a>=13&&p.a<=89&&p.b>=13&&p.b<=89)) out.bad.push(['range',L,p]);
        if (L<=3 && !isFact(p)) out.bad.push(['fact',L,p]);
        const built = buildMoves(p); BOARD = built.B;
        for (const m of built.mv) {
          const s = m.say.replace(/<[^>]+>/g,'');
          out.says.add(s.replace(/\d+/g,'N'));
          if (m.help) { const h=m.help.replace(/<[^>]+>/g,''); out.helps.add(h.replace(/\d+/g,'N'));
                        if (h.split(/\s+/).filter(Boolean).length>8) out.helpLong.push(h); }
          if (m.kind==='type' && !m.fact) {
            const ex = s.split(':').pop().trim().replace(/×/g,'*');
            if (!/^[\d +*]+$/.test(ex) || eval(ex)!==m.expect) out.bad.push(['expect',L,p,s,m.expect]);
          }
          if (m.kind==='type') await m.after(BOARD); else await m.run(BOARD);
        }
        let got;
        if (BOARD.fact) got = BOARD.res;
        else { const r = BOARD.rows.sum || BOARD.rows.ans; got = +r.map(d=>d===null?'':d).join(''); }
        if (got !== p.a*p.b) out.bad.push(['board',L,p,got]);
      }
      // every fact hint, all pairs 0..12
      for (let a=0;a<=12;a++) for (let b=0;b<=12;b++){ const h=factHelp(a,b).replace(/<[^>]+>/g,'');
        if (h.split(/\s+/).filter(Boolean).length>8) out.helpLong.push(h); }
      BOARD=null;
      return {bad:out.bad.slice(0,10), nbad:out.bad.length, says:[...out.says], helps:[...out.helps], helpLong:out.helpLong};
    }""")
    ok(res["nbad"] == 0, f"JS sim failures: {res['bad']}")
    ok(not res["helpLong"], f"long hints: {res['helpLong'][:5]}")
    allowed = set("Multiply then add the carry Copy it Write a first Bring down Add Type answer N × + =".split())
    for s in res["says"]:
        for w in re.findall(r"[A-Za-z]+", s):
            ok(w in allowed, f"unexpected word '{w}' in '{s}'")
        ok(len(s.split()) <= 12, f"say too long: {s}")

    # ---- play 15+ problems on every level in the browser ----
    page.reload()
    page.evaluate("startSet()")
    for L in range(1, 7):
        for k in range(16):
            page.evaluate(f"level={L}; index=0; current=GEN[{L}](); renderProblem();")
            shot = OUT + f"mid-L{L}-390.png" if k == 0 else None
            if L == 6 and k < 8:   # make sure every L6 branch runs
                pairs = ["[47,53]", "[36,41]", "[58,19]", "[67,40]", "[24,13]", "[89,89]", "[13,11+2]", "[75,31]"]
                page.evaluate(f"(()=>{{const [a,b]={pairs[k]}; current=mk(a,b); renderProblem();}})()")
            solve(page, wrong_once=(k == 1), shot=shot)
            ok(page.evaluate("document.documentElement.scrollWidth<=innerWidth"), f"sideways scroll L{L}")
        if L == 6:
            page.screenshot(path=OUT + "finished-L6-390.png", full_page=True)
        if L == 4:
            page.screenshot(path=OUT + "finished-L4-390.png", full_page=True)
        if L == 1:
            page.screenshot(path=OUT + "finished-L1-390.png", full_page=True)

    # ---- a real set of 10 via nextProblem/advance -> summary ----
    page.evaluate("level=6; startSet()")
    for k in range(10):
        solve(page)
        page.click("#go")
    page.wait_for_selector("#summary:not(.hide)")
    summ = page.inner_text("#summary")
    page.screenshot(path=OUT + "summary-390.png", full_page=True)
    ok(page.evaluate("document.documentElement.scrollWidth<=innerWidth"), "summary sideways 390")

    # ---- 1280 wide ----
    page.set_viewport_size({"width": 1280, "height": 900})
    page.evaluate("startSet(); current=mk(89,89); renderProblem();")
    ok(page.evaluate("document.documentElement.scrollWidth<=innerWidth"), "sideways 1280 L6")
    page.screenshot(path=OUT + "mid-L6-1280.png")
    page.reload()
    ok(page.evaluate("document.documentElement.scrollWidth<=innerWidth"), "sideways 1280 start")

    # normal motion screenshot mid-problem with animation, 390
    ctx2 = br.new_context(viewport={"width": 390, "height": 844})
    p2 = ctx2.new_page(); p2.on("pageerror", lambda e: errors.append(str(e)))
    p2.goto(URL); p2.evaluate("startSet(); current=mk(47,53); renderProblem();")
    for _ in range(4):
        i = p2.evaluate("M.i"); m = p2.evaluate("({k:M.mv[M.i].kind,e:M.mv[M.i].expect})")
        if m["k"] == "tap": p2.click("#go")
        else: p2.fill("#box", str(m["e"])); p2.click("#go")
        wait_idle(p2, i)
    p2.screenshot(path=OUT + "mid-L6-row2-390.png", full_page=True)
    br.close()

errs = [e for e in errors if not IGN.search(e)]
print("START:", start_text)
print("SUMMARY:", summ)
print("SAYS:", json.dumps(sorted(res["says"]), ensure_ascii=False, indent=0))
print("HELPS:", json.dumps(sorted(res["helps"]), ensure_ascii=False, indent=0))
print("ON-SCREEN:", json.dumps(sorted(strings), ensure_ascii=False, indent=0))
print("ERRORS:", errs)
print("FAILS:", len(fails)); [print(" -", f) for f in fails[:30]]
