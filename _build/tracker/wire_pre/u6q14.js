const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage();await p.goto('http://127.0.0.1:8793/grade8/unit6-pretest.html');
console.log(await p.evaluate(()=>[runCheck(['linear',-4,-1],'-4x-1'),runCheck(['linear',-4,-1],'y = −4x − 1')]));await b.close();})();
