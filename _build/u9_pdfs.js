// Rebuilds the Unit 9 printable worksheet and answer key from volume_practice.html (same problems, same pictures).
//   node _build/u9_pdfs.js
const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
const G='/home/claude/mr-allen-s-math-class/grade8/';
(async()=>{
  const b=await chromium.launch();
  for(const [mode,out] of [['worksheet','volume_worksheet.pdf'],['key','volume_answer_key.pdf']]){
    const p=await b.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
    await p.goto('file://'+G+'volume_practice.html?print='+mode,{waitUntil:'load'}); await p.waitForTimeout(500);
    await p.emulateMedia({media:'print'});
    await p.pdf({path:G+out,format:'Letter',printBackground:true,margin:{top:'0.5in',bottom:'0.5in',left:'0.5in',right:'0.5in'}});
    console.log(out,errs); await p.close();
  }
  await b.close();
})();
