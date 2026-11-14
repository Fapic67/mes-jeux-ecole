// Vocabulaire allemand rangé comme le manuel de CP « Die Rappelkiste » : périodes → modules → leçons (une lettre).
// Seuls les mots des encadrés de vocabulaire sont repris (pas les images ni les textes du livre).
// Leçons 15 à 32 : pour l'instant seulement les mots référents du sommaire, en attendant les pages.
// Images : emoji, ou dessin maison (PIC dans deutsch.html) quand le champ est vide.
var DE_MODULES=[
 {p:1,m:"1a",t:"Die Einschulung",f:"La rentrée des classes",l:[1,2]},
 {p:1,m:"1b",t:"Das Pausenbrot",f:"Le goûter",l:[3,4,5]},
 {p:1,m:"2",t:"Der Schultag",f:"La journée de classe",l:[6,7,8]},
 {p:2,m:"3",t:"Der Laternenumzug",f:"Le défilé aux lanternes",l:[9,10]},
 {p:2,m:"4",t:"Der Nikolaustag",f:"La Saint-Nicolas",l:[11,12]},
 {p:2,m:"5",t:"Plätzchen backen",f:"Confectionner des gâteaux",l:[13,14]},
 {p:3,m:"6",t:"Die Freundschaft",f:"L'amitié",l:[15,16,17]},
 {p:3,m:"7",t:"Der Karneval",f:"Le carnaval",l:[18,19]},
 {p:4,m:"8",t:"Eier suchen",f:"La chasse aux œufs",l:[20,21,22]},
 {p:4,m:"9",t:"Auf dem Bauernhof",f:"À la ferme",l:[23,24]},
 {p:5,m:"10",t:"Die Walpurgisnacht",f:"La nuit des sorcières",l:[25,26,27]},
 {p:5,m:"11",t:"Die Partnerklasse",f:"Les correspondants",l:[28,29,30]},
 {p:5,m:"12",t:"Die Bundesjugendspiele",f:"La rencontre sportive",l:[31,32]}
];
// Lettre(s) travaillée(s) dans chaque leçon
var DE_LETTERS={1:"A",2:"I",3:"O",4:"L",5:"R",6:"S",7:"U",8:"M",9:"T",10:"N",11:"W",12:"K",13:"P",14:"B",15:"D & E",16:"V & Ö",17:"H",18:"-ER",19:"SCH",20:"EI & Z",21:"Ä & Ü",22:"-CH & IE",23:"voyelle longue + h",24:"-CH & AU",25:"ATT, ESS, IMM…",26:"X, CHS, KS, CKS",27:"SP & ST",28:"S",29:"EU",30:"J",31:"consonne finale dure",32:"ß"};
// leçon|article|mot|image
var DE_RAW=[
 "1|der|Apfel|🍎","1|die|Tafel|","1|der|Schulranzen|🎒","1|die|Klasse|","1|der|Radiergummi|","1||arbeiten|📝",
 "2|die|Idee|💡","2|der|Tisch|","2|der|Spitzer|","2|der|Bleistift|✏️","2||richtig|✅","2||singen|🎤",
 "3|das|Obst|","3|der|Schulhof|","3|das|Brot|🍞","3||rot|🔴","3|der|Orangensaft|🧃","3|das|Ohr|👂",
 "4|das|Lineal|📏","4||lesen|📖","4||lachen|😂","4|der|Ball|⚽","4|das|Lied|🎵","4||lila|🟣",
 "5|der|Regen|🌧️","5||rutschen|🛝","5|die|Reihe|","5||braun|🟤","5||riechen|👃💐","5|der|Freund|👦","5|die|Freundin|👧",
 "6|das|Gras|🌱","6||basteln|✂️","6||raus|🚪🏃","6|die|Kiste|📦","6|der|Bus|🚌","6|der|Kürbis|🎃",
 "7|die|Blume|🌸","7|die|Uhr|🕐","7||suchen|🔍","7||pusten|🌬️","7|die|Schule|🏫","7||gut|👍",
 "8|die|Maus|🐭","8||malen|🎨","8|die|Musik|🎶","8|die|Ampel|🚦","8|das|Mäppchen|","8||schwimmen|🏊",
 "9|die|Traube|🍇","9|die|Laterne|🏮","9||leuchten|🔦","9||teilen|🤝","9||falten|📄","9||bunt|🌈",
 "10|die|Nase|👃","10|die|Gans|","10|der|Mantel|🧥","10|der|Nebel|🌫️","10||brennen|🔥","10||neun|9️⃣",
 "11|der|Wald|🌲","11||weiß|⚪","11||warm|☀️","11||wünschen|🎁","11|der|Winter|❄️","11||schwarz|⚫",
 "12|die|Kerze|🕯️","12|der|Korb|🧺","12||kalt|🥶","12|der|Keks|🍪","12|das|Kind|🧒","12||trinken|🥤",
 "13|die|Puppe|🪆","13|der|Pinsel|🖌️","13|das|Rezept|📃","13||klopfen|✊🚪","13|das|Spritzgebäck|","13|die|Aprikose|🍑",
 "14|der|Baum|🌳","14|der|Tannenbaum|🎄","14|die|Butter|🧈","14|die|Gabel|🍴","14||backen|🧑‍🍳","14||blau|🔵",
 "15|die|Dose|🥫",
 "16|der|Vogel|🐦",
 "17|das|Haus|🏠",
 "18|die|Kinder|👧👦",
 "19|der|Schüler|","19|die|Schülerin|",
 "20|das|Ei|🥚","20||zwei|2️⃣",
 "21|das|Küken|🐤",
 "22||ich|","22||sieben|7️⃣",
 "23|die|Bohne|🫘","23|der|Zeh|",
 "24|das|Buch|📕","24|das|Auge|👁️",
 "25|der|Kessel|","25|der|Koffer|🧳",
 "26|die|Hexe|🧙‍♀️","26||sechs|6️⃣","26||links|⬅️","26|der|Klecks|",
 "27|die|Spinne|🕷️","27||stampfen|",
 "28|der|Besen|🧹",
 "29|die|Fahne|🇩🇪",
 "30|die|Jacke|",
 "31||gelb|🟡","31|der|Mond|🌙","31|der|Weg|🛤️","31|der|Preis|🏆",
 "32|der|Fuß|🦶"
];
// Dessins maison partagés par tous les jeux (quand un seul emoji ne suffit pas) : taille = 1,3em (comme un emoji)
var DE_SVG={
 // Obst = les fruits : une corbeille de fruits (banane, raisin, pomme, orange)
 "Obst":'<svg class="desvg" viewBox="0 0 100 100" width="1.3em" height="1.3em" style="vertical-align:-.25em"><path d="M20 47C22 30 36 18 58 17c2 0 3 2 1 3-14 4-23 13-27 27z" fill="#ffd23f" stroke="#d4a900" stroke-width="2" stroke-linejoin="round"/><g fill="#8e44ad"><circle cx="27" cy="44" r="6"/><circle cx="36" cy="41" r="6"/><circle cx="31" cy="35" r="6"/><circle cx="40" cy="33" r="5"/></g><path d="M35 29l3-6" stroke="#3a7d2c" stroke-width="2.5" stroke-linecap="round"/><circle cx="74" cy="43" r="11" fill="#ff9f1a"/><circle cx="71" cy="39" r="2.5" fill="#fff" opacity=".4"/><circle cx="55" cy="42" r="13" fill="#e5484d"/><circle cx="50" cy="37" r="3" fill="#fff" opacity=".4"/><path d="M55 30q1-6 4-8" stroke="#6b3e1f" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M58 27q8-6 12 0q-7 4-12 0z" fill="#3fae49"/><path d="M14 52h72l-8 34q-28 7-56 0z" fill="#c48a4a"/><path d="M17 64h66M19 75h62" stroke="#8b5a2b" stroke-width="2.5"/><path d="M32 54l3 34M50 54v35M68 54l-3 34" stroke="#8b5a2b" stroke-width="2.5"/><rect x="10" y="47" width="80" height="9" rx="4.5" fill="#9a6331"/></svg>'
};
var DE_WORDS=DE_RAW.map(function(s){var p=s.split("|");return{n:+p[0],a:p[1],w:p[2],e:p[3]||DE_SVG[p[2]]||""}});
var DE_DEFAULT=[1,2,3,4,5,6,7,8,9,10]; // leçons cochées par défaut (les mots de l'ancienne liste)
// Leçons cochées pour un jeu ("dde" = Der · Die · Das, "fdw" = Finde das Wort) et un profil
function deSelected(game,pid){try{var v=JSON.parse(localStorage.getItem("de_sel_"+game+"@"+(pid||"p1")));if(Array.isArray(v))return v}catch(e){}return DE_DEFAULT.slice()}
function deSave(game,pid,list){try{localStorage.setItem("de_sel_"+game+"@"+(pid||"p1"),JSON.stringify(list))}catch(e){}}
// Mots « qu'on peut acheter » pour la Liste des courses (noms avec article et image)
var DE_BUY=["Apfel","Brot","Orangensaft","Traube","Butter","Keks","Kerze","Ball","Bleistift","Puppe","Pinsel","Lineal","Korb","Blume","Aprikose","Dose","Ei","Buch","Koffer","Besen","Mantel","Schulranzen","Kürbis","Laterne","Uhr","Gabel","Kiste","Obst","Tannenbaum"];
