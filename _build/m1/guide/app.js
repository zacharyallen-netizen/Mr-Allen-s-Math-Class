/* ════════════════════════════════════════════════════════════════════
   PRACTICE ENGINE — multiple choice, typed answers, find-the-mistake
   ════════════════════════════════════════════════════════════════════ */
function fr(a,b){ return '<span class="fr"><span>'+a+'</span><span>'+b+'</span></span>'; }
var scores = {}, totals = {}, solved = {};
function bump(u){
  scores[u] = (scores[u]||0)+1;
  var e=document.getElementById('sc'+u); if (e) e.textContent=scores[u];
  var t=0; for (var k in scores) t+=scores[k];
  document.getElementById('totalScore').textContent=t;
}
function drawItemViz(card, it, done){
  var box=card.querySelector('.qv .vbox'); if (!box || !it.v) return;
  try { box.innerHTML = it.v(done); } catch(e){ box.textContent=''; if (window.console) console.error(it.id, e); }
  var cap=card.querySelector('.qv figcaption');
  if (cap && it.vcap) cap.innerHTML = (done && it.vcapDone) ? it.vcapDone : it.vcap;
}
function renderItem(it, n){
  var card=document.createElement('div');
  card.className='qc'+(it.type==='err'?' err':'');
  card.id=it.id;
  var h='<div class="qnum">'+(it.type==='err'?'🔍 Find the mistake':'Question '+n+(it.type==='in'?' · type your answer':''))+'</div>';
  h+='<div class="qt">'+it.q+'</div>';
  if (it.v) h+='<figure class="viz qv"><div class="vbox"></div>'+(it.vcap?'<figcaption></figcaption>':'')+'</figure>';
  if (it.type==='mc'){
    h+='<div class="opts">'+it.opts.map(function(o,i){ return '<button type="button" class="ob" data-i="'+i+'">'+o.t+'</button>'; }).join('')+'</div>';
  } else if (it.type==='in'){
    h+='<div class="inrow"><label><span class="pre">'+(it.pre||'Answer:')+'</span> <input type="text" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="'+(it.ph||'')+'" aria-label="Your answer"></label>'+
       '<button type="button" class="btn chk">Check</button><button type="button" class="btn ghost show" hidden>Show answer</button></div>'+
       (it.tip?'<div class="tip">'+it.tip+'</div>':'');
  } else if (it.type==='err'){
    h+='<div class="tip">Tap the step that has the mistake.</div><ol class="esteps">'+it.steps.map(function(s,i){ return '<li><button type="button" class="es" data-i="'+i+'"><span class="sn">Step '+(i+1)+'</span> '+s+'</button></li>'; }).join('')+'</ol>';
  }
  h+='<div class="fb" aria-live="polite"></div>';
  card.innerHTML=h;
  drawItemViz(card, it, false);
  var fb=card.querySelector('.fb');
  function say(cls, html){ fb.className='fb show '+cls; fb.innerHTML=html; }
  function finish(ok){
    if (card.classList.contains('answered')) return;
    card.classList.add('answered');
    if (ok){ solved[it.id]=true; bump(it.u); }
    drawItemViz(card, it, true);
  }
  if (it.type==='mc'){
    card.querySelectorAll('.ob').forEach(function(b){ b.addEventListener('click', function(){
      if (card.classList.contains('answered')) return;
      var i=+b.getAttribute('data-i'), btns=card.querySelectorAll('.ob');
      btns.forEach(function(x){ x.disabled=true; });
      if (i===it.ok){ b.classList.add('correct'); say('c','✓ Correct! '+it.ex); finish(true); }
      else { b.classList.add('wrong'); btns[it.ok].classList.add('reveal');
        say('w','✗ Not quite. '+(it.opts[i].why||'')+' <span class="ans-line">Answer: <strong>'+it.opts[it.ok].t+'</strong>.</span> '+it.ex); finish(false); }
    }); });
  } else if (it.type==='in'){
    var inp=card.querySelector('input'), chk=card.querySelector('.chk'), show=card.querySelector('.show'), tries=0;
    var opt={v:it.var};
    function check(){
      if (card.classList.contains('answered')) return;
      var val=inp.value, r=matches(it.kind, val, it.ans, opt);
      if (r===null){ say('n','🤔 I can’t read that yet. '+(it.fmt||'Type a number, like 4 or −3 or 1/2.')); return; }
      if (r && it.form==='factored' && topLevelSum(val)){ say('n','That has the right value, but it is not factored yet. Write it as a product, like (x + a)(x + b).'); return; }
      if (r && it.form==='expanded' && /\(/.test(val)){ say('n','That has the right value, but multiply it all out — no parentheses in the final answer.'); return; }
      if (r){ inp.readOnly=true; inp.classList.add('ok'); chk.disabled=true; show.hidden=true; say('c','✓ Correct! '+it.ex); finish(true); return; }
      tries++; inp.classList.add('bad');
      var why=null;
      (it.miss||[]).forEach(function(m){ if (!why && matches(it.kind, val, missKey(it,m[0]), opt)===true) why=m[1]; });
      say('w','✗ Not yet. '+(why||it.hint||'Check each step and try again.')+(tries>=2?' <em>You can try again or tap “Show answer”.</em>':' Try again!'));
      if (tries>=2) show.hidden=false;
    }
    chk.addEventListener('click', check);
    inp.addEventListener('keydown', function(e){ if (e.key==='Enter') check(); });
    inp.addEventListener('input', function(){ inp.classList.remove('bad'); });
    show.addEventListener('click', function(){ inp.readOnly=true; chk.disabled=true; show.hidden=true; say('w','The answer is <strong>'+it.show+'</strong>. '+it.ex); finish(false); });
  } else if (it.type==='err'){
    var miss=0;
    card.querySelectorAll('.es').forEach(function(b){ b.addEventListener('click', function(){
      if (card.classList.contains('answered')) return;
      var i=+b.getAttribute('data-i');
      if (i===it.bad){ b.classList.add('mistake'); card.querySelectorAll('.es').forEach(function(x){ x.disabled=true; });
        say('c',(miss===0?'✓ You found it! ':'✓ Yes — that is the mistake. ')+it.why+'<div class="fixw"><strong>Fixed work:</strong> '+it.fix+'</div>'); finish(true); }
      else { miss++; b.classList.add('fine'); b.disabled=true; say('n','Step '+(i+1)+' is correct. '+(it.hint||'Keep looking — check the next step carefully.')); }
    }); });
  }
  return card;
}
/* the key a "miss" entry is compared against: the miss text parsed the same way as an answer */
function missKey(it, s){
  if (it.kind==='num') return numVal(s);
  if (it.kind==='pt') return parsePt(s);
  if (it.kind==='ineq') return parseIneq(s, it.var);
  if (it.kind==='set') return parseSet(s);
  return s;
}

/* ════════════════════════════════════════════════════════════════════
   INTERACTIVE VISUALS
   ════════════════════════════════════════════════════════════════════ */
function lineEq(m,b){
  var s='y = ';
  if (m===0) return s+fmt(b);
  s += (m===1?'':m===-1?'−':fmt(m))+'x';
  if (b>0) s+=' + '+fmt(b); else if (b<0) s+=' − '+fmt(-b);
  return s;
}
function initMB(){
  var box=document.getElementById('mbViz'); if (!box) return;
  var mi=document.getElementById('mSl'), bi=document.getElementById('bSl'), out=document.getElementById('mbOut');
  function draw(){
    var m=+mi.value, b=+bi.value;
    document.getElementById('mVal').textContent=fmt(m); document.getElementById('bVal').textContent=fmt(b);
    var items=[{t:'line',m:m,b:b,lab:lineEq(m,b),lx:m>=0?3.4:-3.4,dy:m>=0?-14:14}];
    if (m!==0) items.push({t:'rise',a:[0,b],b:[1,b+m],st:'want',run:'run 1',rise:'rise '+fmt(m)});
    items.push({t:'pt',x:0,y:b,st:'ans',lab:'b = '+fmt(b),dx:-8,a:'end'});
    box.innerHTML=P({x:[-6,6],y:[-6,6],items:items,label:'Graph of '+lineEq(m,b)});
    out.innerHTML='<strong>'+lineEq(m,b)+'</strong> · slope m = '+fmt(m)+(m>0?' (line goes up ↗)':m<0?' (line goes down ↘)':' (flat line)')+' · y-intercept b = '+fmt(b)+' → crosses the y-axis at (0, '+fmt(b)+').';
  }
  mi.addEventListener('input',draw); bi.addEventListener('input',draw); draw();
}
function autoWin(vals){
  var lo=Math.min.apply(null,vals.concat([0])), hi=Math.max.apply(null,vals.concat([0]));
  lo=Math.floor(lo)-1; hi=Math.ceil(hi)+1;
  var span=hi-lo, step= span<=14?1 : span<=28?2 : span<=70?5 : span<=140?10 : Math.pow(10,Math.ceil(Math.log10(span/14)));
  lo=Math.floor(lo/step)*step; hi=Math.ceil(hi/step)*step;
  return {r:[lo,hi], s:step};
}
function reduceFrac(n,d){ if (d<0){n=-n;d=-d;} function g(a,b){ return b? g(b,a%b) : Math.abs(a); } var k=g(Math.round(n),Math.round(d))||1; return [n/k,d/k]; }
function simpRad(n){ // √n → [outside, inside]
  var o=1, i=n; for (var k=Math.floor(Math.sqrt(n)); k>1; k--){ if (n%(k*k)===0){ o=k; i=n/(k*k); break; } } return [o,i];
}
function twoPointPlane(x1,y1,x2,y2,extra){
  var wx=autoWin([x1,x2]), wy=autoWin([y1,y2]);
  var cols=(wx.r[1]-wx.r[0])/wx.s, rows=(wy.r[1]-wy.r[0])/wy.s, cw=(320-40)/cols, ch=Math.min(cw*1.2, 280/rows);
  return P({x:wx.r,y:wy.r,xs:wx.s,ys:wy.s,ch:ch,items:extra,label:'Points ('+x1+', '+y1+') and ('+x2+', '+y2+')'});
}
function calcSlope() {
  var x1 = parseFloat(document.getElementById('sx1').value);
  var y1 = parseFloat(document.getElementById('sy1').value);
  var x2 = parseFloat(document.getElementById('sx2').value);
  var y2 = parseFloat(document.getElementById('sy2').value);
  var out = document.getElementById('slopeOut'), g=document.getElementById('slopeViz');
  if ([x1,y1,x2,y2].some(isNaN)) { out.textContent = 'Please enter all four numbers.'; return; }
  var pts=[{t:'pt',x:x1,y:y1,lab:'('+fmt(x1)+', '+fmt(y1)+')'},{t:'pt',x:x2,y:y2,lab:'('+fmt(x2)+', '+fmt(y2)+')',dx:-8,a:'end'}];
  if (x2 === x1) { out.innerHTML = 'Δx = 0 → vertical line — slope is <strong>undefined</strong>.'; g.innerHTML=twoPointPlane(x1,y1,x2,y2,[{t:'seg',a:[x1,y1],b:[x2,y2]}].concat(pts)); return; }
  var dy = y2 - y1, dx = x2 - x1, m = dy / dx, mTxt;
  if (Number.isInteger(dy) && Number.isInteger(dx)){ var f=reduceFrac(dy,dx); mTxt = f[1]===1? fmt(f[0]) : fmt(f[0])+'/'+f[1]+' ≈ '+fmt(Math.round(m*1000)/1000); }
  else mTxt = fmt(Math.round(m*1000)/1000);
  out.innerHTML = 'rise Δy = '+fmt(y2)+' − '+(y1<0?'('+fmt(y1)+')':fmt(y1))+' = '+fmt(dy)+', run Δx = '+fmt(x2)+' − '+(x1<0?'('+fmt(x1)+')':fmt(x1))+' = '+fmt(dx)+' → slope m = <strong>' + mTxt + '</strong>';
  g.innerHTML=twoPointPlane(x1,y1,x2,y2,[{t:'seg',a:[x1,y1],b:[x2,y2]},{t:'rise',a:[x1,y1],b:[x2,y2],st:'ans',run:'run '+fmt(dx),rise:'rise '+fmt(dy)}].concat(pts));
}
function initGrowth(){
  var box=document.getElementById('abViz'); if (!box) return;
  var ai=document.getElementById('aSl'), bi=document.getElementById('gbSl'), out=document.getElementById('abOut');
  function draw(){
    var a=+ai.value, b=+bi.value; document.getElementById('aVal').textContent=fmt(a); document.getElementById('gbVal').textContent=fmt(b);
    var f=function(x){return a*Math.pow(b,x);};
    var items=[{t:'fn',f:f,lab:'y = '+fmt(a)+'('+fmt(b)+')ˣ',lx:b>=1?1.2:-1.6,dy:-14},{t:'pt',x:0,y:a,st:'ans',lab:'(0, '+fmt(a)+')',dx:8}];
    [1,2,3].forEach(function(x){ var y=f(x); if (y<=20) items.push({t:'pt',x:x,y:y,r:4}); });
    box.innerHTML=P({x:[-3,4],y:[0,20],ys:2,ly:4,ch:13,items:items,label:'Graph of y = '+a+'('+b+')^x'});
    var kind = b>1?'<strong>growth</strong> (b &gt; 1): each step multiplies by '+fmt(b)+' and the graph rises' : b<1?'<strong>decay</strong> (0 &lt; b &lt; 1): each step multiplies by '+fmt(b)+' and the graph falls' : '<strong>constant</strong> (b = 1): multiplying by 1 changes nothing';
    out.innerHTML='Start a = '+fmt(a)+' · '+kind+'. Values: '+[0,1,2,3].map(function(x){ return 'x = '+x+' → '+fmt(Math.round(f(x)*100)/100); }).join(', ')+'.';
  }
  ai.addEventListener('input',draw); bi.addEventListener('input',draw); draw();
}
function initVertex(){
  var box=document.getElementById('vxViz'); if (!box) return;
  var A=document.getElementById('vaSl'), Hh=document.getElementById('vhSl'), K=document.getElementById('vkSl'), out=document.getElementById('vxOut');
  function draw(){
    var a=+A.value, h=+Hh.value, k=+K.value;
    document.getElementById('vaVal').textContent=fmt(a); document.getElementById('vhVal').textContent=fmt(h); document.getElementById('vkVal').textContent=fmt(k);
    var eq='y = '+(a===1?'':a===-1?'−':fmt(a))+(h===0?'x²':'(x '+(h>0?'− '+fmt(h):'+ '+fmt(-h))+')²')+(k>0?' + '+fmt(k):k<0?' − '+fmt(-k):'');
    if (a===0){ box.innerHTML=P({x:[-6,6],y:[-8,8],ch:20,items:[{t:'line',m:0,b:k,lab:'y = '+fmt(k)}]}); out.innerHTML='When a = 0 there is no x² term, so it is a flat line — not a parabola. Move a away from 0.'; return; }
    var items=[{t:'vline',x:h,st:'want',lab:'axis x = '+fmt(h),dy:14},{t:'fn',f:function(x){return a*(x-h)*(x-h)+k;},lab:eq,lx:h+(h>1?-2.2:2.2),dy:a>0?-12:14},{t:'pt',x:h,y:k,st:'ans',lab:'vertex ('+fmt(h)+', '+fmt(k)+')',dx:8,dy:a>0?16:-10}];
    box.innerHTML=P({x:[-6,6],y:[-8,8],ch:20,ly:2,items:items,label:'Parabola '+eq});
    out.innerHTML='<strong>'+eq+'</strong> · opens <strong>'+(a>0?'up':'down')+'</strong> (a '+(a>0?'&gt;':'&lt;')+' 0) · vertex ('+fmt(h)+', '+fmt(k)+') is the '+(a>0?'minimum':'maximum')+' · axis of symmetry x = '+fmt(h)+' · range: y '+(a>0?'≥':'≤')+' '+fmt(k)+(Math.abs(a)>1?' · |a| &gt; 1 makes it narrower':Math.abs(a)<1?' · |a| &lt; 1 makes it wider':'');
  }
  [A,Hh,K].forEach(function(e){ e.addEventListener('input',draw); }); draw();
}
/* Midpoint & distance: the calculator AND draggable points share one picture */
var geomPlane=null, dragIdx=-1;
function geomVals(){ return ['mx1','my1','mx2','my2'].map(function(id){ return parseFloat(document.getElementById(id).value); }); }
function calcGeom() {
  var v=geomVals(), x1=v[0], y1=v[1], x2=v[2], y2=v[3];
  var out = document.getElementById('geomOut');
  if ([x1,y1,x2,y2].some(isNaN)) { out.textContent = 'Please enter all four numbers.'; return; }
  var mx = (x1 + x2) / 2, my = (y1 + y2) / 2, dx = x2 - x1, dy = y2 - y1, d2 = dx*dx + dy*dy, d = Math.sqrt(d2);
  var dTxt;
  if (Math.abs(d-Math.round(d))<1e-9) dTxt = fmt(Math.round(d));
  else if (Number.isInteger(d2)){ var r=simpRad(d2); dTxt = '√' + d2 + (r[0]>1?' = '+r[0]+'√'+r[1]:'') + ' ≈ ' + d.toFixed(2); }
  else dTxt = d.toFixed(2);
  var pn=function(v){ return v<0? '('+fmt(v)+')' : fmt(v); };
  out.innerHTML = 'Midpoint = ((' + fmt(x1) + ' + ' + pn(x2) + ') ÷ 2, (' + fmt(y1) + ' + ' + pn(y2) + ') ÷ 2) = <strong>(' + fmt(mx) + ', ' + fmt(my) + ')</strong><br>'
                + 'Distance = √(' + pn(dx) + '² + ' + pn(dy) + '²) = <strong>' + dTxt + '</strong>';
  var box=document.getElementById('geomViz'); if (!box) return;
  var lo=Math.min(-2,x1-1,x2-1,y1-1,y2-1), hi=Math.max(10,x1+1,x2+1,y1+1,y2+1);
  lo=Math.max(lo,-12); hi=Math.min(hi,14);
  var items=[{t:'seg',a:[x1,y1],b:[x2,y2]}];
  if (dx!==0 && dy!==0) items.push({t:'rise',a:[x1,y1],b:[x2,y2],st:'want',run:'Δx = '+fmt(dx),rise:'Δy = '+fmt(dy)});
  items.push({t:'pt',x:x1,y:y1,r:8,lab:'A('+fmt(x1)+', '+fmt(y1)+')',dx:-10,a:'end'},{t:'pt',x:x2,y:y2,r:8,lab:'B('+fmt(x2)+', '+fmt(y2)+')',dx:10},{t:'pt',x:mx,y:my,st:'ans',lab:'M('+fmt(mx)+', '+fmt(my)+')',dx:10,dy:14});
  var span=hi-lo, s= span>16?2:1;
  geomPlane=plane({x:[lo,hi],y:[lo,hi],xs:s,ys:s,items:items,label:'Midpoint and distance picture'});
  box.innerHTML=geomPlane.svg;
}
function initDrag(){
  var box=document.getElementById('geomViz'); if (!box) return;
  function toData(e){ var svg=box.querySelector('svg'); if (!svg||!geomPlane) return null; var pt=svg.createSVGPoint(); pt.x=e.clientX; pt.y=e.clientY; var p=pt.matrixTransform(svg.getScreenCTM().inverse()); return [geomPlane.IX(p.x), geomPlane.IY(p.y), p.x, p.y]; }
  box.addEventListener('pointerdown', function(e){
    var p=toData(e); if (!p) return; var v=geomVals();
    var dA=Math.hypot(geomPlane.X(v[0])-p[2], geomPlane.Y(v[1])-p[3]), dB=Math.hypot(geomPlane.X(v[2])-p[2], geomPlane.Y(v[3])-p[3]);
    var best = dA<=dB? 0 : 1, dist=Math.min(dA,dB);
    if (dist>28) return;
    dragIdx=best; box.setPointerCapture(e.pointerId); e.preventDefault();
  });
  box.addEventListener('pointermove', function(e){
    if (dragIdx<0) return; var p=toData(e); if (!p) return;
    var x=Math.round(p[0]), y=Math.round(p[1]); x=Math.max(-12,Math.min(14,x)); y=Math.max(-12,Math.min(14,y));
    var ids = dragIdx===0? ['mx1','my1'] : ['mx2','my2'];
    var ex=document.getElementById(ids[0]), ey=document.getElementById(ids[1]);
    if (+ex.value!==x || +ey.value!==y){ ex.value=x; ey.value=y; calcGeom(); }
  });
  function up(){ dragIdx=-1; }
  box.addEventListener('pointerup', up); box.addEventListener('pointercancel', up);
  ['mx1','my1','mx2','my2'].forEach(function(id){ document.getElementById(id).addEventListener('change', calcGeom); });
  calcGeom();
}

/* ════════════════════════════════════════════════════════════════════
   START UP
   ════════════════════════════════════════════════════════════════════ */
function startGuide(){
  document.querySelectorAll('figure.viz[data-v]').forEach(function(f){
    var k=f.getAttribute('data-v'), box=f.querySelector('.vbox');
    try { box.innerHTML = VIZ[k](); } catch(e){ if (window.console) console.error('viz '+k, e); }
  });
  var all=0;
  document.querySelectorAll('.cp-list').forEach(function(list){
    var ids=list.getAttribute('data-items').split(','), n=+(list.getAttribute('data-start')||1);
    ids.forEach(function(id){ var it=ITEMS[id.trim()]; if (!it) { if (window.console) console.error('missing item', id); return; }
      list.appendChild(renderItem(it, it.type==='err'? 0 : n));
      if (it.type!=='err') n++;
      totals[it.u]=(totals[it.u]||0)+1; all++; });
  });
  for (var u in totals){ var t=document.getElementById('tot'+u); if (t) t.textContent=totals[u]; }
  document.getElementById('totalMax').textContent=all;
  var tag=document.getElementById('tagCount'); if (tag) tag.textContent=all+' self-checking questions';
  initMB(); calcSlope(); initGrowth(); initVertex(); initDrag();
  // underline the unit you are reading in the slim U1–U8 row
  if ('IntersectionObserver' in window){
    var links={}; document.querySelectorAll('.sb-local a[href^="#u"]').forEach(function(a){ links[a.getAttribute('href').slice(1)]=a; });
    var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if (e.isIntersecting){ for (var k in links) links[k].classList.remove('active'); if (links[e.target.id]) links[e.target.id].classList.add('active'); } }); }, {rootMargin:'-40% 0px -55% 0px'});
    document.querySelectorAll('section.unit').forEach(function(s){ io.observe(s); });
  }
}
if (document.readyState==='loading') document.addEventListener('DOMContentLoaded', startGuide); else startGuide();
