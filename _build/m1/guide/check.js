const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
const IGN=/fonts\.googleapis|fonts\.gstatic|ERR_TUNNEL|Failed to load resource|AudioContext|net::ERR/;
(async()=>{
  const b = await chromium.launch();
  for (const w of [390,1280]) {
    const p = await b.newPage({viewport:{width:w,height:w===390?844:800}});
    const errs=[]; p.on('pageerror',e=>errs.push('PAGEERR '+e.message)); p.on('console',m=>{ if(m.type()==='error' && !IGN.test(m.text())) errs.push('CONSOLE '+m.text()); });
    await p.addInitScript(()=>sessionStorage.setItem('m1ok','1'));
    await p.goto('file:///home/claude/mr-allen-s-math-class/math1/nc_math1_study_guide.html');
    await p.waitForTimeout(800);
    const r = await p.evaluate(()=>{
      const out={svgs:document.querySelectorAll('svg').length, sw:document.documentElement.scrollWidth, cw:document.documentElement.clientWidth, clip:[], wide:[]};
      document.querySelectorAll('svg').forEach((s,si)=>{
        const vb=s.viewBox.baseVal; if(!vb) return;
        s.querySelectorAll('text').forEach(t=>{ const bb=t.getBBox(); if(!t.textContent.trim()) return;
          if (bb.x<-0.5||bb.y<-0.5||bb.x+bb.width>vb.width+0.5||bb.y+bb.height>vb.height+0.5){
            const host=s.closest('.qc,figure,[id]'); out.clip.push((host?(host.id||host.getAttribute('data-v')||host.className):'?')+' "'+t.textContent+'" '+[bb.x,bb.y,bb.width,bb.height].map(v=>v.toFixed(0)).join(',')+' vb '+vb.width+'x'+vb.height);} });
      });
      document.querySelectorAll('body *').forEach(e=>{ const r=e.getBoundingClientRect(); if (r.right>document.documentElement.clientWidth+1 && getComputedStyle(e).position!=='fixed' && r.width>0) out.wide.push(e.tagName+'.'+e.className+' '+r.right.toFixed(0)); });
      out.wide=out.wide.slice(0,10);
      out.items=document.querySelectorAll('.qc').length; out.itemsViz=document.querySelectorAll('.qc .qv svg').length;
      out.total=document.getElementById('totalMax').textContent;
      return out;});
    console.log(w, 'svgs',r.svgs,'scroll',r.sw,'/',r.cw,'items',r.items,'withViz',r.itemsViz,'total',r.total);
    console.log(' clipped:', r.clip.length); r.clip.slice(0,60).forEach(c=>console.log('   ',c));
    console.log(' wide:', r.wide);
    console.log(' errors:', errs);
    await p.close();
  }
  await b.close();
})();
