const {chromium}=require('/home/claude/.npm-global/lib/node_modules/playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage();await p.addInitScript(()=>sessionStorage.setItem('m1ok','1'));
for(const pg of ['unit1-notes','unit1-practice','unit2-notes','unit2-practice']){await p.goto('http://localhost:8812/math1/'+pg+'.html');
 const r=await p.evaluate(()=>{const Q=M1.Q,ids=Object.keys(Q);const vis=ids.filter(i=>Q[i].pre||Q[i].kind==='lab');
  return {items:ids.length,withPreVisual:vis.length,withPostVisual:ids.filter(i=>Q[i].post).length,pick:ids.filter(i=>Q[i].kind==='pick').length,
   examples:document.querySelectorAll('.example').length,labs:document.querySelectorAll('.lab').length,svgs:document.querySelectorAll('svg').length,howto:document.querySelectorAll('ol.howto').length,
   topics:[...document.querySelectorAll('section.topic')].map(s=>s.querySelectorAll('svg').length).join('/')};});
 console.log(pg,JSON.stringify(r));}
await b.close();})();
