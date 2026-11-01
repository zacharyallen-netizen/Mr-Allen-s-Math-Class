// node typetest2.js <page> <levels comma> : types every box with the keyboard; every 5th problem has one wrong box first
const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
const D='file:///home/claude/mr-allen-s-math-class/grade8/Fluency-Lab-Package/fluency-lab/';
const [,,page,lvs,N]=process.argv; const LV=lvs.split(',').map(Number);
(async()=>{
 const b=await chromium.launch(); let fails=0;
 const p=await b.newPage({viewport:{width:390,height:900}});
 const errs=[]; p.on('pageerror',e=>errs.push(e.message));
 await p.goto(D+'fluency-lab-'+page+'.html'); await p.click('button.btn');
 await p.evaluate(()=>{ if(typeof grpInputs==='undefined'){ window.grpInputs=g=>[document.getElementById('bx'+g)].filter(Boolean);
   window.focusG=g=>{const e=grpInputs(g)[0]; if(e) e.focus();};
   window.boxOk=(bx,g)=>{const e=grpInputs(g)[0]; const v=clean(e?e.value:''); return v!=='' && Math.abs(+v-bx.expect)<1e-9;}; } });
 let solved=0, wrongs=0;
 for(let n=0;n<(+N||60);n++){
  const lv=LV[n%LV.length];
  await p.evaluate(lv=>{ level=lv; current=(typeof GEN!=='undefined'?GEN[lv]():gen(lv)); answered=false; index=0; renderProblem(); },lv);
  const guided=await p.evaluate(()=>typeof G!=='undefined'&&G&&G.steps&&!(document.getElementById('guided')||{classList:{contains:()=>false}}).classList.contains('hide'));
  if(!guided){ continue; }
  const makeErr=n%5===0;
  for(let guard=0;guard<12;guard++){
   const st=await p.evaluate(()=>G.si<G.steps.length?G.steps[G.si].boxes.map((bx,g)=>({e:String(bx.expect),b0:!!bx.blank0,n:grpInputs(g).length,pt:!!bx.pt,dg:!!bx.digits,
     ptk:bx.pt?decLayout(current).ptGap:null})):null);
   if(!st) break;
   for(let g=0;g<st.length;g++){
     const bx=st[g]; let v=bx.e; if(bx.b0&&v==='0') v='';
     if(makeErr && g===st.length-1 && guard===0) v = v.length? (v.slice(0,-1)+((+v.slice(-1)+1)%10)) : '1';
     if(bx.pt){ const k = (makeErr && g===st.length-1 && guard===0) ? (bx.ptk===0?1:0) : bx.ptk;
       if(k>=bx.n){ await p.click(`#fwork .ptslot[data-k="${bx.ptk}"]`); await p.click(`#fwork .ptslot[data-k="${bx.ptk}"]`); /* fallback */ }
       await p.click(`#fwork .ptslot[data-g="${g}"][data-k="${k}"]`); continue; }
     if(bx.dg) v=v.padStart(bx.n,'0');
     await p.evaluate(g=>focusG(g),g);
     if(v!=='') await p.keyboard.type(v);
   }
   const before=await p.evaluate(()=>G.si);
   await p.keyboard.press('Enter'); await p.waitForTimeout(15);
   const still=await p.evaluate(b=>G.si===b && !document.querySelector('.bad'),before);
   if(still) await p.click('#stepbtn');
   const bad=await p.evaluate(b=>G.si===b && G.si<G.steps.length && G.steps[G.si].boxes.some((bx,g)=>!boxOk(bx,g)),before);
   if(bad){ wrongs++; const vals=await p.evaluate(()=>G.steps[G.si].boxes.map((bx,g)=>({v:String(bx.expect),pt:!!bx.pt,dg:!!bx.digits,n:grpInputs(g).length,k:bx.pt?decLayout(current).ptGap:null})));
     for(let g=0;g<vals.length;g++){ const o=vals[g];
       if(o.pt){ await p.click(`#fwork .ptslot[data-g="${g}"][data-k="${o.k}"]`); continue; }
       await p.evaluate(g=>{grpInputs(g).forEach(e=>e.value='');focusG(g);},g); await p.keyboard.type(o.dg?o.v.padStart(o.n,'0'):o.v); }
     await p.click('#stepbtn'); }
  }
  const r=await p.evaluate(()=>({done:G.si>=G.steps.length,right:!current._hadError}));
  if(!r.done||r.right!==!makeErr){ fails++; console.log('FAIL',n,r,await p.evaluate(()=>JSON.stringify(current).slice(0,200))); } else solved++;
 }
 console.log(page,'solved',solved,'fixed-after-wrong',wrongs,'errors',errs, fails?'FAILS '+fails:'OK');
 await b.close();
})();
