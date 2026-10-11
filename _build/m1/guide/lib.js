/* ════════════════════════════════════════════════════════════════════
   VISUALS — every picture is drawn here from the numbers it is given.
   navy = given · gold = what we want · green = answer (after checking)
   ════════════════════════════════════════════════════════════════════ */
var C = {navy:'#1E2D4F', gold:'#E0A800', goldFill:'#FFF3C4', green:'#15803D', greenFill:'#DCFCE7',
         grid:'#D5DAE3', mute:'#5B6475', royal:'#0056B3', royalFill:'#E3EEFB', navyFill:'#E8EDF5', red:'#B42318', redFill:'#FDE8E8'};
var _uid = 0;
function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
/* number → text with a true minus sign, no float noise */
function fmt(n){
  if (typeof n === 'string') return n.replace(/-/g,'−');
  var r = Math.round(n*1000)/1000;
  if (Object.is(r,-0)) r = 0;
  return String(r).replace('-','−');
}
function colorOf(st){ return st==='want'?C.gold : st==='ans'?C.green : st==='bad'?C.red : st==='alt'?C.royal : C.navy; }
function fillOf(st){ return st==='want'?C.goldFill : st==='ans'?C.greenFill : st==='bad'?C.redFill : st==='alt'?C.royalFill : C.navyFill; }

/* ── SVG builder that keeps every label inside the box ── */
function SVG(W,H,label){ this.W=W; this.H=H; this.p=[]; this.label=label||''; }
SVG.prototype.add = function(s){ this.p.push(s); return this; };
SVG.prototype.tw = function(s,fs,b){
  var w=0, str=String(s);
  for (var i=0;i<str.length;i++){ var ch=str[i];
    w += /[²³⁴⁵⁶⁷⁸⁹⁰¹ˣⁿ₀₁₂₃₄₅₆₇₈₉ₙ]/.test(ch)?0.42 : /[il.,:;|'!()\[\] ]/.test(ch)?0.34 : /[mwMW—]/.test(ch)?0.92 : /[A-Z?=+−×÷<>≤≥√]/.test(ch)?0.7 : 0.6; }
  return w*fs*(b?1.06:1);
};
/* o: fs, a (anchor start|middle|end), c (color), b (bold), halo, pill (border color), it (italic) */
SVG.prototype.t = function(x,y,s,o){
  o=o||{}; var fs=o.fs||13, a=o.a||'middle', w=this.tw(s,fs,o.b!==false), pad=o.pill?5:2;
  if (w > this.W-2*pad-4){ fs = fs*(this.W-2*pad-4)/w; w=this.tw(s,fs,o.b!==false); }
  var left = a==='middle'? x-w/2 : a==='end'? x-w : x;
  if (left < pad+1) left = pad+1;
  if (left + w > this.W-pad-1) left = this.W-pad-1-w;
  x = a==='middle'? left+w/2 : a==='end'? left+w : left;
  var top = fs*1.0 + (o.pill?4:1.5), bot = this.H - fs*0.3 - (o.pill?4:1.5);
  if (y < top) y = top; if (y > bot) y = bot;
  var out='', tc = (o.c===C.gold)? '#8A6500' : (o.c||C.navy);
  if (o.pill) out += '<rect x="'+(left-4).toFixed(1)+'" y="'+(y-fs*0.86-2).toFixed(1)+'" width="'+(w+8).toFixed(1)+'" height="'+(fs*1.14+4).toFixed(1)+'" rx="5" fill="'+(o.pillFill||(o.pill===C.gold?C.goldFill:'#fff'))+'" stroke="'+o.pill+'" stroke-width="1.4"/>';
  out += '<text x="'+x.toFixed(1)+'" y="'+y.toFixed(1)+'" font-size="'+fs+'" text-anchor="'+a+'" fill="'+tc+'"'+
    (o.b===false?'':' font-weight="700"')+(o.it?' font-style="italic"':'')+
    (o.halo!==false && !o.pill ? ' stroke="#fff" stroke-width="3.2" stroke-linejoin="round" paint-order="stroke"':'')+'>'+esc(s)+'</text>';
  this.p.push(out); return this;
};
/* "?" marker: gold circle, navy question mark */
SVG.prototype.q = function(x,y,r){ r=r||10;
  this.p.push('<circle cx="'+x.toFixed(1)+'" cy="'+y.toFixed(1)+'" r="'+r+'" fill="'+C.gold+'" stroke="'+C.navy+'" stroke-width="1.2"/><text x="'+x.toFixed(1)+'" y="'+(y+r*0.42).toFixed(1)+'" font-size="'+(r*1.25).toFixed(1)+'" font-weight="700" text-anchor="middle" fill="'+C.navy+'">?</text>');
  return this; };
SVG.prototype.box = function(x,y,w,h,st,o){ o=o||{};
  this.p.push('<rect x="'+x.toFixed(1)+'" y="'+y.toFixed(1)+'" width="'+w.toFixed(1)+'" height="'+h.toFixed(1)+'" rx="'+(o.rx==null?6:o.rx)+'" fill="'+(o.fill||fillOf(st))+'" stroke="'+colorOf(st)+'" stroke-width="'+(o.sw||2)+'"'+(st==='want'||o.dash?' stroke-dasharray="5 3"':'')+'/>');
  return this; };
SVG.prototype.arrow = function(x1,y1,x2,y2,c,o){ o=o||{}; c=c||C.navy; var id='ah'+(++_uid);
  this.p.push('<defs><marker id="'+id+'" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="'+c+'"/></marker></defs>'+
   (o.curve? '<path d="M'+x1+','+y1+' Q'+o.curve[0]+','+o.curve[1]+' '+x2+','+y2+'" fill="none"' : '<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'"')+
   ' stroke="'+c+'" stroke-width="'+(o.w||2)+'"'+(o.dash?' stroke-dasharray="5 3"':'')+' marker-end="url(#'+id+')"/>');
  return this; };
SVG.prototype.end = function(){
  return '<svg viewBox="0 0 '+this.W+' '+Math.round(this.H)+'" role="img" aria-label="'+esc(this.label)+'" xmlns="http://www.w3.org/2000/svg" style="font-family:Inter,system-ui,sans-serif">'+this.p.join('')+'</svg>';
};
/* a cell label: '?' (want) shows a gold marker, otherwise text in the state's colour */
function cellText(S,x,y,cell,fs){
  if (cell==null) return;
  if (typeof cell!=='object') cell={s:cell};
  if (cell.s==='?') { S.q(x,y-fs*0.3,fs*0.8); return; }
  S.t(x,y,cell.s,{fs:fs||14,c:colorOf(cell.st),halo:false});
}

/* ── Coordinate plane ── returns {svg, X, Y, IX, IY, W, H} ── */
function plane(o){
  var x0=o.x[0],x1=o.x[1],y0=o.y[0],y1=o.y[1], xs=o.xs||1, ys=o.ys||1, W=o.w||320;
  var yAxisIn = x0<=0 && x1>=0, xAxisIn = y0<=0 && y1>=0;
  var lyStep = o.ly || ys, lxStep = o.lx || xs;
  var ylabW = 0;
  for (var v=Math.ceil(y0/lyStep)*lyStep; v<=y1+1e-9; v+=lyStep) ylabW = Math.max(ylabW, new SVG(1,1).tw(fmt(v),11.5,false));
  var pl = o.pl || (yAxisIn && x0<0 ? 14 : ylabW+12), pr = o.pr||14, pt = o.pt||(o.yt?28:16), pb = o.pb||(o.xt?40:24);
  var cw = (W-pl-pr)/((x1-x0)/xs);
  var ch = o.ch || cw;
  var H = pt+pb+ch*((y1-y0)/ys);
  var X=function(v){return pl+(v-x0)/xs*cw;}, Y=function(v){return pt+(y1-v)/ys*ch;};
  var IX=function(px){return x0+(px-pl)/cw*xs;}, IY=function(py){return y1-(py-pt)/ch*ys;};
  var S=new SVG(W,H,o.label||'Coordinate plane'), i, it;
  var cid='cp'+(++_uid);
  S.add('<defs><clipPath id="'+cid+'"><rect x="'+X(x0)+'" y="'+Y(y1)+'" width="'+(X(x1)-X(x0))+'" height="'+(Y(y0)-Y(y1))+'"/></clipPath></defs>');
  S.add('<rect x="'+X(x0)+'" y="'+Y(y1)+'" width="'+(X(x1)-X(x0))+'" height="'+(Y(y0)-Y(y1))+'" fill="#fff"/>');
  var g='';
  for (v=x0; v<=x1+1e-9; v+=xs) g+='<line x1="'+X(v).toFixed(1)+'" y1="'+Y(y1).toFixed(1)+'" x2="'+X(v).toFixed(1)+'" y2="'+Y(y0).toFixed(1)+'"/>';
  for (v=y0; v<=y1+1e-9; v+=ys) g+='<line x1="'+X(x0).toFixed(1)+'" y1="'+Y(v).toFixed(1)+'" x2="'+X(x1).toFixed(1)+'" y2="'+Y(v).toFixed(1)+'"/>';
  S.add('<g stroke="'+C.grid+'" stroke-width="1">'+g+'</g>');
  // shading goes under the axes
  (o.items||[]).forEach(function(it){ if(it.t==='shade'){
      var pts=[], n=60, k, xx;
      for (k=0;k<=n;k++){ xx=x0+(x1-x0)*k/n; pts.push([X(xx),Y(it.f(xx))]); }
      var edge = it.side==='above'? Y(y1)-400 : Y(y0)+400;
      var d='M'+pts[0][0].toFixed(1)+','+edge+' '+pts.map(function(p){return 'L'+p[0].toFixed(1)+','+Math.max(-2000,Math.min(2000,p[1])).toFixed(1);}).join(' ')+' L'+pts[n][0].toFixed(1)+','+edge+' Z';
      S.add('<path d="'+d+'" fill="'+(it.c?fillOf(it.c):C.royalFill)+'" opacity="'+(it.op||0.75)+'" clip-path="url(#'+cid+')"/>');
  }});
  var ax = yAxisIn? X(0) : X(x0), ay = xAxisIn? Y(0) : Y(y0);
  S.add('<line x1="'+X(x0)+'" y1="'+ay+'" x2="'+X(x1)+'" y2="'+ay+'" stroke="'+C.navy+'" stroke-width="1.8"/>');
  S.add('<line x1="'+ax+'" y1="'+Y(y1)+'" x2="'+ax+'" y2="'+Y(y0)+'" stroke="'+C.navy+'" stroke-width="1.8"/>');
  // tick labels
  var lab = '<g font-size="11.5" fill="'+C.mute+'">';
  for (v=Math.ceil(x0/lxStep)*lxStep; v<=x1+1e-9; v+=lxStep){
    if (Math.abs(v)<1e-9 && yAxisIn && xAxisIn) continue;
    if (Math.abs(v-x1)<1e-9 && !o.lastX) continue;
    lab += '<text x="'+X(v).toFixed(1)+'" y="'+(ay+14).toFixed(1)+'" text-anchor="middle" stroke="#fff" stroke-width="3" paint-order="stroke">'+fmt(v)+'</text>';
  }
  for (v=Math.ceil(y0/lyStep)*lyStep; v<=y1+1e-9; v+=lyStep){
    if (Math.abs(v)<1e-9 && yAxisIn && xAxisIn) continue;
    if (Math.abs(v-y1)<1e-9 && !o.lastY) continue;
    if (!xAxisIn && Math.abs(v-y0)<1e-9 && !yAxisIn) continue;
    lab += '<text x="'+(ax-4).toFixed(1)+'" y="'+(Y(v)+4).toFixed(1)+'" text-anchor="end" stroke="#fff" stroke-width="3" paint-order="stroke">'+fmt(v)+'</text>';
  }
  if (yAxisIn && xAxisIn) lab += '<text x="'+(ax-4).toFixed(1)+'" y="'+(ay+14).toFixed(1)+'" text-anchor="end">0</text>';
  else if (!yAxisIn && !xAxisIn) lab += '<text x="'+(ax-4).toFixed(1)+'" y="'+(ay+14).toFixed(1)+'" text-anchor="end">'+fmt(x0===0&&y0===0?0:y0)+'</text>'+(x0!==y0?'<text x="'+X(x0).toFixed(1)+'" y="'+(ay+14).toFixed(1)+'" text-anchor="middle"></text>':'');
  S.add(lab+'</g>');
  if (!yAxisIn && !xAxisIn && x0!==y0) S.t(X(x0),ay+14,fmt(x0),{fs:11.5,c:C.mute,b:false});
  // axis names
  S.t(X(x1)-3, ay-6, o.xl||'x', {fs:13,a:'end',it:true});
  S.t(ax+6, Y(y1)+12, o.yl||'y', {fs:13,a:'start',it:true});
  if (o.xt) S.t((X(x0)+X(x1))/2, H-6, o.xt, {fs:12,b:false,c:C.mute});
  if (o.yt) S.t(Math.max(4,ax-10), 14, o.yt, {fs:12,a:'start',b:false,c:C.mute});
  var later=[];   // labels drawn last so lines never cover them
  (o.items||[]).forEach(function(it){
    var c = colorOf(it.st), w = it.w||3, dash = it.dash?' stroke-dasharray="7 5"':'';
    if (it.t==='line' || it.t==='fn'){
      var f = it.t==='line'? function(x){return it.m*x+it.b;} : it.f;
      var a = it.from==null? x0 : it.from, bnd = it.to==null? x1 : it.to, n = it.t==='line'? 1 : 160, d='', k, xx, yy, pen=false;
      for (k=0;k<=n;k++){ xx=a+(bnd-a)*k/n; yy=f(xx);
        if (!isFinite(yy) || yy>y1+(y1-y0)*3 || yy<y0-(y1-y0)*3){ pen=false; continue; }
        d += (pen?'L':'M')+X(xx).toFixed(1)+','+Y(yy).toFixed(1)+' '; pen=true; }
      S.add('<path d="'+d+'" fill="none" stroke="'+c+'" stroke-width="'+w+'"'+dash+' stroke-linecap="round" clip-path="url(#'+cid+')"/>');
      if (it.lab){ var lx = it.lx!=null? it.lx : (a+bnd)/2, ly=f(lx); later.push([X(lx)+(it.dx||0), Y(ly)+(it.dy==null?-12:it.dy), it.lab, {fs:12.5,c:c,pill:c}]); }
    } else if (it.t==='vline' || it.t==='hline'){
      var p1 = it.t==='vline'? [X(it.x),Y(y1),X(it.x),Y(y0)] : [X(x0),Y(it.y),X(x1),Y(it.y)];
      S.add('<line x1="'+p1[0]+'" y1="'+p1[1]+'" x2="'+p1[2]+'" y2="'+p1[3]+'" stroke="'+c+'" stroke-width="'+(it.w||2.4)+'"'+(it.dash===false?'':' stroke-dasharray="7 5"')+'/>');
      if (it.lab) later.push(it.t==='vline'? [X(it.x)+(it.dx||0), Y(y1)+(it.dy||14), it.lab, {fs:12.5,c:c,pill:c}] : [X(x1)-4+(it.dx||0), Y(it.y)-8, it.lab, {fs:12.5,c:c,pill:c,a:'end'}]);
    } else if (it.t==='seg'){
      S.add('<line x1="'+X(it.a[0])+'" y1="'+Y(it.a[1])+'" x2="'+X(it.b[0])+'" y2="'+Y(it.b[1])+'" stroke="'+c+'" stroke-width="'+(it.w||3)+'"'+dash+' stroke-linecap="round"/>');
      if (it.lab){ var mx=(X(it.a[0])+X(it.b[0]))/2+(it.dx||0), my=(Y(it.a[1])+Y(it.b[1]))/2+(it.dy||0); later.push([mx,my,it.lab,{fs:12.5,c:c,pill:c}]); }
    } else if (it.t==='rise'){   // slope triangle a → corner → b
      var cx=X(it.b[0]), cy=Y(it.a[1]);
      S.add('<path d="M'+X(it.a[0])+','+Y(it.a[1])+' L'+cx+','+cy+' L'+X(it.b[0])+','+Y(it.b[1])+'" fill="none" stroke="'+c+'" stroke-width="2.4" stroke-dasharray="6 4"/>');
      if (it.run) later.push([(X(it.a[0])+cx)/2, cy+(it.b[1]>it.a[1]?16:-8), it.run, {fs:12.5,c:c,pill:it.runPill?colorOf(it.runPill):null}]);
      if (it.rise) later.push([cx+(it.b[0]>=it.a[0]?6:-6), (cy+Y(it.b[1]))/2+4, it.rise, {fs:12.5,c:c,a:it.b[0]>=it.a[0]?'start':'end'}]);
    } else if (it.t==='poly'){
      S.add('<polygon points="'+it.pts.map(function(p){return X(p[0]).toFixed(1)+','+Y(p[1]).toFixed(1);}).join(' ')+'" fill="'+fillOf(it.st)+'" fill-opacity="0.8" stroke="'+c+'" stroke-width="2.4"/>');
      if (it.lab) later.push([X(it.lx), Y(it.ly), it.lab, {fs:13,c:c}]);
    } else if (it.t==='xbr' || it.t==='ybr'){
      if (it.t==='xbr') S.add('<line x1="'+X(it.a)+'" y1="'+ay+'" x2="'+X(it.b)+'" y2="'+ay+'" stroke="'+c+'" stroke-width="7" stroke-opacity="0.55" stroke-linecap="round"/>');
      else S.add('<line x1="'+ax+'" y1="'+Y(it.a)+'" x2="'+ax+'" y2="'+Y(it.b)+'" stroke="'+c+'" stroke-width="7" stroke-opacity="0.55" stroke-linecap="round"/>');
      if (it.lab) later.push(it.t==='xbr'? [(X(it.a)+X(it.b))/2, ay+(it.dy||30), it.lab, {fs:12,c:c,pill:c}] : [ax+(it.dx||10), it.ly!=null? Y(it.ly) : (Y(it.a)+Y(it.b))/2, it.lab, {fs:12,c:c,pill:c,a:(it.dx||10)<0?'end':'start'}]);
    } else if (it.t==='ra'){   // right-angle mark
      var px=X(it.at[0]), py=Y(it.at[1]), s=9, u=it.u, vv=it.v, ul=Math.hypot(u[0],u[1]), vl=Math.hypot(vv[0],vv[1]);
      var ux=u[0]/ul*s, uy=-u[1]/ul*s, vx=vv[0]/vl*s, vy=-vv[1]/vl*s;
      S.add('<path d="M'+(px+ux)+','+(py+uy)+' L'+(px+ux+vx)+','+(py+uy+vy)+' L'+(px+vx)+','+(py+vy)+'" fill="none" stroke="'+c+'" stroke-width="1.8"/>');
    } else if (it.t==='text'){
      later.push([X(it.x)+(it.dx||0), Y(it.y)+(it.dy||0), it.s, {fs:it.fs||12.5, c:c, a:it.a||'middle', pill:it.pill?c:null}]);
    }
  });
  (o.items||[]).forEach(function(it){
    if (it.t==='pt'){
      var c=colorOf(it.st);
      S.add('<circle cx="'+X(it.x).toFixed(1)+'" cy="'+Y(it.y).toFixed(1)+'" r="'+(it.r||5.5)+'" fill="'+(it.open?'#fff':c)+'" stroke="'+(it.open?c:'#fff')+'" stroke-width="'+(it.open?2.5:1.5)+'"/>');
      if (it.lab) later.push([X(it.x)+(it.dx==null?8:it.dx), Y(it.y)+(it.dy==null?-9:it.dy), it.lab, {fs:12.5,c:c,a:it.a||(it.dx<0?'end':'start')}]);
    } else if (it.t==='q'){
      later.push(['Q', X(it.x), Y(it.y)]);
      if (it.lab) later.push([X(it.x)+(it.dx==null?14:it.dx), Y(it.y)+(it.dy==null?-10:it.dy), it.lab, {fs:12.5,c:C.navy,a:it.a||'start',pill:C.gold,pillFill:C.goldFill}]);
    }
  });
  later.forEach(function(L){ if (L[0]==='Q') S.q(L[1],L[2],9); else S.t(L[0],L[1],L[2],L[3]); });
  return {svg:S.end(), X:X, Y:Y, IX:IX, IY:IY, W:W, H:H};
}
function P(o){ return plane(o).svg; }

/* ── Number line(s) ── o: min,max,step,lab, rows:[{title, items}] or items ── */
function nline(o){
  var rows = o.rows || [{title:o.title, items:o.items||[]}], W=o.w||320, pl=18, pr=18, rowH=o.rowH||74;
  var H = rows.length*rowH + 6, S = new SVG(W,H,o.label||'Number line');
  var X=function(v){ return pl + (v-o.min)/(o.max-o.min)*(W-pl-pr); };
  rows.forEach(function(r,ri){
    var y = ri*rowH + rowH*0.56 + 4;
    if (r.title) S.t(6, ri*rowH+15, r.title, {fs:12.5,a:'start',c:C.navy});
    S.add('<line x1="'+(pl-8)+'" y1="'+y+'" x2="'+(W-pr+8)+'" y2="'+y+'" stroke="'+C.navy+'" stroke-width="2"/>');
    S.add('<path d="M'+(pl-12)+','+y+' l7,-5 v10 z M'+(W-pr+12)+','+y+' l-7,-5 v10 z" fill="'+C.navy+'"/>');
    var step=o.step||1, lab=o.lab||step;
    for (var v=o.min; v<=o.max+1e-9; v+=step){
      var isLab = Math.abs(Math.round((v-o.min)/lab)*lab-(v-o.min))<1e-9;
      S.add('<line x1="'+X(v).toFixed(1)+'" y1="'+(y-(isLab?6:4))+'" x2="'+X(v).toFixed(1)+'" y2="'+(y+(isLab?6:4))+'" stroke="'+C.navy+'" stroke-width="1.4"/>');
      if (isLab) S.t(X(v), y+21, fmt(v), {fs:11.5,c:C.mute,b:false});
    }
    var later=[];
    (r.items||[]).forEach(function(it){
      var c=colorOf(it.st);
      if (it.t==='ray'){
        var end = it.dir>0? W-pr+6 : pl-6;
        S.add('<line x1="'+X(it.v)+'" y1="'+y+'" x2="'+end+'" y2="'+y+'" stroke="'+c+'" stroke-width="6" stroke-opacity="0.8"/>');
        S.add('<path d="M'+(it.dir>0? (W-pr+14)+','+y+' l-10,-7 v14 z' : (pl-14)+','+y+' l10,-7 v14 z')+'" fill="'+c+'"/>');
        S.add('<circle cx="'+X(it.v)+'" cy="'+y+'" r="6.5" fill="'+(it.open?'#fff':c)+'" stroke="'+c+'" stroke-width="3"/>');
        if (it.lab) later.push([X(it.v)+(it.dir>0?30:-30), y-16, it.lab, {fs:12.5,c:c,pill:c}]);
      } else if (it.t==='dot'){
        S.add('<circle cx="'+X(it.v)+'" cy="'+y+'" r="6" fill="'+(it.open?'#fff':c)+'" stroke="'+c+'" stroke-width="2.5"/>');
        if (it.lab) later.push([X(it.v), y-14, it.lab, {fs:12.5,c:c}]);
      } else if (it.t==='seg'){
        S.add('<line x1="'+X(it.a)+'" y1="'+y+'" x2="'+X(it.b)+'" y2="'+y+'" stroke="'+c+'" stroke-width="6" stroke-opacity="0.8"/>');
      } else if (it.t==='hop'){
        var xa=X(it.a), xb=X(it.b), mid=(xa+xb)/2, hgt=Math.min(26,Math.abs(xb-xa)*0.5+8);
        S.arrow(xa, y-8, xb, y-8, c, {curve:[mid, y-8-hgt*1.6], w:2});
        if (it.lab) later.push([mid, y-12-hgt*0.9, it.lab, {fs:12,c:c}]);
      } else if (it.t==='q'){
        later.push(['Q', X(it.v), y-20]);
      } else if (it.t==='brk'){
        S.add('<path d="M'+X(it.a)+','+(y-12)+' v-8 H'+X(it.b)+' v8" fill="none" stroke="'+c+'" stroke-width="2.2"/>');
        if (it.lab) later.push([(X(it.a)+X(it.b))/2, y-26, it.lab, {fs:12.5,c:c,pill:it.pill?c:null}]);
      } else if (it.t==='text'){ later.push([X(it.v), y+(it.dy||-16), it.s, {fs:12.5,c:c,pill:it.pill?c:null}]); }
    });
    later.forEach(function(L){ if (L[0]==='Q') S.q(L[1],L[2],9); else S.t(L[0],L[1],L[2],L[3]); });
  });
  return S.end();
}

/* ── Balance scale ── left/right: arrays of {k:'x'|'n'|'neg', s, st} ── */
function balance(o){
  var W=320, H=o.cap?168:150, S=new SVG(W,H,o.label||'Balance model'), cx=160;
  S.add('<polygon points="'+cx+',72 '+(cx-16)+',128 '+(cx+16)+',128" fill="'+C.navy+'"/><rect x="'+(cx-50)+'" y="128" width="100" height="7" rx="3" fill="'+C.navy+'"/>');
  S.add('<line x1="16" y1="72" x2="304" y2="72" stroke="'+C.navy+'" stroke-width="5" stroke-linecap="round"/>');
  function side(arr, x0, x1){
    var n=arr.length, gap=5, bw = Math.min(30, (x1-x0-gap*(n-1))/Math.max(1,n));
    var tot = n*bw+(n-1)*gap, start=(x0+x1)/2-tot/2;
    S.add('<path d="M'+(x0-4)+',66 H'+(x1+4)+'" stroke="'+C.navy+'" stroke-width="3"/>');
    arr.forEach(function(t,i){
      var x=start+i*(bw+gap), h = t.k==='x'? 36 : 30, wd = t.k==='x'? bw : bw;
      if (t.k==='n' && arr.length<=3) { wd = Math.min(56, x1-x0); x=(x0+x1)/2-(wd*n+gap*(n-1))/2+i*(wd+gap); }
      S.box(x, 64-h, wd, h, t.st||(t.k==='x'?'alt':null), {rx:4, dash:t.k==='neg'});
      S.t(x+wd/2, 64-h/2+5, t.s, {fs: t.s.length>2?11.5:13.5, c:colorOf(t.st||(t.k==='x'?'alt':null)), halo:false});
    });
  }
  side(o.left, 22, 146); side(o.right, 174, 298);
  if (o.cap) S.t(160, 160, o.cap, {fs:13});
  return S.end();
}

/* ── Undo map ── rows:[{nodes:[{s,st}], ops:['×3','+5']}] ── */
function flow(o){
  var W=320, rowH=60, H=o.rows.length*rowH+(o.cap?28:10), S=new SVG(W,H,o.label||'Step map');
  o.rows.forEach(function(r,ri){
    var n=r.nodes.length, bw=Math.min(62,(W-20-(n-1)*44)/n), gap=(W-20-n*bw)/Math.max(1,n-1), y=ri*rowH+16;
    if (r.title) { S.t(8, y, r.title, {fs:11.5, a:'start', c:C.mute, b:false}); }
    r.nodes.forEach(function(nd,i){
      var x=10+i*(bw+gap);
      if (nd.s==='?'){ S.box(x,y+6,bw,32,'want'); S.q(x+bw/2,y+22,10); }
      else { S.box(x,y+6,bw,32,nd.st); S.t(x+bw/2,y+27,nd.s,{fs:nd.s.length>4?12:14,c:colorOf(nd.st),halo:false}); }
      if (i<n-1){ var ax=x+bw+3, bx=x+bw+gap-3;
        S.arrow(ax, y+22, bx, y+22, r.c?colorOf(r.c):C.navy, {w:2});
        S.t((ax+bx)/2, y+14, r.ops[i], {fs:12.5, c:r.c?colorOf(r.c):C.navy}); }
    });
  });
  if (o.cap) S.t(160, H-8, o.cap, {fs:12.5, c:C.mute, b:false});
  return S.end();
}

/* ── Bar model: total split into equal parts ── */
function barModel(o){
  var W=320, H=o.cap?120:100, S=new SVG(W,H,o.label||'Bar model'), x0=14, x1=306, n=o.parts;
  S.box(x0,18,x1-x0,26,o.totalSt||null,{rx:3}); S.t(160,36,o.total,{fs:13.5,halo:false,c:colorOf(o.totalSt)});
  var pw=(x1-x0)/n;
  for (var i=0;i<n;i++){ var x=x0+i*pw; var st=(o.partSt||'want');
    S.box(x+1,54,pw-2,28,st,{rx:3});
    if (o.part==='?') S.q(x+pw/2,68,9); else S.t(x+pw/2,73,o.part,{fs:13,c:colorOf(st),halo:false}); }
  S.add('<path d="M'+x0+',48 v4 M'+x1+',48 v4" stroke="'+C.navy+'"/>');
  if (o.cap) S.t(160,H-10,o.cap,{fs:12.5,c:C.mute,b:false});
  return S.end();
}

/* ── Area (box) model ── rows/cols labels and cells, any may be {s,st} ── */
function areaModel(o){
  var nr=o.rows.length, nc=o.cols.length, cw=o.cw||Math.min(96,(300-44)/nc), chh=o.chh||46, W=320;
  var gw=nc*cw, x0=(W-gw)/2+16, y0=30, H=y0+nr*chh+(o.cap?30:10), S=new SVG(W,H,o.label||'Area model');
  o.cols.forEach(function(c,j){ cellText(S, x0+j*cw+cw/2, y0-9, c, 14); });
  o.rows.forEach(function(r,i){ cellText(S, x0-18, y0+i*chh+chh/2+5, r, 14); });
  o.cells.forEach(function(row,i){ row.forEach(function(cell,j){
    var st = (cell && typeof cell==='object')? cell.st : null; if (cell && (cell.s||cell)==='?') st='want';
    S.box(x0+j*cw, y0+i*chh, cw, chh, st, {rx:0, sw:1.8});
    cellText(S, x0+j*cw+cw/2, y0+i*chh+chh/2+5, cell, 14);
  });});
  if (o.cap) S.t(160, H-10, o.cap, {fs:12.5,c:C.mute,b:false});
  return S.end();
}

/* ── Algebra tiles ── groups:[{k:'x2'|'x'|'1'|'y', n, neg, lab, st}] ── */
function tiles(o){
  var W=320, S, rows=[[]], width=0, x=10, rowY=[18], rowH=[0], laid=[];
  var dims={x2:[30,30], x:[30,12], y:[22,12], '1':[12,12]};
  o.groups.forEach(function(g){
    var d=dims[g.k], gw=g.n*(d[0]+4)+6;
    if (x+gw>W-10){ x=10; rowY.push(rowY[rowY.length-1]+rowH[rowH.length-1]+34); rowH.push(0); }
    laid.push({g:g,x:x,r:rowY.length-1}); rowH[rowH.length-1]=Math.max(rowH[rowH.length-1],d[1]); x+=gw+8;
  });
  var H=rowY[rowY.length-1]+rowH[rowH.length-1]+(o.cap?52:32); S=new SVG(W,H,o.label||'Algebra tiles');
  laid.forEach(function(L){
    var g=L.g, d=dims[g.k], y=rowY[L.r]+(rowH[L.r]-d[1]);
    var st = g.st || (g.k==='y'?'alt':null);
    for (var i=0;i<g.n;i++){ var xx=L.x+i*(d[0]+4);
      S.add('<rect x="'+xx+'" y="'+y+'" width="'+d[0]+'" height="'+d[1]+'" rx="2" fill="'+(g.neg?'#fff':fillOf(st))+'" stroke="'+colorOf(st)+'" stroke-width="1.8"'+(g.neg?' stroke-dasharray="3 2"':'')+'/>');
      if (g.neg) S.add('<line x1="'+(xx+d[0]/2-3)+'" y1="'+(y+d[1]/2)+'" x2="'+(xx+d[0]/2+3)+'" y2="'+(y+d[1]/2)+'" stroke="'+colorOf(st)+'" stroke-width="1.8"/>');
    }
    if (g.lab) S.t(L.x+(g.n*(d[0]+4)-4)/2, rowY[L.r]+rowH[L.r]+17, g.lab, {fs:13,c:colorOf(st)});
  });
  if (o.cap) S.t(160,H-10,o.cap,{fs:12.5,c:C.mute,b:false});
  return S.end();
}

/* ── X / diamond for factoring: top = product, bottom = sum ── */
function diamond(o){
  var W=320, H=o.cap?176:150, S=new SVG(W,H,o.label||'Product–sum diamond'), cx=160, cy=72, r=58;
  S.add('<line x1="'+(cx-r)+'" y1="'+(cy-r)+'" x2="'+(cx+r)+'" y2="'+(cy+r)+'" stroke="'+C.navy+'" stroke-width="2.5"/><line x1="'+(cx+r)+'" y1="'+(cy-r)+'" x2="'+(cx-r)+'" y2="'+(cy+r)+'" stroke="'+C.navy+'" stroke-width="2.5"/>');
  S.t(cx, cy-r+4, 'multiply to', {fs:11,c:C.mute,b:false}); cellText(S, cx, cy-24, o.top, 16);
  cellText(S, cx, cy+36, o.bottom, 16); S.t(cx, cy+r+12, 'add to', {fs:11,c:C.mute,b:false});
  cellText(S, cx-46, cy+6, o.left, 16); cellText(S, cx+46, cy+6, o.right, 16);
  if (o.side) { S.t(8, 24, o.side, {fs:12.5,a:'start'}); }
  if (o.cap) S.t(160,H-8,o.cap,{fs:12.5,c:C.mute,b:false});
  return S.end();
}

/* ── Sequence hops ── terms:[{s,st}], ops:['+4'] ── */
function hops(o){
  var n=o.terms.length, W=320, bw=Math.min(52,(W-20)/n-12), gap=(W-20-n*bw)/Math.max(1,n-1), H=o.cap?110:88, S=new SVG(W,H,o.label||'Sequence diagram');
  o.terms.forEach(function(t,i){
    var x=10+i*(bw+gap), y=44;
    if (t.s==='?'){ S.box(x,y,bw,30,'want'); S.q(x+bw/2,y+15,9); }
    else { S.box(x,y,bw,30,t.st); S.t(x+bw/2,y+20,t.s,{fs:t.s.length>3?11.5:13.5,c:colorOf(t.st),halo:false}); }
    if (o.idx) S.t(x+bw/2, y+46, o.idx[i], {fs:11.5,c:C.mute,b:false});
    if (i<n-1){ var a=x+bw/2+6, b=x+bw+gap+bw/2-6, m=(a+b)/2;
      S.arrow(a,y-3,b,y-3,o.opSt?colorOf(o.opSt):C.royal,{curve:[m,y-28],w:1.8});
      S.t(m,y-20,o.ops[Math.min(i,o.ops.length-1)],{fs:12,c:o.opSt?colorOf(o.opSt):C.royal}); }
  });
  if (o.cap) S.t(160,H-6,o.cap,{fs:12.5,c:C.mute,b:false});
  return S.end();
}

/* ── Vertical bars (values over steps) — '?' bars never show their height ── */
function bars(o){
  var n=o.vals.length, W=320, H=o.cap?190:168, S=new SVG(W,H,o.label||'Bar chart'), base=136, top=26, bw=Math.min(46,(W-40)/n-14), gap=(W-30-n*bw)/Math.max(1,n-1);
  var max=o.max||Math.max.apply(null,o.vals.map(function(v){return typeof v.v==='number'?v.v:0;}));
  S.add('<line x1="10" y1="'+base+'" x2="310" y2="'+base+'" stroke="'+C.navy+'" stroke-width="2"/>');
  o.vals.forEach(function(v,i){
    var x=15+i*(bw+gap);
    if (v.s==='?'){ S.box(x,base-30,bw,30,'want',{rx:3}); S.q(x+bw/2,base-15,9); }
    else { var h=Math.max(3,(base-top)*v.v/max); S.box(x,base-h,bw,h,v.st,{rx:3}); S.t(x+bw/2,base-h-6,v.s,{fs:12.5,c:colorOf(v.st)}); }
    S.t(x+bw/2, base+16, o.labs[i], {fs:11.5,c:C.mute,b:false});
    if (o.ops && i<n-1) S.t(x+bw+gap/2, base+32, o.ops[i], {fs:12,c:C.royal});
  });
  if (o.cap) S.t(160,H-6,o.cap,{fs:12.5,c:C.mute,b:false});
  return S.end();
}

/* ── Dot plot with optional balance point / median / bracket ── */
function dotplot(o){
  var W=320, S, counts={}, maxc=1, marks=o.marks||[];
  o.data.forEach(function(v){ counts[v]=(counts[v]||0)+1; maxc=Math.max(maxc,counts[v]); });
  var hasTop = marks.some(function(m){return m.t==='brk'||m.t==='line';}), hasTri = marks.some(function(m){return m.t==='tri';});
  var topPad = 10 + (hasTop?26:0), base = topPad + maxc*15 + 6, H = base + 24 + (hasTri?30:0) + (o.cap?22:0);
  S=new SVG(W,H,o.label||'Dot plot'); var pl=18, pr=18, X=function(v){return pl+(v-o.min)/(o.max-o.min)*(W-pl-pr);};
  S.add('<line x1="'+(pl-6)+'" y1="'+base+'" x2="'+(W-pr+6)+'" y2="'+base+'" stroke="'+C.navy+'" stroke-width="2"/>');
  for (var v=o.min; v<=o.max+1e-9; v+=o.step){ S.add('<line x1="'+X(v)+'" y1="'+(base-4)+'" x2="'+X(v)+'" y2="'+(base+4)+'" stroke="'+C.navy+'"/>');
    if (Math.abs(((v-o.min)/(o.lab||o.step))-Math.round((v-o.min)/(o.lab||o.step)))<1e-9) S.t(X(v),base+17,fmt(v),{fs:11.5,c:C.mute,b:false}); }
  var seen={};
  o.data.forEach(function(v){ seen[v]=(seen[v]||0)+1; var st=(o.hl&&o.hl.indexOf(v)>=0)?o.hlSt||'want':null;
    S.add('<circle cx="'+X(v)+'" cy="'+(base-9-(seen[v]-1)*15)+'" r="6" fill="'+colorOf(st)+'" stroke="#fff" stroke-width="1.2"/>'); });
  (o.marks||[]).forEach(function(m){ var c=colorOf(m.st);
    if (m.t==='tri'){ if (m.s==='?'){ S.q(X(m.v),base+34,9); } else { S.add('<polygon points="'+X(m.v)+','+(base+5)+' '+(X(m.v)-8)+','+(base+18)+' '+(X(m.v)+8)+','+(base+18)+'" fill="'+c+'"/>'); S.t(X(m.v),base+36,m.lab,{fs:12,c:c}); } }
    if (m.t==='brk'){ var yb=base-12-maxc*15; S.add('<path d="M'+X(m.a)+','+(yb+6)+' v-6 H'+X(m.b)+' v6" fill="none" stroke="'+c+'" stroke-width="2"/>'); if (m.lab==='?') S.q((X(m.a)+X(m.b))/2, yb-12, 9); else S.t((X(m.a)+X(m.b))/2, yb-6, m.lab, {fs:12,c:c}); }
    if (m.t==='line'){ S.add('<line x1="'+X(m.v)+'" y1="'+(base-10-maxc*15)+'" x2="'+X(m.v)+'" y2="'+base+'" stroke="'+c+'" stroke-width="2.2" stroke-dasharray="5 3"/>'); S.t(X(m.v)+(m.dx||0), base-14-maxc*15, m.lab, {fs:12,c:c,a:m.a||'middle'}); }
  });
  if (o.cap) S.t(160,H-6,o.cap,{fs:12.5,c:C.mute,b:false});
  return S.end();
}

/* ── Box plot from a data set (quartiles: median of each half, median excluded) ── */
function fiveNum(d){
  var s=d.slice().sort(function(a,b){return a-b;}), n=s.length;
  function med(a){ var m=a.length; return m%2? a[(m-1)/2] : (a[m/2-1]+a[m/2])/2; }
  var lo=s.slice(0,Math.floor(n/2)), hi=s.slice(Math.ceil(n/2));
  return {min:s[0], q1:med(lo), med:med(s), q3:med(hi), max:s[n-1]};
}
function boxplot(o){
  var f=o.five||fiveNum(o.data), W=320, H=o.cap?150:128, S=new SVG(W,H,o.label||'Box plot'), pl=18, pr=18;
  var X=function(v){return pl+(v-o.min)/(o.max-o.min)*(W-pl-pr);}, y=66, base=108;
  S.add('<line x1="'+(pl-6)+'" y1="'+base+'" x2="'+(W-pr+6)+'" y2="'+base+'" stroke="'+C.navy+'" stroke-width="2"/>');
  for (var v=o.min; v<=o.max+1e-9; v+=o.step){ S.add('<line x1="'+X(v)+'" y1="'+(base-4)+'" x2="'+X(v)+'" y2="'+(base+4)+'" stroke="'+C.navy+'"/>');
    if (Math.abs(((v-o.min)/(o.lab||o.step))-Math.round((v-o.min)/(o.lab||o.step)))<1e-9) S.t(X(v),base+16,fmt(v),{fs:11.5,c:C.mute,b:false}); }
  var wl = o.whiskerMax!=null? o.whiskerMax : f.max;
  S.add('<line x1="'+X(f.min)+'" y1="'+y+'" x2="'+X(f.q1)+'" y2="'+y+'" stroke="'+C.navy+'" stroke-width="2"/><line x1="'+X(f.q3)+'" y1="'+y+'" x2="'+X(wl)+'" y2="'+y+'" stroke="'+C.navy+'" stroke-width="2"/>');
  S.add('<line x1="'+X(f.min)+'" y1="'+(y-9)+'" x2="'+X(f.min)+'" y2="'+(y+9)+'" stroke="'+C.navy+'" stroke-width="2"/><line x1="'+X(wl)+'" y1="'+(y-9)+'" x2="'+X(wl)+'" y2="'+(y+9)+'" stroke="'+C.navy+'" stroke-width="2"/>');
  S.box(X(f.q1), y-18, X(f.q3)-X(f.q1), 36, o.boxSt||'alt', {rx:2});
  S.add('<line x1="'+X(f.med)+'" y1="'+(y-18)+'" x2="'+X(f.med)+'" y2="'+(y+18)+'" stroke="'+C.navy+'" stroke-width="3"/>');
  if (o.outliers) o.outliers.forEach(function(v){ S.add('<circle cx="'+X(v)+'" cy="'+y+'" r="5.5" fill="#fff" stroke="'+colorOf(o.outSt)+'" stroke-width="2.5"/>'); });
  if (o.fence!=null){ S.add('<line x1="'+X(o.fence)+'" y1="'+(y-28)+'" x2="'+X(o.fence)+'" y2="'+(base-6)+'" stroke="'+colorOf(o.fenceSt)+'" stroke-width="2" stroke-dasharray="5 3"/>'); S.t(X(o.fence), y-32, o.fenceLab, {fs:12,c:colorOf(o.fenceSt)}); }
  var labs = o.labs || {min:'min '+fmt(f.min), q1:'Q1 '+fmt(f.q1), med:'med '+fmt(f.med), q3:'Q3 '+fmt(f.q3), max:'max '+fmt(f.max)};
  var yl=[y-24,y-38,y-24,y-38];
  ['q1','med','q3'].forEach(function(k,i){ if (labs[k]) { if (labs[k]==='?') S.q(X(f[k]), y-30, 9); else S.t(X(f[k]), k==='med'?y-26:y+34, labs[k], {fs:11.5,c:colorOf(o.labSt&&o.labSt[k])}); } });
  if (labs.min) S.t(X(f.min), y-16, labs.min, {fs:11.5});
  if (labs.max) S.t(X(wl), y-16, labs.max, {fs:11.5});
  if (o.cap) S.t(160,H-6,o.cap,{fs:12.5,c:C.mute,b:false});
  return S.end();
}

/* ── Function machine ── */
function machine(o){
  var W=320, H=o.cap?112:92, S=new SVG(W,H,o.label||'Function machine');
  function node(x,v,lab){ S.t(x+28, 18, lab, {fs:11.5,c:C.mute,b:false}); if (v.s==='?'){ S.box(x,28,56,36,'want'); S.q(x+28,46,10);} else { S.box(x,28,56,36,v.st); S.t(x+28,51,v.s,{fs:14,c:colorOf(v.st),halo:false}); } }
  node(8,o.inp,'input'); node(256,o.out,'output');
  S.add('<rect x="96" y="20" width="128" height="52" rx="10" fill="'+C.navy+'"/>');
  S.t(160,51,o.rule,{fs:o.rule.length>12?12.5:14,c:'#fff',halo:false});
  S.arrow(66,46,94,46,C.navy); S.arrow(226,46,254,46,C.navy);
  if (o.cap) S.t(160,H-8,o.cap,{fs:12.5,c:C.mute,b:false});
  return S.end();
}

/* ── Mapping diagram ── pairs:[[in,out],...] ── */
function mapping(o){
  var W=320, ins=[], outs=[];
  o.pairs.forEach(function(p){ if (ins.indexOf(p[0])<0) ins.push(p[0]); if (outs.indexOf(p[1])<0) outs.push(p[1]); });
  var n=Math.max(ins.length,outs.length), H=60+n*30+(o.cap?20:0), S=new SVG(W,H,o.label||'Mapping diagram');
  S.t(70,16,'input x',{fs:12,c:C.mute,b:false}); S.t(250,16,'output y',{fs:12,c:C.mute,b:false});
  S.add('<ellipse cx="70" cy="'+(36+n*15)+'" rx="40" ry="'+(n*15+12)+'" fill="'+C.navyFill+'" stroke="'+C.navy+'" stroke-width="1.6"/><ellipse cx="250" cy="'+(36+n*15)+'" rx="40" ry="'+(n*15+12)+'" fill="'+C.navyFill+'" stroke="'+C.navy+'" stroke-width="1.6"/>');
  function yy(i,len){ return 36+n*15-(len-1)*15+i*30; }
  o.pairs.forEach(function(p){ var a=ins.indexOf(p[0]), b=outs.indexOf(p[1]); var bad=o.bad&&o.bad.indexOf(p[0])>=0;
    S.arrow(92, yy(a,ins.length), 226, yy(b,outs.length), bad?C.red:C.navy, {w:2}); });
  ins.forEach(function(v,i){ S.t(70, yy(i,ins.length)+5, fmt(v), {fs:14, c:(o.bad&&o.bad.indexOf(v)>=0)?C.red:C.navy}); });
  outs.forEach(function(v,i){ S.t(250, yy(i,outs.length)+5, fmt(v), {fs:14}); });
  if (o.cap) S.t(160,H-6,o.cap,{fs:12.5,c:o.capC||C.mute,b:false});
  return S.end();
}

/* ── Rectangle / triangle with side labels ── */
function shape(o){
  var W=320, H=o.cap?170:148, S=new SVG(W,H,o.label||'Shape'), x=90, y=24, w=140, h=86;
  if (o.kind==='tri'){
    S.add('<polygon points="'+x+','+(y+h)+' '+(x+w)+','+(y+h)+' '+(x+w*0.35)+','+y+'" fill="'+C.navyFill+'" stroke="'+C.navy+'" stroke-width="2.4"/>');
    S.add('<line x1="'+(x+w*0.35)+'" y1="'+y+'" x2="'+(x+w*0.35)+'" y2="'+(y+h)+'" stroke="'+colorOf(o.hSt)+'" stroke-width="2.2" stroke-dasharray="5 3"/>');
    S.add('<path d="M'+(x+w*0.35)+','+(y+h-9)+' h9 v9" fill="none" stroke="'+C.navy+'" stroke-width="1.5"/>');
    if (o.outline) S.add('<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" fill="none" stroke="'+C.mute+'" stroke-width="1.4" stroke-dasharray="4 4"/>');
    cellText(S, x+w/2, y+h+20, o.bottom, 14);
    if (o.h==='?') S.q(x+w*0.35-16, y+h/2, 9); else S.t(x+w*0.35-8, y+h/2+5, o.h, {fs:14,a:'end',c:colorOf(o.hSt)});
    if (o.center) S.t(x+w*0.62, y+h*0.72, o.center, {fs:13});
  } else {
    S.box(x,y,w,h,o.fillSt||null,{rx:2});
    cellText(S, x+w/2, y-7, o.top, 14); cellText(S, x+w/2, y+h+20, o.bottom, 14);
    if (o.left!=null){ if ((o.left.s||o.left)==='?') S.q(x-18,y+h/2,9); else S.t(x-8, y+h/2+5, o.left.s||o.left, {fs:14,a:'end',c:colorOf(o.left.st)}); }
    if (o.right!=null){ if ((o.right.s||o.right)==='?') S.q(x+w+18,y+h/2,9); else S.t(x+w+8, y+h/2+5, o.right.s||o.right, {fs:14,a:'start',c:colorOf(o.right.st)}); }
    cellText(S, x+w/2, y+h/2+6, o.center, 15);
  }
  if (o.cap) S.t(160,H-8,o.cap,{fs:12.5,c:C.mute,b:false});
  return S.end();
}

/* ── Repeated factors for exponent rules ── groups:[{n, lab, st}] ── */
function factors(o){
  var W=320, total=0; o.groups.forEach(function(g){ total+=g.n; });
  var bw=Math.min(28,(W-20-(o.groups.length-1)*14)/total-4), H=o.cap?118:96, S=new SVG(W,H,o.label||'Repeated factors');
  var x=(W-(total*(bw+4)+(o.groups.length-1)*14))/2;
  o.groups.forEach(function(g){
    var gx=x; for (var i=0;i<g.n;i++){ S.box(x,34,bw,28,g.st||'alt',{rx:4}); S.t(x+bw/2,53,o.v||'x',{fs:13,c:colorOf(g.st||'alt'),halo:false,it:true}); x+=bw+4; }
    S.add('<path d="M'+gx+',28 v-5 H'+(x-4)+' v5" fill="none" stroke="'+colorOf(g.st||'alt')+'" stroke-width="1.8"/>');
    S.t((gx+x-4)/2, 16, g.lab, {fs:13,c:colorOf(g.st||'alt')}); x+=14;
  });
  if (o.total){ if (o.total==='?') S.q(160,80,10); else S.t(160,84,o.total,{fs:14,c:colorOf(o.totalSt)}); }
  if (o.cap) S.t(160,H-6,o.cap,{fs:12.5,c:C.mute,b:false});
  return S.end();
}

/* ── Lines of math with marks (stacked work, substitution, elimination) ──
   lines:[{cells:[{s,st,x}], rule:bool, strike:[i..]}] ── */
function work(o){
  var W=320, lh=30, H=o.lines.length*lh+(o.cap?34:14), S=new SVG(W,H,o.label||'Worked steps');
  var cols=o.cols||[60,120,170,215,260];
  o.lines.forEach(function(L,i){
    var y=22+i*lh;
    if (L.rule) { S.add('<line x1="30" y1="'+(y-lh+8)+'" x2="290" y2="'+(y-lh+8)+'" stroke="'+C.navy+'" stroke-width="2"/>'); }
    if (L.tag) S.t(8, y, L.tag, {fs:11.5, a:'start', c:C.mute, b:false});
    L.cells.forEach(function(c,j){ if (c==null||c.s==='') return; var cx = c.x!=null? c.x : cols[j];
      if (c.s==='?') S.q(cx, y-5, 9);
      else S.t(cx, y, c.s, {fs:15, c:colorOf(c.st), halo:false});
      if (c.strike) S.add('<line x1="'+(cx-16)+'" y1="'+(y+3)+'" x2="'+(cx+16)+'" y2="'+(y-13)+'" stroke="'+C.red+'" stroke-width="2"/>');
    });
  });
  if (o.arrow) S.arrow(o.arrow[0],o.arrow[1],o.arrow[2],o.arrow[3],C.royal,{curve:o.arrow[4],w:2});
  if (o.cap) S.t(160,H-8,o.cap,{fs:12.5,c:C.mute,b:false});
  return S.end();
}

/* ── Difference of squares picture ── */
function dsq(o){
  var W=320, H=o.cap?178:156, S=new SVG(W,H,o.label||'Difference of squares'), x=20, y=30, a=104, b=o.b||34;
  S.add('<rect x="'+x+'" y="'+y+'" width="'+a+'" height="'+a+'" fill="'+C.navyFill+'" stroke="'+C.navy+'" stroke-width="2"/>');
  S.add('<rect x="'+(x+a-b)+'" y="'+(y+a-b)+'" width="'+b+'" height="'+b+'" fill="#fff" stroke="'+C.navy+'" stroke-width="1.6" stroke-dasharray="4 3"/>');
  S.t(x+a/2, y-8, o.A, {fs:14}); S.t(x+a-b/2, y+a-b/2+5, o.B, {fs:13,halo:false,c:C.mute});
  S.t(x+(a-b)/2, y+(a-b)/2+5, o.L, {fs:14,halo:false});
  S.arrow(x+a+8, y+a/2, x+a+34, y+a/2, C.navy, {w:2});
  var rx=x+a+42, rw=W-rx-10, rh=a-b, ry=y+b/2+4, st=o.done?'ans':'want';
  S.add('<rect x="'+rx+'" y="'+ry+'" width="'+rw+'" height="'+rh+'" fill="'+fillOf(st)+'" stroke="'+colorOf(st)+'" stroke-width="2"'+(o.done?'':' stroke-dasharray="5 3"')+'/>');
  if (o.done){ S.t(rx+rw/2, ry-8, 'length '+o.top, {fs:13,c:C.green}); S.t(rx+rw/2, ry+rh+18, 'height '+o.side, {fs:13,c:C.green}); S.t(rx+rw/2, ry+rh/2+5, 'same area', {fs:12,c:C.green,halo:false}); }
  else { S.q(rx+rw/2, ry+rh/2, 10); S.t(rx+rw/2, ry+rh+18, 'length × height = ?', {fs:12,c:C.navy}); }
  if (o.cap) S.t(160,H-8,o.cap,{fs:12.5,c:C.mute,b:false});
  return S.end();
}

/* ════════════════════════════════════════════════════════════════════
   ANSWER CHECKER — forgiving about how students type
   ════════════════════════════════════════════════════════════════════ */
var SUP = {'⁰':'0','¹':'1','²':'2','³':'3','⁴':'4','⁵':'5','⁶':'6','⁷':'7','⁸':'8','⁹':'9','ˣ':'x','ⁿ':'n','⁻':'-'};
function norm(s){
  s = String(s).toLowerCase().replace(/[−–—‒]/g,'-').replace(/[×·∙⋅]/g,'*').replace(/÷/g,'/').replace(/[‘’`]/g,"'")
       .replace(/\s+/g,'').replace(/≥|=>/g,'>=').replace(/≤|=</g,'<=').replace(/π/g,'pi').replace(/\*\*/g,'^');
  s = s.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹ˣⁿ⁻]+/g, function(m){ return '^'+(m.length>1?'(':'')+m.split('').map(function(c){return SUP[c];}).join('')+(m.length>1?')':''); });
  s = s.replace(/√/g,'sqrt').replace(/½/g,'(1/2)').replace(/¼/g,'(1/4)').replace(/¾/g,'(3/4)').replace(/[⁄∕]/g,'/');
  return s;
}
function tokenize(s){
  var t=[], i=0, m;
  while (i<s.length){
    var c=s[i];
    if ((m=s.slice(i).match(/^(\d+\.?\d*|\.\d+)/))){ t.push({k:'n',v:parseFloat(m[1])}); i+=m[1].length; continue; }
    if (s.slice(i,i+4)==='sqrt'){ t.push({k:'f',v:'sqrt'}); i+=4; continue; }
    if (s.slice(i,i+2)==='pi'){ t.push({k:'n',v:Math.PI}); i+=2; continue; }
    if (/[a-z]/.test(c)){ t.push({k:'v',v:c}); i++; continue; }
    if ('+-*/^()'.indexOf(c)>=0){ t.push({k:c}); i++; continue; }
    if (c==='[' ){ t.push({k:'('}); i++; continue; } if (c===']'){ t.push({k:')'}); i++; continue; }
    throw new Error('bad char '+c);
  }
  return t;
}
function parseExpr(str){
  var t=tokenize(str), p=0;
  function peek(){ return t[p]; }
  function expr(){ var a=term(); while (peek() && (peek().k==='+'||peek().k==='-')){ var op=t[p++].k, b=term(); a = op==='+'? add(a,b) : sub(a,b); } return a; }
  function add(a,b){ return function(e){return a(e)+b(e);}; } function sub(a,b){ return function(e){return a(e)-b(e);}; }
  function term(){ var a=unary();
    while (peek() && (peek().k==='*'||peek().k==='/'||peek().k==='n'||peek().k==='v'||peek().k==='('||peek().k==='f')){
      var k=peek().k; if (k==='*'||k==='/'){ p++; var b=unary(); a = (function(a,b,k){ return k==='*'? function(e){return a(e)*b(e);} : function(e){return a(e)/b(e);}; })(a,b,k); }
      else { var c=power(); a=(function(a,c){return function(e){return a(e)*c(e);};})(a,c); } }
    return a; }
  function unary(){ if (peek() && peek().k==='-'){ p++; var a=unary(); return function(e){return -a(e);}; } if (peek() && peek().k==='+'){ p++; return unary(); } return power(); }
  function power(){ var a=atom(); if (peek() && peek().k==='^'){ p++; var b=unary(); return function(e){return Math.pow(a(e),b(e));}; } return a; }
  function atom(){ var k=peek(); if (!k) throw new Error('end');
    p++;
    if (k.k==='n') return function(){return k.v;};
    if (k.k==='v') return function(e){ if (!(k.v in e)) return NaN; return e[k.v]; };
    if (k.k==='f'){ var a=power(); return function(e){return Math.sqrt(a(e));}; }
    if (k.k==='('){ var a2=expr(); if (!peek()||peek().k!==')') throw new Error('paren'); p++; return a2; }
    throw new Error('unexpected '+k.k); }
  var f=expr(); if (p<t.length) throw new Error('extra'); return f;
}
function close(a,b){ return isFinite(a) && isFinite(b) && Math.abs(a-b) <= 1e-6*Math.max(1,Math.abs(b)); }
/* units a student may type after a number ("3 hours", "24 square units", "6 m"); spaces are already gone after norm() */
var UNITS_RE = /(squareunits|sq\.?units|units\^2|unit\^2|u\^2|squarefeet|sq\.?ft|ft\^2|squaremeters|sq\.?m|m\^2|units|unit|milesperhour|mph|miles|mile|mi|hours|hour|hrs|hr|h|minutes|mins|min|seconds|secs|sec|s|feet|foot|ft|meters|meter|m|cm|inches|inch|in|dollars|dollar|years|yrs|yr)$/;
function numVal(s){ // a number, possibly typed as "x = 4", "1/2", "sqrt(2)", "$45"
  s = norm(s); var eq=s.split('='); if (eq.length===2 && !/\d/.test(eq[0].replace(/[₀-₉]/g,''))) s=eq[1]; else if (eq.length===2 && /^\(?([a-z]|[a-z]\([a-z0-9]\)|[a-z]_?\d+)\)?$/.test(eq[0])) s=eq[1];
  s = s.replace(/[$%]/g,'').replace(UNITS_RE,'').replace(/^(\d{1,3}),(\d{3})$/,'$1$2');
  if (s==='') return NaN;
  try { return parseExpr(s)({}); } catch(e){ return NaN; }
}
var SAMPLES=[-2.3,-1.1,0.7,1.9,3.2];
function exprFn(s, v){
  s = norm(s);
  var eq = s.split('=');
  if (eq.length===2 && /^([a-z]|[a-z]\([a-z]\)|[a-z]_?[a-z0-9]?)$/.test(eq[0])) s = eq[1];
  else if (eq.length>1) return null;
  try { var f=parseExpr(s); return function(x){ var e={}; e[v||'x']=x; return f(e); }; } catch(e){ return null; }
}
function topLevelSum(s){ s=norm(s).replace(/^[a-z](\([a-z]\))?=/,''); var d=0; for (var i=0;i<s.length;i++){ var c=s[i]; if (c==='(') d++; else if (c===')') d--; else if (d===0 && (c==='+'||(c==='-'&&i>0&&s[i-1]!=='^'&&s[i-1]!=='('&&s[i-1]!=='*'))) return true; } return false; }
function parsePt(s){
  s = norm(s).replace(/x=/,'').replace(/y=/,'').replace(/^\(|\)$/g,'').replace(/;/g,',').replace(/and/,',');
  var parts=s.split(','); if (parts.length!==2) return null;
  var a=numVal(parts[0]), b=numVal(parts[1]); return (isFinite(a)&&isFinite(b))? [a,b] : null;
}
function parseIneq(s, v){
  s = norm(s); v=v||'x';
  var m = s.match(/^\(?(-?inf(?:inity)?|-?∞|[^,]+),(inf(?:inity)?|∞|[^,]+)[\)\]]$/);
  if (/^[\(\[]/.test(s) && m){ var lo=m[1], hi=m[2];
    if (/inf|∞/.test(hi)) return {op: s[0]==='['?'>=':'>', n:numVal(lo)};
    if (/inf|∞/.test(lo)) return {op: s[s.length-1]===']'?'<=':'<', n:numVal(hi)}; return null; }
  m = s.match(/^([a-z])(<=|>=|<|>)(.+)$/);
  if (m && m[1]===v) return {op:m[2], n:numVal(m[3])};
  m = s.match(/^(.+)(<=|>=|<|>)([a-z])$/);
  if (m && m[3]===v){ var flip={'<':'>','>':'<','<=':'>=','>=':'<='}; return {op:flip[m[2]], n:numVal(m[1])}; }
  return null;
}
function parseSet(s){
  s = norm(s).replace(/or|and/g,',').replace(/[a-z]=/g,'').replace(/^\{|\}$/g,'');
  var out=[];
  s.split(',').forEach(function(p){ if (p==='') return;
    var m=p.match(/^(\+-|-\+|±)(.+)$/); if (m){ var v=numVal(m[2]); out.push(v,-v); } else out.push(numVal(p)); });
  return out;
}
/* returns true / false / null (could not read) */
function matches(kind, input, ans, opt){
  opt=opt||{};
  if (String(input).trim()==='') return null;
  if (kind==='num'){ var v=numVal(input); return isFinite(v)? close(v, typeof ans==='number'?ans:numVal(ans)) : null; }
  if (kind==='expr'){
    var f=exprFn(input, opt.v), g=exprFn(ans, opt.v); if (!f) return null;
    var any=false;
    for (var i=0;i<SAMPLES.length;i++){ var a=f(SAMPLES[i]), b=g(SAMPLES[i]); if (!isFinite(a)) return null; if (!close(a,b)) return false; any=true; }
    return any; }
  if (kind==='pt'){ var p=parsePt(input); if (!p) return null; return close(p[0],ans[0]) && close(p[1],ans[1]); }
  if (kind==='ineq'){ var q=parseIneq(input, opt.v); if (!q || !isFinite(q.n)) return null; return q.op===ans.op && close(q.n, ans.n); }
  if (kind==='set'){ var arr=parseSet(input); if (!arr.length || arr.some(function(v){return !isFinite(v);})) return null;
    var uniq=[]; arr.forEach(function(v){ if (!uniq.some(function(u){return close(u,v);})) uniq.push(v); });
    return uniq.length===ans.length && ans.every(function(a){ return uniq.some(function(u){return close(u,a);}); }); }
  if (kind==='word'){ var w=norm(input).replace(/[^a-z]/g,''); return ans.indexOf(w)>=0; }
  return null;
}
if (typeof module!=='undefined') module.exports={matches:matches, numVal:numVal, exprFn:exprFn, parsePt:parsePt, parseIneq:parseIneq, parseSet:parseSet, topLevelSum:topLevelSum, fiveNum:fiveNum, plane:plane, nline:nline};
