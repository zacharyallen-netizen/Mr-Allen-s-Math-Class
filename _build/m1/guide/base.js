const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async()=>{
  const b = await chromium.launch();
  for (const w of [390,1280]) {
    const p = await b.newPage({viewport:{width:w,height:844}});
    const errs=[]; p.on('pageerror',e=>errs.push(e.message));
    await p.addInitScript(()=>sessionStorage.setItem('m1ok','1'));
    await p.goto('file:///home/claude/mr-allen-s-math-class/math1/nc_math1_study_guide.html');
    await p.waitForTimeout(500);
    const r = await p.evaluate(()=>{
      const out={svgs:document.querySelectorAll('svg').length, sw:document.documentElement.scrollWidth, cw:document.documentElement.clientWidth, bad:[]};
      document.querySelectorAll('.qc').forEach(q=>{
        const btn=q.querySelector('.ob'); const m=btn.getAttribute('onclick').match(/mc\(this,'[^']+','([^']+)'/);
        const corr=m[1]; const tmp=document.createElement('div'); tmp.innerHTML=corr; const c=tmp.textContent;
        const hit=[...q.querySelectorAll('.ob')].filter(b=>b.textContent.trim()===c.trim());
        if(hit.length!==1) out.bad.push(q.id+' matches='+hit.length+' key='+c);
      });
      return out;});
    console.log(w, JSON.stringify(r), errs);
    await p.close();
  }
  await b.close();
})();
