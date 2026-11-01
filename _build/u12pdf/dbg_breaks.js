const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
const G='/home/claude/mr-allen-s-math-class/grade8/';
(async()=>{
 const b=await chromium.launch();
 const variants={none:'', noDirAvoid:'@media print{.directive{break-after:auto!important}}', noSubAvoid:'@media print{.subsec,.directive{break-after:auto!important}}', noBand:'@media print{.band,.subsec,.directive{break-after:auto!important}}'};
 for(const [k,css] of Object.entries(variants)){
  const p=await b.newPage({viewport:{width:1000,height:1200}});
  await p.goto('file://'+G+'Unit1_PreTest_FormB.html'); await p.waitForTimeout(300);
  await p.evaluate(()=>showAnswerKey());
  if(css) await p.addStyleTag({content:css});
  await p.emulateMedia({media:'print'});
  const buf=await p.pdf({path:'/home/claude/mr-allen-s-math-class/_build/u12pdf/dbg_'+k+'.pdf',format:'Letter',printBackground:true,margin:{top:'0.5in',bottom:'0.55in',left:'0.45in',right:'0.45in'}});
  const n=(buf.toString('latin1').match(/\/Type\s*\/Page[^s]/g)||[]).length;
  console.log(k,n); await p.close();
 }
 await b.close();
})();
