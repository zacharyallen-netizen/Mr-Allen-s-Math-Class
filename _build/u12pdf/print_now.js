const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
const G='/home/claude/mr-allen-s-math-class/grade8/';
const out=process.argv[2];
(async()=>{
  const b=await chromium.launch();
  for(const base of ['Unit1_PreTest','Unit1_PreTest_FormB','Unit_2_Pretest']){
    const p=await b.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
    await p.goto('file://'+G+base+'.html',{waitUntil:'load'}); await p.waitForTimeout(400);
    await p.emulateMedia({media:'print'});
    await p.pdf({path:out+'/'+base+'.pdf',format:'Letter',printBackground:true,margin:{top:'0.5in',bottom:'0.5in',left:'0.45in',right:'0.45in'}});
    console.log(base,errs); await p.close();
  }
  await b.close();
})();
