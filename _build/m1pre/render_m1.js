// PDFs for the Math 1 pre-tests: Letter, same margins as grade 8; answer key = after clicking #reveal.
const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
const M='/home/claude/mr-allen-s-math-class/math1/';
async function render(b, base, out, reveal){
  const page=await b.newPage({viewport:{width:1280,height:900}});
  await page.addInitScript(()=>sessionStorage.setItem('m1ok','1'));
  await page.goto('http://127.0.0.1:8794/math1/'+base+'.html',{waitUntil:'load'}); await page.waitForTimeout(400);
  if(reveal){ await page.click('#reveal'); await page.waitForTimeout(250); }
  await page.emulateMedia({media:'print'});
  await page.pdf({path:M+out,format:'Letter',printBackground:true,margin:{top:'0.5in',bottom:'0.5in',left:'0.45in',right:'0.45in'}});
  await page.close();
}
(async()=>{const b=await chromium.launch();
 for(let n=1;n<=8;n++){const base='M1_Unit'+n+'_PreTest';
  await render(b,base,base+'.pdf',false); await render(b,base,base+'_AnswerKey.pdf',true); console.log('rendered',base);}
 await b.close();})();
