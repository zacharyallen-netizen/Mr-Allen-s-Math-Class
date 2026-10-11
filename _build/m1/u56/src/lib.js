/* ===== Math 1 · Units 5–6 visual + checker library (inline) =====
   Every picture is drawn from the problem's own numbers.
   Colors: navy = given, gold = what we want, green = answer (after check). */
var M=(function(){
'use strict';
var C={navy:'#1E2D4F',navyL:'#E4E9F2',gold:'#E0A800',goldD:'#8A6500',goldL:'#FFF3C4',green:'#15803D',greenL:'#DCF2E3',
  grid:'#D9DFE8',axis:'#5A6680',muted:'#5A6680',red:'#B42318',redL:'#FDE4E4',white:'#fff'};
var MONO='JetBrains Mono, ui-monospace, Menlo, monospace', SANS='Inter, system-ui, sans-serif';
var uid=0;
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function r1(n){return Math.round(n*10)/10;}
function fmt(n,d){if(d==null)d=2;var p=Math.pow(10,d);var v=Math.round(n*p)/p;if(Object.is(v,-0)||Math.abs(v)<1e-12)v=0;return String(v).replace('-','−');}
function sgn(n,d){return (n>0?'+':'')+fmt(n,d);}
function sc(d0,d1,a,b){return function(v){return a+(v-d0)*(b-a)/(d1-d0);};}
/* ---------- svg primitives ---------- */
function svg(w,h,body,label){return '<svg class="mviz" style="max-width:'+Math.round(Math.min(440,w*1.3))+'px" viewBox="0 0 '+w+' '+h+'" width="'+w+'" height="'+h+'" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="'+esc(label||'diagram')+'"><rect x="0" y="0" width="'+w+'" height="'+h+'" fill="#fff"/>'+body+'</svg>';}
function ln(x1,y1,x2,y2,c,w,dash){return '<line x1="'+r1(x1)+'" y1="'+r1(y1)+'" x2="'+r1(x2)+'" y2="'+r1(y2)+'" stroke="'+(c||C.axis)+'" stroke-width="'+(w||1)+'"'+(dash?' stroke-dasharray="'+dash+'"':'')+' stroke-linecap="round"/>';}
function tx(x,y,s,o){o=o||{};return '<text x="'+r1(x)+'" y="'+r1(y)+'" font-size="'+(o.size||12)+'" fill="'+(o.fill||C.navy)+'" text-anchor="'+(o.anchor||'middle')+'" font-family="'+(o.mono?MONO:SANS)+'"'+(o.bold?' font-weight="700"':'')+(o.italic?' font-style="italic"':'')+(o.rot?' transform="rotate('+o.rot+' '+r1(x)+' '+r1(y)+')"':'')+(o.halo?' stroke="#fff" stroke-width="3.2" paint-order="stroke" stroke-linejoin="round"':'')+'>'+esc(s)+'</text>';}
function rc(x,y,w,h,fill,stroke,sw,rx,dash){return '<rect x="'+r1(x)+'" y="'+r1(y)+'" width="'+r1(w)+'" height="'+r1(h)+'" fill="'+(fill||'none')+'"'+(stroke?' stroke="'+stroke+'" stroke-width="'+(sw||1)+'"':'')+(rx?' rx="'+rx+'"':'')+(dash?' stroke-dasharray="'+dash+'"':'')+'/>';}
function ci(cx,cy,r,fill,stroke,sw){return '<circle cx="'+r1(cx)+'" cy="'+r1(cy)+'" r="'+r+'" fill="'+(fill||C.navy)+'"'+(stroke?' stroke="'+stroke+'" stroke-width="'+(sw||1.5)+'"':'')+'/>';}
function pg(pts,fill,stroke,sw){return '<polygon points="'+pts.map(function(p){return r1(p[0])+','+r1(p[1]);}).join(' ')+'" fill="'+(fill||'none')+'"'+(stroke?' stroke="'+stroke+'" stroke-width="'+(sw||1)+'"':'')+'/>';}
function pl(pts,c,w,dash){return '<polyline points="'+pts.map(function(p){return r1(p[0])+','+r1(p[1]);}).join(' ')+'" fill="none" stroke="'+c+'" stroke-width="'+(w||2)+'"'+(dash?' stroke-dasharray="'+dash+'"':'')+' stroke-linejoin="round"/>';}
function arrow(x1,y1,x2,y2,c,w,dash){var a=Math.atan2(y2-y1,x2-x1),L=8,s=4.5;var bx=x2-L*Math.cos(a),by=y2-L*Math.sin(a);
  return ln(x1,y1,bx,by,c,w||2,dash)+pg([[x2,y2],[bx-s*Math.sin(a),by+s*Math.cos(a)],[bx+s*Math.sin(a),by-s*Math.cos(a)]],c);}
function tw(s,size,mono){return String(s).length*size*(mono?0.62:0.56);}
/* label with white backing so it never sits on top of lines */
function tag(x,y,s,o){o=o||{};var size=o.size||12,w=tw(s,size,o.mono)+8,h=size+6,ax=o.anchor||'middle';
  var lx=ax==='middle'?x-w/2:(ax==='start'?x-4:x-w+4);
  return rc(lx,y-size+1-3,w,h,o.bg||'#fff',o.border||null,1,4)+tx(x,y,s,{size:size,fill:o.fill||C.navy,anchor:ax,mono:o.mono,bold:o.bold!==false});}
function niceStep(range){var raw=range/8,p=Math.pow(10,Math.floor(Math.log10(raw))),m=raw/p;return (m<=1?1:m<=2?2:m<=2.5?2.5:m<=5?5:10)*p;}
function onStep(v,st){return Math.abs(v/st-Math.round(v/st))<1e-6;}
/* ---------- number line ---------- */
function axisX(o){var X=sc(o.min,o.max,o.x0,o.x1),s=ln(o.x0-8,o.y,o.x1+8,o.y,C.axis,1.6),ls=o.lab||o.step;
  for(var v=o.min;v<=o.max+1e-9;v+=o.step){var big=onStep(v,ls);s+=ln(X(v),o.y-(big?5:3),X(v),o.y+(big?5:3),C.axis,1.2);
    if(big)s+=tx(X(v),o.y+18,fmt(v),{size:o.fs||12,mono:true,fill:C.axis});}
  if(o.title)s+=tx((o.x0+o.x1)/2,o.y+34,o.title,{size:11.5,fill:C.muted});return {s:s,X:X};}
/* ---------- dot plot ---------- */
function dotPlot(data,o){o=o||{};var w=o.w||360,min=o.min,max=o.max,step=o.step||1,r=o.r||6,gap=2*r+2;
  var cnt={},stack=[];data.forEach(function(v){cnt[v]=(cnt[v]||0)+1;stack.push(cnt[v]);});
  var mx=Math.max.apply(null,Object.keys(cnt).map(function(k){return cnt[k];}));
  var marks=o.marks||[],rows=0;marks.forEach(function(m){rows=Math.max(rows,(m.row||0)+1);});
  var top=8+rows*16,ay=top+mx*gap+12+(o.extraTop||0),h=ay+(o.title?42:26)+(o.below||0);
  var A=axisX({x0:o.x0||22,x1:w-(o.x1pad||22),y:ay,min:min,max:max,step:step,lab:o.lab,title:o.title}),X=A.X,s='';
  marks.forEach(function(m){var col=m.color||C.gold,x=X(m.v),ly=8+(m.row||0)*16+11;
    s+=ln(x,ly+4,x,ay,col,2.2,m.dash||'5 3');s+=tag(x,ly,m.label,{fill:col===C.gold?C.goldD:col,size:11.5,anchor:m.anchor});});
  var seen={};data.forEach(function(v,i){seen[v]=(seen[v]||0)+1;var cy=ay-8-(seen[v]-1)*gap,cx=X(v);
    if(o.dist){var d=o.dist(v,i,cx,cy,X);if(d)s+=d;}
    var col=o.color?o.color(v,i):C.navy;s+=ci(cx,cy,r,col,'#fff',1.2);});
  if(o.after)s+=o.after(X,ay);
  return svg(w,h,s+A.s,o.label||'dot plot');}
/* ---------- histogram ---------- */
function histogram(labels,freqs,o){o=o||{};var w=o.w||360,h=o.h||236,L=48,R=10,T=22,B=50,n=freqs.length;
  var yMax=o.yMax||Math.max.apply(null,freqs),ys=o.ystep||(yMax>10?2:1),Y=sc(0,yMax,h-B,T),bw=(w-L-R)/n,s='';
  for(var v=0;v<=yMax+1e-9;v+=ys){s+=ln(L,Y(v),w-R,Y(v),C.grid,1);s+=tx(L-7,Y(v)+4,fmt(v),{size:11,mono:true,fill:C.axis,anchor:'end'});}
  for(var i=0;i<n;i++){var st=o.style?o.style(i):{};var x=L+i*bw;
    s+=rc(x,Y(freqs[i]),bw,Y(0)-Y(freqs[i]),st.fill||'#C9D3E6',st.stroke||C.navy,st.sw||1.4);
    s+=tx(x+bw/2,h-B+16,labels[i],{size:10.5,mono:true,fill:C.axis});
    if(o.top){var t=o.top(i);if(t)s+=tag(x+bw/2,Y(freqs[i])-6,t.t,{fill:t.c||C.green,size:12,mono:true});}}
  s+=ln(L,h-B,w-R,h-B,C.axis,1.6)+ln(L,T-6,L,h-B,C.axis,1.6);
  s+=tx((L+w-R)/2,h-12,o.xTitle||'',{size:11.5,fill:C.muted})+tx(13,(T+h-B)/2,o.yTitle||'Frequency',{size:11.5,fill:C.muted,rot:-90});
  return svg(w,h,s,o.label||'histogram');}
/* ---------- box plots ---------- */
function boxPlots(rows,o){o=o||{};var w=o.w||360,rowH=o.rowH||70,top=o.top||8,n=rows.length,ay=top+n*rowH+6,h=ay+(o.title?44:28)+(o.below||0);
  var A=axisX({x0:o.x0||22,x1:w-22,y:ay,min:o.min,max:o.max,step:o.step||1,lab:o.lab,title:o.title}),X=A.X,s='';
  if(o.grid)for(var g=o.min;g<=o.max+1e-9;g+=o.grid)s+=ln(X(g),top,X(g),ay,C.grid,1);
  rows.forEach(function(r,k){var f=r.f,cy=top+k*rowH+(r.name?44:40),bh=26,hl=r.hl||{},col=function(p){return hl[p]||C.navy;};
    if(r.name)s+=tx(X(o.min),cy-30,r.name,{size:12,bold:true,anchor:'start'});
    if(hl.box)s+=rc(X(f[1]),cy-bh/2,X(f[3])-X(f[1]),bh,C.goldL);
    s+=ln(X(f[0]),cy,X(f[1]),cy,col('lw'),2.2)+ln(X(f[3]),cy,X(f[4]),cy,col('rw'),2.2);
    s+=ln(X(f[0]),cy-9,X(f[0]),cy+9,col('min'),2.4)+ln(X(f[4]),cy-9,X(f[4]),cy+9,col('max'),2.4);
    s+=rc(X(f[1]),cy-bh/2,X(f[3])-X(f[1]),bh,hl.box?'none':'#EEF1F8',hl.box||C.navy,2.2);
    s+=ln(X(f[2]),cy-bh/2,X(f[2]),cy+bh/2,col('med'),3);
    (r.out||[]).forEach(function(v){s+=ci(X(v),cy,5,'#fff',hl.out||C.navy,2.2);});
    if(r.parts){var nm=['min','Q1','median','Q3','max'];var lastX=-99;for(var p=0;p<5;p++){if(r.parts[p]==null)continue;var t=r.parts[p],x=X(f[p]);
        var yy=(x-lastX<44)?cy+bh/2+16:cy-bh/2-7;if(yy<cy)lastX=x;
        s+=tag(x,yy,t.t,{fill:t.c||C.muted,size:11,mono:true,bold:t.c!=null});}}
    if(r.extra)s+=r.extra(X,cy);});
  if(o.after)s+=o.after(X,ay,top);
  return svg(w,h,s+A.s,o.label||'box plot');}
/* ---------- scatter plot ---------- */
function scatter(pts,o){o=o||{};var w=o.w||360,h=o.h||300,L=o.L||46,B=44,T=14,R=o.R||14;
  var X=sc(o.xmin,o.xmax,L,w-R),Y=sc(o.ymin,o.ymax,h-B,T),s='',v;
  if(o.shade)s+=rc(X(o.shade[0]),T,X(o.shade[1])-X(o.shade[0]),h-B-T,'#F3F6FB')+tx((X(o.shade[0])+X(o.shade[1]))/2,T+14,o.shadeLabel||'',{size:10.5,fill:C.muted});
  for(v=o.xmin;v<=o.xmax+1e-9;v+=o.xstep){s+=ln(X(v),T,X(v),h-B,C.grid,1);if(onStep(v,o.xlab||o.xstep))s+=tx(X(v),h-B+16,fmt(v),{size:11,mono:true,fill:C.axis});}
  for(v=o.ymin;v<=o.ymax+1e-9;v+=o.ystep){s+=ln(L,Y(v),w-R,Y(v),C.grid,1);if(onStep(v,o.ylab||o.ystep))s+=tx(L-6,Y(v)+4,fmt(v),{size:11,mono:true,fill:C.axis,anchor:'end'});}
  s+=ln(L,h-B,w-R,h-B,C.axis,1.6)+ln(L,T,L,h-B,C.axis,1.6);
  s+=tx((L+w-R)/2,h-10,o.xTitle||'x',{size:11.5,fill:C.muted})+tx(12,(T+h-B)/2,o.yTitle||'y',{size:11.5,fill:C.muted,rot:-90});
  var f=null;if(o.line){var a=o.line.a,b=o.line.b;f=function(x){return a+b*x;};
    var xa=o.line.x0!=null?o.line.x0:o.xmin,xb=o.line.x1!=null?o.line.x1:o.xmax;
    if(Math.abs(b)>1e-12){var lo=(o.ymin-a)/b,hi=(o.ymax-a)/b;var m1=Math.min(lo,hi),m2=Math.max(lo,hi);xa=Math.max(xa,m1);xb=Math.min(xb,m2);}
    s+=ln(X(xa),Y(f(xa)),X(xb),Y(f(xb)),o.line.color||C.navy,2.4,o.line.dash);
    if(o.line.label&&o.line.at){s+=tag(X(o.line.at[0]),Y(o.line.at[1]),o.line.label,{size:11.5,fill:o.line.color||C.navy,mono:true,anchor:'start'});}
    else if(o.line.label){var lx=o.line.lx!=null?o.line.lx:xb-(xb-xa)*0.18;s+=tag(X(lx),Y(f(lx))+(o.line.ly||-10),o.line.label,{size:11.5,fill:o.line.color||C.navy,mono:true,anchor:o.line.anchor||'end'});}}
  if(o.resid&&f)pts.forEach(function(p,i){var yh=f(p[0]);if(Math.abs(p[1]-yh)<1e-9)return;s+=ln(X(p[0]),Y(p[1]),X(p[0]),Y(yh),o.residColor||C.gold,2.4);
    if(o.residLabel){var t=o.residLabel(p,i,p[1]-yh);if(t)s+=tag(X(p[0])+(o.residSide||1)*5,(Y(p[1])+Y(yh))/2+4,t.t,{size:10.5,mono:true,fill:t.c||C.goldD,anchor:(o.residSide||1)>0?'start':'end'});}});
  if(o.guides)o.guides.forEach(function(g){var col=g.color||C.gold;if(g.x!=null)s+=ln(X(g.x),h-B,X(g.x),Y(g.y),col,2,'5 4');if(g.toY)s+=ln(L,Y(g.y),X(g.x),Y(g.y),col,2,'5 4');});
  pts.forEach(function(p,i){var c=o.ptColor?o.ptColor(i):C.navy;s+=ci(X(p[0]),Y(p[1]),o.r||4.8,c,'#fff',1.2);});
  if(o.marks)o.marks.forEach(function(m){s+=ci(X(m.x),Y(m.y),m.r||5.5,m.hollow?'#fff':(m.color||C.gold),m.color||C.gold,2.2);if(m.label)s+=tag(X(m.x)+(m.dx||8),Y(m.y)+(m.dy||-8),m.label,{size:11.5,mono:true,fill:m.tc||(m.color===C.green?C.green:C.goldD),anchor:m.anchor||'start'});});
  if(o.after)s+=o.after(X,Y);
  return svg(w,h,s,o.label||'scatter plot');}
/* ---------- coordinate plane (equal units) ---------- */
function plane(o){var w=o.w||340,pad=o.pad||22,u=(w-2*pad)/(o.xmax-o.xmin),h=o.h||Math.round(u*(o.ymax-o.ymin)+2*pad),yg=o.ygrid||1,ylab=o.ylab||o.lab||2;
  var X=sc(o.xmin,o.xmax,pad,w-pad),Y=sc(o.ymin,o.ymax,h-pad,pad),s='',v,lab=o.lab||2;
  for(v=o.xmin;v<=o.xmax+1e-9;v++)s+=ln(X(v),pad,X(v),h-pad,C.grid,1);
  for(v=o.ymin;v<=o.ymax+1e-9;v+=yg)s+=ln(pad,Y(v),w-pad,Y(v),C.grid,1);
  var ax0=Math.min(Math.max(0,o.ymin),o.ymax),ay0=Math.min(Math.max(0,o.xmin),o.xmax);
  s+=ln(pad-6,Y(ax0),w-pad+6,Y(ax0),C.axis,1.7)+ln(X(ay0),pad-6,X(ay0),h-pad+6,C.axis,1.7);
  s+=tx(w-pad+2,Y(ax0)-7,'x',{size:12,italic:true,fill:C.axis,anchor:'end'})+tx(X(ay0)+8,pad-8+12,'y',{size:12,italic:true,fill:C.axis,anchor:'start'});
  var labs='';for(v=Math.ceil(o.xmin);v<=o.xmax;v++){if(v===0||!onStep(v,lab)||v===o.xmax)continue;labs+=tx(X(v),Y(ax0)+15,fmt(v),{size:10.5,mono:true,fill:C.axis,halo:1});}
  for(v=Math.ceil(o.ymin);v<=o.ymax;v++){if(v===0||!onStep(v,ylab)||v===o.ymax)continue;labs+=tx(X(ay0)-5,Y(v)+4,fmt(v),{size:10.5,mono:true,fill:C.axis,anchor:'end',halo:1});}
  (o.vlines||[]).forEach(function(l){s+=ln(X(l.x),pad,X(l.x),h-pad,l.color||C.gold,2,l.dash||'6 4');if(l.label)s+=tag(X(l.x)+(l.dx||0),pad+12,l.label,{size:11,mono:true,fill:l.tc||C.goldD,anchor:l.anchor||'middle'});});
  (o.fns||[]).forEach(function(F){var seg=[],out='',N=360,prev=null;
    for(var i=0;i<=N;i++){var x=o.xmin+(o.xmax-o.xmin)*i/N,y=F.f(x),inr=y>=o.ymin&&y<=o.ymax;
      if(inr){if(prev&&!prev.in){var yb=prev.y>o.ymax?o.ymax:o.ymin,xb=prev.x+(x-prev.x)*(yb-prev.y)/(y-prev.y);seg.push([X(xb),Y(yb)]);}seg.push([X(x),Y(y)]);}
      else if(prev&&prev.in){var yb2=y>o.ymax?o.ymax:o.ymin,xb2=prev.x+(x-prev.x)*(yb2-prev.y)/(y-prev.y);seg.push([X(xb2),Y(yb2)]);out+=pl(seg,F.color||C.navy,F.w||2.6,F.dash);seg=[];}
      prev={x:x,y:y,in:inr};}
    if(seg.length>1)out+=pl(seg,F.color||C.navy,F.w||2.6,F.dash);s+=out;});
  s+=labs;
  (o.pts||[]).forEach(function(p){s+=ci(X(p.x),Y(p.y),p.r||5,p.hollow?'#fff':(p.color||C.navy),p.color||C.navy,2.2);
    if(p.label){var dx=p.dx!=null?p.dx:8,dy=p.dy!=null?p.dy:-9;s+=tag(X(p.x)+dx,Y(p.y)+dy,p.label,{size:11.5,mono:true,fill:p.tc||p.color||C.navy,anchor:p.anchor||'start'});}});
  if(o.after)s+=o.after(X,Y);
  return svg(w,h,s,o.label||'graph');}
/* ---------- area (box) model ---------- */
function cellStyle(k){return k==='want'?[C.goldL,C.goldD]:k==='ans'?[C.greenL,C.green]:k==='neg'?[C.redL,C.red]:[C.navyL,C.navy];}
function areaModel(o){var cols=o.top.length,rows=o.left.length,cw=o.cw||86,chh=o.ch||50,L=54,T=34,w=Math.max(o.w||0,L+cols*cw+12),h=T+rows*chh+12+(o.foot?26:0),s='';
  o.top.forEach(function(t,j){var k=typeof t==='object'?t:{t:t};s+=tx(L+j*cw+cw/2,T-11,k.t,{size:14,mono:true,bold:true,fill:k.k==='want'?C.goldD:k.k==='ans'?C.green:C.navy});});
  o.left.forEach(function(t,i){var k=typeof t==='object'?t:{t:t};s+=tx(L-12,T+i*chh+chh/2+5,k.t,{size:14,mono:true,bold:true,fill:k.k==='want'?C.goldD:k.k==='ans'?C.green:C.navy,anchor:'end'});});
  for(var i=0;i<rows;i++)for(var j=0;j<cols;j++){var c=o.cells[i][j],k=typeof c==='object'?c:{t:c};var st=cellStyle(k.k);
    s+=rc(L+j*cw,T+i*chh,cw,chh,st[0],C.navy,1.8);s+=tx(L+j*cw+cw/2,T+i*chh+chh/2+5,k.t,{size:k.t.length>6?12.5:14.5,mono:true,bold:true,fill:st[1]});}
  if(o.foot){var f=typeof o.foot==='object'?o.foot:{t:o.foot};s+=tx(L+cols*cw/2,h-8,f.t,{size:12.5,mono:true,bold:true,fill:f.k==='ans'?C.green:f.k==='want'?C.goldD:C.navy});}
  return svg(w,h,s,o.label||'area model');}
/* ---------- algebra tiles: (x+p)(x+q), p,q >= 0 ---------- */
function tileRect(p,q,o){o=o||{};var Xl=o.X||78,U=o.U||17,L=56,T=34,W=Xl+p*U,H=Xl+q*U,w=Math.max(o.w||0,L+W+16,o.foot?tw(o.foot.t,12.5,true)+30:0),h=T+H+(o.foot?34:14),s='';
  s+=rc(L,T,Xl,Xl,C.navyL,C.navy,1.6)+tx(L+Xl/2,T+Xl/2+5,'x²',{size:15,mono:true,bold:true});
  for(var i=0;i<p;i++)s+=rc(L+Xl+i*U,T,U,Xl,'#C9D3E6',C.navy,1.4);
  for(var j=0;j<q;j++)s+=rc(L,T+Xl+j*U,Xl,U,'#C9D3E6',C.navy,1.4);
  for(i=0;i<p;i++)for(j=0;j<q;j++)s+=rc(L+Xl+i*U,T+Xl+j*U,U,U,'#9FB0CF',C.navy,1.2);
  if(p)s+=tx(L+Xl+p*U/2,T+Xl/2+4,'x',{size:11,mono:true,fill:C.navy,rot:0});
  s+=tx(L+Xl/2,T-10,'x',{size:14,mono:true,bold:true})+(p?tx(L+Xl+p*U/2,T-10,'+'+p,{size:14,mono:true,bold:true}):'');
  s+=tx(L-12,T+Xl/2+5,'x',{size:14,mono:true,bold:true,anchor:'end'})+(q?tx(L-12,T+Xl+q*U/2+5,'+'+q,{size:14,mono:true,bold:true,anchor:'end'}):'');
  if(o.foot){var f=o.foot;s+=tag(Math.max(L+W/2,tw(f.t,12.5,true)/2+12),h-10,f.t,{size:12.5,mono:true,fill:f.k==='ans'?C.green:f.k==='want'?C.goldD:C.navy});}
  return svg(w,h,s,o.label||'algebra tiles');}
/* ---------- completing the square tiles: x² + bx ---------- */
function csTiles(b,o){o=o||{};var hb=b/2,Xl=o.X||92,U=o.U||Math.min(15,64/hb),L=56,T=30,W=Xl+hb*U,w=Math.max(o.w||0,L+W+30,o.foot?tw(o.foot.t,12.5,true)+30:0),h=T+W+(o.foot?36:12),s='';
  s+=rc(L,T,Xl,Xl,C.navyL,C.navy,1.6)+tx(L+Xl/2,T+Xl/2+5,'x²',{size:15,mono:true,bold:true});
  s+=rc(L+Xl,T,hb*U,Xl,'#C9D3E6',C.navy,1.6)+tx(L+Xl+hb*U/2,T+Xl/2+5,fmt(hb)+'x',{size:12,mono:true,bold:true,rot:hb*U<40?-90:0});
  s+=rc(L,T+Xl,Xl,hb*U,'#C9D3E6',C.navy,1.6)+tx(L+Xl/2,T+Xl+hb*U/2+5,fmt(hb)+'x',{size:12,mono:true,bold:true});
  var cs=o.corner||{t:'?',k:'want'},st=cellStyle(cs.k);
  s+=rc(L+Xl,T+Xl,hb*U,hb*U,st[0],st[1],2,0,cs.k==='want'?'4 3':null)+tx(L+Xl+hb*U/2,T+Xl+hb*U/2+5,cs.t,{size:12.5,mono:true,bold:true,fill:st[1]});
  s+=tx(L+Xl/2,T-9,'x',{size:14,mono:true,bold:true})+tx(L+Xl+hb*U/2,T-9,'+'+fmt(hb),{size:13,mono:true,bold:true});
  s+=tx(L-10,T+Xl/2+5,'x',{size:14,mono:true,bold:true,anchor:'end'})+tx(L-10,T+Xl+hb*U/2+5,'+'+fmt(hb),{size:13,mono:true,bold:true,anchor:'end'});
  if(o.foot){var f=o.foot;s+=tag(Math.max(L+W/2,tw(f.t,12.5,true)/2+12),h-11,f.t,{size:12.5,mono:true,fill:f.k==='ans'?C.green:f.k==='want'?C.goldD:C.navy});}
  return svg(w,h,s,o.label||'completing the square');}
/* ---------- difference of squares: cut and move ---------- */
function dosPic(a,b,o){o=o||{};var A=112,Bs=42,s='',L=34,T=30,solved=o.solved,lb=solved?C.green:C.goldD;
  s+=rc(L,T,A,A,C.navyL,C.navy,1.8)+rc(L+A-Bs,T+A-Bs,Bs,Bs,'#fff',C.red,1.8,0,'4 3')+tx(L+A-Bs/2,T+A-Bs/2+5,b+'²',{size:12,mono:true,bold:true,fill:C.red});
  s+=ln(L,T+A-Bs,L+A-Bs,T+A-Bs,C.navy,1.2,'3 3');
  s+=tx(L+A/2,T-9,a,{size:13,mono:true,bold:true})+tx(L-8,T+A/2+5,a,{size:13,mono:true,bold:true,anchor:'end'});
  var sq=function(t){return /^([a-z]|\d+)$/i.test(t)?t:'('+t+')';},al=sq(a)+'² − '+sq(b)+'²';
  s+=tx(L+(A-Bs)/2,T+(A-Bs)/2+5,al,{size:al.length>8?11:12,mono:true,bold:true});
  s+=arrow(L+A+10,T+A/2,L+A+42,T+A/2,C.navy,2);
  var x2=L+A+52,R=A-Bs;
  s+=rc(x2,T+10,A,R,C.navyL,C.navy,1.8)+rc(x2+A,T+10,Bs,R,'#C9D3E6',C.navy,1.8);
  s+=tx(x2+(A+Bs)/2,T+2,solved?'('+a+' + '+b+')':'?',{size:13,mono:true,bold:true,fill:lb});
  s+=tx(x2+(A+Bs)/2,T+10+R+20,solved?'('+a+' − '+b+')':'?',{size:13,mono:true,bold:true,fill:lb});
  s+=tx(x2+A+Bs/2,T+10+R/2+4,'moved',{size:9.5,fill:C.navy,rot:-90});
  var w=x2+A+Bs+10,h=T+A+(o.foot?34:12);
  if(o.foot)s+=tag(w/2,h-10,o.foot.t,{size:12.5,mono:true,fill:o.foot.k==='ans'?C.green:C.goldD});
  return svg(w,h,s,o.label||'difference of squares picture');}
/* ---------- number line with marked points ---------- */
function pointsLine(o){var w=o.w||360,y=o.y||58,A=axisX({x0:22,x1:w-22,y:y,min:o.min,max:o.max,step:o.step||1,lab:o.lab||1,title:o.title}),s='',X=A.X;
  (o.pts||[]).forEach(function(p,i){var col=p.c||C.navy;s+=ci(X(p.v),y,6,p.hollow?'#fff':col,col,2.2);
    if(p.t)s+=tag(X(p.v),y-14-(p.row||0)*20,p.t,{size:11.5,mono:true,fill:col===C.gold?C.goldD:col});});
  if(o.after)s+=o.after(X,y);
  return svg(w,y+(o.title?42:28),s+A.s,o.label||'number line');}
/* ---------- vertical flow chart (phone friendly) ---------- */
function flow(o){var w=360,s='',y=8,bxW=o.bw||172,rx=bxW+38,rw=w-10-rx;
  s+=rc(10,y,w-20,34,C.navy,null,0,8)+tx(w/2,y+22,o.start,{size:13,bold:true,fill:'#fff'});y+=34;
  if(o.pre){s+=arrow(10+bxW/2,y,10+bxW/2,y+18,C.navy,2);y+=18;s+=rc(10,y,w-20,34,'#F3F6FB',C.navy,1.5,8)+tx(w/2,y+22,o.pre,{size:12.5,bold:true});y+=34;}
  o.rows.forEach(function(r){s+=arrow(10+bxW/2,y,10+bxW/2,y+18,C.navy,2);y+=18;var hh=(r.q2||r.a2)?46:34;
    s+=rc(10,y,bxW,hh,C.goldL,C.gold,2,8)+tx(10+bxW/2,y+(r.q2?19:hh/2+5),r.q,{size:12,bold:true,fill:C.goldD})+(r.q2?tx(10+bxW/2,y+36,r.q2,{size:12,bold:true,fill:C.goldD}):'');
    s+=arrow(10+bxW,y+hh/2,rx-2,y+hh/2,C.navy,1.8)+tx((10+bxW+rx)/2,y+hh/2-5,'yes',{size:9.5,bold:true,fill:C.green});
    s+=rc(rx,y,rw,hh,C.greenL,C.green,2,8)+tx(rx+rw/2,y+(r.a2?19:22),r.a,{size:r.mono?12:11.5,bold:true,mono:r.mono,fill:C.green})+(r.a2?tx(rx+rw/2,y+36,r.a2,{size:11.5,bold:true,mono:r.mono2,fill:C.green}):'');
    y+=hh;if(r.no!==false)s+=tx(10+bxW/2+8,y+14,'no',{size:9.5,bold:true,fill:C.muted,anchor:'start'});});
  if(o.end){s+=arrow(10+bxW/2,y,10+bxW/2,y+18,C.navy,2);y+=18;s+=rc(10,y,w-20,34,'#F3F6FB',C.navy,1.5,8)+tx(w/2,y+22,o.end,{size:12,bold:true});y+=34;}
  return svg(w,y+8,s,o.label||'flow chart');}
/* ================= statistics ================= */
var St={
  sort:function(a){return a.slice().sort(function(x,y){return x-y;});},
  sum:function(a){return a.reduce(function(s,v){return s+v;},0);},
  mean:function(a){return St.sum(a)/a.length;},
  median:function(a){var s=St.sort(a),n=s.length;return n%2?s[(n-1)/2]:(s[n/2-1]+s[n/2])/2;},
  five:function(a){var s=St.sort(a),n=s.length,lo=s.slice(0,Math.floor(n/2)),hi=s.slice(Math.ceil(n/2));return [s[0],St.median(lo),St.median(s),St.median(hi),s[n-1]];},
  mad:function(a){var m=St.mean(a);return St.mean(a.map(function(v){return Math.abs(v-m);}));},
  sd:function(a){var m=St.mean(a);return Math.sqrt(St.mean(a.map(function(v){return (v-m)*(v-m);})));},
  lsrl:function(p){var n=p.length,sx=0,sy=0,sxy=0,sxx=0;p.forEach(function(q){sx+=q[0];sy+=q[1];sxy+=q[0]*q[1];sxx+=q[0]*q[0];});
    var b=(n*sxy-sx*sy)/(n*sxx-sx*sx);return {b:b,a:(sy-b*sx)/n};},
  r:function(p){var n=p.length,mx=0,my=0;p.forEach(function(q){mx+=q[0]/n;my+=q[1]/n;});var sxy=0,sxx=0,syy=0;
    p.forEach(function(q){sxy+=(q[0]-mx)*(q[1]-my);sxx+=(q[0]-mx)*(q[0]-mx);syy+=(q[1]-my)*(q[1]-my);});return sxy/Math.sqrt(sxx*syy);}
};
/* ================= answer parsing ================= */
function nrm(s){return String(s==null?'':s).trim().toLowerCase()
  .replace(/[−‒–—‐‑﹣－]/g,'-').replace(/[×·∙⋅]/g,'*').replace(/÷/g,'/')
  .replace(/²/g,'^2').replace(/³/g,'^3').replace(/√/g,'sqrt').replace(/ŷ/g,'y').replace(/\s+/g,'');}
function nz(v){return Math.abs(v)>1e-9;}
function ptrim(c){c=c.slice();while(c.length>1&&!nz(c[c.length-1]))c.pop();return c;}
function padd(a,b){var r=[];for(var i=0;i<Math.max(a.length,b.length);i++)r[i]=(a[i]||0)+(b[i]||0);return r;}
function pneg(a){return a.map(function(v){return -v;});}
function pmul(a,b){var r=[];for(var i=0;i<a.length+b.length-1;i++)r[i]=0;for(i=0;i<a.length;i++)for(var j=0;j<b.length;j++)r[i+j]+=a[i]*b[j];return r;}
function isConst(a){return ptrim(a).length===1;}
function parsePoly(str){var s=nrm(str).replace(/^(y|f\(x\)|p\(x\))=/,''),i=0;
  function expr(){var a=unary();while(i<s.length&&(s[i]==='+'||s[i]==='-')){var op=s[i++];var b=term1();a=op==='+'?padd(a,b):padd(a,pneg(b));}return a;}
  function term1(){return termRest(unary());}
  function termRest(a){while(i<s.length){var ch=s[i];
      if(ch==='*'){i++;a=pmul(a,unary());}
      else if(ch==='/'){i++;var b;if(s[i]==='-'){i++;b=pneg(power());}else b=power();if(!isConst(b)||!nz(b[0]))throw 0;a=a.map(function(v){return v/b[0];});}
      else if(/[0-9.x(\[s]/.test(ch)||s.substr(i,2)==='pi'){a=pmul(a,power());}
      else break;}return a;}
  function unary(){if(s[i]==='-'){i++;return pneg(unary());}if(s[i]==='+'){i++;return unary();}return termRest(power());}
  function power(){var b=atom();if(s[i]==='^'){i++;var e;if(s[i]==='('){i++;e=expr();if(s[i]!==')')throw 0;i++;}else{var neg=false;if(s[i]==='-'){neg=true;i++;}e=atom();if(neg)e=pneg(e);}
      if(!isConst(e))throw 0;var n=e[0];if(isConst(b))return [Math.pow(b[0],n)];if(n<0||n!==Math.floor(n)||n>8)throw 0;var r=[1];for(var k=0;k<n;k++)r=pmul(r,b);return r;}return b;}
  function atom(){var ch=s[i];
    if(ch==='('||ch==='['){var cl=ch==='('?')':']';i++;var v=expr();if(s[i]!==cl)throw 0;i++;return v;}
    if(s.substr(i,4)==='sqrt'){i+=4;var w;if(s[i]==='('){i++;w=expr();if(s[i]!==')')throw 0;i++;}else{w=atom();}if(!isConst(w)||w[0]<0)throw 0;return [Math.sqrt(w[0])];}
    if(s.substr(i,2)==='pi'){i+=2;return [Math.PI];}
    if(ch==='x'){i++;return [0,1];}
    var m=/^(\d+\.?\d*|\.\d+)/.exec(s.slice(i));if(m){i+=m[0].length;return [parseFloat(m[0])];}
    throw 0;}
  try{if(!s)return null;var r=expr();if(i!==s.length)return null;return ptrim(r);}catch(e){return null;}}
function numOf(raw){var s=nrm(raw);if(s.indexOf('=')>=0)s=s.slice(s.lastIndexOf('=')+1);var pct=false;
  s=s.replace(/(percent|students?|points?|pts|hours?|hrs?|h|minutes?|mins?|seconds?|secs?|s|people|squareunits|sq\.?units|units?\^2|units?|squarefeet|sq\.?ft|ft\^2|feet|foot|ft|squaremeters|sq\.?m|m\^2|meters?|m|cm|inches|inch|in|miles?|mi|mph|years?|yrs?|games?|dollars?|degrees?|°f|°c|°)$/,'');
  if(/%$/.test(s)){pct=true;s=s.slice(0,-1);}s=s.replace(/^\$/,'');
  var c=parsePoly(s);if(!c||!isConst(c))return null;return {v:c[0],pct:pct};}
function setOf(raw){var s=nrm(String(raw==null?'':raw).replace(/(\d)\s+(?=[-\u2212]?\d)/g,'$1,')).replace(/[{}]/g,'').replace(/\+\/-|\+-/g,'±');
  s=s.replace(/f\(x\)=/g,'').replace(/[xy]=/g,'');
  var parts=s.split(/,|;|or|and|&/).filter(function(p){return p.length;}),out=[];if(!parts.length)return null;
  for(var k=0;k<parts.length;k++){var p=parts[k].replace(/^x=/,'');
    var vs=p.indexOf('±')>=0?[p.replace('±','+'),p.replace('±','-')]:[p];
    for(var j=0;j<vs.length;j++){var c=parsePoly(vs[j]);if(!c||!isConst(c))return null;out.push(c[0]);}}
  return out;}
function ptOf(raw){var s=nrm(raw);if(s.indexOf('=')>=0)s=s.slice(s.lastIndexOf('=')+1);s=s.replace(/^[(\[]|[)\]]$/g,'');var p=s.split(/,|;/);if(p.length!==2)return null;
  var a=parsePoly(p[0]),b=parsePoly(p[1]);if(!a||!b||!isConst(a)||!isConst(b))return null;return [a[0],b[0]];}
function close(a,b,t){return Math.abs(a-b)<=(t==null?1e-6:t);}
function sameSet(a,b,t){if(a.length!==b.length)return false;var x=a.slice().sort(function(p,q){return p-q;}),y=b.slice().sort(function(p,q){return p-q;});
  return x.every(function(v,i){return close(v,y[i],t);});}
function peq(a,b){a=ptrim(a);b=ptrim(b);if(a.length!==b.length)return false;for(var i=0;i<a.length;i++)if(Math.abs(a[i]-b[i])>1e-9)return false;return true;}
function sup(n){return String(n).split('').map(function(d){return '⁰¹²³⁴⁵⁶⁷⁸⁹'[+d];}).join('');}
function pstr(c){c=ptrim(c);var out='';for(var d=c.length-1;d>=0;d--){var v=c[d];if(!nz(v))continue;var a=Math.abs(v);
    var coef=(d>0&&Math.abs(a-1)<1e-9)?'':fmt(a,3);var t=coef+(d===0?'':(d===1?'x':'x'+sup(d)));
    out+=out?(v<0?' − ':' + ')+t:(v<0?'−':'')+t;}return out||'0';}
/* split a product like 3x(x+4)(x-2)^2 into factors; returns null if not a product */
function factorsOf(raw){var s=nrm(raw).replace(/^(y|f\(x\))=/,''),depth=0,out=[],mono='',i=0;
  if(s.indexOf('(')<0)return null;
  while(i<s.length){var ch=s[i];
    if(ch==='('){var j=i,d=0;do{if(s[j]==='(')d++;if(s[j]===')')d--;j++;}while(j<s.length&&d>0);if(d)return null;
      var inner=s.slice(i+1,j-1),pw=1;var m=/^\^(\d)/.exec(s.slice(j));if(m){pw=+m[1];j+=m[0].length;}
      for(var k=0;k<pw;k++)out.push(inner);i=j;if(s[i]==='*')i++;continue;}
    if((ch==='+'||ch==='-')&&i>0&&!(mono===''&&ch==='-'))return null;
    mono+=ch;i++;}
  mono=mono.replace(/\*/g,'');return {mono:mono,fs:out};}
function gcdInt(a,b){a=Math.abs(Math.round(a));b=Math.abs(Math.round(b));while(b){var t=b;b=a%b;a=t;}return a;}
/* ================= items + feedback ================= */
var SPEC={},EX={},FIG={},INT={},started={};
function el(id){return document.getElementById(id);}
function fb(id,ok,msg){var f=el('fb-'+id);if(!f)return;f.innerHTML=msg;f.className='chk-fb show '+(ok?'c':'x');}
function score(first,ok){try{if(first)_answered++;if(ok)_correct++;_updateScore();}catch(e){}}
function render(id,state){var sp=SPEC[id],box=el('v-'+id);if(!sp||!box||!sp.viz)return;box.innerHTML=sp.viz(state||'q')+(sp.cap?'<div class="diagram-cap">'+sp.cap+'</div>':'');}
function solveViz(id){var sp=SPEC[id];if(sp&&sp.viz)render(id,'solved');}
function judge(sp,raw){var ans=typeof sp.ans==='function'?sp.ans():sp.ans,t=sp.tol,i,v,f;
  function custom(match){for(i=0;i<(sp.fb||[]).length;i++){f=sp.fb[i];if(match(f[0]))return f[1];}return null;}
  switch(sp.type){
  case 'num':{var p=numOf(raw);if(!p)return {ok:false,msg:'I can’t read that as a number. Type just the number, like <b>7</b>, <b>−2</b> or <b>2.5</b>.'};
    v=p.v;if(sp.pct&&!p.pct&&Math.abs(v)<=1&&Math.abs(ans)>1)v*=100;
    if(close(v,ans,t))return {ok:true};
    var m=custom(function(k){return typeof k==='function'?k(v):close(v,k,sp.fbTol!=null?sp.fbTol:(t||1e-6));});if(m)return {ok:false,msg:m};
    if(nz(ans)&&close(-v,ans,t))return {ok:false,msg:'So close — the size is right, but check the <b>sign</b> (+ or −).'};
    if(sp.round&&close(v,ans,sp.round))return {ok:false,msg:'Very close! Round the way the question asks.'};
    return {ok:false,msg:sp.hint||'Not yet. Look at the picture and try once more.'};}
  case 'set':{var a=setOf(raw);if(!a)return {ok:false,msg:'Type the solutions with commas, like <b>x = 2, 3</b>, <b>−4 or 1</b>, or <b>±7</b>.'};
    if(sameSet(a,ans,t))return {ok:true};
    m=custom(function(k){return typeof k==='function'?k(a):sameSet(a,k,t||1e-6);});if(m)return {ok:false,msg:m};
    if(a.length<ans.length&&a.every(function(x){return ans.some(function(y){return close(x,y,t);});}))return {ok:false,msg:'Good start — '+a.map(function(x){return 'x = '+fmt(x);}).join(', ')+' is right. A quadratic can have <b>two</b> solutions. Find the other one.'};
    if(a.length===ans.length&&sameSet(a.map(function(x){return -x;}),ans,t))return {ok:false,msg:'Your signs are flipped. If (x − 3) = 0, then x = <b>+3</b>. Set each factor equal to 0 and solve.'};
    return {ok:false,msg:sp.hint||'Not yet. Check each answer by plugging it back into the equation.'};}
  case 'pt':{var q=ptOf(raw);if(!q)return {ok:false,msg:'Type a point like <b>(1, −4)</b>.'};
    if(close(q[0],ans[0],t)&&close(q[1],ans[1],t))return {ok:true};
    m=custom(function(k){return close(q[0],k[0],t)&&close(q[1],k[1],t);});if(m)return {ok:false,msg:m};
    if(close(q[0],ans[1],t)&&close(q[1],ans[0],t))return {ok:false,msg:'You switched x and y. Write the point as <b>(x, y)</b>: x first.'};
    if(close(q[0],ans[0],t))return {ok:false,msg:'The x-value is right. Now find y by plugging x into the equation.'};
    return {ok:false,msg:sp.hint||'Not yet. Find x first, then y.'};}
  case 'poly':{var c=parsePoly(raw);if(!c)return {ok:false,msg:'I can’t read that. Type it like <b>x^2+5x+6</b> (use ^ for exponents).'};
    var tgt=ans;m=custom(function(k){return peq(c,parsePoly(k));});if(m&&!peq(c,tgt))return {ok:false,msg:m};
    if(peq(c,tgt)){if(/\(/.test(nrm(raw)))return {ok:false,msg:'That is equal, but it still has parentheses. Multiply it out and combine like terms.'};return {ok:true};}
    var tips=[];if(!close(c[2]||0,tgt[2]||0))tips.push('the <b>x²</b> term (first × first)');
    if(!close(c[1]||0,tgt[1]||0))tips.push('the <b>x</b> term (add the two middle boxes)');
    if(!close(c[0]||0,tgt[0]||0))tips.push('the <b>number</b> term (last × last — watch the sign)');
    return {ok:false,msg:'Not yet. You wrote '+pstr(c)+'. Check '+tips.join(' and ')+'.'};}
  case 'factor':{c=parsePoly(raw);if(!c)return {ok:false,msg:'I can’t read that. Type it like <b>(x+3)(x+4)</b>.'};
    tgt=ans;var fs=factorsOf(raw);
    m=custom(function(k){return peq(c,parsePoly(k))&&nrm(k)===nrm(raw);});if(m)return {ok:false,msg:m};
    if(!peq(c,tgt)){m=custom(function(k){return peq(c,parsePoly(k));});if(m)return {ok:false,msg:m};
      if(fs)return {ok:false,msg:'Check by multiplying: your factors give <b>'+pstr(c)+'</b>. We need <b>'+pstr(tgt)+'</b>.'+((Math.abs(c[0]-tgt[0])<1e-9&&Math.abs((c[1]||0)+(tgt[1]||0))<1e-9)?' Only the middle sign is off — switch the signs in your factors.':'')};
      return {ok:false,msg:'Not yet. Your answer equals '+pstr(c)+', not '+pstr(tgt)+'.'};}
    if(!fs)return {ok:false,msg:'That is the same polynomial — but it isn’t factored yet. Write it as a <b>product</b>, like (x + _)(x + _).'};
    for(i=0;i<fs.fs.length;i++){var fc=parsePoly(fs.fs[i]);if(!fc)continue;
      if(fc.length>2)return {ok:false,msg:'Almost! The factor ('+pstr(fc)+') can still be factored. Keep going.'};
      if(fc.length===2&&gcdInt(fc[0],fc[1])>1&&Number.isInteger(fc[0])&&Number.isInteger(fc[1]))return {ok:false,msg:'Almost! ('+pstr(fc)+') still has a common factor of '+gcdInt(fc[0],fc[1])+'. Pull it out too.'};}
    return {ok:true};}
  case 'text':{var s=nrm(raw);if((sp.accept||[]).some(function(k){return nrm(k)===s;}))return {ok:true};
    m=custom(function(k){return nrm(k)===s;});return {ok:false,msg:m||sp.hint||'Not yet — look again.'};}
  }
  return {ok:false,msg:'?'};}
function check(id){var sp=SPEC[id],card=el(id);if(!sp||!card||card.dataset.solved)return;
  if(sp.type==='multi'){var allOk=true,msgs=[],any=false;
    sp.parts.forEach(function(p){var inp=el(id+'-'+p.k);if(!inp)return;if(inp.value.trim())any=true;});
    if(!any){fb(id,false,'Type your answers first.');return;}
    sp.parts.forEach(function(p){var inp=el(id+'-'+p.k);if(inp.disabled)return;var r=inp.value.trim()?judge(p,inp.value):{ok:false,msg:'Fill in this box.'};
      inp.classList.remove('ok','bad');inp.classList.add(r.ok?'ok':'bad');if(r.ok)inp.disabled=true;else{allOk=false;msgs.push('<b>'+p.label+':</b> '+r.msg);}});
    var first=!started[id];started[id]=1;
    if(allOk){card.dataset.solved='1';score(first,true);fb(id,true,'✓ All correct! '+(sp.ok||''));solveViz(id);}
    else{score(first,false);fb(id,false,msgs.join('<br>'));}
    return;}
  var inp=el(id+'-in');if(!inp)return;if(!inp.value.trim()){fb(id,false,'Type your answer first.');return;}
  var r=judge(sp,inp.value),first2=!started[id];started[id]=1;
  if(r.ok){card.dataset.solved='1';inp.disabled=true;inp.classList.add('ok');score(first2,true);fb(id,true,'✓ Correct! '+(sp.ok||''));solveViz(id);if(sp.then)sp.then();}
  else{inp.classList.add('bad');score(first2,false);fb(id,false,r.msg);}}
function mc(id,btn){var sp=SPEC[id],card=el(id);if(!sp||!card||card.dataset.solved)return;var v=btn.getAttribute('data-v'),first=!started[id];started[id]=1;
  if(v===String(sp.ans)){card.dataset.solved='1';btn.classList.add('correct');card.querySelectorAll('.chk-btn').forEach(function(b){b.disabled=true;});
    score(first,first);fb(id,true,'✓ '+(first?'Correct! ':'Yes — that’s it. ')+(sp.ok||''));solveViz(id);}
  else{btn.classList.add('wrong');btn.disabled=true;if(first)score(true,false);fb(id,false,((sp.fb||{})[v]||'Not this one.')+' Try another choice.');}}
/* ---------- worked examples in notes ---------- */
function drawEx(name,stage){var e=EX[name],box=document.querySelector('[data-ex="'+name+'"]');if(!e||!box)return;
  box.innerHTML=e.viz(stage)+(e.cap?'<div class="diagram-cap">'+e.cap+'</div>':'');}
function exStage(name){var steps=document.querySelectorAll('.steps[data-example="'+name+'"] .step');if(!steps.length)return 'q';
  var n=0;steps.forEach(function(s){if(s.classList.contains('revealed'))n++;});var fin=steps[steps.length-1].classList.contains('revealed');return fin?'solved':n;}
function hook(){
  if(typeof window.reveal==='function'){var r0=window.reveal;window.reveal=function(s){r0(s);var p=s.closest('.steps');if(p){var n=p.getAttribute('data-example');if(EX[n])drawEx(n,exStage(n));}};}
  if(typeof window.revealAll==='function'){var r1=window.revealAll;window.revealAll=function(id){r1(id);if(EX[id])drawEx(id,'solved');};}
  if(typeof window.revealPage==='function'){var r2=window.revealPage;window.revealPage=function(){r2();Object.keys(EX).forEach(function(n){drawEx(n,'solved');});Object.keys(SPEC).forEach(function(id){if(SPEC[id].viz)render(id,'solved');});};}
  if(typeof window.sa==='function'){var r3=window.sa;window.sa=function(b){r3(b);var c=b.closest('[data-item]');if(c&&SPEC[c.id])solveViz(c.id);};}}
function init(){
  Object.keys(SPEC).forEach(function(id){render(id,'q');var card=el(id);if(card)card.setAttribute('data-item','1');});
  Object.keys(EX).forEach(function(n){drawEx(n,exStage(n));});
  document.querySelectorAll('[data-fig]').forEach(function(b){var f=FIG[b.getAttribute('data-fig')];if(f){var cap=b.getAttribute('data-cap');b.innerHTML=f()+(cap?'<div class="diagram-cap">'+cap+'</div>':'');}});
  document.querySelectorAll('[data-int]').forEach(function(b){var f=INT[b.getAttribute('data-int')];if(f)f(b);});
  document.querySelectorAll('.mgrid input, .val-chk input').forEach(function(inp){inp.setAttribute('autocomplete','off');inp.setAttribute('autocapitalize','off');inp.setAttribute('spellcheck','false');
    inp.addEventListener('input',function(){inp.classList.remove('bad');});
    if(inp.closest('.mgrid'))inp.addEventListener('keydown',function(e){if(e.key==='Enter'){var c=inp.closest('[data-item]');if(c)check(c.id);}});});
  hook();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else setTimeout(init,0);
return {C:C,svg:svg,ln:ln,tx:tx,rc:rc,ci:ci,pg:pg,pl:pl,arrow:arrow,tag:tag,fmt:fmt,sgn:sgn,sc:sc,esc:esc,axisX:axisX,
  dotPlot:dotPlot,histogram:histogram,boxPlots:boxPlots,scatter:scatter,plane:plane,areaModel:areaModel,tileRect:tileRect,csTiles:csTiles,
  dosPic:dosPic,pointsLine:pointsLine,flow:flow,St:St,parsePoly:parsePoly,setOf:setOf,numOf:numOf,ptOf:ptOf,pstr:pstr,peq:peq,factorsOf:factorsOf,
  judge:judge,check:check,mc:mc,SPEC:SPEC,EX:EX,FIG:FIG,INT:INT,render:render,drawEx:drawEx,uid:function(){return ++uid;}};
})();
