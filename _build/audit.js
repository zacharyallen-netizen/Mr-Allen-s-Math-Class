// Load every page at 1280 and 390; record page errors, sideways scroll, and fixed elements sitting over the top bar.
const {chromium}=require('/home/claude/.npm-global/lib/node_modules/playwright');
const fs=require('fs');const IGN=/fonts\.googleapis|fonts\.gstatic|ERR_TUNNEL|Failed to load resource|AudioContext|net::ERR/;
const ROOT=process.argv[2], OUT=process.argv[3], pages=fs.readFileSync(process.argv[4],'utf8').trim().split('\n');
(async()=>{const b=await chromium.launch();const res={};
for(const pg of pages){res[pg]={};
 for(const w of [1280,390]){const p=await b.newPage({viewport:{width:w,height:w>500?900:844}});const e=[];
  p.on('pageerror',x=>e.push(x.message.slice(0,120)));p.on('console',m=>{if(m.type()==='error'&&!IGN.test(m.text()))e.push(m.text().slice(0,120))});
  p.on('dialog',d=>d.dismiss());
  try{await p.goto('file://'+ROOT+'/'+pg,{timeout:15000});await p.waitForTimeout(500);}catch(x){e.push('load '+x.message.slice(0,80))}
  let r={};try{r=await p.evaluate(()=>{const bar=document.getElementById('site-bar');const bh=bar?bar.getBoundingClientRect().bottom:0;
   const over=[];for(const el of document.querySelectorAll('body *')){if(el.id==='site-bar'||(bar&&bar.contains(el)))continue;const cs=getComputedStyle(el);
    if((cs.position==='fixed'||cs.position==='sticky')&&cs.display!=='none'&&cs.visibility!=='hidden'){const rc=el.getBoundingClientRect();
     if(rc.width>0&&rc.height>0&&rc.top<bh-2&&rc.bottom>0)over.push((el.tagName+'.'+(el.className||'')+'#'+el.id).slice(0,60)+'@'+Math.round(rc.top)+'/'+cs.position);}}
   const bo=getComputedStyle(document.body).overflow+'/'+getComputedStyle(document.documentElement).overflow;
   return {bar:!!bar,bh:Math.round(bh),sw:document.documentElement.scrollWidth,sh:document.documentElement.scrollHeight,ih:innerHeight,over,bo,
     local:!!document.querySelector('.sb-local')}})}catch(x){e.push('eval '+x.message.slice(0,80))}
  r.err=e;res[pg][w]=r;await p.close();}}
fs.writeFileSync(OUT,JSON.stringify(res,null,1));await b.close();console.log('audited',pages.length);})();
