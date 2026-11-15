#!/usr/bin/env python3
"""Ajoute une image Gemini à un mot d'allemand.
Usage : python3 outils/images.py <image> <Mot> [<image> <Mot> ...]
- rogne le blanc autour, remet en carré avec une petite marge, réduit à 256 px, enregistre jeux/img/de/<slug>.webp
- met à jour la liste DE_IMG de jeux/allemand-mots.js et la liste des images de sw.js (hors-ligne)."""
import sys,os,re,glob,unicodedata
from PIL import Image,ImageChops
R=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
D=os.path.join(R,"jeux/img/de")
def slug(w):return w.replace("ä","ae").replace("ö","oe").replace("ü","ue").replace("Ä","Ae").replace("Ö","Oe").replace("Ü","Ue").replace("ß","ss")
def prep(src,dst):
    im=Image.open(src).convert("RGB")
    bg=Image.new("RGB",im.size,(255,255,255))
    diff=ImageChops.difference(im,bg).convert("L").point(lambda v:255 if v>18 else 0)
    box=diff.getbbox() or (0,0)+im.size
    im=im.crop(box);w,h=im.size;s=int(max(w,h)*1.06)
    sq=Image.new("RGB",(s,s),(255,255,255));sq.paste(im,((s-w)//2,(s-h)//2))
    sq.resize((256,256),Image.LANCZOS).save(dst,"WEBP",quality=80,method=6)
os.makedirs(D,exist_ok=True)
a=sys.argv[1:]
for i in range(0,len(a),2):
    prep(a[i],os.path.join(D,slug(a[i+1])+".webp"));print("ok",a[i+1],os.path.getsize(os.path.join(D,slug(a[i+1])+".webp")),"octets")
# mots qui ont une image : d'après les fichiers présents
js=os.path.join(R,"jeux/allemand-mots.js");s=open(js).read()
words=re.findall(r'"\d+\|[^|]*\|([^|]+)\|',s)
have=sorted(w for w in set(words) if os.path.exists(os.path.join(D,slug(w)+".webp")))
line="var DE_IMG=["+",".join('"%s"'%w for w in have)+"]; // mots illustrés par une image Gemini (jeux/img/de/<mot>.webp), prioritaires sur emoji et dessins"
s=re.sub(r"var DE_IMG=\[.*",line.replace("\\","\\\\"),s) if "var DE_IMG=[" in s else s.replace("var DE_WORDS=",line+"\nvar DE_WORDS=",1)
open(js,"w").write(s)
sw=os.path.join(R,"sw.js");t=open(sw).read()
lst="".join('  "jeux/img/de/%s.webp",\n'%slug(w) for w in have)
t=re.sub(r"  // images-de\n(.*?)  // /images-de\n","",t,flags=re.S)
t=t.replace('  "jeux/allemand-mots.js",\n','  "jeux/allemand-mots.js",\n  // images-de\n'+lst+'  // /images-de\n',1)
open(sw,"w").write(t)
print(len(have),"mots illustrés")
