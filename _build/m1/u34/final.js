const {chromium}=require('/home/claude/.npm-global/lib/node_modules/playwright');
(async()=>{const b=await chromium.launch();
for(const pg of ['unit3-notes.html','unit3-practice.html','unit4-notes.html','unit4-practice.html','unit3.html','unit4.html']) for(const w of [390,1280]){
 const ctx=await b.newContext({viewport:{width:w,height:w===390?844:800},hasTouch:true}); const p=await ctx.newPage(); const errs=[];
 p.on('pageerror',e=>errs.push(e.message)); p.on('console',m=>{if(m.type()==='error'&&!/fonts\.googleapis|fonts\.gstatic|ERR_TUNNEL|Failed to load resource|AudioContext|net::ERR/.test(m.text()))errs.push(m.text())});
 await p.addInitScript(()=>sessionStorage.setItem('m1ok','1')); await p.route(/fonts\.(googleapis|gstatic)/,r=>r.abort());
 await p.goto('file:///home/claude/mr-allen-s-math-class/math1/'+pg); await p.waitForTimeout(250);
 const chk=async(tag)=>p.evaluate(tag=>{const out=[];document.querySelectorAll('svg').forEach(svg=>{const vb=svg.viewBox.baseVal;if(!vb||!vb.width)return;
   svg.querySelectorAll('text').forEach(t=>{if(!t.textContent.trim()||t.closest('g[transform]'))return;const bb=t.getBBox();if(bb.x<-0.5||bb.y<-0.5||bb.x+bb.width>vb.width+0.5||bb.y+bb.height>vb.height+0.5)out.push(tag+':'+t.textContent)})});
   const sw=document.documentElement.scrollWidth>window.innerWidth; return {clip:out,hs:sw,svgs:document.querySelectorAll('svg').length}},tag);
 const r1=await chk('before'); await p.evaluate(()=>{if(window.revealPage)revealPage(); else if(window.M1) M1.revealAll(); document.querySelectorAll('.sa-btn').forEach(x=>x.click())}); const r2=await chk('after');
 let drag='';
 if(pg==='unit3-notes.html'){ await p.evaluate(()=>{document.documentElement.style.scrollBehavior='auto';document.getElementById('dg-viz').scrollIntoView({block:'center'})});
   const box=await (await p.$('#dg-viz svg')).boundingBox(); const before=await p.textContent('#dg-out');
   await p.mouse.move(box.x+box.width*0.3,box.y+box.height*0.75); await p.mouse.down(); await p.mouse.move(box.x+box.width*0.85,box.y+box.height*0.2,{steps:5}); await p.mouse.up();
   const afterMouse=await p.textContent('#dg-out');
   await p.tap('#dg-viz svg',{position:{x:box.width*0.3,y:box.height*0.6}}); const afterTap=await p.textContent('#dg-out');
   drag=`drag: [${before}] -> mouse [${afterMouse}] -> tap [${afterTap}]`; }
 if(w===1280){ const secs=await p.$$('section.topic'); for(let i=0;i<secs.length;i++) await secs[i].screenshot({path:`${__dirname}/shots/final-${pg.replace('.html','')}-${w}-${i+1}.png`}); }
 console.log(pg,w,'svgs',r1.svgs,'hscroll',r1.hs||r2.hs,'clipped',JSON.stringify(r1.clip.concat(r2.clip)),'errors',errs.length?errs:'none',drag);
 await ctx.close();}
await b.close();})();
