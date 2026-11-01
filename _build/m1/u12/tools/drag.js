const {chromium}=require('/home/claude/.npm-global/lib/node_modules/playwright');
(async()=>{const b=await chromium.launch();
for(const touch of [false,true]){const ctx=await b.newContext({viewport:{width:390,height:844},hasTouch:touch,isMobile:touch});const p=await ctx.newPage();
await p.addInitScript(()=>sessionStorage.setItem('m1ok','1'));await p.goto('http://localhost:8812/math1/unit2-notes.html');
const svg=p.locator('#p2lab svg');await svg.scrollIntoViewIfNeeded();const bb=await svg.boundingBox();
const before=await p.locator('#p2lab .lab-out').textContent();
if(touch){await p.evaluate(({x,y,x2})=>{const el=document.querySelector('#p2lab .lab-svg');const mk=(t,cx)=>el.dispatchEvent(new PointerEvent(t,{clientX:cx,clientY:y,pointerId:1,pointerType:'touch',bubbles:true}));mk('pointerdown',x);mk('pointermove',x2);mk('pointerup',x2);},{x:bb.x+bb.width*0.5,y:bb.y+bb.height*0.5,x2:bb.x+bb.width*0.2});}
else{await p.mouse.move(bb.x+bb.width*0.5,bb.y+bb.height*0.5);await p.mouse.down();await p.mouse.move(bb.x+bb.width*0.85,bb.y+bb.height*0.5,{steps:5});await p.mouse.up();}
const after=await p.locator('#p2lab .lab-out').textContent();console.log(touch?'touch':'mouse','before:',before,'| after:',after);
// sliders via keyboard/fill
const r=p.locator('#p3lab input[type=range]').first();await r.fill('-2');console.log('slope lab:',await p.locator('#p3lab .lab-out').textContent());
const r2=p.locator('#p1lab input[type=range]');await r2.fill('2');console.log('vlt:',await p.locator('#p1lab .lab-out').textContent());
await ctx.close();}
const ctx=await b.newContext({viewport:{width:390,height:844}});const p=await ctx.newPage();await p.addInitScript(()=>sessionStorage.setItem('m1ok','1'));
await p.goto('http://localhost:8812/math1/unit2-practice.html');const ins=p.locator('#c6-lab input[type=range]');await ins.nth(0).fill('0.5');await ins.nth(1).fill('1');await p.locator('#c6-lab button').click();
console.log('matchLine:',await p.locator('#fb-c6').textContent(),'|',await p.locator('#score').textContent());
await p.goto('http://localhost:8812/math1/unit1-notes.html');await p.locator('#n3lab input').fill('6');console.log('balance:',await p.locator('#n3lab .lab-out').textContent());
await b.close();})();
