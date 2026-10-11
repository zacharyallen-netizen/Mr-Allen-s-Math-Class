const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
const w=+process.argv[2]||390, sel=process.argv[3]||'.topic, .checkpoint', post=process.argv[4]==='post';
(async()=>{
  const b = await chromium.launch();
  const p = await b.newPage({viewport:{width:w,height:900}, deviceScaleFactor:1});
  await p.addInitScript(()=>sessionStorage.setItem('m1ok','1'));
  await p.goto('file:///home/claude/mr-allen-s-math-class/math1/nc_math1_study_guide.html');
  await p.waitForTimeout(800);
  if (post) await p.evaluate(()=>{ // reveal every answer picture
    document.querySelectorAll('.qc').forEach(c=>{ const it=ITEMS[c.id]; if(!it) return;
      if(it.type==='mc') c.querySelectorAll('.ob')[it.ok].click();
      else if(it.type==='err') c.querySelectorAll('.es')[it.bad].click();
      else { c.querySelector('input').value=it.show.replace(/<[^>]+>/g,'').replace(/&lt;/g,'<').replace(/ square units| hours/,''); c.querySelector('.chk').click(); }
    });});
  const els = await p.$$(sel);
  let i=0;
  for (const e of els){ const sec = await e.evaluate(n=>n.closest('section')?n.closest('section').id:'x');
    await e.screenshot({path:`shots/${w}_${post?'post_':''}${sec}_${String(i).padStart(2,'0')}.png`}); i++; }
  console.log('shots',i);
  await b.close();
})();
