import sys,json,re
f,unit,page,dstd,mapj,mount_before=sys.argv[1:7]
s=open(f).read()
assert 'score-send.js' not in s, 'already patched'
stdmap=json.loads(mapj)
# 1. hook in mc()
anchor_re=re.compile(r"(function mc\(btn,(\w+),correct\)\{\n\s*(?:var|const) card=document\.getElementById\(\2\);\n\s*if\(card\.classList\.contains\('answered'\)\)return;\n\s*card\.classList\.add\('answered'\);\n)")
m=anchor_re.search(s); assert m, 'mc anchor'
qv=m.group(2)
hook="  try{if(window.ScoreSend)ScoreSend.record(%s,btn.textContent.trim()===correct.trim(),{std:ssStd(%s),label:ssLabel(card)});}catch(e){}\n"%(qv,qv)
s=s[:m.end()]+hook+s[m.end():]
helpers=("var SS_STD=%s;\nfunction ssStd(id){return SS_STD[id]||'%s';}\n"
 "function ssLabel(card){var n=card.querySelector('.qnum,.q-num'),t=card.querySelector('.qt,.q-text');"
 "return ((n?n.textContent.trim().replace(/\\s+/g,' '):card.id)+(t?': '+t.textContent.trim().replace(/\\s+/g,' '):'')).slice(0,80);}\n")%(json.dumps(stdmap,ensure_ascii=False),dstd)
s=s[:m.start()]+helpers+s[m.start():]
# 2. mount
assert s.count(mount_before.encode().decode('unicode_escape'))==1, 'mount anchor count %d'%s.count(mount_before.encode().decode('unicode_escape'))
mb=mount_before.encode().decode('unicode_escape')
s=s.replace(mb,'<div id="ss-mount"></div>\n'+mb)
# 3. scripts before </body>
assert s.count('</body>')==1
inc=('<script src="../tracker-config.js"></script>\n<script src="../score-send.js"></script>\n'
     "<script> ScoreSend.setup({ kind:'practice', unit:'%s', page:'%s', mount:'#ss-mount', std:'%s', band:4 }); </script>\n")%(unit,page,dstd)
s=s.replace('</body>',inc+'</body>')
open(f,'w').write(s)
print('patched',f)
