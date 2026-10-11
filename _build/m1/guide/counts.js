const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async()=>{ const b=await chromium.launch(); const p=await b.newPage();
 await p.addInitScript(()=>sessionStorage.setItem('m1ok','1'));
 await p.goto('file:///home/claude/mr-allen-s-math-class/math1/nc_math1_study_guide.html'); await p.waitForTimeout(500);
 console.log(await p.evaluate(()=>{ const it=Object.values(ITEMS); return {svgTotal:document.querySelectorAll('svg').length, notesSvg:[...document.querySelectorAll('svg')].filter(s=>!s.closest('.qc')).length, items:it.length, mc:it.filter(i=>i.type==='mc').length, typed:it.filter(i=>i.type==='in').length, err:it.filter(i=>i.type==='err').length, withViz:it.filter(i=>i.v).length, worked:document.querySelectorAll('.example').length, topics:document.querySelectorAll('.topic').length,
  perUnit:[1,2,3,4,5,6,7,8].map(u=>u+':'+[...document.querySelectorAll('#u'+u+' svg')].filter(s=>!s.closest('.qc')).length)}; }));
 await b.close();})();
