const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:900}});
await p.addInitScript(()=>sessionStorage.setItem('m1ok','1'));
await p.goto('http://127.0.0.1:8794/math1/M1_Unit3_PreTest.html');
console.log(await p.evaluate(()=>[...document.querySelectorAll('.dia svg')].slice(0,3).map(s=>[s.getAttribute('width'),s.getAttribute('height'),s.getBoundingClientRect().width,s.getBoundingClientRect().height, getComputedStyle(s).maxWidth])));
await b.close();})();
