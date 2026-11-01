import json
from fractions import Fraction as F
from statistics import median
K=json.load(open('keys.json'))
def five(d):
    s=sorted(d);n=len(s);lo=s[:n//2];hi=s[(n+1)//2:];return [s[0],median(lo),median(s),median(hi),s[-1]]
def mad(d):
    m=F(sum(d),len(d));return float(sum(abs(v-m) for v in d)/len(d))
def poly(*fs):
    r=[1]
    for f in fs:
        n=[0]*(len(r)+len(f)-1)
        for i,a in enumerate(r):
            for j,b in enumerate(f): n[i+j]+=a*b
        r=n
    return r
def pstr(c):
    out='';
    for d in range(len(c)-1,-1,-1):
        v=c[d]
        if v==0: continue
        a=abs(v);coef='' if (d>0 and a==1) else str(a);t=coef+('' if d==0 else ('x' if d==1 else 'x²'))
        out+= ((' − ' if v<0 else ' + ')+t) if out else (('−' if v<0 else '')+t)
    return out
def roots(a,b,c):
    d=b*b-4*a*c;r=d**0.5;return sorted([(-b+r)/(2*a),(-b-r)/(2*a)])
E={'unit5-notes.html':{'fm51':'2','fm51b':median([9,2,7,4,5]),
 **{'yt51.'+k:v for k,v in zip(['min','q1','med','q3','max'],five([3,8,6,1,9,4,7]))},
 'fm52':'3','fm52b':mad([3,5,7,9,16]),'yt52.mean':5,'yt52.med':4,'yt52.rng':7,'yt52.mad':mad([2,4,4,6,9]),
 'fm53':'2','fm53b':10.5+6,'yt53.q1':14.5,'yt53.q3':18.5,'yt53.iqr':4,'yt53.uf':24.5,'yt53b':'yes',
 'fm54':'2','fm54b':17,'yt54':13,'yt54b':'e','fm55':'1','fm55b':-3,'yt55':-2.5,'yt55b':'sn','fm56':'2','yt56':'c'},
'unit5-practice.html':{'a1':'10','a2':24,'a3':None,'a4':1000/24,'b1':7,'b2':4,'b3':12,'b4':15,'b4b':'no','c1':'positive','c2':81,'c3':6,'c4':60,'d1':-2,'d2':'b','d3':3,'d3b':'under',
 'e1':7,'e2':7.5,'e3':1.25,'e4':'A',**{'f1.'+k:v for k,v in zip(['min','q1','med','q3','max'],five([12,5,18,9,30,14,10,8,16,11,7]))},'f2':28,'f3':'yes','f4':'median',
 'g1':'0.95','g2':'-0.5','g3':'0','g4':'sn','h1':'2','h1b':6,'h2':'2','h2b':32,'h3':'1','h3b':4},
'unit6-notes.html':{'fm61':'1','fm61b':pstr(poly([3,1],[3,1])),'yt61':pstr(poly([4,1],[1,1])),'yt61b':pstr(poly([-2,1],[5,1])),'fm62':'2','fm62b':pstr([-15,-2,1]),'yt62':pstr([20,9,1]),
 'fm63':'2','yt63':pstr([-25,0,4]),'yt63b':pstr([8,10,3]),'fm64':'2','fm64b':[4,-1],'yt64':[-6,1],'fm65':'2','fm65b':[6,-6],'yt65':[5,-2],'yt65b':[5,-5],
 'fm66':'2','fm66b':[3,-4],'yt66':[1,-9],'fm67':'2','fm67b':16,'yt67.add':4,'yt67.sol':[2,-6],'fm68':'2','fm68b':[1,5],'yt68.d':36,'yt68.sol':[4,-2]},
'unit6-practice.html':{'a1':pstr(poly([3,1],[2,1])),'a2':pstr(poly([-4,1],[4,1])),'a3':pstr(poly([1,2],[-3,1])),'a4':pstr(poly([5,1],[5,1])),'a5':pstr([6,-6,2]),'a6':pstr(poly([-2,1],[-5,1])),
 'b1':pstr(poly([3,1],[4,1])),'b2':pstr(poly([3,1],[-3,1])),'b3':pstr(poly([-1,2],[3,1])),'b4':pstr([0,12,3]),'b5':pstr(poly([3,1],[-6,1])),'b6':pstr(poly([5,1],[5,1])),
 'c1':[2,3],'c2':[7,-7],'c3':[0,-4],'c4':[2,-2],'d1':'a','d2':pstr(poly([1,1],[-3,1])),'d3':[1,-4],'e1':16,'e2':[2,-8],'f1':49,'f2':[2,-5],'f3':roots(2,-4,-3),
 'g1':'1','g1b':pstr(poly([4,1],[4,1])),'g2':'2','g2b':[4,-3],'g3':'2','g3b':[5,-1]}}
# sanity: the factor problems really factor as stated in the solution text
assert poly([-1,2],[3,1])==[-3,5,2]; assert poly([4,3],[2,1])==[8,10,3]; assert poly([1,2],[3,1])==[3,7,2]
bad=0
for pg,exp in E.items():
    got=K[pg]
    for k,v in exp.items():
        if v is None: continue
        g=got.get(k)
        ok = (sorted(g)==sorted(v) or all(abs(a-b)<1e-6 for a,b in zip(sorted(g),sorted(v)))) if isinstance(v,list) else (abs(g-v)<1e-6 if isinstance(v,(int,float)) and not isinstance(v,bool) else str(g)==str(v))
        if not ok: bad+=1;print('MISMATCH',pg,k,g,v)
    missing=set(got)-set(exp); 
    if missing: print('unchecked',pg,missing)
print('checked',sum(len(e) for e in E.values()),'mismatches',bad)
