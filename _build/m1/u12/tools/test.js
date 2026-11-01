const {chromium}=require('/home/claude/.npm-global/lib/node_modules/playwright');
(async()=>{const pg=process.argv[2];const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:390,height:844},hasTouch:true});
const p=await ctx.newPage();const errs=[];const IGN=/fonts\.googleapis|fonts\.gstatic|ERR_TUNNEL|Failed to load resource|AudioContext|net::ERR/;
p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error'&&!IGN.test(m.text()))errs.push(m.text());});
await p.addInitScript(()=>sessionStorage.setItem('m1ok','1'));await p.goto('http://localhost:8812/math1/'+pg+'.html');await p.waitForTimeout(300);
// 1) grader variants
const res=await p.evaluate(()=>{const out=[],fail=[];const M=M1,Q=M.Q;
 const REV={'<':'>','<=':'>=','>':'<','>=':'<='},SYM={'<=':'≤','>=':'≥','<':'<','>':'>'};
 function fmM(n){return String(n).replace('-','−');}
 Object.keys(Q).forEach(id=>{const c=Q[id],T=c.type||c.kind;let right=[],wrong=[];
  if(T==='num'){const a=c.ans;right=[String(a),'x='+a,' '+fmM(a)+' '];if(Number.isInteger(a))right.push(a+'.0');else right.push(String(+a.toFixed(6)));
     if(c.alt) right=right.concat(c.alt);(c.wrong||[]).forEach(w=>wrong.push([String(+w[0].toFixed(6)),w[1]]));}
  else if(T==='expr'){right=[c.ans,(c.v||'q')+'='+c.ans].concat(c.alt||[]);(c.wrong||[]).forEach(w=>wrong.push([w[0],w[1]]));}
  else if(T==='ineq'){right=['x'+c.op+c.v,c.v+REV[c.op]+'x','x '+SYM[c.op]+' '+fmM(c.v)];
     right.push(c.op[0]==='>'?(c.op==='>='?'[':'(')+c.v+', ∞)':'(-∞, '+c.v+(c.op==='<='?']':')'));
     wrong.push(['x'+REV[c.op]+c.v,null]);(c.wrong||[]).forEach(w=>wrong.push(['x'+w[1]+w[0],w[2]]));}
  else if(T==='range'){const v=c.vr||'x';right=[c.lo+(c.il?'<=':'<')+v+(c.ih?'<=':'<')+c.hi,(c.il?'[':'(')+c.lo+','+c.hi+(c.ih?']':')'),fmM(c.lo)+' ≤ '+v+' ≤ '+fmM(c.hi)].slice(0,c.il&&c.ih?3:2);
     (c.wrong||[]).forEach(w=>wrong.push([w[0]+'<='+v+'<='+w[1],w[2]]));}
  else if(T==='point'){right=['('+c.ans[0]+','+c.ans[1]+')',c.ans[0]+', '+c.ans[1],'( '+fmM(c.ans[0])+' , '+fmM(c.ans[1])+' )'];if(c.ans[0]!==c.ans[1])wrong.push(['('+c.ans[1]+','+c.ans[0]+')',null]);}
  else if(T==='text'){right=c.ans.slice();(c.wrong||[]).forEach(w=>wrong.push([w[0],w[1]]));}
  else return;
  right.forEach(r=>{const g=M.grade(c,r);out.push(id);if(!g.ok)fail.push(id+' RIGHT rejected: '+r+' -> '+g.msg);});
  wrong.forEach(w=>{const g=M.grade(c,w[0]);if(g.ok)fail.push(id+' WRONG accepted: '+w[0]);else if(w[1]&&g.msg!==w[1])fail.push(id+' wrong msg mismatch for '+w[0]+': got '+g.msg);});
  // garbage
  const g=M.grade(c,'banana');if(g.ok)fail.push(id+' accepted garbage');
 });return {n:out.length,fail};});
console.log(pg,'grader variants checked',res.n);res.fail.forEach(f=>console.log('  FAIL',f));
// 2) UI: per item click flows
const ids=await p.evaluate(()=>Object.keys(M1.Q).map(k=>[k,M1.Q[k].type||M1.Q[k].kind]));let ui=[];
for(const [id,T] of ids){
 if(['num','expr','ineq','range','point','text'].includes(T)){
   const info=await p.evaluate(id=>{const c=M1.Q[id];const T=c.type||c.kind;
     const right=T==='num'?String(c.ans).replace('-','−'):T==='expr'?c.ans:T==='ineq'?'x'+c.op+c.v:T==='range'?(c.il?'[':'(')+c.lo+','+c.hi+(c.ih?']':')'):T==='point'?'('+c.ans+')':c.ans[0];
     return {right,wrong:'987654'};},id);
   const inp=p.locator('#'+id+'-in');if(!await inp.count()){ui.push(id+' no input');continue;}
   await inp.fill(info.wrong);await inp.press('Enter');let fb=await p.locator('#fb-'+id).getAttribute('class');if(!/ x/.test(fb))ui.push(id+' wrong not flagged '+fb);
   await inp.fill(info.right);await p.locator('#'+id+' .go').click();fb=await p.locator('#fb-'+id).getAttribute('class');if(!/ c/.test(fb))ui.push(id+' right not accepted: '+await p.locator('#fb-'+id).textContent());
   const sh=await p.locator('#'+id+'-s').getAttribute('class').catch(()=>null);if(sh!==null&&!/show/.test(sh))ui.push(id+' solution not shown');
 } else if(T==='mc'){
   const ans=await p.evaluate(id=>M1.Q[id].ans,id);const btns=p.locator('#'+id+' .chk-btn');const n=await btns.count();
   for(let i=0;i<n;i++){const v=await btns.nth(i).getAttribute('data-v');if(v!==ans){await btns.nth(i).click();const t=await p.locator('#fb-'+id).textContent();const cl=await p.locator('#fb-'+id).getAttribute('class');if(!/ x/.test(cl)||t.startsWith('✓'))ui.push(id+' wrong MC not flagged');break;}}
   await p.locator('#'+id+' .chk-btn[data-v="'+ans+'"]').click();const cl=await p.locator('#fb-'+id).getAttribute('class');if(!/ c/.test(cl))ui.push(id+' right MC not ok');
 } else if(T==='pick'){
   const ans=await p.evaluate(id=>M1.Q[id].ans,id);const L=p.locator('#'+id+' .wk-line');const n=await L.count();
   for(let i=0;i<n;i++){if(i!==ans){await L.nth(i).click();const cl=await p.locator('#fb-'+id).getAttribute('class');if(!/ x/.test(cl))ui.push(id+' wrong pick not flagged');break;}}
   await L.nth(ans).click();const cl=await p.locator('#fb-'+id).getAttribute('class');if(!/ c/.test(cl))ui.push(id+' right pick not ok');
 }}
const score=await p.locator('#score').textContent().catch(()=>'(no score box)');
console.log(pg,'UI items',ids.length,'score',score);ui.forEach(u=>console.log('  UI',u));errs.forEach(e=>console.log('  ERR',e));
await b.close();})();
