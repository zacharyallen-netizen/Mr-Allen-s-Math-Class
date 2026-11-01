# side-by-side: before (visual+answers) | after (visual only), cropped to the visual box
import sys, json
from PIL import Image
tag=sys.argv[1]; boxes=json.load(open(f'boxes_{tag}.json'))
for n in range(1,46):
    k=str(n)
    if k not in boxes: continue
    a=Image.open(f'shots/{tag}_q{n:02d}_a_before.png'); b=Image.open(f'shots/{tag}_q{n:02d}_b_after.png')
    top,bot=boxes[k]['a']; ta,ba=boxes[k]['b']
    a=a.crop((0,max(0,top-10),a.width,min(a.height,bot+10))); b=b.crop((0,max(0,ta-10),b.width,min(b.height,ba+10)))
    h=max(a.height,b.height); im=Image.new('RGB',(a.width+b.width+20,h),'white')
    im.paste(a,(0,0)); im.paste(b,(a.width+20,0)); im.save(f'shots/{tag}_v{n:02d}.png')
