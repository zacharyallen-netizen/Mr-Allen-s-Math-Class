import sys,glob
from PIL import Image
# usage: sheet.py out.png img1 img2 ...
ims=[Image.open(f).convert('RGB') for f in sys.argv[2:]]
w=sum(i.width for i in ims)+10*len(ims); h=max(i.height for i in ims)
c=Image.new('RGB',(w,h),(120,120,120)); x=0
for i in ims: c.paste(i,(x,0)); x+=i.width+10
c.save(sys.argv[1])
