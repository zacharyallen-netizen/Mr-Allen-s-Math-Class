const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async()=>{ const b=await chromium.launch(); const p=await b.newPage();
 await p.addInitScript(()=>sessionStorage.setItem('m1ok','1'));
 await p.goto('file://'+process.cwd()+'/old.html'); await p.waitForTimeout(300);
 const olds=await p.evaluate(()=>[...document.querySelectorAll('.key-idea,.vocab,.step,.answer,.qt,.ob,.fb,.flow-box,td,h4,.toc-card .ttl')].map(e=>e.textContent.replace(/\s+/g,' ').trim()).filter(Boolean));
 await p.goto('file:///home/claude/mr-allen-s-math-class/math1/nc_math1_study_guide.html'); await p.waitForTimeout(500);
 // include MC/feedback text held in ITEMS
 const txt=await p.evaluate(()=>document.body.textContent+' '+Object.values(ITEMS).map(i=>{const d=document.createElement('div'); d.innerHTML=[i.q,i.ex,(i.opts||[]).map(o=>o.t).join(' ')].join(' '); return d.textContent;}).join(' '));
 const norm=s=>s.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&nbsp;/g,' ').replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{20E3}]/gu,'').replace(/\s+/g,'').toLowerCase();
 const T=norm(txt); console.log('len',txt.length, T.includes('slope(rateofchange)'), T.slice(0,200)); const miss=olds.filter(o=>!T.includes(norm(o)));
 console.log('old blocks',olds.length,'not found verbatim',miss.length); miss.forEach(m=>console.log(' -',m.slice(0,120)));
 await b.close();})();
