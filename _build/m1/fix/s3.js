const {chromium}=require('/home/claude/.npm-global/lib/node_modules/playwright');
(async()=>{const b=await chromium.launch();
for(const W of [390,1280]){const ctx=await b.newContext({viewport:{width:W,height:844}});await ctx.addInitScript(()=>sessionStorage.setItem('m1ok','1'));const pg=await ctx.newPage();
await pg.goto('file:///home/claude/mr-allen-s-math-class/math1/unit8-notes.html');await pg.waitForTimeout(800);
const n=await pg.$$eval('[data-w="seg"]',es=>es.map(e=>e.getAttribute('data-mode')||e.outerHTML.slice(0,160)));console.log(n);
const es=await pg.$$('[data-w="seg"]');let i=0;for(const e of es){await e.scrollIntoViewIfNeeded();await e.screenshot({path:__dirname+'/shots/u8n_'+W+'_seg'+(i++)+'.png'});}
await ctx.close();}
await b.close();})();
