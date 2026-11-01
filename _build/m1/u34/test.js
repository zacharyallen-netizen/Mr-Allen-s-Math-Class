// node test.js page.html keys.json
const {chromium}=require('/home/claude/.npm-global/lib/node_modules/playwright');
const fs=require('fs');
(async()=>{
 const [pg,keyf]=process.argv.slice(2); const keys=JSON.parse(fs.readFileSync(keyf,'utf8'));
 const b=await chromium.launch(); let fails=0; const log=m=>{console.log(m)}; const bad=m=>{fails++;console.log('FAIL '+m)};
 for(const w of [390,1280]){
  const p=await (await b.newContext({viewport:{width:w,height:w===390?844:800}})).newPage(); const errs=[];
  p.on('pageerror',e=>errs.push(e.message)); p.on('console',m=>{if(m.type()==='error'&&!/fonts\.googleapis|fonts\.gstatic|ERR_TUNNEL|Failed to load resource|AudioContext|net::ERR/.test(m.text()))errs.push(m.text())});
  await p.addInitScript(()=>sessionStorage.setItem('m1ok','1')); await p.route(/fonts\.(googleapis|gstatic)/,r=>r.abort());
  await p.goto('file:///home/claude/mr-allen-s-math-class/math1/'+pg); await p.waitForTimeout(200);
  const items=await p.evaluate(()=>{const o={};for(const k in M1.S.items){const s=M1.S.items[k];o[k]={kind:s.kind,ans:s.ans,v:s.v,op:s.op,n:s.n,vars:s.vars}}return o;});
  if(w===390){ // key check + parser variants
   for(const id in items){ const it=items[id];
     if(!(id in keys)){ bad('no independent key for '+id); continue; }
     const k=keys[id]; const got=it.kind==='ineq'?it.op+it.n:it.ans;
     const same = Array.isArray(k)? JSON.stringify(k)===JSON.stringify(got) : (typeof k==='number'? Math.abs(k-got)<1e-9 : String(k)===String(got));
     if(!same && it.kind!=='expr' && it.kind!=='text') bad(`key ${id}: page=${JSON.stringify(got)} independent=${JSON.stringify(k)}`);
     if(it.kind==='expr'||it.kind==='text'){ const ok=await p.evaluate(([id,k])=>M1.judge(M1.S.items[id],k)===true,[id,k]); if(!ok) bad(`expr key ${id} independent ${k} not accepted`); }
   }
   for(const id in items){ const it=items[id]; let vars=[];
     const m=x=>String(x).replace('-','−');
     if(it.kind==='pt'){const [a,c]=it.ans; vars=[`(${a},${c})`,`(${m(a)}, ${m(c)})`,`${a},${c}`,`x=${a}, y=${c}`,`x = ${m(a)} and y = ${m(c)}`,`(${a}.0, ${c})`];}
     if(it.kind==='num'&&!keys['_skipvar_'+id]){const a=it.ans; vars=[`${a}`,`${m(a)}`,`  ${a} `, `x = ${a}`]; if(Number.isInteger(a)) vars.push(`${a}.0`); if(Math.abs(a)>=1000) vars.push(String(a).replace(/\B(?=(\d{3})+(?!\d))/g,','));}
     if(it.kind==='ineq'){vars=[`${it.v}${it.op}${it.n}`,`${it.v} ${it.op} ${it.n}`];}
     if(it.kind==='expr'||it.kind==='text') vars=(keys['_v_'+id]||[]);
     for(const v of vars){ const r=await p.evaluate(([id,v])=>M1.judge(M1.S.items[id],v),[id,v]); if(r!==true) bad(`variant ${id} "${v}" -> ${r}`); }
   }
  }
  // UI flow: wrong then right
  for(const id in items){ const it=items[id];
    const vis=await p.evaluate(id=>{const e=document.getElementById(id); if(!e) return 'missing'; const h=e.closest('.hide'); if(h) h.classList.remove('hide'); document.documentElement.style.scrollBehavior='auto'; e.scrollIntoView({block:'center'}); return 'ok';},id);
    if(vis!=='ok'){bad('element missing '+id);continue;}
    if(it.kind==='mc'||it.kind==='fix'){
      const opts=await p.$$eval(`#${id} [data-o]`,bs=>bs.map(b=>b.getAttribute('data-o')));
      if(!opts.includes(String(it.ans))) bad(`${id}: answer option ${it.ans} not among buttons`);
      for(const o of opts){ if(o===String(it.ans)) continue; await p.click(`#${id} [data-o="${o}"]`); const fb=await p.$eval('#fb-'+id,e=>e.className+'|'+e.textContent);
        if(!/ x /.test(fb+' ')&&!/chk-fb x/.test(fb)) bad(`${id} wrong option ${o} not marked wrong: ${fb}`); }
      await p.click(`#${id} [data-o="${it.ans}"]`); const fb=await p.$eval('#fb-'+id,e=>e.className); if(!/chk-fb c/.test(fb)) bad(`${id} right option not accepted`);
    } else {
      const inp='#'+id+'-in';
      let wrong = it.kind==='pt'?`(${it.ans[0]+1},${it.ans[1]})`: it.kind==='num'? String(it.ans+7) : it.kind==='ineq'? `${it.v}<${it.n-5}` : 'zzz';
      if(it.kind==='expr') wrong='7';
      await p.fill(inp,wrong); await p.click(`#${id} .val-chk button`); let fb=await p.$eval('#fb-'+id,e=>e.className+'|'+e.textContent);
      if(!/chk-fb x/.test(fb)) bad(`${id} wrong "${wrong}" not rejected: ${fb}`);
      const right = it.kind==='pt'?`(${it.ans[0]}, ${it.ans[1]})`: it.kind==='num'? String(it.ans): it.kind==='ineq'?`${it.v}${it.op}${it.n}` : (keys['_v_'+id]||[keys[id]])[0];
      await p.fill(inp,right); await p.press(inp,'Enter'); fb=await p.$eval('#fb-'+id,e=>e.className);
      if(!/chk-fb c/.test(fb)) bad(`${id} right "${right}" not accepted`);
    }
  }
  const sc=await p.evaluate(()=>{const s=document.getElementById('score');return s?s.textContent:''}); log(`w=${w} score: ${sc}`);
  const hs=await p.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth); if(hs) bad('horizontal scroll at '+w);
  // reveal-all / show-solution buttons + sliders shouldn't error
  await p.evaluate(()=>{document.querySelectorAll('.sa-btn').forEach(b=>b.click()); if(window.revealPage) revealPage(); document.querySelectorAll('input[type=range]').forEach(r=>{r.value=r.min;r.dispatchEvent(new Event('input'))});});
  if(errs.length) bad('errors at '+w+': '+errs.join(' | '));
  log(`w=${w}: ${Object.keys(items).length} items tested`);
 }
 await b.close(); log(fails?`${fails} FAILURES`:'ALL PASS');
})();
