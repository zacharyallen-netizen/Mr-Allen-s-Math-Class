const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async()=>{const b=await chromium.launch();
for (const [f,w] of [['graphing.html',1280],['Unit_6_Functions_Guided_Notes.html',390],['trendline_lab.html',1280],['transformations-guided-notes.html',390],['tables_linear_functions.html',1280],['unit8_practice1.html',390]]){
 const p=await b.newPage({viewport:{width:w,height:800}}); await p.route(/fonts\./,r=>r.abort());
 await p.goto('http://localhost:8792/grade8/'+f); await p.waitForTimeout(300);
 if(f==='slope_guided_notes.html') await p.evaluate(()=>goSection(4));
 const bb=await (await p.$('#scoresend')).boundingBox();
 await p.screenshot({path:'../ctx_'+f.replace('.html','')+'.png',fullPage:true,clip:{x:0,y:Math.max(0,bb.y-400),width:w,height:bb.height+600}});
 await p.close();}
await b.close();})();
