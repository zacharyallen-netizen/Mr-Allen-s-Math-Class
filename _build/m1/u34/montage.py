import sys,os,glob
from PIL import Image,ImageDraw
d=sys.argv[1]; fs=sorted(glob.glob(d+'/*.png')); cols=3; W=330
ims=[(os.path.basename(f),Image.open(f)) for f in fs]
pages=[];cur=[];h=0
rows=[ims[i:i+cols] for i in range(0,len(ims),cols)]
sheet=[];acc=[];ah=0
for r in rows:
    rh=max(im.height for _,im in r)+16
    if ah+rh>1900 and acc: sheet.append(acc);acc=[];ah=0
    acc.append(r);ah+=rh
if acc: sheet.append(acc)
for si,rs in enumerate(sheet):
    H=sum(max(im.height for _,im in r)+16 for r in rs)
    out=Image.new('RGB',(W*cols,H),'white');dr=ImageDraw.Draw(out);y=0
    for r in rs:
        for ci,(n,im) in enumerate(r):
            dr.text((ci*W+2,y),n,fill=(200,0,0)); out.paste(im,(ci*W,y+14))
        y+=max(im.height for _,im in r)+16
    out.save(f'{d}_sheet{si}.png'); print(f'{d}_sheet{si}.png',out.size)
