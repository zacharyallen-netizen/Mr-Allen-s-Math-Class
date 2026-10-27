const {chromium}=require('/home/claude/.npm-global/lib/node_modules/playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:900}});
await p.goto('file:///home/claude/mr-allen-s-math-class/grade8/benchmarks.html');
console.log(await p.evaluate(()=>[...document.querySelectorAll('.unit-card-title,.section-label')].map(e=>e.textContent).join(' | ')));
await p.screenshot({path:'/home/claude/mr-allen-s-math-class/_build/checkin_tutorial/hub.png'});
await p.click('a[href="checkin_tutorial.html"]');console.log(await p.title());await b.close();})();
