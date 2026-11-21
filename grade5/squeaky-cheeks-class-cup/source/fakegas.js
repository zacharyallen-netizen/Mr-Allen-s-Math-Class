// Minimal fake of the Apps Script services Code.gs uses, so the real script can be tested in Node.
const vm=require('vm'),fs=require('fs');
function makeEnv(){
  const sheets={};let order=[];
  function Sheet(name){const rows=[];const sh={name,rows,
    getName:()=>name,getLastRow:()=>rows.length,
    appendRow:r=>{rows.push(r.map(String).map((v,i)=>r[i]))},
    getRange:(a,b,c,d)=>{if(typeof a==='string')return {setNumberFormat(){return this}};const r0=a-1,c0=b-1,nr=c||1,nc=d||1;
      const rng={getValue:()=>((rows[r0]||[])[c0]),setValue:v=>{while(rows.length<=r0)rows.push([]);rows[r0][c0]=v;return rng},
        getValues:()=>Array.from({length:nr},(_,i)=>Array.from({length:nc},(_,j)=>((rows[r0+i]||[])[c0+j]??''))),
        getDisplayValues:()=>rng.getValues().map(r=>r.map(String)),
        setValues:v=>{v.forEach((row,i)=>row.forEach((x,j)=>{while(rows.length<=r0+i)rows.push([]);rows[r0+i][c0+j]=x}));return rng},
        clearContent:()=>{for(let i=0;i<nr;i++)for(let j=0;j<nc;j++)if(rows[r0+i])rows[r0+i][c0+j]='';return rng},
        setFontWeight(){return rng},setFontSize(){return rng},setNumberFormat(){return rng}};return rng},
    setColumnWidth(){},clear:()=>{rows.length=0}};return sh}
  const ss={getId:()=>'ID',getSheetByName:n=>sheets[n]||null,insertSheet:n=>{sheets[n]=Sheet(n);order.push(n);return sheets[n]},getSheets:()=>order.map(n=>sheets[n]),deleteSheet:s=>{delete sheets[s.name];order=order.filter(n=>n!==s.name)}};
  ss.insertSheet('Sheet1');
  const cache={};const props={};
  const ctx={SpreadsheetApp:{getActiveSpreadsheet:()=>ss,openById:()=>ss,flush(){},getUi:()=>{throw new Error('no ui')}},
    CacheService:{getScriptCache:()=>({get:k=>cache[k]||null,put:(k,v)=>{cache[k]=v},remove:k=>{delete cache[k]}})},
    PropertiesService:{getScriptProperties:()=>({getProperty:k=>props[k],setProperty:(k,v)=>{props[k]=v}})},
    LockService:{getScriptLock:()=>({tryLock:()=>true,waitLock(){},releaseLock(){}})},
    Utilities:{formatDate:(d,tz,f)=>f.includes('HH')?'2026-11-21 10:00':'2026-11-21'},Session:{getScriptTimeZone:()=>'America/New_York'},
    HtmlService:{createHtmlOutputFromFile:()=>({setTitle(){return this},addMetaTag(){return this},setXFrameOptionsMode(){return this}}),XFrameOptionsMode:{DEFAULT:1}},
    console};
  vm.createContext(ctx);vm.runInContext(fs.readFileSync(__dirname+'/'+(require('fs').existsSync(__dirname+'/Code.gs')?'Code.gs':'../Code.gs'),'utf8'),ctx);
  return {ctx,ss,sheets};
}
module.exports={makeEnv};
if(require.main===module){
  const {ctx,sheets}=makeEnv();const assert=require('assert');
  ctx.setup();
  assert.deepStrictEqual(Object.keys(sheets).sort(),['Daily','Past Contests','Read Me','Totals']);
  let b=ctx.getBoard();assert.strictEqual(b.classes.length,2);assert.strictEqual(b.classes[0].points,0);
  b=ctx.addPoints('Ms. Tesnar',5);assert.strictEqual(b.classes[0].points,5);
  ctx.addPoints('Ms. Tesnar',10);b=ctx.addPoints('Ms. Covalt',7);
  assert.strictEqual(b.classes[0].points,15);assert.strictEqual(b.classes[1].points,7);
  assert.strictEqual(sheets.Daily.rows.length,3);   // header + one row per class for today
  for(const bad of [['Mr. X',1],['Ms. Tesnar',0],['Ms. Tesnar',61],['Ms. Tesnar','abc'],['Ms. Tesnar',-5]]){let threw=false;try{ctx.addPoints(...bad)}catch(e){threw=true}assert(threw,'should refuse '+bad)}
  sheets.Totals.getRange(2,3).setValue(22);sheets.Totals.getRange(3,3).setValue(20);
  ctx.CacheService.getScriptCache().remove('board');b=ctx.getBoard();assert.strictEqual(b.classes[0].students,22);
  ctx.newContest();b=ctx.getBoard();assert.strictEqual(b.classes[0].points,0);assert.strictEqual(sheets['Past Contests'].rows.length,3);assert.strictEqual(sheets.Daily.rows.slice(1).filter(r=>r[0]).length,0);
  ctx.setup();assert.strictEqual(sheets.Totals.rows.length,3,'setup twice must not duplicate rows');
  // nothing personal anywhere
  assert(!/Session\.getActiveUser|getEmail/.test(fs.readFileSync(__dirname+'/'+(require('fs').existsSync(__dirname+'/Code.gs')?'Code.gs':'../Code.gs'),'utf8')));
  console.log('Code.gs tests passed');
}
