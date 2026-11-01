const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async()=>{
  const b = await chromium.launch();
  for (const f of ['unit7-notes','unit7-practice','unit8-notes','unit8-practice']){
    const p = await b.newPage({viewport:{width:390,height:844}});
    await p.addInitScript(()=>sessionStorage.setItem('m1ok','1'));
    const errs=[]; p.on('pageerror',e=>errs.push(e.message));
    await p.goto('file:///home/claude/mr-allen-s-math-class/math1/'+f+'.html');
    const r = await p.evaluate(()=>{
      const out=[]; const svgs=[...document.querySelectorAll('svg')].filter(s=>!s.closest('#site-bar'));
      svgs.forEach((s,i)=>{ const vb=s.viewBox.baseVal; s.querySelectorAll('text').forEach(t=>{const bb=t.getBBox(); if(bb.x<vb.x-0.5||bb.y<vb.y-0.5||bb.x+bb.width>vb.x+vb.width+0.5||bb.y+bb.height>vb.y+vb.height+0.5) out.push(i+':'+t.textContent);});});
      return {n:svgs.length, clipped:out, sw:document.documentElement.scrollWidth};
    });
    console.log(f, JSON.stringify(r), errs);
  }
  await b.close();
})();
