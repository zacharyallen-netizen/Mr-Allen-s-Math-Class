const {chromium}=require('/home/claude/.npm-global/lib/node_modules/playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:390,height:844}})).newPage();
await p.addInitScript(()=>sessionStorage.setItem('m1ok','1'));await p.route(/fonts\./,r=>r.abort());
await p.goto('file:///home/claude/mr-allen-s-math-class/math1/unit4-practice.html');
for (const step of ['load','reveal']){ if(step==='reveal') await p.evaluate(()=>{M1.revealAll();document.querySelectorAll('.sa-btn').forEach(x=>x.click())});
console.log(step, await p.evaluate(()=>document.documentElement.scrollWidth), await p.evaluate(()=>{const o=[];document.querySelectorAll('body *').forEach(e=>{const r=e.getBoundingClientRect(); if(r.right>391&&r.width>0&&!e.closest('svg')) o.push(e.tagName+'.'+e.className+'#'+e.id+' '+Math.round(r.right)+' '+(e.textContent||'').slice(0,40))}); return o.slice(0,8)}));}
await b.close();})();
