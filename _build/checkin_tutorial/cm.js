const {chromium}=require('/home/claude/.npm-global/lib/node_modules/playwright');
(async()=>{const b=await chromium.launch();const errs=[];
for(const w of [390,1280]){const p=await b.newPage({viewport:{width:w,height:900}});p.on('pageerror',e=>errs.push(String(e)));
await p.goto('file:///home/claude/mr-allen-s-math-class/grade8/checkin_tutorial.html');
await p.click('#classMode');
const r=await p.evaluate(()=>{document.querySelectorAll('.reveal').forEach(b=>b.click());
 const t=document.querySelector('#q-t2 .fb').textContent;return [document.querySelectorAll('.talk').length,getComputedStyle(document.querySelector('.talk')).display,document.getElementById('doneN').textContent,document.getElementById('summary').classList.contains('show'),t.slice(0,200),document.documentElement.scrollWidth];});
console.log(w,JSON.stringify(r));
await p.screenshot({path:`cm_${w}.png`,fullPage:true});}
console.log('ERR',errs);await b.close();})();
