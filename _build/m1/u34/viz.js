// node viz.js page.html prefix [done]  -> per-viz screenshots montaged
const {chromium}=require('/home/claude/.npm-global/lib/node_modules/playwright');
const {execSync}=require('child_process');
(async()=>{
 const [pg,pre,done]=process.argv.slice(2);
 const b=await chromium.launch(); const p=await (await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:1})).newPage();
 await p.addInitScript(()=>sessionStorage.setItem('m1ok','1')); await p.route(/fonts\.(googleapis|gstatic)/,r=>r.abort());
 await p.goto('file:///home/claude/mr-allen-s-math-class/math1/'+pg); await p.waitForTimeout(200);
 if(done) await p.evaluate(()=>{ if(window.revealPage) revealPage(); else { M1.revealAll(); } document.querySelectorAll('.hide').forEach(e=>e.classList.remove('hide')); });
 const els=await p.$$('.viz');
 const dir=__dirname+'/shots/'+pre; execSync('rm -rf '+dir+'; mkdir -p '+dir);
 let n=0; for(const e of els){ const bb=await e.boundingBox(); if(!bb||bb.height<5||!(await e.isVisible())) continue; const name=await e.evaluate(x=>x.getAttribute('data-v')||x.id); await e.screenshot({path:`${dir}/${String(n++).padStart(2,'0')}_${name}.png`}); }
 await b.close();
 execSync(`python3 ${__dirname}/montage.py ${dir}`,{stdio:'inherit'});
})();
