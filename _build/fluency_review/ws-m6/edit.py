import re, sys
base='/home/claude/mr-allen-s-math-class/_build/fluency_review/ws-m6/work/'
def edit(name, reps, delete_para=None):
    p=base+name+'/word/document.xml'; x=open(p,encoding='utf-8').read()
    for a,b in reps:
        n=x.count('>'+a+'<'); assert n==1,(name,a,n)
        x=x.replace('>'+a+'<','>'+b+'<')
    if delete_para:
        m=[mm for mm in re.finditer(r'<w:p>(?:(?!</w:p>).)*?</w:p>',x) if delete_para in mm.group(0)]
        assert len(m)==1; x=x[:m[0].start()]+x[m[0].end():]
    open(p,'w',encoding='utf-8').write(x)
DIV_OLD='(−36) ÷ 6  =  ______'; DIV_NEW='(−42) ÷ 6  =  ______'
edit('Mixed_Review',[
 ('All four operations with signs. Say the rule out loud before each one.','Say the sign rule out loud.'),
 ('Find and fix the mistake','Find the mistake'),
 ('Correct answer: ______   (subtracting a negative adds: 5 + 3)','Correct answer: ______'),
 ('Subtracting a negative adds. Two minuses make a plus.  ★','Two minuses make a plus.  ★'),
], delete_para='This student thought')
edit('Operations_Guided',[
 ('Different signs: subtract the values, keep the sign of the one farther from zero.','Different signs: subtract, keep sign farther from 0.'),
 ('Guided practice — fill in each step','Guided practice'),
 ('Different signs.  9 − 4 = ______ ,  bigger sign ______  →  ______','Different signs.  9 − 4 = ______ ,  sign farther from 0 ______  →  ______'),
 (DIV_OLD,DIV_NEW),
 ('Name the sign rule out loud, every time.  ★','Say the sign rule.  ★'),
])
edit('Operations_Light',[
 ('Copy the move — worked, then your turn','Copy the move'),
 (DIV_OLD,DIV_NEW),
])
