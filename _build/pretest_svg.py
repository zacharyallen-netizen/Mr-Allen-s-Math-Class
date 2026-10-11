#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""High-quality labeled SVG diagrams for Mr. Allen's geometry pre-tests.
Compact (~200px wide) to fit the 2-column worksheet grid. Given values in
blue, unknowns in gold, figure lines navy. No answer/relationship captions."""
import math
NAVY='#1E2D4F'; BLUE='#0056B3'; GOLD='#b08800'; GREEN='#1a7000'
FILL='#eef4ff'; GRID='#d7def0'; FILL2='#f4f7fd'; RED='#b23b00'
GIVEN=BLUE; UNK=GOLD

def _svg(w,h,body): return ('<svg role="img" width="%d" height="%d" viewBox="0 0 %d %d" '
    'xmlns="http://www.w3.org/2000/svg">%s</svg>')%(w,h,w,h,body)
def T(x,y,s,col,anchor='middle',size=12.5,weight='bold',style='normal'):
    return ('<text x="%.1f" y="%.1f" text-anchor="%s" font-family="Arvo,Georgia,serif" '
        'font-size="%s" font-weight="%s" font-style="%s" fill="%s">%s</text>')%(x,y,anchor,size,weight,style,col,s)
def _rad(a): return math.radians(a)
def P(V,r,a): return (V[0]+r*math.cos(_rad(a)), V[1]-r*math.sin(_rad(a)))
def arc(V,r,a1,a2,color,w=2.2):
    while a2<a1: a2+=360
    large=1 if (a2-a1)>180 else 0
    p1=P(V,r,a1); p2=P(V,r,a2)
    return ('<path d="M %.1f %.1f A %d %d 0 %d 0 %.1f %.1f" fill="none" stroke="%s" stroke-width="%s"/>'
        )%(p1[0],p1[1],r,r,large,p2[0],p2[1],color,w)
def albl(V,r,a,text,color,size=12.5):
    p=P(V,r,a); return T(p[0],p[1]+4,text,color,'middle',size)
def ray(V,ang,L,color,w=2.6):
    p=P(V,ang,L); return '<line x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f" stroke="%s" stroke-width="%s"/>'%(V[0],V[1],p[0],p[1],color,w)
def line(x1,y1,x2,y2,color=NAVY,w=2.6,dash=None):
    d=(' stroke-dasharray="%s"'%dash) if dash else ''
    return '<line x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f" stroke="%s" stroke-width="%s"%s/>'%(x1,y1,x2,y2,color,w,d)
def dot(x,y,r=3,fill=NAVY): return '<circle cx="%.1f" cy="%.1f" r="%s" fill="%s"/>'%(x,y,r,fill)

# ================= UNIT 4 — angle diagrams =================
def supp(given, unk='x°', gdisp=None):
    V=(100,86); th=180-given
    g = gdisp if gdisp is not None else ('%d°'%given)
    b =line(14,86,186,86,NAVY,3)
    b+=ray(V,th,62,GOLD,3)
    b+=dot(*V)
    b+=arc(V,28,th,180,GIVEN)+albl(V,44,(th+180)/2,g,GIVEN)
    b+=arc(V,21,0,th,UNK)+albl(V,36,th/2,unk,UNK)
    return _svg(200,108,b)

def comp(given, unk='x°', gdisp=None):
    V=(62,96); th=given
    g = gdisp if gdisp is not None else ('%d°'%given)
    b =line(62,96,182,96,NAVY,3)
    b+=line(62,96,62,18,NAVY,3)
    b+='<rect x="62" y="84" width="12" height="12" fill="none" stroke="%s" stroke-width="1.5"/>'%NAVY
    b+=ray(V,th,80,GOLD,3)
    b+=dot(*V)
    b+=arc(V,26,0,th,GIVEN)+albl(V,42,th/2,g,GIVEN)
    b+=arc(V,32,th,90,UNK)+albl(V,50,(th+90)/2,unk,UNK)
    return _svg(200,116,b)

def vertical(given, unk='x°'):
    V=(100,64)
    b =line(20,64,180,64,NAVY,3)
    b+=line(48,108,152,20,NAVY,3)
    b+=dot(*V)
    b+=arc(V,24,0,40,GIVEN)+albl(V,40,20,'%d°'%given,GIVEN)
    b+=arc(V,24,180,220,UNK)+albl(V,42,200,unk,UNK)
    return _svg(200,116,b)

def transversal(rel, given, unk='x°'):
    # two parallel lines + transversal; given at top intersection, unk at related spot
    b =line(14,44,190,44,NAVY,3)
    b+=line(14,100,190,100,NAVY,3)
    # arrow marks (parallel)
    b+='<path d="M46,38 L52,44 L46,50" fill="none" stroke="%s" stroke-width="1.5"/>'%NAVY
    b+='<path d="M46,94 L52,100 L46,106" fill="none" stroke="%s" stroke-width="1.5"/>'%NAVY
    b+=line(78,20,152,124,GOLD,3)
    b+=dot(102,44,2.6); b+=dot(130,100,2.6)
    pos={'corresponding':((116,36),(150,94)),
         'alt-int':((116,60),(118,92)),
         'alt-ext':((84,36),(152,118)),
         'co-int':((116,60),(150,92))}
    (gx,gy),(xx,xy)=pos[rel]
    b+=T(gx,gy,'%d°'%given,GIVEN,'middle',12.5)
    b+=T(xx,xy,unk,UNK,'middle',12.5)
    return _svg(200,140,b)

def triangle_sum(a,b_ang, unk='x°'):
    # bottom-left a, bottom-right b, top x
    pts='28,112 180,112 78,30'
    body='<polygon points="%s" fill="%s" stroke="%s" stroke-width="2.6"/>'%(pts,FILL2,NAVY)
    if a==90: body+='<rect x="28" y="100" width="12" height="12" fill="none" stroke="%s" stroke-width="1.5"/>'%NAVY
    else: body+=T(46,106,'%d°'%a,GIVEN,'start',12)
    if b_ang==90: body+='<path d="M168,112 L168,100 L180,100" fill="none" stroke="%s" stroke-width="1.5"/>'%NAVY
    else: body+=T(160,106,'%d°'%b_ang,GIVEN,'end',12)
    body+=T(78,52,unk,UNK,'middle',12.5)
    return _svg(200,124,body)

def triangle_three(l1,l2,l3):
    pts='28,112 180,112 78,30'
    body='<polygon points="%s" fill="%s" stroke="%s" stroke-width="2.6"/>'%(pts,FILL2,NAVY)
    body+=T(48,106,l1,UNK,'start',12.5)
    body+=T(160,106,l2,UNK,'end',12.5)
    body+=T(78,52,l3,UNK,'middle',12.5)
    return _svg(200,124,body)

def exterior_find_ext(rem_top, rem_left):
    body='<polygon points="34,100 150,100 74,30" fill="%s" stroke="%s" stroke-width="2.6"/>'%(FILL2,NAVY)
    body+=line(150,100,198,100,NAVY,2.6)
    body+=T(74,52,'%d°'%rem_top,GIVEN,'middle',12)
    body+=T(46,94,'%d°'%rem_left,GIVEN,'start',12)
    body+=T(168,92,'x°',UNK,'start',12.5)
    return _svg(206,112,body)

def exterior_find_remote(rem_left, ext):
    body='<polygon points="34,100 150,100 74,30" fill="%s" stroke="%s" stroke-width="2.6"/>'%(FILL2,NAVY)
    body+=line(150,100,198,100,NAVY,2.6)
    body+=T(74,52,'x°',UNK,'middle',12.5)
    body+=T(46,94,'%d°'%rem_left,GIVEN,'start',12)
    body+=T(164,92,'%d°'%ext,GIVEN,'start',12)
    return _svg(206,112,body)

def isosceles(vertex, unk='x°'):
    # apex top with vertex angle, two equal base angles x, tick marks on equal sides
    body='<polygon points="100,26 44,118 156,118" fill="%s" stroke="%s" stroke-width="2.6"/>'%(FILL2,NAVY)
    body+=T(100,52,'%d°'%vertex,GIVEN,'middle',12.5)
    body+=T(60,112,unk,UNK,'start',12)
    body+=T(140,112,unk,UNK,'end',12)
    # tick marks on the two equal (slant) sides
    def tick(x1,y1,x2,y2):
        mx,my=(x1+x2)/2,(y1+y2)/2
        dx,dy=x2-x1,y2-y1; L=math.hypot(dx,dy); nx,ny=-dy/L,dx/L
        return line(mx-nx*5,my-ny*5,mx+nx*5,my+ny*5,NAVY,2)
    body+=tick(100,26,44,118); body+=tick(100,26,156,118)
    return _svg(200,130,body)

# ================= UNIT 5 — right-triangle diagrams =================
def rtri(leg_h, leg_v, hlab, vlab, clab):
    S=104.0/max(leg_h,leg_v); w=leg_h*S; h=leg_v*S
    ox=30; oy=16; W=w+88; H=h+48
    body ='<polygon points="%.1f,%.1f %.1f,%.1f %.1f,%.1f" fill="%s" stroke="%s" stroke-width="2.6"/>'%(
        ox,oy+h, ox+w,oy+h, ox,oy, FILL,NAVY)
    body+='<path d="M %.1f %.1f h 12 v 12" fill="none" stroke="%s" stroke-width="1.5"/>'%(ox,oy+h-12,NAVY)
    body+=T(ox+w/2, oy+h+18, hlab, BLUE if hlab!='?' else UNK)
    body+=T(ox-8, oy+h/2+4, vlab, (BLUE if vlab!='?' else UNK),'end')
    body+=T(ox+w/2+18, oy+h/2-2, clab, (GOLD if '?' in clab else BLUE))
    body+='<line x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f" stroke="%s" stroke-width="3"/>'%(ox,oy,ox+w,oy+h,GOLD)
    return _svg(int(W),int(H),body)

def rect_diag(w_u,h_u,wlab,hlab,dlab):
    S=112.0/max(w_u,h_u); w=w_u*S; h=h_u*S; ox=18; oy=16; W=w+46; H=h+44
    body ='<rect x="%d" y="%d" width="%.1f" height="%.1f" fill="%s" stroke="%s" stroke-width="2.6"/>'%(ox,oy,w,h,FILL,NAVY)
    body+='<line x1="%d" y1="%.1f" x2="%.1f" y2="%d" stroke="%s" stroke-width="3"/>'%(ox,oy+h,ox+w,oy,GOLD)
    body+=T(ox+w/2, oy+h+18, wlab, BLUE)
    body+=T(ox-7, oy+h/2+4, hlab, BLUE,'end')
    body+=T(ox+w/2+12, oy+h/2-2, dlab, GOLD)
    return _svg(int(W),int(H),body)

def ladder(hyp_lab, base_lab, h_lab, base_u, h_u):
    S=108.0/max(base_u,h_u); w=base_u*S; h=h_u*S; ox=36; oy=14; W=w+58; H=h+42; gy=oy+h
    body =line(ox,oy,ox,gy,NAVY,4)                    # wall
    body+=line(ox-6,gy,ox+w+12,gy,NAVY,3)             # ground
    body+='<path d="M %d %.1f h 12 v 12" fill="none" stroke="%s" stroke-width="1.5"/>'%(ox,gy-12,NAVY)
    body+=line(ox,oy,ox+w,gy,GOLD,4)                  # ladder (hyp)
    body+=T(ox+w/2+4, gy+16, base_lab, BLUE)
    body+=T(ox-8, oy+h/2+4, h_lab, (GREEN if '?' not in h_lab else UNK),'end')
    body+=T(ox+w/2+16, oy+h/2-2, hyp_lab, GOLD)
    return _svg(int(W),int(H),body)

def coord_dist(x1,y1,x2,y2,dlab='d = ?'):
    pad=1; minx=min(x1,x2)-pad; maxx=max(x1,x2)+pad; miny=min(y1,y2)-pad; maxy=max(y1,y2)+pad
    left=24; top=12; gw=150; gh=140
    s=min(gw/(maxx-minx), gh/(maxy-miny))
    W=left+(maxx-minx)*s+16; H=top+(maxy-miny)*s+24
    def X(g): return left+(g-minx)*s
    def Y(g): return top+(maxy-g)*s
    body=''
    for gx in range(math.ceil(minx),int(maxx)+1):
        body+=line(X(gx),top,X(gx),top+(maxy-miny)*s,GRID,1)
    for gy in range(math.ceil(miny),int(maxy)+1):
        body+=line(left,Y(gy),left+(maxx-minx)*s,Y(gy),GRID,1)
    if minx<=0<=maxx: body+=line(X(0),top,X(0),top+(maxy-miny)*s,NAVY,1.6)
    if miny<=0<=maxy: body+=line(left,Y(0),left+(maxx-minx)*s,Y(0),NAVY,1.6)
    cx,cy=X(x2),Y(y1)
    body+=line(X(x1),Y(y1),cx,cy,BLUE,2,'4 3')
    body+=line(cx,cy,X(x2),Y(y2),BLUE,2,'4 3')
    body+=line(X(x1),Y(y1),X(x2),Y(y2),GOLD,3)
    body+=T((X(x1)+cx)/2, cy+(14 if y1<=y2 else -6), str(abs(x2-x1)), BLUE,'middle',10.5)
    body+=T(cx+(11 if x2>=x1 else -11),(cy+Y(y2))/2+4, str(abs(y2-y1)), BLUE,'middle',10.5)
    body+=T((X(x1)+X(x2))/2-10,(Y(y1)+Y(y2))/2-4, dlab.split('=')[0].strip() if '=' in dlab else dlab, GOLD,'end',11)
    for (px,py) in [(x1,y1),(x2,y2)]:
        body+=dot(X(px),Y(py),4,NAVY)
        body+=T(X(px)+2,Y(py)-8,'(%d, %d)'%(px,py),NAVY,'middle',10,'bold')
    return _svg(int(W),int(H),body)

# ================= UNIT 8 — coordinate plane + transformation concepts =================
def _grid(rngx=(-6,6), rngy=(-6,6), W=176, H=176):
    (minx,maxx),(miny,maxy)=rngx,rngy
    pad=10; gw=W-2*pad; gh=H-2*pad
    sx=gw/(maxx-minx); sy=gh/(maxy-miny)
    def X(g): return pad+(g-minx)*sx
    def Y(g): return H-pad-(g-miny)*sy
    body=''
    for gx in range(minx,maxx+1): body+=line(X(gx),pad,X(gx),H-pad,GRID,1)
    for gy in range(miny,maxy+1): body+=line(pad,Y(gy),W-pad,Y(gy),GRID,1)
    body+=line(X(0),pad,X(0),H-pad,NAVY,1.6)
    body+=line(pad,Y(0),W-pad,Y(0),NAVY,1.6)
    # arrowheads
    body+=T(W-pad+2,Y(0)+4,'x',NAVY,'middle',10,'bold','italic')
    body+=T(X(0)-1,pad-2,'y',NAVY,'middle',10,'bold','italic')
    return body,X,Y,W,H

def coord_point(px,py, axis=None, center=False, label=None):
    m=int(max(6, abs(px)+1, abs(py)+1))
    body,X,Y,W,H=_grid((-m,m),(-m,m))
    if axis=='x': body+=line(10,Y(0),W-10,Y(0),RED,2.6)
    if axis=='y': body+=line(X(0),10,X(0),H-10,RED,2.6)
    if center: body+=dot(X(0),Y(0),3.5,GOLD)
    body+=dot(X(px),Y(py),4.5,GOLD)
    lab=label if label else '(%d, %d)'%(px,py)
    if px>m-3: anc,ox='end',-6
    elif px<-(m-3): anc,ox='start',6
    else: anc,ox='middle',0
    body+=T(X(px)+ox, Y(py)-8, lab, NAVY,anc,11)
    return _svg(W,H,body)

def _flag(X,Y,cx,cy,col,fill,reflectX=False,rot=0):
    # asymmetric right-triangle "flag": right angle at (0,0), up 2, right 1.6
    base=[(0,0),(0,2),(1.6,0)]
    out=[]
    for (dx,dy) in base:
        x,y=dx,dy
        if reflectX: x=-x
        if rot:
            a=math.radians(rot); x,y=x*math.cos(a)-y*math.sin(a), x*math.sin(a)+y*math.cos(a)
        out.append((cx+x,cy+y))
    s=' '.join('%.1f,%.1f'%(X(a),Y(b)) for a,b in out)
    return '<polygon points="%s" fill="%s" stroke="%s" stroke-width="2.2"/>'%(s,fill,col)

_ARROW='<defs><marker id="ar%d" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="%s"/></marker></defs>'

def concept_slide():
    body,X,Y,W,H=_grid((-6,6),(-6,6))
    body+=_ARROW%(1,GREEN)
    body+=_flag(X,Y,-3.4,0,NAVY,FILL)
    body+=_flag(X,Y,2.2,0,GOLD,'#fff6df')
    body+='<path d="M %.1f %.1f L %.1f %.1f" stroke="%s" stroke-width="2" stroke-dasharray="4 3" marker-end="url(#ar1)"/>'%(X(-2.4),Y(2.6),X(2.2),Y(2.6),GREEN)
    return _svg(W,H,body)

def concept_flip():
    body,X,Y,W,H=_grid((-6,6),(-6,6))
    body+=line(X(0),10,X(0),H-10,RED,2.4,'5 3')
    body+=_flag(X,Y,-3.4,0,NAVY,FILL)
    body+=_flag(X,Y,3.4,0,GOLD,'#fff6df',reflectX=True)
    return _svg(W,H,body)

def concept_turn():
    body,X,Y,W,H=_grid((-6,6),(-6,6))
    body+=_ARROW%(2,GREEN)
    body+=dot(X(0),Y(0),3.5,RED)
    body+=_flag(X,Y,2,1,NAVY,FILL)
    body+=_flag(X,Y,-2,-1,GOLD,'#fff6df',rot=180)
    body+='<path d="M %.1f %.1f A 52 52 0 0 1 %.1f %.1f" fill="none" stroke="%s" stroke-width="1.8" marker-end="url(#ar2)"/>'%(X(3.8),Y(2.4),X(-3.4),Y(-1.2),GREEN)
    return _svg(W,H,body)

def _tri_scaled(X,Y,cx,cy,sc,col,fill,w=2.2):
    pts=[(cx,cy+1.2*sc),(cx-1.1*sc,cy-0.8*sc),(cx+1.1*sc,cy-0.8*sc)]
    s=' '.join('%.1f,%.1f'%(X(a),Y(b)) for a,b in pts)
    return '<polygon points="%s" fill="%s" stroke="%s" stroke-width="%s"/>'%(s,fill,col,w)

def concept_congruent():
    body,X,Y,W,H=_grid((-6,6),(-6,6))
    body+=_tri_scaled(X,Y,-3,0,1.0,NAVY,FILL)
    body+=_tri_scaled(X,Y,3,0,1.0,GOLD,'#fff6df')
    body+=T(W/2,H-4,'same size',GREEN,'middle',10,'bold','italic')
    return _svg(W,H,body)

def concept_similar():
    body,X,Y,W,H=_grid((-6,6),(-6,6))
    body+=_tri_scaled(X,Y,-3,0,0.9,NAVY,FILL)
    body+=_tri_scaled(X,Y,3,0,1.8,GOLD,'#fff6df')
    body+=T(W/2,H-4,'same shape',GREEN,'middle',10,'bold','italic')
    return _svg(W,H,body)

# ================= UNIT 9 — solids =================
def cylinder(r_lab,h_lab, rw=56, hh=96):
    ox=40; oy=27; ry=max(6,min(14,rw*0.22))
    cx=ox+rw/2
    top=oy+ry; bot=oy+hh
    body =''
    body+='<path d="M %d %d a %.0f %d 0 0 0 %d 0" fill="none" stroke="%s" stroke-width="2.4" stroke-dasharray="3 3"/>'%(ox,top,rw/2,ry,rw,NAVY)  # back top (dashed)
    body+='<path d="M %d %d a %.0f %d 0 0 1 %d 0" fill="none" stroke="%s" stroke-width="2.4"/>'%(ox,top,rw/2,ry,rw,NAVY)  # front top
    body+='<line x1="%d" y1="%d" x2="%d" y2="%d" stroke="%s" stroke-width="2.4"/>'%(ox,top,ox,bot,NAVY)
    body+='<line x1="%d" y1="%d" x2="%d" y2="%d" stroke="%s" stroke-width="2.4"/>'%(ox+rw,top,ox+rw,bot,NAVY)
    body+='<path d="M %d %d a %.0f %d 0 0 0 %d 0" fill="none" stroke="%s" stroke-width="2.4"/>'%(ox,bot,rw/2,ry,rw,NAVY)
    body+='<ellipse cx="%.0f" cy="%d" rx="%.0f" ry="%d" fill="%s" opacity="0.5"/>'%(cx,top,rw/2,ry,FILL)
    # radius on top
    body+=line(cx,top,ox+rw,top,BLUE,2)
    body+=T((cx+ox+rw)/2, top-ry-7, r_lab, BLUE,'middle',11)
    # height
    body+=line(ox+rw+12,top,ox+rw+12,bot,GOLD,2)
    body+=T(ox+rw+16, (top+bot)/2+3, h_lab, GOLD,'start',11)
    return _svg(ox+rw+16+int(6.6*len(h_lab))+8, bot+18, body)

def cone(r_lab,h_lab, rw=58, hh=92):
    ox=36; oy=16; ry=max(6,min(13,rw*0.22))
    cx=ox+rw/2; apex=(cx,oy); baseY=oy+hh
    body =''
    body+='<path d="M %d %d a %.0f %d 0 0 0 %d 0" fill="none" stroke="%s" stroke-width="2.4" stroke-dasharray="3 3"/>'%(ox,baseY,rw/2,ry,rw,NAVY)
    body+='<path d="M %d %d a %.0f %d 0 0 1 %d 0" fill="%s" stroke="%s" stroke-width="2.4"/>'%(ox,baseY,rw/2,ry,rw,FILL,NAVY)
    body+='<line x1="%.0f" y1="%d" x2="%d" y2="%d" stroke="%s" stroke-width="2.4"/>'%(cx,oy,ox,baseY,NAVY)
    body+='<line x1="%.0f" y1="%d" x2="%d" y2="%d" stroke="%s" stroke-width="2.4"/>'%(cx,oy,ox+rw,baseY,NAVY)
    body+=line(cx,baseY,ox+rw,baseY,BLUE,2)
    body+=T((cx+ox+rw)/2, baseY+ry+12, r_lab, BLUE,'middle',11)
    body+=line(cx,oy,cx,baseY,GOLD,1.8,'3 2')
    # leader out to a label clear of the cone's edge
    body+=line(cx,(oy+baseY)/2,ox+rw+8,(oy+baseY)/2,GOLD,1.4,'3 2')
    body+=T(ox+rw+12, (oy+baseY)/2+4, h_lab, GOLD,'start',11)
    return _svg(max(ox+rw+12+int(6.6*len(h_lab))+8, ox+rw+30), baseY+ry+20, body)

def sphere(r_lab, is_diam=False, R=50):
    cx=R+14; cy=R+14
    body ='<circle cx="%d" cy="%d" r="%d" fill="%s" stroke="%s" stroke-width="2.4"/>'%(cx,cy,R,FILL,NAVY)
    body+='<ellipse cx="%d" cy="%d" rx="%d" ry="14" fill="none" stroke="%s" stroke-width="1.6" stroke-dasharray="3 3"/>'%(cx,cy,R,NAVY)
    if is_diam:
        body+=line(cx-R,cy,cx+R,cy,BLUE,2)
        # clear of the dashed equator (ry=14) so the text stays legible
        body+=T(cx, cy-20, r_lab, BLUE,'middle',11)
    else:
        body+=line(cx,cy,cx+R,cy,BLUE,2)
        body+=dot(cx,cy,2.6,NAVY)
        # sits just above its own radius line, with a white halo so the circle edge never cuts through it
        ly = cy-6 if R >= 40 else cy-R-4   # a small sphere has no room inside, so label it just above
        body+=T(cx+R/2 if R >= 40 else cx+R*0.55, ly, r_lab, BLUE,'middle',11).replace('<text ','<text stroke="#fff" stroke-width="3" paint-order="stroke" ',1)
    return _svg(cx+R+14, cy+R+14, body)

def _mini_cyl(ox,oy,rw,hh,ry,col):
    b ='<path d="M %d %d a %.0f %d 0 0 1 %d 0" fill="none" stroke="%s" stroke-width="2"/>'%(ox,oy+ry,rw/2,ry,rw,col)
    b+='<path d="M %d %d a %.0f %d 0 0 0 %d 0" fill="none" stroke="%s" stroke-width="2" stroke-dasharray="3 2"/>'%(ox,oy+ry,rw/2,ry,rw,col)
    b+='<line x1="%d" y1="%d" x2="%d" y2="%d" stroke="%s" stroke-width="2"/>'%(ox,oy+ry,ox,oy+hh,col)
    b+='<line x1="%d" y1="%d" x2="%d" y2="%d" stroke="%s" stroke-width="2"/>'%(ox+rw,oy+ry,ox+rw,oy+hh,col)
    b+='<path d="M %d %d a %.0f %d 0 0 0 %d 0" fill="none" stroke="%s" stroke-width="2"/>'%(ox,oy+hh,rw/2,ry,rw,col)
    return b
def _mini_cone(ox,oy,rw,hh,ry,col):
    cx=ox+rw/2
    b ='<path d="M %d %d a %.0f %d 0 0 1 %d 0" fill="none" stroke="%s" stroke-width="2"/>'%(ox,oy+hh,rw/2,ry,rw,col)
    b+='<path d="M %d %d a %.0f %d 0 0 0 %d 0" fill="none" stroke="%s" stroke-width="2" stroke-dasharray="3 2"/>'%(ox,oy+hh,rw/2,ry,rw,col)
    b+='<line x1="%.0f" y1="%d" x2="%d" y2="%d" stroke="%s" stroke-width="2"/>'%(cx,oy,ox,oy+hh,col)
    b+='<line x1="%.0f" y1="%d" x2="%d" y2="%d" stroke="%s" stroke-width="2"/>'%(cx,oy,ox+rw,oy+hh,col)
    return b

def cone_vs_cyl():
    b =_mini_cone(16,20,52,84,11,NAVY)
    b+=T(42,124,'cone',NAVY,'middle',11)
    b+=_mini_cyl(104,20,52,84,11,NAVY)
    b+=T(130,124,'cylinder',NAVY,'middle',11)
    # note sits BELOW both solids so it cannot overlap or clip
    b+=T(88,141,'same r, h',GREEN,'middle',10,'bold','italic')
    return _svg(176,148,b)

def sphere_vs_cyl(h_note=''):
    cx=44; cy=58; R=34
    b ='<circle cx="%d" cy="%d" r="%d" fill="%s" stroke="%s" stroke-width="2"/>'%(cx,cy,R,FILL,NAVY)
    b+='<ellipse cx="%d" cy="%d" rx="%d" ry="10" fill="none" stroke="%s" stroke-width="1.4" stroke-dasharray="3 2"/>'%(cx,cy,R,NAVY)
    # same radius as the sphere, height = diameter: drawn to the same scale
    b+=_mini_cyl(96,cy-R-11,2*R,2*R+11,11,NAVY)
    # both captions on one baseline, clear of the cylinder's bottom arc
    b+=T(cx,126,'sphere',NAVY,'middle',11)
    b+=T(96+R,126,'cylinder',NAVY,'middle',11)
    return _svg(96+2*R+12,134,b)

if __name__=='__main__':
    print('pretest_svg ready')

# ================= UNIT 6 — coordinate-plane line graphs =================
def _grid_sq(xmin,xmax,ymin,ymax, pad=13):
    rx=xmax-xmin; ry=ymax-ymin
    cell=max(9, min(15, int(150/max(rx,ry))))
    W=rx*cell+2*pad; H=ry*cell+2*pad
    def X(g): return pad+(g-xmin)*cell
    def Y(g): return H-pad-(g-ymin)*cell
    body=''
    for gx in range(xmin,xmax+1): body+=line(X(gx),pad,X(gx),H-pad,GRID,1)
    for gy in range(ymin,ymax+1): body+=line(pad,Y(gy),W-pad,Y(gy),GRID,1)
    if xmin<=0<=xmax: body+=line(X(0),pad,X(0),H-pad,NAVY,1.5)
    if ymin<=0<=ymax: body+=line(pad,Y(0),W-pad,Y(0),NAVY,1.5)
    return body,X,Y,int(round(W)),int(round(H)),cell

def line_graph(m,b,mark=None):
    mark=mark or []
    aw = 5 if abs(m)<1.2 else (3 if abs(m)<2.6 else 2)
    xs=[p[0] for p in mark]+[-aw,aw,0]
    xmin=int(math.floor(min(xs))); xmax=int(math.ceil(max(xs)))
    xmin=min(xmin,-1); xmax=max(xmax,1)
    yv=[m*xmin+b, m*xmax+b, b, 0]+[p[1] for p in mark]
    ymin=int(math.floor(min(yv)))-1; ymax=int(math.ceil(max(yv)))+1
    body,X,Y,W,H,cell=_grid_sq(xmin,xmax,ymin,ymax)
    body+='<line x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f" stroke="%s" stroke-width="2.8"/>'%(
        X(xmin),Y(m*xmin+b),X(xmax),Y(m*xmax+b),GOLD)
    for (px,py) in mark:
        body+=dot(X(px),Y(py),4,NAVY)
    return _svg(W,H,body)

def line_graph2(m1,b1,m2,b2):
    aw=4; xmin,xmax=-aw,aw
    yv=[m1*xmin+b1,m1*xmax+b1,m2*xmin+b2,m2*xmax+b2,0]
    ymin=int(math.floor(min(yv)))-1; ymax=int(math.ceil(max(yv)))+1
    body,X,Y,W,H,cell=_grid_sq(xmin,xmax,ymin,ymax)
    body+='<line x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f" stroke="%s" stroke-width="2.6"/>'%(X(xmin),Y(m1*xmin+b1),X(xmax),Y(m1*xmax+b1),NAVY)
    body+='<line x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f" stroke="%s" stroke-width="2.6"/>'%(X(xmin),Y(m2*xmin+b2),X(xmax),Y(m2*xmax+b2),GOLD)
    body+=T(X(xmax)-4, Y(m1*xmax+b1)-4, 'A', NAVY,'end',12)
    body+=T(X(xmax)-4, Y(m2*xmax+b2)-4, 'B', GOLD,'end',12)
    return _svg(W,H,body)

def line_graph2_read(m1,b1,m2,b2,xmin=-4,xmax=4,ymin=-2,ymax=6):
    """Two lines on a large, numbered grid, for reading the solution of a system.
    The crossing point is marked; the A/B labels sit at the left ends, away from the crossing."""
    cell=22; L,R,Tp,B=24,12,12,28
    W=(xmax-xmin)*cell+L+R; H=(ymax-ymin)*cell+Tp+B
    X=lambda g: L+(g-xmin)*cell
    Y=lambda g: Tp+(ymax-g)*cell
    o=[]
    for gx in range(xmin,xmax+1): o.append(line(X(gx),Tp,X(gx),Y(ymin),GRID,1))
    for gy in range(ymin,ymax+1): o.append(line(L,Y(gy),X(xmax),Y(gy),GRID,1))
    o.append(line(X(0),Tp,X(0),Y(ymin),NAVY,1.5)); o.append(line(L,Y(0),X(xmax),Y(0),NAVY,1.5))
    for gx in range(xmin,xmax+1):
        if gx: o.append(T(X(gx),Y(0)+12,('−%d'%-gx) if gx<0 else '%d'%gx,NAVY,'middle',9,'normal'))
    for gy in range(ymin,ymax+1):
        if gy: o.append(T(X(0)-4,Y(gy)+3.5,('−%d'%-gy) if gy<0 else '%d'%gy,NAVY,'end',9,'normal'))
    o.append(T(X(0)-4,Y(0)+12,'0',NAVY,'end',9,'normal'))
    def clip(m,b):
        pts=[(x/20.0,m*x/20.0+b) for x in range(xmin*20,xmax*20+1)]
        pts=[p for p in pts if ymin<=p[1]<=ymax]
        return pts[0],pts[-1]
    for (m,b,col) in ((m1,b1,NAVY),(m2,b2,GOLD)):
        p0,p1=clip(m,b)
        o.append('<line x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f" stroke="%s" stroke-width="2.6"/>'%(X(p0[0]),Y(p0[1]),X(p1[0]),Y(p1[1]),col))
    # each label goes at the end of its line that is farther from the crossing
    xi=(b2-b1)/float(m1-m2) if m1!=m2 else 0
    for (m,b,col,lab) in ((m1,b1,NAVY,'A'),(m2,b2,GOLD,'B')):
        p0,p1=clip(m,b)
        if abs(p0[0]-xi)>=abs(p1[0]-xi): lx,anc=p0[0]+0.3,'start'
        else: lx,anc=p1[0]-0.3,'end'
        ly=m*lx+b
        dy=-8 if not (-1.2<ly<0.9) else 16   # keep clear of the x-axis numbers
        o.append(T(X(lx),Y(ly)+dy,'line '+lab,col,anc,11))
    if m1!=m2:
        xi=(b2-b1)/float(m1-m2); yi=m1*xi+b1
        o.append(dot(X(xi),Y(yi),4.5,RED))
    o.append(T(W/2.0,H-4,'1 square = 1 unit',NAVY,'middle',9.5,'normal','italic'))
    return _svg(W,H,''.join(o))

def points_plot(pts):
    xs=[p[0] for p in pts]; ys=[p[1] for p in pts]
    xmin=min(0,int(math.floor(min(xs)))-1); xmax=int(math.ceil(max(xs)))+1
    ymin=min(0,int(math.floor(min(ys)))-1); ymax=int(math.ceil(max(ys)))+1
    body,X,Y,W,H,cell=_grid_sq(xmin,xmax,ymin,ymax)
    for (px,py) in pts:
        body+=dot(X(px),Y(py),4,NAVY)
    return _svg(W,H,body)

# ================= UNIT 7 — scatterplots =================
def _scatter_pts(kind):
    pos=[(1,1.4),(2,1.9),(2.6,2.9),(3.4,3.2),(4.2,4.0),(5,4.6),(5.7,5.8),(6.5,6.1),(7.3,7.2),(8,7.6)]
    if kind=='positive': return pos
    if kind=='negative': return [(x,9-y) for x,y in pos]
    if kind=='none': return [(1,5.2),(2,2.1),(2.7,6.4),(3.5,3.0),(4.3,7.1),(5,2.6),(5.8,5.4),(6.6,3.4),(7.4,6.8),(8,4.2)]
    return pos

def scatter(kind='positive', fit=False, outlier=None, blank=False, caption=None):
    pad=14; capH=16 if caption else 0
    plotW=150; plotH=128
    W=plotW+2*pad; H=plotH+2*pad+capH
    ox=pad; oy=pad; bw=plotW; bh=plotH
    # data 0..9 -> box
    def X(dx): return ox+dx/9.0*bw
    def Y(dy): return oy+bh-dy/9.0*bh
    body=''
    # axes
    body+=line(ox,oy,ox,oy+bh,NAVY,1.8)
    body+=line(ox,oy+bh,ox+bw,oy+bh,NAVY,1.8)
    body+='<path d="M %.0f %.0f l 4 5 l -8 0 z" fill="%s"/>'%(ox,oy-1,NAVY)
    body+='<path d="M %.0f %.0f l 5 -4 l 0 8 z" fill="%s"/>'%(ox+bw+1,oy+bh,NAVY)
    pts=_scatter_pts(kind)
    if fit:
        # schematic best-fit line through the cloud
        if kind=='negative': body+=line(X(0.5),Y(8.0),X(8.5),Y(1.2),GOLD,2.6)
        else: body+=line(X(0.5),Y(1.0),X(8.5),Y(8.2),GOLD,2.6)
    for (dx,dy) in pts:
        body+=dot(X(dx),Y(dy),3.4,BLUE)
    if outlier:
        if outlier=='below': body+=dot(X(6.5),Y(1.3),4.2,RED)
        else: body+=dot(X(3.0),Y(8.3),4.2,RED)
    if caption:
        body+=T(W/2, H-4, caption, GREEN,'middle',10.5,'bold','italic')
    return _svg(W,H,body)

# ================= drawn-from-the-numbers helpers (no shared art) =================
import random as _random

def _nice_axis(vmax, max_ticks=5):
    """Round an axis up to a friendly number with whole-number steps (1, 2, 5, 10, 20, 25, 50…)."""
    for st in (1, 2, 5, 10, 20, 25, 50, 100, 200, 250, 500, 1000):
        if vmax / float(st) <= max_ticks:
            top = st * int(-(-vmax // st))
            return top, st
    return vmax, vmax / 4.0

def scatter_eq(m, b, xmax, ymax, seed, xlab='x', ylab='y', fit=True, outlier=None,
               n=10, noise=None, caption=None, show_eq=None):
    """A scatterplot generated from its own line y = m x + b, with numbered axes.
    Every call has its own seed, so no two plots share a point cloud."""
    rnd = _random.Random(seed)
    xmax, xstep = _nice_axis(xmax)
    ymax, ystep = _nice_axis(ymax)
    L, R, Tp, B = 34, 12, 12, 30
    pw, ph = 168, 120
    capH = 16 if caption else 0
    W, H = L + pw + R, Tp + ph + B + capH
    X = lambda x: L + x / float(xmax) * pw
    Y = lambda y: Tp + ph - y / float(ymax) * ph
    noise = noise if noise is not None else 0.12 * ymax
    o = []
    for k in range(int(round(xmax / xstep)) + 1):  # whole-number grid + ticks
        xv = k * xstep
        o.append(line(X(xv), Tp, X(xv), Tp + ph, GRID, 1))
        o.append(T(X(xv), Tp + ph + 12, '%g' % xv, NAVY, 'middle', 9, 'normal'))
    for k in range(int(round(ymax / ystep)) + 1):
        yv = k * ystep
        o.append(line(L, Y(yv), L + pw, Y(yv), GRID, 1))
        o.append(T(L - 4, Y(yv) + 3, '%g' % yv, NAVY, 'end', 9, 'normal'))
    o.append(line(L, Tp, L, Tp + ph, NAVY, 1.8)); o.append(line(L, Tp + ph, L + pw, Tp + ph, NAVY, 1.8))
    o.append(T(L + pw / 2, Tp + ph + 25, xlab, NAVY, 'middle', 9.5, 'bold', 'italic'))
    o.append('<text x="10" y="%.1f" transform="rotate(-90 10 %.1f)" text-anchor="middle" font-family="Arvo,serif" '
             'font-size="9.5" font-weight="bold" font-style="italic" fill="%s">%s</text>' % (Tp + ph / 2, Tp + ph / 2, NAVY, ylab))
    if fit:
        x0 = 0.0; x1 = float(xmax)
        # clip the line to the box
        pts = []
        for xx in [i * xmax / 200.0 for i in range(201)]:
            yy = m * xx + b
            if 0 <= yy <= ymax: pts.append((X(xx), Y(yy)))
        if len(pts) > 1:
            o.append(line(pts[0][0], pts[0][1], pts[-1][0], pts[-1][1], GOLD, 2.4))
    for i in range(n):
        xx = (i + 0.5 + rnd.uniform(-0.35, 0.35)) * xmax / n
        yy = (m * xx + b) + rnd.uniform(-noise, noise) if m is not None else rnd.uniform(0.08, 0.92) * ymax
        yy = max(0.03 * ymax, min(0.97 * ymax, yy))
        o.append(dot(X(xx), Y(yy), 3.3, BLUE))
    if outlier:
        o.append(dot(X(outlier[0]), Y(outlier[1]), 4.3, RED))
    if show_eq:
        # rising line -> label in the empty top-left; falling line -> empty top-right
        ex, anc = (L + 6, 'start') if (m or 0) >= 0 else (L + pw - 6, 'end')
        wbox = 6.2 * len(show_eq) + 8
        bx = ex - 4 if anc == 'start' else ex - wbox + 4
        o.append('<rect x="%.1f" y="%.1f" width="%.1f" height="16" rx="3" fill="#fff" '
                 'stroke="%s" stroke-width="1"/>' % (bx, Tp + 2, wbox, GOLD))
        o.append(T(ex, Tp + 14, show_eq, GOLD, anc, 10.5))
    if caption:
        o.append(T(W / 2, H - 4, caption, GREEN, 'middle', 10.5, 'bold', 'italic'))
    return _svg(W, H, ''.join(o))


def _fit_dims(diam, h, box=104, lo=26):
    s = min(box / float(diam), box / float(h))
    return max(lo, diam * s), max(lo, h * s)

def cylinder_n(r, h, r_lab, h_lab):
    """Cylinder drawn in true proportion to its radius and height."""
    rw, hh = _fit_dims(2 * r, h)
    return cylinder(r_lab, h_lab, rw=rw, hh=hh)

def cone_n(r, h, r_lab, h_lab):
    rw, hh = _fit_dims(2 * r, h)
    return cone(r_lab, h_lab, rw=rw, hh=hh)
