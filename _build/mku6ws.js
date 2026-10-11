const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
const SRC='file:///home/claude/mr-allen-s-math-class/_build/u6_fillin.html';
const OUT='/home/claude/mr-allen-s-math-class/grade8/Unit_6_Tables_And_Systems_FillIn.pdf';
const HEAD=`<div style="width:100%;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;
  font-size:7.4px;color:#1E2D4F;padding:0 0.6in;box-sizing:border-box;">
  <div style="display:flex;justify-content:space-between;align-items:flex-end;
       border-bottom:1.6px solid #C8A951;padding-bottom:3px;">
    <span style="font-weight:700;letter-spacing:.04em;text-transform:uppercase;">Tables &amp; Systems of Equations · Guided Notes</span>
    <span style="font-style:italic;color:#5D6673;">IC Imagine · 8th Grade Math · Unit 6</span>
  </div></div>`;
const FOOT=`<div style="width:100%;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;
  font-size:7.4px;color:#5D6673;padding:0 0.6in;box-sizing:border-box;">
  <div style="border-top:1.3px solid #C8A951;padding-top:3px;text-align:center;">
    Page <span class="pageNumber"></span></div></div>`;
(async()=>{
 const b=await chromium.launch();
 const p=await b.newPage();
 await p.goto(SRC,{waitUntil:'load'}); await p.waitForTimeout(400);
 await p.emulateMedia({media:'print'});
 await p.pdf({path:OUT,format:'Letter',printBackground:true,
   displayHeaderFooter:true,headerTemplate:HEAD,footerTemplate:FOOT,
   margin:{top:'0.72in',bottom:'0.6in',left:'0.6in',right:'0.6in'}});
 await b.close();
 console.log('wrote',OUT);
})();
