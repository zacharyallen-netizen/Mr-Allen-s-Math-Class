const {chromium}=require('/home/claude/.npm-global/lib/node_modules/playwright');
const SH=__dirname+'/shots/';
const IGN=/fonts\.googleapis|fonts\.gstatic|ERR_TUNNEL|Failed to load resource|AudioContext|net::ERR/;
const PAGES=['unit1-notes','unit1-practice','unit2-notes','unit2-practice','unit4-notes','unit4-practice','unit5-notes','unit5-practice','unit6-notes','unit6-practice','unit7-notes','unit7-practice','unit8-notes','unit8-practice','nc_math1_study_guide'];
const clipCheck=()=>{const bad=[];document.querySelectorAll('svg').forEach(s=>{if(s.closest('#site-bar'))return;const r=s.getBoundingClientRect();if(r.width<40)return;
  const vb=s.viewBox&&s.viewBox.baseVal;if(!vb||!vb.width)return;
  const S=s.getScreenCTM();if(!S)return;const Si=S.inverse();
  s.querySelectorAll('text').forEach(t=>{let b;try{b=t.getBBox();}catch(e){return;}if(!b.width)return;
    const T=t.getScreenCTM();if(!T)return;const m=Si.multiply(T);const cs=[[b.x,b.y],[b.x+b.width,b.y],[b.x,b.y+b.height],[b.x+b.width,b.y+b.height]].map(([x,y])=>[m.a*x+m.c*y+m.e,m.b*x+m.d*y+m.f]);
    const x0=Math.min(...cs.map(c=>c[0])),x1=Math.max(...cs.map(c=>c[0])),y0=Math.min(...cs.map(c=>c[1])),y1=Math.max(...cs.map(c=>c[1]));
    if(x0<vb.x-0.5||y0<vb.y-0.5||x1>vb.x+vb.width+0.5||y1>vb.y+vb.height+0.5){const c=t.closest('[id]');bad.push((c?c.id:'?')+': "'+t.textContent+'"');}});});return bad;};
const txt=(pg,sel)=>pg.evaluate(sel=>{const e=document.querySelector(sel);return e?[...e.querySelectorAll('text')].map(t=>t.textContent).join(' | '):'NONE';},sel);
const shot=async(pg,sel,name)=>{const e=await pg.$(sel);if(e){await e.scrollIntoViewIfNeeded();await e.screenshot({path:SH+name+'.png'});}else console.log('  no element for shot',sel);};
function A(c,msg){console.log((c?'  PASS ':'  FAIL ')+msg);}
(async()=>{const b=await chromium.launch();
for(const W of [390,1280]){console.log('==== width',W);
 for(const p of PAGES){const ctx=await b.newContext({viewport:{width:W,height:W===390?844:800},hasTouch:W===390});await ctx.addInitScript(()=>sessionStorage.setItem('m1ok','1'));
  const pg=await ctx.newPage();const errs=[];pg.on('pageerror',e=>errs.push('pageerror '+e.message));pg.on('console',m=>{if(m.type()==='error'&&!IGN.test(m.text()))errs.push('console '+m.text());});
  await pg.goto('file:///home/claude/mr-allen-s-math-class/math1/'+p+'.html');await pg.waitForTimeout(900);
  const hs=await pg.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
  const clip=await pg.evaluate(clipCheck);
  console.log(p,'errors:',errs.length,'hscroll:',hs,'clipped:',clip.length,clip.slice(0,5).join(' ; '));
  const tag=p+'_'+W;
  /* ---------- targeted ---------- */
  if(p==='unit1-practice'){
    A((await txt(pg,'#e13-v0')).includes('= $18'),'e13 caption $18');
    const t=await txt(pg,'#e14-v0');A(t.includes('$0 | $6 | $12 | $18 | $24'),'e14 ticks 0/6/12/18/24');
    await pg.fill('#a15-in','-6');await pg.click('#a15 .go');await pg.click('#a15 .sa-btn');await pg.waitForTimeout(200);
    const t2=await txt(pg,'#a15-w0');A(t2.includes('−6')&&!/(^|\| )-6/.test(t2),'a15 tiles use true minus: '+t2.slice(0,40));
    await pg.click('#e13 .sa-btn');await shot(pg,'#e13',tag+'_e13');await shot(pg,'#e14',tag+'_e14');await shot(pg,'#a15',tag+'_a15');}
  if(p==='unit4-practice'){
    let g1=await txt(pg,'[data-v="dg1"]'),g2=await txt(pg,'[data-v="dg2"]');
    A(!g1.includes('200(2)')&&g1.includes('P(t) = ?')&&g1.includes('(5, ?)'),'dg1 before: '+g1);
    A(!g2.includes('20000(0.85)')&&g2.includes('V(t) = ?')&&g2.includes('(4, ?)'),'dg2 before: '+g2);
    await shot(pg,'section.topic:has([data-v="dg1"]) .sa:nth-of-type(1)',tag+'_dg1_before');
    await pg.fill('#d1-in','200(2)^t');await pg.click('#d1 button');await pg.waitForTimeout(200);
    g1=await txt(pg,'[data-v="dg1"]');A(g1.includes('200(2)')&&g1.includes('(5, ?)'),'dg1 after d1 only (eq shown, P(5) still hidden): '+g1);
    await pg.fill('#d2-in','6400');await pg.click('#d2 button');await pg.waitForTimeout(200);
    g1=await txt(pg,'[data-v="dg1"]');A(g1.includes('200(2)')&&g1.includes('6,400'),'dg1 after both');
    await shot(pg,'[data-v="dg1"]',tag+'_dg1_after');
    await pg.fill('#d4-in','10440');await pg.click('#d4 button');await pg.waitForTimeout(200);
    g2=await txt(pg,'[data-v="dg2"]');A(!g2.includes('20000(0.85)')&&g2.includes('10,440'),'dg2 after d4 only (point shown, eq hidden): '+g2);
    await pg.fill('#d3-in','20000*0.85^t');await pg.click('#d3 button');await pg.waitForTimeout(200);
    g2=await txt(pg,'[data-v="dg2"]');A(g2.includes('20000(0.85)'),'dg2 after d3');
    await shot(pg,'[data-v="dg2"]',tag+'_dg2_after');
    await pg.reload();await pg.waitForTimeout(800);
    await pg.evaluate(()=>{const b=[...document.querySelectorAll('.sa-btn')].find(x=>/M1.show\('d2'\)/.test(x.getAttribute('onclick')));b.click();});await pg.waitForTimeout(200);
    g1=await txt(pg,'[data-v="dg1"]');A(g1.includes('200(2)')&&g1.includes('6,400'),'dg1 after Show full solution');
    const c2=await pg.evaluate(clipCheck);A(c2.length===0,'no clipped labels in solved Part D');}
  if(p==='unit4-notes'){
    await pg.evaluate(()=>{const b=[...document.querySelectorAll('button')].find(x=>/Reveal all/.test(x.textContent));b.click();});await pg.waitForTimeout(400);
    for(const id of ['q42b','q44','q45']){const t=await pg.evaluate(id=>document.getElementById('fb-'+id).innerText,id);A(!/\*|\^/.test(t.split('\n')[0]),id+' key: '+t.split('\n')[0]);}
    await shot(pg,'#q44',tag+'_q44_reveal');}
  if(p==='unit5-practice'){const t=await txt(pg,'#v-g4');A(t.includes('r = −0.92'),'g4 label: '+t.split(' | ').pop());
    const src=await pg.content();const TB=JSON.parse(src.match(/var TB=(\[\[[^;]*\]\]);/)[1]);const r=await pg.evaluate(TB=>M.St.r(TB),TB);A(Math.abs(r+0.92)<0.005,'g4 computed r='+r.toFixed(4));await shot(pg,'#g4',tag+'_g4');}
  if(p==='unit5-notes'){const t=await pg.evaluate(()=>[...document.querySelectorAll('#fit-m,#fit-b')].map(i=>i.parentElement.textContent.trim()).join(' / '));A(/slope b/.test(t)&&/intercept a/.test(t),'fit sliders: '+t);
    await shot(pg,'#fitv',tag+'_fit');
    const n=await pg.evaluate(()=>['6 m','24 square units','24 units²','3 hours','50 mph','2x','−3','1/2'].map(s=>M.numOf(s)).map(x=>x&&x.v));console.log('  u56 numOf:',JSON.stringify(n));}
  if(p==='unit6-notes'){const t=await txt(pg,'#v-yt63');A(t.includes('(2x)² − 5²'),'yt63 label: '+t);
    const t3=await pg.evaluate(()=>[...document.querySelectorAll('svg')].map(s=>[...s.querySelectorAll('text')].map(x=>x.textContent)).flat().filter(x=>/² − /.test(x)).join(' / '));console.log('  dosPic labels on page:',t3);
    await shot(pg,'#yt63',tag+'_yt63');
    const set=async(a,h,k)=>pg.evaluate(([a,h,k])=>{const s=(id,v)=>{const e=document.getElementById(id);e.value=v;e.dispatchEvent(new Event('input'));};s('pa',a);s('ph',h);s('pk',k);return document.getElementById('pr').innerText.split('\n')[0];},[a,h,k]);
    const cases=[[1,0,0,'y = x²'],[1,1,-4,'y = (x − 1)² − 4'],[-1,-2,3,'y = −(x + 2)² + 3'],[0.5,0,-2,'y = 0.5x² − 2'],[-2,-3,5,'y = −2(x + 3)² + 5']];
    for(const [a,h,k,e] of cases){const r=await set(a,h,k);A(r===e,'vertex readout '+a+','+h+','+k+' -> '+r);}
    await shot(pg,'#pv',tag+'_parab');}
  if(p==='unit6-practice'){const o=await pg.evaluate(()=>[...document.querySelectorAll('#d1 .chk-btn')].map(b=>b.textContent));A(new Set(o.map(s=>s.replace(/x = /g,'').split(' and ').sort().join())).size===4,'d1 options distinct: '+o.join(' / '));
    await pg.click('#d1 [data-v="c"]');const f=await pg.evaluate(()=>document.getElementById('fb-d1').innerText);console.log('  d1 c feedback:',f.slice(0,120));}
  if(p==='unit8-practice'){for(const id of ['f1','f2','f3','f5','f6']){const q=await pg.evaluate(id=>document.querySelector('#'+id+' .chk-q').innerText,id);A(/most specific/.test(q),id+': '+q);}
    const intro=await pg.evaluate(()=>[...document.querySelectorAll('.keyhdr')].find(k=>/Part F/.test(k.textContent)).innerText);A(/most specific/.test(intro),'Part F intro');
    const fb=await pg.evaluate(()=>{const c=document.getElementById('f1');const b=[...c.querySelectorAll('button')].find(x=>x.textContent.trim()==='Parallelogram');b.click();return (c.querySelector('.chk-fb,.fb')||{}).innerText;});console.log('  f1 Parallelogram feedback:',fb);
    await shot(pg,'#f1',tag+'_f1');}
  if(p==='unit8-notes'){const info=await pg.evaluate(()=>{const ts=[...document.querySelectorAll('svg text')].filter(t=>/^Δy = /.test(t.textContent));return ts.map(t=>{const s=t.ownerSVGElement;const bb=t.getBBox();const lines=[...s.querySelectorAll('line')].filter(l=>l.getAttribute('stroke-width')==='1.6'&&l.getAttribute('y1')===l.getAttribute('y2'));const hit=lines.filter(l=>{const y=+l.getAttribute('y1');return y>bb.y&&y<bb.y+bb.height&&+l.getAttribute('x2')>bb.x&&+l.getAttribute('x1')<bb.x+bb.width;});return t.textContent+' axisHit='+hit.length;});});
    console.log('  Δy labels:',info.join(' ; '));A(info.length&&info.every(s=>/axisHit=0/.test(s)),'Δy label clear of x-axis');
    const host=await pg.evaluate(()=>{const t=[...document.querySelectorAll('svg text')].find(t=>/^Δy = /.test(t.textContent));const s=t.ownerSVGElement;s.id=s.id||'dyw';return '#'+s.id;});await shot(pg,host,tag+'_dist');}
  if(p==='nc_math1_study_guide'){const n=await pg.evaluate(()=>['3 hours','24 square units','24 units²','6 m','$45','x = 4','1/2','2x','4.0','sqrt(2)'].map(s=>s+'→'+numVal(s)));console.log('  guide numVal:',n.join(', '));
    const pt=await pg.evaluate(()=>JSON.stringify([parsePt('(3, -2)'),parsePt('3,-2'),parseIneq('x>3'),parseSet('x=2 or x=-3')]));console.log('  guide other parsers:',pt);}
  if(p==='unit1-notes'){const n=await pg.evaluate(()=>['3 hours','24 square units','24 units²','6 m','5 feet','$4 per hour','x = 4','2x','1/2'].map(s=>s+'→'+M1.parseNum(s)));console.log('  u12 parseNum:',n.join(', '));}
  if(errs.length)console.log('  ERRORS:',errs.slice(0,5));
  await ctx.close();}}
await b.close();})();
