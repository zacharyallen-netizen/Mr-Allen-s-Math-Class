const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async()=>{const b=await chromium.launch();const [url,out,w,full]=process.argv.slice(2);
const p=await b.newPage({viewport:{width:+w||1280,height:900}});await p.addInitScript(()=>sessionStorage.setItem('m1ok','1'));
await p.goto(url,{waitUntil:'load'});await p.waitForTimeout(500);await p.screenshot({path:out,fullPage:full==='1'});await b.close();})();
