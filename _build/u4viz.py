#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Unit 4 diagram rebuild — one consistent visual language:
   blue arc + number  = the GIVEN angle
   gold filled wedge  = the angle you are solving for (x)
   matching tick arcs = angles that are equal
Figures are drawn to the actual given measures wherever possible."""
import math, re

NAVY='#1E2D4F'; GOLD='#b08800'; GOLDF='#FFC107'; BLUE='#0056B3'; GREEN='#22AC00'
RED='#cc2222'; FILL='#e8edf5'; FILL2='#fdf6e3'; GREY='#4a4a5a'

def T(x,y,s,col,anchor='middle',size=13,weight='bold',style='normal'):
    return (f'<text x="{x:.1f}" y="{y:.1f}" text-anchor="{anchor}" font-family="Arvo,serif" '
            f'font-size="{size}" font-weight="{weight}" font-style="{style}" fill="{col}">{s}</text>')
def Ln(x1,y1,x2,y2,col=NAVY,w=2.6,dash=None):
    d=f' stroke-dasharray="{dash}"' if dash else ''
    return f'<line x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}" stroke="{col}" stroke-width="{w}"{d}/>'
def poly(pts,fill=FILL,stroke=NAVY,w=2.6):
    return '<polygon points="%s" fill="%s" stroke="%s" stroke-width="%s"/>'%(
        ' '.join(f'{x:.1f},{y:.1f}' for x,y in pts),fill,stroke,w)
def dot(x,y,r=3.2,c=NAVY): return f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{r}" fill="{c}"/>'
def svg(w,h,b,label):
    return (f'<svg role="img" aria-label="{label}" width="{w:.0f}" height="{h:.0f}" '
            f'viewBox="0 0 {w:.0f} {h:.0f}" xmlns="http://www.w3.org/2000/svg">{b}</svg>')
def P(V,r,a): return (V[0]+r*math.cos(math.radians(a)), V[1]-r*math.sin(math.radians(a)))

def arc(V,a1,a2,r,col,w=2.4):
    while a2<a1: a2+=360
    large=1 if (a2-a1)>180 else 0
    p1=P(V,r,a1); p2=P(V,r,a2)
    return (f'<path d="M {p1[0]:.1f} {p1[1]:.1f} A {r} {r} 0 {large} 0 {p2[0]:.1f} {p2[1]:.1f}" '
            f'fill="none" stroke="{col}" stroke-width="{w}"/>')
def wedge(V,a1,a2,r,col=GOLDF,op=0.38,edge=GOLD):
    """Filled sector — this is how the unknown angle is marked."""
    while a2<a1: a2+=360
    large=1 if (a2-a1)>180 else 0
    p1=P(V,r,a1); p2=P(V,r,a2)
    return (f'<path d="M {V[0]:.1f} {V[1]:.1f} L {p1[0]:.1f} {p1[1]:.1f} '
            f'A {r} {r} 0 {large} 0 {p2[0]:.1f} {p2[1]:.1f} Z" fill="{col}" fill-opacity="{op}" '
            f'stroke="{edge}" stroke-width="2"/>')
def mid_lbl(V,a1,a2,r,txt,col,size=13):
    while a2<a1: a2+=360
    p=P(V,r,(a1+a2)/2)
    return T(p[0],p[1]+4.5,txt,col,'middle',size)
def given(V,a1,a2,r,val,ticks=1):
    s=arc(V,a1,a2,r,BLUE)
    if ticks>1: s+=arc(V,a1,a2,r-5,BLUE)
    return s+mid_lbl(V,a1,a2,r+17,f'{val}°',BLUE,12.5)
def unknown(V,a1,a2,r,lab='x°',ticks=0):
    s=wedge(V,a1,a2,r)
    if ticks>1: s+=arc(V,a1,a2,r-5,GOLD)
    return s+mid_lbl(V,a1,a2,r+18,lab,GOLD,13.5)

# ─────────────── Part-2 A: angles at a point / on a line ───────────────
def supp(G,label):
    V=(118,92); th=180-G
    b =Ln(16,92,220,92,NAVY,3)
    b+=Ln(V[0],V[1],*P(V,76,th),NAVY,3)
    b+=unknown(V,0,th,24)            # x on the right
    b+=given(V,th,180,32,G,ticks=1)  # given on the left
    b+=dot(*V)
    return svg(236,118,b,label)

def comp(G,label):
    V=(70,104)
    b =Ln(70,104,208,104,NAVY,3)+Ln(70,104,70,20,NAVY,3)
    b+=f'<rect x="70" y="92" width="12" height="12" fill="none" stroke="{NAVY}" stroke-width="1.5"/>'
    b+=Ln(V[0],V[1],*P(V,90,G),NAVY,3)
    b+=given(V,0,G,26,G)
    b+=unknown(V,G,90,36)
    b+=dot(*V)
    return svg(222,126,b,label)

def vertical(G,label):
    V=(118,72); L=86
    b =Ln(16,72,220,72,NAVY,3)
    b+=Ln(*P(V,L,G),*P(V,L,G+180),NAVY,3)
    b+=given(V,0,G,24,G,ticks=1)              # upper-right
    b+=unknown(V,180,180+G,24,ticks=1)        # lower-left: its vertical pair
    b+=dot(*V)
    return svg(236,150,b,label)

# ─────────────── Part-2 B: parallel lines cut by a transversal ───────────────
# quadrant spans at an intersection, given acute slant phi
def _spans(phi):
    return {'UL':(180-phi,180), 'UR':(0,180-phi), 'LL':(180,360-phi), 'LR':(360-phi,360)}
def transversal(rel,G,label):
    acute = G < 90
    phi = G if acute else 180-G
    POS = {
      'Corresponding':      (('I1','UL'),('I2','UL')) if acute else (('I1','UR'),('I2','UR')),
      'Alternate Interior': (('I1','LR'),('I2','UL')) if acute else (('I1','LL'),('I2','UR')),
      'Alternate Exterior': (('I1','UL'),('I2','LR')) if acute else (('I1','UR'),('I2','LL')),
    }
    if rel=='Co-Interior':
        gpos,xpos = (('I1','LR'),('I2','UR')) if acute else (('I2','UR'),('I1','LR'))
    else:
        gpos,xpos = POS[rel]
    W,H=246,176; yT,yB=52,126
    run=(yB-yT)/math.tan(math.radians(phi))
    I1x=(W-run)/2; I1=(I1x,yT); I2=(I1x+run,yB)
    b =Ln(18,yT,W-18,yT,NAVY,3)+Ln(18,yB,W-18,yB,NAVY,3)
    # parallel arrow marks
    for yy in (yT,yB):
        b+=f'<path d="M40,{yy-6} L46,{yy} L40,{yy+6}" fill="none" stroke="{NAVY}" stroke-width="1.6"/>'
    ext=34
    b+=Ln(*P(I1,ext,180-phi),*P(I2,ext,-phi),GOLD,3)
    b+=dot(*I1,2.8)+dot(*I2,2.8)
    sp=_spans(phi); V={'I1':I1,'I2':I2}
    a1,a2=sp[gpos[1]]; b+=given(V[gpos[0]],a1,a2,22,G)
    a1,a2=sp[xpos[1]]; b+=unknown(V[xpos[0]],a1,a2,22)
    return svg(W,H,b,label)

# ─────────────── Part-2 C: triangle theorems ───────────────
def _tri(aB,aC,base,ox,oy):
    b=math.radians(aB); c=math.radians(aC)
    h=base*math.tan(b)*math.tan(c)/(math.tan(b)+math.tan(c))
    return (ox+h/math.tan(b),oy-h),(ox,oy),(ox+base,oy)

def _tri_fit(aB,aC,maxW,maxH,cx,oy):
    """Triangle from its angles, scaled to fit maxW x maxH and centred on cx."""
    b=math.radians(aB); c=math.radians(aC)
    h1=math.tan(b)*math.tan(c)/(math.tan(b)+math.tan(c))   # height when base = 1
    s=min(maxW, maxH/h1)
    base=s; h=h1*s
    ox=cx-base/2
    return (ox+h/math.tan(b),oy-h),(ox,oy),(ox+base,oy)
def _ang(V,Q): return math.degrees(math.atan2(-(Q[1]-V[1]),Q[0]-V[0]))
def _sq(V,P1,P2,s=11):
    a1=_ang(V,P1); a2=_ang(V,P2); p1=P(V,s,a1); p2=P(V,s,a2)
    cn=(p1[0]+p2[0]-V[0],p1[1]+p2[1]-V[1])
    return (f'<path d="M {p1[0]:.1f} {p1[1]:.1f} L {cn[0]:.1f} {cn[1]:.1f} L {p2[0]:.1f} {p2[1]:.1f}" '
            f'fill="none" stroke="{NAVY}" stroke-width="1.7"/>')

def angle_sum(a,bb,label):
    A,B,C=_tri_fit(a,bb,150,98,115,132)
    s=poly([A,B,C])
    # base-angle numbers sit just OUTSIDE each vertex so they can never collide
    if a==90: s+=_sq(B,A,C)+T(B[0]-14,B[1]-9,'90°',BLUE,'end',12.5)
    else:     s+=arc(B,_ang(B,C),_ang(B,A),22,BLUE)+T(B[0]-14,B[1]-9,f'{a}°',BLUE,'end',12.5)
    if bb==90: s+=_sq(C,A,B)+T(C[0]+14,C[1]-9,'90°',BLUE,'start',12.5)
    else:      s+=arc(C,_ang(C,A),_ang(C,B),22,BLUE)+T(C[0]+14,C[1]-9,f'{bb}°',BLUE,'start',12.5)
    s+=unknown(A,_ang(A,B),_ang(A,C),20)
    return svg(230,152,s,label)

def exterior(r_top,r_left,ext,find,label):
    """find='ext' -> remotes given, exterior unknown; find='remote' -> apex unknown."""
    if find=='ext': aB,aA = r_left, r_top
    else:           aB,aA = r_left, ext-r_left
    aC=180-aA-aB
    A,B,C=_tri_fit(aB,aC,124,86,92,118)
    D=(C[0]+54,C[1])
    s=poly([A,B,C])+Ln(C[0],C[1],D[0],D[1],NAVY,2.6)
    if find=='ext':
        s+=given(A,_ang(A,B),_ang(A,C),20,r_top)
        s+=given(B,_ang(B,C),_ang(B,A),22,r_left)
        s+=unknown(C,_ang(C,D),_ang(C,A),24)
    else:
        s+=unknown(A,_ang(A,B),_ang(A,C),20)
        s+=given(B,_ang(B,C),_ang(B,A),22,r_left)
        s+=given(C,_ang(C,D),_ang(C,A),26,ext)
    s+=dot(*C,2.6)
    return svg(236,146,s,label)

# ─────────────── build every Part-2 diagram from its aria-label ───────────────
def build_from_label(lab):
    m=re.match(r'(Supplementary Angles|Linear Pair), given (\d+)°', lab)
    if m: return supp(int(m.group(2)),'Diagram: '+lab)
    m=re.match(r'Complementary Angles, given (\d+)°', lab)
    if m: return comp(int(m.group(1)),'Diagram: '+lab)
    m=re.match(r'Vertical Angles, given (\d+)°', lab)
    if m: return vertical(int(m.group(1)),'Diagram: '+lab)
    m=re.match(r'(Corresponding|Alternate Interior|Alternate Exterior|Co-Interior), given (\d+)°', lab)
    if m:
        rel=m.group(1); rel='Corresponding' if rel=='Corresponding' else rel
        return transversal(rel,int(m.group(2)),'Diagram: '+lab)
    m=re.match(r'Angle Sum, given (\d+)°, (\d+)°', lab)
    if m: return angle_sum(int(m.group(1)),int(m.group(2)),'Diagram: '+lab)
    m=re.match(r'Exterior Angle Theorem, remotes (\d+)°, (\d+)°', lab)
    if m: return exterior(int(m.group(1)),int(m.group(2)),None,'ext','Diagram: '+lab)
    m=re.match(r'Exterior Angle Theorem, remote (\d+)°, exterior = (\d+)°', lab)
    if m: return exterior(None,int(m.group(1)),int(m.group(2)),'remote','Diagram: '+lab)
    return None
