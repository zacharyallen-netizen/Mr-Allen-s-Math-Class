import sys,os
D=os.path.dirname(os.path.abspath(__file__))
OUT='/home/claude/mr-allen-s-math-class/math1/'
lib=open(D+'/src/lib.js').read(); css=open(D+'/src/style.css').read()
for n in sys.argv[1:]:
    s=open(D+'/src/'+n).read()
    s=s.replace('<!--STYLE-->','<style>\n'+css+'</style>').replace('<!--LIB-->','<script>\n'+lib+'</script>')
    open(OUT+n,'w').write(s); print('built',n,len(s))
