# Unit 5 Practice Problems 5.1–5.4 → interactive set (same problems/figures as the PDF)
import pdfplumber, re, json, subprocess
from PIL import Image, ImageChops
G='/home/claude/mr-allen-s-math-class/grade8/'; PDF='Unit_5_Practice_Problems_5.1-5.4.pdf'
OUT=G+'practice/fig/'; TMP='/tmp/claude-0/-home-claude/71df80c8-d29a-5b9a-96ce-5a924999e656/scratchpad/prac2/tmpcrop'
pdf=pdfplumber.open(G+PDF)
def is_q(c): return abs(c['size']-10)<.3 and 'Bold' in c['fontname']
figs={}   # (section, qn) -> box
for pi,pg in enumerate(pdf.pages):
    pg=pg.dedupe_chars(); sec='5.1' if pi<3 else '5.2' if pi<6 else '5.3' if pi<9 else '5.4'
    cols=[(40,330)] if pi<9 else [(40,300),(300,580)]
    lines=pg.extract_text_lines()
    unders=[l for l in lines if '____' in l['text'] and not l['text'].startswith(('Name','Q')) and 'Bold' not in l['chars'][0]['fontname']]
    heads=[l for l in lines if l['chars'][0]['size']>=10.9]          # section / part headers
    for ci,(x0,x1) in enumerate(cols):
        qs=[c for c in pg.chars if c['text']=='Q' and is_q(c) and x0<=c['x0']<x1]
        for q in qs:
            mm=re.match(r'Q(\d+)\.',''.join(c['text'] for c in sorted(pg.chars,key=lambda c:c['x0']) if abs(c['top']-q['top'])<1 and q['x0']<=c['x0']<q['x0']+20))
            if not mm: continue
            num=mm.group(1)
            if pi<9:
                below=[u['top'] for u in unders if u['top']>q['top']]
                bot=min(below)-3
                above=[u['bottom'] for u in unders if u['bottom']<q['top']]+[h['bottom'] for h in heads if h['bottom']<q['top']]
                top=max(above)+3 if above else 40
                qx=max([c['x1'] for c in pg.chars if is_q(c) and q['top']-2<=c['top']<=bot and c['x0']<330] or [300])
                box=(qx+6,top,580,bot)
            else:
                dist=[u['top'] for u in unders if u['top']>q['top']]
                bot=min(dist)-3
                tb=max(c['bottom'] for c in pg.chars if is_q(c) and x0<=c['x0']<x1 and q['top']-1<=c['top']<q['top']+40)
                box=(x0,tb+3,x1,bot)
            figs[(sec,int(num))]=(pi,box)
def crop(key,name):
    pi,(x0,top,x1,bot)=figs[key]; s=3
    subprocess.run(['pdftoppm','-r','216','-png','-singlefile','-f',str(pi+1),'-l',str(pi+1),'-x',str(int(x0*s)),'-y',str(int(top*s)),'-W',str(int((x1-x0)*s)),'-H',str(int((bot-top)*s)),G+PDF,TMP],check=True)
    im=Image.open(TMP+'.png').convert('RGB'); bg=Image.new('RGB',im.size,(255,255,255))
    b=ImageChops.difference(im,bg).point(lambda v:255 if v>18 else 0).getbbox()
    if b: im=im.crop((max(b[0]-12,0),max(b[1]-10,0),min(b[2]+12,im.width),min(b[3]+10,im.height)))
    im.save(OUT+name,optimize=True); return 'practice/fig/'+name, im.size
P=lambda *a:a
S=[('5.1 Part A — Solve for the Hypotenuse','NC.8.G.7','Square both legs, add, then take the square root: a² + b² = c².',[
   (1,'A right triangle has legs 3 and 4. Find the hypotenuse.','5'),(2,'A right triangle has legs 6 and 8. Find the hypotenuse.','10'),
   (3,'A right triangle has legs 5 and 12. Find the hypotenuse.','13'),(4,'A right triangle has legs 8 and 15. Find the hypotenuse.','17')]),
 ('5.1 Part B — Solve for a Missing Leg','NC.8.G.7','Subtract: hypotenuse² − leg² = (missing leg)². Then take the square root.',[
   (5,'Hypotenuse = 5, leg = 4. Find the missing leg.','3'),(6,'Hypotenuse = 13, leg = 5. Find the missing leg.','12'),
   (7,'Hypotenuse = 17, leg = 8. Find the missing leg.','15'),(8,'Hypotenuse = 25, leg = 24. Find the missing leg.','7')]),
 ('5.1 Part C — Identify the Missing Side, Then Solve','NC.8.G.7','Is the missing side a leg or the hypotenuse (across from the right angle)? Then add or subtract the squares.',[
   (9,'Legs are 9 and 40. Find the hypotenuse.','41'),(10,'Hypotenuse = 29, leg = 20. Find the other leg.','21')]),
 ('5.2 Part A — Classic Triples','NC.8.G.6','Sort the sides smallest to largest. Does (small)² + (middle)² equal (largest)²? Answer yes or no.',[
   (1,'Sides: 3, 4, 5. Is this a right triangle? Show your work.','yes'),(2,'Sides: 2, 3, 4. Is this a right triangle? Show your work.','no'),
   (3,'Sides: 5, 12, 13. Is this a right triangle? Show your work.','yes'),(4,'Sides: 6, 7, 10. Is this a right triangle? Show your work.','no')]),
 ('5.2 Part B — Larger Numbers','NC.8.G.6','Square each side carefully. Compare (small)² + (middle)² with (largest)².',[
   (5,'Sides: 8, 15, 17. Is this a right triangle? Show your work.','yes'),(6,'Sides: 9, 11, 14. Is this a right triangle? Show your work.','no'),
   (7,'Sides: 7, 24, 25. Is this a right triangle? Show your work.','yes'),(8,'Sides: 10, 24, 26. Is this a right triangle? Show your work.','yes')]),
 ('5.2 Part C — Tricky Values','NC.8.G.6','Don’t trust a pattern that only looks familiar — do the squares.',[
   (9,'Sides: 9, 40, 41. Is this a right triangle? Show your work.','yes'),(10,'Sides: 6, 8, 11. Is this a right triangle? Show your work. (Careful — is this the same as 6-8-10?)','no')]),
 ('5.3 Part A — Ladders, Ramps & Screens','NC.8.G.7','Label the hypotenuse first (the ladder, ramp or diagonal). Then use a² + b² = c².',[
   (1,'A ladder 15 ft long leans against a wall. The base is 9 ft from the wall. How high up the wall does it reach?','12'),
   (2,'A wheelchair ramp is 10 ft long and rises 6 ft vertically. What is the horizontal length?','8'),
   (3,'A baseball diamond is a square with 90 ft sides. What is the distance from home plate to 2nd base? Round to the nearest foot.','127'),
   (4,'A TV screen is 36 in wide and 27 in tall. What is the diagonal measurement?','45')]),
 ('5.3 Part B — Navigation & Distance','NC.8.G.7','The two directions (East and North, or ground and pole) are the legs. The straight-line path is the hypotenuse.',[
   (5,'A hiker walks 16 km East, then 12 km North. How far is she from the start in a straight line?','20'),
   (6,'A flagpole is 24 ft tall. A wire runs from the top down to a stake in the ground. The wire is 26 ft long. How far is the stake from the base of the pole?','10'),
   (7,'A boat travels 30 km East then 40 km North. How far is it from the dock in a straight line?','50'),
   (8,'A rectangular garden is 40 m wide and 30 m long. How long is the diagonal path from one corner to the opposite corner?','50')]),
 ('5.4 Part A — Integer Coordinates','NC.8.G.8','Δx = difference in x-values, Δy = difference in y-values. Then d² = Δx² + Δy². Round to the hundredths if it isn’t a perfect square.',[
   (1,'Find the distance between (0, −2) and (6, 2).','7.21'),(2,'Find the distance between (0, −2) and (2, 2).','4.47'),
   (3,'Find the distance between (−3, 1) and (5, 7).','10'),(4,'Find the distance between (0, 0) and (3, 4).','5')]),
 ('5.4 Part B — Negative Coordinates','NC.8.G.8','Subtract carefully: 5 − (−1) = 6. Distances are always positive.',[
   (5,'Find the distance between (−1, −1) and (5, 7).','10'),(6,'Find the distance between (−4, 3) and (8, −2).','13')]),
 ('5.4 Part C — Applications','NC.8.G.8','Find Δx and Δy from the coordinates, then use d² = Δx² + Δy².',[
   (7,'Find the distance between (2, 5) and (14, 10). Each unit = 1 mile.','13'),(8,'Find the distance between (0, 0) and (7, 24).','25'),
   (9,'Find the distance between (1, 1) and (5, 4). Triangle A(1,1) B(5,1) C(5,4). Find AC.','5'),(10,'Find the distance between (0, 0) and (6, 8). P(0,0), Q(6,0), R(6,8). Find PR.','10')]),
]
ALT={('5.4',1):['7.2','√52','2√13'],('5.4',2):['4.5','√20','2√5'],('5.3',3):['127.3','127.28']}
secs=[]
for title,std,hint,probs in S:
    sec=title[:3]; out=[]
    for n,q,a in probs:
        it={'n':n,'q':q,'ans':a}
        if (sec,n) in ALT: it['alt']=ALT[(sec,n)]
        if (sec,n) in figs: it['fig'],it['size']=crop((sec,n),f'Unit5_PP_{sec.replace(".","")}_{n}.png')
        else: print('NO FIG',sec,n)
        out.append(it)
    secs.append({'title':title,'std':std,'hint':hint,'probs':out})
data={'title':'Unit 5: The Pythagorean Theorem — Practice Problems','sub':'All four sections · 5.1 Intro · 5.2 Converse · 5.3 Word Problems · 5.4 Coordinate Plane','qlabel':'Q','secs':secs}
sets=json.load(open('/tmp/claude-0/-home-claude/71df80c8-d29a-5b9a-96ce-5a924999e656/scratchpad/prac2/sets.json'))
sets['Unit5_Practice_Problems']={'unit':'5','pdf':PDF,'data':data}
json.dump(sets,open('/tmp/claude-0/-home-claude/71df80c8-d29a-5b9a-96ce-5a924999e656/scratchpad/prac2/sets.json','w'),ensure_ascii=False,indent=1)
print(len(figs),sum(len(s['probs']) for s in secs))
