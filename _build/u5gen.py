#!/usr/bin/env python3
import re, math
F='/home/claude/mr-allen-s-math-class/grade8/Unit_5_Pythagorean_Guided_Notes.html'
NAVY='#1E2D4F'; GOLD='#b08800'; BLUE='#0056B3'; GREEN='#1a7000'; FILL='#eef4ff'; GRID='#d7def0'
def svg(w,h,b): return f'<svg width="{w:.0f}" height="{h:.0f}" viewBox="0 0 {w:.0f} {h:.0f}" xmlns="http://www.w3.org/2000/svg">{b}</svg>'
def T(x,y,s,col,anchor='middle',size=12.5,weight='bold'):
    return f'<text x="{x:.1f}" y="{y:.1f}" text-anchor="{anchor}" font-family="Arvo,serif" font-size="{size}" font-weight="{weight}" fill="{col}">{s}</text>'

def rtri(a,b,hlab,vlab,clab, ax_col=BLUE, hyp_col=GOLD):
    # a=horizontal units, b=vertical units (for proportion); labels for horiz, vert, hyp
    S=116.0/max(a,b); w=a*S; h=b*S
    ox=28; oy=16; W=w+78; H=h+46
    cx0,cy0=ox,oy+h            # bottom-left (right angle)
    body =f'<polygon points="{ox:.1f},{oy+h:.1f} {ox+w:.1f},{oy+h:.1f} {ox:.1f},{oy:.1f}" fill="{FILL}" stroke="{NAVY}" stroke-width="2.5"/>'
    body+=f'<path d="M {ox:.1f} {oy+h-12:.1f} h 12 v 12" fill="none" stroke="{NAVY}" stroke-width="1.5"/>'  # right angle
    body+=T(ox+w/2, oy+h+18, hlab, ax_col)                     # horizontal leg label
    body+=T(ox-8, oy+h/2+4, vlab, ax_col, 'end')               # vertical leg label
    body+=T(ox+w/2+16, oy+h/2-4, clab, hyp_col)                # hyp label
    body+=f'<line x1="{ox:.1f}" y1="{oy:.1f}" x2="{ox+w:.1f}" y2="{oy+h:.1f}" stroke="{hyp_col}" stroke-width="3"/>'
    return svg(W,H,body)

def rect_diag(w_u,h_u,wlab,hlab,dlab):
    S=120.0/max(w_u,h_u); w=w_u*S; h=h_u*S; ox=16; oy=16; W=w+40; H=h+40
    body =f'<rect x="{ox}" y="{oy}" width="{w:.1f}" height="{h:.1f}" fill="{FILL}" stroke="{NAVY}" stroke-width="2.5"/>'
    body+=f'<line x1="{ox}" y1="{oy+h:.1f}" x2="{ox+w:.1f}" y2="{oy:.1f}" stroke="{GOLD}" stroke-width="3"/>'
    body+=T(ox+w/2, oy+h+16, wlab, BLUE)
    body+=T(ox-6, oy+h/2+4, hlab, BLUE, 'end')
    body+=T(ox+w/2+14, oy+h/2-2, dlab, GOLD)
    return svg(W,H,body)

def ladder(hyp_lab, base_lab, h_lab, base_u, h_u):
    S=118.0/max(base_u,h_u); w=base_u*S; h=h_u*S; ox=34; oy=14; W=w+54; H=h+40
    gy=oy+h
    body =f'<line x1="{ox}" y1="{oy}" x2="{ox}" y2="{gy:.1f}" stroke="{NAVY}" stroke-width="4"/>'       # wall
    body+=f'<line x1="{ox-6}" y1="{gy:.1f}" x2="{ox+w+10:.1f}" y2="{gy:.1f}" stroke="{NAVY}" stroke-width="3"/>' # ground
    body+=f'<path d="M {ox} {gy-12:.1f} h 12 v 12" fill="none" stroke="{NAVY}" stroke-width="1.5"/>'
    body+=f'<line x1="{ox}" y1="{oy:.1f}" x2="{ox+w:.1f}" y2="{gy:.1f}" stroke="{GOLD}" stroke-width="4"/>' # ladder
    body+=T(ox+w/2+2, gy+16, base_lab, BLUE)
    body+=T(ox-8, oy+h/2+4, h_lab, GREEN, 'end')
    body+=T(ox+w/2+14, oy+h/2-2, hyp_lab, GOLD)
    return svg(W,H,body)

def coord(x1,y1,x2,y2):
    pad=1; minx=min(x1,x2)-pad; maxx=max(x1,x2)+pad; miny=min(y1,y2)-pad; maxy=max(y1,y2)+pad
    left=26; top=12; gw=180; gh=170
    s=min(gw/(maxx-minx), gh/(maxy-miny))
    W=left+(maxx-minx)*s+14; H=top+(maxy-miny)*s+22
    def X(g): return left+(g-minx)*s
    def Y(g): return top+(maxy-g)*s
    body=''
    for gx in range(math.ceil(minx),int(maxx)+1):
        body+=f'<line x1="{X(gx):.1f}" y1="{top:.1f}" x2="{X(gx):.1f}" y2="{top+(maxy-miny)*s:.1f}" stroke="{GRID}" stroke-width="1"/>'
    for gy in range(math.ceil(miny),int(maxy)+1):
        body+=f'<line x1="{left:.1f}" y1="{Y(gy):.1f}" x2="{left+(maxx-minx)*s:.1f}" y2="{Y(gy):.1f}" stroke="{GRID}" stroke-width="1"/>'
    if minx<=0<=maxx: body+=f'<line x1="{X(0):.1f}" y1="{top:.1f}" x2="{X(0):.1f}" y2="{top+(maxy-miny)*s:.1f}" stroke="{NAVY}" stroke-width="1.6"/>'
    if miny<=0<=maxy: body+=f'<line x1="{left:.1f}" y1="{Y(0):.1f}" x2="{left+(maxx-minx)*s:.1f}" y2="{Y(0):.1f}" stroke="{NAVY}" stroke-width="1.6"/>'
    # right-triangle legs (dashed) + hyp
    cx,cy=X(x2),Y(y1)
    body+=f'<line x1="{X(x1):.1f}" y1="{Y(y1):.1f}" x2="{cx:.1f}" y2="{cy:.1f}" stroke="{BLUE}" stroke-width="2" stroke-dasharray="4 3"/>'
    body+=f'<line x1="{cx:.1f}" y1="{cy:.1f}" x2="{X(x2):.1f}" y2="{Y(y2):.1f}" stroke="{BLUE}" stroke-width="2" stroke-dasharray="4 3"/>'
    body+=f'<line x1="{X(x1):.1f}" y1="{Y(y1):.1f}" x2="{X(x2):.1f}" y2="{Y(y2):.1f}" stroke="{GOLD}" stroke-width="3"/>'
    body+=T((X(x1)+cx)/2, cy+ (14 if y1<=y2 else -6), str(abs(x2-x1)), BLUE, size=11)
    body+=T(cx+(10 if x2>=x1 else -10), (cy+Y(y2))/2+4, str(abs(y2-y1)), BLUE, 'middle', 11)
    body+=T((X(x1)+X(x2))/2-10, (Y(y1)+Y(y2))/2-4, 'd', GOLD, 'end')
    for (px,py) in [(x1,y1),(x2,y2)]:
        body+=f'<circle cx="{X(px):.1f}" cy="{Y(py):.1f}" r="4" fill="{NAVY}"/>'
        body+=T(X(px)+2, Y(py)-8, f'({px},{py})', NAVY, 'middle', 10.5, 'bold')
    return svg(W,H,body)

def gen(qid, q):
    s=q.replace("−","-")
    if qid.startswith('u5pA'):
        a,b=[int(x) for x in re.findall(r'\d+', s)[1:3]]  # skip problem number
        return rtri(max(a,b),min(a,b), str(max(a,b)), str(min(a,b)), 'c = ?')
    if qid.startswith('u5pB'):
        nums=[int(x) for x in re.findall(r'\d+', s)]
        leg=nums[1]; hyp=nums[2]; other=int(round((hyp**2-leg**2)**0.5))
        return rtri(leg, other, str(leg), '?', str(hyp))
    if qid.startswith('u5pD'):
        m=re.findall(r'\(\s*(-?\d+)\s*,\s*(-?\d+)\s*\)', s)
        (x1,y1),(x2,y2)=[(int(a),int(b)) for a,b in m[:2]]
        return coord(x1,y1,x2,y2)
    return None

def genC(idx, q):
    nums=[int(x) for x in re.findall(r'\d+', q)][1:]
    if 'ladder' in q.lower():
        hyp,base=nums[0],nums[1]; return ladder(f'{hyp} ft',f'{base} ft','h = ?',base, int(round((hyp**2-base**2)**0.5)))
    if 'kite' in q.lower():
        string,ground=nums[0],nums[1]; return ladder(f'{string} m',f'{ground} m','h = ?',ground,int(round((string**2-ground**2)**0.5)))
    if 'TV' in q or 'rectangular' in q.lower():
        w,h=nums[0],nums[1]; return rect_diag(w,h,f'{w} in',f'{h} in','d = ?')
    if 'pool' in q.lower():
        w,h=nums[0],nums[1]; return rect_diag(w,h,f'{w} m',f'{h} m','d = ?')
    if 'diamond' in q.lower() or 'baseball' in q.lower():
        sline=nums[0]; return rect_diag(sline,sline,f'{sline} ft',f'{sline} ft','d = ?')
    if 'beam' in q.lower():
        a,b=nums[0],nums[1]; return rtri(a,b,f'{a} ft',f'{b} ft','c = ?')
    return None

h=open(F).read()
# A, B, D blocks
def inj(m):
    block=m.group(0); qid=m.group(1)
    qm=re.search(r'<div class="chk-q"[^>]*>(.*?)</div>', block, re.S)
    if not qm: return block
    s=gen(qid, qm.group(1))
    if not s: return block
    return block.replace(qm.group(0), qm.group(0)+f'\n  <div style="text-align:center;margin:4px 0 8px">{s}</div>',1)
h=re.sub(r'<div class="chk" id="(u5p[ABD]\d+)".*?</div>\s*</div>', inj, h, flags=re.S)

# C word problems (.sa blocks) -- add a counter
cidx=[0]
def injC(m):
    block=m.group(0); cidx[0]+=1
    qm=re.search(r'<div class="chk-q">(.*?)</div>', block, re.S)
    if not qm: return block
    s=genC(cidx[0], re.sub(r'<[^>]+>','',qm.group(1)))
    if not s: return block
    return block.replace(qm.group(0), qm.group(0)+f'\n  <div style="text-align:center;margin:6px 0 4px">{s}</div>',1)
h=re.sub(r'<div class="sa">.*?</div>\s*</div>', injC, h, flags=re.S)

open(F,'w').write(h)
print("Unit5 svg count now:", h.count('<svg'))
