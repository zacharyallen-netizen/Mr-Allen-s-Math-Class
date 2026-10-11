const {chromium}=require('/home/claude/.npm-global/lib/node_modules/playwright');
const page_=process.argv[2], mode=process.argv[3]||'shots', outdir=__dirname+'/shots';
require('fs').mkdirSync(outdir,{recursive:true});
const IGN=/fonts\.googleapis|fonts\.gstatic|ERR_TUNNEL|Failed to load resource|AudioContext|net::ERR/;
(async()=>{const b=await chromium.launch();
 for(const [w,h] of [[390,844],[1280,800]]){
  const ctx=await b.newContext({viewport:{width:w,height:h},hasTouch:w<500});const p=await ctx.newPage();
  const errs=[];p.on('pageerror',e=>errs.push('pageerror '+e.message));p.on('console',m=>{if(m.type()==='error'&&!IGN.test(m.text()))errs.push('console '+m.text());});
  await p.addInitScript(()=>sessionStorage.setItem('m1ok','1'));
  await p.goto('http://localhost:8756/math1/'+page_,{waitUntil:'load'});await p.waitForTimeout(600);
  if(mode==='solved'){await p.evaluate(()=>revealPage());await p.waitForTimeout(300);}
  const r=await p.evaluate(()=>{const out={hs:document.documentElement.scrollWidth>window.innerWidth+1,sw:document.documentElement.scrollWidth,svgs:0,clip:[]};
    document.querySelectorAll('svg.mviz').forEach((s,k)=>{out.svgs++;const vb=s.viewBox.baseVal;s.querySelectorAll('text').forEach(t=>{let bb=t.getBBox();const tr=t.transform.baseVal.consolidate();if(tr){const m=tr.matrix,pts=[[bb.x,bb.y],[bb.x+bb.width,bb.y],[bb.x,bb.y+bb.height],[bb.x+bb.width,bb.y+bb.height]].map(([x,y])=>[m.a*x+m.c*y+m.e,m.b*x+m.d*y+m.f]);const xs=pts.map(q=>q[0]),ys=pts.map(q=>q[1]);bb={x:Math.min(...xs),y:Math.min(...ys),width:Math.max(...xs)-Math.min(...xs),height:Math.max(...ys)-Math.min(...ys)};}if(bb.x<-0.5||bb.y<-0.5||bb.x+bb.width>vb.width+0.5||bb.y+bb.height>vb.height+0.5)out.clip.push(k+':'+t.textContent+' '+[bb.x,bb.y,bb.width,bb.height].map(Math.round).join(',')+' vb '+vb.width+'x'+vb.height);});});
    out.allsvg=document.querySelectorAll('svg').length;return out;});
  console.log(w,JSON.stringify(r),errs.join(' | '));
  if(mode!=='nocheck'){const secs=await p.$$('section.topic');for(let i=0;i<secs.length;i++){await secs[i].screenshot({path:`${outdir}/${page_.replace('.html','')}_${mode}_${w}_s${i+1}.png`});}}
  await ctx.close();}
 await b.close();})();
