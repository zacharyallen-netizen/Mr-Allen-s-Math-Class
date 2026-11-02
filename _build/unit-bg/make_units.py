# Unit-page backgrounds: one math-art image per unit, same palette/style as the home page.
import numpy as np, matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.patches import Rectangle, Polygon, Circle, Arc, Wedge, Ellipse
from matplotlib.colors import LinearSegmentedColormap
from matplotlib import font_manager as fm
plt.rcParams['mathtext.fontset']='stix'
HEAD=fm.FontProperties(fname='/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf')
SER=fm.FontProperties(fname='/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf')
MONO=fm.FontProperties(fname='/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf')
NAVY='#1E2D4F'; DEEP='#16203a'; GOLD='#FFC107'; ROYAL='#3B82F6'; GREEN='#4ADE80'; MIST='#cdd5e0'; CORAL='#F87171'
W,H,DPI=19.2,10.8,100
rng=np.random.default_rng(8)
def fig():
    f=plt.figure(figsize=(W,H),dpi=DPI); ax=f.add_axes([0,0,1,1]); ax.axis('off')
    g=np.linspace(0,1,256)[None,:]*np.ones((256,1)); g=(g+np.linspace(1,0,256)[:,None])/2
    cm=LinearSegmentedColormap.from_list('bg',[DEEP,NAVY]); ax.imshow(g,cmap=cm,extent=[0,1920,0,1080],aspect='auto',zorder=0)
    ax.set_xlim(0,1920); ax.set_ylim(0,1080); return f,ax
def grid(ax,step=60,a=.06):
    for gx in range(0,1921,step): ax.plot([gx,gx],[0,1080],color='white',lw=.5,alpha=a,zorder=1)
    for gy in range(0,1081,step): ax.plot([0,1920],[gy,gy],color='white',lw=.5,alpha=a,zorder=1)
def T(ax,x,y,s,size=22,c=MIST,a=.35,fp=None,rot=0,math=False,**k):
    kw={} if math else {'fontproperties':fp or SER}
    ax.text(x,y,s,color=c,alpha=a,fontsize=size,rotation=rot,ha='center',va='center',zorder=3,**kw,**k)
def save(f,n): f.savefig(f'unit{n}.png',dpi=DPI); plt.close(f)

# ── Unit 1  Real numbers: spiral of Theodorus (√1 … √17) + number line with √2, π
f,ax=fig(); grid(ax)
cx,cy,s=1430,600,98; x,y=s,0; pts=[(0,0),(s,0)]
for n in range(1,17):
    r=np.hypot(x,y); nx,ny=x-y/r*s,y+x/r*s
    ax.add_patch(Polygon([(cx,cy),(cx+x,cy+y),(cx+nx,cy+ny)],closed=True,fc=GOLD if n%2 else ROYAL,alpha=.10 if n%2 else .14,ec=MIST,lw=1,zorder=2))
    r2=np.hypot(nx,ny); mx,my=nx/r2*(r2+30),ny/r2*(r2+30)
    T(ax,cx+mx,cy+my,f'$\\sqrt{{{n+1}}}$',size=17,math=True,a=.5)
    x,y=nx,ny
ax.plot([60,1860],[150,150],color=MIST,lw=1.5,alpha=.4,zorder=2)
for k in range(-3,10):
    px=420+k*150; ax.plot([px,px],[140,160],color=MIST,alpha=.4,lw=1.2); T(ax,px,118,str(k),size=15,a=.4)
for v,lab,c in [(2**.5,r'$\sqrt{2}$',GOLD),(np.pi,r'$\pi$',GOLD),(-1.5,r'$-\frac{3}{2}$',GREEN),(0.666,r'$0.\overline{6}$',GREEN),(np.e,r'$e$',GOLD),(5**.5,r'$\sqrt{5}$',GOLD)]:
    px=420+v*150; ax.add_patch(Circle((px,150),7,color=c,alpha=.8,zorder=3)); T(ax,px,190,lab,size=20,c=c,a=.75,math=True)
for (xx,yy,t) in [(260,860,r'$\pi = 3.14159265\ldots$'),(330,690,r'$\frac{2}{3}=0.666\ldots$'),(230,520,r'$\sqrt{2}=1.41421356\ldots$'),(380,360,r'$0.\overline{27}=\frac{27}{99}$')]:
    T(ax,xx,yy,t,size=26,math=True,a=.30)
save(f,1)

# ── Unit 2  Exponents & scientific notation: powers-of-ten nested squares + exponent rules
f,ax=fig(); grid(ax)
for i,e in enumerate(range(-3,7)):
    side=40*1.42**i; cx,cy=1500,540
    ax.add_patch(Rectangle((cx-side/2,cy-side/2),side,side,fill=False,ec=GOLD if e>=0 else ROYAL,lw=1.6,alpha=.55-.035*i,zorder=2))
    T(ax,cx+side/2-4,cy+side/2+12,f'$10^{{{e}}}$',size=13+i*1.2,math=True,a=.55,ha_='') if False else ax.text(cx+side/2+6,cy+side/2-14,f'$10^{{{e}}}$',color=GOLD if e>=0 else ROYAL,alpha=.6,fontsize=12+i*1.3,zorder=3)
xs=np.linspace(0,8,300)
for b,c in [(2,GOLD),(1.6,GREEN),(1.3,ROYAL)]:
    yv=60+b**xs*22; m=yv<1040; ax.plot((80+xs*95)[m],yv[m],color=c,lw=2.4,alpha=.45,zorder=2)
for (xx,yy,t) in [(350,930,r'$x^a\cdot x^b=x^{a+b}$'),(420,800,r'$(x^a)^b=x^{ab}$'),(310,250,r'$x^{-n}=\frac{1}{x^n}$'),(560,140,r'$x^0=1$'),
                  (1500,980,r'$6.02\times10^{23}$'),(1650,110,r'$1.6\times10^{-19}$')]:
    T(ax,xx,yy,t,size=30,math=True,a=.33)
save(f,2)

# ── Unit 3  Equations: balance scale + algebra tiles + solving steps
f,ax=fig(); grid(ax)
bx,by=1460,420
ax.add_patch(Polygon([(bx-60,by-200),(bx+60,by-200),(bx,by+150)],closed=True,fc=MIST,alpha=.12,ec=MIST,lw=1.5,zorder=2))
ax.plot([bx-380,bx+380],[by+150,by+150],color=GOLD,lw=6,alpha=.6,zorder=3)
for side,items in [(-1,[('x',ROYAL),('x',ROYAL),('x',ROYAL),('1',GREEN),('1',GREEN)]),(1,[('1',GREEN)]*11)]:
    px=bx+side*300; ax.plot([px,px],[by+150,by+40],color=MIST,lw=1.5,alpha=.5); ax.add_patch(Arc((px,by+40),260,60,theta1=180,theta2=360,color=MIST,lw=2,alpha=.5))
    k=0
    for t,c in items:
        w=46 if t=='x' else 22; h=90 if t=='x' else 22
        col=k%6; row=k//6; ox=px-110+col*40; oy=by+50+row*30 if t=='1' else by+50
        if t=='x': ox=px-110+k*52
        ax.add_patch(Rectangle((ox,oy),w if t=='x' else 22,h,fc=c,alpha=.35,ec=c,lw=1.2,zorder=3)); k+=1
T(ax,bx,by+380,r'$3x+2=11$',size=40,math=True,a=.45,c=GOLD)
steps=[r'$3x+2=11$',r'$3x+2-2=11-2$',r'$3x=9$',r'$\frac{3x}{3}=\frac{9}{3}$',r'$x=3$']
for i,t in enumerate(steps): T(ax,330,880-i*150,t,size=30,math=True,a=.34 if i<4 else .6,c=MIST if i<4 else GOLD)
save(f,3)

# ── Unit 4  Angles & triangles: parallel lines cut by transversals + triangle tessellation
f,ax=fig(); grid(ax)
for y in [300,780]: ax.plot([0,1920],[y,y],color=MIST,lw=2,alpha=.45,zorder=2)
for x0,slope in [(1180,1.6),(1650,-2.2)]:
    xs=np.array([0,1080]); ax.plot(x0+(xs-540)/slope,xs,color=GOLD,lw=2.2,alpha=.55,zorder=2)
    for y in [300,780]:
        xi=x0+(y-540)/slope; ang=np.degrees(np.arctan(slope))%180
        ax.add_patch(Wedge((xi,y),55,0,ang,fc=ROYAL,alpha=.25,zorder=2)); ax.add_patch(Wedge((xi,y),55,180,180+ang,fc=GREEN,alpha=.22,zorder=2))
T(ax,1215,380,r'$58^\circ$',size=22,math=True,a=.6,c=MIST); T(ax,1500,860,r'$m\parallel n$',size=26,math=True,a=.5,c=GOLD)
h=110*np.sqrt(3)/2
for r in range(-1,10):
    for c in range(-1,9):
        x=c*110+(r%2)*55; y=r*h
        if x>720: continue
        a=.05+.10*((r+c)%3==0)
        ax.add_patch(Polygon([(x,y),(x+110,y),(x+55,y+h)],closed=True,fc=GOLD if (r+c)%3==0 else ROYAL,alpha=a,ec=MIST,lw=.8,zorder=1))
T(ax,360,540,r'$a+b+c=180^\circ$',size=34,math=True,a=.5,c=GOLD)
save(f,4)

# ── Unit 5  Pythagorean theorem: squares on the sides + Pythagoras tree
f,ax=fig(); grid(ax)
def tree(ax,x,y,dx,dy,d):
    if d==0: return
    p=[(x,y),(x+dx,y+dy),(x+dx-dy,y+dy+dx),(x-dy,y+dx)]
    ax.add_patch(Polygon(p,closed=True,fc=GREEN if d<4 else GOLD,alpha=.06+.025*d,ec=MIST,lw=.6,zorder=2))
    a=np.radians(36.87); c,s=np.cos(a),np.sin(a)
    ex,ey=x-dy,y+dx; ux,uy=dx*c-dy*s,dx*s+dy*c; k=0.8
    tree(ax,ex,ey,ux*k,uy*k,d-1)
    tree(ax,ex+ux*k,ey+uy*k,dx-ux*k,dy-uy*k,d-1)
tree(ax,1470,60,150,0,9)
ox,oy,a3,b4=180,330,3*55,4*55
ax.add_patch(Polygon([(ox,oy),(ox+b4,oy),(ox,oy+a3)],closed=True,fc=MIST,alpha=.15,ec=MIST,lw=2,zorder=3))
ax.add_patch(Rectangle((ox,oy-b4),b4,b4,fc=ROYAL,alpha=.22,ec=ROYAL,lw=1.5,zorder=2)); T(ax,ox+b4/2,oy-b4/2,'16',size=30,a=.5)
ax.add_patch(Rectangle((ox-a3,oy),a3,a3,fc=GREEN,alpha=.22,ec=GREEN,lw=1.5,zorder=2)); T(ax,ox-a3/2,oy+a3/2,'9',size=30,a=.5)
v=np.array([b4,-a3]); n=np.array([a3,b4])
ax.add_patch(Polygon([(ox,oy+a3),(ox+b4,oy),(ox+b4+a3,oy+b4),(ox+a3,oy+a3+b4)],closed=True,fc=GOLD,alpha=.2,ec=GOLD,lw=1.5,zorder=2)); T(ax,ox+(b4+a3)/2+ 0,oy+(a3+b4)/2+ 30,'25',size=34,a=.55,c=GOLD)
T(ax,330,930,r'$a^2+b^2=c^2$',size=42,math=True,a=.55,c=GOLD)
save(f,5)

# ── Unit 6  Functions, slope & systems: family of lines, slope triangles, intersection
f,ax=fig(); grid(ax,step=60,a=.09)
ox,oy=1340,480; u=60
ax.plot([ox-700,1920],[oy,oy],color=MIST,lw=1.5,alpha=.5); ax.plot([ox,ox],[0,1080],color=MIST,lw=1.5,alpha=.5)
X=np.linspace(-12,10,10)
for m,b,c,a in [(1,2,ROYAL,.7),(-1,6,CORAL,.6),(0.5,-1,GREEN,.45),(2,-3,GOLD,.45),(-0.25,5,MIST,.3)]:
    ax.plot(ox+X*u,oy+(m*X+b)*u,color=c,lw=2.6,alpha=a,zorder=2)
ax.add_patch(Circle((ox+2*u,oy+4*u),11,color=GOLD,zorder=4)); T(ax,ox+2*u+70,oy+4*u+30,'(2, 4)',size=20,a=.8,c=GOLD)
for x0 in [-6,-3]:
    ax.plot([ox+x0*u,ox+(x0+2)*u,ox+(x0+2)*u],[oy+(x0+2)*u,oy+(x0+2)*u,oy+(x0+4)*u],color=GOLD,lw=1.6,ls='--',alpha=.6)
T(ax,330,860,r'$y=mx+b$',size=44,math=True,a=.5,c=GOLD); T(ax,330,700,r'$m=\frac{\Delta y}{\Delta x}=\frac{rise}{run}$',size=30,math=True,a=.38)
T(ax,330,260,r'$\left\{\begin{array}{l}y=x+2\\ y=-x+6\end{array}\right.$' if False else r'$y=x+2,\ \ y=-x+6$',size=26,math=True,a=.38)
save(f,6)

# ── Unit 7  Data: scatter plot with line of best fit + two-way table
f,ax=fig(); grid(ax,a=.05)
ox,oy=1060,140
ax.plot([ox,1860],[oy,oy],color=MIST,lw=1.6,alpha=.5); ax.plot([ox,ox],[oy,980],color=MIST,lw=1.6,alpha=.5)
xs=rng.uniform(0,10,70); ys=8+7.2*xs+rng.normal(0,7,70)
ax.scatter(ox+40+xs*75,oy+ys*10,s=60,color=GOLD,alpha=.6,zorder=3,edgecolors='none')
ax.scatter([ox+40+8.5*75],[oy+20*10],s=90,color=CORAL,alpha=.8,zorder=3)
xl=np.array([0,10.5]); ax.plot(ox+40+xl*75,oy+(8+7.2*xl)*10,color=ROYAL,lw=3,alpha=.7,zorder=2)
tx,ty,cw,ch=120,560,160,70
rows=[['','Yes','No','Total'],['Grade 7','18','12','30'],['Grade 8','24','6','30'],['Total','42','18','60']]
for r,row in enumerate(rows):
    for c,v in enumerate(row):
        ax.add_patch(Rectangle((tx+c*cw,ty-r*ch),cw,ch,fill=(r==0 or c==0),fc=ROYAL,alpha=.12 if (r==0 or c==0) else .4,ec=MIST,lw=1,zorder=2))
        if v: T(ax,tx+c*cw+cw/2,ty-r*ch+ch/2,v,size=20,a=.5)
T(ax,440,860,r'$\hat{y}=7.2x+8$',size=36,math=True,a=.45,c=GOLD)
save(f,7)

# ── Unit 8  Transformations: rotations, reflection and a dilation of one figure
f,ax=fig(); grid(ax,a=.07)
base=np.array([(0,0),(3,0),(3,1),(1,1),(1,3),(0,3)],float)
cx,cy,u=1420,540,38
for k in range(8):
    th=np.radians(45*k); R=np.array([[np.cos(th),-np.sin(th)],[np.sin(th),np.cos(th)]])
    P=(base+[1.2,1.2])@R.T*u*1.6
    ax.add_patch(Polygon(P+[cx,cy],closed=True,fc=[GOLD,ROYAL,GREEN,CORAL][k%4],alpha=.22,ec=MIST,lw=1.2,zorder=2))
ax.add_patch(Circle((cx,cy),8,color=GOLD,zorder=3))
ax.plot([380,380],[80,1000],color=GOLD,lw=1.5,ls='--',alpha=.5)
P=base*u*1.8+[420,560]; ax.add_patch(Polygon(P,closed=True,fc=ROYAL,alpha=.3,ec=MIST,lw=1.2,zorder=2))
Q=P.copy(); Q[:,0]=760-Q[:,0]; ax.add_patch(Polygon(Q,closed=True,fc=GREEN,alpha=.25,ec=MIST,lw=1.2,zorder=2))
for s,a in [(1,.25),(2,.18),(3,.12)]:
    D=np.array([(0,0),(2,0),(0,1.5)])*u*s+[200,120]; ax.add_patch(Polygon(D,closed=True,fill=False,ec=GOLD,lw=1.6,alpha=a*2,zorder=2))
T(ax,560,980,r"$(x,y)\rightarrow(-y,\,x)$",size=28,math=True,a=.42); T(ax,700,250,r'$k=2,\ 3$',size=24,math=True,a=.4,c=GOLD)
save(f,8)

# ── Unit 9  Volume: wireframe cylinder, cone and sphere
f,ax=fig(); grid(ax,a=.05)
def cyl(cx,cy,r,h,c):
    ax.add_patch(Ellipse((cx,cy),2*r,r*.5,fill=False,ec=c,lw=2,alpha=.6)); ax.add_patch(Ellipse((cx,cy+h),2*r,r*.5,fc=c,alpha=.12,ec=c,lw=2))
    ax.plot([cx-r,cx-r],[cy,cy+h],color=c,lw=2,alpha=.6); ax.plot([cx+r,cx+r],[cy,cy+h],color=c,lw=2,alpha=.6)
    for t in np.linspace(.2,.8,4): ax.plot([cx-r+2*r*t]*2,[cy-r*.25*np.sin(np.arccos(2*t-1)),cy+h-r*.25*np.sin(np.arccos(2*t-1))],color=c,lw=.8,alpha=.25)
def cone(cx,cy,r,h,c):
    ax.add_patch(Ellipse((cx,cy),2*r,r*.5,fc=c,alpha=.12,ec=c,lw=2)); ax.plot([cx-r,cx,cx+r],[cy,cy+h,cy],color=c,lw=2,alpha=.6)
    ax.plot([cx,cx],[cy,cy+h],color=c,lw=1,ls='--',alpha=.4); ax.plot([cx,cx+r],[cy,cy],color=c,lw=1,ls='--',alpha=.4)
def sph(cx,cy,r,c):
    ax.add_patch(Circle((cx,cy),r,fc=c,alpha=.08,ec=c,lw=2))
    for k in np.linspace(.15,.95,5): ax.add_patch(Ellipse((cx,cy),2*r,2*r*k*.35,fill=False,ec=c,lw=.8,alpha=.35))
    for k in np.linspace(.2,1,4): ax.add_patch(Ellipse((cx,cy),2*r*k,2*r,fill=False,ec=c,lw=.8,alpha=.3))
cyl(1250,200,170,420,ROYAL); cone(1650,200,150,420,GOLD); sph(1470,860,150,GREEN)
cone(260,560,110,300,ROYAL); sph(450,250,90,GOLD)
for (xx,yy,t) in [(360,960,r'$V=\pi r^2h$'),(380,820,r'$V=\frac{1}{3}\pi r^2h$'),(780,700,r'$V=\frac{4}{3}\pi r^3$')]:
    T(ax,xx,yy,t,size=32,math=True,a=.42,c=GOLD if 'h' not in t else MIST)
save(f,9)
print('ok')
