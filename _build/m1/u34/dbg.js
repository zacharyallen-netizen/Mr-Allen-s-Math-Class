const {chromium}=require('/home/claude/.npm-global/lib/node_modules/playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:390,height:844}})).newPage();
await p.addInitScript(()=>sessionStorage.setItem('m1ok','1'));await p.route(/fonts\./,r=>r.abort());
await p.goto('file:///home/claude/mr-allen-s-math-class/math1/unit3-practice.html');
await p.fill('#b3-in','(5,6)'); await p.click('#b3 .val-chk button');
console.log(await p.$eval('#fb-b3',e=>e.className+'|'+e.textContent));
console.log(await p.evaluate(()=>M1.judge(M1.S.items.b3,'(5,6)')));
const bb=await p.$eval('#b3 .val-chk button',e=>{const r=e.getBoundingClientRect();const el=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);return el.outerHTML.slice(0,120)});console.log(bb);
await b.close();})();
