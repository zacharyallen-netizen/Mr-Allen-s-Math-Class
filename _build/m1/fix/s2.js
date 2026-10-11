const {chromium}=require('/home/claude/.npm-global/lib/node_modules/playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:390,height:844}});await ctx.addInitScript(()=>sessionStorage.setItem('m1ok','1'));const pg=await ctx.newPage();
await pg.goto('file:///home/claude/mr-allen-s-math-class/math1/unit4-practice.html');await pg.waitForTimeout(800);
const e=await pg.$('[data-v="dg2"]');await e.scrollIntoViewIfNeeded();await e.screenshot({path:__dirname+'/shots/u4p_390_dg2_before.png'});await b.close();})();
