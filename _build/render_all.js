const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
const G='/home/claude/mr-allen-s-math-class/grade8/';
// [htmlBase, outTestPdf, outKeyPdf]
const jobs = [
 ['Unit_2_Pretest','Unit2_PreTest_ExponentRules','Unit2_PreTest_ExponentRules_AnswerKey'],
 ['Unit2_PreTest_ScientificNotation','Unit2_PreTest_ScientificNotation','Unit2_PreTest_ScientificNotation_AnswerKey'],
 ['Unit3_PreTest','Unit3_PreTest','Unit3_PreTest_AnswerKey'],
 ['Unit4_PreTest','Unit4_PreTest','Unit4_PreTest_AnswerKey'],
 ['Unit5_PreTest','Unit5_PreTest','Unit5_PreTest_AnswerKey'],
 ['Unit6_PreTest','Unit6_PreTest','Unit6_PreTest_AnswerKey'],
 ['Unit7_PreTest','Unit7_PreTest','Unit7_PreTest_AnswerKey'],
 ['Unit8_PreTest','Unit8_PreTest','Unit8_PreTest_AnswerKey'],
 ['Unit9_PreTest','Unit9_PreTest','Unit9_PreTest_AnswerKey'],
];
async function render(page, src, out, reveal){
  await page.goto('file://'+src,{waitUntil:'load'}); await page.waitForTimeout(350);
  if(reveal){ await page.evaluate(()=>{const r=document.getElementById('reveal'); if(r)r.click();}); await page.waitForTimeout(250); }
  await page.emulateMedia({media:'print'});
  await page.pdf({path:out,format:'Letter',printBackground:true,margin:{top:'0.5in',bottom:'0.5in',left:'0.45in',right:'0.45in'}});
}
(async()=>{
  const b=await chromium.launch();
  for(const [base,t,k] of jobs){
    const p1=await b.newPage(); await render(p1,G+base+'.html',G+t+'.pdf',false); await p1.close();
    const p2=await b.newPage(); await render(p2,G+base+'.html',G+k+'.pdf',true); await p2.close();
    console.log('rendered',t+'.pdf','+',k+'.pdf');
  }
  await b.close();
})();
