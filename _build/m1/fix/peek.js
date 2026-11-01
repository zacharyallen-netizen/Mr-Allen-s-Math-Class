const {chromium}=require('/home/claude/.npm-global/lib/node_modules/playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:1280,height:800}});await ctx.addInitScript(()=>sessionStorage.setItem('m1ok','1'));const pg=await ctx.newPage();
const [page,...ids]=process.argv.slice(2);
await pg.goto('file:///home/claude/mr-allen-s-math-class/math1/'+page+'.html');await pg.waitForTimeout(800);
for(const id of ids){const h=await pg.evaluate(id=>{const e=document.getElementById(id);if(!e)return 'NONE';const c=e.cloneNode(true);c.querySelectorAll('svg').forEach(s=>{s.outerHTML='[SVG texts: '+[...s.querySelectorAll('text')].map(t=>t.textContent).join(' | ')+']';});return c.outerHTML.replace(/\[SVG[^\]]*\]/g,m=>m);},id);console.log(id,':',h.slice(0,2500));}
await b.close();})();
