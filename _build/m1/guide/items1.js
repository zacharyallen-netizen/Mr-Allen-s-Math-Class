/* ════════════════════════════════════════════════════════════════════
   CONTENT — notes visuals (VIZ) and practice items (ITEMS), Units 1–4
   Every number in a picture comes from the problem it sits next to.
   ════════════════════════════════════════════════════════════════════ */
var VIZ = {}, ITEMS = {};
function add(it){ ITEMS[it.id]=it; }
function X_(n,st){ var a=[]; for (var i=0;i<n;i++) a.push({k:'x',s:'x',st:st}); return a; }
function solvedOr(s, val, st){ return s? {s:val, st:st||'ans'} : {s:'?'}; }

/* extra picture types used below */
function pctBar(o){ // 100% + r% = (100 + r)% → b
  var W=320, H=o.cap?132:112, S=new SVG(W,H,o.label||'Percent bar'), x0=14, full=230, ext=Math.max(16, full*o.r);
  S.box(x0,30,full,32,null,{rx:3}); S.t(x0+full/2,51,o.base,{fs:13,halo:false});
  S.box(x0+full+2,30,ext,32,o.st||'want',{rx:3}); S.t(x0+full+2+ext/2,22,o.add,{fs:12.5,c:colorOf(o.st||'want')});
  if (o.total==='?') S.q(x0+(full+ext)/2,86,10); else S.t(x0+(full+ext)/2,92,o.total,{fs:14,c:C.green});
  S.add('<path d="M'+x0+',68 v6 H'+(x0+full+2+ext)+' v-6" fill="none" stroke="'+colorOf(o.total==='?'?'want':'ans')+'" stroke-width="2"/>');
  if (o.cap) S.t(160,H-8,o.cap,{fs:12.5,c:C.mute,b:false});
  return S.end();
}
function foil(o){ // arcs F O I L for (x + a)(x + b)
  var W=320, H=210, S=new SVG(W,H,'FOIL arrows for (x + '+o.a+')(x + '+o.b+')');
  var xs={x1:70, a:120, x2:200, b:250}, y=80;
  S.t(40,y,'(',{fs:24,halo:false}); S.t(xs.x1,y,'x',{fs:24,c:C.navy,halo:false,it:true}); S.t(95,y,'+',{fs:22,halo:false}); S.t(xs.a,y,String(o.a),{fs:24,c:C.royal,halo:false});
  S.t(158,y,')(',{fs:24,halo:false}); S.t(xs.x2,y,'x',{fs:24,c:C.navy,halo:false,it:true}); S.t(225,y,'+',{fs:22,halo:false}); S.t(xs.b,y,String(o.b),{fs:24,c:C.royal,halo:false}); S.t(275,y,')',{fs:24,halo:false});
  function arc(p,q,up,lab,depth){ var yy= up? y-24 : y+10, cy= up? yy-depth : yy+depth, apex=(yy+cy)/2, m=(p+q)/2;
    S.arrow(p,yy,q,yy,C.gold,{curve:[m,cy],w:2.2}); S.t(m, up? apex-5 : apex+15, lab, {fs:13,c:C.navy}); }
  arc(xs.x1,xs.x2-5,true,'F',44); arc(xs.a,xs.b-5,true,'L',22); arc(xs.x1,xs.b+4,false,'O',52); arc(xs.a,xs.x2+4,false,'I',24);
  S.add('<line x1="16" y1="150" x2="304" y2="150" stroke="'+C.navy+'" stroke-width="1.5"/>');
  S.t(20,172,'F: x · x = x²',{fs:13,a:'start'}); S.t(170,172,'O: x · '+o.b+' = '+o.b+'x',{fs:13,a:'start'});
  S.t(20,196,'I: '+o.a+' · x = '+o.a+'x',{fs:13,a:'start'}); S.t(170,196,'L: '+o.a+' · '+o.b+' = '+(o.a*o.b),{fs:13,a:'start'});
  return S.end();
}

/* ─────────────────────────── UNIT 1 ─────────────────────────── */
VIZ.u1_bal = function(){ return balance({left:X_(3).concat([{k:'n',s:'5'}]), right:[{k:'n',s:'20'}], cap:'3x + 5 = 20', label:'Balance: three x blocks and 5 on the left, 20 on the right'}); };
VIZ.u1_undo = function(){ return flow({rows:[
  {title:'Build:', nodes:[{s:'x'},{s:'3x'},{s:'20'}], ops:['× 3','+ 5']},
  {title:'Undo:', nodes:[{s:'20'},{s:'15',st:'ans'},{s:'5',st:'ans'}], ops:['− 5','÷ 3'], c:'ans'}], label:'Undo map for 3x + 5 = 20'}); };
VIZ.u1_bar15 = function(){ return barModel({total:'3x = 15', parts:3, part:'x = 5', partSt:'ans', label:'Bar model 3x = 15'}); };
VIZ.u1_flip = function(){ return nline({min:-6,max:6,step:1,lab:1,rows:[
  {title:'2 < 5  (2 is to the left)', items:[{t:'dot',v:2,lab:'2'},{t:'dot',v:5,lab:'5'}]},
  {title:'× (−1):  −2 > −5  (order flips!)', items:[{t:'dot',v:-2,st:'ans',lab:'−2'},{t:'dot',v:-5,st:'ans',lab:'−5'}]}], label:'Multiplying by −1 reverses order on the number line'}); };
VIZ.u1_neg2x = function(){ return nline({min:-7,max:1,items:[{t:'ray',v:-3,dir:-1,open:true,st:'ans',lab:'x < −3'}], label:'Number line: x < −3, open circle at −3, shaded left'}); };
VIZ.u1_2x3 = function(){ return nline({min:0,max:8,items:[{t:'ray',v:4,dir:1,open:true,st:'ans',lab:'x > 4'}], label:'Number line: x > 4'}); };
VIZ.u1_rect = function(){ return shape({top:{s:'l = 24 ÷ 4 = 6',st:'ans'}, left:'w = 4', center:'A = 24', label:'Rectangle with area 24 and width 4'}); };
VIZ.u1_dist = function(){ return barModel({total:'d = 120 miles', parts:3, part:'40 mi', partSt:'ans', label:'Bar model distance 120 at 40 per hour'}); };
VIZ.u1_fac = function(){ return factors({groups:[{n:3,lab:'x³'},{n:4,lab:'x⁴'}], total:'3 + 4 = 7 factors → x⁷', totalSt:'ans', label:'x cubed times x to the fourth'}); };
VIZ.u1_pow = function(){ return factors({groups:[{n:2,lab:'x²'},{n:2,lab:'x²'},{n:2,lab:'x²'}], total:'3 groups of 2 → x⁶', totalSt:'ans', label:'x squared, cubed'}); };

add({id:'u1e1',u:1,type:'err',q:'Sam solved <b>2(x + 4) = 18</b>.',steps:['2x + 4 = 18','2x = 14','x = 7'],bad:0,
  why:'The 2 must multiply <b>both</b> terms inside the parentheses: 2 · x and 2 · 4. So 2(x + 4) = 2x + 8.',
  fix:'2x + 8 = 18 → 2x = 10 → x = 5. Check: 2(5 + 4) = 2 · 9 = 18 ✓',
  v:function(s){ return areaModel({rows:['2'],cols:['x','4'],cells:[[{s:'2x'}, s?{s:'8',st:'ans'}:'?']],cap:'2(x + 4) = 2x + '+(s?'8':'?'),label:'Area model 2 times (x + 4)'}); }});
add({id:'u1e2',u:1,type:'err',q:'Ana solved <b>−3x + 4 ≥ 13</b>.',steps:['Subtract 4: −3x ≥ 9','Divide by −3: x ≥ −3','Answer: x ≥ −3'],bad:1,
  why:'She divided by a <b>negative</b> number, so the sign must flip: ≥ becomes ≤.', fix:'−3x ≥ 9 → x ≤ −3. Check x = −4: −3(−4) + 4 = 16 ≥ 13 ✓',
  hint:'Watch what happens to the inequality sign.',
  v:function(s){ return nline({min:-7,max:2,items:[s?{t:'ray',v:-3,dir:-1,st:'ans',lab:'x ≤ −3'}:{t:'ray',v:-3,dir:1,st:'bad',lab:'Ana: x ≥ −3'}],label:'Number line for the inequality'}); },
  vcap:'Ana’s graph (red). Is it right?', vcapDone:'Correct graph: closed dot at −3, shade left.'});
add({id:'u1e3',u:1,type:'err',q:'Lee solved the triangle formula <b>A = ½bh</b> for <b>h</b>.',steps:['Multiply both sides by 2: 2A = bh','Subtract b from both sides: h = 2A − b'],bad:1,
  why:'b is <b>multiplied</b> by h. To undo multiplying, <b>divide</b> by b.', fix:'h = 2A ÷ b, which is the same as h = '+fr('2A','b'),
  v:function(s){ return shape({kind:'tri',bottom:'b',h:s?'h':'?',hSt:s?'ans':'want',outline:true,center:'A',cap:s?'h = 2A ÷ b':'A = ½ · b · h',label:'Triangle with base b and height h'}); }});
add({id:'u1e4',u:1,type:'err',q:'Kai simplified <b>x² · x⁵</b>.',steps:['Same base x, so use an exponent rule','Multiply the exponents: 2 · 5 = 10','Answer: x¹⁰'],bad:1,
  why:'When you <b>multiply</b> powers with the same base, <b>add</b> the exponents. Count the x’s: 2 + 5 = 7.', fix:'x² · x⁵ = x⁷',
  v:function(s){ return factors({groups:[{n:2,lab:'x²'},{n:5,lab:'x⁵'}],total:s?'2 + 5 = 7 → x⁷':'?',totalSt:'ans',label:'Repeated factors x squared times x to the fifth'}); }});

add({id:'u1q1',u:1,type:'mc',q:'Solve: <b>4x − 7 = 17</b>',opts:[
  {t:'x = 6'},{t:'x = 10',why:'Check it: 4(10) − 7 = 33, not 17.'},{t:'x = 2.5',why:'It looks like you did 17 − 7. To undo “− 7”, <b>add</b> 7.'},{t:'x = 4',why:'Check it: 4(4) − 7 = 9, not 17.'}],ok:0,
  ex:'Add 7 → 4x = 24. Divide by 4 → <strong>x = 6</strong>. Check: 4(6) − 7 = 17 ✓',
  v:function(s){ return flow({rows:[{title:'Build:',nodes:[{s:'x'},{s:'4x'},{s:'17'}],ops:['× 4','− 7']},{title:'Undo:',nodes:[{s:'17'},solvedOr(s,'24'),solvedOr(s,'6')],ops:['+ 7','÷ 4'],c:s?'ans':null}],label:'Undo map for 4x − 7 = 17'}); }});
add({id:'u1q2',u:1,type:'mc',q:'Solve: <b>−3x ≥ 12</b> &nbsp;(don’t forget the flip!)',opts:[
  {t:'x ≥ −4',why:'Good division, but you forgot to flip. Dividing by −3 turns ≥ into ≤.'},{t:'x ≤ −4'},{t:'x ≥ 4',why:'12 ÷ (−3) = −4, not 4. And the sign must flip.'},{t:'x ≤ 4',why:'You flipped the sign — good! But 12 ÷ (−3) = −4.'}],ok:1,
  ex:'Divide by −3 — the sign flips because we divided by a negative. <strong>x ≤ −4</strong>. Check x = −5: −3(−5) = 15 ≥ 12 ✓',
  v:function(s){ return nline({min:-8,max:2,items:s?[{t:'ray',v:-4,dir:-1,st:'ans',lab:'x ≤ −4'}]:[{t:'dot',v:-5,lab:'test −5'},{t:'dot',v:0,lab:'test 0'}],label:'Number line for −3x ≥ 12'}); },
  vcap:'Test a point: does it make −3x ≥ 12 true?', vcapDone:'Closed dot at −4 (≤ includes −4), shade left.'});
add({id:'u1q3',u:1,type:'mc',q:'Rearrange <b>P = 2l + 2w</b> to solve for <b>w</b>.',opts:[
  {t:'w = P − 2l',why:'You subtracted 2l — good — but the w still has a 2 in front. Divide by 2.'},{t:'w = (P − 2l) / 2'},{t:'w = (P − l) / 2',why:'Subtract the whole 2l, not just l.'},{t:'w = 2P − 2l',why:'Multiplying P by 2 does not undo anything here. Subtract 2l, then divide by 2.'}],ok:1,
  ex:'Subtract 2l from both sides → P − 2l = 2w. Divide by 2 → <strong>w = (P − 2l) / 2</strong>. (This is the same as P/2 − l.)',
  v:function(s){ return shape({top:'l',bottom:'l',left:{s:'w',st:s?'ans':'want'},right:{s:'w',st:s?'ans':'want'},center:s?{s:'w = (P − 2l) ÷ 2',st:'ans'}:{s:'P = l + w + l + w'},label:'Rectangle with length l and width w'}); }});
add({id:'u1q4',u:1,type:'in',q:'Solve: <b>5x − 3 = 22</b>',kind:'num',ans:5,pre:'x =',ph:'e.g. 4',show:'x = 5',
  miss:[['3.8','It looks like you subtracted 3. To undo “− 3”, <b>add</b> 3: 5x = 25.'],['25','You found 5x = 25 — nice! Now divide both sides by 5.'],['4.4','22 ÷ 5 skips a step. First add 3 to both sides.']],
  hint:'Undo the − 3 first (add 3). Then undo × 5 (divide by 5).', ex:'5x − 3 = 22 → 5x = 25 → x = 5. Check: 5(5) − 3 = 22 ✓',
  v:function(s){ return flow({rows:[{title:'Build:',nodes:[{s:'x'},{s:'5x'},{s:'22'}],ops:['× 5','− 3']},{title:'Undo:',nodes:[{s:'22'},solvedOr(s,'25'),solvedOr(s,'5')],ops:['+ 3','÷ 5'],c:s?'ans':null}],label:'Undo map for 5x − 3 = 22'}); }});
add({id:'u1q5',u:1,type:'in',q:'Solve: <b>4x − 5 &lt; 7</b>. Type an inequality like x &lt; 2.',kind:'ineq',ans:{op:'<',n:3},pre:'',ph:'x < …',show:'x &lt; 3',fmt:'Type an inequality, like x < 2 or x >= -1.',
  miss:[['x>3','The sign only flips when you multiply or divide by a <b>negative</b>. Here you divide by +4, so keep &lt;.'],['x<0.5','To undo “− 5”, add 5: 4x &lt; 12.'],['x<=3','Keep the same kind of sign: the problem uses &lt;, not ≤.']],
  hint:'Add 5 to both sides. Then divide by 4. No flip — 4 is positive.', ex:'4x − 5 &lt; 7 → 4x &lt; 12 → <strong>x &lt; 3</strong>. Open circle at 3, shade left.',
  v:function(s){ return nline({min:-2,max:7,items:s?[{t:'ray',v:3,dir:-1,open:true,st:'ans',lab:'x < 3'}]:[{t:'dot',v:0,lab:'test 0'},{t:'dot',v:5,lab:'test 5'}],label:'Number line for 4x − 5 < 7'}); },
  vcap:'Test points: try x = 0 and x = 5 in 4x − 5 < 7.', vcapDone:'Open circle (3 is not included), shade left.'});
add({id:'u1q6',u:1,type:'in',q:'Solve: <b>−2x + 1 ≤ 9</b>',kind:'ineq',ans:{op:'>=',n:-4},pre:'',ph:'x … ',show:'x ≥ −4',fmt:'Type an inequality, like x >= -2 or x ≥ −2.',
  miss:[['x<=-4','You divided by −2, so the sign must <b>flip</b>: ≤ becomes ≥.'],['x>=-5','Subtract 1 first: −2x ≤ 8. Then divide by −2.'],['x<=-5','Subtract 1 first (−2x ≤ 8), then divide by −2 and flip.'],['x>=4','8 ÷ (−2) = −4. Keep the negative.']],
  hint:'Subtract 1, then divide by −2. Dividing by a negative flips the sign.', ex:'−2x + 1 ≤ 9 → −2x ≤ 8 → <strong>x ≥ −4</strong> (flipped!). Closed dot at −4, shade right.',
  v:function(s){ return nline({min:-7,max:2,items:s?[{t:'ray',v:-4,dir:1,st:'ans',lab:'x ≥ −4'}]:[{t:'dot',v:-6,lab:'test −6'},{t:'dot',v:0,lab:'test 0'}],label:'Number line for −2x + 1 ≤ 9'}); },
  vcap:'Test points: try x = −6 and x = 0.', vcapDone:'Closed dot (−4 is included), shade right.'});
add({id:'u1q7',u:1,type:'in',q:'Simplify: <b>x³ · x⁶</b> &nbsp;(type x^9 for x⁹)',kind:'expr',ans:'x^9',pre:'',ph:'x^…',show:'x⁹',fmt:'Type a power like x^5.',
  miss:[['x^18','You multiplied the exponents. When you multiply powers with the same base, <b>add</b> them: 3 + 6.'],['x^3','Count every x: 3 of them, then 6 more.']],
  hint:'Count the x’s: x³ has 3 and x⁶ has 6.', ex:'x³ · x⁶ = x<sup>3 + 6</sup> = <strong>x⁹</strong>',
  v:function(s){ return factors({groups:[{n:3,lab:'x³'},{n:6,lab:'x⁶'}],total:s?'3 + 6 = 9 → x⁹':'?',totalSt:'ans',label:'x cubed times x to the sixth'}); }});
add({id:'u1q8',u:1,type:'in',q:'Use <b>d = rt</b>. A car drives d = 150 miles at r = 50 miles per hour. Solve for t. How many hours?',kind:'num',ans:3,pre:'t =',ph:'hours',show:'t = 3 hours',
  miss:[['7500','You multiplied. Since d = r · t, undo “× r” by <b>dividing</b>: t = d ÷ r.'],['100','Subtracting does not undo multiplying. Divide: t = 150 ÷ 50.'],['1/3','Flip it: t = d ÷ r = 150 ÷ 50.']],
  hint:'t = d ÷ r. Divide 150 by 50.', ex:'d = rt → t = d ÷ r = 150 ÷ 50 = <strong>3 hours</strong>.',
  v:function(s){ return s? barModel({total:'d = 150 miles',parts:3,part:'50 mi',partSt:'ans',cap:'3 hours of 50 miles each',label:'Bar model 150 miles at 50 per hour'}) : barModel({total:'d = 150 miles',parts:1,part:'?',cap:'How many 50-mile hours fit in 150 miles?',label:'Bar model 150 miles'}); }});

/* ─────────────────────────── UNIT 2 ─────────────────────────── */
VIZ.u2_machine = function(){ return machine({inp:{s:'4'},rule:'f(x) = 2x + 1',out:{s:'9',st:'ans'},cap:'f(4) = 2(4) + 1 = 9',label:'Function machine f of 4'}); };
VIZ.u2_fpts = function(){ var it=[{t:'line',m:2,b:1,from:-0.5,to:4.5,w:2,dash:true}]; for (var x=0;x<=3;x++) it.push({t:'pt',x:x,y:2*x+1,lab:'('+x+', '+(2*x+1)+')',dx:x===0?8:-8,a:x===0?'start':'end',dy:x===0?4:-9}); it.push({t:'pt',x:4,y:9,st:'ans',lab:'f(4) = 9',dx:-8,a:'end'});
  return P({x:[-1,5],y:[-1,10],ch:22,ly:2,items:it,label:'Points of f(x) = 2x + 1'}); };
VIZ.u2_map = function(){ return mapping({pairs:[[1,3],[2,5],[3,7]],cap:'Function ✓ — each input has ONE output',label:'Mapping that is a function'})+mapping({pairs:[[1,3],[2,5],[2,6],[3,7]],bad:[2],cap:'Not a function ✗ — input 2 has two outputs',capC:C.red,label:'Mapping that is not a function'}); };
VIZ.u2_line = function(){ return P({x:[-4,4],y:[-4,7],ch:24,items:[{t:'line',m:2,b:1,lab:'y = 2x + 1',lx:2.4,dx:-46,dy:-4},{t:'rise',a:[0,1],b:[1,3],st:'want',run:'run 1',rise:'rise 2'},{t:'pt',x:0,y:1,st:'ans',lab:'b = 1',dx:-8,a:'end'}],label:'Graph of y = 2x + 1 with slope triangle'}); };
VIZ.u2_slope = function(){ return P({x:[0,6],y:[0,12],ch:20,ly:2,items:[{t:'seg',a:[1,3],b:[5,11]},{t:'rise',a:[1,3],b:[5,11],st:'ans',run:'run = 4',rise:'rise = 8'},{t:'pt',x:1,y:3,lab:'(1, 3)'},{t:'pt',x:5,y:11,lab:'(5, 11)',dx:-8,a:'end'}],label:'Slope between (1, 3) and (5, 11)'}); };
VIZ.u2_roc = function(){ return P({x:[0,8],y:[0,20],ys:2,ly:4,ch:22,xl:'x',yl:'f(x)',items:[{t:'seg',a:[2,5],b:[6,17]},{t:'rise',a:[2,5],b:[6,17],st:'ans',run:'Δx = 4',rise:'Δy = 12'},{t:'pt',x:2,y:5,lab:'(2, 5)',dx:-8,a:'end'},{t:'pt',x:6,y:17,lab:'(6, 17)',dx:-8,a:'end'}],label:'Average rate of change from (2,5) to (6,17)'}); };
VIZ.u2_domain = function(){ return P({x:[-4,5],y:[-5,9],ch:18,items:[{t:'seg',a:[-2,-3],b:[3,7]},{t:'pt',x:-2,y:-3,lab:'(−2, −3)',dx:-8,a:'end'},{t:'pt',x:3,y:7,lab:'(3, 7)'},{t:'xbr',a:-2,b:3,st:'ans',lab:'domain −2 ≤ x ≤ 3',dy:34},{t:'ybr',a:-3,b:7,st:'want',lab:'range −3 ≤ y ≤ 7',dx:-10}],label:'Domain and range of a line segment'}); };

add({id:'u2e1',u:2,type:'err',q:'Maya found <b>f(−2)</b> for <b>f(x) = 3x − 2</b>.',steps:['f(−2) = 3(−2) − 2','= 6 − 2','= 4'],bad:1,
  why:'3 · (−2) = <b>−6</b>. A positive times a negative is negative.', fix:'f(−2) = −6 − 2 = −8',
  v:function(s){ return machine({inp:{s:'−2'},rule:'f(x) = 3x − 2',out:s?{s:'−8',st:'ans'}:{s:'4',st:'bad'},cap:s?'f(−2) = −8':'Maya’s output: 4. Is it right?',label:'Function machine f of −2'}); }});
add({id:'u2e2',u:2,type:'err',q:'Leo found the slope through <b>(1, 4)</b> and <b>(3, 10)</b>.',steps:['m = (3 − 1) ÷ (10 − 4)','= 2 ÷ 6','= 1/3'],bad:0,
  why:'Slope is <b>rise over run</b>: change in y on top, change in x on the bottom. Leo had it upside down.', fix:'m = (10 − 4) ÷ (3 − 1) = 6 ÷ 2 = 3',
  v:function(s){ return P({x:[0,4],y:[0,12],ch:18,ly:2,items:[{t:'seg',a:[1,4],b:[3,10]},{t:'rise',a:[1,4],b:[3,10],st:s?'ans':'want',run:s?'run 2':'run ?',rise:s?'rise 6':'rise ?'},{t:'pt',x:1,y:4,lab:'(1, 4)',dx:-8,a:'end'},{t:'pt',x:3,y:10,lab:'(3, 10)',dx:-8,a:'end'}],label:'Slope triangle for (1,4) and (3,10)'}); }});
add({id:'u2e3',u:2,type:'err',q:'Zoe wrote the equation of a line with <b>slope 4</b> and <b>y-intercept −2</b>.',steps:['m = 4 and b = −2','Use y = mx + b','y = −2x + 4'],bad:2,
  why:'m goes in front of x. b is the number added at the end. Zoe swapped them.', fix:'y = 4x − 2',
  v:function(s){ return P({x:[-3,3],y:[-6,6],ch:16,ly:2,items:s?[{t:'line',m:4,b:-2,st:'ans',lab:'y = 4x − 2',lx:1.5,dx:-40},{t:'pt',x:0,y:-2,st:'ans',lab:'(0, −2)',dx:8}]:[{t:'line',m:-2,b:4,st:'bad',lab:'Zoe: y = −2x + 4',lx:1.5,dx:6,dy:-14},{t:'pt',x:0,y:-2,lab:'b should be −2',dx:8}],label:'Line with slope 4 and intercept −2'}); }});

add({id:'u2q1',u:2,type:'mc',q:'What is the slope of the line through <b>(2, 1)</b> and <b>(6, 9)</b>?',opts:[
  {t:fr(1,2),why:'You put run over rise. Slope = rise ÷ run = 8 ÷ 4.'},{t:'2'},{t:'4',why:'4 is the run (6 − 2). Divide the rise by it.'},{t:'8',why:'8 is the rise (9 − 1). Now divide by the run, 4.'}],ok:1,
  ex:'m = (9 − 1) ÷ (6 − 2) = 8 ÷ 4 = <strong>2</strong>.',
  v:function(s){ return P({x:[0,7],y:[0,10],ch:22,ly:2,items:[{t:'seg',a:[2,1],b:[6,9]},{t:'rise',a:[2,1],b:[6,9],st:s?'ans':'want',run:s?'run 4':'run ?',rise:s?'rise 8':'rise ?'},{t:'pt',x:2,y:1,lab:'(2, 1)',dx:-8,a:'end'},{t:'pt',x:6,y:9,lab:'(6, 9)',dx:-8,a:'end'}],label:'Points (2,1) and (6,9)'}); }});
add({id:'u2q2',u:2,type:'mc',q:'In <b>y = 5x − 4</b>, what is the y-intercept?',opts:[
  {t:'5',why:'5 is the slope m — the number in front of x.'},{t:'−4'},{t:'4',why:'Keep the sign: “− 4” means b = −4.'},{t:'−5',why:'The y-intercept is the number added on (b), not the slope.'}],ok:1,
  ex:'In y = mx + b, b is the y-intercept. Here b = <strong>−4</strong>, so the line crosses the y-axis at (0, −4).',
  v:function(s){ return P({x:[-3,3],y:[-6,6],ch:16,ly:2,items:s?[{t:'line',m:5,b:-4,st:'ans',lab:'y = 5x − 4',lx:1.6,dx:-44},{t:'pt',x:0,y:-4,st:'ans',lab:'(0, −4)',dx:-8,a:'end'}]:[{t:'pt',x:1,y:1,lab:'x = 1 → y = 1'},{t:'pt',x:2,y:6,lab:'x = 2 → y = 6',dx:-8,a:'end'},{t:'q',x:-2.6,y:-4.5,lab:'crosses y-axis at ?'}],label:'Finding the y-intercept of y = 5x − 4'}); },
  vcap:'Two points on the line. Where will it cross the y-axis (x = 0)?'});
add({id:'u2q3',u:2,type:'mc',q:'Write the equation of a line with slope <b>−2</b> passing through <b>(0, 3)</b>.',opts:[
  {t:'y = 2x + 3',why:'The slope is −2, so keep the negative sign on m.'},{t:'y = −2x − 3',why:'The line passes through (0, 3), so b = +3.'},{t:'y = −2x + 3'},{t:'y = 3x − 2',why:'m and b got swapped. m = −2 goes with x.'}],ok:2,
  ex:'Slope-intercept form: y = mx + b. m = −2, b = 3 → <strong>y = −2x + 3</strong>.',
  v:function(s){ var it=[{t:'rise',a:[0,3],b:[1,1],st:'want',run:'right 1',rise:'down 2'},{t:'pt',x:0,y:3,lab:'(0, 3)',dx:-10,a:'end',dy:6}]; if (s) it.unshift({t:'line',m:-2,b:3,st:'ans',lab:'y = −2x + 3',lx:-1.2,dx:10,dy:-4});
    return P({x:[-3,4],y:[-4,7],ch:20,items:it,label:'Line through (0,3) with slope −2'}); }});
add({id:'u2q4',u:2,type:'in',q:'<b>f(x) = 4x − 3</b>. Find <b>f(5)</b>.',kind:'num',ans:17,pre:'f(5) =',ph:'number',show:'17',
  miss:[['20','4 · 5 = 20 — good start. Now finish: subtract 3.'],['23','f(x) has “− 3”, so subtract 3. Do not add.'],['2','Put 5 in for x: f(5) = 4(5) − 3.'],['42','Multiply 4 by 5 (do not write 4 and 5 side by side): 4 · 5 = 20.']],
  hint:'Replace x with 5: f(5) = 4(5) − 3.', ex:'f(5) = 4(5) − 3 = 20 − 3 = <strong>17</strong>.',
  v:function(s){ return machine({inp:{s:'5'},rule:'f(x) = 4x − 3',out:s?{s:'17',st:'ans'}:{s:'?'},label:'Function machine f of 5'}); }});
add({id:'u2q5',u:2,type:'in',q:'Find the slope through <b>(−1, 2)</b> and <b>(3, −6)</b>.',kind:'num',ans:-2,pre:'m =',ph:'e.g. -3 or 1/2',show:'−2',
  miss:[['2','Check the sign. y goes down (2 → −6), so the slope is negative.'],['-1/2','You put run over rise. Slope = (change in y) ÷ (change in x).'],['-4','The run is 3 − (−1) = 4, not 2. Subtracting a negative adds.'],['4','The run is 3 − (−1) = 4, and the rise is −8.']],
  hint:'rise = −6 − 2 = −8. run = 3 − (−1) = 4. Divide rise by run.', ex:'m = (−6 − 2) ÷ (3 − (−1)) = −8 ÷ 4 = <strong>−2</strong>.',
  v:function(s){ return P({x:[-3,4],y:[-7,4],ch:18,items:[{t:'seg',a:[-1,2],b:[3,-6]},{t:'rise',a:[-1,2],b:[3,-6],st:s?'ans':'want',run:s?'run 4':'run ?',rise:s?'rise −8':'rise ?'},{t:'pt',x:-1,y:2,lab:'(−1, 2)',dx:-8,a:'end'},{t:'pt',x:3,y:-6,lab:'(3, −6)',dx:-8,a:'end'}],label:'Points (−1,2) and (3,−6)'}); }});
add({id:'u2q6',u:2,type:'in',q:'Write the equation: slope <b>'+fr(1,2)+'</b>, y-intercept <b>−1</b>. (Type 1/2x − 1 or 0.5x − 1.)',kind:'expr',ans:'0.5x-1',pre:'y =',ph:'mx + b',show:'y = ½x − 1',fmt:'Type an equation like y = 2x + 1 (use 1/2 for one-half).',
  miss:[['-x+0.5','You swapped m and b. m = ½ goes in front of x.'],['0.5x+1','b is −1, so the equation ends with “− 1”.'],['2x-1','The slope is one-half, not 2. Type 1/2x or 0.5x.']],
  hint:'Use y = mx + b with m = ½ and b = −1.', ex:'y = mx + b → <strong>y = ½x − 1</strong>.',
  v:function(s){ var it=[{t:'rise',a:[0,-1],b:[2,0],st:'want',run:'right 2',rise:'up 1'},{t:'pt',x:0,y:-1,lab:'b = −1',dx:-8,a:'end'}]; if (s) it.unshift({t:'line',m:0.5,b:-1,st:'ans',lab:'y = ½x − 1',lx:-2,dy:-14});
    return P({x:[-4,4],y:[-4,3],ch:26,items:it,label:'Line with slope one half and intercept −1'}); }});
add({id:'u2q7',u:2,type:'in',q:'<b>f(1) = 4</b> and <b>f(5) = 16</b>. Find the average rate of change from x = 1 to x = 5.',kind:'num',ans:3,pre:'rate =',ph:'number',show:'3',
  miss:[['12','12 is the change in y. Divide by the change in x (5 − 1 = 4).'],['1/3','Flip it: change in y ÷ change in x.'],['4','4 is the change in x. Divide the change in y (12) by it.']],
  hint:'Rate of change = (16 − 4) ÷ (5 − 1).', ex:'(16 − 4) ÷ (5 − 1) = 12 ÷ 4 = <strong>3</strong>. The output grows 3 for every 1 step in x.',
  v:function(s){ return P({x:[0,6],y:[0,18],ys:2,ly:4,ch:20,xl:'x',yl:'f(x)',items:[{t:'seg',a:[1,4],b:[5,16]},{t:'rise',a:[1,4],b:[5,16],st:s?'ans':'want',run:s?'Δx = 4':'Δx = ?',rise:s?'Δy = 12':'Δy = ?'},{t:'pt',x:1,y:4,lab:'(1, 4)',dx:-8,a:'end'},{t:'pt',x:5,y:16,lab:'(5, 16)',dx:-8,a:'end'}],label:'Average rate of change from (1,4) to (5,16)'}); }});

/* ─────────────────────────── UNIT 3 ─────────────────────────── */
VIZ.u3_two = function(){ return P({x:[-3,4],y:[-2,6],ch:28,items:[{t:'line',m:1,b:1,lab:'y = x + 1',lx:2.6,dx:-34},{t:'line',m:-1,b:3,st:'alt',lab:'y = −x + 3',lx:-1.6,dx:24,dy:-6},{t:'pt',x:1,y:2,st:'ans',r:6.5,lab:'(1, 2) ✓',dx:12,dy:6}],label:'Lines y = x + 1 and y = −x + 3 meet at (1, 2)'}); };
VIZ.u3_one = function(){ return P({w:240,x:[-3,3],y:[-3,3],items:[{t:'line',m:1,b:0},{t:'line',m:-1,b:2,st:'alt'},{t:'pt',x:1,y:1,st:'ans',lab:'1 point',dx:10}],label:'Lines cross once'}); };
VIZ.u3_none = function(){ return P({w:240,x:[-3,3],y:[-3,3],items:[{t:'line',m:1,b:1},{t:'line',m:1,b:-2,st:'alt'},{t:'text',x:1.6,y:-2.4,s:'never meet',pill:true,st:'bad'}],label:'Parallel lines never meet'}); };
VIZ.u3_inf = function(){ return P({w:240,x:[-3,3],y:[-3,3],items:[{t:'line',m:1,b:-1,w:7},{t:'line',m:1,b:-1,st:'alt',dash:true,w:3},{t:'text',x:-1.2,y:2,s:'same line',pill:true,st:'ans'}],label:'Same line, infinitely many solutions'}); };
VIZ.u3_sub = function(){ return P({x:[-1,5],y:[-1,8],ch:26,items:[{t:'line',m:2,b:0,lab:'y = 2x',lx:1,dx:-30,dy:-4},{t:'line',m:1,b:3,st:'alt',lab:'y = x + 3',lx:0.5,dx:-10,dy:-14},{t:'pt',x:3,y:6,st:'ans',r:6.5,lab:'(3, 6)',dx:10,dy:14}],label:'y = 2x and y = x + 3 meet at (3, 6)'}); };
VIZ.u3_subw = function(){ return work({lines:[{cells:[{s:'y = 2x',x:80},{s:'y = x + 3',x:230}]},{cells:[{s:'↓ swap y for 2x',x:160,st:'alt'}]},{cells:[{s:'2x = x + 3',x:160,st:'want'}]},{cells:[{s:'x = 3,  y = 2(3) = 6',x:160,st:'ans'}]}],label:'Substitution steps'}); };
VIZ.u3_elim = function(){ return work({cols:[70,120,170,215,250],lines:[{cells:[{s:'x'},{s:'+ y',strike:true},{s:'='},{s:'10'}]},{cells:[{s:'x'},{s:'− y',strike:true},{s:'='},{s:'4'}],tag:'+'},{rule:true,cells:[{s:'2x',st:'ans'},{s:'0',st:'mute'},{s:'='},{s:'14',st:'ans'}]}],cap:'+y and −y add to 0, so y is eliminated',label:'Elimination: add the equations'}); };
VIZ.u3_elimg = function(){ return P({x:[-1,10],y:[-1,11],ch:20,ly:2,items:[{t:'line',m:-1,b:10,lab:'x + y = 10',lx:2,dx:6},{t:'line',m:1,b:-4,st:'alt',lab:'x − y = 4',lx:5.2,dx:-56,dy:-4},{t:'pt',x:7,y:3,st:'ans',r:6.5,lab:'(7, 3)',dx:10,dy:14}],label:'x + y = 10 and x − y = 4 meet at (7, 3)'}); };
VIZ.u3_ineq = function(){ return P({x:[-4,4],y:[-4,4],items:[{t:'shade',f:function(x){return x-1;},side:'above',c:'alt'},{t:'line',m:1,b:-1,dash:true,lab:'y = x − 1',lx:2.5,dx:8,dy:16},{t:'pt',x:0,y:0,st:'ans',lab:'test (0, 0) ✓',dx:-8,a:'end',dy:-10}],label:'Shaded region y > x − 1 with dashed boundary'}); };

add({id:'u3e1',u:3,type:'err',q:'Ben solved <b>y = x + 1</b> and <b>2x + y = 10</b> by substitution.',steps:['2x + (x + 1) = 10','3x + 1 = 10','3x = 11','x = 11/3'],bad:2,
  why:'To undo “+ 1”, <b>subtract</b> 1 from both sides: 10 − 1 = 9, not 11.', fix:'3x = 9 → x = 3 → y = 3 + 1 = 4. Solution (3, 4). Check: 2(3) + 4 = 10 ✓',
  v:function(s){ return P({x:[-1,6],y:[-1,11],ch:20,ly:2,items:[{t:'line',m:1,b:1,lab:'y = x + 1',lx:5,dx:-30,dy:-10},{t:'line',m:-2,b:10,st:'alt',lab:'2x + y = 10',lx:1,dx:10,dy:-2},s?{t:'pt',x:3,y:4,st:'ans',lab:'(3, 4)',dx:10,dy:14}:{t:'q',x:3,y:4,lab:'x = 11/3?',dy:20}],label:'Lines y = x + 1 and 2x + y = 10'}); }});
add({id:'u3e2',u:3,type:'err',q:'Jada solved <b>x + y = 10</b> and <b>x − y = 4</b> by elimination.',steps:['Add the equations: 2x = 14','x = 7','Plug in: 7 + y = 10','y = 17'],bad:3,
  why:'To undo “+ 7”, <b>subtract</b> 7: y = 10 − 7 = 3.', fix:'Solution (7, 3). Check: 7 − 3 = 4 ✓',
  v:function(s){ return P({x:[-1,10],y:[-1,11],ch:20,ly:2,items:[{t:'line',m:-1,b:10},{t:'line',m:1,b:-4,st:'alt'},s?{t:'pt',x:7,y:3,st:'ans',lab:'(7, 3)',dx:10,dy:14}:{t:'q',x:7,y:3,lab:'y = 17?',dy:-16}],label:'Lines x + y = 10 and x − y = 4'}); },
  vcap:'Where do the lines really cross?'});
add({id:'u3e3',u:3,type:'err',q:'Ray graphed <b>y ≥ 2x + 1</b>.',steps:['Draw the boundary y = 2x + 1 as a dashed line','Test (0, 0): 0 ≥ 1 is false','Shade the side without (0, 0)'],bad:0,
  why:'≥ means “greater than <b>or equal to</b>”, so points on the line count. Use a <b>solid</b> line. Dashed is only for &lt; or &gt;.', fix:'Solid line, then shade above it (away from (0, 0)).',
  v:function(s){ return P({x:[-4,4],y:[-4,6],ch:24,items:[{t:'shade',f:function(x){return 2*x+1;},side:'above',c:s?'ans':'alt'},{t:'line',m:2,b:1,dash:!s,st:s?'ans':'bad',lab:s?'solid: y = 2x + 1':'dashed?',lx:-2,dx:-8,dy:16},{t:'pt',x:0,y:0,lab:'(0, 0)',dx:8,dy:14}],label:'Graph of y ≥ 2x + 1'}); }});

function sysPlane(s, l1, l2, sol, win, extra){
  var it=[{t:'line',m:l1.m,b:l1.b,lab:l1.lab,lx:l1.lx,dx:l1.dx,dy:l1.dy,from:s?null:l1.from,to:s?null:l1.to},{t:'line',m:l2.m,b:l2.b,st:'alt',lab:l2.lab,lx:l2.lx,dx:l2.dx,dy:l2.dy,from:s?null:l2.from,to:s?null:l2.to}];
  if (s) it.push({t:'pt',x:sol[0],y:sol[1],st:'ans',r:6.5,lab:'('+fmt(sol[0])+', '+fmt(sol[1])+')',dx:10,dy:14});
  return P({x:win.x,y:win.y,ch:win.ch,ly:win.ly,items:it.concat(extra||[]),label:'System of two lines'});
}
add({id:'u3q1',u:3,type:'mc',q:'Solve the system: <b>y = 2x</b> and <b>y = x + 3</b>',opts:[
  {t:'(3, 6)'},{t:'(1, 4)',why:'Check it: 2(1) = 2, not 4. The point must work in <b>both</b> equations.'},{t:'(6, 3)',why:'Right numbers, wrong order. Points are (x, y): x = 3, y = 6.'},{t:'(2, 5)',why:'Check it: 2(2) = 4, not 5.'}],ok:0,
  ex:'2x = x + 3 → x = 3 → y = 6. Solution: <strong>(3, 6)</strong>.',
  v:function(s){ return sysPlane(s,{m:2,b:0,lab:'y = 2x',lx:0.6,dx:-24,dy:-6,from:-1,to:1.4},{m:1,b:3,lab:'y = x + 3',lx:0,dx:8,dy:-14,from:-1,to:1.4},[3,6],{x:[-1,5],y:[-1,8],ch:24}); },
  vcap:'The lines are drawn part of the way. Where will they meet?', vcapDone:'They meet at (3, 6).'});
add({id:'u3q2',u:3,type:'mc',q:'Solve by elimination: <b>x + y = 7</b> and <b>x − y = 1</b>',opts:[
  {t:'(3, 4)',why:'Check: 3 − 4 = −1, not 1. Order matters: (x, y).'},{t:'(4, 3)'},{t:'(7, 1)',why:'Those are the numbers on the right side. Add the equations: 2x = 8.'},{t:'(2, 5)',why:'Check: 2 − 5 = −3, not 1.'}],ok:1,
  ex:'Add the equations: 2x = 8 → x = 4. Then 4 + y = 7 → y = 3. Solution: <strong>(4, 3)</strong>.',
  v:function(s){ return sysPlane(s,{m:-1,b:7,lab:'x + y = 7',lx:1,dx:12,dy:-2,from:-1,to:2},{m:1,b:-1,lab:'x − y = 1',lx:1.5,dx:12,dy:16,from:-1,to:2},[4,3],{x:[-1,8],y:[-2,8],ch:24}); },
  vcap:'Part of each line. Where will they meet?', vcapDone:'They meet at (4, 3).'});
add({id:'u3q3',u:3,type:'mc',q:'Two lines are parallel (different y-intercepts). How many solutions does the system have?',opts:[
  {t:'Exactly one',why:'Lines that cross once have one solution — but parallel lines never cross.'},{t:'No solution'},{t:'Infinitely many',why:'That happens when both equations make the <b>same</b> line.'},{t:'Two',why:'Two straight lines can never cross twice.'}],ok:1,
  ex:'Parallel lines never intersect → <strong>no solution</strong>.',
  v:function(s){ return P({x:[-3,3],y:[-4,4],ch:22,items:[{t:'line',m:2,b:1,lab:'y = 2x + 1',lx:-1.6,dx:-6,dy:-4},{t:'line',m:2,b:-2,st:'alt',lab:'y = 2x − 2',lx:1.2,dx:10,dy:14},s?{t:'text',x:1.6,y:-3.2,s:'never meet → no solution',pill:true,st:'ans'}:{t:'q',x:2,y:-3,lab:'meet?',dx:-14,a:'end'}],label:'Two parallel lines'}); }});
add({id:'u3q4',u:3,type:'in',q:'Solve: <b>y = x + 2</b> and <b>y = −x + 6</b>. Type the point (x, y).',kind:'pt',ans:[2,4],pre:'',ph:'(x, y)',show:'(2, 4)',fmt:'Type a point like (3, -2).',
  miss:[['(4,2)','Right numbers, wrong order. Write (x, y): x first.'],['(2,0)','x = 2 is right. Now find y: y = 2 + 2.'],['(-2,0)','Check: x + 2 = −x + 6 → 2x = 4 → x = 2.']],
  hint:'Set them equal: x + 2 = −x + 6. Solve for x. Then find y.', ex:'x + 2 = −x + 6 → 2x = 4 → x = 2 → y = 4. <strong>(2, 4)</strong>',
  v:function(s){ return sysPlane(s,{m:1,b:2,lab:'y = x + 2',lx:-0.5,dx:-12,dy:-10,from:-2,to:0.5},{m:-1,b:6,lab:'y = −x + 6',lx:4,dx:-10,dy:-12,from:3.5,to:6},[2,4],{x:[-2,6],y:[-1,7],ch:24}); },
  vcap:'Part of each line. Where will they meet?'});
add({id:'u3q5',u:3,type:'in',q:'Solve by elimination: <b>2x + y = 9</b> and <b>x − y = 3</b>',kind:'pt',ans:[4,1],pre:'',ph:'(x, y)',show:'(4, 1)',fmt:'Type a point like (3, -2).',
  miss:[['(1,4)','Swap them: x = 4, y = 1.'],['(4,-1)','Check the second equation: 4 − (−1) = 5, not 3.'],['(3,3)','Add the equations: 3x = 12.']],
  hint:'Add the two equations: the y’s cancel. 3x = 12.', ex:'Add: 3x = 12 → x = 4. Then 4 − y = 3 → y = 1. <strong>(4, 1)</strong>. Check: 2(4) + 1 = 9 ✓',
  v:function(s){ return work({cols:[70,120,170,215,250],lines:[{cells:[{s:'2x'},{s:'+ y',strike:true},{s:'='},{s:'9'}]},{cells:[{s:'x'},{s:'− y',strike:true},{s:'='},{s:'3'}],tag:'+'},{rule:true,cells:[{s:'3x',st:s?'ans':null},{s:'0'},{s:'='},s?{s:'12',st:'ans'}:{s:'?'}]}],cap:s?'3x = 12 → x = 4, then y = 1':'Add the columns. The y’s cancel.',label:'Elimination for 2x + y = 9 and x − y = 3'}); }});
add({id:'u3q6',u:3,type:'mc',q:'Is <b>(0, 0)</b> a solution of <b>y &gt; 2x − 3</b>?',opts:[{t:'Yes'},{t:'No',why:'Plug it in: 0 &gt; 2(0) − 3 means 0 &gt; −3. That is true.'}],ok:0,
  ex:'Test it: 0 &gt; 2(0) − 3 → 0 &gt; −3 ✓. So (0, 0) is in the shaded region.',
  v:function(s){ var it=[{t:'line',m:2,b:-3,dash:true,lab:'y = 2x − 3',lx:2.6,dx:-50,dy:4},{t:'pt',x:0,y:0,st:s?'ans':null,lab:s?'(0, 0) ✓':'(0, 0)?',dx:-8,a:'end'}]; if (s) it.unshift({t:'shade',f:function(x){return 2*x-3;},side:'above',c:'ans'});
    return P({x:[-4,4],y:[-5,4],ch:22,items:it,label:'Test point for y > 2x − 3'}); }});

/* ─────────────────────────── UNIT 4 ─────────────────────────── */
VIZ.u4_arith = function(){ return hops({terms:[{s:'3'},{s:'7'},{s:'11'},{s:'15'}],ops:['+4'],idx:['a₁','a₂','a₃','a₄'],cap:'add the same amount each time: d = 4',label:'Arithmetic sequence 3, 7, 11, 15'}); };
VIZ.u4_a10 = function(){ var it=[]; for (var n=1;n<=10;n++) it.push(n<10?{t:'pt',x:n,y:3+4*(n-1),r:4.5}:{t:'pt',x:10,y:39,st:'ans',lab:'a₁₀ = 39',dx:-8,a:'end'}); it.unshift({t:'line',m:4,b:-1,from:1,to:10,w:1.5,dash:true});
  return P({x:[0,11],y:[0,44],ys:4,ly:8,ch:20,xl:'n',yl:'aₙ',items:it,label:'Arithmetic sequence graph up to a10'}); };
VIZ.u4_geo = function(){ return hops({terms:[{s:'2'},{s:'6'},{s:'18'},{s:'54'}],ops:['×3'],idx:['a₁','a₂','a₃','a₄'],cap:'multiply by the same number each time: r = 3',label:'Geometric sequence 2, 6, 18, 54'}); };
VIZ.u4_a5 = function(){ return bars({vals:[{v:2,s:'2'},{v:6,s:'6'},{v:18,s:'18'},{v:54,s:'54'},{v:162,s:'162',st:'ans'}],labs:['a₁','a₂','a₃','a₄','a₅'],ops:['×3','×3','×3','×3'],label:'Geometric sequence bars up to a5'}); };
VIZ.u4_gd = function(){ return P({x:[-3,3],y:[0,8],ch:26,items:[{t:'fn',f:function(x){return Math.pow(2,x);}},{t:'fn',f:function(x){return Math.pow(0.5,x);},st:'alt'},{t:'text',x:2.85,y:5.6,s:'y = 2ˣ (growth)',a:'end',pill:true},{t:'text',x:-2.85,y:6.8,s:'y = (½)ˣ (decay)',a:'start',pill:true,st:'alt'},{t:'pt',x:0,y:1,st:'ans',lab:'(0, 1)',dx:8,dy:-10}],label:'Growth y = 2^x and decay y = (1/2)^x'}); };
VIZ.u4_100 = function(){ return bars({vals:[{v:100,s:'100'},{v:200,s:'200'},{v:400,s:'400'},{v:800,s:'800',st:'ans'}],labs:['x = 0','x = 1','x = 2','x = 3'],ops:['×2','×2','×2'],label:'100 doubled three times'}); };
VIZ.u4_pct = function(){ return pctBar({r:0.04,base:'100% = $500',add:'+4%',total:'104% → b = 1.04',cap:'y = 500(1.04)ˣ',label:'Percent growth bar 4 percent'}); };
VIZ.u4_linexp = function(){ var it=[{t:'fn',f:function(x){return 3*x+1;},from:0,to:5,lab:'y = 3x + 1 (adds 3)',lx:2,dx:10,dy:24},{t:'fn',f:function(x){return Math.pow(2,x);},from:0,to:5,st:'alt',lab:'y = 2ˣ (×2)',lx:4.6,dx:-50,dy:-6}];
  for (var x=0;x<=5;x++){ it.push({t:'pt',x:x,y:3*x+1,r:4}); it.push({t:'pt',x:x,y:Math.pow(2,x),st:'alt',r:4}); }
  return P({x:[0,5],y:[0,32],ys:4,ly:8,ch:24,items:it,label:'Linear y = 3x + 1 versus exponential y = 2^x'}); };

add({id:'u4e1',u:4,type:'err',q:'Ty found <b>a₁₀</b> for 3, 7, 11, 15, …',steps:['d = 4','a₁₀ = 3 + 10 · 4','a₁₀ = 43'],bad:1,
  why:'From a₁ to a₁₀ there are only <b>9</b> jumps. Use aₙ = a₁ + (n − 1)d.', fix:'a₁₀ = 3 + 9 · 4 = 39',
  v:function(s){ var it=[{t:'dot',v:3,lab:'a₁ = 3'}]; if (s){ for (var k=0;k<9;k++) it.push({t:'hop',a:3+4*k,b:7+4*k,st:'alt'}); it.push({t:'dot',v:39,st:'ans',lab:'a₁₀ = 39'}); } else it.push({t:'dot',v:43,st:'bad',lab:'Ty: 43'});
    return nline({min:0,max:44,step:1,lab:4,items:it,label:'Jumps of 4 from 3'}); },
  vcap:'Count the jumps from a₁ to a₁₀.', vcapDone:'9 jumps of +4 land on 39.'});
add({id:'u4e2',u:4,type:'err',q:'Mia found <b>a₅</b> for 2, 6, 18, 54, …',steps:['r = 3','a₅ = 2 · 3⁵','a₅ = 486'],bad:1,
  why:'a₅ is <b>4</b> jumps after a₁, so the exponent is n − 1 = 4.', fix:'a₅ = 2 · 3⁴ = 2 · 81 = 162',
  v:function(s){ return bars({vals:[{v:2,s:'2'},{v:6,s:'6'},{v:18,s:'18'},{v:54,s:'54'},s?{v:162,s:'162',st:'ans'}:{s:'?'}],labs:['a₁','a₂','a₃','a₄','a₅'],ops:['×3','×3','×3','×3'],max:162,label:'Geometric sequence to a5'}); }});
add({id:'u4e3',u:4,type:'err',q:'Eli evaluated <b>y = 2(4)ˣ</b> when x = 2.',steps:['2 · 4 = 8','8² = 64','y = 64'],bad:0,
  why:'Exponents come <b>before</b> multiplying (order of operations). Square the 4 first: 4² = 16.', fix:'y = 2 · 4² = 2 · 16 = 32',
  v:function(s){ return bars({vals:[{v:2,s:'2'},{v:8,s:'8'},s?{v:32,s:'32',st:'ans'}:{s:'?'}],labs:['x = 0','x = 1','x = 2'],ops:['×4','×4'],max:32,label:'2 times 4 to the x'}); }});

add({id:'u4q1',u:4,type:'mc',q:'Is <b>y = 3(0.7)ˣ</b> growth or decay?',opts:[
  {t:'Growth (b &gt; 1)',why:'0.7 is less than 1. Multiplying by 0.7 makes things smaller.'},{t:'Decay (b &lt; 1)'},{t:'Linear',why:'Linear adds the same amount. Here we multiply by 0.7 each time.'},{t:'Constant',why:'A constant never changes. Here the output changes each step.'}],ok:1,
  ex:'b = 0.7 is between 0 and 1 → <strong>decay</strong>. The output shrinks as x grows.',
  v:function(s){ var it=[{t:'dot',v:0.7,lab:'b = 0.7'},{t:'text',v:1,s:'1',dy:-18}]; if (s){ it.unshift({t:'seg',a:0,b:1,st:'ans'}); it.push({t:'text',v:0.45,s:'decay',dy:-36,st:'ans'}); it.push({t:'text',v:1.55,s:'growth',dy:-36}); } else it.push({t:'q',v:1.5});
    return nline({min:0,max:2,step:0.1,lab:0.5,items:it,label:'Where is b = 0.7 compared with 1?'}); },
  vcap:'Is b above or below 1?'});
add({id:'u4q2',u:4,type:'mc',q:'Find y when x = 2 in <b>y = 5(3)ˣ</b>.',opts:[
  {t:'15',why:'15 is y when x = 1. Multiply by 3 one more time.'},{t:'30',why:'The 2 is an exponent, not a factor. Use 3² = 9.'},{t:'45'},{t:'75',why:'Square only the 3: 3² = 9. Then 5 · 9.'}],ok:2,
  ex:'3² = 9. Then 5 · 9 = <strong>45</strong>.',
  v:function(s){ return bars({vals:[{v:5,s:'5'},s?{v:15,s:'15',st:'ans'}:{s:'?'},s?{v:45,s:'45',st:'ans'}:{s:'?'}],labs:['x = 0','x = 1','x = 2'],ops:['×3','×3'],max:45,label:'5 times 3 to the x'}); }});
add({id:'u4q3',u:4,type:'mc',q:'What is the initial value (when x = 0) of <b>y = 12(2)ˣ</b>?',opts:[
  {t:'2',why:'2 is the multiplier b. The starting value is a.'},{t:'12'},{t:'24',why:'24 is the value at x = 1. At x = 0, 2⁰ = 1.'},{t:'0',why:'Any number to the 0 power is 1, not 0. So y = 12 · 1.'}],ok:1,
  ex:'When x = 0, b⁰ = 1, so y = a · 1 = a. Initial value = <strong>12</strong>.',
  v:function(s){ var it=[{t:'pt',x:1,y:24,lab:'(1, 24)',dx:-8,a:'end'},{t:'pt',x:2,y:48,lab:'(2, 48)',dx:-8,a:'end'}]; if (s){ it.unshift({t:'fn',f:function(x){return 12*Math.pow(2,x);},st:'ans',from:-1,to:2.1}); it.push({t:'pt',x:0,y:12,st:'ans',lab:'(0, 12)',dx:8,dy:-6}); } else it.push({t:'q',x:-1,y:40,lab:'y at x = 0?',dx:14});
    return P({x:[-1,3],y:[0,56],ys:8,ly:8,ch:30,items:it,label:'Graph of y = 12(2)^x'}); }});
add({id:'u4q4',u:4,type:'in',q:'Find the next term: <b>5, 9, 13, 17, …</b>',kind:'num',ans:21,pre:'next =',ph:'number',show:'21',
  miss:[['20','Find the common difference: 9 − 5 = 4. Then 17 + 4.'],['68','This sequence adds 4 each time. It does not multiply.']],
  hint:'What do you add each time? 9 − 5 = ?', ex:'d = 4, so the next term is 17 + 4 = <strong>21</strong>.',
  v:function(s){ return hops({terms:[{s:'5'},{s:'9'},{s:'13'},{s:'17'},s?{s:'21',st:'ans'}:{s:'?'}],ops:['+4'],label:'Sequence 5, 9, 13, 17'}); }});
add({id:'u4q5',u:4,type:'in',q:'Find <b>a₈</b> for the sequence <b>4, 7, 10, …</b>',kind:'num',ans:25,pre:'a₈ =',ph:'number',show:'25',
  miss:[['28','From a₁ to a₈ there are <b>7</b> jumps, not 8: 4 + 7 · 3.'],['24','Use aₙ = a₁ + (n − 1)d = 4 + 7 · 3.'],['22','Count again: a₈ is 7 jumps of +3 after 4.']],
  hint:'d = 3. a₈ = 4 + (8 − 1) · 3.', ex:'a₈ = 4 + (8 − 1) · 3 = 4 + 21 = <strong>25</strong>.',
  v:function(s){ return hops({terms:[{s:'4'},{s:'7'},{s:'10'},s?{s:'25',st:'ans'}:{s:'?'}],ops:['+3','+3',s?'5 × (+3)':'…'],idx:['a₁','a₂','a₃','a₈'],cap:s?'from a₁: 7 jumps of +3 → 4 + 21 = 25':'How many +3 jumps from a₁ to a₈?',label:'Arithmetic sequence 4, 7, 10'}); }});
add({id:'u4q6',u:4,type:'in',q:'Find the next term: <b>3, 6, 12, …</b>',kind:'num',ans:24,pre:'next =',ph:'number',show:'24',
  miss:[['15','This one is geometric: it <b>multiplies</b> by 2 each time.'],['18','Check the pattern: 3 × 2 = 6, 6 × 2 = 12, so 12 × 2.']],
  hint:'What do you multiply by? 6 ÷ 3 = ?', ex:'r = 2, so the next term is 12 · 2 = <strong>24</strong>.',
  v:function(s){ return hops({terms:[{s:'3'},{s:'6'},{s:'12'},s?{s:'24',st:'ans'}:{s:'?'}],ops:['×2'],label:'Sequence 3, 6, 12'}); }});
add({id:'u4q7',u:4,type:'in',q:'$200 grows <b>5%</b> per year. Write the model <b>y = a · bˣ</b>. (Type like 200(1.05)^x.)',kind:'expr',ans:'200*1.05^x',pre:'y =',ph:'a(b)^x',show:'y = 200(1.05)ˣ',fmt:'Type it like 200(1.05)^x.',
  miss:[['200*0.05^x','b must include the starting 100%: 100% + 5% = 105% → b = 1.05.'],['200*1.5^x','5% = 0.05, so b = 1 + 0.05 = 1.05 (not 1.5).'],['200*5^x','5% is 0.05 as a decimal. b = 1 + 0.05.'],['1.05*200^x','a and b are swapped. a = 200 is the start.'],['200*0.95^x','0.95 would be a 5% <b>decrease</b>. This money grows.']],
  hint:'a = starting amount. b = 1 + rate (as a decimal).', ex:'a = 200, b = 1 + 0.05 = 1.05 → <strong>y = 200(1.05)ˣ</strong>.',
  v:function(s){ return pctBar({r:0.05,base:'100% = $200',add:'+5%',total:s?'105% → b = 1.05':'?',st:'want',label:'Percent growth bar 5 percent'}); }});
