const {chromium}=require('/home/claude/.npm-global/lib/node_modules/playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage();
for(const u of ['3','4','5','6','7','8','9']){const errs=[];p.removeAllListeners('pageerror');p.on('pageerror',e=>errs.push(''+e));
await p.goto('file:///home/claude/mr-allen-s-math-class/grade8/Unit'+u+'_PreTest.html');
const r=await p.evaluate(()=>{let bad=[];QS.forEach(q=>{const t=document.createElement('div');t.innerHTML=q.disp;const s=t.textContent;if(!runCheck(q.chk,s))bad.push(q.id+':'+s);});return {n:QS.length,bad};});
console.log('Unit'+u,r.n,'keys self-check fail:',r.bad.join(' | ')||'none',errs.join('|'));}
await b.close();})();
