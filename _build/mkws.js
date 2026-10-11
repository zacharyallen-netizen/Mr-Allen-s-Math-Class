const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
// args: srcHtml outPdf reveal(0|1) [queryString]
(async()=>{
 const [src,out,rev,qs]=process.argv.slice(2);
 const b=await chromium.launch();
 const p=await b.newPage();
 await p.goto('file://'+src+(qs||''),{waitUntil:'load'});
 await p.waitForTimeout(400);
 if(rev==='1'){
   await p.evaluate(()=>{
     // guided-notes style: reveal .blank and .step
     document.querySelectorAll('.blank').forEach(b=>{
       b.classList.add('revealed');
       const a=b.getAttribute('data-ans'); if(a!==null) b.textContent=a;
     });
     document.querySelectorAll('.step').forEach(s=>s.classList.add('revealed'));
     document.querySelectorAll('.hidden-answer').forEach(s=>s.classList.add('show'));
     document.querySelectorAll('.sa-ans').forEach(s=>s.classList.add('show'));
   });
   await p.waitForTimeout(250);
 }
 await p.emulateMedia({media:'print'});
 await p.pdf({path:out,format:'A4',printBackground:true,scale:0.82,
   margin:{top:'0.4in',bottom:'0.4in',left:'0.35in',right:'0.35in'}});
 await b.close();
 console.log('wrote',out);
})();
