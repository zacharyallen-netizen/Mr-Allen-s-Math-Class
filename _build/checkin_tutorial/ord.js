const {chromium}=require('/home/claude/.npm-global/lib/node_modules/playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage();
await p.goto('file:///home/claude/mr-allen-s-math-class/grade8/checkin_tutorial.html');
console.log(await p.evaluate(()=>[...document.querySelectorAll('h2,.q .qn')].map(e=>e.textContent.replace(/(MULTIPLE|NUMERIC|SELECT|FIND).*/i,'')).join(' | ')));await b.close();})();
