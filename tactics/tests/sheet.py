import sys, glob
from PIL import Image
d, out = sys.argv[1], sys.argv[2]
fs=sorted(glob.glob(d+'/*.png'))
ims=[Image.open(f) for f in fs]
w=ims[0].width; h=ims[0].height
cols=5; rows=(len(ims)+cols-1)//cols
c=Image.new('RGB',(w*cols,h*rows),'white')
for i,im in enumerate(ims): c.paste(im,((i%cols)*w,(i//cols)*h))
c=c.resize((c.width*2//3,c.height*2//3)); c.save(out); print(c.size)
