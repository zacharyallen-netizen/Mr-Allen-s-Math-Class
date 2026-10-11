const K=require('./lib/kit.js');
const T=(type,inp,ans,spec={})=>{const g=K.R[type](K.clean(inp));return [inp, g==null?'PARSEFAIL':K.same(type,g,ans,spec)];};
const cases=[
['num','5',5],['num','d = 5',5],['num','5 units',5],['num','sqrt(25)',5],['num','√25',5],['num','-5/4',-1.25],['num','−5/4',-1.25],['num','-1.25',-1.25],['num','m=-5/4',-1.25],['num','−⁵⁄₄',-1.25],['num','4.0',4],['num','144 ft',144],['num','2 s',2],['num','24 square units',24],['num','sqrt10',Math.sqrt(10)],['num','2sqrt(10)',2*Math.sqrt(10)],
['pt','(1,4)',[1,4]],['pt','1,4',[1,4]],['pt','( 1 , 4 )',[1,4]],['pt','M(1,4)',[1,4]],['pt','(5, −1)',[5,-1]],['pt','x=1, y=4',[1,4]],['pt','(1.5, 2)',[1.5,2]],
['set','x=-3,1',[-3,1]],['set','-3, 1',[-3,1]],['set','x = −3 and x = 1',[-3,1]],['set','1,-3',[-3,1]],['set','(-3,0) and (1,0)',[-3,1]],['set','x=1 or x=5',[1,5]],
['expr','x^2+2x-3','x^2+2x-3'],['expr','y = x² + 2x − 3','x^2+2x-3'],['expr','2x+x^2-3','x^2+2x-3'],['expr','A(x)=x^2+5x','x^2+5x'],['expr','(f+g)(x) = x^2+2x-2','x^2+2x-2'],['expr','h(t)=-16t^2+3t','-16t^2+3t'],['expr','x(x+5)','x^2+5x'],
['line','y=2x+1',{m:2,b:1}],['line','y = 2x + 1',{m:2,b:1}],['line','2x+1',{m:2,b:1}],['line','y-3=2(x-1)',{m:2,b:1}],['line','y=-1/2x+4',{m:-0.5,b:4}],['line','y=−½x+4',{m:-0.5,b:4}],['line','x=2',{vert:true,x:2}],
['ineq','y>=-4',{op:'>=',v:-4}],['ineq','y ≥ −4',{op:'>=',v:-4}],['ineq','-4<=y',{op:'>=',v:-4}],['ineq','[-4,inf)',{op:'>=',v:-4}],['ineq','[−4, ∞)',{op:'>=',v:-4}],['ineq','(-inf,4]',{op:'<=',v:4}],['ineq','y<=4',{op:'<=',v:4}],
// should be false
['num','6',5],['pt','(4,1)',[1,4]],['set','3,-1',[-3,1]],['line','y=2x+3',{m:2,b:1}],['ineq','y>-4',{op:'>=',v:-4}],
];
cases.forEach(c=>console.log(JSON.stringify(T(c[0],c[1],c[2]))));
