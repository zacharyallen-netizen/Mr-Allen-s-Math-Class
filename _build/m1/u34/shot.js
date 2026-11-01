// usage: node shot.js page.html [width] [outprefix]
const {chromium}=require('/home/claude/.npm-global/lib/node_modules/playwright');
(async()=>{
 const [page_,w,pre]=[process.argv[2],+(process.argv[3]||390),process.argv[4]||'s'];
 const b=await chromium.launch(); const ctx=await b.newContext({viewport:{width:w,height:844}});
 const p=await ctx.newPage(); const errs=[];
 p.on('pageerror',e=>errs.push('PAGEERR '+e.message)); p.on('console',m=>{if(m.type()==='error'&&!/fonts\.googleapis|fonts\.gstatic|ERR_TUNNEL|Failed to load resource|AudioContext|net::ERR/.test(m.text()))errs.push('CONSOLE '+m.text())});
 await p.addInitScript(()=>sessionStorage.setItem('m1ok','1'));
 await p.route(/fonts\.(googleapis|gstatic)/,r=>r.abort());
 await p.goto('file:///home/claude/mr-allen-s-math-class/math1/'+page_); await p.waitForTimeout(300);
 const info=await p.evaluate(()=>{
   const out={scroll:document.documentElement.scrollWidth>window.innerWidth, sw:document.documentElement.scrollWidth, clipped:[], svgs:document.querySelectorAll('svg').length};
   document.querySelectorAll('svg').forEach((svg,i)=>{ const vb=svg.viewBox.baseVal; if(!vb||!vb.width) return;
     svg.querySelectorAll('text').forEach(t=>{ if(!t.textContent.trim())return; const bb=t.getBBox(); let x=bb.x,y=bb.y; const tr=t.closest('g[transform]'); if(tr) return;
       if(x<-0.5||y<-0.5||x+bb.width>vb.width+0.5||y+bb.height>vb.height+0.5) out.clipped.push((svg.closest('[data-v]')||svg.parentElement).getAttribute('data-v')+' :: '+t.textContent+' '+[x,y,bb.width,bb.height].map(v=>Math.round(v)).join(','));});});
   return out;});
 console.log(JSON.stringify(info,null,1)); console.log(errs.join('\n'));
 const sections=await p.$$('section.topic');
 for(let i=0;i<sections.length;i++){ await sections[i].screenshot({path:`${__dirname}/shots/${pre}-${w}-${i+1}.png`}); }
 await b.close();
})();
