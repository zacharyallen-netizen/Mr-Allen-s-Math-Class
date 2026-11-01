const {chromium}=require('/home/claude/.npm-global/lib/node_modules/playwright');
const IGN=/fonts\.googleapis|fonts\.gstatic|ERR_TUNNEL|Failed to load resource|AudioContext/;
(async()=>{const b=await chromium.launch();
for(const w of [900,390]){const p=await b.newPage({viewport:{width:w,height:800}});const errs=[];
p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error'&&!IGN.test(m.text()))errs.push(m.text())});
const base='file:///home/claude/mr-allen-s-math-class/grade8/';
// every arcade card resolves to a real file
await p.goto(base+'arcade.html');
const hrefs=await p.$$eval('a.card',a=>a.map(x=>x.getAttribute('href')));
const fs=require('fs');const missing=hrefs.filter(h=>!fs.existsSync('/home/claude/mr-allen-s-math-class/grade8/'+h.split('#')[0]));
console.log(w,'cards',hrefs.length,'missing',missing);
for(const h of ['math_arcade_classic.html#integer_outbreak','math_arcade_classic.html#mult_matrix','math_arcade_classic.html#target_number','math_arcade_classic.html#climb','math_arcade_classic.html#boss','integer-arcade.html#game1','integer-arcade.html#game2','integer-arcade.html#game3','integer-arcade.html#game4']){
  await p.goto('about:blank');await p.goto(base+h);await p.waitForTimeout(700);
  const sw=await p.evaluate(()=>document.documentElement.scrollWidth);
  const tag=h.replace(/[^a-z0-9]/gi,'_');await p.screenshot({path:`shots_pt/arc_${w}_${tag}.png`});
  console.log(w,h,'scrollWidth',sw);}
console.log(w,'errors',errs);await p.close();}
await b.close();})();
