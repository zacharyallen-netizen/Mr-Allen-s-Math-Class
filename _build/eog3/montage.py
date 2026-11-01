import sys
from PIL import Image
tag=sys.argv[1]; out=sys.argv[2]; ns=[int(x) for x in sys.argv[3].split(',')]
ims=[Image.open(f'shots/{tag}_v{n:02d}.png') for n in ns]
w=max(i.width for i in ims); h=sum(i.height for i in ims)+10*len(ims)
o=Image.new('RGB',(w,h),'white'); y=0
for i in ims: o.paste(i,(0,y)); y+=i.height+10
o.save(f'shots/{out}.png')
