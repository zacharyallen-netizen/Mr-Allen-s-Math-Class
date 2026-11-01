const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
const D='file:///home/claude/mr-allen-s-math-class/grade8/Fluency-Lab-Package/fluency-lab/';
const PAGES=['add-subtract','multiply','divide','fractions','decimals','integers','ratios','expressions'];
const SOLVE=`(wrongFirst)=>{ // finish the current problem; optionally make one mistake first
  const fw=document.getElementById('factwrap');
  if(fw && !fw.classList.contains('hide')){ const c=current; document.getElementById('answer').value=String(wrongFirst?999:(c.N!==undefined?c.q:c.a*c.b)); submitAnswer(); return; }
  if(typeof grpInputs==='undefined'){ window.grpInputs=g=>[document.getElementById('bx'+g)].filter(Boolean); }
  let first=true;
  while(G.si<G.steps.length){ const st=G.steps[G.si];
    st.boxes.forEach((bx,g)=>{ if(bx.pt){ document.querySelector('#fwork .ptslot[data-g="'+g+'"][data-k="'+decLayout(current).ptGap+'"]').click(); return; }
      const ins=grpInputs(g); let v=String(bx.expect); if(wrongFirst&&first) v=String(bx.expect+7);
      v=ins.length>1?v.padStart(ins.length,'0').slice(-ins.length):v; if(ins.length>1) v.split('').forEach((d,k)=>ins[k].value=d); else ins[0].value=v; });
    checkStep(); first=false; }
}`;
(async()=>{
 const b=await chromium.launch(); let bad=0;
 for(const pg of PAGES){
  const ctx=await b.newContext({viewport:{width:390,height:900}}); const p=await ctx.newPage();
  const errs=[]; p.on('pageerror',e=>errs.push(e.message)); const sent=[];
  await p.route('**/script.google.com/**', async r=>{ sent.push(r.request().postData()); await r.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,name:'Test Student',n:10,right:8})}); });
  await p.goto(D+'fluency-lab-'+pg+'.html'); await p.waitForTimeout(200);
  const w0=await p.evaluate(()=>!!document.getElementById('flresume'));
  await p.click('#start button.btn'); await p.waitForTimeout(100);
  for(let i=0;i<10;i++){
    await p.evaluate(`(${SOLVE})(${i===2||i===5})`);
    await p.evaluate(()=>advance()); await p.waitForTimeout(20);
  }
  const sumVis=await p.evaluate(()=>!document.getElementById('summary').classList.contains('hide') && !!document.querySelector('#summary #scoresend'));
  const lvl=await p.evaluate(()=>level);
  await p.fill('#ssname','Test Student'); await p.click('#ssbtn'); await p.waitForTimeout(250);
  await p.locator('#summary').screenshot({path:`prog-${pg}.png`});
  const body=sent.length?JSON.parse(sent[0]):null;
  // reload: level comes back, welcome line shows
  await p.reload(); await p.waitForTimeout(200);
  const after=await p.evaluate(()=>({level, welcome:(document.getElementById('flresume')||{}).textContent||''}));
  if(after.welcome) { await p.click('#flrestart'); }
  const reset=await p.evaluate(()=>({level, welcome:!!document.getElementById('flresume')}));
  const ok = !errs.length && !w0 && sumVis && body && body.kind==='practice' && body.unit==='Fluency' && body.items.length===10
     && body.items.filter(x=>!x.first).length>=2 && body.items.every(x=>x.std==='') && /reached Level \d/.test(body.page)
     && after.level===lvl && (lvl===1 || /Level/.test(after.welcome)) && reset.level===1 && !reset.welcome;
  if(!ok) bad++;
  console.log(pg.padEnd(13), ok?'OK ':'BAD', 'level', lvl, '| page:', body&&body.page, '| items', body&&body.items.length, 'first-miss', body&&body.items.filter(x=>!x.first).length,
     'final-miss', body&&body.items.filter(x=>!x.final).length, '| reload level', after.level, errs.join(' '));
  await ctx.close();
 }
 console.log(bad?'PROBLEMS '+bad:'ALL OK'); await b.close();
})();
