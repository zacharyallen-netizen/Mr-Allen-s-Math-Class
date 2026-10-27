const {chromium}=require('/home/claude/.npm-global/lib/node_modules/playwright');
(async()=>{
 const b=await chromium.launch();const errs=[];
 for(const w of [390,1280]){
  const p=await b.newPage({viewport:{width:w,height:900}});
  p.on('pageerror',e=>errs.push(String(e)));
  p.on('console',m=>{if(m.type()==='error'&&!/fonts\.g|ERR_TUNNEL|Failed to load resource/.test(m.text()))errs.push(m.text())});
  await p.goto('file:///home/claude/mr-allen-s-math-class/grade8/checkin_tutorial.html');
  const sw=await p.evaluate(()=>document.documentElement.scrollWidth);console.log(w,'scrollWidth',sw);
  await p.screenshot({path:`top_${w}.png`});
  await p.screenshot({path:`full_${w}.png`,fullPage:true});
  if(w===390){
   // wrong first then right
   const res=await p.evaluate(()=>{const out=[];const QS=window.__QS;
    for(const k in QS)for(const q of QS[k]){const d=document.getElementById('q-'+q.id);const fb=d.querySelector('.fb');
     if(q.type==='xy'){d.querySelector('#'+q.id+'x').value=String(q.ans[1]);d.querySelector('#'+q.id+'y').value=String(q.ans[0]);d.querySelector('.chk').click();out.push(q.id+' W: '+fb.textContent.slice(0,90));
       d.querySelector('#'+q.id+'x').value=String(q.ans[0]).replace('-','−');d.querySelector('#'+q.id+'y').value=String(q.ans[1]).replace('-','−');}
     else{const opts=d.querySelectorAll('.opt');const wi=q.opts.findIndex(o=>!o.ok);opts[wi].click();d.querySelector('.chk').click();out.push(q.id+' W: '+fb.textContent.slice(0,90));
       opts.forEach((o,j)=>{if(o.classList.contains('sel'))o.click();});q.opts.forEach((o,j)=>{if(o.ok)opts[j].click();});}
     d.querySelector('.chk').click();out.push(q.id+' R: '+fb.className+' '+fb.textContent.slice(0,60));}
    out.push('score '+document.getElementById('scoreN').textContent+' done '+document.getElementById('doneN').textContent+' summary '+document.getElementById('summary').classList.contains('show'));return out;});
   console.log(res.join('\n'));
   await p.screenshot({path:'done_390.png',fullPage:true});
  }
  await p.evaluate(()=>{window.__tf('cw');window.__coordShow(-3,4);});
 }
 console.log('ERRORS',errs);await b.close();})();
