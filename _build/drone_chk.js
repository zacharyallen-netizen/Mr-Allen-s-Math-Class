const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:2});
await ctx.route(/fonts\./,r=>r.abort());
await ctx.route('**/drone_shortcut.html', async r=>{const resp=await r.fetch();let t=await resp.text();t=t.replace('let G=null,animId=0;','let G=null,animId=0;Object.defineProperty(window,"G",{get:()=>G});');r.fulfill({response:resp,body:t});});
const pg=await ctx.newPage();const errs=[];pg.on('pageerror',e=>errs.push(e.message));
for(let tries=0;tries<40;tries++){
 await pg.goto('http://localhost:8765/grade8/drone_shortcut.html');
 await pg.locator('button:has-text("Play")').first().click();await pg.click('#goBtn');await pg.waitForTimeout(200);
 const ay=await pg.evaluate(()=>G.A.y); if(ay>1) continue;
 await pg.locator('.offer').first().click();await pg.waitForTimeout(200);
 for(let k=0;k<6;k++){const st=await pg.evaluate(()=>{const P=G.prob;if(G.phase!=='solve')return null;return {i:P.si,ans:P.steps[P.si].ans}});if(!st)break;
  await pg.fill('#in'+st.i,String(Math.round(st.ans*10)/10));await pg.click('[data-act=check][data-i="'+st.i+'"]');await pg.waitForTimeout(100);
  if(st.i==1)await pg.locator('#stage').screenshot({path:'drone_legs.png'});}
 await pg.waitForTimeout(2500);await pg.locator('#stage').screenshot({path:'drone_result.png'});
 console.log('A=',JSON.stringify(await pg.evaluate(()=>G.A)),'tries',tries,'errors',errs);break;}
await b.close()})();
