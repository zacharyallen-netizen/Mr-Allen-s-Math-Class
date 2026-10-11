import sys
from PIL import Image
tag=sys.argv[1]
for n in range(1,46):
    a=Image.open(f'shots/{tag}_q{n:02d}_a_before.png'); b=Image.open(f'shots/{tag}_q{n:02d}_b_after.png')
    h=max(a.height,b.height); im=Image.new('RGB',(a.width+b.width+20,h),'white')
    im.paste(a,(0,0)); im.paste(b,(a.width+20,0)); im.save(f'shots/{tag}_pair{n:02d}.png')
