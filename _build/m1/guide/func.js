const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
// Independent answer keys (recomputed here, not read from the page)
const sq=x=>x*x;
const K={
 u1q1:'x = '+((17+7)/4), u1q2:'x ≤ −'+(12/3), u1q3:'w = (P − 2l) / 2', u1q4:(22+3)/5, u1q5:{op:'<',n:(7+5)/4}, u1q6:{op:'>=',n:(9-1)/-2}, u1q7:'x^'+(3+6), u1q8:150/50,
 u2q1:String((9-1)/(6-2)), u2q2:'−4', u2q3:'y = −2x + 3', u2q4:4*5-3, u2q5:(-6-2)/(3-(-1)), u2q6:'0.5x-1', u2q7:(16-4)/(5-1),
 u3q1:'(3, 6)', u3q2:'('+(8/2)+', '+(7-4)+')', u3q3:'No solution', u3q4:[2,4], u3q5:[12/3, 12/3-3], u3q6:(0>2*0-3)?'Yes':'No',
 u4q1:'Decay', u4q2:String(5*3**2), u4q3:'12', u4q4:17+4, u4q5:4+7*3, u4q6:12*2, u4q7:'200*1.05^x',
 u5q1:String((5+10+15)/3), u5q2:'Positive', u5q3:String(20-5), u5q4:[11,4,9,2,7].sort((a,b)=>a-b)[2], u5q5:(2+4+9)/3, u5q6:20-23, u5q7:5+2*6,
 u6q1:'x² + 7x', u6q2:'−6x + 12', u6q3:'x² + 3x − 10', u6q4:'(x + 3)(x + 4)', u6q5:'(x − 4)(x + 4)', u6q6:'x = 2 or x = 3', u6q7:'x^2+8x+15', u6q8:'x^2+8x+12', u6q9:[3,-4],
 u7q1:'Down', u7q2:'(2, 1)', u7q3:4/2, u7q4:[3,-2], u7q5:{op:'<=',n:3}, u7q6:6*(6+2), u7q7:'A',
 u8q1:'('+(-2+6)/2+', '+(4+0)/2+')', u8q2:'−', u8q3:String(Math.sqrt(9+16)), u8q4:Math.sqrt(sq(5+1)+sq(9-1)), u8q5:[(-3+7)/2,(5-1)/2], u8q6:-3, u8q7:(4+2)*(5-1)
};
const V={u1q7:['x^9','x⁹','x ^ 9'],u2q6:['1/2x-1','y=0.5x-1','y = x/2 − 1','y=½x−1'],u4q7:['200(1.05)^x','y=200*1.05^x','y = 200(1.05)ˣ'],u6q7:['(x+5)(x+3)','(x + 3)(x + 5)'],u6q8:['x^2+8x+12','x²+8x+12','y = x^2 + 8x + 12']};
function variants(it){
  if (V[it.id]) return V[it.id];
  const f=n=>String(n), m=n=>String(n).replace('-','−');
  if (it.kind==='num') return [f(it.ans), m(it.ans), (it.pre&&/=/.test(it.pre)?it.pre.replace(/=.*/,'').trim()+' = ':'x = ')+f(it.ans), f(it.ans)+'.0'];
  if (it.kind==='pt') return ['('+it.ans[0]+', '+it.ans[1]+')', it.ans[0]+','+it.ans[1], '('+m(it.ans[0])+', '+m(it.ans[1])+')'];
  if (it.kind==='ineq'){ const v=it.var||'x', flip={'<':'>','>':'<','<=':'>=','>=':'<='}, u={'<=':'≤','>=':'≥','<':'<','>':'>'}; return [v+it.ans.op+it.ans.n, it.ans.n+flip[it.ans.op]+v, v+' '+u[it.ans.op]+' '+m(it.ans.n)]; }
  if (it.kind==='set') return [it.ans.join(', '), it.ans.slice().reverse().join(','), 'x = '+it.ans[0]+' or x = '+it.ans[1]];
  return [String(it.ans)];
}
(async()=>{
  const b = await chromium.launch(); const bad=[]; let checks=0;
  const page=async()=>{ const p=await b.newPage({viewport:{width:390,height:844}}); p.on('pageerror',e=>bad.push('PAGEERR '+e.message)); await p.addInitScript(()=>sessionStorage.setItem('m1ok','1')); await p.goto('file:///home/claude/mr-allen-s-math-class/math1/nc_math1_study_guide.html'); await p.waitForTimeout(500); return p; };
  let p=await page();
  const items=await p.evaluate(()=>Object.values(ITEMS).map(it=>({id:it.id,type:it.type,kind:it.kind,ans:it.ans,var:it.var,pre:it.pre,ok:it.ok,opts:it.opts&&it.opts.map(o=>({t:o.t.replace(/<[^>]+>/g,''),why:o.why})),miss:it.miss,bad:it.bad,nsteps:it.steps&&it.steps.length,show:it.show})));
  // 1. answer keys
  for (const it of items){ const k=K[it.id]; if (it.type==='err') continue; if (k===undefined){ bad.push('no key '+it.id); continue; } checks++;
    if (it.type==='mc'){ const t=it.opts[it.ok].t.replace(/\s+/g,' '); const kk=String(k); if (!t.replace(/x\^9/,'').includes(kk.replace('x^','x'))) bad.push('KEY '+it.id+' option "'+t+'" vs '+kk); }
    else { const ok=await p.evaluate(([kind,inp,ans,v])=>matches(kind,inp,ans,{v}),[it.kind, typeof k==='object'&&!Array.isArray(k)? (it.var||'x')+(k.op)+k.n : Array.isArray(k)? (it.kind==='pt'?'('+k.join(',')+')':k.join(',')) : String(k), it.ans, it.var]); if (ok!==true) bad.push('KEY '+it.id+' '+JSON.stringify(k)+' vs '+JSON.stringify(it.ans)); } }
  // 2. right answers (and all typed variants) → score equals total
  for (const it of items){
    const card=await p.$('#'+it.id);
    if (it.type==='mc') await (await card.$$('.ob'))[it.ok].click();
    else if (it.type==='err'){ const st=await card.$$('.es'); if (it.bad>0){ await st[0].click(); const t=await card.$eval('.fb',e=>e.textContent); if(!/is correct/.test(t)) bad.push('ERRWRONG '+it.id+' '+t); } await st[it.bad].click(); }
    else { const vs=variants(it); for (let i=0;i<vs.length;i++){ const ok=await p.evaluate(([kind,inp,ans,v,form])=>{ const r=matches(kind,inp,ans,{v}); if (r&&form==='factored'&&topLevelSum(inp)) return 'form'; if (r&&form==='expanded'&&/\(/.test(inp)) return 'form'; return r; },[it.kind,vs[i],it.ans,it.var,(await p.evaluate(id=>ITEMS[id].form,it.id))]); checks++; if(ok!==true) bad.push('VARIANT '+it.id+' "'+vs[i]+'" -> '+ok); }
      await card.$eval('input',(e,v)=>e.value=v, vs[0]); await (await card.$('.chk')).click(); }
    const cls=await card.$eval('.fb',e=>e.className+'|'+e.textContent.slice(0,40)); if(!/ c\b/.test(cls)) bad.push('RIGHT '+it.id+' '+cls);
    const post=await card.$eval('.qv .vbox',e=>e.innerHTML.length); if(!post) bad.push('NOVIZ '+it.id);
  }
  const sc=await p.evaluate(()=>[document.getElementById('totalScore').textContent,document.getElementById('totalMax').textContent]);
  if (sc[0]!==sc[1]) bad.push('SCORE '+sc); console.log('score after all-right:',sc);
  await p.close();
  // 3. wrong answers: MC each wrong option (fresh page each round), typed misses + garbage
  p=await page();
  for (const it of items){
    const card=await p.$('#'+it.id);
    if (it.type==='mc'){ const w=it.ok===0?1:0; await (await card.$$('.ob'))[w].click(); const t=await card.$eval('.fb',e=>e.className+'|'+e.textContent); checks++;
      if(!/ w\b/.test(t) || (it.opts[w].why && !t.includes(it.opts[w].why.replace(/<[^>]+>/g,'').slice(0,20)))) bad.push('WRONGMC '+it.id+' '+t.slice(0,90));
      if (!(await card.$eval('.ob.reveal',e=>!!e).catch(()=>false))) bad.push('NOREVEAL '+it.id); }
    else if (it.type==='in'){
      const inp=await card.$('input'), chk=await card.$('.chk');
      await inp.fill('@@'); await chk.click(); let t=await card.$eval('.fb',e=>e.className+'|'+e.textContent); checks++; if(!/ n\b/.test(t)) bad.push('GARBAGE '+it.id+' '+t.slice(0,60));
      for (const m of (it.miss||[])){ await inp.fill(m[0]); await chk.click(); t=await card.$eval('.fb',e=>e.className+'|'+e.textContent); checks++;
        const want=m[1].replace(/<[^>]+>/g,'').replace(/&lt;/g,'<').replace(/&gt;/g,'>').slice(0,18);
        if(!/ w\b/.test(t)||!t.includes(want)) bad.push('MISS '+it.id+' "'+m[0]+'" -> '+t.slice(0,100)); }
      // generic wrong
      await inp.fill(it.kind==='pt'?'(99, 99)':it.kind==='ineq'?(it.var||'x')+'>99':it.kind==='set'?'99, 98':it.kind==='expr'?'99x':'999'); await chk.click(); t=await card.$eval('.fb',e=>e.className+'|'+e.textContent); checks++;
      if(!/ w\b/.test(t)) bad.push('GENWRONG '+it.id+' '+t.slice(0,60));
      const sh=await card.$eval('.show',e=>!e.hidden); if(!sh && (it.miss||[]).length+1>=2) bad.push('NOSHOW '+it.id);
      if (sh){ await (await card.$('.show')).click(); t=await card.$eval('.fb',e=>e.textContent); if(!/The answer is/.test(t)) bad.push('SHOWTXT '+it.id); }
    }
  }
  const sc2=await p.evaluate(()=>document.getElementById('totalScore').textContent); console.log('score after wrong pass:',sc2);
  // factored/expanded form guard
  const fg=await p.evaluate(()=>{ const out=[]; return out; });
  await p.close();
  p=await page();
  const c7=await p.$('#u6q7'); await (await c7.$('input')).fill('x^2+8x+15'); await (await c7.$('.chk')).click(); console.log('form guard:', (await c7.$eval('.fb',e=>e.textContent)).slice(0,60));
  const c8=await p.$('#u6q8'); await (await c8.$('input')).fill('(x+2)(x+6)'); await (await c8.$('.chk')).click(); console.log('form guard:', (await c8.$eval('.fb',e=>e.textContent)).slice(0,60));
  await p.close(); await b.close();
  console.log('checks',checks,'problems',bad.length); bad.forEach(x=>console.log(' ',x));
})();
