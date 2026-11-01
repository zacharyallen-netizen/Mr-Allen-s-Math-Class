// usage: node shoot.js page [width] [--sections] [--reveal]
const {chromium}=require('/home/claude/.npm-global/lib/node_modules/playwright');
const OUT='/home/claude/mr-allen-s-math-class/_build/m1/u12/shots/';
(async()=>{
 const page_=process.argv[2], widths=process.argv[3]?[+process.argv[3]]:[390,1280];
 const sections=process.argv.includes('--sections'), reveal=process.argv.includes('--reveal');
 const b=await chromium.launch();
 for(const w of widths){
  const ctx=await b.newContext({viewport:{width:w,height:w<500?844:800}});
  const p=await ctx.newPage(); const errs=[];
  const IGN=/fonts\.googleapis|fonts\.gstatic|ERR_TUNNEL|Failed to load resource|AudioContext|net::ERR/;
  p.on('pageerror',e=>errs.push('PAGEERR '+e.message)); p.on('console',m=>{if(m.type()==='error'&&!IGN.test(m.text())) errs.push('CONSOLE '+m.text());});
  await p.addInitScript(()=>sessionStorage.setItem('m1ok','1'));
  await p.goto('http://localhost:8812/math1/'+page_+'.html',{waitUntil:'load'}); await p.waitForTimeout(400);
  if(reveal) await p.evaluate(()=>{document.querySelectorAll('.sa-ans').forEach(a=>a.classList.add('show'));});
  const info=await p.evaluate(()=>{
    const r={hscroll:document.documentElement.scrollWidth-window.innerWidth,svgs:document.querySelectorAll('svg').length,clip:[]};
    document.querySelectorAll('svg').forEach((s,si)=>{ if(s.closest('#site-bar')) return; const vb=s.viewBox.baseVal; if(!vb||!vb.width) return;
      if(!s.getBoundingClientRect().width) return;
      s.querySelectorAll('text').forEach(t=>{const bb=t.getBBox(); let x=bb.x,y=bb.y,x2=bb.x+bb.width,y2=bb.y+bb.height;
        const tr=t.getAttribute('transform'); if(tr&&/rotate/.test(tr)){const cx=+t.getAttribute('x'),cy=+t.getAttribute('y');const w=bb.width;x=cx-bb.height;x2=cx+2;y=cy-w/2;y2=cy+w/2;}
        if(x<-0.5||y<-0.5||x2>vb.width+0.5||y2>vb.height+0.5) r.clip.push((s.closest('[id]')||{}).id+': "'+t.textContent+'" '+[x,y,x2,y2].map(v=>v.toFixed(1)).join(',')+' vb '+vb.width+'x'+vb.height);});});
    return r;});
  console.log(page_,w,'hscroll',info.hscroll,'svgs',info.svgs,'clipped',info.clip.length); info.clip.slice(0,30).forEach(c=>console.log('  CLIP',c));
  errs.forEach(e=>console.log('  ',e));
  if(sections){const n=await p.locator('section.topic').count();
    for(let i=0;i<n;i++){const el=p.locator('section.topic').nth(i);await el.screenshot({path:OUT+page_+'-'+w+'-s'+i+(reveal?'r':'')+'.png'});}}
  else await p.screenshot({path:OUT+page_+'-'+w+'.png',fullPage:true});
  await ctx.close();}
 await b.close();})();
