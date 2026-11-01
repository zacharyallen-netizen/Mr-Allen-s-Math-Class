const {chromium}=require('/home/claude/.npm-global/lib/node_modules/playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:390,height:844}})).newPage();
await p.addInitScript(()=>sessionStorage.setItem('m1ok','1'));await p.route(/fonts\./,r=>r.abort());
await p.goto('file:///home/claude/mr-allen-s-math-class/math1/unit4-practice.html');
await p.evaluate(()=>{M1.revealAll();document.querySelectorAll('.sa-btn').forEach(x=>x.click())});
console.log(await p.evaluate(()=>{const o=[];const base=document.documentElement.scrollWidth;
 document.querySelectorAll('.viz,.chk-fb,.sa-ans,.chk,.sa,.fix').forEach(e=>{const d=e.style.display;e.style.display='none';const s=document.documentElement.scrollWidth;e.style.display=d;if(s<base)o.push((e.getAttribute('data-v')||e.id||e.className)+' '+s)});return [base,o]}));
await b.close();})();
