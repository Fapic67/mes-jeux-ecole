# Découpe une planche détourée (fond transparent) : python3 outils/decoupe.py planche.png dossier [colonnes lignes] → 00.png …
# Chaque dessin = composantes connexes (taches assez grandes) rattachées à la case de leur centre : un dessin qui déborde reste entier,
# les traits fins (fil de pêche) sont gardés, les petits parasites de faible taille sont retirés.
import sys,numpy as np
from PIL import Image,ImageFilter
from collections import deque
src,out=sys.argv[1],sys.argv[2]
C=int(sys.argv[3]) if len(sys.argv)>3 else 5;R=int(sys.argv[4]) if len(sys.argv)>4 else 5  # colonnes, lignes
im=Image.open(src).convert('RGBA');A=np.array(im);A[...,3]=np.where(A[...,3]<40,0,A[...,3])
S=2;sm=Image.fromarray(A[...,3]).resize((im.width//S,im.height//S),Image.BOX)
M=np.array(sm)>100;H,W=M.shape;lab=np.zeros((H,W),np.int32);n=0;size={}
for y in range(H):
  for x in range(W):
    if M[y,x] and not lab[y,x]:
      n+=1;q=deque([(y,x)]);lab[y,x]=n;c=0
      while q:
        cy,cx=q.popleft();c+=1
        for dy in(-1,0,1):
          for dx in(-1,0,1):
            ny,nx=cy+dy,cx+dx
            if 0<=ny<H and 0<=nx<W and M[ny,nx] and not lab[ny,nx]:lab[ny,nx]=n;q.append((ny,nx))
      size[n]=c
cells={}
for k in range(1,n+1):
  if size[k]<80:continue
  ys,xs=np.nonzero(lab==k)
  c=min(C-1,int(xs.mean()/(W/C)));r=min(R-1,int(ys.mean()/(H/R)));cells.setdefault(r*C+c,[]).append(k)
for i in range(C*R):
  sel=Image.fromarray((np.isin(lab,cells.get(i,[]))*255).astype('uint8')).filter(ImageFilter.MaxFilter(3))
  big=np.array(sel.resize((im.width,im.height),Image.NEAREST))>0
  B=A.copy();B[...,3]=np.where(big,B[...,3],0)
  t=Image.fromarray(B);t.crop(t.getchannel('A').getbbox()).save('%s/%02d.png'%(out,i))
print(sum(1 for k in size if size[k]>=80),"dessins/morceaux,",sum(1 for k in size if size[k]<80),"parasites retirés, cases :",len(cells))
