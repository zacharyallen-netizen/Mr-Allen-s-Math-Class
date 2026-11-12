import json, re, subprocess, glob, os
src = open('crops.js').read(); C = json.loads(src[src.index('{'):src.rindex('}')+1])
out = {}
for hw, probs in C.items():
    pdf = glob.glob(f'HW_{hw}_*.pdf'); 
    if not pdf: continue
    pdf = pdf[0]
    info = subprocess.run(['pdfinfo', pdf], capture_output=True, text=True).stdout
    w, h = [float(x) for x in re.search(r'Page size:\s+([\d.]+) x ([\d.]+)', info).groups()]
    for n, (pg, x0, y0, x1, y1) in probs.items():
        # crops trim the empty writing space, so read a bit further down too
        t = subprocess.run(['pdftotext', '-f', str(pg), '-l', str(pg), '-x', str(int(x0*w)), '-y', str(int(y0*h)), '-W', str(int((x1-x0)*w)), '-H', str(int(min(1-y0, (y1-y0)+0.08)*h)), pdf, '-'], capture_output=True, text=True).stdout
        out.setdefault(hw, {})[n] = re.sub(r'\s+', ' ', t).strip()[:400]
json.dump(out, open('/home/claude/fix/hw_text.json', 'w'), indent=1)
print(len(out), sum(len(v) for v in out.values()))
