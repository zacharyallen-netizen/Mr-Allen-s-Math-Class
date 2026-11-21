const {chromium}=require('playwright');const assert=require('assert');
(async()=>{const b=await chromium.launch();const pg=await b.newPage({viewport:{width:1100,height:800}});const errs=[];pg.on('pageerror',e=>errs.push(String(e)));
await pg.goto('http://127.0.0.1:8766/game.html?debug');
await pg.evaluate(()=>{document.querySelector('#bRooms').click();document.querySelector('.rm[data-r="3"]').click();document.querySelector('#bStart').click()});
let improper=0,mixed=0,whole=0;
for(let k=0;k<60&&(improper<2||mixed<2||whole<1);k++){
  const p=await pg.evaluate(()=>{const p=__Q();return {ans:p.ans,kind:p.kind}});const seq=await pg.$eval('#prob',e=>e.dataset.seq);
  const [N,D]=p.ans;const g=(a,b)=>b?g(b,a%b):a;const gg=g(N,D),rn=N/gg,rd=D/gg;
  if(rd===1&&whole<1){await pg.fill('#aw',String(rn));await pg.press('#aw','Enter');await pg.waitForSelector('#fb.ok');assert(await pg.isHidden('#bonus'));whole++}
  else if(rn>rd&&improper<2){await pg.fill('#an',String(N));await pg.fill('#ad',String(D));await pg.press('#ad','Enter');
    await pg.waitForSelector('#bonus:not([hidden])');console.log('bonus:',await pg.$eval('#bonusT',e=>e.textContent),N,D,await pg.$eval('#bonusA',e=>e.innerHTML.slice(0,80)));const w=Math.floor(rn/rd);await pg.fill('#bw',String(w));await pg.fill('#bn',String(rn%rd));await pg.fill('#bd',String(rd));await pg.press('#bd','Enter');
    await pg.waitForFunction(()=>/Bonus!/.test(document.querySelector('#fb').textContent));improper++}
  else if(rn>rd&&mixed<2){const w=Math.floor(rn/rd);await pg.fill('#aw',String(w));await pg.fill('#an',String(rn%rd));await pg.fill('#ad',String(rd));await pg.press('#ad','Enter');
    await pg.waitForSelector('#fb.ok');assert(await pg.isHidden('#bonus'),'simplest mixed number gets no bonus question');mixed++}
  else {await pg.fill('#an',String(N));await pg.fill('#ad',String(D));await pg.press('#ad','Enter');await pg.waitForSelector('#fb.ok');if(!(await pg.isHidden('#bonus')))await pg.keyboard.press('Escape')}
  await pg.waitForFunction(s=>document.querySelector('#prob').dataset.seq!==String(s)||!document.querySelector('#bonus').hidden,seq);
  if(!(await pg.isHidden('#bonus')))await pg.keyboard.press('Escape');
}
console.log({improper,mixed,whole,errs});assert(improper>=2&&mixed>=2&&whole>=1&&!errs.length);await b.close();console.log('mixed-number tests passed')})().catch(e=>{console.error(e);process.exit(1)});
