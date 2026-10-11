const {chromium}=require('/home/claude/.npm-global/lib/node_modules/playwright');
(async()=>{const b=await chromium.launch();const out={};
for(const pg of ['unit5-notes.html','unit5-practice.html','unit6-notes.html','unit6-practice.html']){const p=await b.newPage();await p.addInitScript(()=>sessionStorage.setItem('m1ok','1'));await p.goto('http://localhost:8756/math1/'+pg);await p.waitForTimeout(400);
 out[pg]=await p.evaluate(()=>{const r={};Object.keys(M.SPEC).forEach(id=>{const s=M.SPEC[id];if(s.type==='multi'){s.parts.forEach(q=>r[id+'.'+q.k]=q.ans);}else{const a=typeof s.ans==='function'?s.ans():s.ans;r[id]=(s.type==='poly'||s.type==='factor')?M.pstr(a):a;}});return r;});await p.close();}
require('fs').writeFileSync(__dirname+'/keys.json',JSON.stringify(out,null,1));await b.close();})();
