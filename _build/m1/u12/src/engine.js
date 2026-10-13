/* ==========================================================
   M1 page helper: draws each problem's picture from its own
   numbers and checks typed answers. (Page-local copy.)
   Colors: navy = given, gold = what we want, green = answer.
   ========================================================== */
var M1=(function(){
'use strict';
var C={navy:'#1E2D4F',navyBg:'#E8ECF4',gold:'#E0A800',goldTx:'#6E5300',goldBg:'#FFF4CC',green:'#15803D',greenBg:'#E3F4E8',
  grid:'#DCE2EB',axis:'#6B7280',muted:'#55607A',neg:'#B42318',negBg:'#FDECEA'};
var MONO='JetBrains Mono, ui-monospace, Menlo, monospace', SANS='Inter, system-ui, sans-serif';
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function r(n){return Math.round(n*10)/10;}
function fm(n){ if(typeof n!=='number') return String(n);
  var v=Math.round(n*1000)/1000; if(v===0) v=0; return (v<0?'−':'')+Math.abs(v); }
function K(k){ // kind -> colors
  if(k==='want') return {f:C.goldBg,s:C.gold,t:C.goldTx};
  if(k==='ans') return {f:C.greenBg,s:C.green,t:C.green};
  if(k==='neg') return {f:'#fff',s:C.neg,t:C.neg};
  if(k==='plain') return {f:'#fff',s:'#B8C2D3',t:C.navy};
  return {f:C.navyBg,s:C.navy,t:C.navy};
}

/* ---------- tiny SVG builder; text is clamped inside the box ---------- */
function Svg(w,h,label){this.w=w;this.h=h;this.p=[];this.label=label||'diagram';}
var P=Svg.prototype;
P.add=function(s){this.p.push(s);return this;};
P.line=function(x1,y1,x2,y2,c,sw,dash){return this.add('<line x1="'+r(x1)+'" y1="'+r(y1)+'" x2="'+r(x2)+'" y2="'+r(y2)+'" stroke="'+c+'" stroke-width="'+(sw||1)+'"'+(dash?' stroke-dasharray="'+dash+'"':'')+' stroke-linecap="round"/>');};
P.rect=function(x,y,w,h,fill,stroke,sw,rx,dash){return this.add('<rect x="'+r(x)+'" y="'+r(y)+'" width="'+r(w)+'" height="'+r(h)+'" rx="'+(rx||0)+'" fill="'+(fill||'none')+'"'+(stroke?' stroke="'+stroke+'" stroke-width="'+(sw||1)+'"':'')+(dash?' stroke-dasharray="'+dash+'"':'')+'/>');};
P.circ=function(cx,cy,rr,fill,stroke,sw){return this.add('<circle cx="'+r(cx)+'" cy="'+r(cy)+'" r="'+rr+'" fill="'+(fill||'none')+'"'+(stroke?' stroke="'+stroke+'" stroke-width="'+(sw||1)+'"':'')+'/>');};
P.poly=function(pts,fill,stroke,sw){return this.add('<polygon points="'+pts.map(function(p){return r(p[0])+','+r(p[1]);}).join(' ')+'" fill="'+(fill||'none')+'"'+(stroke?' stroke="'+stroke+'" stroke-width="'+(sw||1)+'"':'')+'/>');};
P.path=function(d,fill,stroke,sw,dash,op){return this.add('<path d="'+d+'" fill="'+(fill||'none')+'"'+(stroke?' stroke="'+stroke+'" stroke-width="'+(sw||1)+'" stroke-linejoin="round" stroke-linecap="round"':'')+(dash?' stroke-dasharray="'+dash+'"':'')+(op?' opacity="'+op+'"':'')+'/>');};
P.arrow=function(x1,y1,x2,y2,c,sw,head,dash){head=head||8;var a=Math.atan2(y2-y1,x2-x1),bx=x2-head*Math.cos(a),by=y2-head*Math.sin(a),hw=head*0.55;
  this.line(x1,y1,bx,by,c,sw||1.6,dash);
  return this.poly([[x2,y2],[bx+hw*Math.sin(a),by-hw*Math.cos(a)],[bx-hw*Math.sin(a),by+hw*Math.cos(a)]],c);};
var MINF=13.2; /* never smaller than 13 units: about 12 px on a phone */
P.text=function(x,y,str,o){o=o||{};var fs=Math.max(o.size||12,MINF),a=o.anchor||'middle',sans=o.font==='sans';
  var n=Array.from(String(str)).length,k=(sans?0.6:0.62)*(o.weight>=700?1.05:1),wd=n*fs*k;
  if(!o.rot&&wd>this.w-6){fs=Math.max(12,(this.w-6)/(n*k));wd=n*fs*k;}
  if(!o.rot){var left=a==='start'?x:(a==='middle'?x-wd/2:x-wd),m=3;
    if(left+wd>this.w-m) left=this.w-m-wd; if(left<m) left=m;
    x=a==='start'?left:(a==='middle'?left+wd/2:left+wd);
    if(y-fs*0.8<2) y=2+fs*0.8; if(y+fs*0.25>this.h-2) y=this.h-2-fs*0.25;}
  return this.add('<text x="'+r(x)+'" y="'+r(y)+'" font-size="'+fs+'" font-family="'+(sans?SANS:MONO)+'" text-anchor="'+a+'" fill="'+(o.c||C.navy)+'"'+
    (o.weight?' font-weight="'+o.weight+'"':'')+(o.italic?' font-style="italic"':'')+
    (o.halo?' paint-order="stroke" stroke="#fff" stroke-width="4" stroke-linejoin="round"':'')+
    (o.rot?' transform="rotate('+o.rot+' '+r(x)+' '+r(y)+')"':'')+'>'+esc(str)+'</text>');};
P.box=function(x,y,w,h,txt,k,fs,rx){var c=K(k);this.rect(x,y,w,h,c.f,c.s,k==='want'?2:1.6,rx==null?6:rx,k==='want'?'5 3':null);
  if(txt!=null&&txt!=='') this.text(x+w/2,y+h/2+(fs||13)*0.36,txt,{size:fs||13,c:c.t,weight:700});return this;};
P.toString=function(){return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+this.w+' '+this.h+'" width="'+this.w+'" height="'+this.h+'" role="img" aria-label="'+esc(this.label)+'"><title>'+esc(this.label)+'</title>'+this.p.join('')+'</svg>';};

/* ---------- coordinate grid ---------- */
function grid(o){
  var W=o.w||300,H=o.h||W,L=o.L!=null?o.L:30,R=o.R!=null?o.R:12,T=o.T!=null?o.T:(o.title?28:12),B=o.B!=null?o.B:(o.xTitle?40:24);
  if(o.L==null&&!(o.xmin<0)){var _yl=o.yl||(o.gy||1)*Math.max(1,Math.ceil((o.ymax-o.ymin)/(o.gy||1)/10)),_mw=0;
    for(var _y=Math.ceil(o.ymin/_yl-1e-9)*_yl;_y<=o.ymax+1e-9;_y+=_yl) _mw=Math.max(_mw,Array.from(fm(Math.round(_y*100)/100)).length*MINF*0.62);
    L=Math.max(L,_mw+10);}
  if(o.yTitle) T+=18;
  var s=new Svg(W,H,o.label||'coordinate graph'),x0=o.xmin,x1=o.xmax,y0=o.ymin,y1=o.ymax;
  var X=function(x){return L+(x-x0)/(x1-x0)*(W-L-R);},Y=function(y){return H-B-(y-y0)/(y1-y0)*(H-T-B);};
  /* label placer: every label looks for a free spot (not on a line, not on another label) */
  var occ=[],segs=[];
  function tw(t,fs,sans){return Array.from(String(t)).length*fs*(sans?0.6:0.62)*1.05;}
  function occupy(q){occ.push(q);}
  function rectOf(x,y,t,fs,anchor,sans){var w=tw(t,fs,sans),l=anchor==='start'?x:anchor==='end'?x-w:x-w/2;return {x:l-1,y:y-fs*0.8-1,w:w+2,h:fs+2};}
  function segHit(g,q){var x1_=g[0],y1_=g[1],dx=g[2]-x1_,dy=g[3]-y1_,t0=0,t1=1,p=[-dx,dx,-dy,dy],qq=[x1_-q.x,q.x+q.w-x1_,y1_-q.y,q.y+q.h-y1_];
    for(var k=0;k<4;k++){if(p[k]===0){if(qq[k]<0) return false;continue;}var t=qq[k]/p[k];if(p[k]<0){if(t>t1) return false;if(t>t0) t0=t;}else{if(t<t0) return false;if(t<t1) t1=t;}}return true;}
  /* lvl 0: clear of lines, labels and tick numbers; 1: may cover a tick number (it is then hidden); 2: may also cross a line */
  function free(q,lvl){if(q.x<2||q.y<2||q.x+q.w>W-2||q.y+q.h>H-2) return false;
    var pd=lvl?0:2;for(var k=0;k<occ.length;k++){var p=occ[k];if(lvl&&p.tick) continue;if(q.x<p.x+p.w+pd&&q.x+q.w+pd>p.x&&q.y<p.y+p.h&&q.y+q.h>p.y) return false;}
    if(lvl<2) for(k=0;k<segs.length;k++) if(segHit(segs[k],q)) return false;
    return true;}
  /* cands: [[x,y,anchor],...] -> first free one (lines first, then only labels), else the first */
  function place(cands,t,fs,sans){for(var pass=0;pass<3;pass++) for(var k=0;k<cands.length;k++){var c=cands[k],q=rectOf(c[0],c[1],t,fs,c[2],sans);if(free(q,pass)){occupy(q);return c;}}
    var c0=cands[0];occupy(rectOf(c0[0],c0[1],t,fs,c0[2],sans));return c0;}
  function seg(a,b,c,d){segs.push([a,b,c,d]);}
  s.rect(0,0,W,H,'#fff'); s.rect(L,T,W-L-R,H-T-B,'#FCFDFF');
  var gx=o.gx||1,gy=o.gy||1,i,x,y;
  for(x=Math.ceil(x0/gx-1e-9)*gx;x<=x1+1e-9;x+=gx) s.line(X(x),T,X(x),H-B,C.grid,1);
  for(y=Math.ceil(y0/gy-1e-9)*gy;y<=y1+1e-9;y+=gy) s.line(L,Y(y),W-R,Y(y),C.grid,1);
  var ax=(y0<=0&&0<=y1)?0:y0, ay=(x0<=0&&0<=x1)?0:x0, inner=(ax===0&&ay===0&&x0<0&&y0<0);
  /* highlighted spans on the axes (domain / range) */
  (o.xBand?[].concat(o.xBand):[]).forEach(function(b){var c=b.k==='ans'?C.green:C.gold;s.add('<rect x="'+r(X(b.a))+'" y="'+r(Y(ax)-5)+'" width="'+r(X(b.b)-X(b.a))+'" height="10" rx="4" fill="'+c+'" opacity="0.6"/>');});
  (o.yBand?[].concat(o.yBand):[]).forEach(function(b){var c=b.k==='ans'?C.green:C.gold;s.add('<rect x="'+r(X(ay)-5)+'" y="'+r(Y(b.b))+'" width="10" height="'+r(Y(b.a)-Y(b.b))+'" rx="4" fill="'+c+'" opacity="0.6"/>');});
  s.line(L,Y(ax),W-R,Y(ax),C.axis,1.7); s.line(X(ay),T,X(ay),H-B,C.axis,1.7);
  seg(L,Y(ax),W-R,Y(ax)); seg(X(ay),T,X(ay),H-B); var under=s.p.length;
  var xl=o.xl||gx*Math.max(1,Math.ceil((x1-x0)/gx/10)), yl=o.yl||gy*Math.max(1,Math.ceil((y1-y0)/gy/10)), lastR=-1e9;
  for(x=Math.ceil(x0/xl-1e-9)*xl;x<=x1+1e-9;x+=xl){ if(Math.abs(x-ay)<1e-9&&inner) continue;
    var xt=fm(Math.round(x*100)/100),xr=rectOf(X(x),Y(ax)+15,xt,MINF,'middle');
    s.line(X(x),Y(ax)-3,X(x),Y(ax)+3,C.axis,1.2); if(xr.x<lastR+2) continue; lastR=xr.x+xr.w; xr.tick=1; xr.t=[X(x),Y(ax)+15,xt,'middle']; xr.alt=[X(x),Y(ax)-6,'middle']; occupy(xr); }
  var lastB=1e9;
  for(y=Math.ceil(y0/yl-1e-9)*yl;y<=y1+1e-9;y+=yl){ if(Math.abs(y-ax)<1e-9&&(inner||(ay===x0&&ax===y0))) continue;
    var yt=fm(Math.round(y*100)/100),yr=rectOf(X(ay)-5,Y(y)+4.5,yt,MINF,'end');
    s.line(X(ay)-3,Y(y),X(ay)+3,Y(y),C.axis,1.2); if(yr.y+yr.h>lastB-1) continue; lastB=yr.y; yr.tick=1; yr.t=[X(ay)-5,Y(y)+4.5,yt,'end']; yr.alt=[X(ay)+5,Y(y)+4.5,'start']; occupy(yr); }
  if(inner){ /* the origin 0 sits below-left of the origin; if that crowds the −1 tick it goes above-left, else it is left out */
    var tk=function(q){return occ.some(function(p){return p.tick&&q.x<p.x+p.w+3&&q.x+q.w+3>p.x&&q.y<p.y+p.h&&q.y+q.h>p.y;});};
    var zr=rectOf(X(0)-5,Y(0)+15,'0',MINF,'end'),za=rectOf(X(0)-5,Y(0)-6,'0',MINF,'end');
    if(!tk(zr)){ zr.tick=1; zr.t=[X(0)-5,Y(0)+15,'0','end']; zr.alt=[X(0)-5,Y(0)-6,'end']; occupy(zr);}
    else if(!tk(za)){ za.tick=1; za.t=[X(0)-5,Y(0)-6,'0','end']; za.alt=[X(0)-5,Y(0)+15,'end']; occupy(za);} }
  s.text(W-R-3,Y(ax)-6,o.xName||'x',{size:12,c:C.muted,italic:true,anchor:'end',halo:true}); occupy(rectOf(W-R-3,Y(ax)-6,o.xName||'x',MINF,'end'));
  s.text(X(ay)+6,T+12,o.yName||'y',{size:12,c:C.muted,italic:true,anchor:'start',halo:true}); occupy(rectOf(X(ay)+6,T+12,o.yName||'y',MINF,'start'));
  if(o.title) s.text(W/2,17,o.title,{size:12.5,font:'sans',weight:700});
  if(o.xTitle) s.text((L+W-R)/2,H-6,o.xTitle,{size:11,font:'sans',c:C.muted});
  if(o.yTitle) s.text(4,T-8,'↑ '+o.yTitle,{size:12.5,font:'sans',c:C.muted,anchor:'start',weight:600});
  function inPlot(xx,yy){return xx>=x0-1e-9&&xx<=x1+1e-9&&yy>=y0-1e-9&&yy<=y1+1e-9;}
  function clip(m,b,xa,xb){var lo=Math.max(xa,x0),hi=Math.min(xb,x1);
    if(m!==0){var p=(y0-b)/m,q=(y1-b)/m;lo=Math.max(lo,Math.min(p,q));hi=Math.min(hi,Math.max(p,q));} else if(b<y0||b>y1) return null;
    return lo<hi?[lo,hi]:null;}
  function col(k){return k==='want'?C.gold:k==='ans'?C.green:k==='neg'?C.neg:k==='muted'?'#9AA6B8':C.navy;}
  function tcol(c){return c===C.gold?C.goldTx:c;}
  var later=[],laterTri=[];   /* labels are placed after every line and point is known */
  /* lines y = mx + b */
  (o.lines||[]).forEach(function(l){var c=col(l.k),sg=clip(l.m,l.b,l.xa!=null?l.xa:-1e9,l.xb!=null?l.xb:1e9);if(!sg) return;
    var xa=sg[0],xb=sg[1],arr=l.arrows!==false;
    if(arr){s.arrow(X((xa+xb)/2),Y(l.m*(xa+xb)/2+l.b),X(xa),Y(l.m*xa+l.b),c,l.sw||2.6,9,l.dash);s.arrow(X((xa+xb)/2),Y(l.m*(xa+xb)/2+l.b),X(xb),Y(l.m*xb+l.b),c,l.sw||2.6,9,l.dash);}
    else s.line(X(xa),Y(l.m*xa+l.b),X(xb),Y(l.m*xb+l.b),c,l.sw||2.6,l.dash);
    seg(X(xa),Y(l.m*xa+l.b),X(xb),Y(l.m*xb+l.b));
    if(l.lbl) later.push(function(){
      var fr=[l.lx!=null?(Math.max(xa,Math.min(xb,l.lx))-xa)/(xb-xa):0.22,0.8,0.22,0.5,0.65,0.35,0.9,0.1],cands=[],alt=l.lpos==='alt';
      var lx0=l.lx!=null?Math.max(xa,Math.min(xb,l.lx)):xa+(xb-xa)*0.22,dy0=(l.m>0)!==alt?17:-9; if(l.m===0) dy0=-8;
      cands.push([X(lx0)+(alt?-8:8),Y(l.m*lx0+l.b)+dy0,alt?'end':'start']);
      var ux=X(xb)-X(xa),uy=Y(l.m*xb+l.b)-Y(l.m*xa+l.b),len=Math.sqrt(ux*ux+uy*uy)||1,nx=-uy/len,ny=ux/len,w=tw(l.lbl,MINF),h=MINF;
      fr.forEach(function(f){var px=X(xa)+ux*f,py=Y(l.m*xa+l.b)+uy*f,d=Math.abs(nx)*w/2+Math.abs(ny)*h/2+7;
        cands.push([px+nx*d,py+ny*d+h*0.35,'middle']);cands.push([px-nx*d,py-ny*d+h*0.35,'middle']);});
      var c0=place(cands,l.lbl,MINF);s.text(c0[0],c0[1],l.lbl,{size:12,c:tcol(c),weight:700,anchor:c0[2],halo:true});});});
  /* sampled curves */
  (o.curves||[]).forEach(function(cv){var c=col(cv.k),d='',pen=false,N=160,xa=cv.xa!=null?cv.xa:x0,xb=cv.xb!=null?cv.xb:x1,prev=null;
    var pts=cv.pts||Array.from({length:N+1},function(_,j){var xx=xa+(xb-xa)*j/N;return [xx,cv.f(xx)];});
    pts.forEach(function(p){if(inPlot(p[0],p[1])){d+=(pen?'L':'M')+r(X(p[0]))+','+r(Y(p[1]));if(pen&&prev) seg(prev[0],prev[1],X(p[0]),Y(p[1]));prev=[X(p[0]),Y(p[1])];pen=true;}else{pen=false;prev=null;}});
    s.path(d,null,c,cv.sw||2.6,cv.dash);
    if(cv.lbl) later.push(function(){var c0=place([[X(cv.lx),Y(cv.ly),cv.anchor||'middle'],[X(cv.lx),Y(cv.ly)-16,cv.anchor||'middle'],[X(cv.lx),Y(cv.ly)+18,cv.anchor||'middle']],cv.lbl,MINF);
      s.text(c0[0],c0[1],cv.lbl,{size:12,c:tcol(c),weight:700,halo:true,anchor:c0[2]});});});
  /* segments with endpoints */
  (o.segs||[]).forEach(function(sg){var c=col(sg.k),p=sg.pts;for(i=0;i<p.length-1;i++){s.line(X(p[i][0]),Y(p[i][1]),X(p[i+1][0]),Y(p[i+1][1]),sg.hl&&sg.hl.indexOf(i)>=0?C.green:c,sg.hl&&sg.hl.indexOf(i)>=0?4.5:(sg.sw||2.6));seg(X(p[i][0]),Y(p[i][1]),X(p[i+1][0]),Y(p[i+1][1]));}
    if(sg.ends!==false){[p[0],p[p.length-1]].forEach(function(e,j){var open=sg.open&&sg.open[j];s.circ(X(e[0]),Y(e[1]),4.6,open?'#fff':c,c,2);});}
    if(sg.dots) p.forEach(function(e){s.circ(X(e[0]),Y(e[1]),4.2,c,c,1);});});
  /* slope triangle (its rise / run labels sit right beside their legs) */
  [].concat(o.tri||[]).forEach(function(t){var c=col(t.k||'want'),dash=t.k==='ans'?null:'5 3',tc=t.k==='ans'?C.green:C.goldTx;
    var tl=[];function lab(x_,y_,str,an,alt,leg){tl.push([[x_,y_,an],alt,str,leg]);}
    /* more spots along the leg (both sides, then a step farther out) so a label never has to sit on a line or a tick number */
    function more(q){var g=q[3],out=[];if(!g) return out;var vert=Math.abs(g[0]-g[2])<0.5,sd=vert?(q[0][0]>g[0]?1:-1):(q[0][1]>g[1]?1:-1);
      [[sd,0],[-sd,0],[sd,14],[-sd,14]].forEach(function(o){[0.5,0.25,0.75,0.12,0.88].forEach(function(f){var px=g[0]+(g[2]-g[0])*f,py=g[1]+(g[3]-g[1])*f,k=o[0];
        out.push(vert?[px+k*(6+o[1]),py+4.5,k>0?'start':'end']:[px,py+(k>0?16+o[1]:-7-o[1]),'middle']);});});return out;}
    function flush(){tl.forEach(function(q){var far=q[0].slice(),d=q[1][1]-q[0][1],e=q[1][0]-q[0][0];if(Math.abs(d)>1)far[1]-=d>0?16:-16;else far[0]-=e>0?14:-14;var c0=place([q[0],q[1]].concat(more(q),[far]),q[2],MINF);s.text(c0[0],c0[1],q[2],{size:12,c:tc,weight:700,halo:true,anchor:c0[2]});});}
    if((t.y2-t.y1)*(t.x2-t.x1)<0&&t.vfirst!==false){var rt=t.x2>t.x1;
      s.line(X(t.x1),Y(t.y1),X(t.x1),Y(t.y2),c,2.2,dash); s.line(X(t.x1),Y(t.y2),X(t.x2),Y(t.y2),c,2.2,dash);
      seg(X(t.x1),Y(t.y1),X(t.x1),Y(t.y2)); seg(X(t.x1),Y(t.y2),X(t.x2),Y(t.y2));
      if(t.rise!=null) lab(X(t.x1)+(rt?6:-6),Y(t.y1)*0.7+Y(t.y2)*0.3+4,t.rise,rt?'start':'end',[X(t.x1)+(rt?-6:6),Y(t.y1)*0.7+Y(t.y2)*0.3+4,rt?'end':'start'],[X(t.x1),Y(t.y1),X(t.x1),Y(t.y2)]);
      if(t.run!=null) lab((X(t.x1)+X(t.x2))/2,Y(t.y2)+(t.y2<t.y1?16:-7),t.run,'middle',[(X(t.x1)+X(t.x2))/2,Y(t.y2)+(t.y2<t.y1?-7:16),'middle'],[X(t.x1),Y(t.y2),X(t.x2),Y(t.y2)]);
      laterTri.push(flush);return;}
    s.line(X(t.x1),Y(t.y1),X(t.x2),Y(t.y1),c,2.2,dash); s.line(X(t.x2),Y(t.y1),X(t.x2),Y(t.y2),c,2.2,dash);
    seg(X(t.x1),Y(t.y1),X(t.x2),Y(t.y1)); seg(X(t.x2),Y(t.y1),X(t.x2),Y(t.y2));
    var below=(t.y2>t.y1)===(t.x2>t.x1);
    if(t.run!=null) lab((X(t.x1)+X(t.x2))/2,Y(t.y1)+(below?16:-7),t.run,'middle',[(X(t.x1)+X(t.x2))/2,Y(t.y1)+(below?-7:16),'middle'],[X(t.x1),Y(t.y1),X(t.x2),Y(t.y1)]);
    if(t.rise!=null) lab(X(t.x2)+(t.x2>t.x1?6:-6),(Y(t.y1)+Y(t.y2))/2+4,t.rise,t.x2>t.x1?'start':'end',[X(t.x2)+(t.x2>t.x1?-6:6),(Y(t.y1)+Y(t.y2))/2+4,t.x2>t.x1?'end':'start'],[X(t.x2),Y(t.y1),X(t.x2),Y(t.y2)]);
    laterTri.push(flush);});
  /* dashed guides from a point to the axes */
  (o.guides||[]).forEach(function(g){var c=col(g.k||'ans');s.line(X(g.x),Y(ax),X(g.x),Y(g.y),c,1.8,'5 4');s.line(X(ay),Y(g.y),X(g.x),Y(g.y),c,1.8,'5 4');seg(X(g.x),Y(ax),X(g.x),Y(g.y));seg(X(ay),Y(g.y),X(g.x),Y(g.y));});
  (o.hlines||[]).forEach(function(h){var c=col(h.k||'want');s.line(L,Y(h.y),W-R,Y(h.y),c,2,'6 4');seg(L,Y(h.y),W-R,Y(h.y));
    if(h.lbl) later.push(function(){var a=h.right?[W-R-4,'end']:[L+4,'start'],b=h.right?[L+4,'start']:[W-R-4,'end'];
      var c0=place([[a[0],Y(h.y)-6,a[1]],[a[0],Y(h.y)+17,a[1]],[b[0],Y(h.y)-6,b[1]],[b[0],Y(h.y)+17,b[1]],[(L+W-R)/2,Y(h.y)-6,'middle'],[(L+W-R)/2,Y(h.y)+17,'middle']],h.lbl,MINF);
      s.text(c0[0],c0[1],h.lbl,{size:11.5,c:tcol(c),weight:700,anchor:c0[2],halo:true});});});
  (o.vlines||[]).forEach(function(v){var c=col(v.k||'want');s.line(X(v.x),T,X(v.x),H-B,c,v.sw||2.2,v.dash===false?null:'6 4');seg(X(v.x),T,X(v.x),H-B);
    if(v.lbl) later.push(function(){var ys=v.top?[T+26,H-B-10]:[H-B-10,T+26];
      var c0=place([[X(v.x)+5,ys[0],'start'],[X(v.x)-5,ys[0],'end'],[X(v.x)+5,ys[1],'start'],[X(v.x)-5,ys[1],'end'],[X(v.x)+5,(T+H-B)/2,'start'],[X(v.x)-5,(T+H-B)/2,'end']],v.lbl,MINF);
      s.text(c0[0],c0[1],v.lbl,{size:11.5,c:tcol(c),weight:700,anchor:c0[2],halo:true});});});
  /* points */
  (o.pts||[]).forEach(function(p){var c=col(p.k);s.circ(X(p.x),Y(p.y),p.rad||5,p.open?'#fff':c,p.k==='want'?C.goldTx:c,2);
    var rr=(p.rad||5)+1;occupy({x:X(p.x)-rr,y:Y(p.y)-rr,w:2*rr,h:2*rr});});
  /* notes: the author chose these spots, so they are fixed */
  (o.notes||[]).forEach(function(n){s.text(X(n.x),Y(n.y),n.t,{size:n.size||11.5,c:n.k?(n.k==='want'?C.goldTx:col(n.k)):C.navy,weight:700,halo:true,anchor:n.anchor||'middle',font:n.font});
    occupy(rectOf(X(n.x),Y(n.y),n.t,Math.max(MINF,n.size||0),n.anchor||'middle',n.font==='sans'));});
  laterTri.forEach(function(f){f();});
  /* point labels first (they matter most), then line labels */
  (o.pts||[]).forEach(function(p){if(!p.lbl) return;var c=col(p.k),fs=Math.max(MINF,p.size||12),rr=(p.rad||5);
    function at(pos,g){var dx=pos.indexOf('e')>=0?rr+3+g:pos.indexOf('w')>=0?-(rr+3+g):0,dy=pos.indexOf('n')>=0?-(rr+4+g):pos.indexOf('s')>=0?rr+fs*0.8+3+g:fs*0.35;
      return [X(p.x)+dx,Y(p.y)+dy,dx>0?'start':dx<0?'end':'middle'];}
    var order=[p.pos||'ne','ne','nw','se','sw','e','w','n','s'],cands=[];
    order.forEach(function(q){cands.push(at(q,0));});order.forEach(function(q){cands.push(at(q,8));});
    var c0=place(cands,p.lbl,fs);
    s.text(c0[0],c0[1],p.lbl,{size:p.size||12,c:tcol(c),weight:700,halo:true,anchor:c0[2]});});
  later.forEach(function(f){f();});
  /* tick numbers go on last, on top. A tick number under a label or a point is left out (the label says it). A tick number
     that a line crosses moves to the other side of its axis (x numbers above the x-axis, y numbers right of the y-axis);
     if a line crosses there too, it stays where it is, drawn UNDER the lines so it never cuts a line. A number that a
     straight level or upright line runs right through (like y = 3 through the 3) is left out: it could not be read. */
  function thru(q){var cx=q.x+q.w/2,cy=q.y+q.h/2;for(var k=2;k<segs.length;k++){var g=segs[k];
    if(Math.abs(g[1]-g[3])<0.5&&Math.abs(g[1]-cy)<4&&Math.min(g[0],g[2])<cx&&Math.max(g[0],g[2])>cx) return true;
    if(Math.abs(g[0]-g[2])<0.5&&Math.abs(g[0]-cx)<4&&Math.min(g[1],g[3])<cy&&Math.max(g[1],g[3])>cy) return true;}return false;}
  var low=[];
  function hitL(q,pd){pd=pd||-1;return occ.some(function(p){return !p.tick&&q.x<p.x+p.w+pd&&q.x+q.w+pd>p.x&&q.y<p.y+p.h+pd&&q.y+q.h+pd>p.y;});}
  function hitS(q){for(var k=2;k<segs.length;k++) if(segHit(segs[k],q)) return true;return false;}
  occ.forEach(function(t){if(!t.tick) return;var a=t.t,bl=hitL(t),bs=!bl&&hitS(t);
    if(bs){var q=rectOf(t.alt[0],t.alt[1],a[2],MINF,t.alt[2]);
      if(q.x>=2&&q.y>=2&&q.x+q.w<=W-2&&q.y+q.h<=H-2&&!hitL(q,5)&&!hitS(q)&&!occ.some(function(p){return p!==t&&p.tick&&q.x<p.x+p.w&&q.x+q.w>p.x&&q.y<p.y+p.h&&q.y+q.h>p.y;})){
        t.x=q.x;t.y=q.y;t.w=q.w;t.h=q.h;a=[t.alt[0],t.alt[1],a[2],t.alt[2]];bl=bs=false;}}
    if(bl||(bs&&thru(t))) return; var n0=s.p.length; s.text(a[0],a[1],a[2],{size:10.5,c:C.muted,anchor:a[3],halo:true});
    if(bs) low.push(s.p.splice(n0,1)[0]);});
  if(low.length) s.p.splice.apply(s.p,[under,0].concat(low));
  s.X=X;s.Y=Y;s.box2=[L,T,W-R,H-B];
  return s;
}

/* ---------- number line ---------- */
function numline(o){
  var askL=o.ask?(Array.from(o.ask).length*7.8>(o.w||330)-10?o.ask.replace(/\? /g,'?|').split('|'):[o.ask]):[];
  var W=o.w||330,top=o.title?24:0,H=(o.h||62)+top+askL.length*18,L=22,R=22,y=26+top,s=new Svg(W,H,o.label||'number line'),mn=o.min,mx=o.max,st=o.step||1,ls=o.lbl||st;
  var X=function(v){return L+(v-mn)/(mx-mn)*(W-L-R);};
  if(o.title) s.text(W/2,15,o.title,{size:12,font:'sans',weight:700,c:o.titleK==='ans'?C.green:C.navy});
  s.arrow(W/2,y,W-5,y,C.axis,1.8,8); s.arrow(W/2,y,5,y,C.axis,1.8,8);
  for(var v=mn;v<=mx+1e-9;v+=st){var lab=Math.abs((v-mn)/ls-Math.round((v-mn)/ls))<1e-6;s.line(X(v),y-(lab?6:4),X(v),y+(lab?6:4),C.axis,1.4);
    if(lab) s.text(X(v),y+20,fm(Math.round(v*100)/100),{size:11,c:C.muted});}
  if(o.sol){var c=o.sol.k==='want'?C.gold:o.sol.k==='navy'?C.navy:C.green,v0=o.sol.v,right=o.sol.op[0]==='>';
    s.add('<line x1="'+r(X(v0))+'" y1="'+y+'" x2="'+(right?W-14:14)+'" y2="'+y+'" stroke="'+c+'" stroke-width="6" stroke-linecap="round" opacity="0.85"/>');
    s.poly(right?[[W-3,y],[W-15,y-8],[W-15,y+8]]:[[3,y],[15,y-8],[15,y+8]],c);
    s.circ(X(v0),y,6.5,o.sol.op.length>1?c:'#fff',c,2.8);}
  if(o.seg){var c2=o.seg.k==='want'?C.gold:C.green;s.add('<line x1="'+r(X(o.seg.a))+'" y1="'+y+'" x2="'+r(X(o.seg.b))+'" y2="'+y+'" stroke="'+c2+'" stroke-width="6" opacity="0.85"/>');
    s.circ(X(o.seg.a),y,6.5,o.seg.ia?c2:'#fff',c2,2.8);s.circ(X(o.seg.b),y,6.5,o.seg.ib?c2:'#fff',c2,2.8);}
  (o.dots||[]).forEach(function(d){var c=d.k==='want'?C.gold:d.k==='navy'?C.navy:d.k==='neg'?C.neg:C.green;s.circ(X(d.v),y,d.open?6:5.5,d.open?'#fff':c,c,2.4);
    if(d.lbl) s.text(X(d.v),y-12,d.lbl,{size:11,c:c===C.gold?C.goldTx:c,weight:700,halo:true});});
  askL.forEach(function(t,i){s.text(W/2,H-6-(askL.length-1-i)*18,t,{size:11.5,font:'sans',c:C.goldTx,weight:700});});
  return s;
}

/* ---------- balance scale ---------- */
function balance(o){
  var W=330,H=o.note?194:184,cx=165,by=36,half=104,s=new Svg(W,H,o.label||'balance model'),t=(o.tilt||0)*Math.PI/180,base=160;
  var ends=[[cx-half*Math.cos(t),by+half*Math.sin(t)],[cx+half*Math.cos(t),by-half*Math.sin(t)]];
  s.poly([[cx,by+4],[cx-16,base],[cx+16,base]],C.navyBg,C.navy,1.5); s.rect(cx-46,base,92,8,C.navy,null,0,3);
  s.line(ends[0][0],ends[0][1],ends[1][0],ends[1][1],C.navy,5); s.circ(cx,by,5,C.gold,C.navy,1.5);
  [o.L,o.R].forEach(function(items,side){var ex=ends[side][0],ey=ends[side][1],py=ey+74;
    s.line(ex,ey,ex-52,py,C.muted,1.2);s.line(ex,ey,ex+52,py,C.muted,1.2);
    s.path('M'+r(ex-58)+','+r(py)+' Q'+r(ex)+','+r(py+14)+' '+r(ex+58)+','+r(py),C.navyBg,C.navy,2);
    var blocks=[];(items||[]).forEach(function(it){if(it.x){for(var j=0;j<it.x;j++) blocks.push({w:26,t:it.v!=null?String(it.v):'x',k:it.k||(it.v!=null?'ans':'want')});}
      else blocks.push({w:Math.max(28,14+9*String(it.n).length),t:String(it.n),k:it.k||'given'});});
    var rows=[[]],rw=0;blocks.forEach(function(b){if(rw+b.w>104&&rows[rows.length-1].length){rows.push([]);rw=0;}rows[rows.length-1].push(b);rw+=b.w+3;});
    rows.forEach(function(row,ri){var tw=row.reduce(function(a,b){return a+b.w+3;},-3),xx=ex-tw/2,yy=py-2-26*(ri+1);
      row.forEach(function(b){s.box(xx,yy,b.w,24,b.t,b.k,12.5,4);xx+=b.w+3;});});
    var lbl=side?o.lblR:o.lblL;if(lbl) s.text(ex,py+28,lbl,{size:13,weight:700,c:C.navy});});
  if(o.note) s.text(cx,H-5,o.note,{size:11.5,font:'sans',c:o.noteK==='ans'?C.green:C.muted,weight:600});
  return s;
}

/* ---------- algebra tiles mat ---------- */
function tiles(o){
  var W=330,sides=[o.L,o.R];
  function xT(neg){return neg?'−x':(o.xVal!=null?fm(o.xVal):'x');}
  function xW(neg){return Math.max(16,Math.round(Array.from(xT(neg)).length*MINF*0.62*1.05+6));}   /* a tall tile is wide enough for its label */
  function lay(sd){var parts=[],x=0,y=0,rowH=0,maxW=136;
    var xs=Math.abs(sd.x||0),xn=(sd.x||0)<0,xw=xW(xn);for(var j=0;j<xs;j++){if(x+xw>maxW){x=0;y+=50;}parts.push({t:'x',x:x,y:y,neg:xn,w:xw});x+=xw+5;}
    if(xs) {y+=52;x=0;}
    var us=Math.abs(sd.u||0),un=(sd.u||0)<0;for(j=0;j<us;j++){if(x+15>maxW){x=0;y+=19;}parts.push({t:'u',x:x,y:y,neg:un});x+=19;}
    if(us) y+=19; return {parts:parts,h:Math.max(y,20)};}
  var ls=sides.map(lay),hh=Math.max(ls[0].h,ls[1].h),H=hh+78,s=new Svg(W,H,o.label||'algebra tile model');
  s.rect(4,4,W-8,hh+30,'#FCFDFF','#C9D2E0',1.2,8); s.line(W/2,10,W/2,hh+28,'#C9D2E0',1.4);
  s.text(W/2,hh/2+20,'=',{size:20,weight:700,c:C.muted,halo:true});
  ls.forEach(function(l,si){var ox=si?W/2+12:16,oy=16;l.parts.forEach(function(p){
    if(p.t==='x'){var xv=o.xVal!=null; s.rect(ox+p.x,oy+p.y,p.w,44,p.neg?'#fff':(xv?C.greenBg:C.goldBg),p.neg?C.neg:(xv?C.green:C.gold),1.8,3);
      s.text(ox+p.x+p.w/2,oy+p.y+27,xT(p.neg),{size:12,weight:700,c:p.neg?C.neg:(xv?C.green:C.goldTx)});}
    else{s.rect(ox+p.x,oy+p.y,15,15,p.neg?'#fff':C.navy,p.neg?C.neg:C.navy,1.6,2);s.text(ox+p.x+7.5,oy+p.y+11.5,p.neg?'−':'+',{size:11,weight:700,c:p.neg?C.neg:'#fff'});}});
    var e=si?o.eR:o.eL;if(e) s.text(si?W*0.75:W*0.25,hh+50,e,{size:13,weight:700});});
  s.text(W/2,H-6,'tall tile = x  ·  ■ = +1  ·  □ = −1',{size:10.5,font:'sans',c:C.muted});
  return s;
}

/* ---------- tape (bar) model ---------- */
function tape(o){
  var W=o.w||330,L=o.L||8,R=8,rowH=30,gap=12,rows=o.rows,H=rows.length*(rowH+gap)+(o.foot?22:4)+(o.title?22:0),top=o.title?24:4,s=new Svg(W,H,o.label||'bar model');
  var tot=Math.max.apply(null,rows.map(function(rw){return rw.segs.reduce(function(a,b){return a+b.v;},0);})),sc=(W-L-R)/tot;
  if(o.title) s.text(W/2,15,o.title,{size:12,font:'sans',weight:700});
  rows.forEach(function(rw,i){var x=L,y=top+i*(rowH+gap);if(rw.lbl) s.text(4,y+rowH/2+4,rw.lbl,{size:11,anchor:'start',font:'sans',c:C.muted});
    rw.segs.forEach(function(g){var w=g.v*sc;s.box(x,y,w,rowH,g.t,g.k||'given',w<34?11:13,4);x+=w;});});
  if(o.foot) s.text(W/2,H-6,o.foot,{size:11.5,font:'sans',c:o.footK==='ans'?C.green:C.muted,weight:600});
  return s;
}

/* ---------- inverse-operation chain ---------- */
function chain(o){
  var n=o.ops.length+1,bw=o.bw||46,W=o.w||Math.max(300,n*bw+(n-1)*58+16),m=8,aw=(W-2*m-n*bw)/(n-1),fl=o.ops.some(function(q){return q.flip;}),H=fl?168:152,s=new Svg(W,H,o.label||'inverse operations');
  function bx(i){return m+i*(bw+aw);}
  s.text(4,13,o.top||'Build it:',{size:11,font:'sans',anchor:'start',c:C.muted,weight:600});
  s.text(4,78,o.bottom||'Undo it (work backward):',{size:11,font:'sans',anchor:'start',c:C.muted,weight:600});
  for(var i=0;i<n;i++){var y1=20,y2=95,first=i===0,last=i===n-1;
    s.box(bx(i),y1,bw,30,first?o.start:(last?o.end:''),first?'want':last?'given':'plain',13);
    var bv=o.back?o.back[i]:null; s.box(bx(i),y2,bw,30,last?o.end:(bv==null?'?':bv),last?'given':(bv==null?'want':'ans'),13);
    if(i<n-1){var op=o.ops[i];s.arrow(bx(i)+bw+3,y1+15,bx(i+1)-3,y1+15,C.navy,1.6,7);s.text((bx(i)+bw+bx(i+1))/2,y1+8,op.f,{size:12,weight:700});
      s.arrow(bx(i+1)-3,y2+15,bx(i)+bw+3,y2+15,op.flip?C.neg:C.navy,1.6,7);
      s.text((bx(i)+bw+bx(i+1))/2,y2+47,op.u,{size:12,weight:700,c:op.flip?C.neg:C.navy});
      if(op.flip) s.text((bx(i)+bw+bx(i+1))/2,y2+64,'FLIP the sign!',{size:10.5,weight:700,c:C.neg,font:'sans'});}}
  return s;
}

/* ---------- mapping diagram ---------- */
function mapping(o){
  var n=Math.max(o.ins.length,o.outs.length),H=58+n*32,W=o.w||300,s=new Svg(W,H,o.label||'mapping diagram'),lx=W*0.27,rx=W*0.73;
  s.text(lx,15,o.inT||'Input (x)',{size:11.5,font:'sans',weight:700,c:C.muted});s.text(rx,15,o.outT||'Output (y)',{size:11.5,font:'sans',weight:700,c:C.muted});
  s.add('<ellipse cx="'+lx+'" cy="'+(H/2+10)+'" rx="44" ry="'+(n*16+12)+'" fill="'+C.navyBg+'" stroke="'+C.navy+'" stroke-width="1.6"/>');
  s.add('<ellipse cx="'+rx+'" cy="'+(H/2+10)+'" rx="44" ry="'+(n*16+12)+'" fill="'+C.navyBg+'" stroke="'+C.navy+'" stroke-width="1.6"/>');
  function iy(k,len){return H/2+10-(len-1)*16+k*32;}
  o.pairs.forEach(function(p,j){var hl=o.hl&&o.hl.indexOf(j)>=0,c=hl?(o.hlK==='ans'?C.green:C.neg):C.navy;
    s.arrow(lx+20,iy(p[0],o.ins.length),rx-22,iy(p[1],o.outs.length),c,hl?2.4:1.5,8);});
  o.ins.forEach(function(v,k){s.text(lx,iy(k,o.ins.length)+4.5,fm(v),{size:13,weight:700,halo:true});});
  o.outs.forEach(function(v,k){s.text(rx,iy(k,o.outs.length)+4.5,fm(v),{size:13,weight:700,halo:true});});
  return s;
}

/* ---------- x / y table with change arrows ---------- */
function tbl(o){
  var n=o.xs.length,cw=o.cw||48,hw=Math.max(40,Math.max.apply(null,(o.names||['x','y']).map(function(t){return String(t).length;}))*8.5+12),W=Math.max(o.w||0,hw+n*cw+16),x0=(W-(hw+n*cw))/2,top=o.dx?34:8,H=top+64+(o.dy?34:6),s=new Svg(W,H,o.label||'table');
  var names=o.names||['x','y'];
  [0,1].forEach(function(rw){var y=top+rw*32;s.rect(x0,y,hw,32,C.navy,C.navy,1);s.text(x0+hw/2,y+21,names[rw],{size:12.5,weight:700,c:'#fff'});
    for(var i=0;i<n;i++){var v=rw?o.ys[i]:o.xs[i],k=(o.k&&rw&&o.k[i])||'plain';s.box(x0+hw+i*cw,y,cw,32,typeof v==='number'?fm(v):v,k,12.5,0);}});
  function arc(i,y,up,lbl,k){var xa=x0+hw+i*cw+cw/2,xb=xa+cw,c=k==='ans'?C.green:k==='want'?C.gold:C.navy,cy=up?y-18:y+18;
    s.path('M'+r(xa+4)+','+y+' Q'+r((xa+xb)/2)+','+cy+' '+r(xb-4)+','+y,null,c,1.6);
    s.poly([[xb-4,y],[xb-10,y+(up?-6:6)],[xb-2,y+(up?-7:7)]],c);
    s.text((xa+xb)/2,up?cy-3:cy+11,lbl,{size:11.5,weight:700,c:k==='want'?C.goldTx:c,halo:true});}
  if(o.dx) o.dx.forEach(function(l,i){if(l!=null) arc(i,top-2,true,l,(o.dxk||'given'));});
  if(o.dy) o.dy.forEach(function(l,i){if(l!=null) arc(i,top+66,false,l,(o.dyk&&o.dyk[i])||o.dyK||'want');});
  return s;
}

/* ---------- function machine ---------- */
function machine(o){
  var W=330,H=104,s=new Svg(W,H,o.label||'function machine');
  s.box(6,34,58,34,o.inp,o.inK||'given',14);s.text(35,86,'input',{size:11,font:'sans',c:C.muted});
  s.arrow(66,51,100,51,C.navy,1.8,8);
  s.rect(102,18,126,66,'#fff',C.navy,2.2,12);s.text(165,40,o.name||'rule',{size:11,font:'sans',c:C.muted,weight:600});s.text(165,64,o.rule,{size:13.5,weight:700});
  s.arrow(230,51,262,51,C.navy,1.8,8);
  s.box(264,34,60,34,o.out,o.outK||'want',14);s.text(294,86,'output',{size:11,font:'sans',c:C.muted});
  return s;
}

/* ---------- chips for exponents (x·x·x) ---------- */
function chips(o){
  var cw=24,gap=3,W=o.w||330,rows=[[]],rowW=[0],maxW=W-16;
  o.groups.forEach(function(g,gi){var gw=g.items.length*(cw+gap)+14+(gi?18:0);
    if(rowW[rowW.length-1]+gw>maxW&&rows[rows.length-1].length){rows.push([]);rowW.push(0);gw-=gi?18:0;}
    rows[rows.length-1].push({g:g,gi:gi,first:!rows[rows.length-1].length});rowW[rowW.length-1]+=gw;});
  var H=rows.length*58+(o.foot?26:6),s=new Svg(W,H,o.label||'expanded form');
  rows.forEach(function(row,ri){var tw=rowW[ri],xx=(W-tw)/2,y=8+ri*58;
    row.forEach(function(it){if(!it.first){s.text(xx+9,y+17,o.sep||'·',{size:16,weight:700,c:C.muted});xx+=18;}
      s.text(xx+3,y+18,'(',{size:20,c:C.muted});xx+=7;var gx=xx;
      it.g.items.forEach(function(t,ti){var st=it.g.strike&&it.g.strike.indexOf(ti)>=0;s.box(xx,y+2,cw,24,t,it.g.k||(st?'plain':'given'),12.5,5);
        if(st) s.line(xx+3,y+24,xx+cw-3,y+4,C.neg,2.2);xx+=cw+gap;});
      s.text(xx+1,y+18,')',{size:20,c:C.muted});xx+=7;
      if(it.g.lbl) s.text((gx+xx-7)/2,y+44,it.g.lbl,{size:11.5,c:C.muted,weight:600,font:it.g.sans?'sans':null});});});
  if(o.foot) s.text(W/2,H-8,o.foot,{size:12.5,weight:700,c:o.footK==='ans'?C.green:o.footK==='want'?C.goldTx:C.navy});
  return s;
}
/* fraction of chips for the quotient rule */
function fracChips(o){
  var cw=24,gap=3,W=330,n=o.num,d=o.den,H=o.foot?118:96,s=new Svg(W,H,o.label||'quotient as a fraction');
  function row(cnt,y,cancel){var tw=cnt*(cw+gap)-gap,xx=(W-tw)/2;for(var i=0;i<cnt;i++){var st=cancel&&i<cancel;s.box(xx,y,cw,24,o.letter||'x',st?'plain':'given',12.5,5);if(st)s.line(xx+3,y+22,xx+cw-3,y+2,C.neg,2.2);xx+=cw+gap;}}
  row(n,8,o.cancel?d:0);s.line(W/2-n*14,42,W/2+n*14,42,C.navy,2);row(d,50,o.cancel?d:0);
  if(o.foot) s.text(W/2,H-10,o.foot,{size:12.5,weight:700,c:o.footK==='ans'?C.green:o.footK==='want'?C.goldTx:C.navy});
  return s;
}
/* powers ladder: 2³, 2², ... each step ÷ base */
function ladder(o){
  var b=o.base,ps=o.pows,n=ps.length,W=330,cw=(W-16)/n,H=104,s=new Svg(W,H,o.label||'pattern of powers');
  ps.forEach(function(p,i){var x=8+i*cw,k=(o.k&&o.k[i])||'given',val=o.vals[i];
    s.text(x+cw/2,22,b+sup(p),{size:14,weight:700,c:k==='want'?C.goldTx:C.navy});
    s.box(x+4,34,cw-8,32,val,k,val.length>4?11:12.5,6);
    if(i<n-1){s.arrow(x+cw-6,82,x+cw+6,82,C.muted,1.3,6);s.text(x+cw,99,'÷'+b,{size:11,c:C.muted});}});
  return s;
}
function sup(p){var m={'0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹','-':'⁻'};return String(p).split('').map(function(c){return m[c]||c;}).join('');}
/* square made of unit squares (for square roots) */
function square(o){
  var n=o.n,cell=Math.min(26,130/n),sz=n*cell,W=330,H=sz+50,s=new Svg(W,H,o.label||'square area model'),x0=60,y0=12;
  for(var i=0;i<n;i++)for(var j=0;j<n;j++) s.rect(x0+i*cell,y0+j*cell,cell,cell,C.navyBg,C.navy,0.8);
  s.text(x0+sz/2,y0+sz+18,'side = '+o.side,{size:12.5,weight:700,c:o.sideK==='ans'?C.green:C.goldTx});
  s.text(x0-6,y0+sz/2+4,o.side,{size:12.5,weight:700,anchor:'end',c:o.sideK==='ans'?C.green:C.goldTx});
  s.text(x0+sz+18,y0+sz/2-6,'area = '+(n*n),{size:12.5,weight:700,anchor:'start'});
  s.text(x0+sz+18,y0+sz/2+12,(n*n)+' unit squares',{size:11,font:'sans',anchor:'start',c:C.muted});
  return s;
}
/* cube (for cube roots) */
function cube(o){
  var n=o.n,u=Math.min(24,72/n),W=330,H=Math.round(28+n*u*1.45+30),s=new Svg(W,H,o.label||'cube model'),ox=70,oy=24,dx=u*0.55,dy=-u*0.45;
  function pt(i,j,k){return [ox+i*u+k*dx,oy+(n-j)*u+k*dy+n*(-dy)];}
  for(var k=n-1;k>=0;k--)for(var j=0;j<n;j++)for(var i=0;i<n;i++){ if(k!==0&&i!==n-1&&j!==n-1) continue;
    var a=pt(i,j,k),b=pt(i+1,j,k),c=pt(i+1,j+1,k),d=pt(i,j+1,k);
    if(k===0) s.poly([a,b,c,d],C.navyBg,C.navy,0.9);
    if(j===n-1){var e=pt(i,j+1,k+1),f=pt(i+1,j+1,k+1);s.poly([d,c,f,e],'#D3DAE8',C.navy,0.9);}
    if(i===n-1){var g=pt(i+1,j,k+1),h=pt(i+1,j+1,k+1);s.poly([b,g,h,c],'#BCC6DA',C.navy,0.9);}}
  var bl=pt(0,0,0),br=pt(n,0,0);s.text((bl[0]+br[0])/2,bl[1]+18,'edge = '+o.side,{size:12.5,weight:700,c:o.sideK==='ans'?C.green:C.goldTx});
  s.text(220,H/2-4,'volume = '+(n*n*n),{size:12.5,weight:700,anchor:'start'});s.text(220,H/2+14,(n*n*n)+' unit cubes',{size:11,font:'sans',c:C.muted,anchor:'start'});
  return s;
}
/* area model for the distributive property */
function areaModel(o){
  var W=330,H=130,s=new Svg(W,H,o.label||'area model'),x0=60,y0=30,h=60,sc=o.scale||40,x=x0;
  s.text(x0-10,y0+h/2+5,o.outer,{size:14,weight:700,anchor:'end'});
  o.parts.forEach(function(p,i){var w=p.w*sc;s.text(x+w/2,y0-8,p.lbl,{size:13,weight:700});s.box(x,y0,w,h,o.prods?o.prods[i]:'?',o.prods?(o.prodK||'ans'):'want',13,0);x+=w;});
  if(o.foot) s.text(W/2,H-8,o.foot,{size:12.5,weight:700,c:o.footK==='ans'?C.green:C.navy});
  return s;
}
/* expression split into terms */
function terms(o){
  var W=330,H=o.roles?96:64,s=new Svg(W,H,o.label||'parts of an expression'),bw=o.parts.map(function(p,i){return Math.max(52,p.t.length*12+18,o.roles&&o.roles[i]?o.roles[i].length*7+8:0);}),gap=12,tw=bw.reduce(function(a,b){return a+b;},0)+gap*(bw.length-1),x=(W-tw)/2;
  o.parts.forEach(function(p,i){s.box(x,10,bw[i],34,p.t,p.k||'given',15,6);s.text(x+bw[i]/2,60,'term '+(i+1),{size:11,font:'sans',c:C.muted});
    if(o.roles&&o.roles[i]) s.text(x+bw[i]/2,80,o.roles[i],{size:11,font:'sans',weight:700,c:o.roleK==='ans'?C.green:o.roleK==='want'?C.goldTx:C.navy});x+=bw[i]+gap;});
  return s;
}
/* rectangle with side labels (perimeter) */
function rectP(o){
  var W=330,H=150,s=new Svg(W,H,o.label||'rectangle'),x0=90,y0=26,w=150,h=80;
  s.rect(x0,y0,w,h,C.navyBg,C.navy,2,2);
  s.text(x0+w/2,y0-8,o.l,{size:13,weight:700,c:o.lK==='want'?C.goldTx:C.navy});s.text(x0+w/2,y0+h+18,o.l,{size:13,weight:700,c:o.lK==='want'?C.goldTx:C.navy});
  s.text(x0-8,y0+h/2+5,o.w,{size:13,weight:700,anchor:'end',c:o.wK==='want'?C.goldTx:C.navy});s.text(x0+w+8,y0+h/2+5,o.w,{size:13,weight:700,anchor:'start',c:o.wK==='want'?C.goldTx:C.navy});
  if(o.mid) s.text(x0+w/2,y0+h/2+5,o.mid,{size:12,weight:700});
  if(o.foot) s.text(W/2,H-6,o.foot,{size:12,weight:700,c:o.footK==='ans'?C.green:C.navy});
  return s;
}
/* simple bar chart */
function bars(o){
  var W=330,H=o.h||190,L=46,R=10,T=o.title?28:12,B=34,s=new Svg(W,H,o.label||'bar chart'),n=o.vals.length,mx=o.max||Math.max.apply(null,o.vals)*1.15,bw=(W-L-R)/n;
  if(o.title) s.text(W/2,17,o.title,{size:12.5,font:'sans',weight:700});
  s.line(L,H-B,W-R,H-B,C.axis,1.6);s.line(L,T,L,H-B,C.axis,1.6);
  for(var g=0;g<=4;g++){var v=mx*g/4,y=H-B-(H-B-T)*g/4;s.line(L,y,W-R,y,C.grid,1);s.text(L-5,y+4,o.fmt?o.fmt(v):fm(Math.round(v)),{size:10,anchor:'end',c:C.muted});}
  o.vals.forEach(function(v,i){var h=(H-B-T)*v/mx,x=L+i*bw+bw*0.18,k=(o.k&&o.k[i])||'given',c=K(k);s.rect(x,H-B-h,bw*0.64,h,c.f,c.s,1.6,3);
    s.text(x+bw*0.32,H-B-h-5,o.lbls?o.lbls[i]:fm(v),{size:10.5,weight:700,c:c.t,halo:true});s.text(x+bw*0.32,H-B+14,o.xs[i],{size:10.5,c:C.muted});});
  if(o.xTitle) s.text((L+W-R)/2,H-4,o.xTitle,{size:11,font:'sans',c:C.muted});
  return s;
}
/* statement / reason ladder */
function proof(o){
  var W=330,n=o.steps.length,H=n*56,s=new Svg(W,H,o.label||'steps with reasons');
  o.steps.forEach(function(st,i){var y=4+i*56;s.box(6,y,140,30,st.s,i===n-1&&o.lastK?o.lastK:'given',12.5,6);
    if(i<n-1){s.arrow(76,y+31,76,y+55,C.muted,1.5,6);var rk=o.steps[i+1].k||'want',rt=o.steps[i+1].r;
      var kc=K(rk),lines=[rt],fit=function(t){return Array.from(t).length*MINF*0.55<=164;};
      if(!fit(rt)){var cut=rt.indexOf(' (');if(cut<0) cut=rt.lastIndexOf(' ',Math.floor(rt.length/2)+4);if(cut>0) lines=[rt.slice(0,cut),rt.slice(cut+1)];}   /* long reasons wrap onto two lines */
      var ph=lines.length>1?40:24,py=y+42-ph/2;s.rect(156,py,168,ph,kc.f,kc.s,rk==='want'?2:1.6,12,rk==='want'?'5 3':null);
      lines.forEach(function(t,j){s.text(240,py+16+j*17,t,{size:11.5,font:'sans',weight:700,c:kc.t});});}});
  return s;
}

/* ---------- interactive pieces ---------- */
function slider(lbl,min,max,step,val,id){return '<label class="sl"><span>'+lbl+'</span><input type="range" min="'+min+'" max="'+max+'" step="'+step+'" value="'+val+'"'+(id?' id="'+id+'"':'')+'><b></b></label>';}
function lab(el,html){el.innerHTML=html;return el;}
function slopeLab(id,cfg){var el=document.getElementById(id);if(!el) return;
  lab(el,'<div class="lab-svg"></div><div class="lab-ctl">'+slider('slope m',-4,4,0.5,cfg.m||1)+slider('y-intercept b',-5,5,1,cfg.b||0)+'</div><div class="lab-out"></div>');
  var ins=el.querySelectorAll('input'),out=el.querySelector('.lab-out'),pic=el.querySelector('.lab-svg');
  function draw(){var m=+ins[0].value,b=+ins[1].value;ins[0].nextElementSibling.textContent=fm(m);ins[1].nextElementSibling.textContent=fm(b);
    var eq='y = '+(m===0?'':(m===1?'':m===-1?'−':fm(m))+'x')+(b===0?(m===0?'0':''):(m===0?fm(b):(b>0?' + ':' − ')+Math.abs(b)));
    var tri=m!==0?[{x1:0,y1:b,x2:1,y2:b+m,run:'run 1',rise:'rise '+fm(m),k:'want'}]:[];
    pic.innerHTML=grid({w:300,xmin:-6,xmax:6,ymin:-6,ymax:6,xl:2,yl:2,lines:[{m:m,b:b,lbl:eq,k:'given'}],tri:tri,pts:[{x:0,y:b,k:'ans',lbl:'(0, '+fm(b)+')',pos:m>0?'nw':'ne'}],label:'graph of '+eq})+'';
    out.innerHTML='<b>'+eq+'</b> — '+(m>0?'increasing (goes up to the right)':m<0?'decreasing (goes down to the right)':'constant (flat)')+'. It crosses the y-axis at (0, '+fm(b)+').';}
  ins.forEach(function(i){i.addEventListener('input',draw);});draw();}
function balanceLab(id,cfg){var el=document.getElementById(id);if(!el) return; // a x + b = c
  lab(el,'<div class="lab-svg"></div><div class="lab-ctl">'+slider('try x =',cfg.min,cfg.max,1,cfg.start)+'</div><div class="lab-out"></div>');
  var inp=el.querySelector('input'),pic=el.querySelector('.lab-svg'),out=el.querySelector('.lab-out');
  function draw(){var x=+inp.value,lv=cfg.a*x+cfg.b,rv=cfg.c,d=lv-rv,t=Math.max(-12,Math.min(12,d*2));inp.nextElementSibling.textContent=x;
    pic.innerHTML=balance({L:[{x:cfg.a,v:x,k:d===0?'ans':'want'},{n:cfg.b}],R:[{n:cfg.c}],tilt:t,lblL:cfg.a+'('+x+') + '+cfg.b+' = '+lv,lblR:String(rv),label:'balance test'})+'';
    out.innerHTML=d===0?'<b class="ok">Balanced! x = '+x+' makes both sides '+rv+'. That is the solution.</b>':(d>0?'Left side is too heavy ('+lv+' &gt; '+rv+'). Try a smaller x.':'Left side is too light ('+lv+' &lt; '+rv+'). Try a bigger x.');}
  inp.addEventListener('input',draw);draw();}
function ineqLab(id,cfg){var el=document.getElementById(id);if(!el) return;
  lab(el,'<div class="lab-svg"></div><div class="lab-ctl">'+slider('test x =',cfg.min,cfg.max,1,cfg.start)+'</div><div class="lab-out"></div>');
  var inp=el.querySelector('input'),pic=el.querySelector('.lab-svg'),out=el.querySelector('.lab-out');
  function draw(){var x=+inp.value,ok=cfg.test(x);inp.nextElementSibling.textContent=fm(x);
    pic.innerHTML=numline({min:cfg.min,max:cfg.max,sol:cfg.show?cfg.sol:null,dots:[{v:x,k:ok?'ans':'neg',lbl:ok?'true':'false'}],label:'test a value'})+'';
    out.innerHTML=cfg.text(x)+(ok?' <b class="ok">True — x = '+fm(x)+' is a solution.</b>':' <b class="bad">False — not a solution.</b>');}
  inp.addEventListener('input',draw);draw();}
function dragFn(id,cfg){var el=document.getElementById(id);if(!el) return;
  lab(el,'<div class="lab-svg drag"></div><div class="lab-ctl">'+slider('x =',cfg.xmin,cfg.xmax,1,cfg.start)+'</div><div class="lab-out"></div>');
  var inp=el.querySelector('input'),pic=el.querySelector('.lab-svg'),out=el.querySelector('.lab-out');
  function draw(){var x=+inp.value,y=cfg.f(x);inp.nextElementSibling.textContent=fm(x);
    var g=grid({w:300,xmin:cfg.xmin,xmax:cfg.xmax,ymin:cfg.ymin,ymax:cfg.ymax,xl:cfg.xl||2,yl:cfg.yl||2,lines:[{m:cfg.m,b:cfg.b,lbl:cfg.name,k:'given',lx:cfg.lx}],guides:[{x:x,y:y}],pts:[{x:x,y:y,k:'ans',rad:7,lbl:'('+fm(x)+', '+fm(y)+')',pos:x>0?'nw':'ne'}],label:'drag the point'});
    pic.innerHTML=g+'';pic._g=g;out.innerHTML=cfg.fname+'('+fm(x)+') = '+cfg.rule.replace(/x/g,'('+fm(x)+')')+' = <b class="ok">'+fm(y)+'</b>. The point is ('+fm(x)+', '+fm(y)+').';}
  function fromEvt(e){var svg=pic.querySelector('svg');if(!svg) return;var pt=svg.createSVGPoint();pt.x=e.clientX;pt.y=e.clientY;var p=pt.matrixTransform(svg.getScreenCTM().inverse()),g=pic._g;
    var L=g.box2[0],R=g.box2[2],xv=cfg.xmin+(p.x-L)/(R-L)*(cfg.xmax-cfg.xmin);xv=Math.max(cfg.xmin,Math.min(cfg.xmax,Math.round(xv)));
    if(+inp.value!==xv){inp.value=xv;draw();}}
  var dragging=false;pic.addEventListener('pointerdown',function(e){dragging=true;try{pic.setPointerCapture(e.pointerId);}catch(_){}fromEvt(e);e.preventDefault();});
  pic.addEventListener('pointermove',function(e){if(dragging) fromEvt(e);});
  ['pointerup','pointercancel','pointerleave'].forEach(function(t){pic.addEventListener(t,function(){dragging=false;});});
  inp.addEventListener('input',draw);draw();}
function vltLab(id,cfg){var el=document.getElementById(id);if(!el) return;
  lab(el,'<div class="viz-row"><div class="lab-svg a"></div><div class="lab-svg b"></div></div><div class="lab-ctl">'+slider('line at x =',-4,4,0.5,cfg.start||1)+'</div><div class="lab-out"></div>');
  var inp=el.querySelector('input'),A=el.querySelector('.a'),B=el.querySelector('.b'),out=el.querySelector('.lab-out');
  function draw(){var x=+inp.value;inp.nextElementSibling.textContent=fm(x);
    var ya=0.5*x+1,hitsB=x>=-2?(x===-2?1:2):0,yb=Math.sqrt(Math.max(0,x+2));
    A.innerHTML=grid({w:220,xmin:-5,xmax:5,ymin:-5,ymax:5,xl:5,yl:5,title:'Graph A',lines:[{m:0.5,b:1,k:'given'}],vlines:[{x:x,k:'want',dash:false}],pts:[{x:x,y:ya,k:'ans'}],label:'graph A with vertical line'})+'';
    var pB=[];for(var t=-2.4;t<=2.4001;t+=0.05) pB.push([t*t-2,t]);
    var ptsB=hitsB===2?[{x:x,y:yb,k:'neg'},{x:x,y:-yb,k:'neg'}]:hitsB===1?[{x:x,y:0,k:'neg'}]:[];
    B.innerHTML=grid({w:220,xmin:-5,xmax:5,ymin:-5,ymax:5,xl:5,yl:5,title:'Graph B',curves:[{pts:pB,k:'given'}],vlines:[{x:x,k:'want',dash:false}],pts:ptsB,label:'graph B with vertical line'})+'';
    out.innerHTML='Graph A: the line crosses <b>1 time</b>. Graph B: crosses <b>'+hitsB+(hitsB===1?' time':' times')+'</b>. '+(hitsB===2?'<b class="bad">Two crossings → Graph B is NOT a function.</b>':'Keep sliding — find a spot where Graph B is crossed twice.');}
  inp.addEventListener('input',draw);draw();}
function matchLine(id,cfg){var el=document.getElementById(id);if(!el) return; // practice: match target line
  lab(el,'<div class="lab-svg"></div><div class="lab-ctl">'+slider('slope m',-3,3,0.5,0)+slider('y-intercept b',-5,5,1,0)+'</div><div class="val-chk"><button type="button">Check my line</button></div>');
  var ins=el.querySelectorAll('input'),pic=el.querySelector('.lab-svg');
  function draw(){var m=+ins[0].value,b=+ins[1].value;ins[0].nextElementSibling.textContent=fm(m);ins[1].nextElementSibling.textContent=fm(b);
    pic.innerHTML=grid({w:300,xmin:-6,xmax:6,ymin:-6,ymax:6,xl:2,yl:2,pts:cfg.pts.map(function(p){return {x:p[0],y:p[1],k:'want',rad:6};}),lines:[{m:m,b:b,k:'given',lbl:'your line',lx:2.5}],label:'match the line'})+'';}
  ins.forEach(function(i){i.addEventListener('input',draw);});draw();
  el.querySelector('button').addEventListener('click',function(){var m=+ins[0].value,b=+ins[1].value,ok=Math.abs(m-cfg.m)<1e-9&&b===cfg.b,msg;
    if(ok) msg='✓ Your line goes through both gold points. y = '+fm(cfg.m)+'x '+(cfg.b<0?'− '+(-cfg.b):'+ '+cfg.b)+'.';
    else if(b===cfg.b) msg='Your y-intercept is right. Now fix the slope: count rise ÷ run between the two gold points.';
    else if(Math.abs(m-cfg.m)<1e-9) msg='Your slope is right. Now move b until the line crosses the y-axis where the gold line would.';
    else if(Math.abs(m+cfg.m)<1e-9) msg='The steepness is right but the direction is flipped. Does the line go up or down from left to right?';
    else msg='Not yet. Start with b: where would the line cross the y-axis? Then count rise over run.';
    var qid=cfg.qid||id;tally(qid,ok,true);fb(qid,msg,ok);if(ok) sol(qid);});}

/* ---------- answer reading ---------- */
var SUP={'⁰':'0','¹':'1','²':'2','³':'3','⁴':'4','⁵':'5','⁶':'6','⁷':'7','⁸':'8','⁹':'9','⁻':'-'};
function clean(s){s=String(s==null?'':s).trim();
  s=s.replace(/[−–—‒]/g,'-').replace(/≤/g,'<=').replace(/≥/g,'>=').replace(/=</g,'<=').replace(/=>/g,'>=').replace(/≠/g,'!=');
  s=s.replace(/[×·∙⋅]/g,'*').replace(/÷/g,'/').replace(/√/g,'sqrt').replace(/∞/g,'inf').replace(/infinity/gi,'inf').replace(/[  ]/g,' ');
  s=s.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁻]+/g,function(m){return '^('+m.split('').map(function(c){return SUP[c];}).join('')+')';});
  s=s.replace(/½/g,'(1/2)').replace(/⅓/g,'(1/3)').replace(/¼/g,'(1/4)').replace(/¾/g,'(3/4)').replace(/⅔/g,'(2/3)').replace(/⁄/g,'/');
  s=s.toLowerCase().replace(/\s+/g,'').replace(/\$/g,'');
  return s;}
/* recursive-descent evaluator: numbers, letters, + - * / ^ ( ), sqrt, implicit multiply */
function tok(s){var t=[],i=0,m;while(i<s.length){var c=s[i];
  if((m=/^(\d+\.?\d*|\.\d+)/.exec(s.slice(i)))){t.push({n:+m[1]});i+=m[1].length;continue;}
  if(s.slice(i,i+4)==='sqrt'){t.push({f:'sqrt'});i+=4;continue;}
  if(s.slice(i,i+4)==='cbrt'){t.push({f:'cbrt'});i+=4;continue;}
  if(s.slice(i,i+2)==='pi'){t.push({n:Math.PI});i+=2;continue;}
  if(/[a-z]/.test(c)){t.push({v:c});i++;continue;}
  if('+-*/^()'.indexOf(c)>=0){t.push({o:c});i++;continue;}
  throw new Error('bad');}
  var out=[];t.forEach(function(k,j){var p=out[out.length-1];
    if(p&&(p.n!=null||p.v||p.o===')')&&(k.n!=null||k.v||k.f||k.o==='(')) out.push({o:'*'});out.push(k);});return out;}
function evalStr(s,env){var t=tok(s),i=0;env=env||{};
  function peek(){return t[i];}function eat(o){if(t[i]&&t[i].o===o){i++;return true;}return false;}
  function expr(){var v=term();while(t[i]&&(t[i].o==='+'||t[i].o==='-')){var o=t[i++].o,w=term();v=o==='+'?v+w:v-w;}return v;}
  function term(){var v=fac();while(t[i]&&(t[i].o==='*'||t[i].o==='/')){var o=t[i++].o,w=fac();v=o==='*'?v*w:v/w;}return v;}
  function fac(){if(eat('-')) return -fac();if(eat('+')) return fac();return pow();}
  function pow(){var b=atom();if(eat('^')) return Math.pow(b,fac());return b;}
  function atom(){var k=t[i++];if(!k) throw new Error('end');
    if(k.n!=null) return k.n; if(k.v){if(!(k.v in env)) throw new Error('var:'+k.v);return env[k.v];}
    if(k.f){var a=atom();return k.f==='sqrt'?Math.sqrt(a):Math.cbrt(a);}
    if(k.o==='('){var v=expr();if(!eat(')')) throw new Error(')');return v;}throw new Error('tok');}
  var v=expr();if(i<t.length) throw new Error('extra');return v;}
function num(s){try{var v=evalStr(s,{});return isFinite(v)?v:null;}catch(e){return null;}}
function close(a,b){return a!=null&&b!=null&&Math.abs(a-b)<=1e-6*Math.max(1,Math.abs(b));}
function stripLHS(s){var m=/^[a-z]+(\([^)]*\))?=(.+)$/.exec(s);if(m) return m[2];m=/^(.+)=[a-z]$/.exec(s);if(m) return m[1];return s;}
var UNIT_RE=/(mph|miles?|mi|dollars?|months?|weeks?|days?|years?|yrs?|hours?|hrs?|h|minutes?|mins?|seconds?|secs?|s|tickets?|cars?|games?|people|squareunits|sq\.?units|units?\^\(?2\)?|units?|squarefeet|sq\.?ft|ft\^\(?2\)?|feet|foot|ft|meters?|m|cm|inches|inch|in|perunit|permonth|permile|perhour|pergame|perweek|perday)$/;
function parseNum(raw){var s=clean(raw);s=stripLHS(s);s=s.replace(UNIT_RE,'').replace(UNIT_RE,'');return num(s);}
function exprEq(a,b,vars){for(var k=0;k<5;k++){var env={};vars.forEach(function(v,j){env[v]=1.37+0.71*j+0.53*k+0.13*j*k;});
  var va,vb;try{va=evalStr(a,env);vb=evalStr(b,env);}catch(e){return false;}if(!isFinite(va)||!close(va,vb)) return false;}return true;}
var OPS={'<':1,'<=':1,'>':1,'>=':1};var REV={'<':'>','<=':'>=','>':'<','>=':'<='};
function parseIneq(raw){var s=clean(raw).replace(/(and|or)/g,'&'),m;
  m=/^([\[(])(.+),(.+)([\])])$/.exec(s);
  if(m){var lo=m[2],hi=m[3];if(/^-inf$/.test(lo)) return {op:m[4]===']'?'<=':'<',v:num(hi)};if(/^\+?inf$/.test(hi)) return {op:m[1]==='['?'>=':'>',v:num(lo)};
    return {lo:num(lo),hi:num(hi),il:m[1]==='[',ih:m[4]===']'};}
  m=/^(.+?)(<=|<)([a-z])(<=|<)(.+)$/.exec(s);if(m) return {lo:num(m[1]),il:m[2]==='<=',hi:num(m[5]),ih:m[4]==='<=',vr:m[3]};
  m=/^(.+?)(>=|>)([a-z])(>=|>)(.+)$/.exec(s);if(m) return {lo:num(m[5]),il:m[4]==='>=',hi:num(m[1]),ih:m[2]==='>=',vr:m[3]};
  m=/^([a-z])(<=|>=|<|>)(.+)$/.exec(s);if(m) return {op:m[2],v:num(m[3]),vr:m[1]};
  m=/^(.+?)(<=|>=|<|>)([a-z])$/.exec(s);if(m) return {op:REV[m[2]],v:num(m[1]),vr:m[3]};
  return null;}
function parsePt(raw){var s=clean(raw).replace(/^[a-z]=/,'').replace(/,[a-z]=/,',').replace(/^\(|\)$/g,'');var p=s.split(/[,;]/);if(p.length!==2) return null;var a=num(p[0]),b=num(p[1]);return a==null||b==null?null:[a,b];}
var SYM={'<':'<','<=':'≤','>':'>','>=':'≥'};

/* ---------- checking + scoring ---------- */
var Q={},started={},solved={};
function q(id,c){Q[id]=c;}
function fb(id,html,ok){var f=document.getElementById('fb-'+id);if(!f) return;f.innerHTML=html;f.className='chk-fb show '+(ok?'c':'x');}
function tally(id,ok,mc){if(!started[id]){started[id]=1;window._answered=(window._answered||0)+1;if(ok){window._correct=(window._correct||0)+1;solved[id]=1;}}
  else if(ok&&!solved[id]&&!mc){window._correct=(window._correct||0)+1;solved[id]=1;}
  if(ok) solved[id]=1; if(typeof window._updateScore==='function') window._updateScore();}
function sol(id){var s=document.getElementById(id+'-s');if(s) s.classList.add('show');var w=document.getElementById(id+'-w');if(w) w.hidden=false;}
function grade(c,raw){var s=clean(raw),w=c.wrong||[],i,T=c.type||c.kind;
  if(T==='num'){var v=parseNum(raw);if(v==null) return {ok:false,msg:'I could not read that. Type just the number, like 6, −3, or 1/2.'};
    if(close(v,c.ans)) return {ok:true};
    for(i=0;i<w.length;i++) if(close(v,w[i][0])) return {ok:false,msg:w[i][1]};
    if(close(v,-c.ans)) return {ok:false,msg:'So close — the size is right but the sign is wrong. Check each step where a negative appears.'};
    return {ok:false,msg:c.hint||'Not yet. Check each step and try again.'};}
  if(T==='expr'){var e=s;if(c.strip!==false){var m=/^([a-z])(\([a-z]\))?=(.+)$/.exec(e);if(m&&(c.vars.indexOf(m[1])<0||m[2])) e=m[3];}
    var bad=(e.replace(/sqrt|cbrt|pi/g,'').match(/[a-z]/g)||[]).filter(function(ch){return c.vars.indexOf(ch)<0;});
    if(bad.length) return {ok:false,msg:'Your answer uses “'+bad[0]+'”. Use only '+c.vars.join(', ')+'.'};
    try{evalStr(e,{x:1,y:1,z:1,a:1,b:1,c:1,m:1,l:1,w:1,p:1,t:1,r:1,d:1,h:1,n:1});}catch(err){return {ok:false,msg:'I could not read that. Check your parentheses and use ^ for exponents, like x^7.'};}
    if(exprEq(e,c.ans,c.vars)){if(c.must&&!c.must.test(e)) return {ok:false,msg:c.mustMsg};return {ok:true};}
    for(i=0;i<w.length;i++) if(exprEq(e,w[i][0],c.vars)) return {ok:false,msg:w[i][1]};
    return {ok:false,msg:c.hint||'Not yet. Check each step and try again.'};}
  if(T==='ineq'){var p=parseIneq(raw);if(!p||p.op==null||p.v==null) return {ok:false,msg:'Type an inequality, like x > 4, x <= -3, or 4 < x.'};
    if(close(p.v,c.v)&&p.op===c.op) return {ok:true};
    for(i=0;i<w.length;i++) if(close(p.v,w[i][0])&&p.op===w[i][1]) return {ok:false,msg:w[i][2]};
    if(close(p.v,c.v)&&p.op===REV[c.op]) return {ok:false,msg:c.flip?'Your number is right, but the sign points the wrong way. You divided by a negative, so FLIP the sign.':'Your number is right, but the sign points the wrong way. You did not divide by a negative, so the sign should NOT flip.'};
    if(close(p.v,c.v)&&p.op[0]===c.op[0]) return {ok:false,msg:'Very close! Check the endpoint. “Or equal to” (≤, ≥) stays the same through every step.'};
    if(close(p.v,c.v)) return {ok:false,msg:'Your number is right. Check the sign. Use the same kind of sign as the problem, and flip only if you divide by a negative.'};
    if(close(p.v,-c.v)) return {ok:false,msg:'The size of your number is right, but its sign is wrong. Check the step with the negative.'};
    return {ok:false,msg:c.hint||'Not yet. Undo the steps in reverse order, just like an equation.'};}
  if(T==='range'){var p2=parseIneq(raw);if(!p2||p2.lo==null||p2.hi==null) return {ok:false,msg:'Type it like −4 <= x <= 6 (smallest first), or [−4, 6].'};
    if(p2.vr&&c.vr&&p2.vr!==c.vr) return {ok:false,msg:c.vr==='x'?'Domain is about x-values. Write it with x, like a <= x <= b.':c.vr==='y'?'Range is about y-values. Write it with y, like a <= y <= b.':'Write it with the letter '+c.vr+', like a <= '+c.vr+' <= b.'};
    if(c.anyEnds&&close(p2.lo,c.lo)&&close(p2.hi,c.hi)) return {ok:true};
    if(close(p2.lo,c.lo)&&close(p2.hi,c.hi)&&p2.il===c.il&&p2.ih===c.ih) return {ok:true};
    for(i=0;i<w.length;i++) if(close(p2.lo,w[i][0])&&close(p2.hi,w[i][1])) return {ok:false,msg:w[i][2]};
    if(close(p2.lo,c.lo)&&close(p2.hi,c.hi)) return {ok:false,msg:'The numbers are right. Check the ends: a closed (filled) dot means “or equal to” (≤).'};
    return {ok:false,msg:c.hint||'Not yet. Find the lowest and highest values on the graph.'};}
  if(T==='point'){var q2=parsePt(raw);if(!q2) return {ok:false,msg:'Type a point like (3, −2).'};
    if(close(q2[0],c.ans[0])&&close(q2[1],c.ans[1])) return {ok:true};
    if(close(q2[0],c.ans[1])&&close(q2[1],c.ans[0])) return {ok:false,msg:'You switched the numbers. A point is written (x, y): x first, then y.'};
    for(i=0;i<w.length;i++) if(close(q2[0],w[i][0][0])&&close(q2[1],w[i][0][1])) return {ok:false,msg:w[i][1]};
    return {ok:false,msg:c.hint||'Not yet. Check x first, then y.'};}
  if(T==='text'){var t=s.replace(/[^a-z0-9]/g,'');if(c.ans.some(function(a){return t===a;})) return {ok:true};
    for(i=0;i<w.length;i++) if(t===w[i][0]) return {ok:false,msg:w[i][1]};return {ok:false,msg:c.hint||'Not yet. Try again.'};}
  return {ok:false,msg:'?'};}
function check(id){var c=Q[id],inp=document.getElementById(id+'-in');if(!c||!inp) return;
  if(solved[id]&&inp.disabled) return;
  if(!inp.value.trim()){fb(id,'Type your answer first.',false);return;}
  var res=grade(c,inp.value);tally(id,res.ok,false);
  if(res.ok){fb(id,'✓ '+(c.ok||'Correct!'),true);inp.disabled=true;inp.classList.add('ok');sol(id);}
  else{fb(id,res.msg,false);inp.classList.remove('ok');}}
function mc(id,btn){var c=Q[id],card=document.getElementById(id);if(!c||!card||card.dataset.done) return;
  var v=btn.getAttribute('data-v'),ok=v===c.ans;tally(id,ok,true);
  if(ok){card.dataset.done='1';btn.classList.add('correct');card.querySelectorAll('.chk-btn').forEach(function(b){b.disabled=true;});fb(id,'✓ '+(c.ok||'Correct!'),true);sol(id);}
  else{btn.classList.add('wrong');btn.disabled=true;fb(id,(c.why&&c.why[v])||c.hint||'Not that one. Look again and try another choice.',false);}}
function pick(id,btn){var c=Q[id],card=document.getElementById(id);if(!c||!card||card.dataset.done) return;
  var i=+btn.getAttribute('data-i'),ok=i===c.ans;tally(id,ok,true);
  if(ok){card.dataset.done='1';btn.classList.add('mistake');card.querySelectorAll('.wk-line').forEach(function(b){b.disabled=true;});fb(id,'✓ '+c.ok,true);sol(id);}
  else{btn.classList.add('fine');btn.disabled=true;fb(id,(c.why&&c.why[i])||'That line is correct. Keep looking — compare each line with the one before it.',false);}}
function put(map){Object.keys(map).forEach(function(k){var el=document.getElementById(k);if(!el) return;try{el.innerHTML=String(map[k]());}catch(e){el.textContent='';if(window.console) console.error(k,e);}});}


/* ---------- build problem cards from specs ---------- */
function vizRow(fns,ids,cap){if(!fns) return '';fns=[].concat(fns);var h='<div class="viz-row">';fns.forEach(function(f,i){h+='<div class="viz" id="'+ids+i+'"></div>';});h+='</div>';if(cap) h+='<div class="viz-cap">'+cap+'</div>';return h;}
function items(cid,list){var box=document.getElementById(cid);if(!box) return;var html='',draws={};
  list.forEach(function(it){var id=it.id;Q[id]=it;
    var cls=it.kind==='pick'?'chk mistake':'chk';
    html+='<div class="'+cls+'" id="'+id+'"><div class="chk-q"><span class="badge">'+it.n+'</span> '+it.q+'</div>';
    html+=vizRow(it.pre,id+'-v',it.preCap);
    if(it.kind==='mc'){html+='<div class="chk-opts">'+it.opts.map(function(o){return '<button type="button" class="chk-btn" data-v="'+o[0]+'">'+o[1]+'</button>';}).join('')+'</div>';}
    else if(it.kind==='pick'){html+='<div class="wk">'+it.lines.map(function(l,i){return '<button type="button" class="wk-line" data-i="'+i+'"><span class="ln">Line '+(i+1)+'</span>'+l+'</button>';}).join('')+'</div>';}
    else if(it.kind!=='lab'){html+='<div class="val-chk"><input id="'+id+'-in" placeholder="'+(it.ph||'answer')+'" aria-label="Answer for problem '+it.n+'" autocomplete="off" autocapitalize="off" spellcheck="false"><button type="button" class="go">Check</button></div>';}
    else html+='<div class="lab" id="'+id+'-lab"></div>';
    html+='<div class="chk-fb" id="fb-'+id+'" aria-live="polite"></div>';
    if(it.steps||it.post){html+='<button type="button" class="sa-btn sm">📖 Show full solution</button><div class="sa-ans" id="'+id+'-s">'+(it.steps||'')+vizRow(it.post,id+'-w',it.postCap)+'</div>';}
    html+='</div>';
    [].concat(it.pre||[]).forEach(function(f,i){draws[id+'-v'+i]=f;});[].concat(it.post||[]).forEach(function(f,i){draws[id+'-w'+i]=f;});});
  box.innerHTML=html;put(draws);
  list.forEach(function(it){var card=document.getElementById(it.id);
    var go=card.querySelector('.go');if(go) go.addEventListener('click',function(){check(it.id);});
    card.querySelectorAll('.chk-btn').forEach(function(b){b.addEventListener('click',function(){mc(it.id,b);});});
    card.querySelectorAll('.wk-line').forEach(function(b){b.addEventListener('click',function(){pick(it.id,b);});});
    var sb=card.querySelector('.sa-btn.sm');if(sb) sb.addEventListener('click',function(){sol(it.id);});
    if(it.kind==='lab'&&it.lab) it.lab(it.id+'-lab',it.id);});}

/* ---------- vertical step-by-step work (drawn by ../vwork.js) ---------- */
/* vw('2x + 5 = 17',{note:'…'}) → a .vw block; vwork.js computes every step. */
function vw(eq,o){var s={eq:eq};o=o||{};Object.keys(o).forEach(function(k){s[k]=o[k];});
  return '<div class="vw" data-vw=\''+JSON.stringify(s).replace(/'/g,'&#39;').replace(/</g,'&lt;')+'\'></div>';}
/* hw(rows,note): the same look, written by hand (for formulas with several letters, which vwork.js cannot do).
   rows: ['e',[left terms],[right terms],rel] equation · ['l','label'] step label · ['o',[left],[right]] what we do to
   both sides (red) · ['d','left divisor','right divisor'] divide both sides · ['a',[left],[right],rel] answer (green box). */
function hwX(t){return '<span class="vw-x on">'+t+'</span>';}
function hwFr(a,b){return '<span class="vw-fr"><span>'+a+'</span><span>'+b+'</span></span>';}
function hw(rows,note){var NL=1,NR=1,h='',g=0,n=0,prev=null;
  rows.forEach(function(r){if(r[0]==='e'||r[0]==='a'){NL=Math.max(NL,r[1].length);NR=Math.max(NR,r[2].length);}});
  function cell(cls,col,html){return '<div class="vw-c'+cls+'" style="grid-row:'+g+';grid-column:'+col+'">'+html+'</div>';}
  rows.forEach(function(r){g++;var t=r[0];
    if(t==='l'){n++;h+='<div class="vw-c vw-lab" style="grid-row:'+g+'"><i>'+n+'</i>'+r[1]+'</div>';return;}
    if(t==='e'||t==='a'){var all=[];r[1].forEach(function(c,i){all.push([NL-r[1].length+i+2,c]);});all.push([NL+2,r[3]||'=',1]);
      r[2].forEach(function(c,i){all.push([NL+3+i,c]);});
      all.forEach(function(a,j){h+=cell((a[2]?' vw-rel':'')+(t==='a'?' vw-ansc'+(j===0?' vw-first':'')+(j===all.length-1?' vw-last':''):''),a[0],a[1]);});prev=r;return;}
    if(t==='o'){var used={};r[1].forEach(function(c,i){var col=NL-r[1].length+i+2;used[col]=1;h+=cell(' vw-op',col,c||'&nbsp;');});
      r[2].forEach(function(c,i){var col=NL+3+i;used[col]=1;h+=cell(' vw-op',col,c||'&nbsp;');});
      for(var c=2;c<=NL+2+NR;c++) if(!used[c]) h+=cell(' vw-op',c,'&nbsp;');return;}
    if(t==='d'){h+=cell(' vw-div',(NL-prev[1].length+2)+'/'+(NL+2),r[1]);h+=cell(' vw-div',(NL+3)+'/'+(NL+3+prev[2].length),r[2]);}});
  return '<div class="vw vw-hand" role="group" aria-label="step by step work"><div class="vw-box"><div class="vw-g" style="grid-template-columns:minmax(0,1fr) repeat('+NL+',auto) auto repeat('+NR+',auto) minmax(0,1fr)">'+h+'</div></div>'+(note?'<div class="vw-cap">'+note+'</div>':'')+'</div>';}
/* "Reveal all answers" (answer key) also shows every step of the vertical work */
if(typeof window!=='undefined'&&typeof window.revealPage==='function'&&!window.revealPage._vw){var _rp=window.revealPage;
  window.revealPage=function(){_rp.apply(this,arguments);document.querySelectorAll('.vw .vw-all').forEach(function(b){b.click();});};window.revealPage._vw=1;}

return {items:items,vizRow:vizRow,C:C,fm:fm,sup:sup,Svg:Svg,grid:grid,numline:numline,balance:balance,tiles:tiles,tape:tape,chain:chain,mapping:mapping,tbl:tbl,machine:machine,
  chips:chips,fracChips:fracChips,ladder:ladder,square:square,cube:cube,areaModel:areaModel,terms:terms,rectP:rectP,bars:bars,proof:proof,
  slopeLab:slopeLab,balanceLab:balanceLab,ineqLab:ineqLab,dragFn:dragFn,vltLab:vltLab,matchLine:matchLine,
  clean:clean,evalStr:evalStr,parseNum:parseNum,parseIneq:parseIneq,parsePt:parsePt,exprEq:exprEq,grade:grade,
  q:q,check:check,mc:mc,pick:pick,sol:sol,put:put,Q:Q,vw:vw,hw:hw,hwX:hwX,hwFr:hwFr};
})();
