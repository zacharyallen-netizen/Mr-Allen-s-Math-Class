const {chromium}=require('/home/claude/.npm-global/lib/node_modules/playwright');
const fs=require('fs');const IGN=/fonts\.googleapis|fonts\.gstatic|ERR_TUNNEL|Failed to load resource|AudioContext|net::ERR/;
(async()=>{const b=await chromium.launch();const pages=fs.readdirSync('/home/claude/mr-allen-s-math-class/math1').filter(f=>f.endsWith('.html'));
for(const pg of pages){for(const w of [1280,390]){const ctx=await b.newContext({viewport:{width:w,height:844}});await ctx.addInitScript(()=>sessionStorage.setItem('m1ok','1'));
const p=await ctx.newPage();const e=[];p.on('pageerror',x=>e.push(x.message.slice(0,100)));p.on('console',m=>{if(m.type()==='error'&&!IGN.test(m.text()))e.push(m.text().slice(0,100))});
const t0=Date.now();await p.goto('file:///home/claude/mr-allen-s-math-class/math1/'+pg);await p.waitForTimeout(400);
const r=await p.evaluate(()=>({sw:document.documentElement.scrollWidth,svg:document.querySelectorAll('svg').length,bar:!!document.getElementById('site-bar'),
 clipped:[...document.querySelectorAll('svg text')].filter(t=>{const s=t.ownerSVGElement;if(!s||!t.getClientRects().length)return false;const a=t.getBoundingClientRect(),c=s.getBoundingClientRect();return a.width>0&&(a.left<c.left-2||a.right>c.right+2||a.top<c.top-2||a.bottom>c.bottom+2)}).length}));
if(e.length||r.sw>w||!r.bar||r.clipped)console.log(pg,w,JSON.stringify(r),e);else if(w===1280)console.log('ok',pg,'svgs',r.svg,'load',Date.now()-t0,'ms');await ctx.close()}}
await b.close()})();
