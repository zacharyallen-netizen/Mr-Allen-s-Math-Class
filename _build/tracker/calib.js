const {load}=require("./mockgas");
for(const gain of [0,0.4,0.8,1.6]){ for(const seed0 of [11,23,37]){
const G=load(__dirname+"/ScoreTracker_v2.gs");G.setup();const ss=Object.values(G.__books)[0];
const post=d=>JSON.parse(G.doPost({postData:{contents:JSON.stringify(d)}}).s);
let seed=seed0;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;const lg=x=>1/(1+Math.exp(-x));
for(let i=0;i<40;i++){const ab=rnd()*3-1.5,items=[];[3,4,5].forEach((b,bi)=>{for(let k=1;k<=6;k++){const ok=rnd()<lg(1.7*(ab-[-1.2,0,1.3][bi]))?1:0;items.push({id:"Q"+(bi*6+k),std:"NC.8.EE.7",band:b,first:ok,final:ok})}});
post({code:"allen-8th",v:2,kind:"pretest",unit:"3",page:"P",name:"S"+i+" X",session:"a"+i,items});
ss.getSheetByName("Responses").data.forEach((r,j)=>{if(j&&r[2]==="Pre-test")r[0]=new Date(Date.now()-9e8)});
const it2=[];for(let k=1;k<=12;k++){const ok=rnd()<lg(1.7*(ab+gain))?1:0;it2.push({id:"p"+k,std:"NC.8.EE.7",band:4,first:ok,final:1})}
post({code:"allen-8th",v:2,kind:"practice",unit:"3",page:"Q",name:"S"+i+" X",session:"b"+i,items:it2});}
G.refreshReports();const g=ss.getSheetByName("Statistics").data.find(r=>r[0]==="All standards");console.log("gain",gain,"seed",seed0,JSON.stringify(g.slice(3)));}}
