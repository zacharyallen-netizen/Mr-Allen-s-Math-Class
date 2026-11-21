/*Q5-START*/
/* 5th grade question bank: NC.5.NF.4 (multiply fractions, area with fractional sides, scaling, word problems), NC.5.NF.7 + NC.6.NS.1 (divide fractions, flip and multiply)
   and NC.5.MD.4 / NC.5.MD.5 (volume of rectangular prisms). Every problem shows a model (NC: "models must always be used").
   Limits from the NCDPI unpacking: fraction x whole denominators 2,3,4,5,6,8,10,12; fraction x fraction (and area models)
   denominators 2,3,4; volume edges whole numbers; composite = two prisms, one-digit dimensions. */
const Q5=(function(){
const ri=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
/* a numerator for denominator b in simplest form (2/4 -> never) */
const rnum=b=>{let a;do{a=1+Math.floor(Math.random()*(b-1))}while(gcdQ(a,b)!==1);return a};
function gcdQ(a,b){while(b){[a,b]=[b,a%b]}return a}
const pick=a=>a[Math.floor(Math.random()*a.length)];
const gcd=(a,b)=>{a=Math.abs(a);b=Math.abs(b);while(b){[a,b]=[b,a%b]}return a||1};
const red=(n,d)=>{const g=gcd(n,d);return [n/g,d/g]};
const eqv=(a,b)=>a[0]*b[1]===b[0]*a[1];
const frH=(n,d)=>`<span class="fr"><span class="n">${n}</span><span class="d">${d}</span></span>`;
/* value [N,D] -> nice HTML: whole, fraction or mixed number (simplest form) */
function valH(N,D){const [n,d]=red(N,D);if(d===1)return String(n);if(n<d)return frH(n,d);return `<span class="mx">${Math.floor(n/d)}${frH(n%d,d)}</span>`}
function valT(N,D){const [n,d]=red(N,D);if(d===1)return String(n);if(n<d)return n+'/'+d;return Math.floor(n/d)+' '+(n%d)+'/'+d}
/* a side length like 1 1/2 -> {n:3,d:2} shown as "1 1/2" */
const NAMES=['Ava','Mateo','Jada','Liam','Sofia','Malik','Chloe','Diego','Nia','Owen','Zoe','Eli'];

/* ---------------- figures (SVG strings) ---------------- */
const C={ink:'#fff6e8',muted:'#bdb3d9',line:'#0f0d18',top:['#a8e47a','#ffe08a','#9ad0ff'],left:['#5ea83a','#d1a43a','#3f87c4'],right:['#7cc54f','#e8bf55','#5ea6e0'],shade:'#9be15d',shade2:'#ff7aa2',empty:'#231f37',grid:'#4a4370'};
function svg(w,h,body,label){return `<svg class="fig" viewBox="0 0 ${w} ${h}" role="img" aria-label="${label||'Model'}" xmlns="http://www.w3.org/2000/svg">${body}</svg>`}
function txt(x,y,s,o){o=o||{};return `<text x="${x}" y="${y}" fill="${o.c||C.ink}" font-size="${o.fs||14}" font-weight="${o.fw||600}" text-anchor="${o.a||'middle'}" font-family="Fredoka,Trebuchet MS,sans-serif">${s}</text>`}
/* isometric unit cubes. cubes = [{x,y,z,c}], c = color index. labels: [{p1:[x,y,z],p2:[x,y,z],t,side}] */
function voxels(cubes,labels,label){
  const set=new Set(cubes.map(q=>q.x+','+q.y+','+q.z));const has=(x,y,z)=>set.has(x+','+y+','+z);
  let maxX=0,maxY=0,maxZ=0;cubes.forEach(q=>{maxX=Math.max(maxX,q.x+1);maxY=Math.max(maxY,q.y+1);maxZ=Math.max(maxZ,q.z+1)});
  const W=300,H=190,cs=.866;
  const spanX=(maxX+maxY)*cs,spanY=(maxX+maxY)*.5+maxZ;
  const s=Math.min(22,(W-70)/spanX,(H-44)/spanY);
  const P=(x,y,z)=>[(x-y)*cs*s,(x+y)*.5*s-z*s];
  /* center */
  const minSX=-maxY*cs*s,maxSX=maxX*cs*s,minSY=-maxZ*s,maxSY=(maxX+maxY)*.5*s;
  const ox=W/2-(minSX+maxSX)/2,oy=(H-6)/2-(minSY+maxSY)/2;
  const pt=(x,y,z)=>{const p=P(x,y,z);return (p[0]+ox).toFixed(1)+','+(p[1]+oy).toFixed(1)};
  const poly=(pts,f)=>`<polygon points="${pts.map(p=>pt(...p)).join(' ')}" fill="${f}" stroke="${C.line}" stroke-width="1.1" stroke-linejoin="round"/>`;
  const order=cubes.slice().sort((a,b)=>(a.x+a.y+a.z)-(b.x+b.y+b.z)||a.z-b.z);
  let out='';
  for(const q of order){const {x,y,z}=q,c=q.c||0;
    if(!has(x,y,z+1))out+=poly([[x,y,z+1],[x+1,y,z+1],[x+1,y+1,z+1],[x,y+1,z+1]],C.top[c]);
    if(!has(x+1,y,z))out+=poly([[x+1,y,z],[x+1,y+1,z],[x+1,y+1,z+1],[x+1,y,z+1]],C.right[c]);
    if(!has(x,y+1,z))out+=poly([[x,y+1,z],[x+1,y+1,z],[x+1,y+1,z+1],[x,y+1,z+1]],C.left[c]);
  }
  for(const L of (labels||[])){const a=P(...L.p1),b=P(...L.p2);let mx=(a[0]+b[0])/2+ox,my=(a[1]+b[1])/2+oy;
    const off=L.side==='r'?[14,12]:L.side==='l'?[-14,12]:L.side==='h'?[8,0]:[0,0];
    out+=txt((mx+off[0]).toFixed(1),(my+off[1]+4).toFixed(1),L.t,{a:L.side==='h'?'start':'middle'})}
  return svg(W,H,out,label);
}
function boxFig(l,w,h,u,opt){opt=opt||{};const cubes=[];
  for(let x=0;x<l;x++)for(let y=0;y<w;y++)for(let z=0;z<h;z++)cubes.push({x,y,z,c:0});
  const lab=[];if(!opt.noLabels){
    lab.push({p1:[0,w,0],p2:[l,w,0],t:opt.lT||(l+' '+u),side:'l'});   /* bottom-left edge = length */
    lab.push({p1:[l,0,0],p2:[l,w,0],t:opt.wT||(w+' '+u),side:'r'});   /* bottom-right edge = width */
    lab.push({p1:[l,0,0],p2:[l,0,h],t:opt.hT||(h+' '+u),side:'h'});   /* right vertical edge = height */
  }
  return voxels(cubes,lab,opt.label||`A box ${l} by ${w} by ${h} made of unit cubes`);
}
/* fraction area model: rectangle P x Q (fractions as [n,d]) on a grid of whole units, each unit cut into dp columns and dq rows */
function areaFig(p,q,opt){opt=opt||{};
  const [pn,pd]=p,[qn,qd]=q,ux=Math.ceil(pn/pd),uy=Math.ceil(qn/qd);
  const W=300,H=180,padL=46,padT=26,cell=Math.min((W-padL-14)/Math.max(ux,1),(H-padT-14)/Math.max(uy,1),110);
  let out='';const X=v=>padL+v*cell,Y=v=>padT+v*cell;
  out+=`<rect x="${X(0)}" y="${Y(0)}" width="${ux*cell}" height="${uy*cell}" fill="${C.empty}"/>`;
  out+=`<rect x="${X(0)}" y="${Y(0)}" width="${(pn/pd*cell).toFixed(2)}" height="${(qn/qd*cell).toFixed(2)}" fill="${C.shade}" opacity=".9"/>`;
  for(let i=0;i<=ux*pd;i++){const x=X(i/pd);out+=`<line x1="${x.toFixed(2)}" y1="${Y(0)}" x2="${x.toFixed(2)}" y2="${Y(uy)}" stroke="${i%pd===0?C.ink:C.grid}" stroke-width="${i%pd===0?2:1}"${i%pd===0?'':' stroke-dasharray="3 3"'}/>`}
  for(let j=0;j<=uy*qd;j++){const y=Y(j/qd);out+=`<line x1="${X(0)}" y1="${y.toFixed(2)}" x2="${X(ux)}" y2="${y.toFixed(2)}" stroke="${j%qd===0?C.ink:C.grid}" stroke-width="${j%qd===0?2:1}"${j%qd===0?'':' stroke-dasharray="3 3"'}/>`}
  out+=`<rect x="${X(0)}" y="${Y(0)}" width="${(pn/pd*cell).toFixed(2)}" height="${(qn/qd*cell).toFixed(2)}" fill="none" stroke="#d6ff9e" stroke-width="3"/>`;
  out+=txt((X(0)+pn/pd*cell/2).toFixed(1),Y(0)-8,opt.pT||valT(pn,pd)+(opt.u?' '+opt.u:''));
  out+=txt(X(0)-6,(Y(0)+qn/qd*cell/2+5).toFixed(1),opt.qT||valT(qn,qd)+(opt.u?' '+opt.u:''),{a:'end'});
  if(ux===1&&uy===1)out+=txt(X(1)-4,Y(1)+14,'1 whole = 1 by 1',{fs:11,c:C.muted,a:'end'});
  return svg(W,H+4,out,opt.label||'Area model');
}
/* n groups of a/b: n bars, each cut into b parts, a shaded */
function groupsFig(n,a,b){const W=300,rowH=Math.min(24,150/n),gap=Math.min(6,rowH*.25),H=n*(rowH+gap)+8,x0=56,bw=W-x0-10;
  let out='';for(let r=0;r<n;r++){const y=4+r*(rowH+gap);out+=txt(x0-8,y+rowH*.72,`${a}/${b}`,{a:'end',fs:Math.min(14,rowH*.7)});
    for(let k=0;k<b;k++){out+=`<rect x="${(x0+k*bw/b).toFixed(1)}" y="${y}" width="${(bw/b).toFixed(1)}" height="${rowH-1}" fill="${k<a?C.shade:C.empty}" stroke="${C.line}" stroke-width="1.2"/>`}}
  return svg(W,H,out,`${n} bars, each with ${a} of ${b} parts shaded`);
}
/* a/b of N: one tape of length N cut into b equal parts, a shaded */
function tapeFig(a,b,N,u){const W=300,H=78,x0=10,bw=W-20,y=30;let out='';
  out+=`<path d="M${x0} 22 v-6 h${bw} v6" fill="none" stroke="${C.muted}" stroke-width="2"/>`+txt(W/2,13,N+(u?' '+u:''));
  for(let k=0;k<b;k++)out+=`<rect x="${(x0+k*bw/b).toFixed(1)}" y="${y}" width="${(bw/b).toFixed(1)}" height="26" fill="${k<a?C.shade:C.empty}" stroke="${C.line}" stroke-width="1.2"/>`;
  const sw=a*bw/b;out+=`<path d="M${x0} 62 v6 h${sw.toFixed(1)} v-6" fill="none" stroke="#d6ff9e" stroke-width="2"/>`+txt((x0+sw/2).toFixed(1),76,'?',{c:'#d6ff9e'});
  return svg(W,H+4,out,`A tape of ${N} cut into ${b} equal parts with ${a} shaded`);
}
/* number line 0..3 with the scale factor marked */
function lineFig(fn,fd){const W=300,H=60,x0=16,x1=W-16,max=Math.max(2,Math.ceil(fn/fd+.01)),X=v=>x0+(x1-x0)*v/max;let out='';
  out+=`<line x1="${x0}" y1="30" x2="${x1}" y2="30" stroke="${C.ink}" stroke-width="2"/>`;
  for(let v=0;v<=max;v++)out+=`<line x1="${X(v)}" y1="22" x2="${X(v)}" y2="38" stroke="${C.ink}" stroke-width="2"/>`+txt(X(v),54,v,{fs:13,c:v===1?'#ffe08a':C.ink});
  out+=`<rect x="${X(1)-1.5}" y="16" width="3" height="28" fill="#ffe08a"/>`;
  const x=X(fn/fd);out+=`<circle cx="${x.toFixed(1)}" cy="30" r="7" fill="${C.shade2}" stroke="${C.line}" stroke-width="2"/>`+txt(x.toFixed(1),13,valT(fn,fd),{c:C.shade2});
  return svg(W,H,out,`Number line from 0 to ${max} with ${valT(fn,fd)} marked`);
}

/* ---------------- problem builders ---------------- */
/* kinds: num (whole number box), frac (whole + fraction boxes, any equal value), choice (tap) */
function mk(o){o.key=o.key||o.text;
  /* a note is only for a WRONG answer: a mistake value that equals the right answer is ignored */
  if(o.why&&o.kind!=='choice'){const w0=o.why,A=o.kind==='frac'?o.ans:[o.ans,1];o.why=g=>eqv(g,A)?'':w0(g)}
  return o}
function noteFrom(list,g){for(const m of list){if(m.v!=null&&eqv(g,Array.isArray(m.v)?m.v:[m.v,1]))return m.t}return ''}

/* ----- volume ----- */
const UNITS=[['cm','cubic cm'],['in','cubic in'],['ft','cubic ft'],['m','cubic m']];
function volCount(){const l=ri(2,4),w=ri(2,3),h=ri(1,3),V=l*w*h;
  return mk({kind:'num',std:'NC.5.MD.4',key:`vc${l}${w}${h}`,ans:V,unit:'cubes',
    html:`<span class="ptxt">How many unit cubes make this box?</span>`,text:`count cubes ${l}x${w}x${h}`,
    fig:boxFig(l,w,h,'',{noLabels:true}),show:`${l} × ${w} × ${h} = ${V} cubes`,
    why:g=>noteFrom([{v:l*w,t:`That is one layer. There are ${h} layers.`},{v:l+w+h,t:'You added the edges. Count one layer, then multiply by the layers.'},{v:l*h,t:'That is just the front. The box goes back too.'},{v:w*h,t:'That is just one side. Count the cubes in one layer first.'}],g)})}
function volBox(){const l=ri(2,8),w=ri(2,6),h=ri(2,7),[u,cu]=pick(UNITS),V=l*w*h;
  return mk({kind:'num',std:'NC.5.MD.5',key:`vb${l}${w}${h}`,ans:V,unit:cu,
    html:`<span class="ptxt">Find the volume of the box.</span>`,text:`volume ${l}x${w}x${h}`,
    fig:boxFig(l,w,h,u),show:`${l} × ${w} × ${h} = ${V} ${cu}`,
    why:g=>noteFrom([{v:l+w+h,t:'You added the edges. Volume = length × width × height.'},{v:l*w,t:'That is the area of the base. Multiply by the height too.'},{v:l*h,t:'You used only two edges. Multiply all three.'},{v:w*h,t:'You used only two edges. Multiply all three.'},{v:2*(l*w+l*h+w*h),t:'That counts the outside faces. Volume counts the cubes inside.'}],g)})}
function volBase(){const l=ri(2,9),w=ri(2,6),h=ri(2,9),B=l*w,[u,cu]=pick(UNITS),V=B*h;
  return mk({kind:'num',std:'NC.5.MD.5',key:`vB${B}${h}`,ans:V,unit:cu,
    html:`<span class="ptxt">The base of this box has an area of <b>${B} square ${u}</b>. The height is <b>${h} ${u}</b>. What is the volume?</span>`,text:`base ${B} height ${h}`,
    fig:boxFig(l,w,h,u,{lT:' ',wT:' ',label:`A box with a base area of ${B} and a height of ${h}`}),show:`${B} × ${h} = ${V} ${cu}`,
    why:g=>noteFrom([{v:B+h,t:'You added. Volume = base area × height.'},{v:B,t:'That is just the base (one layer). Multiply by the height.'}],g)})}
function volMissing(){const l=ri(2,9),w=ri(2,6),h=ri(2,9),[u,cu]=pick(UNITS),V=l*w*h;
  return mk({kind:'num',std:'NC.5.MD.5',key:`vm${l}${w}${h}`,ans:h,unit:u,
    html:`<span class="ptxt">This box has a volume of <b>${V} ${cu}</b>. What is the height?</span>`,text:`missing h V=${V} l=${l} w=${w}`,
    fig:boxFig(l,w,h,u,{hT:'?'}),show:`${l} × ${w} = ${l*w}, and ${V} ÷ ${l*w} = ${h} ${u}`,
    why:g=>noteFrom([{v:l*w,t:`${l} × ${w} = ${l*w} is the base. Now ask: ${l*w} × ? = ${V}.`},{v:V/l,t:`You divided by ${l} only. Divide by the whole base, ${l} × ${w}.`},{v:V/w,t:`You divided by ${w} only. Divide by the whole base, ${l} × ${w}.`},{v:V-l-w,t:'You subtracted. Use division: volume ÷ base area.'},{v:V*l*w,t:'You multiplied. To find a missing edge, divide.'}],g)})}
function volComposite(){
  for(let k=0;k<100;k++){let w=ri(2,3),a1=ri(2,4),a2=ri(1,3),h1=ri(1,5),h2=ri(1,5);if(h1===h2||a1+a2>7)continue;
    /* the taller box goes in back (left) so the shorter one is not hidden */
    if(h1<h2){[a1,a2]=[a2,a1];[h1,h2]=[h2,h1]}
    const cubes=[];for(let x=0;x<a1+a2;x++)for(let y=0;y<w;y++){const h=x<a1?h1:h2;for(let z=0;z<h;z++)cubes.push({x,y,z,c:x<a1?1:2})}
    const V1=a1*w*h1,V2=a2*w*h2,V=V1+V2;
    const fig=voxels(cubes,[],`A figure made of a gold box ${a1} by ${w} by ${h1} and a blue box ${a2} by ${w} by ${h2}`);
    return mk({kind:'num',std:'NC.5.MD.5',key:`vC${a1}${a2}${w}${h1}${h2}`,ans:V,unit:'cubic units',
      html:`<span class="ptxt">This figure is two boxes put together.<br><b class="gold">Gold box:</b> ${a1} × ${w} × ${h1}. <b class="blue">Blue box:</b> ${a2} × ${w} × ${h2}.<br>What is the total volume?</span>`,
      text:`composite ${a1}x${w}x${h1} + ${a2}x${w}x${h2}`,fig,show:`${V1} + ${V2} = ${V} cubic units`,
      why:g=>noteFrom([{v:V1,t:'That is only the gold box. Find the blue box too, then add.'},{v:V2,t:'That is only the blue box. Find the gold box too, then add.'},{v:V1*V2,t:'Find each box, then ADD the two volumes.'},{v:(a1+a2)*w*Math.max(h1,h2),t:'That fills in the empty corner too. Find each box, then add.'}],g)})}
}

/* ----- fraction x whole number (denominators 2,3,4,5,6,8,10,12) ----- */
const DW=[2,3,4,5,6,8,10,12];
function wholeTimesFrac(){for(let k=0;k<50;k++){const n=ri(2,6),b=pick(DW),a=rnum(b);if(n*b>60)continue;
  const ans=[n*a,b];
  return mk({kind:'frac',std:'NC.5.NF.4',key:`wf${n}${a}${b}`,ans,
    html:`<span>${n}</span><span class="op">×</span>${frH(a,b)}<span class="eq">=</span>`,text:`${n} x ${a}/${b}`,
    fig:groupsFig(n,a,b),show:`${n} × ${frH(a,b)} = ${frH(n*a,b)}${valH(...ans)!==frH(n*a,b)?' = '+valH(...ans):''}`,
    why:g=>noteFrom([{v:[a,b],t:`That equals ${a}/${b}. You multiplied the top AND bottom by ${n}. Multiply only the top: ${n} × ${a}.`},{v:[a,n*b],t:`You multiplied the bottom. The parts stay ${b}ths. Multiply the top: ${n} × ${a}.`},{v:[n+a,b],t:`You added ${n}. Multiply: ${n} groups of ${a}/${b}.`}],g)})}}
function fracOfWhole(){const b=pick([2,3,4,5,6,8,10,12]),a=rnum(b);let N=b*ri(1,Math.max(1,Math.floor(36/b)));if(Math.random()<.3)N=ri(2,9);
  const ans=[a*N,b];
  return mk({kind:'frac',std:'NC.5.NF.4',key:`fw${a}${b}${N}`,ans,
    html:`${frH(a,b)}<span class="op">×</span><span>${N}</span><span class="eq">=</span>`,text:`${a}/${b} x ${N}`,
    fig:tapeFig(a,b,N),show:`${frH(a,b)} × ${N} = ${frH(a*N,b)}${valH(...ans)!==frH(a*N,b)?' = '+valH(...ans):''}`,
    why:g=>noteFrom([{v:[N,b],t:`That is 1/${b} of ${N}. You need ${a} of those parts.`},{v:[a,b*N],t:`You multiplied the bottom. Multiply the top: ${a} × ${N}.`},{v:[a*N,1],t:`Don’t forget to divide by ${b}. ${a} × ${N} = ${a*N}, then ÷ ${b}.`},{v:[N*b,a],t:'Upside down! Multiply the top, keep the bottom.'}],g)})}
const WSTORY=[
  (n,a,b,nm)=>[`${nm} uses ${frH(a,b)} cup of milk for each batch of pancakes. How many cups for <b>${n}</b> batches?`,'cups'],
  (n,a,b,nm)=>[`Each lap around the track is ${frH(a,b)} mile. ${nm} runs <b>${n}</b> laps. How many miles is that?`,'miles'],
  (n,a,b,nm)=>[`A water bottle holds ${frH(a,b)} liter. How many liters are in <b>${n}</b> bottles?`,'liters'],
  (n,a,b,nm)=>[`${nm} reads for ${frH(a,b)} hour each day. How many hours in <b>${n}</b> days?`,'hours']];
const OSTORY=[
  (a,b,N,nm)=>[`There are <b>${N}</b> students in the club. ${frH(a,b)} of them ride the bus. How many students ride the bus?`,'students',1],
  (a,b,N,nm)=>[`A trail is <b>${N}</b> miles long. ${nm} hiked ${frH(a,b)} of the trail. How many miles did ${nm} hike?`,'miles',0],
  (a,b,N,nm)=>[`${nm} has <b>${N}</b> feet of ribbon and uses ${frH(a,b)} of it. How many feet are used?`,'feet',0],
  (a,b,N,nm)=>[`A bag has <b>${N}</b> apples. ${frH(a,b)} of them are green. How many apples are green?`,'apples',1]];
function wordWhole(){const nm=pick(NAMES);
  if(Math.random()<.5){const n=ri(2,6),b=pick([2,3,4,5,6,8,10]),a=rnum(b);const [q,u]=pick(WSTORY)(n,a,b,nm);const ans=[n*a,b];
    return mk({kind:'frac',std:'NC.5.NF.4',key:`ww${n}${a}${b}${u}`,ans,unit:u,html:`<span class="ptxt">${q}</span>`,text:`story ${n} x ${a}/${b}`,
      fig:groupsFig(n,a,b),show:`${n} × ${frH(a,b)} = ${valH(...ans)} ${u}`,
      why:g=>noteFrom([{v:[a,b],t:`That is just one. Multiply by ${n}: ${n} × ${a}/${b}.`},{v:[a,n*b],t:`Multiply the top: ${n} × ${a}. The bottom stays ${b}.`},{v:[n+a,b],t:'You added. This is groups of a fraction, so multiply.'}],g)})}
  const S=pick(OSTORY),b=pick([2,3,4,5,6,8]),a=rnum(b);let N;
  const probe=S(1,2,2,nm);N=probe[2]?b*ri(2,Math.max(2,Math.floor(40/b))):(Math.random()<.5?b*ri(1,4):ri(2,9));
  const [q,u]=S(a,b,N,nm);const ans=[a*N,b];
  return mk({kind:'frac',std:'NC.5.NF.4',key:`wo${a}${b}${N}${u}`,ans,unit:u,html:`<span class="ptxt">${q}</span>`,text:`story ${a}/${b} of ${N}`,
    fig:tapeFig(a,b,N,u),show:`${frH(a,b)} × ${N} = ${valH(...ans)} ${u}`,
    why:g=>noteFrom([{v:[N,b],t:`That is 1/${b} of ${N}. You need ${a} of those parts.`},{v:[a*N,1],t:`Divide by ${b} too: ${a} × ${N} ÷ ${b}.`},{v:[N-a,1],t:'You subtracted. “Of” means multiply.'}],g)})}

/* ----- fraction x fraction + area (denominators 2,3,4) ----- */
const D3=[2,3,4];
function fracFracCore(){const b=pick(D3),d=pick(D3);return [rnum(b),b,rnum(d),d]}
function ffWhy(a,b,c,d){return g=>noteFrom([
  {v:[a+c,b+d],t:'You added the tops and bottoms. Multiply: top × top and bottom × bottom.'},
  {v:[a*d,b*c],t:'That is cross multiplying. Multiply straight across: top × top, bottom × bottom.'},
  {v:[a*c,b],t:`Multiply the bottoms too: ${b} × ${d}. The whole is cut into ${b*d} parts.`},
  {v:[a*c,d],t:`Multiply the bottoms too: ${b} × ${d}. The whole is cut into ${b*d} parts.`},
  {v:[a*c,b+d],t:`Multiply the bottoms, don’t add them: ${b} × ${d} = ${b*d}.`}],g)}
function fracFrac(){const [a,b,c,d]=fracFracCore(),ans=[a*c,b*d];
  return mk({kind:'frac',std:'NC.5.NF.4',key:`ff${a}${b}${c}${d}`,ans,
    html:`${frH(a,b)}<span class="op">×</span>${frH(c,d)}<span class="eq">=</span>`,text:`${a}/${b} x ${c}/${d}`,
    fig:areaFig([a,b],[c,d],{label:`Area model: ${a}/${b} by ${c}/${d} of one whole square`}),show:`${frH(a,b)} × ${frH(c,d)} = ${frH(a*c,b*d)}${valH(...ans)!==frH(a*c,b*d)?' = '+valH(...ans):''}`,
    why:ffWhy(a,b,c,d)})}
const AREA_U=[['ft','square feet'],['m','square meters'],['yd','square yards']];
function areaFrac(){const [a,b,c,d]=fracFracCore(),[u,su]=pick(AREA_U),nm=pick(NAMES),ans=[a*c,b*d];
  const what=pick(['A rug','A garden bed','A poster','A tile','A sticker sheet']);
  return mk({kind:'frac',std:'NC.5.NF.4',key:`af${a}${b}${c}${d}`,ans,unit:su,
    html:`<span class="ptxt">${what} is ${frH(a,b)} ${u} long and ${frH(c,d)} ${u} wide. What is its area?</span>`,text:`area ${a}/${b} by ${c}/${d}`,
    fig:areaFig([a,b],[c,d],{u}),show:`${frH(a,b)} × ${frH(c,d)} = ${valH(...ans)} ${su}`,
    why:g=>{const p=noteFrom([{v:[2*(a*d+c*b),b*d],t:'That is the perimeter (all the way around). Area means multiply length × width.'}],g);return p||ffWhy(a,b,c,d)(g)}})}
function areaWholeFrac(){const W=ri(2,4),d=pick(D3),c=rnum(d),[u,su]=pick(AREA_U),ans=[W*c,d];
  const what=pick(['A garden','A hallway rug','A mural','A banner']);
  return mk({kind:'frac',std:'NC.5.NF.4',key:`aw${W}${c}${d}`,ans,unit:su,
    html:`<span class="ptxt">${what} is ${W} ${u} long and ${frH(c,d)} ${u} wide. What is its area?</span>`,text:`area ${W} by ${c}/${d}`,
    fig:areaFig([W,1],[c,d],{u}),show:`${W} × ${frH(c,d)} = ${frH(W*c,d)}${valH(...ans)!==frH(W*c,d)?' = '+valH(...ans):''} ${su}`,
    why:g=>noteFrom([{v:[c,W*d],t:`You multiplied the bottom. Count the shaded parts: ${W} × ${c} parts of size 1/${d}.`},{v:[W+c,d],t:'You added. Area = length × width.'},{v:[2*W*d+2*c,d],t:'That is the perimeter. Area means multiply.'}],g)})}

/* ----- mixed numbers (denominators 2,3,4) ----- */
function mixedTimes(){for(let k=0;k<60;k++){const w=ri(1,2),b=pick(D3),a=rnum(b),P=[w*b+a,b];
    let Q;const kind=Math.random()<.5?'frac':'whole';
    if(kind==='whole')Q=[ri(2,4),1];else{const d=pick(D3);Q=[rnum(d),d]}
    const ans=[P[0]*Q[0],P[1]*Q[1]];if(ans[0]/ans[1]>9)continue;
    const QH=Q[1]===1?String(Q[0]):frH(Q[0],Q[1]),PH=`<span class="mx">${w}${frH(a,b)}</span>`;
    const [q0,q1]=Q,QT=valT(q0,q1);
    return mk({kind:'frac',std:'NC.5.NF.4',key:`mx${w}${a}${b}${q0}${q1}`,ans,
      html:`${PH}<span class="op">×</span><span>${QH}</span><span class="eq">=</span>`,text:`${w} ${a}/${b} x ${QT}`,
      fig:areaFig(P,Q,{pT:`${w} ${a}/${b}`,label:`Area model: ${w} and ${a}/${b} by ${QT}`}),
      show:`${frH(P[0],P[1])} × ${QH} = ${frH(ans[0],ans[1])}${valH(...ans)!==frH(ans[0],ans[1])?' = '+valH(...ans):''}`,
      why:g=>noteFrom([
        {v:[w*b*q1+a*q0,b*q1],t:`You multiplied only the ${a}/${b}. Multiply BOTH parts of ${w} ${a}/${b} by ${QT}, then add. Or change ${w} ${a}/${b} to ${P[0]}/${b} first.`},
        {v:[w*q0*b+a*q1,b*q1],t:`You multiplied only the ${w}. Multiply BOTH parts of ${w} ${a}/${b} by ${QT}, then add. Or change ${w} ${a}/${b} to ${P[0]}/${b} first.`},
        {v:[a*q0,b*q1],t:`You left out the whole part, ${w}. Change ${w} ${a}/${b} to ${P[0]}/${b} first.`},
        {v:[w*b+a+(Q[1]===1?Q[0]*b:0),b],t:'You added. Use multiplication: look at the area model.'}],g)})}}

/* ----- scaling (NC.5.NF.4: compare the product to the number without multiplying) ----- */
function scaling(){const N=pick([6,8,9,10,12,15,16,20,24]);const t=pick(['less','less','more','more','equal']);
  let fn,fd;if(t==='equal'){fd=pick([2,3,4,5,6]);fn=fd}else if(t==='less'){fd=pick([2,3,4,5,6,8]);fn=ri(1,fd-1)}else{fd=pick([2,3,4,5]);fn=ri(fd+1,2*fd-1)}
  const F=fn===fd?frH(fn,fd):valH(fn,fd);
  const ch=[`greater than ${N}`,`less than ${N}`,`equal to ${N}`],right=t==='more'?0:t==='less'?1:2;
  const note=t==='less'?`${valT(fn,fd)} is less than 1, so the product is less than ${N}.`:t==='more'?`${valT(fn,fd)} is more than 1, so the product is greater than ${N}.`:`${fn}/${fd} = 1, and 1 × ${N} = ${N}.`;
  return mk({kind:'choice',std:'NC.5.NF.4',key:`sc${fn}${fd}${N}`,ans:right,choices:ch,
    html:`<span class="ptxt">Don’t multiply. Is ${F} × ${N}<br>greater than, less than, or equal to ${N}?</span>`,text:`scale ${fn}/${fd} x ${N}`,
    fig:lineFig(fn,fd),show:note,why:()=>`Compare ${valT(fn,fd)} to 1 on the number line. `+note})}


/* ----- fraction division, taught the class way: FLIP THE SECOND FRACTION AND MULTIPLY (Ms. Tesnar, Nov 21, 2026).
   Every kind: unit fraction ÷ whole, whole ÷ fraction, fraction ÷ fraction, mixed numbers. No pictures (her choice).
   NC.5.NF.7 is unit fractions with whole numbers; fraction ÷ fraction and mixed numbers are NC.6.NS.1 (taught early here). */
/* an operand: whole N, fraction a/b, or mixed w a/b -> {v:[n,d] improper, h: html as shown, t: text, kind} */
const OPW=N=>({v:[N,1],h:`<span>${N}</span>`,t:String(N),kind:'whole',w:N});
const OPF=(a,b)=>({v:[a,b],h:frH(a,b),t:a+'/'+b,kind:'frac'});
const OPM=(w,a,b)=>({v:[w*b+a,b],h:`<span class="mx">${w}${frH(a,b)}</span>`,t:w+' '+a+'/'+b,kind:'mixed',w,a,b});
const fH=v=>frH(v[0],v[1]);
function kcfSteps(P,Q){const [pn,pd]=P.v,[qn,qd]=Q.v,raw=[pn*qd,pd*qn];const parts=[];
  if(P.kind==='mixed')parts.push(`Change ${P.t} to ${fH(P.v)}.`);
  if(P.kind==='whole')parts.push(`Write ${P.t} as ${fH(P.v)}.`);
  if(Q.kind==='mixed')parts.push(`Change ${Q.t} to ${fH(Q.v)}.`);
  if(Q.kind==='whole')parts.push(`Write ${Q.t} as ${fH(Q.v)}.`);
  parts.push(`Flip the second fraction and multiply: ${fH(P.v)} × ${frH(qd,qn)} = ${fH(raw)}${valH(...raw)!==fH(raw)?' = '+valH(...raw):''}`);
  return parts.join(' ')}
function kcfWhy(P,Q){const [pn,pd]=P.v,[qn,qd]=Q.v;const list=[
  {v:[pn*qn,pd*qd],t:`You multiplied without flipping. Flip the second fraction first: ${fH(Q.v)} becomes ${frH(qd,qn)}.`},
  {v:[pd*qn,pn*qd],t:`You flipped the FIRST fraction. Keep the first one the same. Flip only the second one.`},
  {v:[pd*qd,pn*qn],t:`You flipped both fractions. Keep the first one the same. Flip only the second one.`}];
  if(P.kind==='mixed')list.push({v:[P.w*P.b*qn+P.a*qd,P.b*qn],t:`Change ${P.t} to an improper fraction (${fH(P.v)}) BEFORE you flip and multiply.`},
                                {v:[P.a*qd,P.b*qn],t:`You left out the whole number ${P.w}. Change ${P.t} to ${fH(P.v)} first.`});
  if(Q.kind==='mixed')list.push({v:[pn*Q.b,pd*Q.a],t:`You left out the whole number ${Q.w}. Change ${Q.t} to ${fH(Q.v)}, then flip it.`});
  if(Q.kind==='whole')list.push({v:[pn*qn,pd],t:`Write ${Q.t} as ${Q.t}/1. Flip it to 1/${Q.t}, then multiply.`});
  if(P.kind==='whole')list.push({v:[qn,qd*pn],t:`Keep ${P.t} first (${P.t}/1). Flip only the second fraction.`});
  return g=>noteFrom(list,g)}
function divMk(P,Q,std,key){const [pn,pd]=P.v,[qn,qd]=Q.v,ans=[pn*qd,pd*qn];
  return mk({kind:'frac',std:std||'NC.6.NS.1',key:key||('d'+P.t+'/'+Q.t),ans,
    html:`${P.h}<span class="op">÷</span>${Q.h}<span class="eq">=</span>`,text:`${P.t} ÷ ${Q.t}`,fig:'',
    show:kcfSteps(P,Q),why:kcfWhy(P,Q)})}
const DD=[2,3,4,5,6,8,10,12],DS=[2,3,4,5,6,8];
function unitDivWhole(){const b=pick(DD),n=ri(2,9);return divMk(OPF(1,b),OPW(n),'NC.5.NF.7')}
function wholeDivUnit(){const b=pick(DD),N=ri(2,9);return divMk(OPW(N),OPF(1,b),'NC.5.NF.7')}
function fracDivWhole(){const b=pick(DS),a=rnum(b);return a===1?unitDivWhole():divMk(OPF(a,b),OPW(ri(2,6)))}
function wholeDivFrac(){const b=pick(DS),a=rnum(b);return a===1?wholeDivUnit():divMk(OPW(ri(2,9)),OPF(a,b))}
function fracDivFrac(){const b=pick(DS),d=pick(DS);const P=OPF(rnum(b),b),Q=OPF(rnum(d),d);return divMk(P,Q)}
function mixedDivFrac(){const b=pick([2,3,4,5,6]),d=pick([2,3,4,5,6,8]);return divMk(OPM(ri(1,3),rnum(b),b),OPF(rnum(d),d))}
function mixedDivWhole(){const b=pick([2,3,4,5,6]);return divMk(OPM(ri(1,4),rnum(b),b),OPW(ri(2,6)))}
function fracDivMixed(){const b=pick([2,3,4,5,6,8]),d=pick([2,3,4,5]);
  return Math.random()<.35?divMk(OPM(ri(1,3),rnum(b),b),OPM(ri(1,2),rnum(d),d)):divMk(OPF(rnum(b),b),OPM(ri(1,2),rnum(d),d))}
/* story problems (no pictures): each one is a division, solved by flip and multiply */
const DSTORY=[
  ()=>{const b=pick([2,3,4,6,8]),n=ri(2,6);return [OPF(1,b),OPW(n),`${frH(1,b)} of a pizza is left. ${n} friends share it equally. What fraction of the whole pizza does each friend get?`,'of a pizza']},
  ()=>{const b=pick([2,3,4,5,8]),N=ri(2,8);return [OPW(N),OPF(1,b),`You have ${N} cups of trail mix. Each bag holds ${frH(1,b)} cup. How many bags can you fill?`,'bags']},
  ()=>{const b=pick([3,4,5,6,8]),a=rnum(b),N=a*ri(2,5);return [OPW(N),OPF(a,b),`A rope is ${N} feet long. Each jump rope needs ${frH(a,b)} foot. How many jump ropes can be cut?`,'jump ropes']},
  ()=>{const d=pick([8,10,12]),b=pick([2,4]),a=rnum(b),c=1;return [OPF(a,b),OPF(c,d),`A ribbon is ${frH(a,b)} yard long. It is cut into pieces that are ${frH(c,d)} yard each. How many pieces?`,'pieces']},
  ()=>{const b=pick([2,3,4]),a=rnum(b),n=ri(2,5);return [OPF(a,b),OPW(n),`${frH(a,b)} pound of clay is shared equally by ${n} students. How many pounds does each student get?`,'pound']},
  ()=>{const b=pick([2,4]),w=ri(1,3),d=pick([4,8]);return [OPM(w,1,b),OPF(1,d),`A recipe uses ${frH(1,d)} cup of sugar per batch. You have <span class="mx">${w}${frH(1,b)}</span> cups. How many batches can you make?`,'batches']},
  ()=>{const d=pick([2,3,4]),c=rnum(d),N=ri(3,9);return [OPW(N),OPF(c,d),`It takes ${frH(c,d)} hour to paint one sign. How many signs can be painted in ${N} hours?`,'signs']}];
function divWord(){const [P,Q,q,u]=pick(DSTORY)();const p=divMk(P,Q,P.kind!=='frac'&&Q.kind!=='frac'?'NC.5.NF.7':(P.v[0]===1||Q.v[0]===1)&&(P.kind==='whole'||Q.kind==='whole')?'NC.5.NF.7':'NC.6.NS.1');
  p.html=`<span class="ptxt">${q}<br><span class="std">Write the division, then flip the second fraction and multiply.</span></span>`;p.unit=u;p.key='w'+p.key+u;p.text='story '+p.text;return p}
/* tap: which is the right first step? */
function divStep(){const b=pick(DS),d=pick(DS),a=rnum(b),c=rnum(d);if(a===b-a&&c===d-c&&b===d)return divStep();
  const P=OPF(a,b),Q=OPF(c,d);const right=`${a}/${b} × ${d}/${c}`,w1=`${b}/${a} × ${c}/${d}`,w2=`${a}/${b} × ${c}/${d}`,w3=`${b}/${a} × ${d}/${c}`;
  const pool=[right,w1,w2,w3].filter((x,i,arr)=>arr.indexOf(x)===i);if(pool.length<3)return divStep();
  const set=[pool[0],...pool.slice(1).sort(()=>Math.random()-.5).slice(0,2)];const order=[0,1,2].sort(()=>Math.random()-.5);const choices=order.map(i=>set[i]);
  const notes={[w1]:'That flips the FIRST fraction. Keep the first one. Flip the second one.',[w2]:'That forgot to flip. Change ÷ to × AND flip the second fraction.',[w3]:'That flips both. Only flip the second fraction.'};
  return mk({kind:'choice',std:'NC.6.NS.1',key:`ds${a}${b}${c}${d}`,ans:order.indexOf(0),choices,
    html:`<span class="ptxt">Which is the right way to solve ${frH(a,b)} ÷ ${frH(c,d)}?</span>`,text:`step ${a}/${b} ÷ ${c}/${d}`,fig:'',
    show:`Keep ${a}/${b}, change ÷ to ×, flip ${c}/${d} to ${d}/${c}: ${right}.`,
    why:i=>(notes[choices[i]]||'')+` The right way: keep ${a}/${b}, change ÷ to ×, flip ${c}/${d} to ${d}/${c}.`})}

/* ---------------- rooms ---------------- */
const ROOM_TOPICS=['Volume: count the cubes','Volume: base × height, missing edge, two boxes','Fraction × whole number','Fraction × fraction and area','Dividing fractions: flip and multiply','Mixed numbers, dividing, scaling and review'];
const ROOM_STD=['NC.5.MD.4, NC.5.MD.5','NC.5.MD.5','NC.5.NF.4','NC.5.NF.4','NC.5.NF.7 (+ NC.6.NS.1)','NC.5.NF.4, NC.5.NF.7, NC.5.MD.5'];
const BANK=[
  [[volCount,5],[volBox,5]],
  [[volBox,2],[volBase,3],[volMissing,3],[volComposite,4]],
  [[wholeTimesFrac,4],[fracOfWhole,4],[wordWhole,4]],
  [[fracFrac,5],[areaFrac,4],[areaWholeFrac,3]],
  [[unitDivWhole,2],[wholeDivUnit,2],[fracDivWhole,2],[wholeDivFrac,2],[fracDivFrac,4],[mixedDivFrac,2],[mixedDivWhole,1],[fracDivMixed,2],[divWord,4],[divStep,2]],
  [[fracDivFrac,3],[mixedDivFrac,2],[fracDivMixed,1],[divWord,2],[wholeDivFrac,1],[mixedTimes,3],[scaling,2],[wordWhole,1],[areaFrac,1],[volComposite,1]]];
function gen(room){const B=BANK[room-1],tot=B.reduce((s,x)=>s+x[1],0);let r=Math.random()*tot;for(const [f,w] of B){r-=w;if(r<0)return f()}return B[0][0]()}
return {gen,ROOM_TOPICS,ROOM_STD,BANK,valH,valT,frH,gcd,red,eqv,all:{unitDivWhole,wholeDivUnit,fracDivWhole,wholeDivFrac,fracDivFrac,mixedDivFrac,mixedDivWhole,fracDivMixed,divWord,divStep,volCount,volBox,volBase,volMissing,volComposite,wholeTimesFrac,fracOfWhole,wordWhole,fracFrac,areaFrac,areaWholeFrac,mixedTimes,scaling}};
})();
/*Q5-END*/
