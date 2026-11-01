const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async()=>{const b=await chromium.launch();
for(const f of ['unit7-notes','unit7-practice','unit8-notes','unit8-practice']){
 const p=await b.newPage(); await p.addInitScript(()=>sessionStorage.setItem('m1ok','1'));
 await p.goto('file:///home/claude/mr-allen-s-math-class/math1/'+f+'.html');
 const r=await p.evaluate(()=>{const W=document.querySelector('.page-wrap');
  const vis=W.querySelectorAll('.viz').length; const svgs=W.querySelectorAll('svg').length; const widgets=W.querySelectorAll('.widget').length;
  const items=[...W.querySelectorAll('.qcard,.mc,.task,.sa')];
  const withPre=items.filter(c=>{const clone=c.cloneNode(true);clone.querySelectorAll('.after').forEach(a=>a.remove());return clone.querySelector('svg,table,.widget');}).length;
  const withAny=items.filter(c=>c.querySelector('svg,table,.widget,.after svg')).length;
  const ex=W.querySelectorAll('.example').length, mis=W.querySelectorAll('.mistake').length;
  const topics=[...W.querySelectorAll('section.topic')].map(s=>s.querySelectorAll('svg, table.vt, .flow').length);
  return {vis,svgs,widgets,items:items.length,withPre,withAny,ex,mis,topics};});
 console.log(f, JSON.stringify(r)); await p.close();}
await b.close();})();
