// usage: node shoot.js <file.html> <outprefix> [widths]
const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async()=>{const b=await chromium.launch();const [f,out,ws]=process.argv.slice(2);
for(const w of (ws||'1280,390').split(',').map(Number)){
const p=await b.newPage({viewport:{width:w,height:900}});const errs=[];
p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error'&&!/fonts|ERR_|Failed to load/.test(m.text()))errs.push(m.text())});
await p.addInitScript(()=>sessionStorage.setItem('m1ok','1'));
await p.goto('http://127.0.0.1:8794/math1/'+f,{waitUntil:'load'});await p.waitForTimeout(400);
await p.screenshot({path:out+'_'+w+'.png',fullPage:true});
console.log(w,'errs',errs, 'hscroll', await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1));
await p.close();}
await b.close();})();
