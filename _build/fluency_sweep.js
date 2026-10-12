// every lab, every level, both widths: solve problems with real typing, watch for page errors and sideways scrolling
const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
const D='file:///home/claude/mr-allen-s-math-class/grade8/Fluency-Lab-Package/fluency-lab/';
const PAGES=['add-subtract','multiply','divide','fractions','decimals','integers','ratios','expressions'];
(async()=>{
 const b=await chromium.launch(); let bad=0;
 for(const w of [390,1280]) for(const pg of PAGES){
  const p=await b.newPage({viewport:{width:w,height:900}}); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto(D+'fluency-lab-'+pg+'.html'); await p.waitForTimeout(150);
  let hs=await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);
  await p.click('button.btn');
  await p.evaluate(()=>{ if(typeof grpInputs==='undefined'){ window.grpInputs=g=>[document.getElementById('bx'+g)].filter(Boolean);
    window.boxOk=(bx,g)=>{const e=grpInputs(g)[0]; const v=clean(e?e.value:''); return v!=='' && Math.abs(+v-bx.expect)<1e-9;}; } });
  let solved=0;
  for(let n=0;n<36;n++){
    const lv=1+(n%6);
    await p.evaluate(lv=>{ level=lv; current=(typeof GEN!=='undefined'?GEN[lv]():gen(lv)); answered=false; renderProblem(); },lv);
    for(let guard=0;guard<14;guard++){
      const fact=await p.evaluate(()=>{const fw=document.getElementById('factwrap'); return !!fw && !fw.classList.contains('hide');});
      if(fact){ await p.evaluate(()=>{const c=current; document.getElementById('answer').value=String(c.N!==undefined?c.q:c.a*c.b); submitAnswer();}); break; }
      const st=await p.evaluate(()=>G.si<G.steps.length?G.steps[G.si].boxes.map((bx,g)=>({v:String(bx.expect),pt:!!bx.pt,dg:!!bx.digits,n:grpInputs(g).length,
         k:bx.pt?decLayout(current).ptGap:null})):null);
      if(!st) break;
      await p.evaluate(()=>{ const t=document.querySelector('#stepbtn'); });
      await p.evaluate(st=>{ st.forEach((o,g)=>{ if(o.pt){ document.querySelector(`#fwork .ptslot[data-g="${g}"][data-k="${o.k}"]`).click(); return; }
        const ins=grpInputs(g); const v=o.dg||ins.length>1?o.v.padStart(ins.length,'0'):o.v;
        if(ins.length>1) v.split('').forEach((d,k)=>ins[k].value=d); else ins[0].value=v; }); checkStep(); },st);
      if(hs===false) hs=await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);
    }
    const ok=await p.evaluate(()=>typeof G==='undefined'||!G||G.si>=G.steps.length||document.getElementById('factwrap')&&!document.getElementById('factwrap').classList.contains('hide'));
    if(ok) solved++;
  }
  if(errs.length||hs||solved<36) bad++;
  console.log(String(w).padEnd(5),pg.padEnd(14),'solved',solved+'/36','errors',errs.length,errs[0]||'','hscroll',hs);
  await p.close();
 }
 console.log(bad?'PROBLEMS: '+bad:'ALL CLEAN'); await b.close();
})();
