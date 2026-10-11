const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
const fs=require('fs');
(async()=>{const b=await chromium.launch();
for(const f of fs.readdirSync(__dirname+'/head')){const n=f.replace('.html','');
 for(const [dir,useHead] of [['pdf_head',true],['pdf',false]]){
  const p=await b.newPage({viewport:{width:1280,height:900}});
  if(useHead) await p.route('**/grade8/'+f,r=>r.fulfill({status:200,contentType:'text/html; charset=utf-8',body:fs.readFileSync(__dirname+'/head/'+f)}));
  await p.goto('http://127.0.0.1:8793/grade8/'+f,{waitUntil:'load'});await p.waitForTimeout(350);
  await p.emulateMedia({media:'print'});
  await p.pdf({path:__dirname+'/'+dir+'/'+n+'.pdf',format:'Letter',printBackground:true,margin:{top:'0.5in',bottom:'0.5in',left:'0.45in',right:'0.45in'}});
  await p.close();}
}
await b.close();})();
