const NUDGE='Look at the yellow numbers again.';
const ENDNOTES=['Excellent! Same to both, every time.','Strong set. Keep going!',
  'Good work. Find × or ÷ first.','Go again. It gets easier.'];
function gcd(a,b){a=Math.abs(a);b=Math.abs(b);while(b){[a,b]=[b,a%b];}return a||1;}

/* ---------- problems ----------
   1 simplify   2 equivalent   3 unit rate (? : 1)   4 proportion, ? top left
   5 proportion, ? in any spot   6 mix of 1–5
   Proportion: cols = the two fractions in the order written, [top,bottom].
   S = the full fraction, T = the one with the ?, (ur) = row of the ?.
   T = S ÷ m (T is the small one) or T = S × m (T is the big one). */
function makeProp(T,ur,big){
  const x=rnd(2,9); let b; do{b=rnd(2,9);}while(b===x); const m=rnd(2,4);
  const small=[x,b], large=[x*m,b*m], S=1-T, cols=[];
  cols[T]=(big?large:small).slice(); cols[S]=(big?small:large).slice();
  const ans=cols[T][ur]; cols[T][ur]=null;
  return {kind:'prop',cols,T,S,ur,m,op:big?'×':'÷',ans};
}
function gen(L){
  if(L===6) L=rnd(1,5);
  if(L===1){let bn,bd;do{bn=rnd(1,8);bd=rnd(1,8);}while(gcd(bn,bd)!==1||bn===bd);const k=rnd(2,6);
    return {kind:'simp',bn,bd,k,N:bn*k,D:bd*k};}
  if(L===2){let bn,bd;do{bn=rnd(1,8);bd=rnd(1,8);}while(gcd(bn,bd)!==1||bn===bd);const k=rnd(2,6);
    return {kind:'equiv',bn,bd,k,ans:bn*k};}
  if(L===3){const rate=rnd(10,60),time=rnd(2,9),total=rate*time;
    return {kind:'unit',rate,time,total,ans:rate};}
  if(L===4) return makeProp(0,0,false);                 // ?/4 = 6/8
  let T,ur,big; do{T=rnd(0,1);ur=rnd(0,1);big=Math.random()<0.5;}while(T===0&&ur===0&&!big);   // not the level 4 shape
  return makeProp(T,ur,big);
}
const m=t=>`<span class="m">${t}</span>`, colon=`<span class="op c">:</span>`;
function frac(t,b){ return `<span class="frac"><span>${t}</span><i class="sl">/</i><span>${b}</span></span>`; }
// the problem line; the ? turns into the answer when you finish
function probH(p,done){
  const A=v=>done?`<span class="mint">${v}</span>`:`<span class="qm">?</span>`;
  if(p.kind==='simp')  return `Simplify ${m(p.N)}${colon}${m(p.D)}`+(done?` <span class="op">=</span> <span class="mint m nw">${p.bn}${colon}${p.bd}</span>`:'');
  if(p.kind==='equiv') return `${m(p.bn)}${colon}${m(p.bd)} <span class="op">=</span> ${m(A(p.ans))}${colon}${m(p.bd*p.k)}`;
  if(p.kind==='unit')  return `${m(p.total)}${colon}${m(p.time)} <span class="op">=</span> ${m(A(p.rate))}${colon}${m(1)}`;
  const F=c=>frac(...[0,1].map(r=>p.cols[c][r]===null?A(p.ans):p.cols[c][r]));
  return `${F(0)} <span class="op">=</span> ${F(1)}`;
}

/* ---------- the moves for one problem ---------- */
const cellBox=(c,r)=>({c,r}), arrBox=(a,r)=>({a,r:r||0});
// type a number into a table cell; then it turns mint
function cellMove(o){ return Object.assign({kind:'type', after:async()=>{ const {c,r}=o.box;
  V.cols[c][r]=o.expect; V.newc.push(`c${c}r${r}`); V.justKey=`c${c}r${r}`; draw(); await wait(450); return ''; }}, o); }
// type the × or ÷ number in the row you are looking at; it is copied to the other row
function arrMove(o){ const r=o.row||0; return Object.assign({kind:'type', box:arrBox(0,r), after:async()=>{
  V.arrows[0].k=o.expect; V.pendRow=1-r; V.hotArr=true; draw();
  await fly($('a0r'+r), $('a0r'+(1-r)), arrTxt(0), 20); V.pendRow=null; V.hotArr=true; draw(); await wait(250); return ''; }}, o); }
const DIV='Divide the yellow numbers again.', MUL='Multiply the yellow numbers again.';
function buildMoves(p){
  if(p.kind==='simp') return [
    arrMove({hl:['c0r0','c0r1'], expect:p.k, calc:`G(${p.N},${p.D})`,
      say:`Biggest number that goes into <b>${p.N}</b> and <b>${p.D}</b>?`,
      partial:v=>(v>1&&v<p.k&&p.N%v===0&&p.D%v===0)?`<b>${v}</b> works. Find a bigger one.`:'',
      nudge:`It must go into both evenly.`}),
    cellMove({box:cellBox(1,0), hl:['c0r0','a0'], expect:p.bn, calc:`${p.N}/${p.k}`,
      say:`Divide the top: <b>${p.N} ÷ ${p.k}</b>`, nudge:DIV}),
    cellMove({box:cellBox(1,1), hl:['c0r1','a0'], expect:p.bd, calc:`${p.D}/${p.k}`,
      say:`Divide the bottom: <b>${p.D} ÷ ${p.k}</b>`, nudge:DIV})
  ];
  if(p.kind==='equiv'){ const B=p.bd*p.k; return [
    arrMove({row:1, hl:['c0r1','c1r1'], expect:p.k, calc:`${B}/${p.bd}`,
      say:`<b>${p.bd}</b> times what is <b>${B}</b>?`, nudge:`Count by ${p.bd}s to ${B}.`}),
    cellMove({box:cellBox(1,0), hl:['c0r0','a0'], expect:p.ans, calc:`${p.bn}*${p.k}`,
      say:`Same to the top: <b>${p.bn} × ${p.k}</b>`, nudge:MUL})
  ]; }
  if(p.kind==='unit') return [
    cellMove({box:cellBox(1,0), hl:['c0r0','a0'], expect:p.rate, calc:`${p.total}/${p.time}`,
      say:`Divide the top: <b>${p.total} ÷ ${p.time}</b>`, nudge:DIV})
  ];
  // proportion: find the × or ÷ on the full row, then do it to the other row
  const {S,T,ur,m:k,op}=p, kr=1-ur, s=p.cols[S], t=p.cols[T], row=['top','bottom'];
  return [
    arrMove({row:kr, hl:[`c${S}r${kr}`,`c${T}r${kr}`], expect:k, calc:op==='×'?`${t[kr]}/${s[kr]}`:`${s[kr]}/${t[kr]}`,
      say:op==='×'?`<b>${s[kr]}</b> times what is <b>${t[kr]}</b>?`:`Divide: <b>${s[kr]} ÷ ${t[kr]}</b>`,
      nudge:op==='×'?`Count by ${s[kr]}s to ${t[kr]}.`:DIV}),
    cellMove({box:cellBox(T,ur), hl:[`c${S}r${ur}`,'a0'], expect:p.ans, calc:`${s[ur]}${op==='×'?'*':'/'}${k}`,
      say:`Same to the ${row[ur]}: <b>${s[ur]} ${op} ${k}</b>`, nudge:op==='×'?MUL:DIV})
  ];
}
function answerText(){ const p=current;
  if(p.kind==='simp')  return `${p.N} : ${p.D} = ${p.bn} : ${p.bd}`;
  if(p.kind==='equiv') return `${p.bn} : ${p.bd} = ${p.ans} : ${p.bd*p.k}`;
  if(p.kind==='unit')  return `${p.total} : ${p.time} = ${p.rate} : 1`;
  const f=c=>p.cols[c].map(v=>v===null?p.ans:v).join('/');
  return `${f(0)} = ${f(1)}`;
}

/* ---------- drawing ---------- */
let V={};
function resetVisual(){
  const p=current; V={open:null,hl:null,done:false,newc:[],justKey:null,hotArr:false,labels:null,cols:null,arrows:null,back:false};
  if(p.kind==='simp'){ V.cols=[[p.N,p.D],[null,null]]; V.arrows=[{op:'÷',k:null}]; }
  if(p.kind==='equiv'){ V.cols=[[p.bn,p.bd],[null,p.bd*p.k]]; V.arrows=[{op:'×',k:null}]; }
  if(p.kind==='unit'){ V.cols=[[p.total,p.time],[null,1]]; V.arrows=[{op:'÷',k:p.time}]; }
  if(p.kind==='prop'){ V.labels=['top','bottom']; V.cols=p.cols.map(c=>c.slice()); V.arrows=[{op:p.op,k:null}]; V.back=p.S===1; }
}
const arrTxt=a=>`${V.arrows[a].op} ${V.arrows[a].k}`;
function isHot(key){ return Array.isArray(V.hl)&&V.hl.includes(key); }
function cellH(c,r){
  const v=V.cols[c][r], key=`c${c}r${r}`, o=V.open;
  if(o&&o.box&&o.box.c===c&&o.box.r===r) return `<span class="cell open" id="${key}">${boxHTML(o,'sm')}</span>`;
  const cls=['cell']; if(v===null) cls.push('q'); if(isHot(key)) cls.push('hot'); if(V.newc.includes(key)) cls.push('new'); if(V.justKey===key) cls.push('pop');
  return `<span class="${cls.join(' ')}" id="${key}">${v===null?'?':v}</span>`;
}
// the arrow points from the full fraction to the one with the ?
function arrH(a,r){
  const A=V.arrows[a], o=V.open, here=o&&o.box&&o.box.a===a&&o.box.r===r, k=(a===0&&V.pendRow===r)?null:A.k;
  const cls=['arr']; if(k===null && !here) cls.push('unk'); if(isHot('a'+a)||(V.hotArr&&a===0)) cls.push('hot');
  const inner=here?`${A.op} ${boxHTML(o,'sm')}`:`${A.op} ${k===null?'?':k}`;
  return V.back?`<span class="${cls.join(' ')}" id="a${a}r${r}"><i>←</i> ${inner}</span>`
               :`<span class="${cls.join(' ')}" id="a${a}r${r}">${inner} <i>→</i></span>`;
}
function tableH(){
  const n=V.cols.length; let h=`<div class="rt" style="grid-template-columns:${V.labels?'auto ':''}repeat(${2*n-1},auto)">`;
  for(let r=0;r<2;r++){
    if(V.labels) h+=`<span class="rlab">${V.labels[r]}</span>`;
    for(let c=0;c<n;c++){ h+=cellH(c,r); if(c<n-1) h+=arrH(c,r); }
  }
  return h+'</div>';
}
function draw(){
  $('prob').innerHTML=probH(current,V.done);
  $('rvis').innerHTML=tableH();
  // scale the table down if a phone screen is too narrow for it
  const t=$('rvis').firstElementChild; if(t){ t.style.transform=''; const k=$('rvis').clientWidth/t.scrollWidth; if(k<1){ t.style.transform=`scale(${k})`; t.style.transformOrigin='center top'; } }
  V.justKey=null; V.hotArr=false;
}
