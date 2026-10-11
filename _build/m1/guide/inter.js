const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async()=>{
  const b=await chromium.launch();
  for (const [w,touch] of [[390,true],[1280,false]]){
    const ctx=await b.newContext({viewport:{width:w,height:844},hasTouch:touch,isMobile:touch});
    const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
    await p.addInitScript(()=>sessionStorage.setItem('m1ok','1'));
    await p.goto('file:///home/claude/mr-allen-s-math-class/math1/nc_math1_study_guide.html'); await p.waitForTimeout(500);
    const setR=async(id,v)=>p.$eval('#'+id,(e,v)=>{e.value=v;e.dispatchEvent(new Event('input',{bubbles:true}));},v);
    await setR('mSl',-1.5); await setR('bSl',3); console.log(w,'mb:',await p.$eval('#mbOut',e=>e.textContent.slice(0,40)));
    // slider drag with real pointer
    const sl=await p.$('#gbSl'); await sl.scrollIntoViewIfNeeded(); const bb=await sl.boundingBox();
    if (touch) await p.touchscreen.tap(bb.x+bb.width*0.1,bb.y+bb.height/2); else await p.mouse.click(bb.x+bb.width*0.1,bb.y+bb.height/2);
    console.log(w,'growth after tap:',await p.$eval('#gbVal',e=>e.textContent), await p.$eval('#abOut',e=>e.textContent.slice(0,50)));
    await setR('vaSl',-2); await setR('vhSl',-1); await setR('vkSl',5); console.log(w,'vertex:',await p.$eval('#vxOut',e=>e.textContent.slice(0,90)));
    await setR('vaSl',0); console.log(w,'a=0:',await p.$eval('#vxOut',e=>e.textContent.slice(0,40)));
    await p.fill('#sx1','-1'); await p.fill('#sy1','2'); await p.fill('#sx2','3'); await p.fill('#sy2','-4'); await p.click('text=Compute slope');
    console.log(w,'slope:',await p.$eval('#slopeOut',e=>e.textContent));
    // drag point B in the midpoint picture
    const gv=await p.$('#geomViz'); await gv.scrollIntoViewIfNeeded();
    const pos=await p.evaluate(()=>{ const svg=document.querySelector('#geomViz svg'); const m=svg.getScreenCTM(); const pt=svg.createSVGPoint(); pt.x=geomPlane.X(5); pt.y=geomPlane.Y(8); const a=pt.matrixTransform(m); pt.x=geomPlane.X(7); pt.y=geomPlane.Y(2); const c=pt.matrixTransform(m); return [a.x,a.y,c.x,c.y]; });
    if (touch){ // synthesize touch-style pointer events
      await p.evaluate(([x0,y0,x1,y1])=>{ const box=document.getElementById('geomViz'); const ev=(t,x,y)=>box.dispatchEvent(new PointerEvent(t,{clientX:x,clientY:y,pointerId:7,pointerType:'touch',bubbles:true}));
        box.setPointerCapture=()=>{}; ev('pointerdown',x0,y0); ev('pointermove',(x0+x1)/2,(y0+y1)/2); ev('pointermove',x1,y1); ev('pointerup',x1,y1); }, pos);
    } else { await p.mouse.move(pos[0],pos[1]); await p.mouse.down(); await p.mouse.move((pos[0]+pos[2])/2,(pos[1]+pos[3])/2,{steps:4}); await p.mouse.move(pos[2],pos[3],{steps:4}); await p.mouse.up(); }
    console.log(w,'drag ->',await p.$eval('#mx2',e=>e.value),await p.$eval('#my2',e=>e.value),'|',await p.$eval('#geomOut',e=>e.textContent));
    console.log(w,'errors',errs); await ctx.close();
  }
  await b.close();
})();
