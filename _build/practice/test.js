const {chromium}=require('playwright');const fs=require('fs');
const pages=JSON.parse(fs.readFileSync(__dirname+'/pages.json'));
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:800}});
await p.route('**/*',r=>r.request().url().startsWith('file:')?r.continue():r.abort());
let bad=[],n=0;
for(const [k,[fn]] of Object.entries(pages)){
  const errs=[];p.removeAllListeners('pageerror');p.on('pageerror',e=>errs.push(e.message));
  await p.goto('file:///home/claude/mr-allen-s-math-class/grade8/'+fn);
  const res=await p.evaluate(()=>{const out=[];const SUP={'⁰':'0','¹':'1','²':'2','³':'3','⁴':'4','⁵':'5','⁶':'6','⁷':'7','⁸':'8','⁹':'9','⁻':'-'};
    const typ=a=>a.replace(/<span class="fr"><span>(.*?)<\/span><span>(.*?)<\/span><\/span>/g,'$1/$2').replace(/<[^>]+>/g,'')
      .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁻]+/g,m=>'^'+[...m].map(c=>SUP[c]).join('')).replace(/(\d)(\d)̅/,'$1($2)').replace(/̅/,'');
    PRACTICE.data.secs.forEach((s,si)=>s.probs.forEach(pr=>{const t=typ(pr.ans);
      out.push([si,pr.n,pr.ans,t,PracticeCheck(t,pr.ans),PracticeCheck(pr.ans,pr.ans),PracticeCheck('12345',pr.ans)]);}));return out;});
  for(const r of res){n++; if(!r[4]||!r[5]||r[6]) bad.push(k+' '+JSON.stringify(r));}
  const sw=await p.evaluate(()=>document.documentElement.scrollWidth); if(sw>390) bad.push(k+' overflow '+sw);
  if(errs.length) bad.push(k+' errors '+errs);
}
console.log('checked',n);console.log(bad.join('\n')||'all ok');
// variants
await p.goto('file:///home/claude/mr-allen-s-math-class/grade8/unit3-practice-1.html');
const V=[['x = 6','6',1],['x>5','x > 5',1],['5<x','x > 5',1],['x<5','x > 5',0],['infinite','infinitely many solutions',1],['none','no solution',1],
['3.2x10^4','3.2 × 10⁴',1],['3.2*10^4','3.2 × 10⁴',1],['32000','3.2 × 10⁴',0],['5600000','5,600,000',1],['1/9','<span class="fr"><span>1</span><span>9</span></span>',1],
['0.111','<span class="fr"><span>1</span><span>9</span></span>',0],['2/18','<span class="fr"><span>1</span><span>9</span></span>',0],['45/100','<span class="fr"><span>9</span><span>20</span></span>',0],['9/20','<span class="fr"><span>9</span><span>20</span></span>',1],['x^7','x⁷',1],['x7','x⁷',1],['1/x^4','<span class="fr"><span>1</span><span>x⁴</span></span>',1],
['0.8(3)','0.83̅',1],['0.8333','0.83̅',1],['0.83','0.83̅',0],['0.83...','0.83̅',1],['0.(3)','0.3̅',1],['0.333','0.3̅',1],['0.3','0.3̅',0],['0.6666','0.6̅',1],['0.(6)','0.6̅',1],['y=1+2x','y=2x+1',1],['y = -3x + 10','y=-3x+10',1],['2,4','(2,4)',1],['(2, 4)','(2,4)',1],
['7 and 8','7 and 8',1],['between 7 and 8','7 and 8',1],['7-8','7 and 8',1],['sqrt10','√10',1],['3, sqrt10, 10/3','3, √10, <span class="fr"><span>10</span><span>3</span></span>',1],['b','function b',1],['Function B','function b',1],
['not moving','stopped',1],['Yes','yes',1],['7 1/3','<span class="fr"><span>22</span><span>3</span></span>',1],['-16','−16',1],['−4','−2',0],['pi','π',1],['x ≥ -3','x ≥ −3',1],['x>=-3','x ≥ −3',1],['-3<=x','x ≥ −3',1]];
const vr=await p.evaluate(V=>V.map(([i,a,e])=>[i,a,e,PracticeCheck(i,a)?1:0]),V);
console.log(vr.filter(r=>r[2]!==r[3]).map(r=>JSON.stringify(r)).join('\n')||'variants ok');
await p.screenshot({path:__dirname+'/u3shot.png',fullPage:false});
await p.goto('file:///home/claude/mr-allen-s-math-class/grade8/unit4-practice-1.html');
await p.fill('#s0p1 .pr-in','40');await p.click('#s0p1 .pr-check');await p.fill('#s0p1 .pr-in','45');await p.click('#s0p1 .pr-check');await p.click('#s0p1 .pr-hint');
await p.fill('#s0p2 .pr-in','75');await p.click('#s0p2 .pr-check');
await p.screenshot({path:__dirname+'/u4shot.png',fullPage:false});
await b.close();})();
