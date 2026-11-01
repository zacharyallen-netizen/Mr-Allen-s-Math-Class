const {chromium}=require('/home/claude/.npm-global/lib/node_modules/playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:900}});
await p.goto('file:///home/claude/mr-allen-s-math-class/grade8/checkin_tutorial.html');
console.log(await p.evaluate(()=>[document.body.scrollWidth, ...[...document.querySelectorAll('.wrap,.wrap > *,.card,.tablewrap')].map(e=>e.className+':'+e.scrollWidth+'/'+e.clientWidth)].join(' | ')));console.log(await p.evaluate(()=>[...document.querySelectorAll('body *')].filter(e=>e.getBoundingClientRect().right>392).slice(0,8).map(e=>e.tagName+'.'+e.className+' '+Math.round(e.getBoundingClientRect().right)+' '+(e.textContent||'').slice(0,40)).join('\n')));await b.close();})();
