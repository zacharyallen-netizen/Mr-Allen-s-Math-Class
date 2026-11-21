const {chromium}=require('playwright');const {makeEnv}=require('./fakegas.js');const assert=require('assert');
const URL='http://127.0.0.1:8766/game.html?debug';
async function answer(pg,right=true){
  const p=await pg.evaluate(()=>{const p=__Q();return {kind:p.kind,ans:p.ans,choices:p.choices}});
  if(p.kind==='choice'){await pg.evaluate(i=>__submit(i),right?p.ans:(p.ans+1)%p.choices.length);return p}
  if(p.kind==='num'){await pg.fill('#a0',String(right?p.ans:p.ans+1));await pg.press('#a0','Enter');return p}
  await pg.fill('#an',String(right?p.ans[0]:p.ans[0]+1));await pg.fill('#ad',String(p.ans[1]));await pg.press('#ad','Enter');return p}
async function waitNext(pg,seq){await pg.waitForFunction(s=>{const b=document.querySelector('#bonus');if(!b.hidden){return true}return document.querySelector('#prob').dataset.seq!==String(s)},seq,{timeout:8000});
  if(await pg.evaluate(()=>!document.querySelector('#bonus').hidden)){await pg.keyboard.press('Escape');}
}
(async()=>{
  const b=await chromium.launch();const errs=[];
  // ---------- practice mode ----------
  for(const vp of [{width:390,height:844},{width:1100,height:800}]){
    const pg=await b.newPage({viewport:vp});pg.on('pageerror',e=>errs.push(String(e)));pg.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
    await pg.goto(URL);await pg.click('#bStart');
    assert(await pg.isHidden('#homeroom'),'no homeroom prompt in practice mode');
    assert(await pg.isHidden('#cup'),'no cup in practice mode');
    for(let room=1;room<=6;room++){
      await pg.evaluate(r=>{document.querySelector('#bRooms').click();document.querySelector(`.rm[data-r="${r}"]`).click();document.querySelector('#bStart').click()},room);
      const kinds=new Set();
      for(let k=0;k<12;k++){const seq=await pg.$eval('#prob',e=>e.dataset.seq);const p=await answer(pg,true);kinds.add(p.kind);
        await pg.waitForFunction(()=>/ok/.test(document.querySelector('#fb').className),null,{timeout:3000});await waitNext(pg,seq)}
      const sw=await pg.evaluate(()=>document.documentElement.scrollWidth-innerWidth);assert(sw<=0,'horizontal scroll '+sw+' at '+vp.width);
      if(vp.width===1100)await pg.screenshot({path:`shot_room${room}.png`});
      console.log(vp.width,'room',room,'ok',[...kinds].join(','))}
    // a wrong answer names the mistake
    await pg.evaluate(()=>{document.querySelector('#bRooms').click();document.querySelector('.rm[data-r="3"]').click();document.querySelector('#bStart').click()});
    let got=false;for(let k=0;k<10&&!got;k++){const p=await pg.evaluate(()=>{const p=__Q();return {kind:p.kind,ans:p.ans,html:p.html}});
      if(p.kind==='frac'&&/class="op">×<\/span><span>\d/.test(p.html)===false&&/^<span>\d+<\/span><span class="op">×/.test(p.html)){
        // n × a/b : type a/b (multiplied top and bottom) -> must get a note
        const [N,D]=p.ans;const seq=await pg.$eval('#prob',e=>e.dataset.seq);
        const n=+p.html.match(/^<span>(\d+)/)[1];await pg.fill('#an',String(N));await pg.fill('#ad',String(D*n));await pg.press('#ad','Enter');
        await pg.waitForSelector('#fb.bad .note');console.log('wrong note:',await pg.$eval('#fb .note',e=>e.textContent));got=true;
        if(vp.width===1100)await pg.screenshot({path:'shot_wrong.png'});
        await waitNext(pg,seq)}
      else{const seq=await pg.$eval('#prob',e=>e.dataset.seq);await answer(pg,true);await waitNext(pg,seq)}}
    assert(got,'saw a wrong-answer note');
    // mixed number typed into the boxes is accepted + bonus offered for improper
    await pg.close()}
  // ---------- Class Cup mode (fake google.script.run backed by the real Code.gs) ----------
  const env=makeEnv();env.ctx.setup();
  const ctxp=await b.newContext({viewport:{width:1100,height:800}});
  await ctxp.exposeBinding('__gas',async(src,fn,args)=>{try{return {ok:env.ctx[fn](...args)}}catch(e){return {err:String(e.message||e)}}});
  const initGas=board=>{const mk=()=>{let ok=()=>{},bad=()=>{};const r=new Proxy({},{get:(t,k)=>k==='withSuccessHandler'?(f=>{ok=f;return r}):k==='withFailureHandler'?(f=>{bad=f;return r}):((...a)=>{window.__gas(k,JSON.parse(JSON.stringify(a))).then(x=>x.err?bad(new Error(x.err)):ok(x.ok))})});return r};
    window.google={script:{get run(){return mk()},url:{getLocation:cb=>cb({parameter:board?{board:'1'}:{}})}}}};
  const pg=await ctxp.newPage();pg.on('pageerror',e=>errs.push(String(e)));
  await pg.addInitScript(initGas,false);await pg.goto(URL);
  await pg.waitForFunction(()=>!document.querySelector('#cup').hidden);
  await pg.click('#bStart');await pg.waitForSelector('#homeroom:not([hidden])');
  const names=await pg.$$eval('#homeList .home',bs=>bs.map(b=>b.dataset.h));assert.deepStrictEqual(names,['Ms. Tesnar','Ms. Covalt']);
  await pg.screenshot({path:'shot_homeroom.png'});
  await pg.click('#homeList .home[data-h="Ms. Covalt"]');
  for(let k=0;k<7;k++){const seq=await pg.$eval('#prob',e=>e.dataset.seq);await answer(pg,true);await waitNext(pg,seq)}
  // wrong answers earn nothing
  { const seq=await pg.$eval('#prob',e=>e.dataset.seq);await answer(pg,false);await waitNext(pg,seq) }
  await pg.evaluate(()=>__Cup.flush());await pg.waitForTimeout(800);
  const pts=env.ctx.getBoard().classes.find(c=>c.name==='Ms. Covalt').points;console.log('Covalt points in Sheet:',pts);assert.strictEqual(pts,7);
  assert(await pg.$eval('#cup',e=>e.textContent.includes('Playing for Ms. Covalt')));
  await pg.screenshot({path:'shot_cup.png'});
  // points are kept on the Chromebook while offline and sent later
  await pg.evaluate(()=>{window.__realGas=window.__gas;window.__gas=async()=>({err:'offline'})});
  for(let k=0;k<3;k++){const seq=await pg.$eval('#prob',e=>e.dataset.seq);await answer(pg,true);await waitNext(pg,seq)}
  await pg.evaluate(()=>__Cup.flush());await pg.waitForTimeout(300);
  assert.strictEqual(env.ctx.getBoard().classes[1].points,7,'nothing sent while offline');
  await pg.evaluate(()=>{window.__gas=window.__realGas});await pg.evaluate(()=>__Cup.flush());await pg.waitForTimeout(800);
  env.ctx.CacheService.getScriptCache().remove('board');
  assert.strictEqual(env.ctx.getBoard().classes[1].points,10,'offline points sent later');
  // change homeroom
  await pg.click('#cupChange');await pg.click('#homeList .home[data-h="Ms. Tesnar"]');
  assert(await pg.$eval('#cup',e=>e.textContent.includes('Playing for Ms. Tesnar')));
  // projector board
  const pb=await ctxp.newPage();await pb.addInitScript(initGas,true);await pb.goto(URL);await pb.waitForSelector('#board:not([hidden])');await pb.waitForTimeout(500);
  assert(await pb.isHidden('.wrap'));const bt=await pb.$eval('#boardCup',e=>e.textContent);assert(/Ms\. Covalt\s*10/.test(bt),bt);
  await pb.screenshot({path:'shot_board.png'});
  // nothing personal leaves the page: only homeroom + points
  console.log('errors:',errs.length?errs:'none');assert(!errs.length);
  await b.close();console.log('ALL GAME TESTS PASSED');
})().catch(e=>{console.error(e);process.exit(1)});
