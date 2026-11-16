# Découpe une planche détourée (fond transparent) 5×5 : python3 outils/decoupe.py planche.png dossier → 00.png … 24.png
# Parasites de faible opacité retirés ; chaque dessin = composantes connexes rattachées à la case de leur centre (un dessin qui déborde reste entier).
import sys,numpy as np
from PIL import Image,ImageFilter,ImageChops
from collections import deque
src,out=sys.argv[1],sys.argv[2]
im=Image.open(src).convert('RGBA');a=im.getchannel('A')
m=a.point(lambda v:255 if v>160 else 0).filter(ImageFilter.MinFilter(7)).filter(ImageFilter.MaxFilter(25))
a2=ImageChops.multiply(a,m).point(lambda v:0 if v<40 else v);im.putalpha(a2)
S=4;sm=a2.resize((a2.width//S,a2.height//S),Image.BOX).point(lambda v:255 if v>60 else 0)
M=np.array(sm)>0;H,W=M.shape;lab=np.zeros((H,W),int);n=0
for y in range(H):
  for x in range(W):
    if M[y,x] and not lab[y,x]:
      n+=1;q=deque([(y,x)]);lab[y,x]=n
      while q:
        cy,cx=q.popleft()
        for dy,dx in((1,0),(-1,0),(0,1),(0,-1)):
          ny,nx=cy+dy,cx+dx
          if 0<=ny<H and 0<=nx<W and M[ny,nx] and not lab[ny,nx]:lab[ny,nx]=n;q.append((ny,nx))
cells={}
for k in range(1,n+1):
  ys,xs=np.nonzero(lab==k)
  if len(ys)<15:continue
  c=min(4,int(xs.mean()/(W/5)));r=min(4,int(ys.mean()/(H/5)));cells.setdefault(r*5+c,[]).append(k)
A=np.array(im)
for i in range(25):
  ks=cells.get(i,[]);sel=np.isin(lab,ks)
  big=np.array(Image.fromarray((sel*255).astype('uint8')).resize((im.width,im.height),Image.NEAREST))>0
  B=A.copy();B[...,3]=np.where(big,B[...,3],0)
  t=Image.fromarray(B);bb=t.getchannel('A').getbbox();t.crop(bb).save('%s/%02d.png'%(out,i))
print(n,"composantes",sorted(cells))
