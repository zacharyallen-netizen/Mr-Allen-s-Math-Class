const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
const D='file:///home/claude/mr-allen-s-math-class/grade8/Fluency-Lab-Package/fluency-lab/';
const PRAC=['add-subtract','multiply','divide','fractions','decimals','integers','ratios','expressions'];
const NOISE=/fonts\.googleapis|fonts\.gstatic|ERR_TUNNEL|Failed to load resource/;
(async()=>{
 const b=await chromium.launch();
 let bad=0;
 // ---- practice pages: start a set and solve 3 problems correctly ----
 for(const m of PRAC){
  const p=await b.newPage({viewport:{width:430,height:900}});
  const errs=[];
  p.on('console',x=>{if(x.type()==='error'&&!NOISE.test(x.text()))errs.push(x.text());});
  p.on('pageerror',e=>errs.push('PE '+e.message));
  await p.goto(D+'fluency-lab-'+m+'.html'); await p.waitForTimeout(300);
  await p.click('button.btn');            // Start a set of 10
  await p.waitForTimeout(250);
  let solved=0;
  for(let n=0;n<40 && solved<3;n++){
    const st=await p.evaluate(()=>{
      const g=(typeof G!=='undefined'&&G&&G.steps)?G:null;
      const fw=document.getElementById('factwrap');
      const factMode=fw && !fw.classList.contains('hide') && !fw.closest('.hide');
      if(factMode){
        const a=document.getElementById('answer');
        return {mode:'fact', vis:!!a && a.offsetParent!==null};
      }
      if(g && g.si<g.steps.length) return {mode:'step', exp:g.steps[g.si].boxes.map(x=>x.expect)};
      return null;
    });
    if(!st) break;
    if(st.mode==='fact'){
      const ans=await p.evaluate(()=>{const c=current; return (c.a!==undefined)?(c.op==='-'?c.a-c.b:(c.op==='+'?c.a+c.b:undefined)):undefined;});
      // fact answers vary per module; just advance by using the page's own expected value if exposed
      const ok=await p.evaluate(()=>{ if(typeof current==='undefined') return false;
        const c=current; let v=null;
        if(c.ans!==undefined) v=c.ans;
        else if(c.N!==undefined&&c.d!==undefined) v=c.N/c.d;
        else if(c.a!==undefined&&c.b!==undefined&&c.fact) v=c.a*c.b;
        if(v===null||!isFinite(v)) return false;
        document.getElementById('answer').value=String(v); return true;});
      if(!ok) break;
      await p.click('#submit'); await p.waitForTimeout(160); solved++;
      await p.waitForTimeout(220);
    } else {
      // a box can be one input in the step card, or several one-digit boxes sitting in the written problem
      await p.evaluate(exp=>{exp.forEach((v,i)=>{
        const ins=typeof grpInputs==='function'?grpInputs(i):[];
        if(ins.length>1) String(v).split('').forEach((d,k)=>{ if(ins[k]) ins[k].value=d; });
        else if(ins.length===1) ins[0].value=String(v);
        else { const el=document.getElementById('bx'+i); if(el) el.value=String(v); } });},st.exp);
      await p.click('#stepbtn'); await p.waitForTimeout(170);
      const done=await p.evaluate(()=>typeof G==='undefined'||!G||G.si>=G.steps.length);
      if(done){solved++; await p.waitForTimeout(260);}
    }
  }
  const okMark=errs.length===0 && solved>0;
  if(!okMark) bad++;
  console.log(`${('fluency-lab-'+m).padEnd(30)} solved:${solved}  errors:${errs.length} ${errs.slice(0,1).join('')}`);
  await p.close();
 }
 // ---- quizzes: title must still match the tracker, and grading must work ----
 console.log('');
 for(const m of PRAC){
  const p=await b.newPage();
  const errs=[];
  p.on('console',x=>{if(x.type()==='error'&&!NOISE.test(x.text()))errs.push(x.text());});
  p.on('pageerror',e=>errs.push('PE '+e.message));
  await p.goto(D+'quiz-'+m+'.html'); await p.waitForTimeout(250);
  const r=await p.evaluate(()=>{
    document.querySelectorAll('.q').forEach((q,i)=>{
      const correct=Q[i][2];
      q.querySelector('.opt[data-o="'+correct+'"]').click();
    });
    check();
    return {h1:document.querySelector('h1').textContent.trim(),
            mod:(window.FLSubmit?FLSubmit.module:'(none)'),
            score:document.getElementById('score').textContent.trim().slice(0,30),
            n:Q.length};
  });
  if(errs.length) bad++;
  console.log(`${('quiz-'+m).padEnd(30)} module:"${r.mod}"  ${r.score}  errors:${errs.length}`);
  await p.close();
 }
 console.log('\n'+(bad?('PROBLEM PAGES: '+bad):'ALL PAGES OK'));
 await b.close();
})();
