const {chromium}=require('/home/claude/.npm-global/lib/node_modules/playwright');
const IGN=/fonts\.googleapis|fonts\.gstatic|ERR_TUNNEL|Failed to load resource|AudioContext|net::ERR/;
const FACT={ // a known correct factored form + a reordered variant for factor items
 'unit5-notes.html':{},'unit5-practice.html':{},
 'unit6-notes.html':{fm62b:['(x+3)(x-5)','(x − 5)(x + 3)'],yt62:['(x+4)(x+5)','(x + 5)(x + 4)'],yt63:['(2x+5)(2x-5)','(2x − 5)(2x + 5)'],yt63b:['(3x+4)(x+2)','(x+2)(3x+4)']},
 'unit6-practice.html':{b1:['(x+3)(x+4)','(x + 4)(x + 3)'],b2:['(x+3)(x-3)','(x − 3)(x + 3)'],b3:['(2x-1)(x+3)','(x+3)(2x−1)'],b4:['3x(x+4)','3x(4+x)'],b5:['(x+3)(x-6)','(x−6)(x+3)'],b6:['(x+5)^2','(x+5)(x+5)'],d2:['(x+1)(x-3)','(x−3)(x+1)']}};
(async()=>{const b=await chromium.launch();let fails=0;
for(const pg of process.argv.slice(2)){
 const ctx=await b.newContext({viewport:{width:390,height:844},hasTouch:true});const p=await ctx.newPage();const errs=[];
 p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error'&&!IGN.test(m.text()))errs.push(m.text());});
 await p.addInitScript(()=>sessionStorage.setItem('m1ok','1'));await p.goto('http://localhost:8756/math1/'+pg);await p.waitForTimeout(500);
 const specs=await p.evaluate(()=>Object.keys(M.SPEC).map(id=>{const s=M.SPEC[id];const a=typeof s.ans==='function'?s.ans():s.ans;return {id,type:s.type,ans:a,pct:!!s.pct,tol:s.tol,accept:s.accept,fb:(s.fb&&Array.isArray(s.fb))?s.fb.map(f=>typeof f[0]==='function'?null:f[0]):null,mcfb:(s.fb&&!Array.isArray(s.fb))?Object.keys(s.fb):null,parts:s.parts?s.parts.map(q=>({k:q.k,type:q.type,ans:q.ans,fb:q.fb?q.fb.map(f=>f[0]):null})):null};}));
 const log=[];const bad=m=>{fails++;log.push('FAIL '+m);};
 const fmt=n=>{let s=String(Math.round(n*1e6)/1e6);return s;};
 const um=s=>s.replace(/-/g,'−');
 async function typed(id,val,sel){await p.evaluate(([id,val,sel])=>{const i=document.getElementById(sel||id+'-in');i.disabled=false;i.value=val;i.classList.remove('ok','bad');const c=document.getElementById(id);delete c.dataset.solved;},[id,val,sel]);
   await p.evaluate(id=>M.check(id),id);return p.evaluate(id=>{const f=document.getElementById('fb-'+id);return {cls:f.className,txt:f.textContent};},id);}
 function variants(s){const a=s.ans;switch(s.type){
   case 'num':{const v=[fmt(a),'x = '+um(fmt(a))];if(Number.isInteger(a))v.push(a+'.0');if(Math.abs(a*2-Math.round(a*2))<1e-9&&!Number.isInteger(a))v.push(Math.round(a*2)+'/2');if(a<0)v.push(um(fmt(a)));if(s.pct)v.push(fmt(Math.round(a*10)/10)+'%',fmt(Math.round(a*10)/1000));if(a>0&&!s.pct)v.push('+'+fmt(a));return v;}
   case 'set':{const r=a.map(x=>Math.round(x*100)/100);const v=['x='+r.join(','),r.slice().reverse().map(fmt).map(um).join(' or '),'x = '+r.map(fmt).join(', x = ')];if(a.length===2&&Math.abs(a[0]+a[1])<1e-9)v.push('±'+fmt(Math.abs(a[0])),'x=+-'+fmt(Math.abs(a[0])));return v;}
   case 'pt':return ['('+a[0]+', '+um(String(a[1]))+')',a[0]+','+a[1],'('+a[0]+','+a[1]+')'];
   case 'text':return [s.accept[0],s.accept[0].replace('-','–'),s.accept[0].replace('-',' to ')];
 } return [];}
 function wrongOf(s){switch(s.type){case 'num':return fmt(s.ans+7.3);case 'set':return s.ans.map(x=>x+11).join(',');case 'pt':return '(9,9)';case 'text':return '10-19';case 'poly':return 'x^2+99';case 'factor':return '(x+97)(x+98)';}}
 for(const s of specs){
  if(s.type==='mc'){const opts=await p.$$eval('#'+s.id+' .chk-btn',bs=>bs.map(b=>b.getAttribute('data-v')));if(!opts.includes(String(s.ans)))bad(s.id+' mc answer not among options');
    const wrong=opts.filter(o=>o!==String(s.ans));
    if(wrong.length){await p.click('#'+s.id+' .chk-btn[data-v="'+wrong[0]+'"]');const f=await p.$eval('#fb-'+s.id,e=>e.className+'|'+e.textContent);if(!/ x/.test(f)||/✓/.test(f))bad(s.id+' wrong mc fb '+f);else log.push(s.id+' mc wrong ok: '+f.split('|')[1].slice(0,70));}
    await p.click('#'+s.id+' .chk-btn[data-v="'+s.ans+'"]');const f2=await p.$eval('#fb-'+s.id,e=>e.className+'|'+e.textContent);if(!/ c/.test(f2))bad(s.id+' right mc fb '+f2);continue;}
  if(s.type==='multi'){for(const q of s.parts){await p.fill('#'+s.id+'-'+q.k,'987');}
    await p.evaluate(id=>M.check(id),s.id);let f=await p.$eval('#fb-'+s.id,e=>e.className);if(!/ x/.test(f))bad(s.id+' multi wrong not x');
    for(const q of s.parts){if(q.fb)for(const k of q.fb){await p.evaluate(([id,k])=>{document.getElementById(id).disabled=false;},[s.id+'-'+q.k]);await p.fill('#'+s.id+'-'+q.k,Array.isArray(k)?k.map(fmt).join(','):fmt(k));await p.evaluate(id=>M.check(id),s.id);const t=await p.$eval('#fb-'+s.id,e=>e.textContent);log.push(s.id+'.'+q.k+' fb['+k+']: '+t.slice(0,90));}}
    for(const q of s.parts){const el=await p.$('#'+s.id+'-'+q.k);if(await el.isDisabled())continue;const v=q.type==='set'?'x = '+q.ans.map(fmt).map(um).join(' or '):um(fmt(q.ans));await p.fill('#'+s.id+'-'+q.k,v);}
    await p.evaluate(id=>M.check(id),s.id);f=await p.$eval('#fb-'+s.id,e=>e.className+'|'+e.textContent);if(!/ c/.test(f))bad(s.id+' multi right '+f);continue;}
  // wrong
  let r=await typed(s.id,wrongOf(s));if(!/ x/.test(r.cls))bad(s.id+' wrong accepted '+wrongOf(s));else log.push(s.id+' wrong: '+r.txt.slice(0,80));
  if(s.fb)for(const k of s.fb){if(k==null)continue;const v=Array.isArray(k)?k.map(fmt).join(','):(typeof k==='number'?fmt(k):k);r=await typed(s.id,v);if(/ c/.test(r.cls))bad(s.id+' fb value accepted as right: '+v);log.push(s.id+' fb['+v+']: '+r.txt.slice(0,90));}
  let rights=variants(s);
  if(s.type==='poly'){const st=await p.evaluate(a=>M.pstr(a),s.ans);const caret=st.replace(/²/g,'^2').replace(/−/g,'-').replace(/ /g,'');const terms=caret.replace(/-/g,'+-').split('+').filter(Boolean);rights=[st,caret,terms.reverse().join('+').replace(/\+-/g,'-')];
    r=await typed(s.id,'('+caret+')*1');if(/ c/.test(r.cls))log.push(s.id+' note: paren form accepted');}
  if(s.type==='factor'){rights=FACT[pg][s.id]||[];if(!rights.length)bad(s.id+' no factor test strings');const st=await p.evaluate(a=>M.pstr(a),s.ans);r=await typed(s.id,st);if(/ c/.test(r.cls))bad(s.id+' expanded accepted as factored');else log.push(s.id+' expanded: '+r.txt.slice(0,70));}
  for(const v of rights){r=await typed(s.id,v);if(!/ c/.test(r.cls))bad(s.id+' right variant rejected: '+v+' -> '+r.txt);}
 }
 // notes: reveal steps one by one, all buttons
 await p.evaluate(()=>{document.querySelectorAll('.step').forEach(s=>s.click());document.querySelectorAll('.sa-btn').forEach(b=>b.click());});
 await p.evaluate(()=>revealPage());
 // sliders
 const ranges=await p.$$('input[type=range]');for(const rg of ranges){await rg.evaluate(e=>{e.value=e.max;e.dispatchEvent(new Event('input',{bubbles:true}));e.value=e.min;e.dispatchEvent(new Event('input',{bubbles:true}));});}
 const best=await p.$('#fit-best');if(best){await best.click();const t=await p.$eval('#fit-read',e=>e.textContent);if(!/smallest/.test(t))bad('fit best not smallest: '+t);else log.push('fit best: '+t);}
 const da=await p.$('.drag-area');if(da){await da.scrollIntoViewIfNeeded();const before=await p.$eval('.drag-area .ctrl',e=>e.textContent);const c=await p.$$('.drag-area svg circle');const bb=await c[6].boundingBox();
   await p.mouse.move(bb.x+bb.width/2,bb.y+bb.height/2);await p.mouse.down();await p.mouse.move(bb.x+bb.width/2,bb.y+120,{steps:5});await p.mouse.up();
   const after=await p.$eval('.drag-area .ctrl',e=>e.textContent);if(after===before)bad('drag (mouse) did not change r');else log.push('drag mouse: '+before+' -> '+after);
   const c2=await p.$$('.drag-area svg circle');const b2=await c2[0].boundingBox();
   await p.evaluate(([x,y])=>{const el=document.querySelector('.drag-area');const mk=(t,yy)=>new PointerEvent(t,{bubbles:true,pointerId:7,pointerType:'touch',clientX:x,clientY:yy,isPrimary:true});el.dispatchEvent(mk('pointerdown',y));el.dispatchEvent(mk('pointermove',y-90));el.dispatchEvent(mk('pointerup',y-90));},[b2.x+b2.width/2,b2.y+b2.height/2]);
   const after2=await p.$eval('.drag-area .ctrl',e=>e.textContent);if(after2===after)bad('drag (touch) did not change');else log.push('drag touch: -> '+after2);}
 const score=await p.$('#score')?await p.$eval('#score',e=>e.textContent):'';
 console.log('=== '+pg+' items '+specs.length+' '+score+' errors: '+errs.join(' | '));console.log(log.join('\n'));
 await ctx.close();}
console.log('FAILS',fails);await b.close();})();
