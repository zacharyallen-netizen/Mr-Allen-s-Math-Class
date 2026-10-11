const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
const SRC='file:///home/claude/mr-allen-s-math-class/grade8/Unit_5_Pythagorean_Guided_Notes.html';
const OUT='/home/claude/mr-allen-s-math-class/grade8/';
const PDF={format:'A4',printBackground:true,scale:0.82,
  margin:{top:'0.4in',bottom:'0.4in',left:'0.35in',right:'0.35in'}};

async function go(b,query,out,key){
  const p=await b.newPage();
  await p.goto(SRC+query,{waitUntil:'load'});
  await p.waitForTimeout(450);
  if(key){
    const n=await p.evaluate(()=>{
      let filled=0;
      document.querySelectorAll('.val-chk button[onclick*="chkVal"]').forEach(btn=>{
        const oc=btn.getAttribute('onclick')||'';
        const id=oc.match(/chkVal\(\s*'([^']+)'/);
        const first=oc.match(/\[\s*"((?:[^"\\]|\\.)*)"/) || oc.match(/\[\s*'((?:[^'\\]|\\.)*)'/);
        if(!id||!first) return;
        const fb=document.getElementById('fb-'+id[1]);
        const inp=document.getElementById(id[1]+'-in');
        // only pre-fill the box when the answer is short enough to fit;
        // long worked answers would be clipped, so leave the box blank
        if(inp && first[1].length<=12){ inp.value=first[1]; inp.setAttribute('value',first[1]); }
        if(fb){ fb.innerHTML='<b>Answer:</b> '+first[1];
                fb.classList.add('show','c'); filled++; }
      });
      return filled;
    });
    console.log('   practice answers written into the key:',n);
  }
  await p.emulateMedia({media:'print'});
  await p.pdf(Object.assign({path:out},PDF));
  await p.close();
  console.log('   wrote',out.split('/').pop());
}
(async()=>{
  const b=await chromium.launch();
  await go(b,'',       OUT+'Unit5_Pythagorean_Notes_Blank.pdf',     false);
  await go(b,'?key=1', OUT+'Unit5_Pythagorean_Notes_AnswerKey.pdf', true);
  await b.close();
})();
