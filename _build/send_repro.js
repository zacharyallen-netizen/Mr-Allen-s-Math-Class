const {chromium}=require('/home/claude/.npm-global/lib/node_modules/playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844}});let sent=[];
await p.route('**/script.google.com/**',async r=>{sent.push(JSON.parse(r.request().postData()));await r.fulfill({status:200,contentType:'application/json',body:'{"ok":true,"name":"Test Student","n":1,"right":1}'})});
await p.goto('file:///home/claude/mr-allen-s-math-class/grade8/Unit3_PreTest.html');await p.waitForTimeout(300);
const st=async l=>console.log(l.padEnd(22),'|',await p.textContent('#ssbtn'),'|',await p.textContent('#ssmsg'));
// simulate grading via the API exactly as the page does
await p.evaluate(()=>{ScoreSend.record('Q1',true,{std:'NC.8.EE.7',band:3});ScoreSend.record('Q2',false,{std:'NC.8.EE.7',band:3});});await st('after check');
await p.fill('#ssname','Test Student');await p.click('#ssbtn');await p.waitForTimeout(300);await st('after send');
await p.evaluate(()=>ScoreSend.record('Q2',true));await st('after fixing Q2');
await p.click('#ssbtn');await p.waitForTimeout(300);await st('after send again');
await p.evaluate(()=>ScoreSend.reset());await st('after reset');
await p.evaluate(()=>{ScoreSend.record('Q1',true,{std:'NC.8.EE.7',band:3});ScoreSend.record('Q2',false,{std:'NC.8.EE.7',band:3});});await st('retake, same results');
console.log('sends:',sent.length,'second send final Q2 =',sent[1]&&sent[1].items[1].final,'sessions differ after reset:',sent[0].session!==await p.evaluate(()=>ScoreSend.session));
await b.close()})();
