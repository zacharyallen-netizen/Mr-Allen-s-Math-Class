import sys; sys.path.insert(0,'.')
from edit_m2 import edit
N='\xa0'
def row(a,b,w=18): return a+N*(w-len(a))+b
E={
 'MultiDigit_Guided':{
   44:['Ones:      4 × 8 = ____  →  write ____, carry ____'],
   45:['Tens:      4 × 2 = ____, + carry ____ = ____  →  write ____, carry ____'],
   46:['Hundreds:  4 × 1 = ____, + carry ____ = ____'],
   28:['Ones:  7 × 3 = ____  →  write ____, carry ____'],
   29:['Tens:  7 × 5 = ____, + carry ____ = ____'],
   80:[row('48 × 6 = ______','72 × 8 = ______',24)],
   81:[row('235 × 4 = ______','56 × 37 = ______',24)],
 },
 'MultiDigit_Light':{
   34:[N*6+'3'+N+'8'], 35:['×'+N*5+'2'+N+'4'], 36:[N*2+'─'*7], 37:[N*2+'_'*7],
   80:[row('67 × 7 = ______','128 × 6 = ______',24)],
   81:[row('54 × 43 = ______','316 × 8 = ______',24)],
 }}
for k,v in E.items(): edit(f'u_{k}/word/document.xml',v); print('ok',k)
