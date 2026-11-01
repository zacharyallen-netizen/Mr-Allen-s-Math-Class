// Online checks: screen pixels unchanged vs originals, no horizontal scroll, Check/Show/Reset work, no page errors.
const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
const W=process.argv[2]; const R='/home/claude/mr-allen-s-math-class/grade8/';
const PAGES=['Unit1_PreTest','Unit1_PreTest_FormB','Unit_2_Pretest'];
(async()=>{
  const b=await chromium.launch(); let fails=0; const F=m=>{fails++;console.log('  FAIL',m);};
  for(const base of PAGES){
    for(const w of [390,1280]){
      const shots={};
      for(const site of ['site_orig','site_new']){
        const p=await b.newPage({viewport:{width:w,height:900}}); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
        await p.goto('file://'+W+'/'+site+'/grade8/'+base+'.html'); await p.waitForTimeout(400);
        shots[site]=await p.screenshot({fullPage:true});
        const sw=await p.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
        if(site==='site_new'&&sw>0) F(`${base}@${w}: horizontal scroll ${sw}px`);
        if(errs.length) F(`${base}@${w} ${site}: page errors ${errs}`);
        await p.close();
      }
      const same=Buffer.compare(shots.site_orig,shots.site_new)===0;
      console.log(`${base}@${w}: screen identical to original: ${same}`); if(!same) F(`${base}@${w} screen differs`);
    }
    // behaviour on the real repo file
    const p=await b.newPage({viewport:{width:1280,height:900}}); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
    await p.goto('file://'+R+base+'.html'); await p.waitForTimeout(300);
    if(base.startsWith('Unit1')){
      const r=await p.evaluate(async()=>{
        const out={};
        const inp=document.querySelector('#quiz .q input.answer'); inp.value='9'; // wrong
        document.querySelector('#quiz .q .check-btn').click(); out.wrong=document.querySelector('#quiz .q').className;
        inp.value=registry[0].q.ans; document.querySelector('#quiz .q .check-btn').click(); out.right=document.querySelector('#quiz .q').className;
        // number line click + order chips
        const nl=registry.find(e=>e.q.type==='numberline'); nl.card.querySelectorAll('.nl-hit')[3].dispatchEvent(new MouseEvent('click',{bubbles:true}));
        out.nlHas=nl.hasAnswer();
        const oc=registry.find(e=>e.q.type==='order'); oc.card.querySelectorAll('.chip').forEach(c=>c.click()); out.orderHas=oc.hasAnswer();
        document.getElementById('checkAll').click(); out.chip=document.getElementById('chip').textContent;
        document.getElementById('reset').click(); await new Promise(r=>setTimeout(r,50));
        out.afterReset=document.getElementById('chip').textContent+' | filled='+[...document.querySelectorAll('input.answer')].filter(i=>i.value).length+' | key='+document.body.classList.contains('answer-key');
        showAnswerKey(); out.key=document.getElementById('chip').textContent+' | correct cards='+document.querySelectorAll('#quiz .q.correct').length;
        document.getElementById('reset').click(); out.keyReset=document.body.classList.contains('answer-key')+' '+document.getElementById('chip').textContent;
        out.keyFlagVisible=getComputedStyle(document.querySelector('.key-flag')).display; out.printLineVisible=getComputedStyle(document.querySelector('.print-line')).display;
        return out;});
      console.log(' ',base,JSON.stringify(r));
      if(!/incorrect/.test(r.wrong)||!/correct/.test(r.right)||!r.nlHas||!r.orderHas||!/^0 \/ 14.*filled=0.*key=false$/.test(r.afterReset)||!/^14 \/ 14 correct \| correct cards=14$/.test(r.key)||r.keyReset!=='false 0 / 14 correct'||r.keyFlagVisible!=='none'||r.printLineVisible!=='none') F(base+' behaviour');
    } else {
      const r=await p.evaluate(()=>{
        const out={};
        document.getElementById('i1').value='4^5'; document.getElementById('i2').value='5^5'; document.getElementById('check').click();
        out.check=document.getElementById('q1').className+' / '+document.getElementById('q2').className+' / '+document.getElementById('scorebox').firstChild.textContent;
        document.getElementById('reveal').click(); out.reveal=document.getElementById('fb14').textContent+' | cls='+document.body.className+' | flag='+getComputedStyle(document.querySelector('.key-flag')).display;
        document.getElementById('reset').click(); out.reset=document.getElementById('scorebox').firstChild.textContent+'| cls='+document.body.className+' | i1='+document.getElementById('i1').value;
        return out;});
      console.log(' ',base,JSON.stringify(r));
      if(!/q correct \/ q wrong/.test(r.check)||!/answer: 1b4/.test(r.reveal)||!/flag=none/.test(r.reveal)||/answers-shown/.test(r.reset)||!/i1=$/.test(r.reset)) F(base+' behaviour');
    }
    if(errs.length) F(base+' page errors '+errs);
    await p.close();
  }
  console.log('FAILS',fails); await b.close();
})();
