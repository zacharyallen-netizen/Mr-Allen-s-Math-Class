const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage();await p.route(/fonts\./,r=>r.abort());
await p.goto('http://127.0.0.1:8731/grade8/unit2-notes-exponents.html');
console.log(await p.$$eval('#chk21a .chk-btn',bs=>bs.map(b=>JSON.stringify(b.textContent)+' '+b.offsetParent)));
await b.close();})();
