#!/usr/bin/env python3
# Generate high-quality labeled SVG diagrams for Unit 4 Part 2 practice problems
# and inject one into each .chk block. Preserves all existing text.
import re, math

F='/home/claude/mr-allen-s-math-class/grade8/Unit_4_Geometry_Guided_Notes.html'
NAVY='#1E2D4F'; GOLD='#b08800'; GREEN='#1a7000'; BLUE='#0056B3'; GIVEN='#0056B3'; XCOL='#b08800'
LINE='#1E2D4F'

def P(V,r,a): return (V[0]+r*math.cos(math.radians(a)), V[1]-r*math.sin(math.radians(a)))
def arc(V,r,a1,a2,color,w=2.5):
    # math angles, CCW from a1 to a2; ensure a2>a1
    while a2<a1: a2+=360
    large=1 if (a2-a1)>180 else 0
    p1=P(V,r,a1); p2=P(V,r,a2)
    # SVG y-down: increasing math angle appears clockwise -> sweep-flag=0 for CCW visual.
    return f'<path d="M {p1[0]:.1f} {p1[1]:.1f} A {r} {r} 0 {large} 0 {p2[0]:.1f} {p2[1]:.1f}" fill="none" stroke="{color}" stroke-width="{w}"/>'
def lbl(V,r,a,text,color,size=13):
    p=P(V,r,a)
    return f'<text x="{p[0]:.1f}" y="{p[1]+4:.1f}" text-anchor="middle" font-family="Arvo,serif" font-size="{size}" font-weight="bold" fill="{color}">{text}</text>'
def ray(V,ang,L,color,w=3):
    p=P(V,ang,L); return f'<line x1="{V[0]}" y1="{V[1]}" x2="{p[0]:.1f}" y2="{p[1]:.1f}" stroke="{color}" stroke-width="{w}"/>'
def svg(w,h,body): return f'<svg width="{w}" height="{h}" viewBox="0 0 {w} {h}" xmlns="http://www.w3.org/2000/svg">{body}</svg>'

def supp(G):            # straight line + ray; left angle=G, right=x (=180-G)
    V=(96,82); th=180-G
    body =f'<line x1="14" y1="82" x2="178" y2="82" stroke="{LINE}" stroke-width="3"/>'
    body+=ray(V,th,60,GOLD)
    body+=f'<circle cx="{V[0]}" cy="{V[1]}" r="3" fill="{NAVY}"/>'
    body+=arc(V,26,th,180,GIVEN)+lbl(V,40,(th+180)/2,f'{G}°',GIVEN)
    body+=arc(V,20,0,th,XCOL)+lbl(V,34,th/2,'x°',XCOL)
    return svg(192,104,body)

def comp(G):            # right angle split; bottom=G, top=x (=90-G)
    V=(60,90); th=G
    body =f'<line x1="60" y1="90" x2="176" y2="90" stroke="{LINE}" stroke-width="3"/>'
    body+=f'<line x1="60" y1="90" x2="60" y2="16" stroke="{LINE}" stroke-width="3"/>'
    body+=f'<rect x="60" y="78" width="12" height="12" fill="none" stroke="{LINE}" stroke-width="1.5"/>'  # right-angle mark
    body+=ray(V,th,74,GOLD)
    body+=f'<circle cx="{V[0]}" cy="{V[1]}" r="3" fill="{NAVY}"/>'
    body+=arc(V,24,0,th,GIVEN)+lbl(V,40,th/2,f'{G}°',GIVEN)
    body+=arc(V,30,th,90,XCOL)+lbl(V,46,(th+90)/2,'x°',XCOL)
    return svg(192,110,body)

def vertical(G):        # two crossing lines; given angle and its vertical = x (equal)
    V=(96,62)
    body =f'<line x1="18" y1="62" x2="174" y2="62" stroke="{LINE}" stroke-width="3"/>'          # horizontal
    body+=f'<line x1="44" y1="104" x2="148" y2="20" stroke="{LINE}" stroke-width="3"/>'          # slanted (~ -39deg)
    body+=f'<circle cx="{V[0]}" cy="{V[1]}" r="3" fill="{NAVY}"/>'
    sl=math.degrees(math.atan2(104-62,44-96)) # angle of slanted ray going down-left ~ 180+39
    # top region between 0deg(right) and slant-up(~39deg) ... mark top angle given, bottom vertical = x
    body+=arc(V,22,0,39,GIVEN)+lbl(V,38,19,f'{G}°',GIVEN)
    body+=arc(V,22,180,219,XCOL)+lbl(V,40,199,'x°',XCOL)
    body+=f'<text x="96" y="100" text-anchor="middle" font-family="Arvo,serif" font-size="10.5" fill="{GREEN}" font-weight="bold">vertical → equal</text>'
    return svg(192,112,body)

def transversal(rel,G):
    # two parallel lines (y=42,y=96) + transversal; mark given at top, x at related pos
    body =f'<line x1="14" y1="42" x2="182" y2="42" stroke="{LINE}" stroke-width="3"/>'
    body+=f'<line x1="14" y1="96" x2="182" y2="96" stroke="{LINE}" stroke-width="3"/>'
    body+=f'<path d="M44,36 L50,42 L44,48" fill="none" stroke="{LINE}" stroke-width="1.5"/>'
    body+=f'<path d="M44,90 L50,96 L44,102" fill="none" stroke="{LINE}" stroke-width="1.5"/>'
    body+=f'<line x1="78" y1="18" x2="150" y2="120" stroke="{GOLD}" stroke-width="3"/>'
    A=(96,42); B=(132,96)
    body+=f'<circle cx="96" cy="42" r="2.5" fill="{NAVY}"/><circle cx="132" cy="96" r="2.5" fill="{NAVY}"/>'
    cong = rel!='Co-Interior'
    cc = GREEN if cong else '#b23b00'
    note = 'equal' if cong else 'add to 180°'
    # choose label spots per relationship (given near A, x near B)
    if rel=='Corresponding':
        gx,gy,xx,xy=112,34,148,88
    elif rel=='Alternate Interior':
        gx,gy,xx,xy=112,58,116,86
    elif rel=='Alternate Exterior':
        gx,gy,xx,xy=82,34,150,112
    else:
        gx,gy,xx,xy=112,58,148,86
    body+=f'<text x="{gx}" y="{gy}" text-anchor="middle" font-family="Arvo,serif" font-size="12.5" font-weight="bold" fill="{GIVEN}">{G}°</text>'
    body+=f'<text x="{xx}" y="{xy}" text-anchor="middle" font-family="Arvo,serif" font-size="12.5" font-weight="bold" fill="{XCOL}">x°</text>'
    body+=f'<text x="98" y="136" text-anchor="middle" font-family="Arvo,serif" font-size="10.5" font-weight="bold" fill="{cc}">{rel} → {note}</text>'
    return svg(196,144,body)

def triangle_sum(a,b):
    # triangle vertices; label two given angles and x at third
    body =f'<polygon points="24,104 172,104 70,26" fill="#f4f7fd" stroke="{LINE}" stroke-width="2.5"/>'
    # bottom-left vertex (24,104): angle a ; bottom-right (172,104): angle b ; top (70,26): x
    body+=f'<text x="40" y="98" font-family="Arvo,serif" font-size="12.5" font-weight="bold" fill="{GIVEN}">{a}°</text>'
    body+=f'<text x="150" y="98" font-family="Arvo,serif" font-size="12.5" font-weight="bold" fill="{GIVEN}" text-anchor="end">{b}°</text>'
    body+=f'<text x="70" y="46" font-family="Arvo,serif" font-size="12.5" font-weight="bold" fill="{XCOL}" text-anchor="middle">x°</text>'
    return svg(192,118,body)

def exterior(remote1, remote2=None, ext=None, find='ext'):
    # triangle with base extended to the right; exterior angle at bottom-right
    body =f'<polygon points="30,100 150,100 74,30" fill="#f4f7fd" stroke="{LINE}" stroke-width="2.5"/>'
    body+=f'<line x1="150" y1="100" x2="196" y2="100" stroke="{LINE}" stroke-width="2.5"/>'  # extension
    # remote interiors: top (74,30) and bottom-left (30,100); exterior at bottom-right (150,100)
    if find=='ext':  # remotes given (remote1 top, remote2 bottom-left), exterior x
        body+=f'<text x="74" y="50" text-anchor="middle" font-family="Arvo,serif" font-size="12" font-weight="bold" fill="{GIVEN}">{remote1}°</text>'
        body+=f'<text x="44" y="94" font-family="Arvo,serif" font-size="12" font-weight="bold" fill="{GIVEN}">{remote2}°</text>'
        body+=f'<text x="166" y="92" font-family="Arvo,serif" font-size="12.5" font-weight="bold" fill="{XCOL}">x°</text>'
    else:            # one remote given + exterior given; find other remote interior x (top)
        body+=f'<text x="74" y="50" text-anchor="middle" font-family="Arvo,serif" font-size="12" font-weight="bold" fill="{XCOL}">x°</text>'
        body+=f'<text x="44" y="94" font-family="Arvo,serif" font-size="12" font-weight="bold" fill="{GIVEN}">{remote1}°</text>'
        body+=f'<text x="162" y="92" font-family="Arvo,serif" font-size="12" font-weight="bold" fill="{GIVEN}">{ext}°</text>'
    return svg(206,112,body)

def gen_for(qid, q):
    s=q
    def num(after):
        m=re.search(after+r'\s*(\d+)', s); return int(m.group(1)) if m else None
    if qid.startswith('u4pA'):
        g=int(re.search(r'given\s*(\d+)', s).group(1))
        if 'Supplementary' in s or 'Linear Pair' in s: return supp(g)
        if 'Complementary' in s: return comp(g)
        if 'Vertical' in s: return vertical(g)
    if qid.startswith('u4pB'):
        g=int(re.search(r'given\s*(\d+)', s).group(1))
        if 'Same-Side Interior' in s: return transversal('Co-Interior',g)
        for rel in ['Corresponding','Alternate Interior','Alternate Exterior','Co-Interior']:
            if rel in s: return transversal(rel,g)
    if qid.startswith('u4pC'):
        if 'Angle Sum' in s:
            a,b=[int(x) for x in re.findall(r'(\d+)°', s)[:2]]
            return triangle_sum(a,b)
        if 'remotes' in s:
            a,b=[int(x) for x in re.findall(r'(\d+)°', s)[:2]]
            return exterior(a,b,find='ext')
        m=re.findall(r'(\d+)', s)
        # "remote 55, exterior = 135" -> remote1=55, ext=135
        rem=int(re.search(r'remote\s*(\d+)', s).group(1)); ext=int(re.search(r'exterior\s*=\s*(\d+)', s).group(1))
        return exterior(rem, ext=ext, find='rem')
    return None

h=open(F).read()
# inject after each chk-q div inside Part 2 blocks (ids u4pA/B/C)
def inject(m):
    block=m.group(0); qid=m.group(1)
    qm=re.search(r'<div class="chk-q"[^>]*>(.*?)</div>', block, re.S)
    if not qm: return block
    s=gen_for(qid, qm.group(1))
    if not s: return block
    wrap=f'<div style="text-align:center;margin:4px 0 8px">{s}</div>'
    # insert right after the chk-q div
    return block.replace(qm.group(0), qm.group(0)+'\n  '+wrap, 1)

h=re.sub(r'<div class="chk" id="(u4p[ABC]\d+)".*?</div>\s*</div>', inject, h, flags=re.S)
open(F,'w').write(h)
print("injected. svg count now:", h.count('<svg'))
