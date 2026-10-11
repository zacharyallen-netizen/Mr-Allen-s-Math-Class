const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
const G='/home/claude/mr-allen-s-math-class/grade8/';
async function render(page, src, out, reveal){
  await page.goto('file://'+src,{waitUntil:'load'}); await page.waitForTimeout(350);
  if(reveal){ await page.evaluate(()=>{const r=document.getElementById('reveal'); if(r)r.click();}); await page.waitForTimeout(250); }
  await page.emulateMedia({media:'print'});
  await page.pdf({path:out,format:'Letter',printBackground:true,margin:{top:'0.5in',bottom:'0.5in',left:'0.45in',right:'0.45in'}});
}
(async()=>{
  const b=await chromium.launch();
  const p1=await b.newPage(); await render(p1,G+'Unit9_PreTest.html',G+'Unit9_PreTest.pdf',false); await p1.close();
  const p2=await b.newPage(); await render(p2,G+'Unit9_PreTest.html',G+'Unit9_PreTest_AnswerKey.pdf',true); await p2.close();
  console.log('done'); await b.close();
})();
