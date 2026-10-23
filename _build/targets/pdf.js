const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage();await p.goto('file:///home/claude/work/out/condensed.html');
await p.pdf({path:'/home/claude/work/out/Student I Can Tracker - Standards Only.pdf',format:'Letter',printBackground:true,preferCSSPageSize:true,
displayHeaderFooter:true,headerTemplate:'<span></span>',footerTemplate:'<div style="font-size:7px;color:#888;width:100%;padding:0 0.5in;display:flex;justify-content:space-between"><span>Mr. Allen\'s Math Class · 8th Grade Standards Tracker</span><span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span></div>'});
await b.close();})();
