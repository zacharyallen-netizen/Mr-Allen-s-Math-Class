// Dumps, from the live HTML, every question (in page order) plus the answer each key should show.
const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
const G='/home/claude/mr-allen-s-math-class/grade8/';
const fs=require('fs');
const pages={Unit1_PreTest:'u1',Unit1_PreTest_FormB:'u1',Unit_2_Pretest:'u2'};
(async()=>{
  const b=await chromium.launch(); const out={};
  for(const [base,kind] of Object.entries(pages)){
    const p=await b.newPage(); await p.goto('file://'+G+base+'.html'); await p.waitForTimeout(300);
    const data=await p.evaluate(kind=>{
      const T=e=>e.textContent;
      const res={headings:[...document.querySelectorAll('.band .name,.subsec .title,.directive,.prompt,.objline,.can,.masthead h1,.masthead .sub')].map(T),
                 questions:[],answers:[]};
      if(kind==='u1'){
        document.querySelectorAll('#quiz .q').forEach(q=>res.questions.push({no:T(q.querySelector('.q-no')),text:T(q.querySelector('.q-prompt')),
          extra:[...q.querySelectorAll('.answer-row .field-label,.hint')].map(T)}));
        res.vocab=[];
        showAnswerKey();
        registry.forEach(e=>{ if(e.inputs) res.answers.push(...e.inputs.map(i=>i.value)); if(e.q.type==='order') res.answers.push(document.querySelectorAll('.order-readout b')[0].textContent); res.answers.push(e.why); });
      } else {
        document.querySelectorAll('.qgrid .q').forEach(q=>res.questions.push({no:T(q.querySelector('.n')),text:T(q.querySelector('.op'))+' '+T(q.querySelector('.expr')),extra:[]}));
        res.vocab=[...document.querySelectorAll('#vocab tr')].map(tr=>({term:T(tr.querySelector('.word')),def:T(tr.querySelector('.def'))}));
        res.answers=[...document.querySelectorAll('#vocab select')].map(s=>VOCAB[s.dataset.term]).concat(QS.map(q=>{const d=document.createElement('div');d.innerHTML=q.disp;return d.textContent;}));
      }
      return res;
    },kind);
    out[base]=data; await p.close();
  }
  fs.writeFileSync(process.argv[2],JSON.stringify(out,null,1)); await b.close();
})();
