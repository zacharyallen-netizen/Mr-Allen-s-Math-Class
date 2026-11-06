const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async()=>{const b=await chromium.launch();
for (const [f,w] of [['graphing.html',1280],['unit6-notes.html',390],['trendline_lab.html',1280],['unit8-notes.html',390],['unit6-practice-tables.html',1280],['unit8-practice-1.html',390]]){
 const p=await b.newPage({viewport:{width:w,height:800}}); await p.route(/fonts\./,r=>r.abort());
 await p.goto('http://localhost:8792/grade8/'+f); await p.waitForTimeout(300);
 if(f==='unit6-notes-slope.html') await p.evaluate(()=>goSection(4));
 const bb=await (await p.$('#scoresend')).boundingBox();
 await p.screenshot({path:'../ctx_'+f.replace('.html','')+'.png',fullPage:true,clip:{x:0,y:Math.max(0,bb.y-400),width:w,height:bb.height+600}});
 await p.close();}
await b.close();})();
