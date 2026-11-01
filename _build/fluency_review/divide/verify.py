import re, sys, json
from playwright.sync_api import sync_playwright

URL = "file:///home/claude/mr-allen-s-math-class/grade8/Fluency-Lab-Package/fluency-lab/fluency-lab-divide.html"
OUT = "/home/claude/mr-allen-s-math-class/_build/fluency_review/divide/"
IGN = re.compile(r"fonts\.googleapis|fonts\.gstatic|ERR_TUNNEL|Failed to load resource|net::ERR")
errors = []
fails = []

def ok(cond, msg):
    if not cond:
        fails.append(msg)

with sync_playwright() as pw:
    br = pw.chromium.launch()
    pg = br.new_page(viewport={"width": 390, "height": 844})
    pg.on("pageerror", lambda e: errors.append("pageerror: " + str(e)))
    pg.on("console", lambda m: (m.type == "error" and not IGN.search(m.text)) and errors.append("console: " + m.text))
    pg.goto(URL); pg.wait_for_timeout(300)
    pg.evaluate("try{localStorage.clear()}catch(e){}"); pg.reload(); pg.wait_for_timeout(300)
    pg.screenshot(path=OUT + "shot_start_390.png", full_page=True)
    ok(pg.evaluate("document.documentElement.scrollWidth<=document.documentElement.clientWidth"), "hscroll start 390")

    # 1) JS bulk: 400 problems per level
    bulk = pg.evaluate("""() => {
      const out={};
      const ALLOWED=new Set(['divide','multiply','subtract','bring','down','the','not','quite','again','too','big','small','still','fits','type','show','find','biggest','one','up','to','first','a','number','s','r']);
      for(let L=1;L<=6;L++){
        const bad=[]; let n=0;
        for(let k=0;k<400;k++){
          const p=GEN[L](); n++;
          // independent recompute
          const q=Math.floor(p.N/p.d), r=p.N%p.d;
          if(q!==p.q||r!==p.r) bad.push('wrong '+JSON.stringify(p));
          if(L<=3 && (!p.fact||p.r!==0)) bad.push('fact? '+JSON.stringify(p));
          if(L===4 && (p.N<10||p.N>99||p.r!==0||p.d<3||p.d>9)) bad.push('L4 range '+p.N);
          if(L===5 && (p.N<100||p.N>999||p.r!==0)) bad.push('L5 range '+p.N);
          if(L===6 && (p.N<100||p.N>999||p.r<1||p.r>=p.d)) bad.push('L6 range '+p.N);
          if(L===1 && ![2,5,10].includes(p.d)) bad.push('L1 d');
          if(L===2 && ![3,4,6].includes(p.d)) bad.push('L2 d');
          if(L===3 && ![7,8,9,11,12].includes(p.d)) bad.push('L3 d');
          const label=`${p.N} ÷ ${p.d}`;
          if((label.match(/[÷×+−\\-]/g)||[]).length!==1) bad.push('ops '+label);
          const built=p.fact?movesFact(p):movesLong(p);
          // replay the moves and check board digits
          let txt=[];
          built.mv.forEach(m=>{ txt.push(m.say||'', m.nudge||'');
            if(m.tryMsg) for(let g=0;g<=12;g++){ const t=m.tryMsg(g); if(t) txt.push(t);} });
          if(!p.fact){ const B=built.B; built.mv.forEach(m=>{ ensureRow(B,m); m.apply(B); });
            const top=B.rows[0].v.filter(v=>v!==null).join('');
            if(+top!==p.q) bad.push('board q '+top+' vs '+p.q);
            if(p.r && B.rtxt!=='r '+p.r) bad.push('rtxt');
            const lastRow=B.rows[B.rows.length-1].v.filter(v=>v!==null);
            if(+lastRow[lastRow.length-1]!==p.r) bad.push('final rem '+JSON.stringify(lastRow));
            // each D step's expect = floor(W/d) < 10
            built.mv.filter(m=>m.step==='D').forEach(m=>{ if(m.expect<0||m.expect>9) bad.push('qd'); });
          }
          for(const t of txt){
            const plain=t.replace(/<[^>]+>/g,'');
            const words=plain.match(/[A-Za-z]+/g)||[];
            words.forEach(w=>{ if(!ALLOWED.has(w.toLowerCase())) bad.push('word '+w+' in '+plain); });
            if(words.length>8) bad.push('long '+plain);
          }
        }
        out[L]={n, bad:[...new Set(bad)].slice(0,10)};
      }
      return out;
    }""")
    for L, v in bulk.items():
        ok(not v["bad"], f"bulk L{L}: {v['bad']}")
    print("bulk:", {k: v["n"] for k, v in bulk.items()})

    # 2) play: start a set, solve 20 per level via the page's functions
    pg.evaluate("""() => { window.__labels=[]; const oc=window.concludeProblem;
       window.concludeProblem=function(r,b){ window.__labels.push(document.getElementById('prob').textContent.replace(/\\s+/g,' ').trim()); return oc(r,b); }; }""")
    pg.evaluate("startSet()")
    stats = {}
    for L in range(1, 7):
        res = pg.evaluate("""async (L) => {
          const issues=[]; let solved=0; const nudges=[];
          const vis=el=>el && el.offsetParent!==null && el.textContent.trim()!=='';
          for(let k=0;k<20;k++){
            level=L; index=0;
            if(k<15){ current=GEN[L](); renderProblem(); } else nextProblem();
            const p=current;
            // a fresh problem: nothing stale
            if(document.getElementById('fb').textContent!=='') issues.push('stale fb');
            if(p.fact && document.getElementById('ladder').innerHTML!=='') issues.push('stale ladder');
            if(p.fact && document.getElementById('dmsb').innerHTML!=='') issues.push('stale dmsb');
            if(!p.fact && document.getElementById('ladder').querySelectorAll('.row').length!==2) issues.push('stale rows');
            let wrongDone = (k!==0);
            while(M.i<M.mv.length){
              const m=M.mv[M.i];
              const sayTxt=document.querySelector('.say').innerText.replace(/\\s+/g,' ').trim();
              if((document.getElementById('msg').textContent.match(/[A-Za-z]+/g)||[]).length>8) issues.push('msg long');
              if(m.kind==='tap'){ await doTap(); continue; }
              const box=document.getElementById('box');
              if(!box){ issues.push('no box'); break; }
              if(!wrongDone){
                box.value=String(m.expect===9?8:m.expect+1); await check();
                const t1=document.getElementById('fb').textContent; nudges.push(t1);
                if((t1.match(/[A-Za-z]+/g)||[]).length>8) issues.push('nudge long '+t1);
                box.value=String(m.expect===9?8:m.expect+1); await check();
                const t2=document.getElementById('fb').textContent; nudges.push(t2);
                if(t2!=='Type '+m.expect+'.') issues.push('second wrong '+t2);
                wrongDone=true;
              }
              box.value=String(m.expect); await check();
            }
            solved++;
            const lab=window.__labels[window.__labels.length-1];
            const ans=p.fact?`${p.q}`:`${p.q.toLocaleString('en-US')}${p.r?` r ${p.r}`:''}`;
            const exp=`${p.N.toLocaleString('en-US')} ÷ ${p.d} = ${ans}`.replace(/\\s+/g,'');
            if(lab.replace(/\\s+/g,'')!==exp) issues.push('label '+lab+' vs '+exp);
            const msg=document.getElementById('msg').textContent;
            if(msg.replace(/\\s+/g,'')!==('✓'+exp)) issues.push('done '+msg);
            if(document.getElementById('fb').textContent!=='') issues.push('fb after done');
            if(document.querySelector('#ladder .pbx')) issues.push('open box after done');
          }
          return {solved, issues:[...new Set(issues)], nudges:nudges.slice(0,4)};
        }""", L)
        stats[L] = res
        ok(not res["issues"], f"play L{L}: {res['issues']}")
    for L, r in stats.items():
        print("L", L, "solved", r["solved"], "nudges", r["nudges"])

    # 3) screenshots mid-problem per level at 390
    for L in range(1, 7):
        steps = {1: 0, 2: 0, 3: 0, 4: 3, 5: 5, 6: 6}[L]
        pg.evaluate("""async ([L,steps]) => { level=L; index=0;
            if(L===5){ current=mkD(408,4,102,0,false); } else if(L===6){ current=mkD(745,6,124,1,false); } else current=GEN[L]();
            renderProblem();
            for(let s=0;s<steps && M.i<M.mv.length-1;s++){ const m=M.mv[M.i]; if(m.kind==='tap') await doTap(); else { document.getElementById('box').value=String(m.expect); await check(); } }
            window.scrollTo(0,0); }""", [L, steps])
        pg.wait_for_timeout(200)
        pg.screenshot(path=OUT + f"shot_L{L}_mid_390.png", full_page=True)
        ok(pg.evaluate("document.documentElement.scrollWidth<=document.documentElement.clientWidth"), f"hscroll L{L} 390")
    # wrong-answer screenshot + helper open
    pg.evaluate("""async () => { level=4; current=mkD(84,3,28,0,false); renderProblem();
        document.getElementById('box').value='3'; await check(); document.getElementById('helpbtn').click(); window.scrollTo(0,0); }""")
    pg.wait_for_timeout(200)
    pg.screenshot(path=OUT + "shot_wrong_helper_390.png", full_page=True)
    # finished problem
    pg.evaluate("""async () => { level=6; current=mkD(745,6,124,1,false); renderProblem();
        while(M.i<M.mv.length){ const m=M.mv[M.i]; if(m.kind==='tap') await doTap(); else { document.getElementById('box').value=String(m.expect); await check(); } } window.scrollTo(0,0); }""")
    pg.wait_for_timeout(500)
    pg.screenshot(path=OUT + "shot_done_390.png", full_page=True)
    pg.evaluate("""async () => { level=1; current=mkD(20,5,4,0,true); renderProblem(); document.getElementById('box').value='4'; await check(); }""")
    pg.wait_for_timeout(300)
    pg.screenshot(path=OUT + "shot_done_fact_390.png", full_page=True)
    ok(pg.evaluate("document.documentElement.scrollWidth<=document.documentElement.clientWidth"), "hscroll done 390")
    pg.evaluate("index=9; endSet()")
    pg.screenshot(path=OUT + "shot_summary_390.png", full_page=True)
    ok(pg.evaluate("document.documentElement.scrollWidth<=document.documentElement.clientWidth"), "hscroll summary 390")

    # 1280
    pg.set_viewport_size({"width": 1280, "height": 900})
    pg.reload(); pg.wait_for_timeout(300)
    ok(pg.evaluate("document.documentElement.scrollWidth<=document.documentElement.clientWidth"), "hscroll start 1280")
    pg.evaluate("""async () => { startSet(); level=6; current=mkD(999,9,111,0,false); renderProblem();
        while(M.i<M.mv.length-1){ const m=M.mv[M.i]; if(m.kind==='tap') await doTap(); else { document.getElementById('box').value=String(m.expect); await check(); } } }""")
    pg.wait_for_timeout(300)
    ok(pg.evaluate("document.documentElement.scrollWidth<=document.documentElement.clientWidth"), "hscroll play 1280")
    pg.screenshot(path=OUT + "shot_play_1280.png", full_page=True)
    br.close()

print("errors:", errors)
print("fails:", json.dumps(fails, indent=1, ensure_ascii=False))
sys.exit(1 if (errors or fails) else 0)
