/* ─────────────────────────── UNIT 5 ─────────────────────────── */
function scat(data, st, w, extra, opt){ opt=opt||{};
  var it=data.map(function(p){ return {t:'pt',x:p[0],y:p[1],st:st,r:4.5}; });
  return P({w:w||240,x:opt.x||[0,10],y:opt.y||[0,10],xs:opt.xs||2,ys:opt.ys||2,ch:opt.ch||32,xl:opt.xl,yl:opt.yl,items:(extra||[]).concat(it),label:opt.label||'Scatter plot'});
}
var POS=[[1,2],[2,3],[3,3.5],[4,5],[5,5.5],[6,7],[7,7.5],[8,8.5],[9,9]];
var NEG=[[1,9],[2,8],[3,7.5],[4,6],[5,5.5],[6,4],[7,3.5],[8,2],[9,1.5]];
var NONE=[[1,6],[2,2],[3,8],[4,4],[5,7],[6,3],[7,6],[8,1.5],[9,5]];
VIZ.u5_pos = function(){ return scat(POS,null,240,[{t:'line',m:0.9,b:1.1,st:'want',w:2,dash:true}],{label:'Positive correlation'}); };
VIZ.u5_neg = function(){ return scat(NEG,null,240,[{t:'line',m:-0.95,b:10,st:'want',w:2,dash:true}],{label:'Negative correlation'}); };
VIZ.u5_none = function(){ return scat(NONE,null,240,[],{label:'No correlation'}); };
VIZ.u5_dot = function(){ return dotplot({data:[4,6,8,10,12],min:2,max:14,step:1,lab:2,marks:[{t:'tri',v:8,st:'ans',lab:'mean 8 = balance point'},{t:'brk',a:4,b:12,st:'want',lab:'range = 12 − 4 = 8'}],label:'Dot plot of 4, 6, 8, 10, 12'}); };
VIZ.u5_box = function(){ return boxplot({data:[3,5,7,9,16],min:0,max:18,step:1,lab:2,cap:'Five-number summary: 3, 4, 7, 12.5, 16',label:'Box plot of 3, 5, 7, 9, 16'}); };
VIZ.u5_mm = function(){ return dotplot({data:[3,5,7,9,16],min:0,max:18,step:1,lab:2,hl:[16],hlSt:'want',marks:[{t:'tri',v:8,st:'alt',lab:'mean 8'},{t:'line',v:7,st:'ans',lab:'median 7',dx:-4,a:'end'}],cap:'The 16 pulls the mean to the right.',label:'Mean versus median'}); };
VIZ.u5_out = function(){ return boxplot({five:{min:2,q1:4,med:5.5,q3:7,max:20},whiskerMax:7,outliers:[20],outSt:'want',fence:11.5,fenceSt:'ans',fenceLab:'fence 11.5',min:0,max:22,step:1,lab:2,labs:{min:'2',q1:'Q1 4',med:'',q3:'Q3 7',max:''},cap:'IQR = 7 − 4 = 3 · fence = 7 + 1.5 · 3 = 11.5',label:'Box plot with outlier 20'}); };
VIZ.u5_reg = function(){ return P({x:[0,6],y:[0,20],ys:2,ly:4,ch:18,items:[{t:'line',m:3,b:2,lab:'ŷ = 2 + 3x',lx:1,dx:-6,dy:-14},{t:'vline',x:4,st:'want',dash:true},{t:'pt',x:1,y:6,r:4.5},{t:'pt',x:2,y:7,r:4.5},{t:'pt',x:3,y:11,r:4.5},{t:'pt',x:5,y:16,r:4.5},{t:'pt',x:4,y:14,st:'ans',lab:'x = 4 → ŷ = 14',dx:-8,a:'end',dy:-10}],label:'Regression line prediction at x = 4'}); };
VIZ.u5_res = function(){ return P({x:[0,6],y:[0,18],ys:2,ly:4,ch:22,items:[{t:'line',m:2,b:4,lab:'line: ŷ = 2x + 4',lx:1.2,dx:-4,dy:-14},{t:'seg',a:[4,12],b:[4,14],st:'ans',w:3.5,lab:'residual 2',dx:-48},{t:'pt',x:4,y:14,lab:'actual 14',dx:8,dy:-8},{t:'pt',x:4,y:12,st:'alt',lab:'predicted 12',dx:8,dy:16}],label:'Residual between actual 14 and predicted 12'}); };

add({id:'u5e1',u:5,type:'err',q:'Ava found the median of <b>8, 3, 12, 5, 10</b>.',steps:['The middle of the list 8, 3, 12, 5, 10 is 12','Median = 12'],bad:0,
  why:'Put the numbers <b>in order</b> first: 3, 5, 8, 10, 12. Then take the middle.', fix:'Median = 8',
  v:function(s){ return dotplot({data:[8,3,12,5,10],min:0,max:14,step:1,lab:2,hl:s?[]:[12],hlSt:'bad',marks:s?[{t:'line',v:8,st:'ans',lab:'median 8'}]:[],cap:s?'In order: 3, 5, 8, 10, 12':'Ava picked 12 (red). Is it in the middle?',label:'Dot plot of 8, 3, 12, 5, 10'}); }});
add({id:'u5e2',u:5,type:'err',q:'Noah checked if <b>20</b> is an outlier in <b>2, 4, 5, 6, 7, 20</b>.',steps:['Q1 = 4 and Q3 = 7','IQR = 20 − 2 = 18','Fence = 7 + 1.5 · 18 = 34, so 20 is not an outlier'],bad:1,
  why:'IQR means <b>interquartile range</b>: Q3 − Q1 (the middle half). Noah used max − min.', fix:'IQR = 7 − 4 = 3. Fence = 7 + 1.5 · 3 = 11.5. Since 20 &gt; 11.5, <b>20 is an outlier</b>.',
  v:function(s){ return boxplot({five:{min:2,q1:4,med:5.5,q3:7,max:20},whiskerMax:s?7:20,outliers:s?[20]:[],outSt:'ans',fence:s?11.5:null,fenceSt:'ans',fenceLab:'fence 11.5',min:0,max:22,step:1,lab:2,labs:{min:'2',q1:'Q1 4',med:'',q3:'Q3 7',max:s?'':'20'},cap:s?'IQR = 3 → fence 11.5 → 20 is an outlier':'The box shows the middle half (Q1 to Q3).',label:'Box plot of 2, 4, 5, 6, 7, 20'}); }});
add({id:'u5e3',u:5,type:'err',q:'Sara found the residual. Actual y = 14, predicted ŷ = 12.',steps:['Residual = predicted − actual','= 12 − 14','= −2'],bad:0,
  why:'Residual = <b>actual − predicted</b> (the real point minus the line).', fix:'14 − 12 = 2. The point is 2 units <b>above</b> the line.',
  v:function(s){ return P({x:[0,6],y:[0,18],ys:2,ly:4,ch:18,items:[{t:'line',m:2,b:4},{t:'seg',a:[4,12],b:[4,14],st:s?'ans':'want',w:3.5,lab:s?'+2':'?',dx:18},{t:'pt',x:4,y:14,lab:'actual 14',dx:-8,a:'end',dy:-6},{t:'pt',x:4,y:12,st:'alt',lab:'predicted 12',dx:8,dy:16}],label:'Residual picture'}); },
  vcap:'Is the point above or below the line?'});

add({id:'u5q1',u:5,type:'mc',q:'What is the mean of <b>5, 10, 15</b>?',opts:[
  {t:'5',why:'5 is the smallest value. The mean is the balance point.'},{t:'10'},{t:'15',why:'15 is the largest value.'},{t:'30',why:'30 is the sum. Divide by how many numbers there are (3).'}],ok:1,
  ex:'(5 + 10 + 15) ÷ 3 = 30 ÷ 3 = <strong>10</strong>.',
  v:function(s){ return dotplot({data:[5,10,15],min:0,max:20,step:1,lab:5,marks:[s?{t:'tri',v:10,st:'ans',lab:'mean 10'}:{t:'tri',v:10,s:'?'}],label:'Dot plot of 5, 10, 15'}); },
  vcap:'Where would the line balance?'});
var ICE=[[60,20],[65,28],[70,31],[75,40],[80,44],[85,52],[90,58],[95,63]];
add({id:'u5q2',u:5,type:'mc',q:'As outdoor temperature increases, ice cream sales increase. What kind of correlation is that?',opts:[
  {t:'Positive'},{t:'Negative',why:'Negative means one goes up while the other goes <b>down</b>.'},{t:'No correlation',why:'There is a clear pattern: both rise together.'},{t:'Causation',why:'Causation is not a kind of correlation. It means one thing causes the other — a pattern alone cannot prove that.'}],ok:0,
  ex:'Both go up together → <strong>positive correlation</strong>.',
  v:function(s){ return scat(s?ICE:[], null, 320, s?[{t:'line',m:1.24,b:-54,st:'ans',w:2,dash:true}]:[{t:'q',x:77,y:35,lab:'pattern?'}], {x:[55,100],y:[0,70],xs:5,ys:10,ch:24,xl:'temperature (°F)',yl:'sales',label:'Ice cream sales versus temperature'}); }});
add({id:'u5q3',u:5,type:'mc',q:'Find the range of: <b>12, 5, 20, 8</b>.',opts:[
  {t:'8',why:'8 is one of the values. Range = largest − smallest.'},{t:'12',why:'Range uses the largest (20) and smallest (5) values.'},{t:'15'},{t:'20',why:'20 is the largest value. Subtract the smallest: 20 − 5.'}],ok:2,
  ex:'Max − Min = 20 − 5 = <strong>15</strong>.',
  v:function(s){ return dotplot({data:[12,5,20,8],min:0,max:22,step:1,lab:2,marks:[{t:'brk',a:5,b:20,st:s?'ans':'want',lab:s?'range = 20 − 5 = 15':'range = ?'}],label:'Dot plot of 12, 5, 20, 8'}); }});
add({id:'u5q4',u:5,type:'in',q:'Find the median of <b>11, 4, 9, 2, 7</b>.',kind:'num',ans:7,pre:'median =',ph:'number',show:'7',
  miss:[['9','9 is the middle of the list as written. Sort first: 2, 4, 7, 9, 11.'],['6.6','That is the mean. The median is the middle value after sorting.']],
  hint:'Sort the numbers from least to greatest. Then pick the middle one.', ex:'Sorted: 2, 4, <strong>7</strong>, 9, 11 → median = 7.',
  v:function(s){ return dotplot({data:[11,4,9,2,7],min:0,max:12,step:1,lab:2,marks:s?[{t:'line',v:7,st:'ans',lab:'median 7'}]:[],cap:s?'2 dots left of 7, 2 dots right of 7':'The dot plot puts the values in order for you.',label:'Dot plot of 11, 4, 9, 2, 7'}); }});
add({id:'u5q5',u:5,type:'in',q:'Find the mean of <b>2, 4, 9</b>.',kind:'num',ans:5,pre:'mean =',ph:'number',show:'5',
  miss:[['15','15 is the sum. Now divide by 3.'],['4','4 is the median (the middle value). The mean is sum ÷ count.'],['7','7 is the range. The mean is sum ÷ count.']],
  hint:'Add the numbers. Divide by how many there are.', ex:'(2 + 4 + 9) ÷ 3 = 15 ÷ 3 = <strong>5</strong>.',
  v:function(s){ return dotplot({data:[2,4,9],min:0,max:10,step:1,lab:1,marks:[s?{t:'tri',v:5,st:'ans',lab:'mean 5'}:{t:'tri',v:5,s:'?'}],label:'Dot plot of 2, 4, 9'}); },
  vcap:'The mean is the balance point.'});
add({id:'u5q6',u:5,type:'in',q:'A point has actual y = <b>20</b>. The line predicts ŷ = <b>23</b>. Find the residual.',kind:'num',ans:-3,pre:'residual =',ph:'number',show:'−3',
  miss:[['3','Residual = actual − predicted = 20 − 23. Watch the sign: the point is <b>below</b> the line.'],['43','Subtract, don’t add: actual − predicted.']],
  hint:'Residual = actual − predicted.', ex:'20 − 23 = <strong>−3</strong>. Negative means the point is below the line.',
  v:function(s){ return P({x:[0,8],y:[0,30],ys:5,ly:5,ch:26,items:[{t:'line',m:3,b:5,lab:'ŷ = 3x + 5',lx:2,dx:-8,dy:-14},{t:'seg',a:[6,20],b:[6,23],st:s?'ans':'want',w:3.5,lab:s?'−3':'?',dx:-18},{t:'pt',x:6,y:20,lab:'actual 20',dx:8,dy:14},{t:'pt',x:6,y:23,st:'alt',lab:'predicted 23',dx:-8,a:'end',dy:-8}],label:'Residual for actual 20 and predicted 23'}); }});
add({id:'u5q7',u:5,type:'in',q:'Use the model <b>ŷ = 5 + 2x</b>. Predict ŷ when x = 6.',kind:'num',ans:17,pre:'ŷ =',ph:'number',show:'17',
  miss:[['42','Multiply first: 2 · 6 = 12. Then add 5.'],['13','Put 6 in for x: 5 + 2(6), not 5 + 2 + 6.'],['12','2 · 6 = 12 — now add the 5.']],
  hint:'Replace x with 6: ŷ = 5 + 2(6).', ex:'ŷ = 5 + 2(6) = 5 + 12 = <strong>17</strong>.',
  v:function(s){ var it=[{t:'vline',x:6,st:'want',lab:'x = 6',dy:14,dx:-4}]; if (s){ it.unshift({t:'line',m:2,b:5,st:'ans',lab:'ŷ = 5 + 2x',lx:2,dx:-6,dy:-14}); it.push({t:'pt',x:6,y:17,st:'ans',lab:'(6, 17)',dx:-8,a:'end',dy:-8}); } else it.push({t:'q',x:6,y:12,lab:'ŷ = ?'});
    return P({x:[0,8],y:[0,24],ys:4,ly:4,ch:30,items:it,label:'Prediction at x = 6'}); }});

/* ─────────────────────────── UNIT 6 ─────────────────────────── */
VIZ.u6_foil = function(){ return foil({a:3,b:4}); };
VIZ.u6_area = function(){ return areaModel({rows:['x','3'],cols:['x','4'],cells:[[{s:'x²',st:'ans'},{s:'4x',st:'ans'}],[{s:'3x',st:'ans'},{s:'12',st:'ans'}]],cap:'x² + 4x + 3x + 12 = x² + 7x + 12',label:'Area model (x + 3)(x + 4)'}); };
VIZ.u6_tiles = function(){ return tiles({groups:[{k:'x',n:3,lab:'3x'},{k:'x',n:5,lab:'5x'},{k:'y',n:2,lab:'2y'},{k:'y',n:1,neg:true,lab:'−y'}],cap:'8 x-tiles · one +y cancels the −y → 8x + y',label:'Algebra tiles 3x + 5x + 2y − y'}); };
VIZ.u6_dist = function(){ return areaModel({rows:['2'],cols:['x','5'],cells:[[{s:'2x',st:'ans'},{s:'10',st:'ans'}]],cap:'2(x + 5) = 2x + 10',label:'Area model 2(x + 5)'})+areaModel({rows:['−3'],cols:['2x','−4'],cells:[[{s:'−6x',st:'ans'},{s:'+12',st:'ans'}]],cap:'(−3)(−4) = +12 → −6x + 12',label:'Area model −3(2x − 4)'}); };
VIZ.u6_m1 = function(){ return diamond({top:'6',bottom:'5',left:{s:'2',st:'ans'},right:{s:'3',st:'ans'},side:'x² + 5x + 6',cap:'2 · 3 = 6 and 2 + 3 = 5',label:'Product sum diamond 6 and 5'})+areaModel({rows:['x','2'],cols:['x','3'],cells:[['x²','3x'],['2x','6']],cap:'sides: (x + 2)(x + 3)',label:'Area model x squared plus 5x plus 6'}); };
VIZ.u6_m2 = function(){ return diamond({top:'a·c = 6',bottom:'7',left:{s:'6',st:'ans'},right:{s:'1',st:'ans'},side:'2x² + 7x + 3',cap:'6 · 1 = 6 and 6 + 1 = 7',label:'AC diamond'})+areaModel({rows:['2x','1'],cols:['x','3'],cells:[['2x²','6x'],['x','3']],cap:'2x(x + 3) + 1(x + 3) = (2x + 1)(x + 3)',label:'Area model for the AC method'}); };
VIZ.u6_m3 = function(){ return dsq({A:'x',B:'9',L:'x² − 9',done:true,top:'x + 3',side:'x − 3',cap:'cut out 3², slide the strip → (x + 3)(x − 3)',label:'Difference of squares x squared minus 9'}); };
VIZ.u6_m4 = function(){ return areaModel({rows:['x','3'],cols:['x','3'],cells:[['x²','3x'],['3x','9']],cap:'a square with side x + 3 → (x + 3)²',label:'Perfect square (x + 3) squared'}); };
VIZ.u6_solve = function(){ return diamond({top:'6',bottom:'−5',left:{s:'−2',st:'ans'},right:{s:'−3',st:'ans'},side:'x² − 5x + 6',label:'Diamond 6 and −5'})+P({x:[-1,5],y:[-2,7],ch:24,items:[{t:'fn',f:function(x){return x*x-5*x+6;},lab:'y = x² − 5x + 6',lx:4.3,dx:-60,dy:-4},{t:'pt',x:2,y:0,st:'ans',lab:'x = 2',dx:-6,a:'end',dy:32},{t:'pt',x:3,y:0,st:'ans',lab:'x = 3',dx:6,dy:32}],label:'Parabola crossing the x-axis at 2 and 3'}); };
VIZ.u6_sq = function(){ return P({x:[-9,9],y:[0,60],ys:10,lx:3,ly:10,ch:30,items:[{t:'fn',f:function(x){return x*x;},lab:'y = x²',lx:-5.5,dx:-30,dy:-2},{t:'hline',y:49,lab:'y = 49',dx:-2},{t:'pt',x:-7,y:49,st:'ans',lab:'x = −7',dx:-8,a:'end',dy:18},{t:'pt',x:7,y:49,st:'ans',lab:'x = 7',dx:8,dy:18}],label:'y = x squared meets y = 49 at x = 7 and x = −7'}); };

add({id:'u6e1',u:6,type:'err',q:'Dev expanded <b>(x + 5)²</b>.',steps:['(x + 5)² = x² + 5²','= x² + 25'],bad:0,
  why:'Squaring a sum is <b>not</b> squaring each part. (x + 5)² means (x + 5)(x + 5), which has two middle pieces: 5x and 5x.', fix:'(x + 5)(x + 5) = x² + 5x + 5x + 25 = x² + 10x + 25',
  v:function(s){ return areaModel({rows:['x','5'],cols:['x','5'],cells:[['x²',s?{s:'5x',st:'ans'}:'?'],[s?{s:'5x',st:'ans'}:'?','25']],cap:s?'x² + 10x + 25':'Dev only counted x² and 25. What is missing?',label:'Area model (x + 5) squared'}); }});
add({id:'u6e2',u:6,type:'err',q:'Rosa factored <b>x² + 2x − 15</b>.',steps:['Need two numbers that multiply to −15 and add to 2','Pick −5 and 3','(x − 5)(x + 3)'],bad:1,
  why:'−5 + 3 = <b>−2</b>, not +2. Switch the signs: 5 and −3.', fix:'(x + 5)(x − 3). Check: 5 · (−3) = −15 ✓ and 5 + (−3) = 2 ✓',
  v:function(s){ return diamond({top:'−15',bottom:'2',left:s?{s:'5',st:'ans'}:{s:'−5',st:'bad'},right:s?{s:'−3',st:'ans'}:{s:'3',st:'bad'},side:'x² + 2x − 15',cap:s?'5 + (−3) = 2 ✓':'Rosa’s pair: does −5 + 3 make 2?',label:'Diamond for x squared plus 2x minus 15'}); }});
add({id:'u6e3',u:6,type:'err',q:'Jon solved <b>x² = 49</b>.',steps:['x² = 49','Take the square root of both sides','x = 7'],bad:2,
  why:'Two numbers square to 49: 7 · 7 = 49 <b>and</b> (−7)(−7) = 49. Write ± (“plus or minus”).', fix:'x = ±7, so x = 7 or x = −7',
  v:function(s){ return P({x:[-9,9],y:[0,60],ys:10,lx:3,ly:10,ch:30,items:[{t:'fn',f:function(x){return x*x;}},{t:'hline',y:49,lab:'y = 49',dx:-2},s?{t:'pt',x:-7,y:49,st:'ans',lab:'x = −7',dx:-8,a:'end',dy:18}:{t:'q',x:-7,y:49,dy:20,dx:-14,a:'end'},{t:'pt',x:7,y:49,st:s?'ans':null,lab:'x = 7',dx:8,dy:18}],label:'y = x squared and y = 49'}); },
  vcap:'The parabola hits y = 49 in how many places?'});

add({id:'u6q1',u:6,type:'mc',q:'Combine: <b>4x² + 2x − 3x² + 5x</b>',opts:[
  {t:'7x² + 7x',why:'4x² − 3x² = 1x², not 7x². The 3x² is subtracted.'},{t:'x² + 7x'},{t:'x² − 3x',why:'2x + 5x = 7x. Combine the x-terms too.'},{t:'7x⁴ + 7x²',why:'When you add like terms, the exponent stays the same. Only the number in front changes.'}],ok:1,
  ex:'(4x² − 3x²) + (2x + 5x) = <strong>x² + 7x</strong>.',
  v:function(s){ return s? tiles({groups:[{k:'x2',n:1,lab:'x²',st:'ans'},{k:'x',n:7,lab:'7x',st:'ans'}],cap:'4 − 3 = 1 big square · 2 + 5 = 7 strips',label:'Tiles for x squared plus 7x'}) : tiles({groups:[{k:'x2',n:4,lab:'4x²'},{k:'x',n:2,lab:'2x'},{k:'x2',n:3,neg:true,lab:'−3x²'},{k:'x',n:5,lab:'5x'}],cap:'Match the same shapes. A − tile cancels a + tile.',label:'Tiles for 4x² + 2x − 3x² + 5x'}); }});
add({id:'u6q2',u:6,type:'mc',q:'Distribute: <b>−3(2x − 4)</b>',opts:[
  {t:'−6x − 12',why:'(−3)(−4) = +12. Negative times negative is positive.'},{t:'−6x + 12'},{t:'6x − 12',why:'The −3 makes 2x negative: −3 · 2x = −6x.'},{t:'6x + 12',why:'Distribute the negative to both terms: −3 · 2x = −6x.'}],ok:1,
  ex:'−3 · 2x = −6x. −3 · (−4) = +12. Result: <strong>−6x + 12</strong>.',
  v:function(s){ return areaModel({rows:['−3'],cols:['2x','−4'],cells:[[s?{s:'−6x',st:'ans'}:'?',s?{s:'+12',st:'ans'}:'?']],label:'Area model −3(2x − 4)'}); }});
add({id:'u6q3',u:6,type:'mc',q:'FOIL: <b>(x + 5)(x − 2)</b>',opts:[
  {t:'x² − 3x − 10',why:'Check the middle: −2x + 5x = +3x.'},{t:'x² + 3x − 10'},{t:'x² + 7x − 10',why:'5x + (−2x) = 3x, not 7x. Keep the minus sign on the 2.'},{t:'x² − 7x + 10',why:'Check the last term: 5 · (−2) = −10.'}],ok:1,
  ex:'F: x². O: −2x. I: 5x. L: −10. Sum: <strong>x² + 3x − 10</strong>.',
  v:function(s){ return areaModel({rows:['x','5'],cols:['x','−2'],cells:[[s?{s:'x²',st:'ans'}:'?',s?{s:'−2x',st:'ans'}:'?'],[s?{s:'5x',st:'ans'}:'?',s?{s:'−10',st:'ans'}:'?']],cap:s?'x² − 2x + 5x − 10 = x² + 3x − 10':'Fill each box: row × column',label:'Area model (x + 5)(x − 2)'}); }});
add({id:'u6q4',u:6,type:'mc',q:'Factor: <b>x² + 7x + 12</b>',opts:[
  {t:'(x + 2)(x + 6)',why:'2 · 6 = 12 ✓ but 2 + 6 = 8, not 7.'},{t:'(x + 3)(x + 4)'},{t:'(x − 3)(x − 4)',why:'(−3)(−4) = 12 ✓ but −3 + (−4) = −7, not +7.'},{t:'(x + 1)(x + 12)',why:'1 + 12 = 13, not 7.'}],ok:1,
  ex:'Need two numbers: multiply to 12, add to 7 → 3 and 4. <strong>(x + 3)(x + 4)</strong>.',
  v:function(s){ return diamond({top:'12',bottom:'7',left:s?{s:'3',st:'ans'}:'?',right:s?{s:'4',st:'ans'}:'?',side:'x² + 7x + 12',label:'Diamond 12 and 7'}); }});
add({id:'u6q5',u:6,type:'mc',q:'Factor: <b>x² − 16</b>',opts:[
  {t:'(x − 4)²',why:'(x − 4)² = x² − 8x + 16. That has a middle term and +16.'},{t:'(x − 4)(x + 4)'},{t:'(x + 4)²',why:'(x + 4)² = x² + 8x + 16.'},{t:'prime',why:'x² − 16 is a difference of squares: x² − 4².'}],ok:1,
  ex:'Difference of squares: x² − 4² = <strong>(x − 4)(x + 4)</strong>.',
  v:function(s){ return dsq({A:'x',B:'16',L:'x² − 16',b:40,done:s,top:'x + 4',side:'x − 4',label:'Difference of squares x squared minus 16'}); }});
add({id:'u6q6',u:6,type:'mc',q:'Solve: <b>x² − 5x + 6 = 0</b>',opts:[
  {t:'x = −2 or x = −3',why:'The factors are (x − 2)(x − 3). Set each to 0: x − 2 = 0 → x = +2.'},{t:'x = 2 or x = 3'},{t:'x = 5 or x = 6',why:'Those are numbers from the equation, not the solutions. Factor first.'},{t:'x = 1 only',why:'Check: 1 − 5 + 6 = 2, not 0.'}],ok:1,
  ex:'Factor: (x − 2)(x − 3) = 0. By the Zero Product Property: <strong>x = 2 or x = 3</strong>.',
  v:function(s){ return diamond({top:'6',bottom:'−5',left:s?{s:'−2',st:'ans'}:'?',right:s?{s:'−3',st:'ans'}:'?',side:'x² − 5x + 6 = 0',cap:s?'(x − 2)(x − 3) = 0 → x = 2 or 3':'Find the pair, then set each factor = 0',label:'Diamond 6 and −5'}); }});
add({id:'u6q7',u:6,type:'in',q:'Factor: <b>x² + 8x + 15</b>',kind:'expr',ans:'x^2+8x+15',form:'factored',pre:'',ph:'(x + a)(x + b)',show:'(x + 3)(x + 5)',fmt:'Type it like (x+2)(x+4).',
  miss:[['(x+1)(x+15)','1 · 15 = 15 ✓ but 1 + 15 = 16, not 8.'],['(x-3)(x-5)','(−3) + (−5) = −8. You need +8, so both signs are +.'],['(x+3)(x-5)','3 + (−5) = −2. You need +8.'],['(x+2)(x+6)','2 · 6 = 12, not 15.']],
  hint:'Find two numbers that multiply to 15 and add to 8.', ex:'3 · 5 = 15 and 3 + 5 = 8 → <strong>(x + 3)(x + 5)</strong>.',
  v:function(s){ return diamond({top:'15',bottom:'8',left:s?{s:'3',st:'ans'}:'?',right:s?{s:'5',st:'ans'}:'?',side:'x² + 8x + 15',label:'Diamond 15 and 8'}); }});
add({id:'u6q8',u:6,type:'in',q:'Multiply: <b>(x + 2)(x + 6)</b>',kind:'expr',ans:'x^2+8x+12',form:'expanded',pre:'',ph:'x^2 + …',show:'x² + 8x + 12',fmt:'Type it like x^2+5x+6.',
  miss:[['x^2+12','You skipped the middle terms: 6x and 2x.'],['x^2+8x+8','Last term: 2 · 6 = 12 (multiply, don’t add).'],['x^2+12x+8','Middle: 6x + 2x = 8x. Last: 2 · 6 = 12.'],['2x+8','x · x = x², not 2x.']],
  hint:'Fill the 4 boxes: x · x, x · 6, 2 · x, 2 · 6. Then combine like terms.', ex:'x² + 6x + 2x + 12 = <strong>x² + 8x + 12</strong>.',
  v:function(s){ return areaModel({rows:['x','2'],cols:['x','6'],cells:[[s?{s:'x²',st:'ans'}:'?',s?{s:'6x',st:'ans'}:'?'],[s?{s:'2x',st:'ans'}:'?',s?{s:'12',st:'ans'}:'?']],label:'Area model (x + 2)(x + 6)'}); }});
add({id:'u6q9',u:6,type:'in',q:'Solve: <b>x² + x − 12 = 0</b>. Type both answers, like 2, -5.',kind:'set',ans:[3,-4],pre:'x =',ph:'a, b',show:'x = 3 or x = −4',fmt:'Type both numbers with a comma, like 2, -5.',
  miss:[['-3,4','Check the signs: (x + 4)(x − 3) = 0 gives x = −4 and x = 3.'],['3','x = 3 works! There is a second answer too.'],['-4','x = −4 works! There is a second answer too.']],
  hint:'Factor: two numbers that multiply to −12 and add to 1. Then set each factor equal to 0.', ex:'(x + 4)(x − 3) = 0 → <strong>x = −4 or x = 3</strong>.',
  v:function(s){ return s? P({x:[-6,5],y:[-14,8],ys:2,ly:4,ch:13,items:[{t:'fn',f:function(x){return x*x+x-12;},lab:'y = x² + x − 12',lx:-3.6,dx:-2,dy:-6},{t:'pt',x:-4,y:0,st:'ans',lab:'−4',dx:-8,a:'end',dy:-8},{t:'pt',x:3,y:0,st:'ans',lab:'3',dx:8,dy:-8}],label:'Parabola with zeros −4 and 3'}) : diamond({top:'−12',bottom:'1',left:'?',right:'?',side:'x² + x − 12 = 0',label:'Diamond −12 and 1'}); }});

/* ─────────────────────────── UNIT 7 ─────────────────────────── */
function quad(a,b,c){ return function(x){ return a*x*x+b*x+c; }; }
VIZ.u7_feat = function(){ return P({x:[-3,5],y:[-5,6],ch:22,items:[{t:'vline',x:1,st:'want',lab:'axis x = 1',dy:14,dx:-36},{t:'fn',f:quad(1,-2,-3),lab:'y = x² − 2x − 3',lx:3.9,dx:-56,dy:-4},{t:'pt',x:1,y:-4,st:'ans',lab:'vertex (1, −4)',dx:10,dy:6},{t:'pt',x:-1,y:0,lab:'zero −1',dx:-8,a:'end',dy:-8},{t:'pt',x:3,y:0,lab:'zero 3',dx:8,dy:-8},{t:'pt',x:0,y:-3,st:'alt',lab:'y-int (0, −3)',dx:-8,a:'end',dy:-2}],label:'Key features of y = x² − 2x − 3'}); };
VIZ.u7_up = function(){ return P({w:240,x:[-3,3],y:[-4,5],ch:18,items:[{t:'fn',f:quad(1,0,-2),lab:'a > 0: opens up',lx:0,dx:0,dy:-60},{t:'pt',x:0,y:-2,st:'ans',lab:'minimum',dx:8,dy:14}],label:'Opens up, has a minimum'}); };
VIZ.u7_down = function(){ return P({w:240,x:[-3,3],y:[-4,5],ch:18,items:[{t:'fn',f:quad(-1,0,3),lab:'a < 0: opens down',lx:0,dx:0,dy:74},{t:'pt',x:0,y:3,st:'ans',lab:'maximum',dx:8,dy:-8}],label:'Opens down, has a maximum'}); };
VIZ.u7_graph = function(){ var f=quad(1,-2,-3), it=[{t:'fn',f:f,st:'ans',w:2.5},{t:'vline',x:1,st:'want',lab:'x = 1',dy:14}]; [-1,0,1,2,3].forEach(function(x){ it.push({t:'pt',x:x,y:f(x),lab:'('+fmt(x)+', '+fmt(f(x))+')',dx:x<1?-8:8,a:x<1?'end':'start',dy:x===1?16:-8}); });
  it.push({t:'seg',a:[0,-3],b:[2,-3],st:'want',w:2,dash:true});
  return P({x:[-2,4],y:[-5,5],ch:24,items:it,label:'Graph of y = x² − 2x − 3 from a table'}); };
VIZ.u7_range = function(){ return P({x:[-4,4],y:[-6,5],ch:22,items:[{t:'fn',f:quad(-1,0,3),lab:'y = −x² + 3',lx:2.2,dx:4,dy:-4},{t:'ybr',a:-6,b:3,st:'ans',lab:'range: y ≤ 3',dx:-10,ly:-4.5},{t:'pt',x:0,y:3,st:'ans',lab:'max (0, 3)',dx:10,dy:-8}],label:'Range of y = −x² + 3'}); };
VIZ.u7_cmpA = function(){ return P({w:240,x:[-2,4],y:[-2,6],ch:22,items:[{t:'fn',f:function(x){return -(x-1)*(x-1)+5;}},{t:'pt',x:1,y:5,st:'ans',lab:'A: max 5',dx:10,dy:6}],label:'Function A with maximum 5'}); };
VIZ.u7_cmpB = function(){ return P({w:240,x:[-3,3],y:[-2,6],ch:22,items:[{t:'fn',f:quad(-1,0,3),st:'alt'},{t:'pt',x:0,y:3,st:'alt',lab:'B: max 3',dx:10,dy:-8}],label:'Function B y = −x² + 3 with maximum 3'}); };
VIZ.u7_area = function(){ return shape({top:'length x + 3',left:'x',center:'A(x) = x(x + 3)',cap:'A(x) = x² + 3x',label:'Rectangle with sides x and x + 3'})+P({x:[0,6],y:[0,48],ys:8,ly:8,ch:24,xl:'x',yl:'A(x)',items:[{t:'fn',f:quad(1,3,0),from:0,to:6},{t:'pt',x:4,y:28,st:'ans',lab:'A(4) = 28',dx:-8,a:'end',dy:-8}],label:'Graph of A(x) = x² + 3x'}); };

add({id:'u7e1',u:7,type:'err',q:'Pia found the axis of symmetry of <b>y = x² + 6x + 5</b>.',steps:['a = 1 and b = 6','x = b ÷ (2a) = 6 ÷ 2','x = 3'],bad:1,
  why:'The formula is x = <b>−</b>b ÷ (2a). She forgot the negative sign.', fix:'x = −6 ÷ 2 = −3. Vertex (−3, −4).',
  v:function(s){ return P({x:[-7,4],y:[-5,6],ch:20,items:[{t:'fn',f:quad(1,6,5)},s?{t:'vline',x:-3,st:'ans',lab:'x = −3',dy:14}:{t:'vline',x:3,st:'bad',lab:'Pia: x = 3',dy:14,dx:-20},s?{t:'pt',x:-3,y:-4,st:'ans',lab:'vertex (−3, −4)',dx:10,dy:6}:null].filter(Boolean),label:'Axis of symmetry of y = x² + 6x + 5'}); },
  vcap:'Does Pia’s line cut the parabola in half?'});
add({id:'u7e2',u:7,type:'err',q:'Omar wrote the range of <b>y = (x − 1)² + 2</b>.',steps:['The vertex is (1, 2)','It opens up, so 2 is the minimum','Range: y ≤ 2'],bad:2,
  why:'A <b>minimum</b> means every y-value is 2 <b>or more</b>. Use ≥.', fix:'Range: y ≥ 2',
  v:function(s){ return P({x:[-3,5],y:[-1,10],ch:18,items:[{t:'fn',f:function(x){return (x-1)*(x-1)+2;}},s?{t:'ybr',a:2,b:10,st:'ans',lab:'y ≥ 2',dx:-10,ly:6}:{t:'ybr',a:-1,b:2,st:'bad',lab:'Omar: y ≤ 2',dx:-10,ly:1.3},{t:'pt',x:1,y:2,lab:'(1, 2)',dx:10,dy:14}],label:'Range of y = (x − 1)² + 2'}); }});
add({id:'u7e3',u:7,type:'err',q:'Ivy evaluated <b>A(x) = x(x + 3)</b> at x = 4.',steps:['A(4) = 4(4 + 3)','= 4 · 4 + 3','= 19'],bad:1,
  why:'Do the parentheses <b>first</b>: 4 + 3 = 7. Then multiply 4 · 7. (Or distribute to both terms: 4 · 4 + 4 · 3.)', fix:'A(4) = 4 · 7 = 28',
  v:function(s){ return shape({top:'4 + 3 = 7',left:'4',center:s?{s:'A = 4 · 7 = 28',st:'ans'}:{s:'A = ?'},label:'Rectangle 4 by 7'}); }});

add({id:'u7q1',u:7,type:'mc',q:'Does <b>y = −2x² + 4x + 1</b> open up or down?',opts:[{t:'Up — it has a minimum',why:'Look at a, the number in front of x². a = −2 is negative, so it opens down.'},{t:'Down — it has a maximum'}],ok:1,
  ex:'a = −2 &lt; 0, so the parabola opens <strong>down</strong> and has a maximum (at x = −4 ÷ (2 · (−2)) = 1, y = 3).',
  v:function(s){ var it=[{t:'pt',x:0,y:1,lab:'y-int (0, 1)',dx:-8,a:'end'}]; if (s){ it.unshift({t:'fn',f:quad(-2,4,1),st:'ans'}); it.push({t:'pt',x:1,y:3,st:'ans',lab:'max (1, 3)',dx:10,dy:-6}); } else it.push({t:'q',x:2.4,y:2.5,lab:'up or down?',dx:-14,a:'end'});
    return P({x:[-2,4],y:[-5,5],ch:22,items:it,label:'Parabola y = −2x² + 4x + 1'}); }});
add({id:'u7q2',u:7,type:'mc',q:'What is the vertex of <b>y = (x − 2)² + 1</b>?',opts:[
  {t:'(2, 1)'},{t:'(−2, 1)',why:'In (x − h)², h is the number being subtracted. x − 2 means h = +2.'},{t:'(2, −1)',why:'k is added at the end: “+ 1” means k = 1.'},{t:'(1, 2)',why:'Vertex = (h, k) = (2, 1). Order matters.'}],ok:0,
  ex:'Vertex form y = a(x − h)² + k has vertex (h, k) = <strong>(2, 1)</strong>.',
  v:function(s){ var it=s?[{t:'fn',f:function(x){return (x-2)*(x-2)+1;},st:'ans'},{t:'pt',x:2,y:1,st:'ans',lab:'(2, 1)',dx:10,dy:12}]:[{t:'q',x:-2,y:5,lab:'vertex = (h, k) = ?'}];
    return P({x:[-3,5],y:[-2,7],ch:22,items:it,label:'Vertex of y = (x − 2)² + 1'}); }});
add({id:'u7q3',u:7,type:'in',q:'Find the axis of symmetry of <b>y = x² − 4x + 1</b>.',kind:'num',ans:2,pre:'x =',ph:'number',show:'x = 2',
  miss:[['-2','Use x = −b ÷ (2a). Here b = −4, so −b = +4. Then 4 ÷ 2 = 2.'],['4','Divide by 2a = 2: 4 ÷ 2 = 2.'],['-4','Use x = −b ÷ (2a) = 4 ÷ 2.']],
  hint:'a = 1, b = −4. x = −b ÷ (2a).', ex:'x = −(−4) ÷ (2 · 1) = 4 ÷ 2 = <strong>2</strong>.',
  v:function(s){ var it=[{t:'pt',x:0,y:1,lab:'(0, 1)',dx:-8,a:'end'}]; if (s){ it.unshift({t:'fn',f:quad(1,-4,1)}); it.unshift({t:'vline',x:2,st:'ans',lab:'x = 2',dy:14}); it.push({t:'pt',x:4,y:1,lab:'(4, 1)',dx:8}); } else it.push({t:'q',x:3,y:5,lab:'axis?'});
    return P({x:[-2,6],y:[-4,7],ch:20,items:it,label:'Axis of symmetry of y = x² − 4x + 1'}); }});
add({id:'u7q4',u:7,type:'in',q:'Find the zeros of <b>y = x² − x − 6</b>. Type both, like 1, -5.',kind:'set',ans:[3,-2],pre:'x =',ph:'a, b',show:'x = 3 or x = −2',fmt:'Type both numbers with a comma, like 1, -5.',
  miss:[['-3,2','Factor: (x − 3)(x + 2). Set each factor to 0: x = 3 and x = −2.'],['3','x = 3 is one zero. Find the other one too.'],['-2','x = −2 is one zero. Find the other one too.'],['6,-1','Those come from the equation. Factor first: multiply to −6, add to −1.']],
  hint:'Two numbers that multiply to −6 and add to −1. Then set each factor = 0.', ex:'(x − 3)(x + 2) = 0 → <strong>x = 3 or x = −2</strong>.',
  v:function(s){ return s? P({x:[-4,5],y:[-7,6],ch:18,items:[{t:'fn',f:quad(1,-1,-6),lab:'y = x² − x − 6',lx:-2.6,dx:4,dy:-4},{t:'pt',x:-2,y:0,st:'ans',lab:'−2',dx:-8,a:'end',dy:-8},{t:'pt',x:3,y:0,st:'ans',lab:'3',dx:8,dy:-8}],label:'Zeros of y = x² − x − 6'}) : diamond({top:'−6',bottom:'−1',left:'?',right:'?',side:'x² − x − 6',label:'Diamond −6 and −1'}); }});
add({id:'u7q5',u:7,type:'in',q:'Find the range of <b>y = −x² + 3</b>. Type like y &lt;= 5.',kind:'ineq',var:'y',ans:{op:'<=',n:3},pre:'',ph:'y …',show:'y ≤ 3',fmt:'Type an inequality with y, like y <= 5 or y ≥ 2.',
  miss:[['y>=3','It opens down (a = −1), so 3 is the <b>highest</b> point. y-values are 3 or less.'],['y<3','The vertex (0, 3) is on the graph, so include 3: use ≤.'],['y<=-3','The vertex is (0, 3): k = +3.']],
  hint:'a = −1 means it opens down. The vertex (0, 3) is the maximum.', ex:'Opens down with max 3 → range <strong>y ≤ 3</strong>.',
  v:function(s){ var it=s?[{t:'fn',f:quad(-1,0,3)},{t:'ybr',a:-6,b:3,st:'ans',lab:'y ≤ 3',dx:-10,ly:-4.5},{t:'pt',x:0,y:3,st:'ans',lab:'max (0, 3)',dx:10,dy:-8}]:[{t:'q',x:2,y:-3,lab:'range?'}];
    return P({x:[-4,4],y:[-6,5],ch:22,items:it,label:'Range of y = −x² + 3'}); },
  vcap:'Think: does it open up or down? What is the highest or lowest point?'});
add({id:'u7q6',u:7,type:'in',q:'A rectangle has length <b>x + 2</b> and width <b>x</b>. Write A(x) and find <b>A(6)</b>.',kind:'num',ans:48,pre:'A(6) =',ph:'number',show:'48',
  miss:[['38','Do the parentheses first: 6 + 2 = 8. Then 6 · 8.'],['14','Area is length × width: 6 × 8, not 6 + 8.'],['28','That is the perimeter: 2(8) + 2(6). Area = 8 × 6.']],
  hint:'A(x) = x(x + 2). Put in 6: 6 · (6 + 2).', ex:'A(x) = x(x + 2) → A(6) = 6 · 8 = <strong>48</strong>.',
  v:function(s){ return shape({top:'x + 2 = 8',left:'x = 6',center:s?{s:'A = 6 · 8 = 48',st:'ans'}:{s:'A = ?'},label:'Rectangle 6 by 8'}); }});
add({id:'u7q7',u:7,type:'mc',q:'Function A (graph) has a maximum of 5. Function B is <b>y = −x² + 3</b>. Which has the greater maximum?',opts:[{t:'A'},{t:'B',why:'B’s maximum is its vertex: y = 3 when x = 0. 3 &lt; 5.'},{t:'They are equal',why:'B tops out at 3. A tops out at 5.'}],ok:0,
  ex:'B: vertex (0, 3), so max = 3. A: max = 5. <strong>A</strong> is greater.',
  v:function(s){ var it=[{t:'fn',f:function(x){return -(x-1)*(x-1)+5;}},{t:'pt',x:1,y:5,lab:'A: max 5',dx:10,dy:6}]; if (s){ it.push({t:'fn',f:quad(-1,0,3),st:'alt'}); it.push({t:'pt',x:0,y:3,st:'alt',lab:'B: max 3',dx:-8,a:'end',dy:-8}); } else it.push({t:'q',x:-2,y:5,lab:'B: max ?'});
    return P({x:[-3,4],y:[-2,6],ch:24,items:it,label:'Compare maximums'}); }});

/* ─────────────────────────── UNIT 8 ─────────────────────────── */
VIZ.u8_md = function(){ return P({x:[0,7],y:[0,9],ch:30,items:[{t:'seg',a:[1,2],b:[5,8]},{t:'rise',a:[1,2],b:[5,8],st:'want',run:'Δx = 4',rise:'Δy = 6'},{t:'pt',x:1,y:2,lab:'(1, 2)',dx:-8,a:'end',dy:-6},{t:'pt',x:5,y:8,lab:'(5, 8)',dx:-8,a:'end'},{t:'pt',x:3,y:5,st:'ans',r:6.5,lab:'midpoint (3, 5)',dx:-10,a:'end',dy:-4}],label:'Midpoint and distance for (1, 2) and (5, 8)'}); };
VIZ.u8_mid = function(){ return P({x:[0,9],y:[0,8],ch:30,items:[{t:'seg',a:[2,3],b:[8,7]},{t:'xbr',a:2,b:8,st:'want',lab:'x: (2 + 8) ÷ 2 = 5',dy:-12},{t:'pt',x:2,y:3,lab:'(2, 3)',dx:-8,a:'end'},{t:'pt',x:8,y:7,lab:'(8, 7)',dx:-8,a:'end'},{t:'pt',x:5,y:5,st:'ans',r:6.5,lab:'(5, 5)',dx:-10,a:'end',dy:-6}],label:'Midpoint of (2, 3) and (8, 7)'}); };
VIZ.u8_dist = function(){ return P({x:[0,5],y:[0,7],ch:36,items:[{t:'rise',a:[1,2],b:[4,6],st:'want',run:'3',rise:'4'},{t:'seg',a:[1,2],b:[4,6],st:'ans',lab:'d = 5',dx:-24,dy:-6},{t:'ra',at:[4,2],u:[-1,0],v:[0,1],st:'want'},{t:'pt',x:1,y:2,lab:'(1, 2)',dx:-8,a:'end'},{t:'pt',x:4,y:6,lab:'(4, 6)',dx:-8,a:'end'}],label:'Distance from (1, 2) to (4, 6)'}); };
VIZ.u8_pp = function(){ return P({x:[-4,4],y:[-4,5],items:[{t:'line',m:2,b:1},{t:'line',m:2,b:-3,st:'alt'},{t:'line',m:-0.5,b:1,st:'ans'},{t:'ra',at:[0,1],u:[1,2],v:[2,-1],st:'ans'},
  {t:'text',x:-2.3,y:-3.3,s:'m = 2',a:'end',pill:true},{t:'text',x:2.15,y:-1.2,s:'m = 2',a:'start',pill:true,st:'alt'},{t:'text',x:-3.8,y:3.6,s:'m = −½',a:'start',pill:true,st:'ans'}],label:'Parallel and perpendicular lines'}); };
VIZ.u8_par = function(){ return P({x:[-2,4],y:[-3,4],items:[{t:'line',m:2,b:-5,lab:'y = 2x − 5',lx:2.2,dx:44,dy:10},{t:'line',m:2,b:1,st:'ans',lab:'y = 2x + 1',lx:-1.3,dx:-6,dy:-14},{t:'pt',x:0,y:1,st:'ans',lab:'(0, 1)',dx:-8,a:'end',dy:-4}],label:'Line through (0, 1) parallel to y = 2x − 5'}); };
VIZ.u8_perp = function(){ return P({x:[-2,4],y:[-3,4],items:[{t:'line',m:2,b:-5,lab:'y = 2x − 5',lx:3.3,dx:-46,dy:6},{t:'line',m:-0.5,b:1,st:'ans',lab:'y = −½x + 1',lx:-1,dx:8,dy:-14},{t:'pt',x:0,y:1,st:'ans',lab:'(0, 1)',dx:8,dy:-8},{t:'ra',at:[2.4,-0.2],u:[1,2],v:[-2,1],st:'ans'}],label:'Line through (0, 1) perpendicular to y = 2x − 5'}); };
VIZ.u8_area = function(){ return P({x:[0,7],y:[0,5],ch:34,items:[{t:'poly',pts:[[1,1],[6,1],[6,4],[1,4]],st:'alt',lab:'A = 5 × 3 = 15',lx:3.5,ly:2.4},{t:'text',x:3.5,y:4,s:'width 6 − 1 = 5',dy:-8},{t:'text',x:6,y:2.5,s:'height 3',dx:8,a:'start'}],label:'Rectangle from (1,1) to (6,4)'}); };

add({id:'u8e1',u:8,type:'err',q:'Finn found the midpoint of <b>(−2, 1)</b> and <b>(4, 7)</b>.',steps:['x: (4 − (−2)) ÷ 2 = 3','y: (7 − 1) ÷ 2 = 3','Midpoint (3, 3)'],bad:0,
  why:'Midpoint means <b>average</b>: <b>add</b> the coordinates, then divide by 2. Finn subtracted.', fix:'((−2 + 4) ÷ 2, (1 + 7) ÷ 2) = (1, 4)',
  hint:'Look at the operation: add or subtract?',
  v:function(s){ return P({x:[-3,5],y:[0,8],ch:28,items:[{t:'seg',a:[-2,1],b:[4,7]},{t:'pt',x:-2,y:1,lab:'(−2, 1)',dx:8,dy:-4},{t:'pt',x:4,y:7,lab:'(4, 7)',dx:-8,a:'end'},s?{t:'pt',x:1,y:4,st:'ans',r:6.5,lab:'midpoint (1, 4)',dx:-10,a:'end',dy:-6}:{t:'pt',x:3,y:3,st:'bad',lab:'Finn: (3, 3)',dx:8,dy:14}],label:'Midpoint of (−2, 1) and (4, 7)'}); },
  vcap:'Is Finn’s point in the middle of the segment?'});
add({id:'u8e2',u:8,type:'err',q:'Gia found the distance from <b>(0, 0)</b> to <b>(6, 8)</b>.',steps:['Δx = 6 and Δy = 8','d = √(6² + 8²)','d = 6 + 8 = 14'],bad:2,
  why:'You can’t split a square root over a sum. Square, add, <b>then</b> take the root: √(36 + 64).', fix:'d = √100 = 10',
  v:function(s){ return P({x:[0,8],y:[0,9],ch:28,items:[{t:'rise',a:[0,0],b:[6,8],st:'want',run:'6',rise:'8'},{t:'seg',a:[0,0],b:[6,8],st:s?'ans':'bad',lab:s?'d = 10':'d = 14?',dx:-26,dy:-6},{t:'ra',at:[6,0],u:[-1,0],v:[0,1],st:'want'},{t:'pt',x:6,y:8,lab:'(6, 8)',dx:-8,a:'end'}],label:'Distance from (0, 0) to (6, 8)'}); }});
add({id:'u8e3',u:8,type:'err',q:'Hugo found a slope perpendicular to <b>y = 3x − 2</b>.',steps:['The given slope is 3','Perpendicular slope: −3'],bad:1,
  why:'Perpendicular slopes are <b>negative reciprocals</b>: flip the fraction AND change the sign. 3 = 3/1 → −1/3.', fix:'m = −'+fr(1,3)+'. Check: 3 · (−⅓) = −1 ✓',
  v:function(s){ return P({x:[-2,4],y:[-2,4],items:[{t:'line',m:3,b:-2,lab:'y = 3x − 2',lx:2.2,dx:10,dy:4},s?{t:'line',m:-1/3,b:4/3,st:'ans',lab:'m = −⅓',lx:-1,dx:0,dy:-10}:{t:'line',m:-3,b:4,st:'bad',dash:true,lab:'m = −3',lx:-0.6,dx:10,dy:-6},s?{t:'ra',at:[1,1],u:[1,3],v:[-3,1],st:'ans'}:null,{t:'pt',x:1,y:1,r:4}].filter(Boolean),label:'Perpendicular to y = 3x − 2'}); },
  vcap:'Do the lines meet at a right angle (a square corner)?'});

add({id:'u8q1',u:8,type:'mc',q:'Find the midpoint of <b>(−2, 4)</b> and <b>(6, 0)</b>.',opts:[
  {t:'(4, 4)',why:'Did you subtract? Add the x’s: −2 + 6 = 4, then divide by 2 → 2.'},{t:'(2, 2)'},{t:'(2, 4)',why:'For y: (4 + 0) ÷ 2 = 2, not 4.'},{t:'(4, 2)',why:'For x: (−2 + 6) ÷ 2 = 2. Remember to divide by 2.'}],ok:1,
  ex:'((−2 + 6) ÷ 2, (4 + 0) ÷ 2) = (4 ÷ 2, 4 ÷ 2) = <strong>(2, 2)</strong>.',
  v:function(s){ return P({x:[-3,7],y:[-1,5],ch:30,items:[{t:'seg',a:[-2,4],b:[6,0]},{t:'pt',x:-2,y:4,lab:'(−2, 4)',dx:8,dy:-6},{t:'pt',x:6,y:0,lab:'(6, 0)',dx:-8,a:'end',dy:-8},s?{t:'pt',x:2,y:2,st:'ans',r:6.5,lab:'(2, 2)',dx:-10,a:'end',dy:-6}:{t:'q',x:5,y:4,lab:'middle?',dx:-14,a:'end'}],label:'Midpoint of (−2, 4) and (6, 0)'}); }});
add({id:'u8q2',u:8,type:'mc',q:'What is the slope of a line perpendicular to <b>y = 2x + 1</b>?',opts:[
  {t:'2',why:'The same slope makes the lines <b>parallel</b>, not perpendicular.'},{t:'−2',why:'Also flip the 2: the reciprocal of 2 is ½.'},{t:fr(1,2),why:'Also change the sign: perpendicular slopes have opposite signs.'},{t:'−'+fr(1,2)}],ok:3,
  ex:'Perpendicular slope is the negative reciprocal: flip and negate 2 → <strong>−½</strong>. Check: 2 · (−½) = −1 ✓',
  v:function(s){ var it=[{t:'line',m:2,b:1,lab:'y = 2x + 1',lx:1.3,dx:12,dy:4}]; if (s){ it.push({t:'line',m:-0.5,b:1,st:'ans',lab:'m = −½',lx:-2.5,dy:-12}); it.push({t:'ra',at:[0,1],u:[1,2],v:[2,-1],st:'ans'}); } else it.push({t:'q',x:-2.5,y:-2.5,lab:'⊥ slope?'});
    return P({x:[-4,4],y:[-4,5],items:it,label:'Perpendicular to y = 2x + 1'}); }});
add({id:'u8q3',u:8,type:'mc',q:'Distance between <b>(0, 0)</b> and <b>(3, 4)</b>?',opts:[
  {t:'7',why:'3 + 4 = 7 adds the legs. Use √(3² + 4²).'},{t:'25',why:'25 is d². Take the square root: √25 = 5.'},{t:'5'},{t:'√7',why:'Square each leg first: 3² + 4² = 9 + 16 = 25.'}],ok:2,
  ex:'d = √(3² + 4²) = √(9 + 16) = √25 = <strong>5</strong>. Classic 3-4-5 triangle.',
  v:function(s){ return P({x:[0,5],y:[0,5],ch:44,items:[{t:'rise',a:[0,0],b:[3,4],st:'alt',run:'3',rise:'4'},{t:'seg',a:[0,0],b:[3,4],st:s?'ans':'want',lab:s?'d = 5':'d = ?',dx:-24,dy:-6},{t:'ra',at:[3,0],u:[-1,0],v:[0,1]},{t:'pt',x:3,y:4,lab:'(3, 4)',dx:8}],label:'Right triangle with legs 3 and 4'}); }});
add({id:'u8q4',u:8,type:'in',q:'Find the distance between <b>(−1, 1)</b> and <b>(5, 9)</b>.',kind:'num',ans:10,pre:'d =',ph:'number',show:'10',
  miss:[['14','6 + 8 = 14 adds the legs. Use √(6² + 8²).'],['100','100 is d². Take the square root.'],['sqrt(52)','Δx = 5 − (−1) = 6, not 4.'],['8.94','Δx = 5 − (−1) = 6, not 4.']],
  hint:'Δx = 5 − (−1) = 6. Δy = 9 − 1 = 8. d = √(6² + 8²).', ex:'d = √(6² + 8²) = √(36 + 64) = √100 = <strong>10</strong>.',
  v:function(s){ return P({x:[-2,6],y:[0,10],ch:24,ly:2,items:[{t:'rise',a:[-1,1],b:[5,9],st:'alt',run:s?'6':'Δx = ?',rise:s?'8':'Δy = ?'},{t:'seg',a:[-1,1],b:[5,9],st:s?'ans':'want',lab:s?'d = 10':'d = ?',dx:-24,dy:-6},{t:'pt',x:-1,y:1,lab:'(−1, 1)',dx:8,dy:-8},{t:'pt',x:5,y:9,lab:'(5, 9)',dx:-8,a:'end'}],label:'Distance from (−1, 1) to (5, 9)'}); }});
add({id:'u8q5',u:8,type:'in',q:'Find the midpoint of <b>(−3, 5)</b> and <b>(7, −1)</b>.',kind:'pt',ans:[2,2],pre:'',ph:'(x, y)',show:'(2, 2)',fmt:'Type a point like (3, -2).',
  miss:[['(5,-3)','That is half the difference. <b>Add</b> the coordinates, then divide by 2.'],['(4,4)','Divide by 2: (−3 + 7) ÷ 2 = 2 and (5 + (−1)) ÷ 2 = 2.'],['(2,3)','y: (5 + (−1)) ÷ 2 = 4 ÷ 2 = 2.']],
  hint:'x: (−3 + 7) ÷ 2. y: (5 + (−1)) ÷ 2.', ex:'((−3 + 7) ÷ 2, (5 − 1) ÷ 2) = <strong>(2, 2)</strong>.',
  v:function(s){ return P({x:[-4,8],y:[-2,6],ch:24,items:[{t:'seg',a:[-3,5],b:[7,-1]},{t:'pt',x:-3,y:5,lab:'(−3, 5)',dx:8,dy:-6},{t:'pt',x:7,y:-1,lab:'(7, −1)',dx:-8,a:'end',dy:-8},s?{t:'pt',x:2,y:2,st:'ans',r:6.5,lab:'(2, 2)',dx:10,dy:-4}:{t:'q',x:6,y:4,lab:'middle?',dx:-14,a:'end'}],label:'Midpoint of (−3, 5) and (7, −1)'}); }});
add({id:'u8q6',u:8,type:'in',q:'What is the slope of a line <b>parallel</b> to <b>y = −3x + 2</b>?',kind:'num',ans:-3,pre:'m =',ph:'number',show:'−3',
  miss:[['1/3','⅓ is the <b>perpendicular</b> slope. Parallel lines have the SAME slope.'],['3','Keep the sign: the slope is −3.'],['2','2 is the y-intercept. The slope is the number in front of x.']],
  hint:'Parallel lines have the same slope.', ex:'Parallel → same slope → <strong>m = −3</strong>.',
  v:function(s){ var it=[{t:'line',m:-3,b:2,lab:'y = −3x + 2',lx:-1,dx:12,dy:-2}]; if (s) it.push({t:'line',m:-3,b:-2,st:'ans',lab:'parallel: m = −3',lx:0.6,dx:10,dy:8}); else it.push({t:'q',x:2,y:3,lab:'parallel slope?',dx:-14,a:'end'});
    return P({x:[-3,3],y:[-5,6],ch:20,items:it,label:'Parallel to y = −3x + 2'}); }});
add({id:'u8q7',u:8,type:'in',q:'Find the area of the rectangle with corners <b>(−2, 1)</b>, <b>(4, 1)</b>, <b>(4, 5)</b>, <b>(−2, 5)</b>.',kind:'num',ans:24,pre:'Area =',ph:'square units',show:'24 square units',
  miss:[['20','20 is the perimeter (6 + 4 + 6 + 4). Area = width × height.'],['10','Multiply width and height: 6 × 4.'],['8','Width = 4 − (−2) = 6, not 2.'],['12','Width = 4 − (−2) = 6 (subtracting a negative adds).']],
  hint:'Width = 4 − (−2). Height = 5 − 1. Multiply.', ex:'Width 6, height 4 → A = 6 × 4 = <strong>24</strong> square units.',
  v:function(s){ return P({x:[-3,5],y:[0,6],ch:30,items:[{t:'poly',pts:[[-2,1],[4,1],[4,5],[-2,5]],st:s?'ans':'alt',lab:s?'A = 6 × 4 = 24':'A = ?',lx:1,ly:2.8},{t:'text',x:1,y:5,s:s?'width 6':'width ?',dy:-8},{t:'text',x:4,y:3,s:s?'height 4':'height ?',dx:6,a:'start'},{t:'pt',x:-2,y:1,r:4},{t:'pt',x:4,y:1,r:4},{t:'pt',x:4,y:5,r:4},{t:'pt',x:-2,y:5,r:4}],label:'Rectangle with corners (−2,1), (4,1), (4,5), (−2,5)'}); }});
