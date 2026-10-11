import sys,re,os
D=os.path.dirname(os.path.abspath(__file__))
css=open(D+'/lib.css').read(); js=open(D+'/lib.js').read()
pages={'u3n.html':'unit3-notes.html','u3p.html':'unit3-practice.html','u4n.html':'unit4-notes.html','u4p.html':'unit4-practice.html'}
for src,dst in pages.items():
    p=D+'/'+src
    if not os.path.exists(p): continue
    s=open(p).read()
    assert '<!--M1CSS-->' in s and '<!--M1JS-->' in s, src
    s=s.replace('<!--M1CSS-->','<style>\n'+css+'</style>').replace('<!--M1JS-->','<script>\n'+js+'</script>')
    open('/home/claude/mr-allen-s-math-class/math1/'+dst,'w').write(s)
    print('built',dst,len(s))
