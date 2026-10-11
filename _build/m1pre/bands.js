// usage: node bands.js <unitNums comma> <width> [reveal]
const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async()=>{const b=await chromium.launch();const [us,w,rev]=process.argv.slice(2);
for(const u of us.split(',')){
const p=await b.newPage({viewport:{width:+w,height:900}});
await p.addInitScript(()=>sessionStorage.setItem('m1ok','1'));
await p.goto('http://127.0.0.1:8794/math1/M1_Unit'+u+'_PreTest.html',{waitUntil:'load'});await p.waitForTimeout(300);
if(rev)await p.click('#reveal');
await p.evaluate(()=>{const c=document.querySelector('.controls');if(c)c.style.position='static';});
const st=await p.$$('.stripe');
for(let i=0;i<st.length;i++){await st[i].screenshot({path:'shots/u'+u+'_b'+(i+1)+'_'+w+(rev?'_rev':'')+'.png'});}
await p.close();}
await b.close();})();
