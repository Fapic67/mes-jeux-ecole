#!/usr/bin/env python3
"""Images Fluent Emoji 3D (Microsoft, licence MIT, paquet npm @lobehub/fluent-emoji-3d) pour les mots
qu'un emoji représente très bien. Les autres mots sont faits avec Gemini (outils/gemini-images.md).
Usage : python3 outils/fluent.py   (télécharge le paquet avec npm pack, écrit jeux/img/de/<slug>.webp,
puis lance outils/images.py sans argument pour mettre à jour DE_IMG et sw.js).
Une image Gemini déjà présente n'est jamais écrasée (liste outils/gemini-faits.txt)."""
import os,subprocess,tempfile,glob
from PIL import Image
R=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# mot -> emoji (plusieurs emoji = images côte à côte)
F={
"Apfel":"🍎","Schulranzen":"🎒","Idee":"💡","Bleistift":"✏️","richtig":"✅","singen":"🎤","Brot":"🍞","rot":"🔴","Orangensaft":"🧃","Ohr":"👂",
"Lineal":"📏","lesen":"📖","lachen":"😂","Ball":"⚽","Lied":"🎵","lila":"🟣","Regen":"🌧️","rutschen":"🛝","braun":"🟤",
"Kiste":"📦","Bus":"🚌","Kürbis":"🎃","Blume":"🌸","Uhr":"🕐","Schule":"🏫","gut":"👍","Maus":"🐭","malen":"🎨","Musik":"🎶","Ampel":"🚦","schwimmen":"🏊",
"Traube":"🍇","leuchten":"🔦","bunt":"🌈","Nase":"👃","Mantel":"🧥","brennen":"🔥","neun":"9️⃣","weiß":"⚪","Winter":"❄️","schwarz":"⚫",
"Kerze":"🕯️","Korb":"🧺","kalt":"🥶","Keks":"🍪","Kind":"🧒","trinken":"🥤","Pinsel":"🖌️","Baum":"🌳","Tannenbaum":"🎄","Butter":"🧈","Gabel":"🍴","blau":"🔵",
"Dose":"🥫","denken":"🤔","Vogel":"🐦","Vögel":"🐦🐦","Viereck":"🟧","voll":"🔋","böse":"😠","Haus":"🏠","Hand":"✋","Hamster":"🐹",
"Kinder":"👧👦","Kleider":"👗","Maler":"🧑‍🎨","Schnee":"🌨️","Ei":"🥚","zwei":"2️⃣","Zeitung":"📰","tanzen":"💃","klein":"🤏",
"Küken":"🐤","Hände":"🙌","Häslein":"🐇","Füße":"👣","sieben":"7️⃣","rechts":"➡️","Biene":"🐝","Milch":"🥛","Ziege":"🐐","fliegen":"✈️",
"Bohne":"🫘","froh":"😊","Möhre":"🥕","Kuh":"🐄","Hahn":"🐓","Buch":"📕","Auge":"👁️","laut":"📢","Mauer":"🧱",
"Koffer":"🧳","Brunnen":"⛲","schnell":"🏃","sonnig":"🌞","Hexe":"🧙‍♀️","sechs":"6️⃣","links":"⬅️","Wachsmalkreide":"🖍️",
"Spinne":"🕷️","springen":"🤸","Stamm":"🪵","Besen":"🧹","Pause":"⏸️","Fahne":"🇩🇪","Europa":"🇪🇺","Häuser":"🏘️","Bäume":"🌳🌳",
"jubeln":"🥳","Kajak":"🛶","Jahr":"📅","gelb":"🟡","Mond":"🌕","Preis":"🏆","Berg":"⛰️","Glas":"🍷",
"Süßigkeit":"🍬","Strauß":"💐","Feder":"🪶","Tasse":"☕","Giraffe":"🦒",
"Pferd":"🐎","zwölf":"1️⃣2️⃣","Katze":"🐈","Dreieck":"🔺","angeln":"🎣","Anker":"⚓","Mäuse":"🐁🐁",
}
# « Lerne neue Wörter » (leçon 100)
F.update({"Mama":"👩","Papa":"👨","Oma":"👵","Opa":"👴","Familie":"👨‍👩‍👧","Mund":"👄","Zahn":"🦷","Bein":"🦵","Finger":"☝️","Herz":"❤️","Hund":"🐕","Fisch":"🐟","Schwein":"🐖","Schaf":"🐑","Ente":"🦆","Löwe":"🦁","Elefant":"🐘","Affe":"🐒","Bär":"🐻","Schlange":"🐍","Frosch":"🐸","Schmetterling":"🦋","Schnecke":"🐌","Tiger":"🐅","Zebra":"🦓","Krokodil":"🐊","Eule":"🦉","Igel":"🦔","Fuchs":"🦊","Wolf":"🐺","Huhn":"🐔","Kamel":"🐪","Känguru":"🦘","Panda":"🐼","Eichhörnchen":"🐿️","Marienkäfer":"🐞","Ameise":"🐜","Papagei":"🦜","Dinosaurier":"🦕","Einhorn":"🦄","Banane":"🍌","Birne":"🍐","Erdbeere":"🍓","Kirsche":"🍒","Zitrone":"🍋","Tomate":"🍅","Kartoffel":"🥔","Käse":"🧀","Kuchen":"🍰","Eis":"🍦","Wasser":"💧","Tee":"🍵","Schokolade":"🍫","Honig":"🍯","Nudeln":"🍝","Pizza":"🍕","Suppe":"🍲","Salat":"🥗","Ananas":"🍍","Melone":"🍉","Pilz":"🍄","Gurke":"🥒","Zwiebel":"🧅","Mais":"🌽","Pfannkuchen":"🥞","Pommes":"🍟","Kokosnuss":"🥥","Kiwi":"🥝","Brokkoli":"🥦","Salz":"🧂","Hose":"👖","T-Shirt":"👕","Schuh":"👟","Stiefel":"👢","Mütze":"🧢","Hut":"👒","Socke":"🧦","Schal":"🧣","Handschuh":"🧤","Brille":"👓","Krone":"👑","Ring":"💍","Tür":"🚪","Fenster":"🪟","Bett":"🛏️","Stuhl":"🪑","Sofa":"🛋️","Toilette":"🚽","Badewanne":"🛁","Dusche":"🚿","Schlüssel":"🔑","Telefon":"☎️","Handy":"📱","Fernseher":"📺","Computer":"💻","Löffel":"🥄","Messer":"🔪","Spiegel":"🪞","Zahnbürste":"🪥","Wecker":"⏰","Bild":"🖼️","Geschenk":"🎁","Luftballon":"🎈","Würfel":"🎲","Puzzle":"🧩","Drachen":"🪁","Roboter":"🤖","Geburtstag":"🎂","Weihnachtsmann":"🎅","Gespenst":"👻","Auto":"🚗","Fahrrad":"🚲","Zug":"🚂","Flugzeug":"✈️","Schiff":"🚢","Boot":"⛵","Rakete":"🚀","Traktor":"🚜","Motorrad":"🏍️","Hubschrauber":"🚁","Polizeiauto":"🚓","Feuerwehrauto":"🚒","Krankenwagen":"🚑","Roller":"🛴","Taxi":"🚕","Sonne":"☀️","Stern":"⭐","Blitz":"⚡","Meer":"🌊","Insel":"🏝️","Stein":"🪨","Blatt":"🍁","Vulkan":"🌋","Kaktus":"🌵","Rose":"🌹","Sonnenblume":"🌻","Tulpe":"🌷","Kleeblatt":"🍀","Erde":"🌍","Lehrer":"👨‍🏫","Lehrerin":"👩‍🏫","Arzt":"👨‍⚕️","Ärztin":"👩‍⚕️","Polizist":"👮","Koch":"👨‍🍳","Feuerwehrmann":"🧑‍🚒","Bauer":"🧑‍🌾","König":"🤴","Prinzessin":"👸","null":"0️⃣","eins":"1️⃣","drei":"3️⃣","vier":"4️⃣","fünf":"5️⃣","acht":"8️⃣","zehn":"🔟","grün":"🟢","orange":"🟠","essen":"🍽️","schlafen":"😴","weinen":"😭","schreiben":"✍️","sehen":"👀","kaufen":"🛒","klettern":"🧗","umarmen":"🤗","winken":"👋","heiß":"🥵","müde":"🥱","traurig":"😢","krank":"🤒"})
def slug(w):return w.replace("ä","ae").replace("ö","oe").replace("ü","ue").replace("Ä","Ae").replace("Ö","Oe").replace("Ü","Ue").replace("ß","ss")
def split(e):  # découpe une suite d'emoji en emoji (ZWJ, sélecteurs, keycaps, drapeaux)
    out=[];cur=""
    i=0;cs=list(e)
    while i<len(cs):
        c=cs[i];cur+=c;i+=1
        while i<len(cs) and (cs[i] in "️⃣" or cs[i]=="‍" or (cur.endswith("‍"))):
            cur+=cs[i];i+=1
        if 0x1F1E6<=ord(c)<=0x1F1FF and i<len(cs) and 0x1F1E6<=ord(cs[i])<=0x1F1FF and len(cur)==1:
            cur+=cs[i];i+=1
        out.append(cur);cur=""
    return out
def find(A,e):
    cps=[ "%x"%ord(c) for c in e]
    for v in ("-".join(cps),"-".join(x for x in cps if x!="fe0f")):
        p=os.path.join(A,v+".webp")
        if os.path.exists(p):return p
    print("introuvable : %s %s"%(e,cps));return None
t=tempfile.mkdtemp();subprocess.check_call(["npm","pack","@lobehub/fluent-emoji-3d@1.1.0"],cwd=t,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
subprocess.check_call("tar xzf *.tgz",shell=True,cwd=t);A=os.path.join(t,"package/assets")
D=os.path.join(R,"jeux/img/de");os.makedirs(D,exist_ok=True)
gem=set(open(os.path.join(R,"outils/gemini-faits.txt")).read().split()) if os.path.exists(os.path.join(R,"outils/gemini-faits.txt")) else set()
for w,e in F.items():
    if w in gem:continue
    ps=[find(A,x) for x in split(e)]
    if None in ps:continue
    parts=[Image.open(p).convert("RGBA") for p in ps]
    if len(parts)==1:im=parts[0].resize((256,256),Image.LANCZOS)
    else:
        n=len(parts);s=int(256/n*1.15);im=Image.new("RGBA",(256,256),(0,0,0,0))
        for k,p in enumerate(parts):
            p=p.resize((s,s),Image.LANCZOS);x=int(k*(256-s)/(n-1));im.paste(p,(x,(256-s)//2+(k%2)*12-6),p)
    im.save(os.path.join(D,slug(w)+".webp"),"WEBP",quality=82,method=6)
print(len(F),"images Fluent")
subprocess.check_call(["python3",os.path.join(R,"outils/images.py")])
