const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async()=>{const b=await chromium.launch();let bad=0;
for(let n=1;n<=8;n++)for(const w of [390,1280]){const p=await b.newPage({viewport:{width:w,height:900}});const errs=[];
p.on('pageerror',e=>errs.push(e.message));
await p.addInitScript(()=>sessionStorage.setItem('m1ok','1'));
await p.goto('http://127.0.0.1:8794/math1/unit'+n+'.html');await p.waitForTimeout(200);
const links=await p.evaluate(()=>[...document.querySelectorAll('a.feature-card')].slice(0,3).map(a=>a.href));
for(const l of links){const r=await p.request.get(l);if(r.status()!==200){bad++;console.log('BROKEN',l,r.status());}}
const hs=await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);if(hs||errs.length){bad++;console.log(n,w,hs,errs);}
if(n===1||n===5)await p.screenshot({path:'shots/hub'+n+'_'+w+'.png',fullPage:true});await p.close();}
console.log(bad?'hub problems '+bad:'hubs OK');await b.close();})();
