import re,sys
s=open(sys.argv[1]).read()
seen=set()
for m in re.finditer(r"""onclick="mc\(this,\s*'([^']+)'""",s):
    q=m.group(1)
    if q in seen: continue
    seen.add(q)
    i=s.find('id="%s"'%q)
    pane=s.rfind('tab-pane',0,i); pid=re.search(r'id="([^"]+)"',s[s.rfind('<',0,pane):pane+60]) if pane>0 else None
    txt=re.sub(r'<[^>]+>',' ',s[i:m.start()]); txt=re.sub(r'\s+',' ',txt)
    print(q,'|',pid.group(1) if pid else '-','|',txt[12:170])
